'use client'

import { useState } from 'react'
import { formatNumber, formatDateShort } from '@/lib/utils'

type LoanStatus = 'active' | 'repaid' | 'default' | 'liquidated' | 'closed'
type FilterStatus = 'all' | 'active' | 'repaid' | 'default'

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
  }
  payments: Payment[]
  daysUntilDue?: number
}

export default function Loans() {
  const [showNewLoan, setShowNewLoan] = useState(false)
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null)
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [showEarlyRepayment, setShowEarlyRepayment] = useState(false)
  const [loanForEarlyRepayment, setLoanForEarlyRepayment] = useState<Loan | null>(null)

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

      {/* Statistiques résumées */}
      <div className="page-grid-4">
        <div className="stat-card-page">
          <div className="stat-label-page">Prêts actifs</div>
          <div className="stat-value-page">{stats.totalActive}</div>
        </div>
        <div className="stat-card-page">
          <div className="stat-label-page">Montant total emprunté</div>
          <div className="stat-value-page">{formatNumber(stats.totalBorrowed)} USDC</div>
        </div>
        <div className="stat-card-page">
          <div className="stat-label-page">Solde restant</div>
          <div className="stat-value-page">{formatNumber(stats.totalRemaining)} USDC</div>
        </div>
        <div className="stat-card-page">
          <div className="stat-label-page">Prochain paiement total</div>
          <div className="stat-value-page">{formatNumber(stats.nextPaymentTotal)} USDC</div>
        </div>
      </div>

      {/* Filtres */}
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
                    {formatNumber(loan.amount)} {loan.currency}
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
                  <div className="payment-info-enhanced">
                    <div className="payment-amount">
                      <span className="payment-label">Prochain paiement</span>
                      <span className="payment-value">{formatNumber(loan.nextPaymentAmount)} {loan.currency}</span>
                    </div>
                    <div className="payment-date-info">
                      <span className="payment-date-label">Échéance</span>
                      <span className="payment-date-value">{formatDateShort(loan.nextPaymentDate)}</span>
                      {loan.daysUntilDue !== undefined && (
                        <span className={`payment-days ${loan.daysUntilDue <= 7 ? 'urgent' : ''}`}>
                          {loan.daysUntilDue} jour{loan.daysUntilDue > 1 ? 's' : ''} restant{loan.daysUntilDue > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
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
                    <span className="condition-label-detail">Solde restant</span>
                    <span className="condition-value-detail">{formatNumber(selectedLoan.remainingBalance)} {selectedLoan.currency}</span>
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
                    <span className="condition-label-detail">Mensualité</span>
                    <span className="condition-value-detail">{formatNumber(selectedLoan.monthlyPayment)} {selectedLoan.currency}</span>
                  </div>
                  <div className="condition-item-detail">
                    <span className="condition-label-detail">Durée</span>
                    <span className="condition-value-detail">{selectedLoan.term} mois</span>
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
              </div>

              {/* Assurance */}
              {selectedLoan.insurance && (
                <div className="detail-section">
                  <h3>Assurance</h3>
                  <div className="insurance-info-card">
                    <div className="insurance-status">
                      <span className={`insurance-badge ${selectedLoan.insurance.active ? 'active' : 'inactive'}`}>
                        {selectedLoan.insurance.active ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                    <div className="insurance-details">
                      <div className="insurance-item">
                        <span>Couverture</span>
                        <span>{selectedLoan.insurance.coverage}%</span>
                      </div>
                      <div className="insurance-item">
                        <span>Prime annuelle</span>
                        <span>{formatNumber(selectedLoan.insurance.premium)} {selectedLoan.currency}</span>
                      </div>
                      <div className="insurance-item">
                        <span>Date expiration</span>
                        <span>{formatDateShort(selectedLoan.insurance.expirationDate)}</span>
                      </div>
                    </div>
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
    </div>
  )
}

