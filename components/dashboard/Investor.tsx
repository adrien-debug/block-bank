'use client'

import { useState } from 'react'
import InvestorIcon from '../icons/InvestorIcon'
import ChartIcon from '../icons/ChartIcon'
import MoneyIcon from '../icons/MoneyIcon'
import InfoIcon from '../icons/InfoIcon'

type InvestorTab = 'pools' | 'my-investments' | 'analytics' | 'info'

interface Pool {
  id: number
  name: string
  token: 'USDC' | 'USDT'
  apy: number
  totalLiquidity: string
  availableLiquidity: string
  minDeposit: string
  lockPeriod: string
  riskLevel: 'low' | 'medium' | 'high'
  description: string
}

export default function Investor() {
  const [activeTab, setActiveTab] = useState<InvestorTab>('pools')
  const [selectedPool, setSelectedPool] = useState<number | null>(null)
  const [depositAmount, setDepositAmount] = useState('')
  const [showDepositModal, setShowDepositModal] = useState(false)

  const pools: Pool[] = [
    {
      id: 1,
      name: 'Pool USDC Premium',
      token: 'USDC',
      apy: 12.5,
      totalLiquidity: '2,500,000',
      availableLiquidity: '850,000',
      minDeposit: '1,000',
      lockPeriod: '30 days',
      riskLevel: 'low',
      description: 'Secure pool for real estate loan financing with NFT RWA guarantees',
    },
    {
      id: 2,
      name: 'Pool USDT Yield',
      token: 'USDT',
      apy: 11.8,
      totalLiquidity: '1,800,000',
      availableLiquidity: '420,000',
      minDeposit: '1,000',
      lockPeriod: '30 days',
      riskLevel: 'low',
      description: 'Pool dedicated to Bitcoin mining project financing with collateralization',
    },
    {
      id: 3,
      name: 'Pool USDC Growth',
      token: 'USDC',
      apy: 15.2,
      totalLiquidity: '3,200,000',
      availableLiquidity: '1,100,000',
      minDeposit: '5,000',
      lockPeriod: '90 days',
      riskLevel: 'medium',
      description: 'High-yield pool for medium-term loan financing',
    },
    {
      id: 4,
      name: 'Pool USDT Aggressive',
      token: 'USDT',
      apy: 18.5,
      totalLiquidity: '950,000',
      availableLiquidity: '180,000',
      minDeposit: '10,000',
      lockPeriod: '180 days',
      riskLevel: 'high',
      description: 'High-yield pool for experienced investors, long lock period',
    },
  ]

  const handleDeposit = (poolId: number) => {
    setSelectedPool(poolId)
    setShowDepositModal(true)
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'var(--color-success)'
      case 'medium':
        return 'var(--color-warning)'
      case 'high':
        return 'var(--color-error)'
      default:
        return 'var(--color-text-secondary)'
    }
  }

  const getRiskLabel = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'Low'
      case 'medium':
        return 'Medium'
      case 'high':
        return 'High'
      default:
        return risk
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
          <h1>Investor</h1>
          <p className="page-subtitle">Finance liquidity pools and generate yields with APY</p>
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
            <div className="stat-value">8,450,000 USDC</div>
          </div>
        </div>
        <div className="investor-stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-info">
            <div className="stat-label">Average APY</div>
            <div className="stat-value">14.5%</div>
          </div>
        </div>
        <div className="investor-stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <div className="stat-label">Active investors</div>
            <div className="stat-value">1,247</div>
          </div>
        </div>
        <div className="investor-stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-info">
            <div className="stat-label">Available pools</div>
            <div className="stat-value">{pools.length}</div>
          </div>
        </div>
      </div>

      {activeTab === 'pools' && (
        <div className="pools-section">
          <h2 className="section-title">Available Funding Pools</h2>
          <div className="pools-grid">
          {pools.map((pool) => (
            <div key={pool.id} className="pool-card">
              <div className="pool-header">
                <div className="pool-title-section">
                  <h3>{pool.name}</h3>
                  <div className="pool-token-badge">
                    {pool.token === 'USDC' ? '💵' : '💸'} {pool.token}
                  </div>
                </div>
                <div className="pool-apy">
                  <div className="apy-value">{pool.apy}%</div>
                  <div className="apy-label">APY</div>
                </div>
              </div>

              <div className="pool-description">
                <p>{pool.description}</p>
              </div>

              <div className="pool-details">
                <div className="pool-detail-item">
                  <span className="detail-label">Total liquidity</span>
                  <span className="detail-value">{pool.totalLiquidity} {pool.token}</span>
                </div>
                <div className="pool-detail-item">
                  <span className="detail-label">Available</span>
                  <span className="detail-value highlight">{pool.availableLiquidity} {pool.token}</span>
                </div>
                <div className="pool-detail-item">
                  <span className="detail-label">Minimum deposit</span>
                  <span className="detail-value">{pool.minDeposit} {pool.token}</span>
                </div>
                <div className="pool-detail-item">
                  <span className="detail-label">Lock period</span>
                  <span className="detail-value">{pool.lockPeriod}</span>
                </div>
                <div className="pool-detail-item">
                  <span className="detail-label">Risk level</span>
                  <span 
                    className="detail-value risk-badge" 
                    style={{ color: getRiskColor(pool.riskLevel) }}
                  >
                    {getRiskLabel(pool.riskLevel)}
                  </span>
                </div>
              </div>

              <div className="pool-actions">
                <button 
                  className="btn-primary pool-deposit-btn"
                  onClick={() => handleDeposit(pool.id)}
                >
                  Invest in this pool
                </button>
              </div>
            </div>
          ))}
          </div>
        </div>
      )}

      {activeTab === 'my-investments' && (
        <div className="my-investments-section">
          <h2 className="section-title">My Investments</h2>
          <div className="investments-empty">
            <p>No active investments</p>
            <p className="empty-subtitle">Start investing in pools to see your investments here</p>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="analytics-section">
          <h2 className="section-title">Analytics</h2>
          <div className="analytics-grid">
            <div className="analytics-card">
              <h3>Total Invested</h3>
              <div className="analytics-value">0 USDC</div>
            </div>
            <div className="analytics-card">
              <h3>Total Returns</h3>
              <div className="analytics-value">0 USDC</div>
            </div>
            <div className="analytics-card">
              <h3>Average APY</h3>
              <div className="analytics-value">0%</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'info' && (
        <div className="info-section">
          <h2 className="section-title">Investor Information</h2>
          <div className="info-content">
            <div className="info-card">
              <h3>How it works</h3>
              <p>Invest in liquidity pools that fund loans backed by NFT RWAs. Earn competitive APY while supporting the BlockBank ecosystem.</p>
            </div>
            <div className="info-card">
              <h3>Risk Levels</h3>
              <ul>
                <li><strong>Low:</strong> Conservative pools with stable returns</li>
                <li><strong>Medium:</strong> Balanced risk-reward pools</li>
                <li><strong>High:</strong> Aggressive pools with higher potential returns</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Modal de dépôt */}
      {showDepositModal && selectedPool && (
        <div className="deposit-modal-overlay" onClick={() => setShowDepositModal(false)}>
          <div className="deposit-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Investir dans {pools.find(p => p.id === selectedPool)?.name}</h2>
              <button 
                className="modal-close"
                onClick={() => setShowDepositModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="pool-info-summary">
                <div className="summary-item">
                  <span>APY:</span>
                  <span className="summary-value">{pools.find(p => p.id === selectedPool)?.apy}%</span>
                </div>
                <div className="summary-item">
                  <span>Lock period:</span>
                  <span className="summary-value">{pools.find(p => p.id === selectedPool)?.lockPeriod}</span>
                </div>
                <div className="summary-item">
                  <span>Minimum deposit:</span>
                  <span className="summary-value">{pools.find(p => p.id === selectedPool)?.minDeposit} {pools.find(p => p.id === selectedPool)?.token}</span>
                </div>
              </div>

              <div className="deposit-form">
                <label className="form-label">
                  Amount to invest ({pools.find(p => p.id === selectedPool)?.token})
                </label>
                <input
                  type="number"
                  className="deposit-input"
                  placeholder={`Minimum: ${pools.find(p => p.id === selectedPool)?.minDeposit}`}
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                />
                
                {depositAmount && (
                  <div className="deposit-preview">
                    <div className="preview-item">
                      <span>Estimated annual return:</span>
                      <span className="preview-value">
                        {(parseFloat(depositAmount) * (pools.find(p => p.id === selectedPool)?.apy || 0) / 100).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })} {pools.find(p => p.id === selectedPool)?.token}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-actions">
                <button 
                  className="btn-secondary"
                  onClick={() => setShowDepositModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn-primary"
                  onClick={() => {
                    // Here we could add deposit logic
                    alert(`Depositing ${depositAmount} ${pools.find(p => p.id === selectedPool)?.token}...`)
                    setShowDepositModal(false)
                    setDepositAmount('')
                  }}
                  disabled={!depositAmount || parseFloat(depositAmount) < parseFloat(pools.find(p => p.id === selectedPool)?.minDeposit.replace(',', '') || '0')}
                >
                  Confirm investment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


