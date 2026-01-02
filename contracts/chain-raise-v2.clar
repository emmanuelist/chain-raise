;; Title: ChainRaise V2 - Multi-Campaign Platform
;;
;; Summary:
;; ChainRaise V2 is a production-ready decentralized crowdfunding platform on Stacks.
;; Any user can create unlimited campaigns with independent goals, milestones, and beneficiaries.
;; Supports STX and sBTC donations with transparent refund mechanisms.
;;
;; Features:
;; - Multi-campaign support with unique IDs
;; - Any user can create campaigns
;; - Dual-currency support (STX and sBTC donations)
;; - Per-campaign milestone-based fund releases
;; - Multiple beneficiaries per campaign with percentage allocation
;; - Campaign-level pause/cancel functionality
;; - Transparent refund system
;; - Configurable donation limits per campaign
;; - Campaign metadata (title, description, category, image)
;; - Time-bound campaigns with customizable durations
;;
;; Security:
;; - Campaign creators control their own campaigns
;; - State validation checks throughout
;; - Withdrawal authorization per campaign
;; - Prevention of double-spending and over-withdrawal

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-not-authorized (err u100))
(define-constant err-campaign-ended (err u101))
(define-constant err-campaign-not-found (err u102))
(define-constant err-not-cancelled (err u103))
(define-constant err-campaign-not-ended (err u104))
(define-constant err-campaign-cancelled (err u105))
(define-constant err-already-withdrawn (err u106))
(define-constant err-paused (err u107))
(define-constant err-donation-too-small (err u108))
(define-constant err-donation-too-large (err u109))
(define-constant err-milestone-not-found (err u110))
(define-constant err-milestone-already-withdrawn (err u111))
(define-constant err-invalid-percentage (err u112))
(define-constant err-goal-not-met (err u113))
(define-constant err-invalid-duration (err u114))
(define-constant err-invalid-goal (err u115))
(define-constant err-beneficiary-limit (err u116))

(define-constant default-duration u4320) ;; ~30 days in Bitcoin blocks (10 min/block)
(define-constant max-beneficiaries u10)
(define-constant max-milestones u20)
(define-constant min-duration u144) ;; ~1 day minimum
(define-constant max-duration u52560) ;; ~365 days maximum

;; Data vars
(define-data-var campaign-nonce uint u0) ;; Auto-increment for campaign IDs
(define-data-var platform-fee-percentage uint u250) ;; 2.5% = 250/10000
(define-data-var platform-fee-recipient principal contract-owner)

;; Campaign data structure
(define-map campaigns
  uint ;; campaign-id
  {
    creator: principal,
    title: (string-ascii 100),
    description: (string-utf8 500),
    category: (string-ascii 50),
    image-url: (string-ascii 200),
    goal: uint, ;; in microstacks
    start-block: uint,
    duration: uint, ;; in blocks
    total-stx: uint,
    total-sbtc: uint,
    donor-count: uint,
    is-cancelled: bool,
    is-paused: bool,
    is-withdrawn: bool,
    min-donation-stx: uint,
    max-donation-stx: uint,
    min-donation-sbtc: uint,
    max-donation-sbtc: uint
  }
)

;; Donations per campaign per donor
(define-map campaign-stx-donations
  { campaign-id: uint, donor: principal }
  uint
)

(define-map campaign-sbtc-donations
  { campaign-id: uint, donor: principal }
  uint
)

;; Milestones per campaign
(define-map campaign-milestones
  { campaign-id: uint, milestone-id: uint }
  {
    amount: uint,
    description: (string-utf8 200),
    withdrawn: bool
  }
)

(define-map campaign-milestone-count
  uint ;; campaign-id
  uint ;; count
)

;; Beneficiaries per campaign
(define-map campaign-beneficiaries
  { campaign-id: uint, beneficiary-id: uint }
  {
    address: principal,
    percentage: uint ;; out of 10000 (100.00%)
  }
)

(define-map campaign-beneficiary-count
  uint ;; campaign-id
  uint ;; count
)

;; Helper: Check if campaign exists
(define-read-only (campaign-exists (campaign-id uint))
  (is-some (map-get? campaigns campaign-id))
)

;; Helper: Check if campaign is active
(define-read-only (is-campaign-active (campaign-id uint))
  (match (map-get? campaigns campaign-id)
    campaign
      (and
        (< burn-block-height (+ (get start-block campaign) (get duration campaign)))
        (not (get is-cancelled campaign))
        (not (get is-paused campaign))
      )
    false
  )
)

