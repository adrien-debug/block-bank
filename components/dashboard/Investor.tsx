'use client'

import { useState } from 'react'

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
      lockPeriod: '30 jours',
      riskLevel: 'low',
      description: 'Pool sécurisé pour financement de prêts immobiliers avec garanties NFT RWA',
    },
    {
      id: 2,
      name: 'Pool USDT Yield',
      token: 'USDT',
      apy: 11.8,
      totalLiquidity: '1,800,000',
      availableLiquidity: '420,000',
      minDeposit: '1,000',
      lockPeriod: '30 jours',
      riskLevel: 'low',
      description: 'Pool dédié au financement de projets mining Bitcoin avec collatéralisation',
    },
    {
      id: 3,
      name: 'Pool USDC Growth',
      token: 'USDC',
      apy: 15.2,
      totalLiquidity: '3,200,000',
      availableLiquidity: '1,100,000',
      minDeposit: '5,000',
      lockPeriod: '90 jours',
      riskLevel: 'medium',
      description: 'Pool à rendement élevé pour financement de prêts à moyen terme',
    },
    {
      id: 4,
      name: 'Pool USDT Aggressive',
      token: 'USDT',
      apy: 18.5,
      totalLiquidity: '950,000',
      availableLiquidity: '180,000',
      minDeposit: '10,000',
      lockPeriod: '180 jours',
      riskLevel: 'high',
      description: 'Pool à haut rendement pour investisseurs expérimentés, période de blocage longue',
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
        return 'Faible'
      case 'medium':
        return 'Moyen'
      case 'high':
        return 'Élevé'
      default:
        return risk
    }
  }

  return (
    <div className="investor-page">
      <div className="page-header">
        <div>
          <h1>Investor</h1>
          <p className="page-subtitle">Financez les pools de liquidité et générez des rendements avec APY</p>
        </div>
      </div>

      {/* Statistiques globales */}
      <div className="investor-stats">
        <div className="investor-stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <div className="stat-label">TVL Total</div>
            <div className="stat-value">8,450,000 USDC</div>
          </div>
        </div>
        <div className="investor-stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-info">
            <div className="stat-label">APY Moyen</div>
            <div className="stat-value">14.5%</div>
          </div>
        </div>
        <div className="investor-stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <div className="stat-label">Investisseurs actifs</div>
            <div className="stat-value">1,247</div>
          </div>
        </div>
        <div className="investor-stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-info">
            <div className="stat-label">Pools disponibles</div>
            <div className="stat-value">{pools.length}</div>
          </div>
        </div>
      </div>

      {/* Liste des pools */}
      <div className="pools-section">
        <h2 className="section-title">Pools de financement disponibles</h2>
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
                  <span className="detail-label">Liquidité totale</span>
                  <span className="detail-value">{pool.totalLiquidity} {pool.token}</span>
                </div>
                <div className="pool-detail-item">
                  <span className="detail-label">Disponible</span>
                  <span className="detail-value highlight">{pool.availableLiquidity} {pool.token}</span>
                </div>
                <div className="pool-detail-item">
                  <span className="detail-label">Dépôt minimum</span>
                  <span className="detail-value">{pool.minDeposit} {pool.token}</span>
                </div>
                <div className="pool-detail-item">
                  <span className="detail-label">Période de blocage</span>
                  <span className="detail-value">{pool.lockPeriod}</span>
                </div>
                <div className="pool-detail-item">
                  <span className="detail-label">Niveau de risque</span>
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
                  Investir dans ce pool
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

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
                  <span>Période de blocage:</span>
                  <span className="summary-value">{pools.find(p => p.id === selectedPool)?.lockPeriod}</span>
                </div>
                <div className="summary-item">
                  <span>Dépôt minimum:</span>
                  <span className="summary-value">{pools.find(p => p.id === selectedPool)?.minDeposit} {pools.find(p => p.id === selectedPool)?.token}</span>
                </div>
              </div>

              <div className="deposit-form">
                <label className="form-label">
                  Montant à investir ({pools.find(p => p.id === selectedPool)?.token})
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
                      <span>Rendement estimé (annuel):</span>
                      <span className="preview-value">
                        {(parseFloat(depositAmount) * (pools.find(p => p.id === selectedPool)?.apy || 0) / 100).toLocaleString('fr-FR', {
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
                  Annuler
                </button>
                <button 
                  className="btn-primary"
                  onClick={() => {
                    // Ici on pourrait ajouter la logique de dépôt
                    alert(`Dépôt de ${depositAmount} ${pools.find(p => p.id === selectedPool)?.token} en cours...`)
                    setShowDepositModal(false)
                    setDepositAmount('')
                  }}
                  disabled={!depositAmount || parseFloat(depositAmount) < parseFloat(pools.find(p => p.id === selectedPool)?.minDeposit.replace(',', '') || '0')}
                >
                  Confirmer l'investissement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

