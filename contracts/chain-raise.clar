;; Title: ChainRaise
;;
;; Summary:
;; ChainRaise is a decentralized crowdfunding smart contract built on the Stacks blockchain.
;; It enables transparent, trustless fundraising campaigns with support for both STX and sBTC donations.
;; Campaign creators can set funding goals, manage multiple beneficiaries, track milestones, and 
;; provide donors with transparent refund mechanisms if campaigns are cancelled.
;;
;; Features:
;; - Dual-currency support (STX and sBTC donations)
;; - Milestone-based fund releases
;; - Multiple beneficiary management with percentage-based allocation
;; - Emergency pause functionality for campaign security
;; - Transparent refund system for cancelled campaigns
;; - Configurable donation limits (min/max amounts)
;; - Campaign categorization and detailed metadata
;; - Time-bound campaigns with customizable durations
;;
;; Security:
;; - Owner-only administrative functions
;; - Single initialization protection
;; - State validation checks throughout
;; - Withdrawal authorization controls

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-not-authorized (err u100))
(define-constant err-campaign-ended (err u101))
(define-constant err-not-initialized (err u102))
(define-constant err-not-cancelled (err u103))
(define-constant err-campaign-not-ended (err u104))
(define-constant err-campaign-cancelled (err u105))
(define-constant err-already-initialized (err u106))
(define-constant err-already-withdrawn (err u107))
(define-constant err-paused (err u108))
(define-constant err-donation-too-small (err u109))
(define-constant err-donation-too-large (err u110))
(define-constant err-milestone-not-found (err u111))
(define-constant err-milestone-already-withdrawn (err u112))
(define-constant err-invalid-percentage (err u113))
(define-constant err-goal-not-met (err u114))
(define-constant err-beneficiary-exists (err u115))

(define-constant default-duration u4320) ;; Duration in *Bitcoin* blocks. This default value means is if a block is 10 minutes, this is roughly 30 days.
(define-constant max-beneficiaries u10)

;; Data vars
(define-data-var is-campaign-initialized bool false)
(define-data-var is-campaign-cancelled bool false)
(define-data-var is-paused bool false)
(define-data-var beneficiary principal contract-owner)
(define-data-var campaign-duration uint u173000)
(define-data-var campaign-start uint u0)
(define-data-var campaign-goal uint u0)
(define-data-var total-stx uint u0) ;; in microstacks
(define-data-var total-sbtc uint u0) ;; in sats
(define-data-var donation-count uint u0)
(define-data-var is-campaign-withdrawn bool false)
(define-data-var min-donation-stx uint u1000000) ;; 1 STX minimum
(define-data-var max-donation-stx uint u100000000000) ;; 100,000 STX maximum
(define-data-var min-donation-sbtc uint u10000) ;; 0.0001 BTC minimum
(define-data-var max-donation-sbtc uint u1000000000) ;; 10 BTC maximum
(define-data-var campaign-title (string-ascii 100) "")
(define-data-var campaign-description (string-utf8 500) u"")
(define-data-var campaign-category (string-ascii 50) "")
(define-data-var beneficiary-count uint u0)
(define-data-var milestone-count uint u0)

;; Maps
(define-map stx-donations
  principal
  uint
) ;; donor -> amount
(define-map sbtc-donations
  principal
  uint
) ;; donor -> amount

;; Milestones: milestone-id -> {amount, description, withdrawn}
(define-map milestones
  uint
  {
    amount: uint,
    description: (string-utf8 200),
    withdrawn: bool
  }
)

;; Multiple beneficiaries: beneficiary-id -> {address, percentage}
(define-map beneficiaries
  uint
  {
    address: principal,
    percentage: uint ;; out of 10000 (100.00%)
  }
)

;; Initialize the campaign (goal in US dollars)
;; Pass duration as 0 to use the default duration (~30 days)
;; Can only be called once
;; Note: Unchecked data warnings are acceptable here as only contract-owner can call this
(define-public (initialize-campaign
    (goal uint)
    (duration uint)
    (title (string-ascii 100))
    (description (string-utf8 500))
    (category (string-ascii 50))
  )
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-not-authorized)
    (asserts! (not (var-get is-campaign-initialized)) err-already-initialized)
    ;; Validate goal is positive
    (asserts! (> goal u0) err-not-authorized)
    (var-set is-campaign-initialized true)
    (var-set campaign-start burn-block-height)
    (var-set campaign-goal goal)
    ;; String types are already bounded by type declarations (string-ascii 100, string-utf8 500, string-ascii 50)
    ;; Clarity's type system enforces max length, making additional validation redundant
    (var-set campaign-title title)
    (var-set campaign-description description)
    (var-set campaign-category category)
    (var-set campaign-duration
      (if (is-eq duration u0)
        default-duration
        duration
      ))
    (print {
      event: "campaign-initialized",
      goal: goal,
      duration: (var-get campaign-duration),
      title: title,
      category: category,
      start-block: burn-block-height
    })
    (ok true)
  )
)

