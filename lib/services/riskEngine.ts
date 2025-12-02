// Risk Engine - Calcul Credit Score, Risque NFT, Conditions Prêt

import { CreditTier, NFTRiskClass, LoanConditions, NFTRWA } from '@/types'

/**
 * Calcule le Credit Tier à partir du score
 */
export function calculateCreditTier(score: number): CreditTier {
  if (score >= 800) return 'A'
  if (score >= 600) return 'B'
  if (score >= 400) return 'C'
  return 'D'
}

/**
 * Calcule le LTV maximum selon le Credit Tier
 */
export function getBaseLTV(tier: CreditTier): number {
  const ltvMap: Record<CreditTier, number> = {
    A: 70,
    B: 60,
    C: 50,
    D: 40,
  }
  return ltvMap[tier]
}

/**
 * Calcule le taux d'intérêt de base selon le Credit Tier
 */
export function getBaseRate(tier: CreditTier): number {
  const rateMap: Record<CreditTier, number> = {
    A: 7.0,
    B: 9.0,
    C: 11.0,
    D: 13.5,
  }
  return rateMap[tier]
}

/**
 * Calcule le risque NFT et sa classification
 */
export function calculateNFTRisk(nft: NFTRWA): { riskScore: number; riskClass: NFTRiskClass } {
  // Simulation du calcul de risque
  // En production, cela utiliserait des données réelles
  
  // Pour l'instant, on utilise le riskScore déjà présent dans le NFT
  const riskScore = nft.riskScore
  
  let riskClass: NFTRiskClass
  if (riskScore <= 30) {
    riskClass = 'SAFE'
  } else if (riskScore <= 60) {
    riskClass = 'MODERATE'
  } else {
    riskClass = 'RISKY'
  }
  
  return { riskScore, riskClass }
}

/**
 * Calcule les conditions de prêt complètes
 */
export function calculateLoanConditions(
  creditScore: number,
  nft: NFTRWA
): LoanConditions {
  const creditTier = calculateCreditTier(creditScore)
  const baseLTV = getBaseLTV(creditTier)
  const baseRate = getBaseRate(creditTier)
  
  const { riskScore, riskClass } = calculateNFTRisk(nft)
  
  // Ajustement LTV selon risque NFT
  let ltvAdjustment = 0
  if (riskClass === 'SAFE') ltvAdjustment = 5
  else if (riskClass === 'RISKY') ltvAdjustment = -10
  
  const adjustedLTV = baseLTV + ltvAdjustment
  const finalLTV = Math.min(adjustedLTV, 90) // Max 90%
  
  // Ajustement taux selon risque NFT
  let rateAdjustment = 0
  if (riskClass === 'SAFE') rateAdjustment = -0.5
  else if (riskClass === 'RISKY') rateAdjustment = 1.5
  
  const adjustedRate = baseRate + rateAdjustment
  const finalRate = Math.max(adjustedRate, 3.0) // Min 3%
  
  return {
    baseLTV,
    adjustedLTV,
    finalLTV,
    baseRate,
    adjustedRate,
    finalRate,
    nftRiskScore: riskScore,
    nftRiskClass: riskClass,
    creditScore,
    creditTier,
  }
}

/**
 * Calcule les 3 profils de prêt
 */
export function calculateLoanProfiles(
  nftValue: number,
  conditions: LoanConditions,
  insurancePremium?: number
): Array<{
  profile: 'SAFE' | 'BALANCED' | 'MAX_LEVERAGE'
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
}> {
  const { finalLTV, finalRate } = conditions
  
  // Profil SAFE
  const safeDownPaymentPercent = 50
  const safeDownPayment = (nftValue * safeDownPaymentPercent) / 100
  const safeLoanAmount = nftValue - safeDownPayment
  const safeLTV = (safeLoanAmount / nftValue) * 100
  const safeRate = finalRate - 0.5
  const safeDuration = 36
  const safeMonthlyPayment = calculateMonthlyPayment(safeLoanAmount, safeRate, safeDuration)
  const safeInsurancePremium = insurancePremium ? insurancePremium * 0.8 : undefined
  const safeTotalCost = safeLoanAmount + (safeMonthlyPayment * safeDuration) + (safeInsurancePremium || 0)
  
  // Profil BALANCED
  const balancedDownPaymentPercent = 35
  const balancedDownPayment = (nftValue * balancedDownPaymentPercent) / 100
  const balancedLoanAmount = nftValue - balancedDownPayment
  const balancedLTV = (balancedLoanAmount / nftValue) * 100
  const balancedRate = finalRate
  const balancedDuration = 36
  const balancedMonthlyPayment = calculateMonthlyPayment(balancedLoanAmount, balancedRate, balancedDuration)
  const balancedInsurancePremium = insurancePremium
  const balancedTotalCost = balancedLoanAmount + (balancedMonthlyPayment * balancedDuration) + (balancedInsurancePremium || 0)
  
  // Profil MAX LEVERAGE
  const maxLeverageDownPaymentPercent = 15
  const maxLeverageDownPayment = (nftValue * maxLeverageDownPaymentPercent) / 100
  const maxLeverageLoanAmount = nftValue - maxLeverageDownPayment
  const maxLeverageLTV = (maxLeverageLoanAmount / nftValue) * 100
  const maxLeverageRate = finalRate + 1.0
  const maxLeverageDuration = 36
  const maxLeverageMonthlyPayment = calculateMonthlyPayment(maxLeverageLoanAmount, maxLeverageRate, maxLeverageDuration)
  const maxLeverageInsurancePremium = insurancePremium ? insurancePremium * 1.2 : 0 // Obligatoire
  const maxLeverageTotalCost = maxLeverageLoanAmount + (maxLeverageMonthlyPayment * maxLeverageDuration) + maxLeverageInsurancePremium
  
  return [
    {
      profile: 'SAFE',
      downPayment: safeDownPayment,
      downPaymentPercent: safeDownPaymentPercent,
      loanAmount: safeLoanAmount,
      ltv: safeLTV,
      interestRate: safeRate,
      duration: safeDuration,
      monthlyPayment: safeMonthlyPayment,
      insuranceRequired: false,
      insurancePremium: safeInsurancePremium,
      totalCost: safeTotalCost,
    },
    {
      profile: 'BALANCED',
      downPayment: balancedDownPayment,
      downPaymentPercent: balancedDownPaymentPercent,
      loanAmount: balancedLoanAmount,
      ltv: balancedLTV,
      interestRate: balancedRate,
      duration: balancedDuration,
      monthlyPayment: balancedMonthlyPayment,
      insuranceRequired: false,
      insurancePremium: balancedInsurancePremium,
      totalCost: balancedTotalCost,
    },
    {
      profile: 'MAX_LEVERAGE',
      downPayment: maxLeverageDownPayment,
      downPaymentPercent: maxLeverageDownPaymentPercent,
      loanAmount: maxLeverageLoanAmount,
      ltv: maxLeverageLTV,
      interestRate: maxLeverageRate,
      duration: maxLeverageDuration,
      monthlyPayment: maxLeverageMonthlyPayment,
      insuranceRequired: true,
      insurancePremium: maxLeverageInsurancePremium,
      totalCost: maxLeverageTotalCost,
    },
  ]
}

/**
 * Calcule la mensualité d'un prêt
 */
function calculateMonthlyPayment(principal: number, annualRate: number, months: number): number {
  const monthlyRate = annualRate / 100 / 12
  if (monthlyRate === 0) {
    return principal / months
  }
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
}







