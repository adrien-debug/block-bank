export type UserType = 'individual' | 'company'
export type AssetType = 'real-estate' | 'vehicle' | 'luxury' | 'collectible' | 'mining' | 'infrastructure' | 'other' | 'commercial'
export type SubmissionStatus = 'new' | 'in-review' | 'approved' | 'rejected' | 'processed'

export interface AssetSubmission {
  id: string
  submittedAt: string
  status: SubmissionStatus
  
  // Type d'utilisateur
  userType: UserType
  
  // Informations particuliers
  ownerName?: string
  ownerEmail?: string
  ownerPhone?: string
  
  // Informations entreprise
  companyName?: string
  companyEmail?: string
  companyPhone?: string
  companyRegistration?: string
  contactPersonName?: string
  
  // Informations actif
  assetType: AssetType
  customAssetType?: string
  assetDescription: string
  estimatedValue: string
  location: string
  assetLink?: string
  
  // Documents (IDs dans Google Drive)
  documents: {
    passport?: string[]
    identityDocument?: string[]
    companyStatutes?: string[]
    companyBalanceSheet?: string[]
    companyRegistrationDoc?: string[]
    assetDocuments?: string[]
    additionalDocuments?: string[]
  }
  
  // Métadonnées
  additionalInfo?: string
  
  // Informations paiement vendeur
  sellerPaymentMethod?: 'CRYPTO' | 'FIAT' | 'HYBRID'
  sellerPreferredCurrency?: string
  sellerCryptoAddress?: string
  sellerBankAccount?: {
    iban: string
    bic: string
    accountHolder: string
    bankName: string
    currency: 'EUR' | 'USD' | 'GBP' | 'CHF'
  }
}

export interface SubmissionMetadata {
  id: string
  submittedAt: string
  status: SubmissionStatus
  userType: UserType
  assetType: AssetType
  estimatedValue: string
  location: string
  ownerName?: string
  companyName?: string
  folderId: string // ID du dossier Google Drive
}

