'use client'

import { useState } from 'react'
import InvestorIcon from '../icons/InvestorIcon'
import ChartIcon from '../icons/ChartIcon'
import MoneyIcon from '../icons/MoneyIcon'
import InfoIcon from '../icons/InfoIcon'

type InvestorTab = 'pools' | 'my-investments' | 'analytics' | 'info'
type PoolType = 'PRIMARY' | 'RISK'
type TrancheType = 'SENIOR' | 'MEZZANINE' | 'JUNIOR'
type InvestmentStatus = 'ACTIVE' | 'LOCKED' | 'MATURED' | 'WITHDRAWN'

interface Tranche {
  type: TrancheType
  apy: number
  totalLiquidity: number
  availableLiquidity: number
  minDeposit: number
  riskLevel: 'low' | 'medium' | 'high'
  description: string
  lossAbsorption: number // % de pertes absorbées
}

interface Pool {
  id: string
  name: string
  type: PoolType
  token: 'USDC' | 'USDT' | 'DAI'
  totalLiquidity: number
  availableLiquidity: number
  totalInvestors: number
  tranches: Tranche[]
  description: string
  createdAt: string
  utilizationRate: number // %
  totalLoansFunded: number
  defaultRate: number // %
  contractAddress?: string
}

interface Investment {
  id: string
  poolId: string
  poolName: string
  trancheType: TrancheType
  amount: number
  token: 'USDC' | 'USDT' | 'DAI'
  apy: number
  status: InvestmentStatus
  depositDate: string
  lockEndDate: string
  lockPeriod: number // days
  earnedReturns: number
  estimatedReturns: number
  txHash?: string
}

