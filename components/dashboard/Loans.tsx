'use client'

import { useState } from 'react'
import { formatNumber, formatDateShort } from '@/lib/utils'
import ShieldIcon from '../icons/ShieldIcon'
import InfoIcon from '../icons/InfoIcon'
import WarningIcon from '../icons/WarningIcon'
import ChartIcon from '../icons/ChartIcon'
import USDCIcon from '../icons/USDCIcon'

type LoanStatus = 'active' | 'repaid' | 'default' | 'liquidated' | 'closed'
type FilterStatus = 'all' | 'active' | 'repaid' | 'default'
type InsuranceTab = 'policies' | 'coverage' | 'claims' | 'history'
type InsuranceStatus = 'active' | 'expired' | 'cancelled' | 'pending'
type RiskType = 'BORROWER_DEFAULT' | 'MARKET_RISK' | 'ASSET_RISK' | 'OPERATIONAL_RISK' | 'LEGAL_RISK'

interface Payment {
  id: string
  date: string
  amount: number
  status: 'paid' | 'pending' | 'overdue'
  txHash?: string
}

interface Loan {
  id: number
  loanNumber: string
  amount: number
  currency: 'USDC' | 'USDT' | 'DAI'
  asset: {
    name: string
    type: string
    tokenId: string
    contractAddress: string
    currentValue: number
    image?: string
  }
  ltv: number
  rate: number
  term: number // months
  status: LoanStatus
  startDate: string
  endDate: string
  nextPaymentDate: string
  nextPaymentAmount: number
  remainingBalance: number
  totalPaid: number
  monthlyPayment: number
  downPayment: number
  profile: 'SAFE' | 'BALANCED' | 'MAX_LEVERAGE'
  insurance?: {
    active: boolean
    coverage: number
    premium: number
    expirationDate: string
    // Informations détaillées
    policyId?: string
    status?: InsuranceStatus
    startDate?: string
    renewalDate?: string
    borrowerDefaultCoverage?: number
    marketRiskCoverage?: number
    assetRiskCoverage?: number
    operationalRiskCoverage?: number
    legalRiskCoverage?: number
    monthlyPremium?: number
    creditTier?: 'A' | 'B' | 'C' | 'D'
    nftRiskClass?: 'SAFE' | 'MODERATE' | 'RISKY'
    impactOnLTV?: number
    impactOnRate?: number
    coveredRisks?: RiskType[]
    txHash?: string
  }
  payments: Payment[]
  daysUntilDue?: number
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

export default function Loans() {
  const [showNewLoan, setShowNewLoan] = useState(false)
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null)
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [showEarlyRepayment, setShowEarlyRepayment] = useState(false)
  const [loanForEarlyRepayment, setLoanForEarlyRepayment] = useState<Loan | null>(null)
  const [insuranceTab, setInsuranceTab] = useState<InsuranceTab>('policies')
  const [showNewPolicyModal, setShowNewPolicyModal] = useState(false)
  const [showClaimModal, setShowClaimModal] = useState(false)

