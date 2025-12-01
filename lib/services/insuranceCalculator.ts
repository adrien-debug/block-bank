// Insurance Calculator - Calcul primes et options couverture

import { CreditTier, NFTRiskClass, InsuranceOption } from '@/types'

/**
 * Calcule la prime de base selon le Credit Tier
 */
export function getBaseInsuranceRate(tier: CreditTier): number {
  const rateMap: Record<CreditTier, number> = {
    A: 0.75, // 0.75% / year
    B: 1.5,  // 1.5% / year
    C: 2.5,  // 2.5% / year
    D: 4.0,  // 4% / year
  }
  return rateMap[tier]
}

/**
 * Calcule le multiplicateur de prime selon le risque NFT
 */
export function getNFTRiskMultiplier(riskClass: NFTRiskClass): number {
  const multiplierMap: Record<NFTRiskClass, number> = {
    SAFE: 0.8,      // -20%
    MODERATE: 1.0,  // Base
    RISKY: 1.3,     // +30%
  }
  return multiplierMap[riskClass]
}

/**
 * Calcule la prime annuelle d'assurance
 */
export function calculateInsurancePremium(
  loanAmount: number,
  creditTier: CreditTier,
  nftRiskClass: NFTRiskClass
): number {
  const baseRate = getBaseInsuranceRate(creditTier)
  const riskMultiplier = getNFTRiskMultiplier(nftRiskClass)
  const adjustedRate = baseRate * riskMultiplier
  
  return (loanAmount * adjustedRate) / 100
}

/**
 * Calcule les options d'assurance avec différentes couvertures
 */
export function calculateInsuranceOptions(
  loanAmount: number,
  creditTier: CreditTier,
  nftRiskClass: NFTRiskClass
): InsuranceOption[] {
  const basePremium = calculateInsurancePremium(loanAmount, creditTier, nftRiskClass)
  
  const options: InsuranceOption[] = []
  
  // Option 1: Couverture minimale (50% défaut emprunteur uniquement)
  const option1Premium = basePremium * 0.7
  options.push({
    borrowerDefaultCoverage: 50,
    marketRiskCoverage: 0,
    assetRiskCoverage: 0,
    totalCoverage: 50,
    annualPremium: option1Premium,
    impactOnLTV: 0,
    impactOnRate: 0,
  })
  
  // Option 2: Couverture standard (75% défaut emprunteur)
  const option2Premium = basePremium
  options.push({
    borrowerDefaultCoverage: 75,
    marketRiskCoverage: 0,
    assetRiskCoverage: 0,
    totalCoverage: 75,
    annualPremium: option2Premium,
    impactOnLTV: 0,
    impactOnRate: 0,
  })
  
  // Option 3: Couverture complète (100% défaut + 50% marché + 50% actif)
  const option3Premium = basePremium * 1.4 * 1.3 * 1.2 // Multiplicateurs pour chaque couverture
  options.push({
    borrowerDefaultCoverage: 100,
    marketRiskCoverage: 50,
    assetRiskCoverage: 50,
    totalCoverage: 100,
    annualPremium: option3Premium,
    impactOnLTV: 5,      // +5% LTV
    impactOnRate: -0.5,   // -0.5% APY
  })
  
  // Option 4: Couverture maximale (100% défaut + 75% marché + 75% actif)
  const option4Premium = basePremium * 1.4 * 1.5 * 1.35
  options.push({
    borrowerDefaultCoverage: 100,
    marketRiskCoverage: 75,
    assetRiskCoverage: 75,
    totalCoverage: 100,
    annualPremium: option4Premium,
    impactOnLTV: 5,
    impactOnRate: -0.5,
  })
  
  return options
}

/**
 * Calcule l'impact de l'assurance sur les conditions de prêt
 */
export function applyInsuranceImpact(
  baseLTV: number,
  baseRate: number,
  insuranceOption: InsuranceOption
): { adjustedLTV: number; adjustedRate: number } {
  const adjustedLTV = Math.min(baseLTV + insuranceOption.impactOnLTV, 90)
  const adjustedRate = Math.max(baseRate + insuranceOption.impactOnRate, 3.0)
  
  return { adjustedLTV, adjustedRate }
}


