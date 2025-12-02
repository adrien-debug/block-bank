/**
 * Types pour les transactions blockchain
 * Utilisés par tous les services de transaction
 */

import { Currency } from './index'

/**
 * Résultat standardisé d'une transaction blockchain
 */
export interface TransactionResult {
  success: boolean
  txHash?: string
  blockNumber?: number
  timestamp?: Date
  error?: string
  errorCode?: string
  gasUsed?: number
  gasPrice?: string
}

/**
 * Requête de paiement de prêt
 */
export interface PaymentRequest {
  loanId: string
  amount: number
  currency: Currency
  paymentType?: 'REGULAR' | 'EARLY' | 'FULL'
}

/**
 * Résultat d'un paiement
 */
export interface PaymentResult extends TransactionResult {
  loanId?: string
  newRemainingBalance?: number
  nextPaymentDate?: Date
}

/**
 * Requête d'investissement
 */
export interface DepositRequest {
  poolId: string
  trancheType: 'SENIOR' | 'MEZZANINE' | 'JUNIOR'
  amount: number
  token: Currency
}

/**
 * Résultat d'un investissement
 */
export interface DepositResult extends TransactionResult {
  investmentId?: string
  poolId?: string
  trancheType?: 'SENIOR' | 'MEZZANINE' | 'JUNIOR'
  shares?: number
}

/**
 * Requête de retrait
 */
export interface WithdrawRequest {
  investmentId: string
  amount?: number // Si non spécifié, retrait total
}

/**
 * Résultat d'un retrait
 */
export interface WithdrawResult extends TransactionResult {
  investmentId?: string
  amountWithdrawn?: number
  remainingBalance?: number
}

/**
 * Requête de tokenisation NFT
 */
export interface TokenizationRequest {
  nftId: string
  assetType: string
  value: number
  currency: Currency
  metadata: Record<string, unknown>
}

/**
 * Résultat d'une tokenisation
 */
export interface TokenizationResult extends TransactionResult {
  nftId?: string
  tokenId?: string
  contractAddress?: string
}

/**
 * Requête de création de prêt
 */
export interface LoanRequest {
  nftRwaId: string
  profile: 'SAFE' | 'BALANCED' | 'MAX_LEVERAGE'
  downPayment: number
  currency: Currency
  insuranceRequired: boolean
}

/**
 * Résultat d'une création de prêt
 */
export interface LoanResult extends TransactionResult {
  loanId?: string
  loanAmount?: number
  ltv?: number
  interestRate?: number
}

/**
 * Requête d'assurance
 */
export interface InsuranceRequest {
  loanId: string
  borrowerDefaultCoverage: number
  marketRiskCoverage: number
  assetRiskCoverage: number
  currency: Currency
}

/**
 * Résultat d'une création d'assurance
 */
export interface InsuranceResult extends TransactionResult {
  insuranceId?: string
  annualPremium?: number
  totalCoverage?: number
}

/**
 * Statut d'une transaction en cours
 */
export interface TransactionStatusInfo {
  txHash: string
  status: 'PENDING' | 'CONFIRMED' | 'FAILED'
  confirmations: number
  blockNumber?: number
  error?: string
}

/**
 * Options pour suivre une transaction
 */
export interface TransactionOptions {
  confirmations?: number // Nombre de confirmations attendues
  timeout?: number // Timeout en millisecondes
  onConfirmation?: (confirmations: number) => void
  onError?: (error: Error) => void
}

/**
 * Statut d'un investissement
 */
export interface InvestmentStatus {
  investmentId: string
  poolId: string
  trancheType: 'SENIOR' | 'MEZZANINE' | 'JUNIOR'
  shares: number
  currentValue: number
  totalReturn: number
  apy: number
  status: 'ACTIVE' | 'WITHDRAWN' | 'MATURED'
}