  const loans: Loan[] = [
    {
      id: 1,
      loanNumber: 'LOAN-2024-001',
      amount: 100000,
      currency: 'USDC',
      asset: {
        name: 'Villa Paris',
        type: 'Immobilier',
        tokenId: '#1234',
        contractAddress: '0x1234...5678',
        currentValue: 300000,
        image: '/Villa-paris.jpeg',
      },
      ltv: 65,
      rate: 8.5,
      term: 36,
      status: 'active',
      startDate: '2024-01-15',
      endDate: '2027-01-15',
      nextPaymentDate: '2024-02-15',
      nextPaymentAmount: 15000,
      remainingBalance: 85000,
      totalPaid: 15000,
      monthlyPayment: 15000,
      downPayment: 50000,
      profile: 'BALANCED',
      insurance: {
        active: true,
        coverage: 80,
        premium: 2400,
        expirationDate: '2025-01-15',
        policyId: 'POL-2024-001',
        status: 'active',
        startDate: '2024-01-15',
        renewalDate: '2025-01-15',
        borrowerDefaultCoverage: 100,
        marketRiskCoverage: 75,
        assetRiskCoverage: 0,
        monthlyPremium: 200,
        creditTier: 'A',
        nftRiskClass: 'SAFE',
        impactOnLTV: 5,
        impactOnRate: -0.5,
        coveredRisks: ['BORROWER_DEFAULT', 'MARKET_RISK'],
        txHash: '0xabc123...',
      },
      payments: [
        { id: '1', date: '2024-01-15', amount: 15000, status: 'paid', txHash: '0xabc...123' },
        { id: '2', date: '2024-02-15', amount: 15000, status: 'pending' },
      ],
      daysUntilDue: 5,
    },
    {
      id: 2,
      loanNumber: 'LOAN-2024-002',
      amount: 50000,
      currency: 'USDC',
      asset: {
        name: 'Mining Farm',
        type: 'Mining',
        tokenId: '#5678',
        contractAddress: '0x5678...9012',
        currentValue: 150000,
        image: '/Mining1.webp',
      },
      ltv: 55,
      rate: 9.2,
      term: 24,
      status: 'active',
      startDate: '2024-01-20',
      endDate: '2026-01-20',
      nextPaymentDate: '2024-02-20',
      nextPaymentAmount: 7500,
      remainingBalance: 42500,
      totalPaid: 7500,
      monthlyPayment: 7500,
      downPayment: 30000,
      profile: 'SAFE',
      insurance: {
        active: true,
        coverage: 75,
        premium: 1200,
        expirationDate: '2025-01-20',
        policyId: 'POL-2024-002',
        status: 'active',
        startDate: '2024-01-20',
        renewalDate: '2025-01-20',
        borrowerDefaultCoverage: 75,
        marketRiskCoverage: 0,
        assetRiskCoverage: 0,
        monthlyPremium: 100,
        creditTier: 'A',
        nftRiskClass: 'MODERATE',
        impactOnLTV: 0,
        impactOnRate: 0,
        coveredRisks: ['BORROWER_DEFAULT'],
        txHash: '0xdef456...',
      },
      payments: [
        { id: '1', date: '2024-01-20', amount: 7500, status: 'paid', txHash: '0xdef...456' },
        { id: '2', date: '2024-02-20', amount: 7500, status: 'pending' },
      ],
      daysUntilDue: 10,
    },
    {
      id: 3,
      loanNumber: 'LOAN-2023-045',
      amount: 75000,
      currency: 'USDC',
      asset: {
        name: 'Data Center',
        type: 'Infrastructure',
        tokenId: '#9012',
        contractAddress: '0x9012...3456',
        currentValue: 200000,
        image: '/Data-Center.avif',
      },
      ltv: 60,
      rate: 7.8,
      term: 36,
      status: 'repaid',
      startDate: '2023-06-01',
      endDate: '2026-06-01',
      nextPaymentDate: '2023-12-01',
      nextPaymentAmount: 0,
      remainingBalance: 0,
      totalPaid: 75000,
      monthlyPayment: 12500,
      downPayment: 50000,
      profile: 'BALANCED',
      payments: [
        { id: '1', date: '2023-07-01', amount: 12500, status: 'paid', txHash: '0x111...222' },
        { id: '2', date: '2023-08-01', amount: 12500, status: 'paid', txHash: '0x333...444' },
        { id: '3', date: '2023-09-01', amount: 12500, status: 'paid', txHash: '0x555...666' },
        { id: '4', date: '2023-10-01', amount: 12500, status: 'paid', txHash: '0x777...888' },
        { id: '5', date: '2023-11-01', amount: 12500, status: 'paid', txHash: '0x999...000' },
        { id: '6', date: '2023-12-01', amount: 12500, status: 'paid', txHash: '0xaaa...bbb' },
      ],
    },
  ]

  const filteredLoans = loans.filter(loan => {
    if (filterStatus === 'all') return true
    if (filterStatus === 'active') return loan.status === 'active'
    if (filterStatus === 'repaid') return loan.status === 'repaid'
    if (filterStatus === 'default') return loan.status === 'default'
    return true
  })

  const stats = {
    totalActive: loans.filter(l => l.status === 'active').length,
    totalBorrowed: loans.filter(l => l.status === 'active').reduce((sum, l) => sum + l.amount, 0),
    totalRemaining: loans.filter(l => l.status === 'active').reduce((sum, l) => sum + l.remainingBalance, 0),
    nextPaymentTotal: loans.filter(l => l.status === 'active').reduce((sum, l) => sum + l.nextPaymentAmount, 0),
  }

