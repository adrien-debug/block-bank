'use client'

import { useState } from 'react'
import { formatNumber, formatDateShort } from '@/lib/utils'
import ShieldIcon from '../icons/ShieldIcon'
import InfoIcon from '../icons/InfoIcon'
import ChartIcon from '../icons/ChartIcon'
import WarningIcon from '../icons/WarningIcon'

type InsuranceTab = 'policies' | 'coverage' | 'claims' | 'history'
type InsuranceStatus = 'active' | 'expired' | 'cancelled' | 'pending'
type RiskType = 'BORROWER_DEFAULT' | 'MARKET_RISK' | 'ASSET_RISK' | 'OPERATIONAL_RISK' | 'LEGAL_RISK'

interface InsurancePolicy {
  id: string
  loanId: string
  loanNumber: string
  loanAmount: number
  currency: 'USDC' | 'USDT' | 'DAI'
  status: InsuranceStatus
  startDate: string
  endDate: string
  renewalDate: string
  borrowerDefaultCoverage: number // 50, 75, 100
  marketRiskCoverage: number // 0, 50, 75
  assetRiskCoverage: number // 0, 50, 75
  operationalRiskCoverage?: number // 0, 50, 75
  legalRiskCoverage?: number // 0, 50, 75
  totalCoverage: number // %
  annualPremium: number
  monthlyPremium: number
  creditTier: 'A' | 'B' | 'C' | 'D'
  nftRiskClass: 'SAFE' | 'MODERATE' | 'RISKY'
  impactOnLTV: number // +5% si assurance complète
  impactOnRate: number // -0.5% si assurance complète
  coveredRisks: RiskType[]
  txHash?: string
}

interface Claim {
  id: string
  policyId: string
  loanId: string
  type: RiskType
  amount: number
  status: 'pending' | 'approved' | 'rejected' | 'paid'
  submittedDate: string
  processedDate?: string
  description: string
  evidence?: string[]
}

interface HistoryEntry {
  id: string
  date: string
  type: 'CREATED' | 'RENEWED' | 'CANCELLED' | 'CLAIM_SUBMITTED' | 'CLAIM_APPROVED' | 'CLAIM_PAID'
  policyId?: string
  claimId?: string
  description: string
  amount?: number
  currency?: string
}

