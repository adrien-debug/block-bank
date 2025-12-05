// Service de calcul du Credit Score basé sur les données réelles
// Calcule les 4 composantes du score: On-Chain, Off-Chain, Assets, Reputation

import { supabaseAdmin } from '@/lib/supabase/server'
import { CreditTier } from '@/types'

export interface CreditScoreComponents {
  onChainScore: number // 0-350
  offChainScore: number // 0-300
  assetsScore: number // 0-200
  reputationScore: number // 0-150
  totalScore: number // 0-1000
  tier: CreditTier
}

export interface CreditScoreCalculationData {
  // On-Chain (simulé pour l'instant, à remplacer par vraies données blockchain)
  walletAge?: number // en jours
  transactionCount?: number
  stablecoinRatio?: number // % de stablecoins dans le portefeuille
  
  // Off-Chain
  totalLoans: number
  activeLoans: number
  repaidLoans: number
  defaultedLoans: number
  totalBorrowed: number
  totalRepaid: number
  onTimePayments: number
  latePayments: number
  averageLTV: number
  
  // Assets
  totalNFTValue: number
  nftCount: number
  nftDiversity: number // nombre de types différents
  averageNFTValue: number
  lockedNFTValue: number
  
  // Reputation
  accountAge: number // en jours
  kycVerified: boolean
  amlVerified: boolean
  verificationLevel: string
  loanHistoryLength: number // en mois
}

/**
 * Calcule le Credit Tier à partir du score total
 * Correspond aux tranches définies dans le protocole
 */
function calculateTier(score: number): CreditTier {
  if (score >= 850) return 'A+'
  if (score >= 750) return 'A'
  if (score >= 600) return 'B'
  if (score >= 450) return 'C'
  return 'D'
}

/**
 * Calcule le score On-Chain (0-350)
 * Basé sur le comportement blockchain de l'utilisateur
 */
function calculateOnChainScore(data: CreditScoreCalculationData): number {
  let score = 0
  
  // Ancienneté du wallet (max 100 points)
  if (data.walletAge) {
    if (data.walletAge >= 730) score += 100 // 2+ ans
    else if (data.walletAge >= 365) score += 80 // 1-2 ans
    else if (data.walletAge >= 180) score += 60 // 6-12 mois
    else if (data.walletAge >= 90) score += 40 // 3-6 mois
    else if (data.walletAge >= 30) score += 20 // 1-3 mois
  } else {
    // Par défaut si pas de données: score moyen
    score += 50
  }
  
  // Volume de transactions (max 100 points)
  if (data.transactionCount) {
    if (data.transactionCount >= 1000) score += 100
    else if (data.transactionCount >= 500) score += 80
    else if (data.transactionCount >= 100) score += 60
    else if (data.transactionCount >= 50) score += 40
    else if (data.transactionCount >= 10) score += 20
  } else {
    score += 30
  }
  
  // Ratio de stablecoins (max 150 points)
  if (data.stablecoinRatio !== undefined) {
    if (data.stablecoinRatio >= 0.7) score += 150 // 70%+ stablecoins = très stable
    else if (data.stablecoinRatio >= 0.5) score += 120
    else if (data.stablecoinRatio >= 0.3) score += 90
    else if (data.stablecoinRatio >= 0.1) score += 60
    else score += 30
  } else {
    score += 75 // Score moyen par défaut
  }
  
  return Math.min(score, 350)
}

/**
 * Calcule le score Off-Chain (0-300)
 * Basé sur l'historique financier et de prêts
 */
function calculateOffChainScore(data: CreditScoreCalculationData): number {
  let score = 0
  
  // Historique de remboursement (max 150 points)
  const totalPayments = data.onTimePayments + data.latePayments
  if (totalPayments > 0) {
    const onTimeRatio = data.onTimePayments / totalPayments
    score += onTimeRatio * 150
  } else {
    // Pas d'historique = score neutre
    score += 75
  }
  
  // Ratio de remboursement (max 100 points)
  if (data.totalBorrowed > 0) {
    const repaymentRatio = data.totalRepaid / data.totalBorrowed
    if (repaymentRatio >= 1.0) score += 100 // Remboursé plus que emprunté
    else if (repaymentRatio >= 0.8) score += 80
    else if (repaymentRatio >= 0.5) score += 60
    else if (repaymentRatio >= 0.3) score += 40
    else score += 20
  } else {
    // Pas d'emprunt = score neutre
    score += 50
  }
  
  // Taux de défaut (max 50 points, pénalité)
  if (data.totalLoans > 0) {
    const defaultRatio = data.defaultedLoans / data.totalLoans
    if (defaultRatio === 0) score += 50 // Aucun défaut
    else if (defaultRatio <= 0.1) score += 30 // < 10% défaut
    else if (defaultRatio <= 0.2) score += 10 // < 20% défaut
    // > 20% défaut = 0 points
  } else {
    score += 25 // Pas d'historique = score neutre
  }
  
  return Math.min(score, 300)
}

