'use client'

import { useState } from 'react'

export default function CreditScore() {
  const [selectedPeriod, setSelectedPeriod] = useState('6m')
  const score = 750
  const tier = 'A'
  const previousScore = 738
  const scoreChange = score - previousScore
  
  const scoreBreakdown = {
    onChain: { 
      value: 280, 
      max: 300, 
      label: 'On-Chain Behavioral',
      percentage: 93,
      details: [
        { label: 'Volume de transactions', value: 95, status: 'excellent' },
        { label: 'Historique wallet', value: 88, status: 'good' },
        { label: 'Diversité d\'actifs', value: 92, status: 'excellent' },
        { label: 'Activité DeFi', value: 85, status: 'good' },
      ]
    },
    offChain: { 
      value: 250, 
      max: 300, 
      label: 'Off-Chain Financial',
      percentage: 83,
      details: [
        { label: 'Revenus stables', value: 90, status: 'excellent' },
        { label: 'Ratio dette/revenus', value: 75, status: 'good' },
        { label: 'Historique bancaire', value: 88, status: 'good' },
        { label: 'Stabilité professionnelle', value: 85, status: 'good' },
      ]
    },
    assets: { 
      value: 150, 
      max: 200, 
      label: 'Asset-Based',
      percentage: 75,
      details: [
        { label: 'Valeur totale NFT RWA', value: 80, status: 'good' },
        { label: 'Liquidité disponible', value: 70, status: 'average' },
        { label: 'Diversification actifs', value: 75, status: 'good' },
        { label: 'Qualité collatéraux', value: 85, status: 'good' },
      ]
    },
    reputation: { 
      value: 70, 
      max: 100, 
      label: 'Reputation & Trust',
      percentage: 70,
      details: [
        { label: 'Réputation on-chain', value: 75, status: 'good' },
        { label: 'Historique de paiements', value: 100, status: 'excellent' },
        { label: 'Références', value: 60, status: 'average' },
        { label: 'Vérifications KYC', value: 90, status: 'excellent' },
      ]
    },
  }

  const scoreHistory = {
    '6m': [680, 690, 700, 710, 720, 730, 738, 745, 750],
    '12m': [650, 665, 680, 690, 700, 710, 720, 730, 738, 745, 750],
    'all': [600, 620, 640, 660, 680, 690, 700, 710, 720, 730, 738, 745, 750],
  }

  const recommendations = [
    {
      title: 'Augmenter la liquidité disponible',
      description: 'Maintenir au moins 50,000 USDC en liquidité améliorerait votre score Asset-Based de 5 points',
      impact: '+5 points',
      priority: 'high'
    },
    {
      title: 'Diversifier vos actifs NFT RWA',
      description: 'Ajouter un actif de type infrastructure augmenterait votre diversification',
      impact: '+3 points',
      priority: 'medium'
    },
    {
      title: 'Améliorer l\'activité DeFi',
      description: 'Participer à plus de protocoles DeFi renforcerait votre profil on-chain',
      impact: '+2 points',
      priority: 'low'
    }
  ]

  const tierInfo = {
    A: { 
      ltv: '60-70%', 
      rate: '6.5-8.5%', 
      maxAmount: '1,000,000 USDC',
      benefits: ['Taux préférentiels', 'LTV élevé', 'Processus accéléré', 'Support prioritaire']
    },
    B: { ltv: '50-60%', rate: '8.5-10.5%', maxAmount: '500,000 USDC', benefits: [] },
    C: { ltv: '40-50%', rate: '10.5-12.5%', maxAmount: '250,000 USDC', benefits: [] },
  }

  const currentTier = tierInfo[tier as keyof typeof tierInfo]

  return (
    <div className="credit-score-page">
      <div className="score-page-header">
        <div>
          <h1>Mon Credit Score</h1>
          <p className="score-page-subtitle">Score hybride on-chain/off-chain transparent et auditable</p>
        </div>
        <div className="score-header-actions">
          <button className="btn-secondary">Exporter rapport</button>
          <button className="btn-primary">Mettre à jour</button>
        </div>
      </div>

      {/* Score principal avec évolution */}
      <div className="score-display-enhanced">
        <div className="score-circle-wrapper">
          <div className="score-circle">
            <div className="score-value">{score}</div>
            <div className="score-tier">Tranche {tier}</div>
            <div className="score-change">
              {scoreChange > 0 ? '↑' : '↓'} {Math.abs(scoreChange)} points
            </div>
          </div>
          <div className="score-comparison">
            <div className="comparison-item">
              <span className="comparison-label">Moyenne utilisateurs</span>
              <span className="comparison-value">685</span>
            </div>
            <div className="comparison-item">
              <span className="comparison-label">Top 10%</span>
              <span className="comparison-value">780+</span>
            </div>
          </div>
        </div>
        
        <div className="score-info-enhanced">
          <div className="score-badges">
            <div className="score-badge badge-a">Tranche {tier} • Excellent</div>
            <div className="score-trend-badge trend-up">
              <span>↑ +{scoreChange}</span>
              <span>vs mois dernier</span>
            </div>
          </div>
          
          <div className="score-benefits">
            <h3>Avantages de votre score</h3>
            <div className="benefits-grid">
              {currentTier.benefits && currentTier.benefits.map((benefit: string, index: number) => (
                <div key={index} className="benefit-item">
                  <span className="benefit-icon">✓</span>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="score-conditions">
            <div className="condition-item">
              <span className="condition-label">LTV maximum</span>
              <span className="condition-value">{currentTier.ltv}</span>
            </div>
            <div className="condition-item">
              <span className="condition-label">Taux d'intérêt</span>
              <span className="condition-value">{currentTier.rate}</span>
            </div>
            <div className="condition-item">
              <span className="condition-label">Montant maximum</span>
              <span className="condition-value">{currentTier.maxAmount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Graphique d'évolution */}
      <div className="score-chart-section">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Évolution du Credit Score</h3>
            <div className="chart-controls">
              <button 
                className={`chart-period-btn ${selectedPeriod === '6m' ? 'active' : ''}`}
                onClick={() => setSelectedPeriod('6m')}
              >
                6 mois
              </button>
              <button 
                className={`chart-period-btn ${selectedPeriod === '12m' ? 'active' : ''}`}
                onClick={() => setSelectedPeriod('12m')}
              >
                12 mois
              </button>
              <button 
                className={`chart-period-btn ${selectedPeriod === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedPeriod('all')}
              >
                Tout
              </button>
            </div>
          </div>
          <div className="chart-container-enhanced">
            <div className="line-chart-enhanced">
              {scoreHistory[selectedPeriod as keyof typeof scoreHistory].map((value, index, array) => {
                const maxValue = Math.max(...array)
                const minValue = Math.min(...array)
                const range = maxValue - minValue
                const percentage = ((value - minValue) / range) * 100
                const left = (index / (array.length - 1)) * 100
                
                return (
                  <div key={index} className="chart-point-enhanced" style={{ 
                    left: `${left}%`,
                    bottom: `${percentage}%`
                  }}>
                    <div className="point-tooltip">{value}</div>
                    <div className="point-dot-enhanced"></div>
                  </div>
                )
              })}
              <svg className="chart-line-enhanced" viewBox="0 0 1000 300">
                <path 
                  d={`M ${scoreHistory[selectedPeriod as keyof typeof scoreHistory].map((value, index, array) => {
                    const maxValue = Math.max(...array)
                    const minValue = Math.min(...array)
                    const range = maxValue - minValue
                    const percentage = ((value - minValue) / range) * 100
                    const x = (index / (array.length - 1)) * 1000
                    const y = 300 - (percentage / 100) * 300
                    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
                  }).join(' ')}`}
                  stroke="var(--color-primary)"
                  fill="none"
                  strokeWidth="3"
                />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path 
                  d={`M ${scoreHistory[selectedPeriod as keyof typeof scoreHistory].map((value, index, array) => {
                    const maxValue = Math.max(...array)
                    const minValue = Math.min(...array)
                    const range = maxValue - minValue
                    const percentage = ((value - minValue) / range) * 100
                    const x = (index / (array.length - 1)) * 1000
                    const y = 300 - (percentage / 100) * 300
                    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
                  }).join(' ')} L 1000 300 L 0 300 Z`}
                  fill="url(#scoreGradient)"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Détail du score avec sous-composants */}
      <div className="score-breakdown-enhanced">
        <h2>Détail du score par composant</h2>
        <div className="breakdown-grid-enhanced">
          {Object.entries(scoreBreakdown).map(([key, data]) => (
            <div key={key} className="breakdown-card">
              <div className="breakdown-card-header">
                <div>
                  <h4>{data.label}</h4>
                  <div className="breakdown-percentage">{data.percentage}%</div>
                </div>
                <div className="breakdown-score">
                  <span className="score-current">{data.value}</span>
                  <span className="score-max">/{data.max}</span>
                </div>
              </div>
              
              <div className="breakdown-bar-enhanced">
                <div 
                  className="breakdown-fill-enhanced"
                  style={{ width: `${data.percentage}%` }}
                />
              </div>

              <div className="breakdown-details">
                {data.details.map((detail, index) => (
                  <div key={index} className="detail-row">
                    <div className="detail-info">
                      <span className="detail-name">{detail.label}</span>
                      <span className={`detail-status status-${detail.status}`}>
                        {detail.status === 'excellent' ? 'Excellent' : 
                         detail.status === 'good' ? 'Bon' : 'Moyen'}
                      </span>
                    </div>
                    <div className="detail-bar-mini">
                      <div 
                        className="detail-bar-fill"
                        style={{ width: `${detail.value}%` }}
                      />
                    </div>
                    <span className="detail-value">{detail.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommandations */}
      <div className="score-recommendations">
        <h2>Recommandations pour améliorer votre score</h2>
        <div className="recommendations-grid">
          {recommendations.map((rec, index) => (
            <div key={index} className={`recommendation-card priority-${rec.priority}`}>
              <div className="recommendation-header">
                <div className="recommendation-icon">
                  {rec.priority === 'high' ? '🔥' : rec.priority === 'medium' ? '⚡' : '💡'}
                </div>
                <div className="recommendation-impact">{rec.impact}</div>
              </div>
              <h4>{rec.title}</h4>
              <p>{rec.description}</p>
              <button className="btn-secondary btn-small">En savoir plus</button>
            </div>
          ))}
        </div>
      </div>

      {/* Historique des changements */}
      <div className="score-history">
        <h2>Historique des changements</h2>
        <div className="history-timeline">
          <div className="history-item">
            <div className="history-date">15 Jan 2024</div>
            <div className="history-content">
              <div className="history-title">Score mis à jour</div>
              <div className="history-details">+12 points • Amélioration On-Chain Behavioral</div>
            </div>
            <div className="history-score">750</div>
          </div>
          <div className="history-item">
            <div className="history-date">1 Jan 2024</div>
            <div className="history-content">
              <div className="history-title">Nouveau NFT RWA ajouté</div>
              <div className="history-details">+8 points • Asset-Based amélioré</div>
            </div>
            <div className="history-score">738</div>
          </div>
          <div className="history-item">
            <div className="history-date">15 Déc 2023</div>
            <div className="history-content">
              <div className="history-title">Paiement effectué à temps</div>
              <div className="history-details">+5 points • Reputation améliorée</div>
            </div>
            <div className="history-score">730</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="score-actions-enhanced">
        <button className="btn-primary">Mettre à jour mon score</button>
        <button className="btn-secondary">Voir l&apos;historique complet</button>
        <button className="btn-ghost">Télécharger le rapport PDF</button>
      </div>
    </div>
  )
}
