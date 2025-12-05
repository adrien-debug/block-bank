// BlockBank Data Model Types

export type CreditTier = 'A+' | 'A' | 'B' | 'C' | 'D'
export type LoanStatus = 'PENDING' | 'ACTIVE' | 'REPAID' | 'DEFAULT' | 'LIQUIDATED' | 'CLOSED'
export type LoanProfile = 'SAFE' | 'BALANCED' | 'MAX_LEVERAGE'
export type NFTRiskClass = 'SAFE' | 'MODERATE' | 'RISKY'
export type InsuranceStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELLED'
export type LiquidationStatus = 'PENDING' | 'USER_BUYBACK_OPTION' | 'PARTNER_NOTIFIED' | 'BUYBACK_OFFERED' | 'EXECUTED' | 'CANCELLED'
export type KYCStatus = 'PENDING' | 'VERIFIED' | 'REJECTED' | 'NOT_REQUIRED'
export type Network = 'ethereum' | 'polygon' | 'arbitrum'
export type Marketplace = 'REALT' | 'TANGIBL' | 'COURTYARD' | '4K' | 'MAPLE' | 'BACKED' | 'CENTRIFUGE' | 'LANDSHARE' | '21CO' | 'DIBBS'
export type AssetType = 'REAL_ESTATE' | 'MINING' | 'INFRASTRUCTURE' | 'COMMODITIES' | 'OTHER'
export type Currency = 'USDC' | 'USDT' | 'DAI'
export type TransactionType = 'DOWN_PAYMENT' | 'DISBURSEMENT' | 'PAYMENT' | 'EARLY_REPAYMENT' | 'LIQUIDATION'
export type TransactionStatus = 'PENDING' | 'CONFIRMED' | 'FAILED'

export interface User {
  id: string
  walletAddress: string
  network: Network
  kycStatus: KYCStatus
  kycData?: {
    firstName?: string
    lastName?: string
    email?: string
    verifiedAt?: Date
  }
  creditScore: number // 0-1000
  creditTier: CreditTier
  creditScoreHistory: CreditScoreEntry[]
  createdAt: Date
  updatedAt: Date
}

export interface CreditScoreEntry {
  id: string
  userId: string
  score: number
  components: {
    onChainBehavioral: number // 0-350
    offChainFinancial: number // 0-300
    assetBased: number // 0-200
    reputationTrust: number // 0-150
  }
  calculatedAt: Date
  factors: string[] // Raisons changement score
}

export interface CreditScoreNFTMetadata {
  // Identifiants
  tokenId: string
  contractAddress: string
  walletAddress: string
  
  // Score principal
  globalScore: number // 0-1000
  tier: CreditTier
  
  // Sous-scores détaillés
  subScores: {
    onChain: number
    offChain: number
    assets: number
    reputation: number
  }
  
  // Métadonnées techniques
  modelVersion: string // "v2.1"
  issuedAt: number // timestamp
  validUntil: number // timestamp (30 jours)
  dataHash: string // hash des données sources off-chain
  
  // Vérifications
  kycVerified: boolean
  amlVerified: boolean
  verificationLevel: 'basic' | 'enhanced' | 'premium'
  
  // Historique synthétique
  scoreHistory: {
    lastUpdate: number
    trend: 'up' | 'down' | 'stable'
    change: number
  }
}

export type PartnerPlatform = 'REALT' | 'TANGIBL' | 'COURTYARD' | '4K' | 'MAPLE' | 'BACKED' | 'CENTRIFUGE' | 'LANDSHARE' | '21CO' | 'DIBBS'

export interface PartnerAccess {
  platform: PartnerPlatform
  platformName: string
  authorized: boolean
  lastAccessed?: number
  accessCount: number
  permissions: {
    readScore: boolean
    readMetadata: boolean
    readFullData: boolean
  }
  apiKey?: string
}

export interface NFTRWA {
  id: string
  tokenId: string
  contractAddress: string
  marketplace: Marketplace
  assetType: AssetType
  name: string
  description: string
  value: number // USDC
  valueCurrency: Currency
  riskScore: number // 0-100
  riskClass: NFTRiskClass
  metadataURI: string // IPFS
  ownerAddress?: string
  isLocked: boolean
  lockedInLoanId?: string
  imageURI?: string
  createdAt: Date
  updatedAt: Date
}

export interface Loan {
  id: string
  userId: string
  nftRwaId: string
  profile: LoanProfile
  
  // Conditions
  nftValue: number // Valeur NFT au moment prêt
  downPayment: number // Apport utilisateur
  loanAmount: number // Montant prêt
  ltv: number // Loan-to-Value ratio
  interestRate: number // APY
  duration: number // Mois
  monthlyPayment: number
  
  // Dates
  startDate: Date
  endDate: Date
  nextPaymentDate: Date
  
  // État
  status: LoanStatus
  remainingBalance: number
  totalPaid: number
  
  // Assurance
  insuranceId?: string
  insuranceRequired: boolean
  
  // Transactions
  transactions: LoanTransaction[]
  
  createdAt: Date
  updatedAt: Date
}

export interface LoanTransaction {
  id: string
  loanId: string
  type: TransactionType
  amount: number
  currency: Currency
  txHash: string
  blockNumber: number
  timestamp: Date
  status: TransactionStatus
}

export interface Insurance {
  id: string
  loanId: string
  userId: string
  
  // Couverture
  borrowerDefaultCoverage: number // 50, 75, 100
  marketRiskCoverage: number // 0, 50, 75
  assetRiskCoverage: number // 0, 50, 75
  totalCoverage: number // %
  
  // Prime
  annualPremium: number
  premiumCurrency: Currency
  
  // Dates
  startDate: Date
  endDate: Date
  renewalDate: Date
  
  // État
  status: InsuranceStatus
  
  createdAt: Date
  updatedAt: Date
}

export interface Liquidation {
  id: string
  loanId: string
  userId: string
  nftRwaId: string
  
  // Déclenchement
  triggerReason: 'PAYMENT_DELAY' | 'COLLATERAL_RATIO' | 'MANUAL'
  triggerDate: Date
  daysOverdue?: number
  collateralRatio?: number
  
  // Processus
  status: LiquidationStatus
  
  // Buyback
  buybackDiscount: number // 10, 20, 25
  buybackPrice: number
  buybackBuyer?: string // Adresse partenaire ou fonds interne
  buybackTxHash?: string
  
  // Résultat
  loanRepaid: number
  remainingToUser?: number
  
  executedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface LoanProfileOption {
  profile: LoanProfile
  downPayment: number
  downPaymentPercent: number
  loanAmount: number
  ltv: number
  interestRate: number
  duration: number
  monthlyPayment: number
  insuranceRequired: boolean
  insurancePremium?: number
  totalCost: number
  recommended?: boolean
}

export interface LoanConditions {
  baseLTV: number
  adjustedLTV: number
  finalLTV: number
  baseRate: number
  adjustedRate: number
  finalRate: number
  nftRiskScore: number
  nftRiskClass: NFTRiskClass
  creditScore: number
  creditTier: CreditTier
}

export interface InsuranceOption {
  borrowerDefaultCoverage: number
  marketRiskCoverage: number
  assetRiskCoverage: number
  totalCoverage: number
  annualPremium: number
  impactOnLTV: number // +5% si assurance complète
  impactOnRate: number // -0.5% si assurance complète
}







