/**
 * Service de validation des formulaires
 * Valide tous les formulaires de l'application
 */

export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

/**
 * Valide un formulaire de prêt
 */
export interface LoanFormData {
  nftRwaId: string
  profile: 'SAFE' | 'BALANCED' | 'MAX_LEVERAGE'
  downPayment: number
  currency: 'USDC' | 'USDT' | 'DAI'
  insuranceRequired: boolean
}

export function validateLoanForm(data: LoanFormData): ValidationResult {
  const errors: ValidationError[] = []

  // Validation NFT
  if (!data.nftRwaId || data.nftRwaId.trim() === '') {
    errors.push({
      field: 'nftRwaId',
      message: 'Veuillez sélectionner un actif NFT',
    })
  }

  // Validation profil
  if (!data.profile || !['SAFE', 'BALANCED', 'MAX_LEVERAGE'].includes(data.profile)) {
    errors.push({
      field: 'profile',
      message: 'Veuillez sélectionner un profil de prêt valide',
    })
  }

  // Validation apport
  if (!data.downPayment || data.downPayment <= 0) {
    errors.push({
      field: 'downPayment',
      message: 'L\'apport doit être supérieur à 0',
    })
  }

  if (data.downPayment < 1000) {
    errors.push({
      field: 'downPayment',
      message: 'L\'apport minimum est de 1000 USDC',
    })
  }

  // Validation devise
  if (!data.currency || !['USDC', 'USDT', 'DAI'].includes(data.currency)) {
    errors.push({
      field: 'currency',
      message: 'Veuillez sélectionner une devise valide',
    })
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Valide un formulaire de tokenisation
 */
export interface TokenizationFormData {
  assetType: string
  name: string
  description: string
  value: number
  currency: 'USDC' | 'USDT' | 'DAI'
  metadata?: Record<string, unknown>
}

export function validateTokenizationForm(
  data: TokenizationFormData
): ValidationResult {
  const errors: ValidationError[] = []

  // Validation type d'actif
  if (!data.assetType || data.assetType.trim() === '') {
    errors.push({
      field: 'assetType',
      message: 'Veuillez sélectionner un type d\'actif',
    })
  }

  // Validation nom
  if (!data.name || data.name.trim() === '') {
    errors.push({
      field: 'name',
      message: 'Le nom de l\'actif est requis',
    })
  }

  if (data.name.length < 3) {
    errors.push({
      field: 'name',
      message: 'Le nom doit contenir au moins 3 caractères',
    })
  }

  // Validation description
  if (!data.description || data.description.trim() === '') {
    errors.push({
      field: 'description',
      message: 'La description est requise',
    })
  }

  if (data.description.length < 10) {
    errors.push({
      field: 'description',
      message: 'La description doit contenir au moins 10 caractères',
    })
  }

  // Validation valeur
  if (!data.value || data.value <= 0) {
    errors.push({
      field: 'value',
      message: 'La valeur doit être supérieure à 0',
    })
  }

  if (data.value < 1000) {
    errors.push({
      field: 'value',
      message: 'La valeur minimum est de 1000 USDC',
    })
  }

  // Validation devise
  if (!data.currency || !['USDC', 'USDT', 'DAI'].includes(data.currency)) {
    errors.push({
      field: 'currency',
      message: 'Veuillez sélectionner une devise valide',
    })
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Valide un formulaire d'assurance
 */
export interface InsuranceFormData {
  loanId: string
  borrowerDefaultCoverage: number
  marketRiskCoverage: number
  assetRiskCoverage: number
  currency: 'USDC' | 'USDT' | 'DAI'
}

export function validateInsuranceForm(
  data: InsuranceFormData
): ValidationResult {
  const errors: ValidationError[] = []

  // Validation prêt
  if (!data.loanId || data.loanId.trim() === '') {
    errors.push({
      field: 'loanId',
      message: 'L\'ID du prêt est requis',
    })
  }

  // Validation couvertures
  if (
    data.borrowerDefaultCoverage < 0 ||
    data.borrowerDefaultCoverage > 100
  ) {
    errors.push({
      field: 'borrowerDefaultCoverage',
      message: 'La couverture par défaut doit être entre 0 et 100%',
    })
  }

  if (data.marketRiskCoverage < 0 || data.marketRiskCoverage > 100) {
    errors.push({
      field: 'marketRiskCoverage',
      message: 'La couverture de risque de marché doit être entre 0 et 100%',
    })
  }

  if (data.assetRiskCoverage < 0 || data.assetRiskCoverage > 100) {
    errors.push({
      field: 'assetRiskCoverage',
      message: 'La couverture de risque d\'actif doit être entre 0 et 100%',
    })
  }

  // Validation devise
  if (!data.currency || !['USDC', 'USDT', 'DAI'].includes(data.currency)) {
    errors.push({
      field: 'currency',
      message: 'Veuillez sélectionner une devise valide',
    })
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Valide un formulaire de réclamation d'assurance
 */
export interface ClaimFormData {
  insuranceId: string
  claimType: 'BORROWER_DEFAULT' | 'MARKET_RISK' | 'ASSET_RISK'
  amount: number
  description: string
}

export function validateClaimForm(data: ClaimFormData): ValidationResult {
  const errors: ValidationError[] = []

  // Validation assurance
  if (!data.insuranceId || data.insuranceId.trim() === '') {
    errors.push({
      field: 'insuranceId',
      message: 'L\'ID de l\'assurance est requis',
    })
  }

  // Validation type
  if (
    !data.claimType ||
    !['BORROWER_DEFAULT', 'MARKET_RISK', 'ASSET_RISK'].includes(data.claimType)
  ) {
    errors.push({
      field: 'claimType',
      message: 'Veuillez sélectionner un type de réclamation valide',
    })
  }

  // Validation montant
  if (!data.amount || data.amount <= 0) {
    errors.push({
      field: 'amount',
      message: 'Le montant doit être supérieur à 0',
    })
  }

  // Validation description
  if (!data.description || data.description.trim() === '') {
    errors.push({
      field: 'description',
      message: 'La description de la réclamation est requise',
    })
  }

  if (data.description.length < 20) {
    errors.push({
      field: 'description',
      message: 'La description doit contenir au moins 20 caractères',
    })
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Obtient le message d'erreur pour un champ spécifique
 */
export function getFieldError(
  errors: ValidationError[],
  field: string
): string | undefined {
  return errors.find((e) => e.field === field)?.message
}

/**
 * Obtient tous les messages d'erreur sous forme de chaîne
 */
export function getAllErrors(errors: ValidationError[]): string {
  return errors.map((e) => e.message).join(', ')
}