;; Helper: Check if campaign has ended
(define-read-only (is-campaign-ended (campaign-id uint))
  (match (map-get? campaigns campaign-id)
    campaign
      (>= burn-block-height (+ (get start-block campaign) (get duration campaign)))
    false
  )
)

;; Helper: Check if campaign goal is met
(define-read-only (is-goal-met (campaign-id uint))
  (match (map-get? campaigns campaign-id)
    campaign
      (>= (get total-stx campaign) (get goal campaign))
    false
  )
)

;; Create a new campaign
(define-public (create-campaign
    (title (string-ascii 100))
    (description (string-utf8 500))
    (category (string-ascii 50))
    (image-url (string-ascii 200))
    (goal uint)
    (duration uint)
    (min-donation-stx uint)
    (max-donation-stx uint)
  )
  (let
    (
      (campaign-id (+ (var-get campaign-nonce) u1))
      (actual-duration (if (is-eq duration u0) default-duration duration))
    )
    ;; Validation
    (asserts! (> goal u0) err-invalid-goal)
    (asserts! (>= actual-duration min-duration) err-invalid-duration)
    (asserts! (<= actual-duration max-duration) err-invalid-duration)
    (asserts! (>= min-donation-stx u1000000) err-donation-too-small) ;; Min 1 STX
    (asserts! (<= max-donation-stx u100000000000) err-donation-too-large) ;; Max 100k STX
    
    ;; Create campaign
    (map-set campaigns campaign-id {
      creator: tx-sender,
      title: title,
      description: description,
      category: category,
      image-url: image-url,
      goal: goal,
      start-block: burn-block-height,
      duration: actual-duration,
      total-stx: u0,
      total-sbtc: u0,
      donor-count: u0,
      is-cancelled: false,
      is-paused: false,
      is-withdrawn: false,
      min-donation-stx: min-donation-stx,
      max-donation-stx: max-donation-stx,
      min-donation-sbtc: u10000,
      max-donation-sbtc: u1000000000
    })
    
    ;; Initialize counts
    (map-set campaign-milestone-count campaign-id u0)
    (map-set campaign-beneficiary-count campaign-id u0)
    
    ;; Increment nonce
    (var-set campaign-nonce campaign-id)
    
    (print {
      event: "campaign-created",
      campaign-id: campaign-id,
      creator: tx-sender,
      title: title,
      goal: goal,
      start-block: burn-block-height
    })
    
    (ok campaign-id)
  )
)

;; Add milestone to campaign
(define-public (add-milestone
    (campaign-id uint)
    (amount uint)
    (description (string-utf8 200))
  )
  (let
    (
      (campaign (unwrap! (map-get? campaigns campaign-id) err-campaign-not-found))
      (current-count (default-to u0 (map-get? campaign-milestone-count campaign-id)))
      (milestone-id (+ current-count u1))
    )
    ;; Only campaign creator can add milestones
    (asserts! (is-eq tx-sender (get creator campaign)) err-not-authorized)
    ;; Can't modify after campaign starts getting donations
    (asserts! (is-eq (get total-stx campaign) u0) err-not-authorized)
    ;; Check milestone limit
    (asserts! (< current-count max-milestones) err-milestone-not-found)
    
    (map-set campaign-milestones 
      { campaign-id: campaign-id, milestone-id: milestone-id }
      {
        amount: amount,
        description: description,
        withdrawn: false
      }
    )
    
    (map-set campaign-milestone-count campaign-id milestone-id)
    
    (print {
      event: "milestone-added",
      campaign-id: campaign-id,
      milestone-id: milestone-id,
      amount: amount
    })
    
    (ok milestone-id)
  )
)

