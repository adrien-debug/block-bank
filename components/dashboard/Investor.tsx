'use client'

import { useState } from 'react'
import { formatNumber, formatDateShort } from '@/lib/utils'
import InvestorIcon from '../icons/InvestorIcon'
import ChartIcon from '../icons/ChartIcon'
import MoneyIcon from '../icons/MoneyIcon'
import InfoIcon from '../icons/InfoIcon'
import MoneyBagIcon from '../icons/MoneyBagIcon'
import ChartUpIcon from '../icons/ChartUpIcon'
import UsersIcon from '../icons/UsersIcon'
import DollarIcon from '../icons/DollarIcon'
import CreditCardIcon from '../icons/CreditCardIcon'
import PackageIcon from '../icons/PackageIcon'
import WarningIcon from '../icons/WarningIcon'

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

  // Pools regroupés par token pour affichage institutionnel
  const pools: Pool[] = [
    {
      id: 'POOL-USDC',
      name: 'Liquidity Pool USDC',
      type: 'PRIMARY',
      token: 'USDC',
      totalLiquidity: 4500000,
      availableLiquidity: 1650000,
      totalInvestors: 642,
      tranches: [
        {
          type: 'SENIOR',
          apy: 8.5,
          totalLiquidity: 2500000,
          availableLiquidity: 750000,
          minDeposit: 10000,
          riskLevel: 'low',
          description: 'Tranche senior sécurisée, faible probabilité de perte',
          lossAbsorption: 0,
        },
        {
          type: 'MEZZANINE',
          apy: 12.5,
          totalLiquidity: 1500000,
          availableLiquidity: 650000,
          minDeposit: 5000,
          riskLevel: 'medium',
          description: 'Rendement supérieur avec risque modéré',
          lossAbsorption: 20,
        },
        {
          type: 'JUNIOR',
          apy: 18.0,
          totalLiquidity: 500000,
          availableLiquidity: 250000,
          minDeposit: 1000,
          riskLevel: 'high',
          description: 'Capture maximale des primes, encaisse premières pertes',
          lossAbsorption: 100,
        },
      ],
      description: 'Pool institutionnel pour financement de prêts avec garanties NFT RWA',
      createdAt: '2023-06-01',
      utilizationRate: 63,
      totalLoansFunded: 78,
      defaultRate: 2.1,
      contractAddress: '0x1234...5678',
    },
    {
      id: 'POOL-USDT',
      name: 'Liquidity Pool USDT',
      type: 'PRIMARY',
      token: 'USDT',
      totalLiquidity: 3200000,
      availableLiquidity: 920000,
      totalInvestors: 398,
      tranches: [
        {
          type: 'SENIOR',
          apy: 9.0,
          totalLiquidity: 1800000,
          availableLiquidity: 520000,
          minDeposit: 10000,
          riskLevel: 'low',
          description: 'Tranche senior sécurisée',
          lossAbsorption: 0,
        },
        {
          type: 'MEZZANINE',
          apy: 13.5,
          totalLiquidity: 1100000,
          availableLiquidity: 320000,
          minDeposit: 5000,
          riskLevel: 'medium',
          description: 'Rendement équilibré',
          lossAbsorption: 25,
        },
        {
          type: 'JUNIOR',
          apy: 20.5,
          totalLiquidity: 300000,
          availableLiquidity: 80000,
          minDeposit: 1000,
          riskLevel: 'high',
          description: 'Rendement élevé, premières pertes',
          lossAbsorption: 100,
        },
      ],
      description: 'Pool institutionnel pour financement de projets avec collatéralisation',
      createdAt: '2023-08-15',
      utilizationRate: 71,
      totalLoansFunded: 52,
      defaultRate: 2.8,
      contractAddress: '0xabcd...efgh',
    },
    {
      id: 'POOL-DAI',
      name: 'Liquidity Pool DAI',
      type: 'PRIMARY',
      token: 'DAI',
      totalLiquidity: 3800000,
      availableLiquidity: 1400000,
      totalInvestors: 507,
      tranches: [
        {
          type: 'SENIOR',
          apy: 7.5,
          totalLiquidity: 2400000,
          availableLiquidity: 900000,
          minDeposit: 10000,
          riskLevel: 'low',
          description: 'Tranche senior très sécurisée',
          lossAbsorption: 0,
        },
        {
          type: 'MEZZANINE',
          apy: 11.8,
          totalLiquidity: 1200000,
          availableLiquidity: 450000,
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
      description: 'Pool institutionnel pour financement de prêts à moyen terme',
      createdAt: '2023-09-20',
      utilizationRate: 63,
      totalLoansFunded: 68,
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
        return 'var(--bb-blue)'
      case 'medium':
        return 'var(--bb-blue-light)'
      case 'high':
        return 'var(--bb-blue-dark)'
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
    <div className="page-container">
      <div className="page-header">
        <div>
          <div className="investor-header-top">
            <h1>Investisseur</h1>
          </div>
          <p className="page-subtitle">Financez les pools de liquidité et générez des rendements avec APY</p>
        </div>
      </div>

      {/* Sub-menu Navigation - Horizontal Layout */}
      <div className="investor-nav-menu">
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

      {/* Tableau de liquidité - Design premium symétrique */}
      <div className="liquidity-table-premium">
        <div className="liquidity-table-row-premium">
          <div className="liquidity-card-premium">
            <div className="liquidity-card-header-premium">
              <MoneyBagIcon className="liquidity-icon-premium" />
              <span className="liquidity-label-premium">Total Liquidity</span>
            </div>
            <div className="liquidity-value-premium">{formatNumber(stats.totalTVL)}</div>
          </div>
          <div className="liquidity-card-premium">
            <div className="liquidity-card-header-premium">
              <MoneyIcon className="liquidity-icon-premium" />
              <span className="liquidity-label-premium">Available</span>
            </div>
            <div className="liquidity-value-premium">{formatNumber(stats.totalAvailable)}</div>
          </div>
        </div>
        <div className="liquidity-table-row-premium">
          <div className="liquidity-card-premium">
            <div className="liquidity-card-header-premium">
              <ChartUpIcon className="liquidity-icon-premium" />
              <span className="liquidity-label-premium">APY Moyen Pondéré</span>
            </div>
            <div className="liquidity-value-premium">{stats.averageAPY.toFixed(2)}%</div>
          </div>
          <div className="liquidity-card-premium">
            <div className="liquidity-card-header-premium">
              <UsersIcon className="liquidity-icon-premium" />
              <span className="liquidity-label-premium">Investisseurs Actifs</span>
            </div>
            <div className="liquidity-value-premium">{stats.totalInvestors}</div>
          </div>
        </div>
      </div>

      {activeTab === 'pools' && (
        <div className="pools-section">
          <div className="pools-section-header">
            <h2 className="section-title">Pools de Liquidité Institutionnels</h2>
            <span className="section-subtitle-inline"> - Investissez selon votre profil de risque avec des rendements compétitifs</span>
          </div>
          
          {/* Pools groupés par token */}
          <div className="pools-by-token">
            {pools.map((pool) => {
              // Calculer l'APY moyen pondéré pour ce pool
              const totalPoolLiquidity = pool.tranches.reduce((sum, t) => sum + t.totalLiquidity, 0)
              const weightedAPY = pool.tranches.reduce((sum, t) => {
                return sum + (t.apy * (t.totalLiquidity / totalPoolLiquidity))
              }, 0)
              
              return (
                <div key={pool.id} className="pool-token-card">
                  <div className="pool-token-header">
                    <div className="pool-token-title">
                      {pool.token === 'USDC' ? (
                        <MoneyIcon className="token-icon-large" />
                      ) : pool.token === 'USDT' ? (
                        <DollarIcon className="token-icon-large" />
                      ) : (
                        <CreditCardIcon className="token-icon-large" />
                      )}
                      <div>
                        <h3>
                          <span className="pool-token-badge-title">{pool.token}</span> Liquidity Pool
                        </h3>
                        <div className="pool-token-meta">
                          <span>TVL: {formatNumber(pool.totalLiquidity)} {pool.token}</span>
                          <span>•</span>
                          <span>APY Moyen: {weightedAPY.toFixed(2)}%</span>
                          <span>•</span>
                          <span>{pool.totalInvestors} investisseurs</span>
                        </div>
                      </div>
                    </div>
                    <div className="pool-token-available">
                      <span className="available-label">Disponible</span>
                      <span className="available-value">{formatNumber(pool.availableLiquidity)} {pool.token}</span>
                    </div>
                  </div>

                  {/* Tranches en format institutionnel */}
                  <div className="pool-tranches-institutional">
                    {pool.tranches
                      .sort((a, b) => {
                        // Trier: Senior, Mezzanine, Junior
                        const order = { 'SENIOR': 1, 'MEZZANINE': 2, 'JUNIOR': 3 }
                        return order[a.type] - order[b.type]
                      })
                      .map((tranche) => (
                        <div key={tranche.type} className="tranche-card-institutional">
                          <div className="tranche-header-institutional">
                            <div className="tranche-title-section">
                              <span className="tranche-label-institutional">{getTrancheLabel(tranche.type)}</span>
                              <span className="tranche-apy-institutional">{tranche.apy}% APY</span>
                            </div>
                            <span 
                              className="tranche-risk-badge" 
                              style={{ 
                                backgroundColor: getRiskColor(tranche.riskLevel) + '20',
                                color: getRiskColor(tranche.riskLevel)
                              }}
                            >
                              {getRiskLabel(tranche.riskLevel)}
                            </span>
                          </div>
                          
                          {/* Symétrie Liquidité Totale / Disponible */}
                          <div className="tranche-liquidity-symmetric">
                            <div className="tranche-liquidity-card">
                              <div className="tranche-liquidity-label">Total Liquidity</div>
                              <div className="tranche-liquidity-value">{formatNumber(tranche.totalLiquidity)} {pool.token}</div>
                            </div>
                            <div className="tranche-liquidity-card available">
                              <div className="tranche-liquidity-label">Available</div>
                              <div className="tranche-liquidity-value">{formatNumber(tranche.availableLiquidity)} {pool.token}</div>
                            </div>
                          </div>

                          <div className="tranche-stats-institutional">
                            <div className="tranche-stat-item">
                              <span className="tranche-stat-label">Dépôt minimum</span>
                              <span className="tranche-stat-value">{formatNumber(tranche.minDeposit)} {pool.token}</span>
                            </div>
                            <div className="tranche-stat-item">
                              <span className="tranche-stat-label">Absorption pertes</span>
                              <span className="tranche-stat-value">{tranche.lossAbsorption}%</span>
                            </div>
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
              )
            })}
          </div>
        </div>
      )}

      {activeTab === 'my-investments' && (
        <div className="my-investments-section">
          <h2 className="section-title">Mes investissements</h2>
          {investments.length === 0 ? (
            <div className="investments-empty-state">
              <div className="empty-state-icon">
                <PackageIcon />
              </div>
              <h3>Aucun investissement actif</h3>
              <p>Commencez à investir dans les pools pour voir vos investissements ici</p>
            </div>
          ) : (
            <>
              <div className="investments-summary">
                <div className="summary-card-investment">
                  <div className="summary-label-investment">Total investi</div>
                  <div className="summary-value-investment">{formatNumber(stats.totalInvested)} USDC</div>
                </div>
                <div className="summary-card-investment">
                  <div className="summary-label-investment">Rendements gagnés</div>
                  <div className="summary-value-investment">{formatNumber(stats.totalEarned)} USDC</div>
                </div>
                <div className="summary-card-investment">
                  <div className="summary-label-investment">Rendements estimés</div>
                  <div className="summary-value-investment">{formatNumber(stats.totalEstimated)} USDC</div>
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
                          <div className="investment-amount-large">{formatNumber(investment.amount)} {investment.token}</div>
                          <div className="investment-apy">{investment.apy}% APY</div>
                        </div>
                        <div className="investment-returns-section">
                          <div className="returns-item">
                            <span className="returns-label">Gagné</span>
                            <span className="returns-value earned">{formatNumber(investment.earnedReturns)} {investment.token}</span>
                          </div>
                          <div className="returns-item">
                            <span className="returns-label">Estimé</span>
                            <span className="returns-value estimated">{formatNumber(investment.estimatedReturns)} {investment.token}</span>
                          </div>
                        </div>
                      </div>

                      <div className="investment-details">
                        <div className="investment-detail-item">
                          <span className="investment-detail-label">Date de dépôt</span>
                          <span className="investment-detail-value">{formatDateShort(investment.depositDate)}</span>
                        </div>
                        <div className="investment-detail-item">
                          <span className="investment-detail-label">Période de verrouillage</span>
                          <span className="investment-detail-value">{investment.lockPeriod} jours</span>
                        </div>
                        <div className="investment-detail-item">
                          <span className="investment-detail-label">Date de déverrouillage</span>
                          <span className="investment-detail-value">{formatDateShort(investment.lockEndDate)}</span>
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
              <div className="analytics-value">{formatNumber(stats.totalInvested)} USDC</div>
              <div className="analytics-subtitle">Sur {investments.length} investissements</div>
            </div>
            <div className="analytics-card">
              <h3>Rendements totaux</h3>
              <div className="analytics-value">{formatNumber(stats.totalEarned)} USDC</div>
              <div className="analytics-subtitle">Gagnés jusqu'à présent</div>
            </div>
            <div className="analytics-card">
              <h3>Rendements estimés</h3>
              <div className="analytics-value">{formatNumber(stats.totalEstimated)} USDC</div>
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
                        <span>Investi: {formatNumber(poolTotal)} {pool.token}</span>
                        <span>Gagné: {formatNumber(poolEarned)} {pool.token}</span>
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
                    <div className="timeline-date">{formatDateShort(inv.depositDate)}</div>
                    <div className="timeline-content">
                      <div className="timeline-title">Investissement dans {inv.poolName}</div>
                      <div className="timeline-description">
                        {formatNumber(inv.amount)} {inv.token} • {getTrancheLabel(inv.trancheType)} • {inv.apy}% APY
                      </div>
                    </div>
                    <div className="timeline-amount">+{formatNumber(inv.amount)} {inv.token}</div>
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
                  <span className="risk-level-badge" style={{ color: 'var(--bb-blue)' }}>Faible</span>
                  <p>Pools conservateurs avec rendements stables. Idéal pour les investisseurs recherchant la sécurité.</p>
                </div>
                <div className="risk-level-item">
                  <span className="risk-level-badge" style={{ color: 'var(--bb-blue-light)' }}>Moyen</span>
                  <p>Pools équilibrés avec un compromis risque-rendement. Pour investisseurs modérés.</p>
                </div>
                <div className="risk-level-item">
                  <span className="risk-level-badge" style={{ color: 'var(--bb-blue-dark)' }}>Élevé</span>
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
                    <span className="summary-value">{formatNumber(tranche.minDeposit)} {selectedPool.token}</span>
                  </div>
                  <div className="summary-item">
                    <span>Liquidité disponible:</span>
                    <span className="summary-value">{formatNumber(tranche.availableLiquidity)} {selectedPool.token}</span>
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
                    placeholder={`Minimum: ${formatNumber(tranche.minDeposit)}`}
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
                          {formatNumber(parseFloat(depositAmount) * tranche.apy / 100)} {selectedPool.token}
                        </span>
                      </div>
                      <div className="preview-item">
                        <span>Rendement mensuel estimé:</span>
                        <span className="preview-value">
                          {formatNumber(parseFloat(depositAmount) * tranche.apy / 100 / 12)} {selectedPool.token}
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
                  <span className="withdraw-value">{formatNumber(selectedInvestment.amount)} {selectedInvestment.token}</span>
                </div>
                <div className="withdraw-item">
                  <span className="withdraw-label">Rendements gagnés:</span>
                  <span className="withdraw-value earned">{formatNumber(selectedInvestment.earnedReturns)} {selectedInvestment.token}</span>
                </div>
                <div className="withdraw-item total">
                  <span className="withdraw-label">Total à retirer:</span>
                  <span className="withdraw-value total">
                    {formatNumber(selectedInvestment.amount + selectedInvestment.earnedReturns)} {selectedInvestment.token}
                  </span>
                </div>
              </div>

              <div className="withdraw-warning">
                {selectedInvestment.status === 'LOCKED' && (
                  <p className="warning-message">
                    <WarningIcon className="warning-icon" />
                    <span>Cet investissement est encore verrouillé. Vous ne pourrez retirer qu'après la date de déverrouillage.</span>
                  </p>
                )}
                {selectedInvestment.status === 'ACTIVE' && (
                  <p className="info-message">
                    <InfoIcon className="info-icon" />
                    <span>Vous pouvez retirer cet investissement maintenant. Les rendements seront calculés jusqu'à la date de retrait.</span>
                  </p>
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
                    alert(`Retrait de ${formatNumber(selectedInvestment.amount + selectedInvestment.earnedReturns)} ${selectedInvestment.token}...`)
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
                    <span className="detail-value">{formatNumber(selectedInvestment.amount)} {selectedInvestment.token}</span>
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
                    <span className="detail-value">{formatDateShort(selectedInvestment.depositDate)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Période de verrouillage</span>
                    <span className="detail-value">{selectedInvestment.lockPeriod} jours</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Date de déverrouillage</span>
                    <span className="detail-value">{formatDateShort(selectedInvestment.lockEndDate)}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Rendements</h3>
                <div className="returns-details">
                  <div className="returns-detail-item">
                    <span className="returns-detail-label">Rendements gagnés</span>
                    <span className="returns-detail-value earned">{formatNumber(selectedInvestment.earnedReturns)} {selectedInvestment.token}</span>
                  </div>
                  <div className="returns-detail-item">
                    <span className="returns-detail-label">Rendements estimés</span>
                    <span className="returns-detail-value estimated">{formatNumber(selectedInvestment.estimatedReturns)} {selectedInvestment.token}</span>
                  </div>
                  <div className="returns-detail-item total">
                    <span className="returns-detail-label">Total disponible</span>
                    <span className="returns-detail-value total">
                      {formatNumber(selectedInvestment.amount + selectedInvestment.earnedReturns)} {selectedInvestment.token}
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