/**
 * Calcule le score Assets (0-200)
 * Basé sur les NFT RWA détenus
 */
function calculateAssetsScore(data: CreditScoreCalculationData): number {
  let score = 0
  
  // Valeur totale des actifs (max 80 points)
  if (data.totalNFTValue >= 1000000) score += 80 // 1M+
  else if (data.totalNFTValue >= 500000) score += 70 // 500K-1M
  else if (data.totalNFTValue >= 250000) score += 60 // 250K-500K
  else if (data.totalNFTValue >= 100000) score += 50 // 100K-250K
  else if (data.totalNFTValue >= 50000) score += 40 // 50K-100K
  else if (data.totalNFTValue >= 10000) score += 30 // 10K-50K
  else if (data.totalNFTValue > 0) score += 20 // < 10K
  // Pas d'actifs = 0
  
  // Diversité des actifs (max 60 points)
  if (data.nftDiversity >= 4) score += 60 // 4+ types différents
  else if (data.nftDiversity === 3) score += 50
  else if (data.nftDiversity === 2) score += 40
  else if (data.nftDiversity === 1) score += 30
  else score += 10 // Pas de diversité
  
  // Nombre d'actifs (max 40 points)
  if (data.nftCount >= 10) score += 40
  else if (data.nftCount >= 5) score += 35
  else if (data.nftCount >= 3) score += 30
  else if (data.nftCount >= 2) score += 25
  else if (data.nftCount === 1) score += 15
  // Pas d'actifs = 0
  
  // Ratio d'actifs disponibles (max 20 points)
  if (data.totalNFTValue > 0) {
    const availableRatio = (data.totalNFTValue - data.lockedNFTValue) / data.totalNFTValue
    score += availableRatio * 20
  }
  
  return Math.min(score, 200)
}

/**
 * Calcule le score Reputation (0-150)
 * Basé sur la réputation et la confiance
 */
function calculateReputationScore(data: CreditScoreCalculationData): number {
  let score = 0
  
  // Ancienneté du compte (max 50 points)
  if (data.accountAge >= 730) score += 50 // 2+ ans
  else if (data.accountAge >= 365) score += 40 // 1-2 ans
  else if (data.accountAge >= 180) score += 30 // 6-12 mois
  else if (data.accountAge >= 90) score += 20 // 3-6 mois
  else if (data.accountAge >= 30) score += 10 // 1-3 mois
  else score += 5 // < 1 mois
  
  // Vérification KYC/AML (max 50 points)
  if (data.kycVerified && data.amlVerified) {
    if (data.verificationLevel === 'enhanced') score += 50
    else if (data.verificationLevel === 'standard') score += 40
    else score += 30
  } else if (data.kycVerified) {
    score += 20
  } else {
    score += 10
  }
  
  // Historique de prêts (max 50 points)
  if (data.loanHistoryLength >= 24) score += 50 // 2+ ans d'historique
  else if (data.loanHistoryLength >= 12) score += 40 // 1-2 ans
  else if (data.loanHistoryLength >= 6) score += 30 // 6-12 mois
  else if (data.loanHistoryLength >= 3) score += 20 // 3-6 mois
  else if (data.loanHistoryLength > 0) score += 10 // < 3 mois
  // Pas d'historique = 0
  
  return Math.min(score, 150)
}

/**
 * Récupère les données nécessaires pour le calcul du credit score
 */
