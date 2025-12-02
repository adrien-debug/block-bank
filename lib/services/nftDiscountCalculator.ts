// NFT Discount Calculator - Calcul des remises NFT RWA (10%, 15%, 20%)

import { NFTRWA, NFTRiskClass, CreditTier } from '@/types'

/**
 * Niveaux de remise disponibles
 */
export type DiscountLevel = 10 | 15 | 20

/**
 * Calcule le niveau de remise applicable selon le NFT et le Credit Score
 */
export function calculateDiscountLevel(
  nft: NFTRWA,
  creditTier: CreditTier
): DiscountLevel {
  // Remise 20% (Premium) : NFT SAFE + Credit Tier A ou B
  if (nft.riskClass === 'SAFE' && (creditTier === 'A' || creditTier === 'B')) {
    return 20
  }
  
  // Remise 15% (Standard) : NFT SAFE ou MODERATE + Credit Tier A, B ou C
  if (
    (nft.riskClass === 'SAFE' || nft.riskClass === 'MODERATE') &&
    (creditTier === 'A' || creditTier === 'B' || creditTier === 'C')
  ) {
    return 15
  }
  
  // Remise 10% (Minimum) : Tous les NFT éligibles
  return 10
}

/**
 * Calcule le paiement minimum requis selon la remise
 */
export function calculateMinimumPayment(
  nftValue: number,
  discountLevel: DiscountLevel
): number {
  return (nftValue * discountLevel) / 100
}

/**
 * Calcule le montant du prêt après application de la remise
 */
export function calculateLoanAmountWithDiscount(
  nftValue: number,
  discountLevel: DiscountLevel,
  baseLTV: number
): {
  minimumPayment: number
  loanAmount: number
  effectiveLTV: number
} {
  const minimumPayment = calculateMinimumPayment(nftValue, discountLevel)
  const effectiveLTV = baseLTV - discountLevel
  const loanAmount = (nftValue * effectiveLTV) / 100
  
  return {
    minimumPayment,
    loanAmount,
    effectiveLTV: Math.max(effectiveLTV, 0), // LTV ne peut pas être négatif
  }
}

/**
 * Calcule les avantages de la remise (réduction taux, prime assurance)
 */
export function calculateDiscountBenefits(
  discountLevel: DiscountLevel,
  baseRate: number,
  baseInsurancePremium: number
): {
  rateReduction: number
  insuranceReduction: number
  finalRate: number
  finalInsurancePremium: number
} {
  let rateReduction = 0
  let insuranceReduction = 0
  
  if (discountLevel === 20) {
    rateReduction = 0.5 // -0.5% APY
    insuranceReduction = 10 // -10% prime
  } else if (discountLevel === 15) {
    rateReduction = 0.25 // -0.25% APY
    insuranceReduction = 5 // -5% prime
  } else {
    // Remise 10% : pas de réduction supplémentaire
    rateReduction = 0
    insuranceReduction = 0
  }
  
  const finalRate = Math.max(baseRate - rateReduction, 3.0) // Taux minimum 3%
  const finalInsurancePremium = baseInsurancePremium * (1 - insuranceReduction / 100)
  
  return {
    rateReduction,
    insuranceReduction,
    finalRate,
    finalInsurancePremium,
  }
}

/**
 * Récupère la description du niveau de remise
 */
export function getDiscountDescription(discountLevel: DiscountLevel): {
  name: string
  description: string
  benefits: string[]
} {
  switch (discountLevel) {
    case 20:
      return {
        name: 'Remise Premium (20%)',
        description: 'Remise maximale pour NFT SAFE avec excellent Credit Score',
        benefits: [
          'Paiement minimum : 20% de la valeur NFT',
          'Réduction taux : -0.5% APY',
          'Réduction prime assurance : -10%',
          'LTV ajusté : -20%',
        ],
      }
    case 15:
      return {
        name: 'Remise Standard (15%)',
        description: 'Remise standard pour NFT SAFE ou MODERATE',
        benefits: [
          'Paiement minimum : 15% de la valeur NFT',
          'Réduction taux : -0.25% APY',
          'Réduction prime assurance : -5%',
          'LTV ajusté : -15%',
        ],
      }
    case 10:
      return {
        name: 'Remise Minimum (10%)',
        description: 'Remise de base pour tous les NFT éligibles',
        benefits: [
          'Paiement minimum : 10% de la valeur NFT',
          'LTV ajusté : -10%',
        ],
      }
  }
}

/**
 * Vérifie si un NFT est éligible pour une remise
 */
export function isNFTEligibleForDiscount(nft: NFTRWA): boolean {
  // Tous les NFT RWA sont éligibles pour au moins la remise 10%
  return nft.value >= 10000 // Valeur minimale : 10,000 USDC
}

/**
 * Calcule le résumé complet de la remise
 */
export function calculateDiscountSummary(
  nft: NFTRWA,
  creditTier: CreditTier,
  baseLTV: number,
  baseRate: number,
  baseInsurancePremium: number
) {
  const discountLevel = calculateDiscountLevel(nft, creditTier)
  const { minimumPayment, loanAmount, effectiveLTV } = calculateLoanAmountWithDiscount(
    nft.value,
    discountLevel,
    baseLTV
  )
  const { rateReduction, insuranceReduction, finalRate, finalInsurancePremium } =
    calculateDiscountBenefits(discountLevel, baseRate, baseInsurancePremium)
  const discountInfo = getDiscountDescription(discountLevel)
  
  return {
    discountLevel,
    discountInfo,
    minimumPayment,
    loanAmount,
    effectiveLTV,
    rateReduction,
    insuranceReduction,
    finalRate,
    finalInsurancePremium,
    savings: {
      rateSavings: (baseRate - finalRate) * loanAmount / 100 / 12, // Économies mensuelles taux
      insuranceSavings: baseInsurancePremium - finalInsurancePremium, // Économies annuelles assurance
    },
  }
}