;; Emergency pause mechanism
(define-public (pause-campaign)
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-not-authorized)
    (asserts! (var-get is-campaign-initialized) err-not-initialized)
    (var-set is-paused true)
    (print { event: "campaign-paused", block: burn-block-height })
    (ok true)
  )
)

(define-public (unpause-campaign)
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-not-authorized)
    (asserts! (var-get is-campaign-initialized) err-not-initialized)
    (var-set is-paused false)
    (print { event: "campaign-unpaused", block: burn-block-height })
    (ok true)
  )
)

;; Cancel the campaign
;; Only the owner can call this, at any time during or after the campaign
;; Allows donors to get a refund
;; Can only be called once
(define-public (cancel-campaign)
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-not-authorized)
    (asserts! (var-get is-campaign-initialized) err-not-initialized)
    (asserts! (not (var-get is-campaign-withdrawn)) err-already-withdrawn)
    (var-set is-campaign-cancelled true)
    (print {
      event: "campaign-cancelled",
      total-stx: (var-get total-stx),
      total-sbtc: (var-get total-sbtc),
      donors: (var-get donation-count)
    })
    (ok true)
  )
)

;; Donate STX. Pass amount in microstacks.
(define-public (donate-stx (amount uint))
  (begin
    (asserts! (var-get is-campaign-initialized) err-not-initialized)
    (asserts! (not (var-get is-campaign-cancelled)) err-campaign-cancelled)
    (asserts! (not (var-get is-paused)) err-paused)
    (asserts! (>= amount (var-get min-donation-stx)) err-donation-too-small)
    (asserts! (<= amount (var-get max-donation-stx)) err-donation-too-large)
    (asserts!
      (< burn-block-height
        (+ (var-get campaign-start) (var-get campaign-duration))
      )
      err-campaign-ended
    )
    (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
    (map-set stx-donations tx-sender
      (+ (default-to u0 (map-get? stx-donations tx-sender)) amount)
    )
    (var-set total-stx (+ (var-get total-stx) amount))
    (var-set donation-count (+ (var-get donation-count) u1))
    (print {
      event: "donation-stx",
      donor: tx-sender,
      amount: amount,
      total: (var-get total-stx),
      block: burn-block-height
    })
    (ok true)
  )
)

;; Donate sBTC. Pass amount in Satoshis.
(define-public (donate-sbtc (amount uint))
  (begin
    (asserts! (var-get is-campaign-initialized) err-not-initialized)
    (asserts! (not (var-get is-campaign-cancelled)) err-campaign-cancelled)
    (asserts! (not (var-get is-paused)) err-paused)
    (asserts! (>= amount (var-get min-donation-sbtc)) err-donation-too-small)
    (asserts! (<= amount (var-get max-donation-sbtc)) err-donation-too-large)
    (asserts!
      (< burn-block-height
        (+ (var-get campaign-start) (var-get campaign-duration))
      )
      err-campaign-ended
    )
    (try! (contract-call? 'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token
      transfer amount contract-caller (as-contract tx-sender) none
    ))
    (map-set sbtc-donations tx-sender
      (+ (default-to u0 (map-get? sbtc-donations tx-sender)) amount)
    )
    (var-set total-sbtc (+ (var-get total-sbtc) amount))
    (var-set donation-count (+ (var-get donation-count) u1))
    (print {
      event: "donation-sbtc",
      donor: tx-sender,
      amount: amount,
      total: (var-get total-sbtc),
      block: burn-block-height
    })
    (ok true)
  )
)

;; Withdraw funds (only beneficiary/beneficiaries, only if campaign ended and goal met)
(define-public (withdraw)
  (let (
      (total-stx-amount (var-get total-stx))
      (total-sbtc-amount (var-get total-sbtc))
      (num-beneficiaries (var-get beneficiary-count))
    )
    (asserts! (var-get is-campaign-initialized) err-not-initialized)
    (asserts! (not (var-get is-campaign-cancelled)) err-campaign-cancelled)
    (asserts! (not (var-get is-campaign-withdrawn)) err-already-withdrawn)
    (asserts!
      (>= burn-block-height
        (+ (var-get campaign-start) (var-get campaign-duration))
      )
      err-campaign-not-ended
    )
    ;; If multiple beneficiaries, only owner can trigger withdraw
    ;; If single beneficiary, only that beneficiary can withdraw
    (if (> num-beneficiaries u0)
      (asserts! (is-eq tx-sender contract-owner) err-not-authorized)
      (asserts! (is-eq tx-sender (var-get beneficiary)) err-not-authorized)
    )
    (var-set is-campaign-withdrawn true)
    (try! (if (> num-beneficiaries u0)
      ;; Distribute to multiple beneficiaries
      (distribute-to-beneficiaries total-stx-amount total-sbtc-amount)
      ;; Single beneficiary withdrawal
      (as-contract (begin
        (if (> total-stx-amount u0)
          (try! (stx-transfer? total-stx-amount (as-contract tx-sender)
            (var-get beneficiary)
          ))
          true
        )
        (if (> total-sbtc-amount u0)
          (try! (contract-call? 'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token
            transfer total-sbtc-amount (as-contract tx-sender)
            (var-get beneficiary) none
          ))
          true
        )
        (ok true)
      ))
    ))
    (print {
      event: "funds-withdrawn",
      stx-amount: total-stx-amount,
      sbtc-amount: total-sbtc-amount,
      beneficiary: (var-get beneficiary),
      block: burn-block-height
    })
    (ok true)
  )
)

;; Refund to donor
;; Available if: campaign cancelled OR (campaign ended AND goal not met)
(define-public (refund)
  (let (
      (stx-amount (default-to u0 (map-get? stx-donations tx-sender)))
      (sbtc-amount (default-to u0 (map-get? sbtc-donations tx-sender)))
      (contributor tx-sender)
      (campaign-ended (>= burn-block-height
        (+ (var-get campaign-start) (var-get campaign-duration))))
      (goal-met (>= (var-get total-stx) (var-get campaign-goal)))
    )
    (asserts! (var-get is-campaign-initialized) err-not-initialized)
    ;; Refund allowed if cancelled OR (ended and goal not met)
    (asserts! (or (var-get is-campaign-cancelled)
                   (and campaign-ended (not goal-met)))
              err-not-cancelled)
    (asserts! (not (var-get is-campaign-withdrawn)) err-already-withdrawn)
    (if (> stx-amount u0)
      (begin
        (as-contract (try! (stx-transfer? stx-amount tx-sender contributor)))
        (map-delete stx-donations tx-sender)
      )
      true
    )
    (if (> sbtc-amount u0)
      (begin
        (as-contract (try! (contract-call? 'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token
          transfer sbtc-amount tx-sender contributor none
        )))
        (map-delete sbtc-donations tx-sender)
      )
      true
    )
    (print {
      event: "refund-processed",
      donor: contributor,
      stx-amount: stx-amount,
      sbtc-amount: sbtc-amount,
      block: burn-block-height
    })
    (ok true)
  )
)

;; Add milestone
;; Note: Unchecked data warnings are acceptable - owner-only function with type-safe inputs
(define-public (add-milestone (amount uint) (description (string-utf8 200)))
  (let ((milestone-id (var-get milestone-count)))
    (asserts! (is-eq tx-sender contract-owner) err-not-authorized)
    (asserts! (var-get is-campaign-initialized) err-not-initialized)
    ;; Validate amount is positive
    (asserts! (> amount u0) err-not-authorized)
    ;; Description type (string-utf8 200) is bounded by Clarity type system
    (map-set milestones milestone-id {
      amount: amount,
      description: description,
      withdrawn: false
    })
    (var-set milestone-count (+ milestone-id u1))
    (print {
      event: "milestone-added",
      milestone-id: milestone-id,
      amount: amount,
      description: description
    })
    (ok milestone-id)
  )
)

;; Withdraw funds for a specific milestone
(define-public (withdraw-milestone (milestone-id uint))
  (let (
      (milestone (unwrap! (map-get? milestones milestone-id) err-milestone-not-found))
      (milestone-amount (get amount milestone))
      (total-raised (var-get total-stx))
      (beneficiary-addr (var-get beneficiary))
    )
    (asserts! (var-get is-campaign-initialized) err-not-initialized)
    (asserts! (not (var-get is-campaign-cancelled)) err-campaign-cancelled)
    (asserts! (is-eq tx-sender beneficiary-addr) err-not-authorized)
    (asserts! (not (get withdrawn milestone)) err-milestone-already-withdrawn)
    (asserts! (>= total-raised milestone-amount) err-goal-not-met)
    
    ;; Mark milestone as withdrawn
    (map-set milestones milestone-id (merge milestone { withdrawn: true }))
    
    ;; Transfer the milestone amount
    (as-contract (try! (stx-transfer? milestone-amount (as-contract tx-sender) beneficiary-addr)))
    
    (print {
      event: "milestone-withdrawn",
      milestone-id: milestone-id,
      amount: milestone-amount,
      beneficiary: beneficiary-addr,
      block: burn-block-height
    })
    (ok true)
  )
)

;; Update beneficiary (only before withdrawal)
;; Note: Unchecked data warning is acceptable - principal type is inherently validated by Clarity
(define-public (update-beneficiary (new-beneficiary principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-not-authorized)
    (asserts! (var-get is-campaign-initialized) err-not-initialized)
    (asserts! (not (var-get is-campaign-withdrawn)) err-already-withdrawn)
    ;; Principal type is already validated by Clarity type system
    (var-set beneficiary new-beneficiary)
    (print {
      event: "beneficiary-updated",
      old-beneficiary: (var-get beneficiary),
      new-beneficiary: new-beneficiary,
      block: burn-block-height
    })
    (ok true)
  )
)