export async function fetchCreditScoreData(userId: string): Promise<CreditScoreCalculationData> {
  // Récupérer les prêts (avec gestion d'erreur)
  let loans = null
  try {
    const { data, error } = await supabaseAdmin
      .from('loans')
      .select('*')
      .eq('user_id', userId)
    if (error) {
      console.error('Erreur récupération prêts:', error)
    } else {
      loans = data
    }
  } catch (error) {
    console.error('Erreur récupération prêts:', error)
  }
  
  // Récupérer les paiements via les prêts de l'utilisateur
  let payments = null
  try {
    const loanIds = loans?.map(l => l.id) || []
    if (loanIds.length > 0) {
      const { data, error } = await supabaseAdmin
        .from('payments')
        .select('*')
        .in('loan_id', loanIds)
      if (error) {
        console.error('Erreur récupération paiements:', error)
      } else {
        payments = data
      }
    }
  } catch (error) {
    console.error('Erreur récupération paiements:', error)
  }
  
  // Récupérer les NFT assets
  let nftAssets = null
  try {
    const { data, error } = await supabaseAdmin
      .from('nft_assets')
      .select('*')
      .eq('user_id', userId)
    if (error) {
      console.error('Erreur récupération NFT assets:', error)
    } else {
      nftAssets = data
    }
  } catch (error) {
    console.error('Erreur récupération NFT assets:', error)
  }
  
  // Récupérer les informations utilisateur
  let user = null
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('created_at, kyc_verified, aml_verified, verification_level')
      .eq('id', userId)
      .single()
    if (error) {
      console.error('Erreur récupération utilisateur:', error)
    } else {
      user = data
    }
  } catch (error) {
    console.error('Erreur récupération utilisateur:', error)
  }
  
  // Calculer les métriques Off-Chain
  const totalLoans = loans?.length || 0
  const activeLoans = loans?.filter(l => l.status === 'active').length || 0
  const repaidLoans = loans?.filter(l => l.status === 'repaid').length || 0
  const defaultedLoans = loans?.filter(l => l.status === 'default').length || 0
  
  const totalBorrowed = loans?.reduce((sum, l) => sum + parseFloat(l.amount || '0'), 0) || 0
  const totalRepaid = loans?.reduce((sum, l) => sum + parseFloat(l.total_paid || '0'), 0) || 0
  
  const onTimePayments = payments?.filter(p => {
    const paymentDate = new Date(p.payment_date)
    const loan = loans?.find(l => l.id === p.loan_id)
    if (!loan) return false
    const dueDate = new Date(loan.next_payment_date || loan.end_date)
    return paymentDate <= dueDate && p.status === 'paid'
  }).length || 0
  
  const latePayments = payments?.filter(p => {
    const paymentDate = new Date(p.payment_date)
    const loan = loans?.find(l => l.id === p.loan_id)
    if (!loan) return false
    const dueDate = new Date(loan.next_payment_date || loan.end_date)
    return paymentDate > dueDate || p.status === 'overdue'
  }).length || 0
  
  const averageLTV = loans && loans.length > 0
    ? loans.reduce((sum, l) => sum + parseFloat(l.ltv || '0'), 0) / loans.length
    : 0
  
  // Calculer les métriques Assets
  const totalNFTValue = nftAssets?.reduce((sum, nft) => sum + parseFloat(nft.value || '0'), 0) || 0
  const nftCount = nftAssets?.length || 0
  const nftTypes = new Set(nftAssets?.map(nft => nft.asset_type) || [])
  const nftDiversity = nftTypes.size
  const averageNFTValue = nftCount > 0 ? totalNFTValue / nftCount : 0
  const lockedNFTValue = nftAssets?.filter(nft => nft.status === 'locked')
    .reduce((sum, nft) => sum + parseFloat(nft.value || '0'), 0) || 0
  
  // Calculer les métriques Reputation
  const accountCreatedAt = user?.created_at ? new Date(user.created_at) : new Date()
  const accountAge = Math.floor((Date.now() - accountCreatedAt.getTime()) / (1000 * 60 * 60 * 24))
  
  const oldestLoan = loans && loans.length > 0
    ? loans.reduce((oldest, loan) => {
        const loanDate = new Date(loan.start_date)
        return loanDate < oldest ? loanDate : oldest
      }, new Date(loans[0].start_date))
    : null
  
  const loanHistoryLength = oldestLoan
    ? Math.floor((Date.now() - oldestLoan.getTime()) / (1000 * 60 * 60 * 24 * 30))
    : 0
  
  return {
    // On-Chain (simulé pour l'instant)
    walletAge: accountAge, // Utilise l'âge du compte comme proxy
    transactionCount: totalLoans * 10, // Estimation basée sur les prêts
    stablecoinRatio: 0.5, // Par défaut
    
    // Off-Chain
    totalLoans,
    activeLoans,
    repaidLoans,
    defaultedLoans,
    totalBorrowed,
    totalRepaid,
    onTimePayments,
    latePayments,
    averageLTV,
    
    // Assets
    totalNFTValue,
    nftCount,
    nftDiversity,
    averageNFTValue,
    lockedNFTValue,
    
    // Reputation
    accountAge,
    kycVerified: user?.kyc_verified || false,
    amlVerified: user?.aml_verified || false,
    verificationLevel: user?.verification_level || 'basic',
    loanHistoryLength,
  }
}

/**
 * Calcule le credit score complet à partir des données utilisateur
 */
export async function calculateCreditScore(userId: string): Promise<CreditScoreComponents> {
  // Récupérer les données
  const data = await fetchCreditScoreData(userId)
  
  // Calculer chaque composante
  const onChainScore = calculateOnChainScore(data)
  const offChainScore = calculateOffChainScore(data)
  const assetsScore = calculateAssetsScore(data)
  const reputationScore = calculateReputationScore(data)
  
  // Score total (somme des composantes)
  const totalScore = Math.round(onChainScore + offChainScore + assetsScore + reputationScore)
  
  // Calculer le tier
  const tier = calculateTier(totalScore)
  
  return {
    onChainScore: Math.round(onChainScore),
    offChainScore: Math.round(offChainScore),
    assetsScore: Math.round(assetsScore),
    reputationScore: Math.round(reputationScore),
    totalScore,
    tier,
  }
}