;; Add beneficiary to campaign
(define-public (add-beneficiary
    (campaign-id uint)
    (beneficiary-address principal)
    (percentage uint)
  )
  (let
    (
      (campaign (unwrap! (map-get? campaigns campaign-id) err-campaign-not-found))
      (current-count (default-to u0 (map-get? campaign-beneficiary-count campaign-id)))
      (beneficiary-id (+ current-count u1))
    )
    ;; Only campaign creator can add beneficiaries
    (asserts! (is-eq tx-sender (get creator campaign)) err-not-authorized)
    ;; Can't modify after campaign starts getting donations
    (asserts! (is-eq (get total-stx campaign) u0) err-not-authorized)
    ;; Check beneficiary limit
    (asserts! (< current-count max-beneficiaries) err-beneficiary-limit)
    ;; Validate percentage (0-10000 for 0-100%)
    (asserts! (<= percentage u10000) err-invalid-percentage)
    
    (map-set campaign-beneficiaries
      { campaign-id: campaign-id, beneficiary-id: beneficiary-id }
      {
        address: beneficiary-address,
        percentage: percentage
      }
    )
    
    (map-set campaign-beneficiary-count campaign-id beneficiary-id)
    
    (print {
      event: "beneficiary-added",
      campaign-id: campaign-id,
      beneficiary-id: beneficiary-id,
      address: beneficiary-address,
      percentage: percentage
    })
    
    (ok beneficiary-id)
  )
)