export default function Investor() {
  const [activeTab, setActiveTab] = useState<InvestorTab>('pools')
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null)
  const [selectedTranche, setSelectedTranche] = useState<TrancheType | null>(null)
  const [depositAmount, setDepositAmount] = useState('')
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null)

  const pools: Pool[] = [
    {
      id: 'POOL-001',
      name: 'Primary Pool USDC',
      type: 'PRIMARY',
      token: 'USDC',
      totalLiquidity: 2500000,
      availableLiquidity: 850000,
      totalInvestors: 342,
      tranches: [
        {
          type: 'SENIOR',
          apy: 8.5,
          totalLiquidity: 1500000,
          availableLiquidity: 500000,
          minDeposit: 10000,
          riskLevel: 'low',
          description: 'Tranche senior sécurisée, faible probabilité de perte',
          lossAbsorption: 0,
        },
        {
          type: 'MEZZANINE',
          apy: 12.5,
          totalLiquidity: 800000,
          availableLiquidity: 300000,
          minDeposit: 5000,
          riskLevel: 'medium',
          description: 'Rendement supérieur avec risque modéré',
          lossAbsorption: 20,
        },
        {
          type: 'JUNIOR',
          apy: 18.0,
          totalLiquidity: 200000,
          availableLiquidity: 50000,
          minDeposit: 1000,
          riskLevel: 'high',
          description: 'Capture maximale des primes, encaisse premières pertes',
          lossAbsorption: 100,
        },
      ],
      description: 'Pool institutionnel pour financement de prêts immobiliers avec garanties NFT RWA',
      createdAt: '2023-06-01',
      utilizationRate: 66,
      totalLoansFunded: 45,
      defaultRate: 2.1,
      contractAddress: '0x1234...5678',
    },
    {
      id: 'POOL-002',
      name: 'Risk Pool USDT',
      type: 'RISK',
      token: 'USDT',
      totalLiquidity: 1800000,
      availableLiquidity: 420000,
      totalInvestors: 198,
      tranches: [
        {
          type: 'SENIOR',
          apy: 9.0,
          totalLiquidity: 1000000,
          availableLiquidity: 250000,
          minDeposit: 10000,
          riskLevel: 'low',
          description: 'Tranche senior sécurisée',
          lossAbsorption: 0,
        },
        {
          type: 'MEZZANINE',
          apy: 13.5,
          totalLiquidity: 600000,
          availableLiquidity: 150000,
          minDeposit: 5000,
          riskLevel: 'medium',
          description: 'Rendement équilibré',
          lossAbsorption: 25,
        },
        {
          type: 'JUNIOR',
          apy: 20.5,
          totalLiquidity: 200000,
          availableLiquidity: 20000,
          minDeposit: 1000,
          riskLevel: 'high',
          description: 'Rendement élevé, premières pertes',
          lossAbsorption: 100,
        },
      ],
      description: 'Pool DeFi pour projets de mining Bitcoin avec collatéralisation',
      createdAt: '2023-08-15',
      utilizationRate: 77,
      totalLoansFunded: 32,
      defaultRate: 3.5,
      contractAddress: '0xabcd...efgh',
    },
    {
      id: 'POOL-003',
      name: 'Primary Pool DAI',
      type: 'PRIMARY',
      token: 'DAI',
      totalLiquidity: 3200000,
      availableLiquidity: 1100000,
      totalInvestors: 507,
      tranches: [
        {
          type: 'SENIOR',
          apy: 7.5,
          totalLiquidity: 2000000,
          availableLiquidity: 700000,
          minDeposit: 10000,
          riskLevel: 'low',
          description: 'Tranche senior très sécurisée',
          lossAbsorption: 0,
        },
        {
          type: 'MEZZANINE',
          apy: 11.8,
          totalLiquidity: 1000000,
          availableLiquidity: 350000,
          minDeposit: 5000,
          riskLevel: 'medium',
          description: 'Rendement modéré',
          lossAbsorption: 15,
        },
        {
          type: 'JUNIOR',
          apy: 16.5,
          totalLiquidity: 200000,
          availableLiquidity: 50000,
          minDeposit: 1000,
          riskLevel: 'high',
          description: 'Rendement élevé',
          lossAbsorption: 100,
        },
      ],
      description: 'Pool pour financement de prêts à moyen terme',
      createdAt: '2023-09-20',
      utilizationRate: 66,
      totalLoansFunded: 58,
      defaultRate: 1.8,
      contractAddress: '0x9876...5432',
    },
  ]

  const investments: Investment[] = [
    {
      id: 'INV-001',
      poolId: 'POOL-001',
      poolName: 'Primary Pool USDC',
      trancheType: 'MEZZANINE',
      amount: 50000,
      token: 'USDC',
      apy: 12.5,
      status: 'ACTIVE',
      depositDate: '2024-01-15',
      lockEndDate: '2024-04-15',
      lockPeriod: 90,
      earnedReturns: 1562.5,
      estimatedReturns: 1875,
      txHash: '0xtx001...',
    },
    {
      id: 'INV-002',
      poolId: 'POOL-002',
      poolName: 'Risk Pool USDT',
      trancheType: 'JUNIOR',
      amount: 10000,
      token: 'USDT',
      apy: 20.5,
      status: 'LOCKED',
      depositDate: '2024-02-01',
      lockEndDate: '2024-08-01',
      lockPeriod: 180,
      earnedReturns: 341.67,
      estimatedReturns: 1025,
      txHash: '0xtx002...',
    },
  ]

  const stats = {
    totalTVL: pools.reduce((sum, p) => sum + p.totalLiquidity, 0),
    totalAvailable: pools.reduce((sum, p) => sum + p.availableLiquidity, 0),
    averageAPY: pools.reduce((sum, p) => {
      const avgTrancheAPY = p.tranches.reduce((s, t) => s + t.apy, 0) / p.tranches.length
      return sum + avgTrancheAPY
    }, 0) / pools.length,
    totalInvestors: pools.reduce((sum, p) => sum + p.totalInvestors, 0),
    totalInvested: investments.reduce((sum, inv) => sum + inv.amount, 0),
    totalEarned: investments.reduce((sum, inv) => sum + inv.earnedReturns, 0),
    totalEstimated: investments.reduce((sum, inv) => sum + inv.estimatedReturns, 0),
  }

  const handleDeposit = (pool: Pool, tranche: TrancheType) => {
    setSelectedPool(pool)
    setSelectedTranche(tranche)
    setShowDepositModal(true)
  }

  const handleWithdraw = (investment: Investment) => {
    setSelectedInvestment(investment)
    setShowWithdrawModal(true)
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return '#6B7280'
      case 'medium':
        return '#9CA3AF'
      case 'high':
        return '#4B5563'
      default:
        return 'var(--color-text-secondary)'
    }
  }

  const getRiskLabel = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'Faible'
      case 'medium':
        return 'Moyen'
      case 'high':
        return 'Élevé'
      default:
        return risk
    }
  }

  const getTrancheLabel = (tranche: TrancheType) => {
    switch (tranche) {
      case 'SENIOR':
        return 'Senior'
      case 'MEZZANINE':
        return 'Mezzanine'
      case 'JUNIOR':
        return 'Junior'
      default:
        return tranche
    }
  }

  const getPoolTypeLabel = (type: PoolType) => {
    switch (type) {
      case 'PRIMARY':
        return 'Pool Institutionnel'
      case 'RISK':
        return 'Pool DeFi'
      default:
        return type
    }
  }

  const getStatusLabel = (status: InvestmentStatus) => {
    switch (status) {
      case 'ACTIVE':
        return 'Actif'
      case 'LOCKED':
        return 'Verrouillé'
      case 'MATURED':
        return 'Maturé'
      case 'WITHDRAWN':
        return 'Retiré'
      default:
        return status
    }
  }

  const tabs = [
    { id: 'pools' as InvestorTab, label: 'Available Pools', icon: InvestorIcon },
    { id: 'my-investments' as InvestorTab, label: 'My Investments', icon: MoneyIcon },
    { id: 'analytics' as InvestorTab, label: 'Analytics', icon: ChartIcon },
    { id: 'info' as InvestorTab, label: 'Info', icon: InfoIcon },
  ]

  return (
    <div className="investor-page">
      <div className="page-header">
        <div>
          <h1>Investisseur</h1>
          <p className="page-subtitle">Financez les pools de liquidité et générez des rendements avec APY</p>
        </div>
      </div>

      {/* Sub-menu Navigation with Dashboard Style */}
      <div className="investor-nav-menu">
        <nav className="sidebar-nav">
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

      {/* Statistiques globales */}
      <div className="investor-stats">
        <div className="investor-stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <div className="stat-label">Total TVL</div>
            <div className="stat-value">{stats.totalTVL.toLocaleString()} USDC</div>
            <div className="stat-subtitle">Disponible: {stats.totalAvailable.toLocaleString()} USDC</div>
          </div>
        </div>
        <div className="investor-stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-info">
            <div className="stat-label">APY Moyen</div>
            <div className="stat-value">{stats.averageAPY.toFixed(2)}%</div>
            <div className="stat-subtitle">Tous pools confondus</div>
          </div>
        </div>
        <div className="investor-stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <div className="stat-label">Investisseurs actifs</div>
            <div className="stat-value">{stats.totalInvestors}</div>
            <div className="stat-subtitle">Sur {pools.length} pools</div>
          </div>
        </div>
        <div className="investor-stat-card">
          <div className="stat-icon">💵</div>
          <div className="stat-info">
            <div className="stat-label">Mes investissements</div>
            <div className="stat-value">{stats.totalInvested.toLocaleString()} USDC</div>
            <div className="stat-subtitle">Rendements: {stats.totalEarned.toLocaleString()} USDC</div>
          </div>
        </div>
      </div>

      {activeTab === 'pools' && (
        <div className="pools-section">
          <h2 className="section-title">Pools de financement disponibles</h2>
          <div className="pools-grid">
            {pools.map((pool) => (
              <div key={pool.id} className="pool-card">
                <div className="pool-header">
                  <div className="pool-title-section">
                    <div>
                      <h3>{pool.name}</h3>
                      <span className="pool-type-badge">{getPoolTypeLabel(pool.type)}</span>
                    </div>
                    <div className="pool-token-badge">
                      {pool.token === 'USDC' ? '💵' : pool.token === 'USDT' ? '💸' : '💳'} {pool.token}
                    </div>
                  </div>
                </div>

                <div className="pool-description">
                  <p>{pool.description}</p>
                </div>

                <div className="pool-stats">
                  <div className="pool-stat-item">
                    <span className="pool-stat-label">Liquidité totale</span>
                    <span className="pool-stat-value">{pool.totalLiquidity.toLocaleString()} {pool.token}</span>
                  </div>
                  <div className="pool-stat-item">
                    <span className="pool-stat-label">Disponible</span>
                    <span className="pool-stat-value highlight">{pool.availableLiquidity.toLocaleString()} {pool.token}</span>
                  </div>
                  <div className="pool-stat-item">
                    <span className="pool-stat-label">Taux d'utilisation</span>
                    <span className="pool-stat-value">{pool.utilizationRate}%</span>
                  </div>
                  <div className="pool-stat-item">
                    <span className="pool-stat-label">Prêts financés</span>
                    <span className="pool-stat-value">{pool.totalLoansFunded}</span>
                  </div>
                  <div className="pool-stat-item">
                    <span className="pool-stat-label">Taux de défaut</span>
                    <span className="pool-stat-value">{pool.defaultRate}%</span>
                  </div>
                  <div className="pool-stat-item">
                    <span className="pool-stat-label">Investisseurs</span>
                    <span className="pool-stat-value">{pool.totalInvestors}</span>
                  </div>
                </div>

                <div className="pool-tranches">
                  <h4>Tranches disponibles</h4>
                  <div className="tranches-list">
                    {pool.tranches.map((tranche, idx) => (
                      <div key={idx} className="tranche-card">
                        <div className="tranche-header">
                          <div>
                            <span className="tranche-type">{getTrancheLabel(tranche.type)}</span>
                            <span className="tranche-apy">{tranche.apy}% APY</span>
                          </div>
                          <span 
                            className="tranche-risk-badge" 
                            style={{ color: getRiskColor(tranche.riskLevel) }}
                          >
                            {getRiskLabel(tranche.riskLevel)}
                          </span>
                        </div>
                        <div className="tranche-details">
                          <div className="tranche-detail-item">
                            <span>Liquidité: {tranche.totalLiquidity.toLocaleString()} {pool.token}</span>
                            <span>Disponible: {tranche.availableLiquidity.toLocaleString()} {pool.token}</span>
                          </div>
                          <div className="tranche-detail-item">
                            <span>Dépôt min: {tranche.minDeposit.toLocaleString()} {pool.token}</span>
                            <span>Absorption pertes: {tranche.lossAbsorption}%</span>
                          </div>
                          <p className="tranche-description">{tranche.description}</p>
                        </div>
                        <button 
                          className="btn-primary tranche-invest-btn"
                          onClick={() => handleDeposit(pool, tranche.type)}
                          disabled={tranche.availableLiquidity === 0}
                        >
                          Investir dans {getTrancheLabel(tranche.type)}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {pool.contractAddress && (
                  <div className="pool-contract">
                    <span className="contract-label">Contract:</span>
                    <a href={`https://etherscan.io/address/${pool.contractAddress}`} target="_blank" rel="noopener noreferrer" className="contract-link">
                      {pool.contractAddress}
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'my-investments' && (
        <div className="my-investments-section">
          <h2 className="section-title">Mes investissements</h2>
          {investments.length === 0 ? (
            <div className="investments-empty-state">
              <div className="empty-state-icon">💼</div>
              <h3>Aucun investissement actif</h3>
              <p>Commencez à investir dans les pools pour voir vos investissements ici</p>
            </div>
          ) : (
            <>
              <div className="investments-summary">
                <div className="summary-card-investment">
                  <div className="summary-label-investment">Total investi</div>
                  <div className="summary-value-investment">{stats.totalInvested.toLocaleString()} USDC</div>
                </div>
                <div className="summary-card-investment">
                  <div className="summary-label-investment">Rendements gagnés</div>
                  <div className="summary-value-investment">{stats.totalEarned.toLocaleString()} USDC</div>
                </div>
                <div className="summary-card-investment">
                  <div className="summary-label-investment">Rendements estimés</div>
                  <div className="summary-value-investment">{stats.totalEstimated.toLocaleString()} USDC</div>
                </div>
              </div>

              <div className="investments-list">
                {investments.map((investment) => {
                  const pool = pools.find(p => p.id === investment.poolId)
                  const tranche = pool?.tranches.find(t => t.type === investment.trancheType)
                  const daysRemaining = Math.max(0, Math.ceil((new Date(investment.lockEndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
                  
                  return (
                    <div key={investment.id} className="investment-card">
                      <div className="investment-header">
                        <div>
                          <h3>{investment.poolName}</h3>
                          <span className="investment-tranche-badge">{getTrancheLabel(investment.trancheType)}</span>
                        </div>
                        <span className={`investment-status investment-status-${investment.status.toLowerCase()}`}>
                          {getStatusLabel(investment.status)}
                        </span>
                      </div>

                      <div className="investment-main-info">
                        <div className="investment-amount-section">
                          <div className="investment-amount-large">{investment.amount.toLocaleString()} {investment.token}</div>
                          <div className="investment-apy">{investment.apy}% APY</div>
                        </div>
                        <div className="investment-returns-section">
                          <div className="returns-item">
                            <span className="returns-label">Gagné</span>
                            <span className="returns-value earned">{investment.earnedReturns.toLocaleString()} {investment.token}</span>
                          </div>
                          <div className="returns-item">
                            <span className="returns-label">Estimé</span>
                            <span className="returns-value estimated">{investment.estimatedReturns.toLocaleString()} {investment.token}</span>
                          </div>
                        </div>
                      </div>

                      <div className="investment-details">
                        <div className="investment-detail-item">
                          <span className="investment-detail-label">Date de dépôt</span>
                          <span className="investment-detail-value">{new Date(investment.depositDate).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="investment-detail-item">
                          <span className="investment-detail-label">Période de verrouillage</span>
                          <span className="investment-detail-value">{investment.lockPeriod} jours</span>
                        </div>
                        <div className="investment-detail-item">
                          <span className="investment-detail-label">Date de déverrouillage</span>
                          <span className="investment-detail-value">{new Date(investment.lockEndDate).toLocaleDateString('fr-FR')}</span>
                        </div>
                        {investment.status === 'LOCKED' && (
                          <div className="investment-detail-item">
                            <span className="investment-detail-label">Jours restants</span>
                            <span className="investment-detail-value highlight">{daysRemaining} jours</span>
                          </div>
                        )}
                        {investment.txHash && (
                          <div className="investment-detail-item">
                            <span className="investment-detail-label">Transaction</span>
                            <a href={`https://etherscan.io/tx/${investment.txHash}`} target="_blank" rel="noopener noreferrer" className="investment-tx-link">
                              {investment.txHash}
                            </a>
                          </div>
                        )}
                      </div>

                      <div className="investment-actions">
                        <button 
                          className="btn-secondary"
                          onClick={() => setSelectedInvestment(investment)}
                        >
                          Voir détails
                        </button>
                        {investment.status === 'ACTIVE' && (
                          <button 
                            className="btn-primary"
                            onClick={() => handleWithdraw(investment)}
                          >
                            Retirer
                          </button>
                        )}
                        {investment.status === 'LOCKED' && (
                          <button 
                            className="btn-secondary"
                            disabled
                          >
                            Verrouillé ({daysRemaining}j)
                          </button>
                        )}
                        {investment.status === 'MATURED' && (
                          <button 
                            className="btn-primary"
                            onClick={() => handleWithdraw(investment)}
                          >
                            Retirer maintenant
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="analytics-section">
          <h2 className="section-title">Analytics</h2>
          
          <div className="analytics-summary">
            <div className="analytics-card">
              <h3>Total investi</h3>
              <div className="analytics-value">{stats.totalInvested.toLocaleString()} USDC</div>
              <div className="analytics-subtitle">Sur {investments.length} investissements</div>
            </div>
            <div className="analytics-card">
              <h3>Rendements totaux</h3>
              <div className="analytics-value">{stats.totalEarned.toLocaleString()} USDC</div>
              <div className="analytics-subtitle">Gagnés jusqu'à présent</div>
            </div>
            <div className="analytics-card">
              <h3>Rendements estimés</h3>
              <div className="analytics-value">{stats.totalEstimated.toLocaleString()} USDC</div>
              <div className="analytics-subtitle">À maturité</div>
            </div>
            <div className="analytics-card">
              <h3>APY moyen</h3>
              <div className="analytics-value">
                {investments.length > 0 
                  ? (investments.reduce((sum, inv) => sum + inv.apy, 0) / investments.length).toFixed(2)
                  : '0'
                }%
              </div>
              <div className="analytics-subtitle">Tous investissements</div>
            </div>
          </div>

          {investments.length > 0 && (
            <div className="analytics-breakdown">
              <h3>Répartition par pool</h3>
              <div className="breakdown-list">
                {pools.filter(p => investments.some(inv => inv.poolId === p.id)).map(pool => {
                  const poolInvestments = investments.filter(inv => inv.poolId === pool.id)
                  const poolTotal = poolInvestments.reduce((sum, inv) => sum + inv.amount, 0)
                  const poolEarned = poolInvestments.reduce((sum, inv) => sum + inv.earnedReturns, 0)
                  
                  return (
                    <div key={pool.id} className="breakdown-item">
                      <div className="breakdown-header">
                        <span className="breakdown-name">{pool.name}</span>
                        <span className="breakdown-percentage">
                          {((poolTotal / stats.totalInvested) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="breakdown-details">
                        <span>Investi: {poolTotal.toLocaleString()} {pool.token}</span>
                        <span>Gagné: {poolEarned.toLocaleString()} {pool.token}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {investments.length > 0 && (
            <div className="analytics-timeline">
              <h3>Historique des investissements</h3>
              <div className="timeline-list">
                {investments.map(inv => (
                  <div key={inv.id} className="timeline-item">
                    <div className="timeline-date">{new Date(inv.depositDate).toLocaleDateString('fr-FR')}</div>
                    <div className="timeline-content">
                      <div className="timeline-title">Investissement dans {inv.poolName}</div>
                      <div className="timeline-description">
                        {inv.amount.toLocaleString()} {inv.token} • {getTrancheLabel(inv.trancheType)} • {inv.apy}% APY
                      </div>
                    </div>
                    <div className="timeline-amount">+{inv.amount.toLocaleString()} {inv.token}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'info' && (
        <div className="info-section">
          <h2 className="section-title">Informations investisseur</h2>
          
          <div className="info-content">
            <div className="info-card">
              <h3>Comment ça fonctionne</h3>
              <p>
                Investissez dans des pools de liquidité qui financent des prêts garantis par des NFT RWA.
                Gagnez des rendements compétitifs en APY tout en soutenant l'écosystème BlockBank.
              </p>
              <div className="info-steps">
                <div className="info-step">
                  <div className="step-number">1</div>
                  <div>
                    <strong>Choisissez un pool</strong>
                    <p>Sélectionnez un pool de liquidité selon votre profil de risque</p>
                  </div>
                </div>
                <div className="info-step">
                  <div className="step-number">2</div>
                  <div>
                    <strong>Sélectionnez une tranche</strong>
                    <p>Senior (faible risque), Mezzanine (risque modéré), ou Junior (risque élevé)</p>
                  </div>
                </div>
                <div className="info-step">
                  <div className="step-number">3</div>
                  <div>
                    <strong>Investissez</strong>
                    <p>Déposez votre capital et commencez à gagner des rendements</p>
                  </div>
                </div>
                <div className="info-step">
                  <div className="step-number">4</div>
                  <div>
                    <strong>Suivez vos rendements</strong>
                    <p>Surveillez vos investissements et retirez à maturité</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="info-card">
              <h3>Types de pools</h3>
              <div className="pool-types">
                <div className="pool-type-item">
                  <h4>Primary Pool (Institutionnel)</h4>
                  <ul>
                    <li>Capital fourni par Qatar ou grandes institutions</li>
                    <li>Prend des expositions senior peu risquées</li>
                    <li>Rendement modéré mais très sécurisé</li>
                    <li>Faible probabilité de perte</li>
                  </ul>
                </div>
                <div className="pool-type-item">
                  <h4>Risk Pool (DeFi / LPs privés)</h4>
                  <ul>
                    <li>Rendement plus élevé</li>
                    <li>Supporte les premières pertes (tranche junior)</li>
                    <li>Pour investisseurs expérimentés</li>
                    <li>Risque plus élevé, rendement supérieur</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="info-card">
              <h3>Système de tranches</h3>
              <div className="tranches-info">
                <div className="tranche-info-item">
                  <h4>Tranche Senior</h4>
                  <ul>
                    <li><strong>Risque:</strong> Faible probabilité de perte</li>
                    <li><strong>Rendement:</strong> Modéré (7-9% APY)</li>
                    <li><strong>Absorption pertes:</strong> 0%</li>
                    <li><strong>Profil:</strong> Investisseurs institutionnels, Qatar</li>
                    <li><strong>Dépôt minimum:</strong> Généralement élevé (10,000+ USDC)</li>
                  </ul>
                </div>
                <div className="tranche-info-item">
                  <h4>Tranche Mezzanine</h4>
                  <ul>
                    <li><strong>Risque:</strong> Modéré</li>
                    <li><strong>Rendement:</strong> Équilibré (11-14% APY)</li>
                    <li><strong>Absorption pertes:</strong> 15-25%</li>
                    <li><strong>Profil:</strong> Investisseurs cherchant rendement supérieur avec risque modéré</li>
                    <li><strong>Dépôt minimum:</strong> Moyen (5,000+ USDC)</li>
                  </ul>
                </div>
                <div className="tranche-info-item">
                  <h4>Tranche Junior</h4>
                  <ul>
                    <li><strong>Risque:</strong> Élevé</li>
                    <li><strong>Rendement:</strong> Élevé (16-21% APY)</li>
                    <li><strong>Absorption pertes:</strong> 100% (premières pertes)</li>
                    <li><strong>Profil:</strong> LPs crypto, capture maximale des primes</li>
                    <li><strong>Dépôt minimum:</strong> Faible (1,000+ USDC)</li>
                  </ul>
                </div>
              </div>
              <div className="tranches-note">
                <p>
                  <strong>Note:</strong> Ce modèle permet d'aligner des profils de risque/rendement très différents
                  au sein de la même plateforme. Les pertes sont absorbées d'abord par la tranche junior,
                  puis mezzanine, et enfin senior si nécessaire.
                </p>
              </div>
            </div>

            <div className="info-card">
              <h3>Niveaux de risque</h3>
              <div className="risk-levels">
                <div className="risk-level-item">
                  <span className="risk-level-badge" style={{ color: '#6B7280' }}>Faible</span>
                  <p>Pools conservateurs avec rendements stables. Idéal pour les investisseurs recherchant la sécurité.</p>
                </div>
                <div className="risk-level-item">
                  <span className="risk-level-badge" style={{ color: '#9CA3AF' }}>Moyen</span>
                  <p>Pools équilibrés avec un compromis risque-rendement. Pour investisseurs modérés.</p>
                </div>
                <div className="risk-level-item">
                  <span className="risk-level-badge" style={{ color: '#4B5563' }}>Élevé</span>
                  <p>Pools agressifs avec rendements potentiels plus élevés. Pour investisseurs expérimentés acceptant le risque.</p>
                </div>
              </div>
            </div>

            <div className="info-card">
              <h3>Scénarios de performance</h3>
              <div className="scenarios">
                <div className="scenario-item">
                  <h4>Scénario normal</h4>
                  <p>Défauts contenus, les primes couvrent largement les indemnités → rendement positif pour toutes les tranches.</p>
                </div>
                <div className="scenario-item">
                  <h4>Scénario stress</h4>
                  <p>Vague de défauts, utilisation des réserves, perte éventuelle sur la tranche junior uniquement.</p>
                </div>
                <div className="scenario-item">
                  <h4>Scénario extrême</h4>
                  <p>Crise systémique (macro), possible haircut partiel sur la tranche mezzanine, senior protégée.</p>
                </div>
              </div>
            </div>

            <div className="info-card">
              <h3>Entrées et sorties des pools</h3>
              <div className="pool-flows">
                <div className="flow-item">
                  <h4>Entrées</h4>
                  <ul>
                    <li>Primes payées par les emprunteurs ou par les prêteurs</li>
                    <li>Capital injecté par Qatar et LPs</li>
                    <li>Rendements de placements temporaires</li>
                  </ul>
                </div>
                <div className="flow-item">
                  <h4>Sorties</h4>
                  <ul>
                    <li>Payouts d'assurance en cas de défaut</li>
                    <li>Rachats de parts (LPs sortants)</li>
                    <li>Distribution de rendement aux participants</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de dépôt */}
      {showDepositModal && selectedPool && selectedTranche && (() => {
        const tranche = selectedPool.tranches.find(t => t.type === selectedTranche)
        if (!tranche) return null
        
        return (
          <div className="deposit-modal-overlay" onClick={() => {
            setShowDepositModal(false)
            setSelectedPool(null)
            setSelectedTranche(null)
            setDepositAmount('')
          }}>
            <div className="deposit-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <h2>Investir dans {selectedPool.name}</h2>
                  <span className="modal-tranche-badge">{getTrancheLabel(selectedTranche)}</span>
                </div>
                <button 
                  className="modal-close"
                  onClick={() => {
                    setShowDepositModal(false)
                    setSelectedPool(null)
                    setSelectedTranche(null)
                    setDepositAmount('')
                  }}
                >
                  ×
                </button>
              </div>
              
              <div className="modal-body">
                <div className="pool-info-summary">
                  <div className="summary-item">
                    <span>APY:</span>
                    <span className="summary-value">{tranche.apy}%</span>
                  </div>
                  <div className="summary-item">
                    <span>Niveau de risque:</span>
                    <span className="summary-value" style={{ color: getRiskColor(tranche.riskLevel) }}>
                      {getRiskLabel(tranche.riskLevel)}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span>Dépôt minimum:</span>
                    <span className="summary-value">{tranche.minDeposit.toLocaleString()} {selectedPool.token}</span>
                  </div>
                  <div className="summary-item">
                    <span>Liquidité disponible:</span>
                    <span className="summary-value">{tranche.availableLiquidity.toLocaleString()} {selectedPool.token}</span>
                  </div>
                  <div className="summary-item">
                    <span>Absorption pertes:</span>
                    <span className="summary-value">{tranche.lossAbsorption}%</span>
                  </div>
                </div>

                <div className="deposit-form">
                  <label className="form-label">
                    Montant à investir ({selectedPool.token})
                  </label>
                  <input
                    type="number"
                    className="deposit-input"
                    placeholder={`Minimum: ${tranche.minDeposit.toLocaleString()}`}
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    min={tranche.minDeposit}
                    max={tranche.availableLiquidity}
                  />
                  
                  {depositAmount && parseFloat(depositAmount) > 0 && (
                    <div className="deposit-preview">
                      <div className="preview-item">
                        <span>Rendement annuel estimé:</span>
                        <span className="preview-value">
                          {(parseFloat(depositAmount) * tranche.apy / 100).toLocaleString('fr-FR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })} {selectedPool.token}
                        </span>
                      </div>
                      <div className="preview-item">
                        <span>Rendement mensuel estimé:</span>
                        <span className="preview-value">
                          {(parseFloat(depositAmount) * tranche.apy / 100 / 12).toLocaleString('fr-FR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })} {selectedPool.token}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="modal-actions">
                  <button 
                    className="btn-secondary"
                    onClick={() => {
                      setShowDepositModal(false)
                      setSelectedPool(null)
                      setSelectedTranche(null)
                      setDepositAmount('')
                    }}
                  >
                    Annuler
                  </button>
                  <button 
                    className="btn-primary"
                    onClick={() => {
                      // Here we could add deposit logic
                      alert(`Investissement de ${depositAmount} ${selectedPool.token} dans ${selectedPool.name} - Tranche ${getTrancheLabel(selectedTranche)}...`)
                      setShowDepositModal(false)
                      setSelectedPool(null)
                      setSelectedTranche(null)
                      setDepositAmount('')
                    }}
                    disabled={!depositAmount || parseFloat(depositAmount) < tranche.minDeposit || parseFloat(depositAmount) > tranche.availableLiquidity}
                  >
                    Confirmer l'investissement
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      })()}

      {/* Modal de retrait */}
      {showWithdrawModal && selectedInvestment && (
        <div className="withdraw-modal-overlay" onClick={() => {
          setShowWithdrawModal(false)
          setSelectedInvestment(null)
        }}>
          <div className="withdraw-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Retirer l'investissement</h2>
              <button 
                className="modal-close"
                onClick={() => {
                  setShowWithdrawModal(false)
                  setSelectedInvestment(null)
                }}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="withdraw-info">
                <div className="withdraw-item">
                  <span className="withdraw-label">Pool:</span>
                  <span className="withdraw-value">{selectedInvestment.poolName}</span>
                </div>
                <div className="withdraw-item">
                  <span className="withdraw-label">Tranche:</span>
                  <span className="withdraw-value">{getTrancheLabel(selectedInvestment.trancheType)}</span>
                </div>
                <div className="withdraw-item">
                  <span className="withdraw-label">Montant investi:</span>
                  <span className="withdraw-value">{selectedInvestment.amount.toLocaleString()} {selectedInvestment.token}</span>
                </div>
                <div className="withdraw-item">
                  <span className="withdraw-label">Rendements gagnés:</span>
                  <span className="withdraw-value earned">{selectedInvestment.earnedReturns.toLocaleString()} {selectedInvestment.token}</span>
                </div>
                <div className="withdraw-item total">
                  <span className="withdraw-label">Total à retirer:</span>
                  <span className="withdraw-value total">
                    {(selectedInvestment.amount + selectedInvestment.earnedReturns).toLocaleString()} {selectedInvestment.token}
                  </span>
                </div>
              </div>

              <div className="withdraw-warning">
                {selectedInvestment.status === 'LOCKED' && (
                  <p>⚠️ Cet investissement est encore verrouillé. Vous ne pourrez retirer qu'après la date de déverrouillage.</p>
                )}
                {selectedInvestment.status === 'ACTIVE' && (
                  <p>ℹ️ Vous pouvez retirer cet investissement maintenant. Les rendements seront calculés jusqu'à la date de retrait.</p>
                )}
              </div>

              <div className="modal-actions">
                <button 
                  className="btn-secondary"
                  onClick={() => {
                    setShowWithdrawModal(false)
                    setSelectedInvestment(null)
                  }}
                >
                  Annuler
                </button>
                <button 
                  className="btn-primary"
                  onClick={() => {
                    if (selectedInvestment.status === 'LOCKED') {
                      alert('Cet investissement est encore verrouillé.')
                      return
                    }
                    alert(`Retrait de ${(selectedInvestment.amount + selectedInvestment.earnedReturns).toLocaleString()} ${selectedInvestment.token}...`)
                    setShowWithdrawModal(false)
                    setSelectedInvestment(null)
                  }}
                  disabled={selectedInvestment.status === 'LOCKED'}
                >
                  Confirmer le retrait
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal détails investissement */}
      {selectedInvestment && !showWithdrawModal && (
        <div className="investment-detail-modal" onClick={() => setSelectedInvestment(null)}>
          <div className="investment-detail-content" onClick={(e) => e.stopPropagation()}>
            <div className="investment-detail-header">
              <div>
                <h2>{selectedInvestment.poolName}</h2>
                <span className="investment-detail-tranche">{getTrancheLabel(selectedInvestment.trancheType)}</span>
              </div>
              <button className="btn-ghost" onClick={() => setSelectedInvestment(null)}>✕</button>
            </div>

            <div className="investment-detail-body">
              <div className="detail-section">
                <h3>Informations principales</h3>
                <div className="investment-detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Montant investi</span>
                    <span className="detail-value">{selectedInvestment.amount.toLocaleString()} {selectedInvestment.token}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">APY</span>
                    <span className="detail-value">{selectedInvestment.apy}%</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Statut</span>
                    <span className={`detail-value status-${selectedInvestment.status.toLowerCase()}`}>
                      {getStatusLabel(selectedInvestment.status)}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Date de dépôt</span>
                    <span className="detail-value">{new Date(selectedInvestment.depositDate).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Période de verrouillage</span>
                    <span className="detail-value">{selectedInvestment.lockPeriod} jours</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Date de déverrouillage</span>
                    <span className="detail-value">{new Date(selectedInvestment.lockEndDate).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Rendements</h3>
                <div className="returns-details">
                  <div className="returns-detail-item">
                    <span className="returns-detail-label">Rendements gagnés</span>
                    <span className="returns-detail-value earned">{selectedInvestment.earnedReturns.toLocaleString()} {selectedInvestment.token}</span>
                  </div>
                  <div className="returns-detail-item">
                    <span className="returns-detail-label">Rendements estimés</span>
                    <span className="returns-detail-value estimated">{selectedInvestment.estimatedReturns.toLocaleString()} {selectedInvestment.token}</span>
                  </div>
                  <div className="returns-detail-item total">
                    <span className="returns-detail-label">Total disponible</span>
                    <span className="returns-detail-value total">
                      {(selectedInvestment.amount + selectedInvestment.earnedReturns).toLocaleString()} {selectedInvestment.token}
                    </span>
                  </div>
                </div>
              </div>

              {selectedInvestment.txHash && (
                <div className="detail-section">
                  <h3>Transaction blockchain</h3>
                  <a 
                    href={`https://etherscan.io/tx/${selectedInvestment.txHash}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="tx-link"
                  >
                    {selectedInvestment.txHash}
                  </a>
                </div>
              )}

              <div className="detail-section">
                <h3>Actions</h3>
                <div className="investment-detail-actions">
                  {selectedInvestment.status === 'ACTIVE' && (
                    <button 
                      className="btn-primary"
                      onClick={() => {
                        setSelectedInvestment(null)
                        handleWithdraw(selectedInvestment)
                      }}
                    >
                      Retirer maintenant
                    </button>
                  )}
                  {selectedInvestment.status === 'MATURED' && (
                    <button 
                      className="btn-primary"
                      onClick={() => {
                        setSelectedInvestment(null)
                        handleWithdraw(selectedInvestment)
                      }}
                    >
                      Retirer maintenant
                    </button>
                  )}
                  <button className="btn-secondary">
                    Voir sur blockchain
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


