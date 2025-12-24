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