  const calculateEarlyRepayment = (loan: Loan) => {
    const remainingInterest = (loan.remainingBalance * loan.rate / 100) * (loan.term / 12)
    const penalty = loan.remainingBalance * 0.01 // 1% max penalty
    return {
      principal: loan.remainingBalance,
      interest: remainingInterest,
      penalty: penalty,
      total: loan.remainingBalance + remainingInterest + penalty,
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Mes Prêts</h1>
          <p className="page-subtitle">Gérez tous vos prêts actifs et historiques</p>
        </div>
        <button 
          onClick={() => setShowNewLoan(true)} 
          className="btn-primary"
        >
          + Nouveau prêt
        </button>
      </div>

      {/* Filtres - Au-dessus de tout */}
      <div className="loans-filters">
        <div className="filter-group">
          <button 
            className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            Tous
          </button>
          <button 
            className={`filter-btn ${filterStatus === 'active' ? 'active' : ''}`}
            onClick={() => setFilterStatus('active')}
          >
            Actifs
          </button>
          <button 
            className={`filter-btn ${filterStatus === 'repaid' ? 'active' : ''}`}
            onClick={() => setFilterStatus('repaid')}
          >
            Clôturés
          </button>
          <button 
            className={`filter-btn ${filterStatus === 'default' ? 'active' : ''}`}
            onClick={() => setFilterStatus('default')}
          >
            En défaut
          </button>
        </div>
      </div>

      {/* Statistiques résumées */}
      <div className="page-grid-4">
        <div className="stat-card-page">
          <div className="stat-label-page">Prêts actifs</div>
          <div className="stat-value-page">{stats.totalActive}</div>
        </div>
        <div className="stat-card-page">
          <div className="stat-label-page">Montant total emprunté</div>
          <div className="stat-value-page">
            {formatNumber(stats.totalBorrowed)} 
            <span className="currency-logo">
              <USDCIcon size={18} />
            </span>
            <span className="currency-text">USDC</span>
          </div>
        </div>
        <div className="stat-card-page">
          <div className="stat-label-page">Solde restant</div>
          <div className="stat-value-page">
            {formatNumber(stats.totalRemaining)} 
            <span className="currency-logo">
              <USDCIcon size={18} />
            </span>
            <span className="currency-text">USDC</span>
          </div>
        </div>
        <div className="stat-card-page">
          <div className="stat-label-page">Prochain paiement total</div>
          <div className="stat-value-page">
            {formatNumber(stats.nextPaymentTotal)} 
            <span className="currency-logo">
              <USDCIcon size={18} />
            </span>
            <span className="currency-text">USDC</span>
          </div>
        </div>
      </div>

      {/* Liste des prêts */}
      <div className="loans-list">
        {filteredLoans.length === 0 ? (
          <div className="loans-empty">
            <p>Aucun prêt trouvé avec ce filtre</p>
          </div>
        ) : (
          filteredLoans.map((loan) => (
            <div key={loan.id} className="loan-card">
              <div className="loan-header">
                <div>
                  <h3>{loan.loanNumber}</h3>
                  <p className="loan-asset">{loan.asset.name} - {loan.asset.tokenId}</p>
                </div>
                <span className={`loan-status loan-status-${loan.status}`}>
                  {loan.status === 'active' ? 'Actif' : 
                   loan.status === 'repaid' ? 'Remboursé' : 
                   loan.status === 'default' ? 'En défaut' : 
                   loan.status === 'liquidated' ? 'Liquidé' : 'Clôturé'}
                </span>
              </div>
              
              <div className="loan-main-info">
                <div className="loan-amount-section">
                  <div className="loan-amount-large">
                    {formatNumber(loan.amount)} 
                    {loan.currency === 'USDC' && (
                      <span className="currency-logo">
                        <USDCIcon size={20} />
                      </span>
                    )}
                    <span className="currency-text">{loan.currency}</span>
                  </div>
                  <div className="loan-amount-details">
                    <span>Solde restant: {formatNumber(loan.remainingBalance)} {loan.currency}</span>
                    <span>•</span>
                    <span>Remboursé: {formatNumber(loan.totalPaid)} {loan.currency}</span>
                  </div>
                </div>
                
                <div className="loan-conditions">
                  <div className="condition-badge">
                    <span className="condition-label">LTV</span>
                    <span className="condition-value">{loan.ltv}%</span>
                  </div>
                  <div className="condition-badge">
                    <span className="condition-label">Taux</span>
                    <span className="condition-value">{loan.rate}% APY</span>
                  </div>
                  <div className="condition-badge">
                    <span className="condition-label">Durée</span>
                    <span className="condition-value">{loan.term} mois</span>
                  </div>
                  <div className="condition-badge">
                    <span className="condition-label">Profil</span>
                    <span className="condition-value">{loan.profile}</span>
                  </div>
                </div>
              </div>

              {loan.status === 'active' && (
                <div className="loan-payment-section">
                  <div className="payment-amount">
                    <span className="payment-label">Prochain paiement</span>
                    <span className="payment-value">
                      {formatNumber(loan.nextPaymentAmount)} 
                      {loan.currency === 'USDC' && (
                        <span className="currency-logo">
                          <USDCIcon size={18} />
                        </span>
                      )}
                      <span className="currency-text">{loan.currency}</span>
                    </span>
                  </div>
                  <div className="payment-date-row">
                    <span className="payment-date-label">Échéance</span>
                    <span className="payment-date-value">{formatDateShort(loan.nextPaymentDate)}</span>
                    {loan.daysUntilDue !== undefined && (
                      <span className={`payment-days ${loan.daysUntilDue <= 7 ? 'urgent' : ''}`}>
                        {loan.daysUntilDue} jour{loan.daysUntilDue > 1 ? 's' : ''} restant{loan.daysUntilDue > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <div className="loan-actions">
                    <button 
                      className="btn-secondary btn-small"
                      onClick={() => setSelectedLoan(loan)}
                    >
                      Voir détails
                    </button>
                    <button className="btn-pay">
                      Payer maintenant
                    </button>
                  </div>
                </div>
              )}

              {loan.status === 'repaid' && (
                <div className="loan-completed">
                  <span className="completed-icon">✓</span>
                  <span>Prêt remboursé avec succès le {formatDateShort(loan.endDate)}</span>
                  <button 
                    className="btn-secondary btn-small"
                    onClick={() => setSelectedLoan(loan)}
                  >
                    Voir détails
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal détails prêt */}
      {selectedLoan && (
        <div className="loan-detail-modal" onClick={() => setSelectedLoan(null)}>
          <div className="loan-detail-content" onClick={(e) => e.stopPropagation()}>
            <div className="loan-detail-header">
              <div>
                <h2>{selectedLoan.loanNumber}</h2>
                <span className={`loan-status loan-status-${selectedLoan.status}`}>
                  {selectedLoan.status === 'active' ? 'Actif' : 
                   selectedLoan.status === 'repaid' ? 'Remboursé' : 
                   selectedLoan.status === 'default' ? 'En défaut' : 
                   selectedLoan.status === 'liquidated' ? 'Liquidé' : 'Clôturé'}
                </span>
              </div>
              <button className="btn-ghost" onClick={() => setSelectedLoan(null)}>✕</button>
            </div>

            <div className="loan-detail-body">
              {/* NFT Collatéral */}
              <div className="detail-section">
                <h3>NFT Collatéral</h3>
                <div className="nft-info-card">
                  <div className="nft-info-main">
                    {selectedLoan.asset.image && (
                      <div className="nft-image-container" style={{ marginBottom: 'var(--space-4)' }}>
                        <img 
                          src={selectedLoan.asset.image} 
                          alt={selectedLoan.asset.name}
                          style={{ 
                            width: '100%', 
                            maxWidth: '300px', 
                            height: 'auto', 
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid rgba(37, 99, 235, 0.1)'
                          }} 
                        />
                      </div>
                    )}
                    <div className="nft-name">{selectedLoan.asset.name}</div>
                    <div className="nft-details">
                      <span>Type: {selectedLoan.asset.type}</span>
                      <span>•</span>
                      <span>Token ID: {selectedLoan.asset.tokenId}</span>
                    </div>
                    <div className="nft-value">
                      Valeur actuelle: <strong>{formatNumber(selectedLoan.asset.currentValue)} {selectedLoan.currency}</strong>
                    </div>
                    <div className="nft-contract">
                      Contract: <code>{selectedLoan.asset.contractAddress}</code>
                    </div>
                    <div className="nft-ltv-calculation" style={{ 
                      marginTop: 'var(--space-4)', 
                      padding: 'var(--space-4)', 
                      background: 'var(--bb-grey-50)', 
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--text-sm)'
                    }}>
                      <strong>Calcul LTV:</strong> {formatNumber(selectedLoan.amount)} {selectedLoan.currency} ÷ {formatNumber(selectedLoan.asset.currentValue)} {selectedLoan.currency} = {selectedLoan.ltv}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Conditions Prêt */}
              <div className="detail-section">
                <h3>Conditions du Prêt</h3>
                <div className="conditions-grid">
                  <div className="condition-item-detail">
                    <span className="condition-label-detail">Montant initial</span>
                    <span className="condition-value-detail">{formatNumber(selectedLoan.amount)} {selectedLoan.currency}</span>
                  </div>
                  <div className="condition-item-detail">
                    <span className="condition-label-detail">Acompte initial</span>
                    <span className="condition-value-detail">{formatNumber(selectedLoan.downPayment)} {selectedLoan.currency}</span>
                  </div>
                  <div className="condition-item-detail">
                    <span className="condition-label-detail">Solde restant</span>
                    <span className="condition-value-detail">{formatNumber(selectedLoan.remainingBalance)} {selectedLoan.currency}</span>
                  </div>
                  <div className="condition-item-detail">
                    <span className="condition-label-detail">Remboursé</span>
                    <span className="condition-value-detail">{formatNumber(selectedLoan.totalPaid)} {selectedLoan.currency}</span>
                  </div>
                  <div className="condition-item-detail">
                    <span className="condition-label-detail">LTV actuel</span>
                    <span className="condition-value-detail">{selectedLoan.ltv}%</span>
                  </div>
                  <div className="condition-item-detail">
                    <span className="condition-label-detail">Taux APY</span>
                    <span className="condition-value-detail">{selectedLoan.rate}%</span>
                  </div>
                  <div className="condition-item-detail">
                    <span className="condition-label-detail">Taux mensuel</span>
                    <span className="condition-value-detail">{(selectedLoan.rate / 12).toFixed(3)}%</span>
                  </div>
                  <div className="condition-item-detail">
                    <span className="condition-label-detail">Mensualité</span>
                    <span className="condition-value-detail">{formatNumber(selectedLoan.monthlyPayment)} {selectedLoan.currency}</span>
                  </div>
                  <div className="condition-item-detail">
                    <span className="condition-label-detail">Durée</span>
                    <span className="condition-value-detail">{selectedLoan.term} mois</span>
                  </div>
                  <div className="condition-item-detail">
                    <span className="condition-label-detail">Profil de risque</span>
                    <span className="condition-value-detail">{selectedLoan.profile}</span>
                  </div>
                  <div className="condition-item-detail">
                    <span className="condition-label-detail">Date début</span>
                    <span className="condition-value-detail">{formatDateShort(selectedLoan.startDate)}</span>
                  </div>
                  <div className="condition-item-detail">
                    <span className="condition-label-detail">Date fin prévue</span>
                    <span className="condition-value-detail">{formatDateShort(selectedLoan.endDate)}</span>
                  </div>
                </div>
                {/* Calculs détaillés */}
                <div style={{ 
                  marginTop: 'var(--space-6)', 
                  padding: 'var(--space-6)', 
                  background: 'var(--bb-grey-50)', 
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid rgba(37, 99, 235, 0.1)'
                }}>
                  <h4 style={{ marginBottom: 'var(--space-4)', fontSize: 'var(--text-h3)', color: 'var(--color-text-primary)' }}>Calculs détaillés</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-4)' }}>
                    <div>
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Intérêts totaux estimés:</span>
                      <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', marginTop: 'var(--space-1)' }}>
                        {formatNumber((selectedLoan.amount * selectedLoan.rate / 100) * (selectedLoan.term / 12))} {selectedLoan.currency}
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Montant total à rembourser:</span>
                      <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', marginTop: 'var(--space-1)' }}>
                        {formatNumber(selectedLoan.amount + (selectedLoan.amount * selectedLoan.rate / 100) * (selectedLoan.term / 12))} {selectedLoan.currency}
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Paiements restants:</span>
                      <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', marginTop: 'var(--space-1)' }}>
                        {selectedLoan.monthlyPayment > 0 ? Math.ceil(selectedLoan.remainingBalance / selectedLoan.monthlyPayment) : 0} paiements
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Progression:</span>
                      <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', marginTop: 'var(--space-1)' }}>
                        {((selectedLoan.totalPaid / selectedLoan.amount) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Assurance - Section complète avec onglets */}
              {selectedLoan.insurance ? (
                <div className="detail-section">
                  <div className="insurance-section-header">
                    <h3>Assurance</h3>
                    <button 
                      className="btn-primary btn-small"
                      onClick={() => setShowNewPolicyModal(true)}
                    >
                      + Nouvelle assurance
                    </button>
                  </div>
                  
                  {/* Navigation onglets assurance */}
                  <div className="insurance-nav-menu">
                    <nav className="sidebar-nav horizontal-nav">
                      <button
                        onClick={() => setInsuranceTab('policies')}
                        className={`nav-item ${insuranceTab === 'policies' ? 'active' : ''}`}
                      >
                        <span className="nav-icon"><ShieldIcon /></span>
                        <span className="nav-label">Police</span>
                      </button>
                      <button
                        onClick={() => setInsuranceTab('coverage')}
                        className={`nav-item ${insuranceTab === 'coverage' ? 'active' : ''}`}
                      >
                        <span className="nav-icon"><InfoIcon /></span>
                        <span className="nav-label">Couverture</span>
                      </button>
                      <button
                        onClick={() => setInsuranceTab('claims')}
                        className={`nav-item ${insuranceTab === 'claims' ? 'active' : ''}`}
                      >
                        <span className="nav-icon"><WarningIcon /></span>
                        <span className="nav-label">Réclamations</span>
                      </button>
                      <button
                        onClick={() => setInsuranceTab('history')}
                        className={`nav-item ${insuranceTab === 'history' ? 'active' : ''}`}
                      >
                        <span className="nav-icon"><ChartIcon /></span>
                        <span className="nav-label">Historique</span>
                      </button>
                    </nav>
                  </div>

                  {/* Contenu des onglets */}
                  {insuranceTab === 'policies' && (
                    <div className="insurance-policy-details">
                      <div className="insurance-info-card">
                        <div className="insurance-status">
                          <span className={`insurance-badge ${selectedLoan.insurance.active ? 'active' : 'inactive'}`}>
                            {selectedLoan.insurance.status === 'active' ? 'Actif' : 
                             selectedLoan.insurance.status === 'expired' ? 'Expiré' :
                             selectedLoan.insurance.status === 'cancelled' ? 'Annulé' : 'En attente'}
                          </span>
                        </div>
                        <div className="insurance-details-grid">
                          <div className="insurance-detail-item">
                            <span className="insurance-detail-label">Police ID</span>
                            <span className="insurance-detail-value">{selectedLoan.insurance.policyId || 'N/A'}</span>
                          </div>
                          <div className="insurance-detail-item">
                            <span className="insurance-detail-label">Couverture totale</span>
                            <span className="insurance-detail-value">{selectedLoan.insurance.coverage}%</span>
                          </div>
                          <div className="insurance-detail-item">
                            <span className="insurance-detail-label">Prime annuelle</span>
                            <span className="insurance-detail-value">{formatNumber(selectedLoan.insurance.premium)} {selectedLoan.currency}</span>
                          </div>
                          <div className="insurance-detail-item">
                            <span className="insurance-detail-label">Prime mensuelle</span>
                            <span className="insurance-detail-value">{formatNumber(selectedLoan.insurance.monthlyPremium || selectedLoan.insurance.premium / 12)} {selectedLoan.currency}</span>
                          </div>
                          <div className="insurance-detail-item">
                            <span className="insurance-detail-label">Date début</span>
                            <span className="insurance-detail-value">{formatDateShort(selectedLoan.insurance.startDate || selectedLoan.startDate)}</span>
                          </div>
                          <div className="insurance-detail-item">
                            <span className="insurance-detail-label">Date expiration</span>
                            <span className="insurance-detail-value">{formatDateShort(selectedLoan.insurance.expirationDate)}</span>
                          </div>
                          {selectedLoan.insurance.renewalDate && (
                            <div className="insurance-detail-item">
                              <span className="insurance-detail-label">Date renouvellement</span>
                              <span className="insurance-detail-value">{formatDateShort(selectedLoan.insurance.renewalDate)}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Détails de couverture */}
                        {selectedLoan.insurance.borrowerDefaultCoverage !== undefined && (
                          <div className="coverage-breakdown">
                            <h4>Détails de couverture</h4>
                            <div className="coverage-items">
                              <div className="coverage-item">
                                <span>Défaut emprunteur</span>
                                <span>{selectedLoan.insurance.borrowerDefaultCoverage}%</span>
                              </div>
                              {selectedLoan.insurance.marketRiskCoverage !== undefined && selectedLoan.insurance.marketRiskCoverage > 0 && (
                                <div className="coverage-item">
                                  <span>Risque marché</span>
                                  <span>{selectedLoan.insurance.marketRiskCoverage}%</span>
                                </div>
                              )}
                              {selectedLoan.insurance.assetRiskCoverage !== undefined && selectedLoan.insurance.assetRiskCoverage > 0 && (
                                <div className="coverage-item">
                                  <span>Risque actif</span>
                                  <span>{selectedLoan.insurance.assetRiskCoverage}%</span>
                                </div>
                              )}
                              {selectedLoan.insurance.operationalRiskCoverage !== undefined && selectedLoan.insurance.operationalRiskCoverage > 0 && (
                                <div className="coverage-item">
                                  <span>Risque opérationnel</span>
                                  <span>{selectedLoan.insurance.operationalRiskCoverage}%</span>
                                </div>
                              )}
                              {selectedLoan.insurance.legalRiskCoverage !== undefined && selectedLoan.insurance.legalRiskCoverage > 0 && (
                                <div className="coverage-item">
                                  <span>Risque juridique</span>
                                  <span>{selectedLoan.insurance.legalRiskCoverage}%</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Avantages */}
                        {(selectedLoan.insurance.impactOnLTV !== undefined && selectedLoan.insurance.impactOnLTV > 0) || 
                         (selectedLoan.insurance.impactOnRate !== undefined && selectedLoan.insurance.impactOnRate < 0) ? (
                          <div className="insurance-benefits">
                            <h4>Avantages sur le prêt</h4>
                            <div className="benefits-list">
                              {selectedLoan.insurance.impactOnLTV !== undefined && selectedLoan.insurance.impactOnLTV > 0 && (
                                <span className="benefit-badge">+{selectedLoan.insurance.impactOnLTV}% LTV</span>
                              )}
                              {selectedLoan.insurance.impactOnRate !== undefined && selectedLoan.insurance.impactOnRate < 0 && (
                                <span className="benefit-badge">{selectedLoan.insurance.impactOnRate}% taux</span>
                              )}
                            </div>
                          </div>
                        ) : null}

                        {/* Transaction blockchain */}
                        {selectedLoan.insurance.txHash && (
                          <div className="insurance-tx">
                            <span className="insurance-tx-label">Transaction:</span>
                            <a 
                              href={`https://etherscan.io/tx/${selectedLoan.insurance.txHash}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="tx-link"
                            >
                              {selectedLoan.insurance.txHash}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {insuranceTab === 'coverage' && (
                    <div className="insurance-coverage-tab">
                      <p className="coverage-intro">
                        Chaque prêt peut souscrire une couverture partielle ou totale sur un ou plusieurs risques.
                        Les primes sont ajustées selon votre tranche de score de crédit, la qualité de l'actif NFT,
                        la juridiction, et la durée du prêt.
                      </p>
                      <div className="coverage-options-info">
                        <h4>Options de couverture disponibles</h4>
                        <ul>
                          <li><strong>Défaut de l'emprunteur:</strong> 50%, 75% ou 100% - Protection contre l'incapacité de rembourser</li>
                          <li><strong>Risque de marché:</strong> 0%, 50% ou 75% - Protection contre la volatilité des marchés</li>
                          <li><strong>Risque actif:</strong> 0%, 50% ou 75% - Protection contre la dévaluation de l'actif</li>
                          <li><strong>Risque opérationnel:</strong> 0%, 50% ou 75% - Protection contre les incidents opérationnels</li>
                          <li><strong>Risque juridique:</strong> 0%, 50% ou 75% - Protection contre les risques juridiques et réglementaires</li>
                        </ul>
                        <p className="coverage-note">
                          <strong>Note:</strong> Avec une assurance complète (100% défaut + 75% marché + 75% actif), vous bénéficiez de +5% LTV maximum et -0.5% APY sur le taux d'intérêt, ainsi qu'une réduction de 10% sur la prime totale.
                        </p>
                      </div>
                    </div>
                  )}

                  {insuranceTab === 'claims' && (
                    <div className="insurance-claims-tab">
                      <div className="claims-header">
                        <h4>Réclamations</h4>
                        <button 
                          className="btn-primary btn-small"
                          onClick={() => setShowClaimModal(true)}
                        >
                          + Nouvelle réclamation
                        </button>
                      </div>
                      <div className="claims-empty-state">
                        <p>Aucune réclamation active pour ce prêt</p>
                        <p className="claims-note">Vous pouvez soumettre une réclamation si un événement couvert se produit</p>
                      </div>
                    </div>
                  )}

                  {insuranceTab === 'history' && (
                    <div className="insurance-history-tab">
                      <h4>Historique de l'assurance</h4>
                      <div className="history-timeline">
                        <div className="history-item-insurance">
                          <div className="history-date-insurance">
                            {formatDateShort(selectedLoan.insurance.startDate || selectedLoan.startDate)}
                          </div>
                          <div className="history-content-insurance">
                            <div className="history-title-insurance">🛡️ Police créée</div>
                            <div className="history-description-insurance">Police créée pour {selectedLoan.loanNumber}</div>
                            {selectedLoan.insurance.policyId && (
                              <div className="history-reference">Police: {selectedLoan.insurance.policyId}</div>
                            )}
                          </div>
                          <div className="history-amount-insurance">
                            -{formatNumber(selectedLoan.insurance.premium)} {selectedLoan.currency}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="detail-section">
                  <div className="insurance-section-header">
                    <h3>Assurance</h3>
                    <button 
                      className="btn-primary btn-small"
                      onClick={() => setShowNewPolicyModal(true)}
                    >
                      + Souscrire une assurance
                    </button>
                  </div>
                  <div className="insurance-empty-state">
                    <div className="empty-state-icon">🛡️</div>
                    <h4>Aucune assurance active</h4>
                    <p>Souscrivez une assurance pour protéger votre prêt et bénéficier d'avantages (LTV augmenté, taux réduit)</p>
                    <button 
                      className="btn-primary" 
                      style={{ marginTop: 'var(--space-4)' }}
                      onClick={() => setShowNewPolicyModal(true)}
                    >
                      + Souscrire une assurance
                    </button>
                  </div>
                </div>
              )}

              {/* Historique Paiements */}
              <div className="detail-section">
                <h3>Historique des Paiements</h3>
                <div className="payments-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Montant</th>
                        <th>Statut</th>
                        <th>Transaction</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedLoan.payments.map((payment) => (
                        <tr key={payment.id}>
                          <td>{formatDateShort(payment.date)}</td>
                          <td>{formatNumber(payment.amount)} {selectedLoan.currency}</td>
                          <td>
                            <span className={`payment-status payment-status-${payment.status}`}>
                              {payment.status === 'paid' ? '✓ Payé' : 
                               payment.status === 'pending' ? '⏳ En attente' : '⚠️ En retard'}
                            </span>
                          </td>
                          <td>
                            {payment.txHash ? (
                              <a href={`https://etherscan.io/tx/${payment.txHash}`} target="_blank" rel="noopener noreferrer" className="tx-link">
                                {payment.txHash.slice(0, 10)}...
                              </a>
                            ) : (
                              <span className="tx-pending">En attente</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Prochain Paiement */}
              {selectedLoan.status === 'active' && (
                <div className="detail-section">
                  <h3>Prochain Paiement</h3>
                  <div className="next-payment-card">
                    <div className="next-payment-amount">
                      <span className="next-payment-label">Montant dû</span>
                      <span className="next-payment-value">{formatNumber(selectedLoan.nextPaymentAmount)} {selectedLoan.currency}</span>
                    </div>
                    <div className="next-payment-info">
                      <div className="next-payment-date">
                        <span>Date échéance: {formatDateShort(selectedLoan.nextPaymentDate)}</span>
                        {selectedLoan.daysUntilDue !== undefined && (
                          <span className={`next-payment-days ${selectedLoan.daysUntilDue <= 7 ? 'urgent' : ''}`}>
                            {selectedLoan.daysUntilDue} jour{selectedLoan.daysUntilDue > 1 ? 's' : ''} restant{selectedLoan.daysUntilDue > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                      <button className="btn-primary">Payer maintenant</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="detail-section">
                <h3>Actions</h3>
                <div className="loan-actions-grid">
                  {selectedLoan.status === 'active' && (
                    <>
                      <button 
                        className="btn-secondary"
                        onClick={() => {
                          setLoanForEarlyRepayment(selectedLoan)
                          setShowEarlyRepayment(true)
                          setSelectedLoan(null)
                        }}
                      >
                        Remboursement anticipé
                      </button>
                      {selectedLoan.insurance && (
                        <button className="btn-secondary">
                          Renouveler assurance
                        </button>
                      )}
                      <button className="btn-secondary">
                        Voir NFT collatéral
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal remboursement anticipé */}
      {showEarlyRepayment && loanForEarlyRepayment && (
        <div className="early-repayment-modal" onClick={() => {
          setShowEarlyRepayment(false)
          setLoanForEarlyRepayment(null)
        }}>
          <div className="early-repayment-content" onClick={(e) => e.stopPropagation()}>
            <div className="early-repayment-header">
              <h2>Remboursement Anticipé</h2>
              <button className="btn-ghost" onClick={() => {
                setShowEarlyRepayment(false)
                setLoanForEarlyRepayment(null)
              }}>✕</button>
            </div>
            <div className="early-repayment-body">
              {(() => {
                const repayment = calculateEarlyRepayment(loanForEarlyRepayment)
                return (
                  <>
                    <div className="repayment-summary">
                      <div className="repayment-item">
                        <span>Principal restant</span>
                        <span>{formatNumber(repayment.principal)} {loanForEarlyRepayment.currency}</span>
                      </div>
                      <div className="repayment-item">
                        <span>Intérêts restants</span>
                        <span>{formatNumber(repayment.interest)} {loanForEarlyRepayment.currency}</span>
                      </div>
                      <div className="repayment-item">
                        <span>Pénalité (max 1%)</span>
                        <span>{formatNumber(repayment.penalty)} {loanForEarlyRepayment.currency}</span>
                      </div>
                      <div className="repayment-total">
                        <span>Total à payer</span>
                        <span>{formatNumber(repayment.total)} {loanForEarlyRepayment.currency}</span>
                      </div>
                    </div>
                    <div className="repayment-actions">
                      <button className="btn-secondary" onClick={() => {
                        setShowEarlyRepayment(false)
                        setLoanForEarlyRepayment(null)
                      }}>
                        Annuler
                      </button>
                      <button className="btn-primary">
                        Confirmer le remboursement
                      </button>
                    </div>
                  </>
                )
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Modal nouveau prêt */}
      {showNewLoan && (
        <div className="new-loan-modal" onClick={() => setShowNewLoan(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Demander un nouveau prêt</h2>
              <button className="btn-ghost" onClick={() => setShowNewLoan(false)}>✕</button>
            </div>
            <form className="loan-form" onSubmit={(e) => {
              e.preventDefault()
              setShowNewLoan(false)
            }}>
              <div className="form-group">
                <label>Montant demandé</label>
                <div className="form-input-group">
                  <input type="number" placeholder="100,000" required />
                  <select required>
                    <option value="USDC">USDC</option>
                    <option value="USDT">USDT</option>
                    <option value="DAI">DAI</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Actif à nantir (NFT RWA)</label>
                <select required>
                  <option value="">Sélectionner un NFT RWA</option>
                  <option value="1">Villa Paris - NFT #1234</option>
                  <option value="2">Mining Farm - NFT #5678</option>
                  <option value="3">Data Center - NFT #9012</option>
                </select>
              </div>
              <div className="form-group">
                <label>Durée</label>
                <select required>
                  <option value="12">12 mois</option>
                  <option value="24">24 mois</option>
                  <option value="36">36 mois</option>
                  <option value="48">48 mois</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowNewLoan(false)} className="btn-secondary">
                  Annuler
                </button>
                <button type="submit" className="btn-primary">
                  Soumettre la demande
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal nouvelle assurance */}
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
                  {loans.filter(l => l.status === 'active').map(loan => (
                    <option key={loan.id} value={loan.loanNumber}>
                      {loan.loanNumber} - {formatNumber(loan.amount)} {loan.currency}
                    </option>
                  ))}
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
      {showClaimModal && selectedLoan && selectedLoan.insurance && (
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
                <input 
                  type="text" 
                  value={selectedLoan.insurance.policyId || selectedLoan.loanNumber} 
                  disabled 
                />
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