export default function Insurance() {
  const [activeTab, setActiveTab] = useState<InsuranceTab>('policies')
  const [selectedPolicy, setSelectedPolicy] = useState<InsurancePolicy | null>(null)
  const [showNewPolicyModal, setShowNewPolicyModal] = useState(false)
  const [showClaimModal, setShowClaimModal] = useState(false)

  const insurancePolicies: InsurancePolicy[] = [
    {
      id: 'POL-2024-001',
      loanId: 'LOAN-2024-001',
      loanNumber: 'LOAN-2024-001',
      loanAmount: 100000,
      currency: 'USDC',
      status: 'active',
      startDate: '2024-01-15',
      endDate: '2025-01-15',
      renewalDate: '2025-01-15',
      borrowerDefaultCoverage: 100,
      marketRiskCoverage: 75,
      assetRiskCoverage: 0,
      totalCoverage: 80,
      annualPremium: 2400,
      monthlyPremium: 200,
      creditTier: 'A',
      nftRiskClass: 'SAFE',
      impactOnLTV: 5,
      impactOnRate: -0.5,
      coveredRisks: ['BORROWER_DEFAULT', 'MARKET_RISK'],
      txHash: '0xabc123...',
    },
    {
      id: 'POL-2024-002',
      loanId: 'LOAN-2024-002',
      loanNumber: 'LOAN-2024-002',
      loanAmount: 50000,
      currency: 'USDC',
      status: 'active',
      startDate: '2024-01-20',
      endDate: '2025-01-20',
      renewalDate: '2025-01-20',
      borrowerDefaultCoverage: 75,
      marketRiskCoverage: 0,
      assetRiskCoverage: 0,
      totalCoverage: 75,
      annualPremium: 1200,
      monthlyPremium: 100,
      creditTier: 'A',
      nftRiskClass: 'MODERATE',
      impactOnLTV: 0,
      impactOnRate: 0,
      coveredRisks: ['BORROWER_DEFAULT'],
      txHash: '0xdef456...',
    },
  ]

  const claims: Claim[] = [
    {
      id: 'CLAIM-2024-001',
      policyId: 'POL-2024-001',
      loanId: 'LOAN-2024-001',
      type: 'MARKET_RISK',
      amount: 5000,
      status: 'pending',
      submittedDate: '2024-02-01',
      description: 'Perte de valeur due à la volatilité du marché immobilier',
      evidence: ['ipfs://QmXxxx...', 'ipfs://QmYyyy...'],
    },
  ]

  const history: HistoryEntry[] = [
    {
      id: 'HIST-001',
      date: '2024-01-15',
      type: 'CREATED',
      policyId: 'POL-2024-001',
      description: 'Police créée pour LOAN-2024-001',
      amount: 2400,
      currency: 'USDC',
    },
    {
      id: 'HIST-002',
      date: '2024-01-20',
      type: 'CREATED',
      policyId: 'POL-2024-002',
      description: 'Police créée pour LOAN-2024-002',
      amount: 1200,
      currency: 'USDC',
    },
    {
      id: 'HIST-003',
      date: '2024-02-01',
      type: 'CLAIM_SUBMITTED',
      claimId: 'CLAIM-2024-001',
      description: 'Réclamation soumise pour POL-2024-001',
      amount: 5000,
      currency: 'USDC',
    },
  ]

  const stats = {
    totalPolicies: insurancePolicies.length,
    activePolicies: insurancePolicies.filter(p => p.status === 'active').length,
    totalCoverage: insurancePolicies.reduce((sum, p) => sum + (p.totalCoverage * p.loanAmount / 100), 0),
    totalAnnualPremium: insurancePolicies.reduce((sum, p) => sum + p.annualPremium, 0),
    totalMonthlyPremium: insurancePolicies.reduce((sum, p) => sum + p.monthlyPremium, 0),
    pendingClaims: claims.filter(c => c.status === 'pending').length,
  }

  const calculatePremium = (
    loanAmount: number,
    creditTier: 'A' | 'B' | 'C' | 'D',
    nftRiskClass: 'SAFE' | 'MODERATE' | 'RISKY',
    borrowerDefault: number,
    marketRisk: number,
    assetRisk: number
  ) => {
    // Base rate selon credit tier
    const baseRates = { A: 0.0075, B: 0.015, C: 0.025, D: 0.04 }
    const baseRate = baseRates[creditTier]

    // Ajustement selon risque NFT
    const riskMultipliers = { SAFE: 0.8, MODERATE: 1.0, RISKY: 1.3 }
    const adjustedRate = baseRate * riskMultipliers[nftRiskClass]

    // Base premium
    let basePremium = loanAmount * adjustedRate

    // Multiplicateurs selon couverture
    const borrowerMultipliers = { 50: 0.7, 75: 1.0, 100: 1.4 }
    const marketMultipliers = { 0: 0, 50: 0.3, 75: 0.5 }
    const assetMultipliers = { 0: 0, 50: 0.2, 75: 0.35 }

    const borrowerMult = borrowerMultipliers[borrowerDefault as keyof typeof borrowerMultipliers] || 1.0
    const marketMult = marketMultipliers[marketRisk as keyof typeof marketMultipliers] || 0
    const assetMult = assetMultipliers[assetRisk as keyof typeof assetMultipliers] || 0

    const totalPremium = basePremium * (1 + borrowerMult - 1) * (1 + marketMult) * (1 + assetMult)

    // Réduction 10% si assurance complète (100% borrower + 75% market + 75% asset)
    const isFullCoverage = borrowerDefault === 100 && marketRisk === 75 && assetRisk === 75
    const finalPremium = isFullCoverage ? totalPremium * 0.9 : totalPremium

    return {
      basePremium,
      totalPremium,
      finalPremium,
      monthlyPremium: finalPremium / 12,
    }
  }

  const tabs = [
    { id: 'policies' as InsuranceTab, label: 'Active Policies', icon: ShieldIcon },
    { id: 'coverage' as InsuranceTab, label: 'Coverage Options', icon: InfoIcon },
    { id: 'claims' as InsuranceTab, label: 'Claims', icon: WarningIcon },
    { id: 'history' as InsuranceTab, label: 'History', icon: ChartIcon },
  ]

  const getRiskLabel = (risk: RiskType) => {
    const labels = {
      BORROWER_DEFAULT: 'Défaut emprunteur',
      MARKET_RISK: 'Risque marché',
      ASSET_RISK: 'Risque actif',
      OPERATIONAL_RISK: 'Risque opérationnel',
      LEGAL_RISK: 'Risque juridique',
    }
    return labels[risk]
  }

  const getStatusLabel = (status: InsuranceStatus) => {
    const labels = {
      active: 'Actif',
      expired: 'Expiré',
      cancelled: 'Annulé',
      pending: 'En attente',
    }
    return labels[status]
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Mes Assurances</h1>
          <p className="page-subtitle">Gérez vos polices d'assurance et vos couvertures</p>
        </div>
        <button 
          className="btn-primary"
          onClick={() => setShowNewPolicyModal(true)}
        >
          + Nouvelle assurance
        </button>
      </div>

      {/* Navigation Menu Horizontal */}
      <div className="insurance-nav-menu">
        <nav className="sidebar-nav horizontal-nav">
          {tabs.map((tab) => {
            const IconComponent = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
              >
                <span className="nav-icon">
                  <IconComponent />
                </span>
                <span className="nav-label">{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>
      
      {/* Statistiques */}
      <div className="insurance-stats">
        <div className="stat-card-insurance">
          <div className="stat-label-insurance">Polices actives</div>
          <div className="stat-value-insurance">{stats.activePolicies}</div>
          <div className="stat-subtitle-insurance">sur {stats.totalPolicies} total</div>
        </div>
        <div className="stat-card-insurance">
          <div className="stat-label-insurance">Couverture totale</div>
          <div className="stat-value-insurance">{formatNumber(stats.totalCoverage)} USDC</div>
          <div className="stat-subtitle-insurance">Valeur couverte</div>
        </div>
        <div className="stat-card-insurance">
          <div className="stat-label-insurance">Prime annuelle totale</div>
          <div className="stat-value-insurance">{formatNumber(stats.totalAnnualPremium)} USDC</div>
          <div className="stat-subtitle-insurance">Répartie sur {stats.activePolicies} polices</div>
        </div>
        <div className="stat-card-insurance">
          <div className="stat-label-insurance">Prime mensuelle</div>
          <div className="stat-value-insurance">{formatNumber(stats.totalMonthlyPremium)} USDC</div>
          <div className="stat-subtitle-insurance">Par mois</div>
        </div>
        <div className="stat-card-insurance">
          <div className="stat-label-insurance">Réclamations en attente</div>
          <div className="stat-value-insurance">{stats.pendingClaims}</div>
          <div className="stat-subtitle-insurance">À traiter</div>
        </div>
      </div>

      {activeTab === 'policies' && (
        <div className="insurance-policies">
          <h2>Polices actives</h2>
          {insurancePolicies.length === 0 ? (
            <div className="insurance-empty-state">
              <div className="empty-state-icon">🛡️</div>
              <h3>Aucune police active</h3>
              <p>Souscrivez une assurance pour protéger vos prêts</p>
              <button 
                className="btn-primary" 
                style={{ marginTop: 'var(--space-4)' }}
                onClick={() => setShowNewPolicyModal(true)}
              >
                + Nouvelle assurance
              </button>
            </div>
          ) : (
            <div className="policies-grid">
              {insurancePolicies.map((policy) => (
                <div key={policy.id} className="policy-card">
                  <div className="policy-header">
                    <div>
                      <h3>{policy.loanNumber}</h3>
                      <p className="policy-loan-amount">Prêt: {formatNumber(policy.loanAmount)} {policy.currency}</p>
                    </div>
                    <span className={`policy-status policy-status-${policy.status}`}>
                      {getStatusLabel(policy.status)}
                    </span>
                  </div>
                  
                  <div className="policy-coverage-section">
                    <div className="coverage-main">
                      <span className="coverage-label">Couverture totale</span>
                      <span className="coverage-value">{policy.totalCoverage}%</span>
                    </div>
                    <div className="coverage-breakdown">
                      <div className="coverage-item">
                        <span>Défaut emprunteur</span>
                        <span>{policy.borrowerDefaultCoverage}%</span>
                      </div>
                      {policy.marketRiskCoverage > 0 && (
                        <div className="coverage-item">
                          <span>Risque marché</span>
                          <span>{policy.marketRiskCoverage}%</span>
                        </div>
                      )}
                      {policy.assetRiskCoverage > 0 && (
                        <div className="coverage-item">
                          <span>Risque actif</span>
                          <span>{policy.assetRiskCoverage}%</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="policy-premium-section">
                    <div className="premium-item">
                      <span className="premium-label">Prime annuelle</span>
                      <span className="premium-value">{formatNumber(policy.annualPremium)} {policy.currency}</span>
                    </div>
                    <div className="premium-item">
                      <span className="premium-label">Prime mensuelle</span>
                      <span className="premium-value">{formatNumber(policy.monthlyPremium)} {policy.currency}</span>
                    </div>
                  </div>

                  <div className="policy-dates">
                    <div className="date-item">
                      <span className="date-label">Date début</span>
                      <span className="date-value">{formatDateShort(policy.startDate)}</span>
                    </div>
                    <div className="date-item">
                      <span className="date-label">Date expiration</span>
                      <span className="date-value">{formatDateShort(policy.endDate)}</span>
                    </div>
                    <div className="date-item">
                      <span className="date-label">Renouvellement</span>
                      <span className="date-value">{formatDateShort(policy.renewalDate)}</span>
                    </div>
                  </div>

                  {policy.impactOnLTV > 0 || policy.impactOnRate < 0 && (
                    <div className="policy-benefits">
                      <h4>Avantages sur le prêt</h4>
                      <div className="benefits-list">
                        {policy.impactOnLTV > 0 && (
                          <span className="benefit-badge">+{policy.impactOnLTV}% LTV</span>
                        )}
                        {policy.impactOnRate < 0 && (
                          <span className="benefit-badge">{policy.impactOnRate}% taux</span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="policy-actions">
                    <button 
                      className="btn-secondary"
                      onClick={() => setSelectedPolicy(policy)}
                    >
                      Voir détails
                    </button>
                    {policy.status === 'active' && (
                      <button className="btn-primary">
                        Renouveler
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'coverage' && (
        <div className="insurance-coverage">
          <h2>Options de couverture</h2>
          <p className="coverage-intro">
            Chaque prêt peut souscrire une couverture partielle ou totale sur un ou plusieurs risques.
            Les primes sont ajustées selon votre tranche de score de crédit, la qualité de l'actif NFT,
            la juridiction, et la durée du prêt.
          </p>
          
          <div className="coverage-options-grid">
            <div className="coverage-card">
              <div className="coverage-card-header">
                <h3>Défaut de l'emprunteur</h3>
                <p>Protection contre l'incapacité de rembourser selon les conditions</p>
              </div>
              <div className="coverage-levels">
                <div className="coverage-option">
                  <span className="coverage-badge">50%</span>
                  <span className="coverage-multiplier">Prime × 0.7</span>
                </div>
                <div className="coverage-option">
                  <span className="coverage-badge">75%</span>
                  <span className="coverage-multiplier">Prime × 1.0</span>
                </div>
                <div className="coverage-option active">
                  <span className="coverage-badge">100%</span>
                  <span className="coverage-multiplier">Prime × 1.4</span>
                </div>
              </div>
              <div className="coverage-description">
                Couvre les pertes en cas de défaut de paiement de l'emprunteur.
                Recommandé pour tous les prêts.
              </div>
            </div>

            <div className="coverage-card">
              <div className="coverage-card-header">
                <h3>Risque de marché</h3>
                <p>Protection contre la chute de valeur rapide de l'actif vs prix d'achat</p>
              </div>
              <div className="coverage-levels">
                <div className="coverage-option">
                  <span className="coverage-badge">0%</span>
                  <span className="coverage-multiplier">Non incluse</span>
                </div>
                <div className="coverage-option">
                  <span className="coverage-badge">50%</span>
                  <span className="coverage-multiplier">Prime × 0.3</span>
                </div>
                <div className="coverage-option">
                  <span className="coverage-badge">75%</span>
                  <span className="coverage-multiplier">Prime × 0.5</span>
                </div>
              </div>
              <div className="coverage-description">
                Protège contre la volatilité des marchés et les fluctuations de valeur des actifs.
                Utile pour les actifs sensibles aux cycles économiques.
              </div>
            </div>

            <div className="coverage-card">
              <div className="coverage-card-header">
                <h3>Risque actif</h3>
                <p>Protection contre la dévaluation de l'actif sous-jacent</p>
              </div>
              <div className="coverage-levels">
                <div className="coverage-option">
                  <span className="coverage-badge">0%</span>
                  <span className="coverage-multiplier">Non incluse</span>
                </div>
                <div className="coverage-option">
                  <span className="coverage-badge">50%</span>
                  <span className="coverage-multiplier">Prime × 0.2</span>
                </div>
                <div className="coverage-option">
                  <span className="coverage-badge">75%</span>
                  <span className="coverage-multiplier">Prime × 0.35</span>
                </div>
              </div>
              <div className="coverage-description">
                Couvre les pertes dues à la dépréciation ou à la détérioration de l'actif.
                Important pour les actifs dépréciables.
              </div>
            </div>

            <div className="coverage-card">
              <div className="coverage-card-header">
                <h3>Risque opérationnel</h3>
                <p>Protection contre les incidents (incendie, panne majeure, etc.)</p>
              </div>
              <div className="coverage-levels">
                <div className="coverage-option">
                  <span className="coverage-badge">0%</span>
                  <span className="coverage-multiplier">Non incluse</span>
                </div>
                <div className="coverage-option">
                  <span className="coverage-badge">50%</span>
                  <span className="coverage-multiplier">Prime × 0.25</span>
                </div>
                <div className="coverage-option">
                  <span className="coverage-badge">75%</span>
                  <span className="coverage-multiplier">Prime × 0.4</span>
                </div>
              </div>
              <div className="coverage-description">
                Couvre les pertes dues à des incidents opérationnels (incendie, panne de site de mining, etc.).
                Recommandé pour les actifs d'infrastructure.
              </div>
            </div>

            <div className="coverage-card">
              <div className="coverage-card-header">
                <h3>Risque juridique / réglementaire</h3>
                <p>Protection contre les blocages, interdictions, litiges</p>
              </div>
              <div className="coverage-levels">
                <div className="coverage-option">
                  <span className="coverage-badge">0%</span>
                  <span className="coverage-multiplier">Non incluse</span>
                </div>
                <div className="coverage-option">
                  <span className="coverage-badge">50%</span>
                  <span className="coverage-multiplier">Prime × 0.3</span>
                </div>
                <div className="coverage-option">
                  <span className="coverage-badge">75%</span>
                  <span className="coverage-multiplier">Prime × 0.45</span>
                </div>
              </div>
              <div className="coverage-description">
                Protège contre les risques juridiques et réglementaires (blocage temporaire, interdiction, litige).
                Important selon la juridiction de l'actif.
              </div>
            </div>
          </div>

          {/* Calcul de prime exemple */}
          <div className="premium-calculator">
            <h3>Calculateur de prime</h3>
            <div className="calculator-card">
              <div className="calculator-info">
                <p>
                  Les primes sont calculées selon votre tranche de score de crédit et le risque de l'actif NFT.
                  Avec une assurance complète (100% défaut + 75% marché + 75% actif), vous bénéficiez de :
                </p>
                <ul>
                  <li>+5% LTV maximum</li>
                  <li>-0.5% APY sur le taux d'intérêt</li>
                  <li>Réduction de 10% sur la prime totale</li>
                </ul>
              </div>
              <div className="calculator-example">
                <h4>Exemple de calcul</h4>
                <div className="example-details">
                  <div className="example-item">
                    <span>Prêt: 100,000 USDC</span>
                    <span>Tranche A, NFT SAFE</span>
                  </div>
                  <div className="example-item">
                    <span>Prime de base: 750 USDC/an (0.75%)</span>
                    <span>Ajustement NFT SAFE: × 0.8 = 600 USDC</span>
                  </div>
                  <div className="example-item">
                    <span>Couverture 100% défaut: × 1.4 = 840 USDC</span>
                    <span>+ 75% marché: × 1.5 = 1,260 USDC</span>
                  </div>
                  <div className="example-item">
                    <span>+ 75% actif: × 1.35 = 1,701 USDC</span>
                    <span>Réduction complète -10%: 1,531 USDC/an</span>
                  </div>
                  <div className="example-total">
                    <span>Prime finale: 1,531 USDC/an (127.6 USDC/mois)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'claims' && (
        <div className="insurance-claims">
          <div className="claims-header">
            <h2>Réclamations</h2>
            <button 
              className="btn-primary"
              onClick={() => setShowClaimModal(true)}
            >
              + Nouvelle réclamation
            </button>
          </div>

          {claims.length === 0 ? (
            <div className="claims-empty-state">
              <div className="empty-state-icon">📋</div>
              <h3>Aucune réclamation active</h3>
              <p>Vous pouvez soumettre une réclamation si un événement couvert se produit</p>
              <button 
                className="btn-primary" 
                style={{ marginTop: 'var(--space-4)' }}
                onClick={() => setShowClaimModal(true)}
              >
                + Nouvelle réclamation
              </button>
            </div>
          ) : (
            <div className="claims-list">
              {claims.map((claim) => (
                <div key={claim.id} className="claim-card">
                  <div className="claim-header">
                    <div>
                      <h3>{claim.id}</h3>
                      <p className="claim-policy">Police: {claim.policyId}</p>
                    </div>
                    <span className={`claim-status claim-status-${claim.status}`}>
                      {claim.status === 'pending' ? '⏳ En attente' :
                       claim.status === 'approved' ? '✓ Approuvée' :
                       claim.status === 'rejected' ? '✗ Rejetée' : '💰 Payée'}
                    </span>
                  </div>
                  
                  <div className="claim-details">
                    <div className="claim-detail-item">
                      <span className="claim-detail-label">Type de risque</span>
                      <span className="claim-detail-value">{getRiskLabel(claim.type)}</span>
                    </div>
                    <div className="claim-detail-item">
                      <span className="claim-detail-label">Montant réclamé</span>
                      <span className="claim-detail-value">{formatNumber(claim.amount)} USDC</span>
                    </div>
                    <div className="claim-detail-item">
                      <span className="claim-detail-label">Date de soumission</span>
                      <span className="claim-detail-value">{formatDateShort(claim.submittedDate)}</span>
                    </div>
                    {claim.processedDate && (
                      <div className="claim-detail-item">
                        <span className="claim-detail-label">Date de traitement</span>
                        <span className="claim-detail-value">{formatDateShort(claim.processedDate)}</span>
                      </div>
                    )}
                    <div className="claim-detail-item">
                      <span className="claim-detail-label">Description</span>
                      <span className="claim-detail-value">{claim.description}</span>
                    </div>
                    {claim.evidence && claim.evidence.length > 0 && (
                      <div className="claim-evidence">
                        <span className="evidence-label">Preuves:</span>
                        <div className="evidence-list">
                          {claim.evidence.map((ev, idx) => (
                            <a key={idx} href={ev} target="_blank" rel="noopener noreferrer" className="evidence-link">
                              Preuve {idx + 1}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="claim-actions">
                    <button className="btn-secondary">Voir détails</button>
                    {claim.status === 'pending' && (
                      <button className="btn-secondary">Modifier</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="insurance-history">
          <h2>Historique</h2>
          {history.length === 0 ? (
            <div className="history-empty-state">
              <p>Aucun historique disponible</p>
            </div>
          ) : (
            <div className="history-timeline">
              {history.map((entry) => (
                <div key={entry.id} className="history-item-insurance">
                  <div className="history-date-insurance">
                    {formatDateShort(entry.date)}
                  </div>
                  <div className="history-content-insurance">
                    <div className="history-title-insurance">
                      {entry.type === 'CREATED' && '🛡️ Police créée'}
                      {entry.type === 'RENEWED' && '🔄 Police renouvelée'}
                      {entry.type === 'CANCELLED' && '✗ Police annulée'}
                      {entry.type === 'CLAIM_SUBMITTED' && '📋 Réclamation soumise'}
                      {entry.type === 'CLAIM_APPROVED' && '✓ Réclamation approuvée'}
                      {entry.type === 'CLAIM_PAID' && '💰 Réclamation payée'}
                    </div>
                    <div className="history-description-insurance">{entry.description}</div>
                    {entry.policyId && (
                      <div className="history-reference">Police: {entry.policyId}</div>
                    )}
                    {entry.claimId && (
                      <div className="history-reference">Réclamation: {entry.claimId}</div>
                    )}
                  </div>
                  {entry.amount && (
                    <div className="history-amount-insurance">
                      {entry.type === 'CREATED' || entry.type === 'RENEWED' ? '-' : '+'}
                      {formatNumber(entry.amount)} {entry.currency}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal détails police */}
      {selectedPolicy && (
        <div className="policy-detail-modal" onClick={() => setSelectedPolicy(null)}>
          <div className="policy-detail-content" onClick={(e) => e.stopPropagation()}>
            <div className="policy-detail-header">
              <div>
                <h2>{selectedPolicy.loanNumber}</h2>
                <span className={`policy-status policy-status-${selectedPolicy.status}`}>
                  {getStatusLabel(selectedPolicy.status)}
                </span>
              </div>
              <button className="btn-ghost" onClick={() => setSelectedPolicy(null)}>✕</button>
            </div>

            <div className="policy-detail-body">
              {/* Informations prêt */}
              <div className="detail-section">
                <h3>Informations du prêt</h3>
                <div className="policy-info-grid">
                  <div className="info-item">
                    <span className="info-label">Numéro de prêt</span>
                    <span className="info-value">{selectedPolicy.loanNumber}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Montant du prêt</span>
                    <span className="info-value">{formatNumber(selectedPolicy.loanAmount)} {selectedPolicy.currency}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Tranche de crédit</span>
                    <span className="info-value">Tier {selectedPolicy.creditTier}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Risque NFT</span>
                    <span className="info-value">{selectedPolicy.nftRiskClass}</span>
                  </div>
                </div>
              </div>

              {/* Couvertures */}
              <div className="detail-section">
                <h3>Couvertures</h3>
                <div className="coverage-details-grid">
                  <div className="coverage-detail-item">
                    <span className="coverage-detail-label">Défaut emprunteur</span>
                    <span className="coverage-detail-value">{selectedPolicy.borrowerDefaultCoverage}%</span>
                  </div>
                  <div className="coverage-detail-item">
                    <span className="coverage-detail-label">Risque marché</span>
                    <span className="coverage-detail-value">{selectedPolicy.marketRiskCoverage}%</span>
                  </div>
                  <div className="coverage-detail-item">
                    <span className="coverage-detail-label">Risque actif</span>
                    <span className="coverage-detail-value">{selectedPolicy.assetRiskCoverage}%</span>
                  </div>
                  {selectedPolicy.operationalRiskCoverage && (
                    <div className="coverage-detail-item">
                      <span className="coverage-detail-label">Risque opérationnel</span>
                      <span className="coverage-detail-value">{selectedPolicy.operationalRiskCoverage}%</span>
                    </div>
                  )}
                  {selectedPolicy.legalRiskCoverage && (
                    <div className="coverage-detail-item">
                      <span className="coverage-detail-label">Risque juridique</span>
                      <span className="coverage-detail-value">{selectedPolicy.legalRiskCoverage}%</span>
                    </div>
                  )}
                  <div className="coverage-detail-item total">
                    <span className="coverage-detail-label">Couverture totale</span>
                    <span className="coverage-detail-value">{selectedPolicy.totalCoverage}%</span>
                  </div>
                </div>
              </div>

              {/* Primes */}
              <div className="detail-section">
                <h3>Primes</h3>
                <div className="premium-details">
                  <div className="premium-detail-item">
                    <span className="premium-detail-label">Prime annuelle</span>
                    <span className="premium-detail-value">{formatNumber(selectedPolicy.annualPremium)} {selectedPolicy.currency}</span>
                  </div>
                  <div className="premium-detail-item">
                    <span className="premium-detail-label">Prime mensuelle</span>
                    <span className="premium-detail-value">{formatNumber(selectedPolicy.monthlyPremium)} {selectedPolicy.currency}</span>
                  </div>
                  <div className="premium-detail-item">
                    <span className="premium-detail-label">Prochain paiement</span>
                    <span className="premium-detail-value">{formatNumber(selectedPolicy.monthlyPremium)} {selectedPolicy.currency}</span>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="detail-section">
                <h3>Dates importantes</h3>
                <div className="dates-details">
                  <div className="date-detail-item">
                    <span className="date-detail-label">Date de début</span>
                    <span className="date-detail-value">{formatDateShort(selectedPolicy.startDate)}</span>
                  </div>
                  <div className="date-detail-item">
                    <span className="date-detail-label">Date d'expiration</span>
                    <span className="date-detail-value">{formatDateShort(selectedPolicy.endDate)}</span>
                  </div>
                  <div className="date-detail-item">
                    <span className="date-detail-label">Date de renouvellement</span>
                    <span className="date-detail-value">{formatDateShort(selectedPolicy.renewalDate)}</span>
                  </div>
                </div>
              </div>

              {/* Avantages */}
              {(selectedPolicy.impactOnLTV > 0 || selectedPolicy.impactOnRate < 0) && (
                <div className="detail-section">
                  <h3>Avantages sur le prêt</h3>
                  <div className="benefits-details">
                    {selectedPolicy.impactOnLTV > 0 && (
                      <div className="benefit-detail-item">
                        <span className="benefit-icon">✓</span>
                        <div>
                          <span className="benefit-label">LTV maximum augmenté</span>
                          <span className="benefit-value">+{selectedPolicy.impactOnLTV}%</span>
                        </div>
                      </div>
                    )}
                    {selectedPolicy.impactOnRate < 0 && (
                      <div className="benefit-detail-item">
                        <span className="benefit-icon">✓</span>
                        <div>
                          <span className="benefit-label">Taux d'intérêt réduit</span>
                          <span className="benefit-value">{selectedPolicy.impactOnRate}% APY</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Transaction */}
              {selectedPolicy.txHash && (
                <div className="detail-section">
                  <h3>Transaction blockchain</h3>
                  <div className="tx-info">
                    <a 
                      href={`https://etherscan.io/tx/${selectedPolicy.txHash}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="tx-link"
                    >
                      {selectedPolicy.txHash}
                    </a>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="detail-section">
                <h3>Actions</h3>
                <div className="policy-actions-grid">
                  {selectedPolicy.status === 'active' && (
                    <>
                      <button className="btn-primary">Renouveler la police</button>
                      <button className="btn-secondary">Modifier la couverture</button>
                      <button className="btn-secondary">Voir sur blockchain</button>
                    </>
                  )}
                  {selectedPolicy.status === 'expired' && (
                    <button className="btn-primary">Renouveler la police</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal nouvelle police */}
      {showNewPolicyModal && (
        <div className="new-policy-modal" onClick={() => setShowNewPolicyModal(false)}>
          <div className="new-policy-content" onClick={(e) => e.stopPropagation()}>
            <div className="new-policy-header">
              <h2>Souscrire une nouvelle assurance</h2>
              <button className="btn-ghost" onClick={() => setShowNewPolicyModal(false)}>✕</button>
            </div>
            <form className="new-policy-form" onSubmit={(e) => {
              e.preventDefault()
              setShowNewPolicyModal(false)
            }}>
              <div className="form-group">
                <label>Prêt à assurer</label>
                <select required>
                  <option value="">Sélectionner un prêt</option>
                  <option value="LOAN-2024-001">LOAN-2024-001 - 100,000 USDC</option>
                  <option value="LOAN-2024-002">LOAN-2024-002 - 50,000 USDC</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Couverture défaut emprunteur</label>
                <select required>
                  <option value="50">50%</option>
                  <option value="75">75%</option>
                  <option value="100">100%</option>
                </select>
              </div>

              <div className="form-group">
                <label>Couverture risque marché</label>
                <select required>
                  <option value="0">0% (Non incluse)</option>
                  <option value="50">50%</option>
                  <option value="75">75%</option>
                </select>
              </div>

              <div className="form-group">
                <label>Couverture risque actif</label>
                <select required>
                  <option value="0">0% (Non incluse)</option>
                  <option value="50">50%</option>
                  <option value="75">75%</option>
                </select>
              </div>

              <div className="form-group">
                <label>Couverture risque opérationnel (optionnel)</label>
                <select>
                  <option value="0">0% (Non incluse)</option>
                  <option value="50">50%</option>
                  <option value="75">75%</option>
                </select>
              </div>

              <div className="form-group">
                <label>Couverture risque juridique (optionnel)</label>
                <select>
                  <option value="0">0% (Non incluse)</option>
                  <option value="50">50%</option>
                  <option value="75">75%</option>
                </select>
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setShowNewPolicyModal(false)} className="btn-secondary">
                  Annuler
                </button>
                <button type="submit" className="btn-primary">
                  Souscrire
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal nouvelle réclamation */}
      {showClaimModal && (
        <div className="new-claim-modal" onClick={() => setShowClaimModal(false)}>
          <div className="new-claim-content" onClick={(e) => e.stopPropagation()}>
            <div className="new-claim-header">
              <h2>Nouvelle réclamation</h2>
              <button className="btn-ghost" onClick={() => setShowClaimModal(false)}>✕</button>
            </div>
            <form className="new-claim-form" onSubmit={(e) => {
              e.preventDefault()
              setShowClaimModal(false)
            }}>
              <div className="form-group">
                <label>Police concernée</label>
                <select required>
                  <option value="">Sélectionner une police</option>
                  {insurancePolicies.map(policy => (
                    <option key={policy.id} value={policy.id}>
                      {policy.loanNumber} - {policy.totalCoverage}% couverture
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Type de risque</label>
                <select required>
                  <option value="">Sélectionner un type</option>
                  <option value="BORROWER_DEFAULT">Défaut emprunteur</option>
                  <option value="MARKET_RISK">Risque marché</option>
                  <option value="ASSET_RISK">Risque actif</option>
                  <option value="OPERATIONAL_RISK">Risque opérationnel</option>
                  <option value="LEGAL_RISK">Risque juridique</option>
                </select>
              </div>

              <div className="form-group">
                <label>Montant réclamé (USDC)</label>
                <input type="number" placeholder="5000" required />
              </div>

              <div className="form-group">
                <label>Description de l'événement</label>
                <textarea 
                  rows={5} 
                  placeholder="Décrivez en détail l'événement couvert qui s'est produit..."
                  required
                />
              </div>

              <div className="form-group">
                <label>Preuves (URLs IPFS ou liens)</label>
                <input type="text" placeholder="ipfs://QmXxxx..." />
                <small>Vous pouvez ajouter plusieurs preuves séparées par des virgules</small>
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setShowClaimModal(false)} className="btn-secondary">
                  Annuler
                </button>
                <button type="submit" className="btn-primary">
                  Soumettre la réclamation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