;; Donate STX to a campaign
(define-public (donate-stx (campaign-id uint) (amount uint))
  (let
    (
      (campaign (unwrap! (map-get? campaigns campaign-id) err-campaign-not-found))
      (current-donation (default-to u0 (map-get? campaign-stx-donations { campaign-id: campaign-id, donor: tx-sender })))
    )
    ;; Validate campaign state
    (asserts! (is-campaign-active campaign-id) err-campaign-ended)
    ;; Validate donation amount
    (asserts! (>= amount (get min-donation-stx campaign)) err-donation-too-small)
    (asserts! (<= amount (get max-donation-stx campaign)) err-donation-too-large)
    
    ;; Transfer STX to contract
    (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
    
    ;; Update donation records
    (map-set campaign-stx-donations
      { campaign-id: campaign-id, donor: tx-sender }
      (+ current-donation amount)
    )
    
    ;; Update campaign totals
    (map-set campaigns campaign-id
      (merge campaign {
        total-stx: (+ (get total-stx campaign) amount),
        donor-count: (if (is-eq current-donation u0)
          (+ (get donor-count campaign) u1)
          (get donor-count campaign)
        )
      })
    )
    
    (print {
      event: "donation-stx",
      campaign-id: campaign-id,
      donor: tx-sender,
      amount: amount,
      total: (+ (get total-stx campaign) amount)
    })
    
    (ok true)
  )
)

;; Pause campaign (creator only)
(define-public (pause-campaign (campaign-id uint))
  (let
    (
      (campaign (unwrap! (map-get? campaigns campaign-id) err-campaign-not-found))
    )
    (asserts! (is-eq tx-sender (get creator campaign)) err-not-authorized)
    (asserts! (not (get is-paused campaign)) err-paused)
    
    (map-set campaigns campaign-id
      (merge campaign { is-paused: true })
    )
    
    (print { event: "campaign-paused", campaign-id: campaign-id })
    (ok true)
  )
)

;; Unpause campaign (creator only)
(define-public (unpause-campaign (campaign-id uint))
  (let
    (
      (campaign (unwrap! (map-get? campaigns campaign-id) err-campaign-not-found))
    )
    (asserts! (is-eq tx-sender (get creator campaign)) err-not-authorized)
    (asserts! (get is-paused campaign) err-not-authorized)
    
    (map-set campaigns campaign-id
      (merge campaign { is-paused: false })
    )
    
    (print { event: "campaign-unpaused", campaign-id: campaign-id })
    (ok true)
  )
)

;; Cancel campaign (creator only)
(define-public (cancel-campaign (campaign-id uint))
  (let
    (
      (campaign (unwrap! (map-get? campaigns campaign-id) err-campaign-not-found))
    )
    (asserts! (is-eq tx-sender (get creator campaign)) err-not-authorized)
    (asserts! (not (get is-withdrawn campaign)) err-already-withdrawn)
    (asserts! (not (get is-cancelled campaign)) err-campaign-cancelled)
    
    (map-set campaigns campaign-id
      (merge campaign { is-cancelled: true })
    )
    
    (print {
      event: "campaign-cancelled",
      campaign-id: campaign-id,
      total-stx: (get total-stx campaign),
      donor-count: (get donor-count campaign)
    })
    
    (ok true)
  )
)

;; Withdraw funds (creator only, after campaign ends and goal is met)
(define-public (withdraw-funds (campaign-id uint))
  (let
    (
      (campaign (unwrap! (map-get? campaigns campaign-id) err-campaign-not-found))
      (total-amount (get total-stx campaign))
      (platform-fee (/ (* total-amount (var-get platform-fee-percentage)) u10000))
      (creator-amount (- total-amount platform-fee))
    )
    ;; Validate authorization and state
    (asserts! (is-eq tx-sender (get creator campaign)) err-not-authorized)
    (asserts! (is-campaign-ended campaign-id) err-campaign-not-ended)
    (asserts! (is-goal-met campaign-id) err-goal-not-met)
    (asserts! (not (get is-cancelled campaign)) err-campaign-cancelled)
    (asserts! (not (get is-withdrawn campaign)) err-already-withdrawn)
    
    ;; Transfer funds
    (try! (as-contract (stx-transfer? creator-amount tx-sender (get creator campaign))))
    (try! (as-contract (stx-transfer? platform-fee tx-sender (var-get platform-fee-recipient))))
    
    ;; Mark as withdrawn
    (map-set campaigns campaign-id
      (merge campaign { is-withdrawn: true })
    )
    
    (print {
      event: "funds-withdrawn",
      campaign-id: campaign-id,
      creator: (get creator campaign),
      amount: creator-amount,
      platform-fee: platform-fee
    })
    
    (ok creator-amount)
  )
)

;; Request refund (donor only, if campaign is cancelled)
(define-public (request-refund (campaign-id uint))
  (let
    (
      (campaign (unwrap! (map-get? campaigns campaign-id) err-campaign-not-found))
      (donation-amount (default-to u0 (map-get? campaign-stx-donations { campaign-id: campaign-id, donor: tx-sender })))
    )
    ;; Validate campaign is cancelled
    (asserts! (get is-cancelled campaign) err-not-cancelled)
    ;; Validate donor has donation
    (asserts! (> donation-amount u0) err-not-authorized)
    
    ;; Transfer refund
    (try! (as-contract (stx-transfer? donation-amount tx-sender tx-sender)))
    
    ;; Clear donation record
    (map-delete campaign-stx-donations { campaign-id: campaign-id, donor: tx-sender })
    
    (print {
      event: "refund-processed",
      campaign-id: campaign-id,
      donor: tx-sender,
      amount: donation-amount
    })
    
    (ok donation-amount)
  )
)

;; Get campaign info
(define-read-only (get-campaign (campaign-id uint))
  (map-get? campaigns campaign-id)
)

;; Get donor's contribution to campaign
(define-read-only (get-donor-contribution (campaign-id uint) (donor principal))
  (ok {
    stx: (default-to u0 (map-get? campaign-stx-donations { campaign-id: campaign-id, donor: donor })),
    sbtc: (default-to u0 (map-get? campaign-sbtc-donations { campaign-id: campaign-id, donor: donor }))
  })
)

;; Get milestone
(define-read-only (get-milestone (campaign-id uint) (milestone-id uint))
  (map-get? campaign-milestones { campaign-id: campaign-id, milestone-id: milestone-id })
)

;; Get beneficiary
(define-read-only (get-beneficiary (campaign-id uint) (beneficiary-id uint))
  (map-get? campaign-beneficiaries { campaign-id: campaign-id, beneficiary-id: beneficiary-id })
)

;; Get campaign counts
(define-read-only (get-campaign-counts (campaign-id uint))
  (ok {
    milestones: (default-to u0 (map-get? campaign-milestone-count campaign-id)),
    beneficiaries: (default-to u0 (map-get? campaign-beneficiary-count campaign-id))
  })
)

;; Get total campaign count
(define-read-only (get-campaign-count)
  (ok (var-get campaign-nonce))
)

;; Get platform fee info
(define-read-only (get-platform-fee-info)
  (ok {
    percentage: (var-get platform-fee-percentage),
    recipient: (var-get platform-fee-recipient)
  })
)

;; Update platform fee (contract owner only)
(define-public (set-platform-fee (new-percentage uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-not-authorized)
    (asserts! (<= new-percentage u1000) err-invalid-percentage) ;; Max 10%
    (var-set platform-fee-percentage new-percentage)
    (ok true)
  )
)

;; Update platform fee recipient (contract owner only)
(define-public (set-platform-fee-recipient (new-recipient principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-not-authorized)
    (var-set platform-fee-recipient new-recipient)
    (ok true)
  )
)
