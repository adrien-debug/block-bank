'use client'

import { useState } from 'react'

export default function CreditScore() {
  const score = 750
  const tier = 'A'
  const previousScore = 738
  const scoreChange = score - previousScore
  
  const scoreBreakdown = {
    onChain: { 
      value: 280, 
      max: 300, 
      label: 'On-Chain Behavioral Analytics',
      percentage: 93,
      weight: '30-45%',
      description: 'Mesure de discipline, sophistication et risque pris par le client sur la blockchain',
      details: [
        { label: 'Transaction volume & frequency', value: 95, status: 'excellent', description: 'Volume total et régularité des transactions' },
        { label: 'Wallet history & age', value: 88, status: 'good', description: 'Ancienneté et consistance des comportements' },
        { label: 'Asset diversity', value: 92, status: 'excellent', description: 'Diversité des actifs (stablecoins, BTC, ETH, altcoins)' },
        { label: 'DeFi activity', value: 85, status: 'good', description: 'Utilisation protocoles DeFi (lending, borrowing, LP, leverage)' },
        { label: 'Stablecoin stability', value: 90, status: 'excellent', description: 'Proportion de réserves en actifs stables' },
        { label: 'Liquidation history', value: 100, status: 'excellent', description: 'Absence de liquidations significatives' },
        { label: 'Sybil & fraud detection', value: 85, status: 'good', description: 'Absence de patterns suspects ou wash trading' },
      ],
      techniques: [
        'Graph ML (clustering d\'adresses)',
        'Analyse Markovienne de transitions',
        'Détection de patterns extrêmes',
        'Scoring positif pour stabilité'
      ]
    },
    offChain: { 
      value: 250, 
      max: 300, 
      label: 'Off-Chain Financial & Corporate Metrics',
      percentage: 83,
      weight: '30-40%',
      description: 'Évaluation de la solidité financière traditionnelle et corporate',
      details: [
        { label: 'Stable income', value: 90, status: 'excellent', description: 'Montant, source et stabilité sur 3-12 mois' },
        { label: 'Debt-to-income ratio', value: 75, status: 'good', description: 'Ratio dette/revenu avant et après nouveau prêt' },
        { label: 'Banking history', value: 88, status: 'good', description: 'Historique bancaire (incidents, découvert, retards)' },
        { label: 'Professional stability', value: 85, status: 'good', description: 'Stabilité professionnelle et historique fiscal' },
        { label: 'Wealth & assets', value: 80, status: 'good', description: 'Patrimoine (épargne, immobilier, portefeuilles externes)' },
        { label: 'Country of residence', value: 90, status: 'excellent', description: 'Risque juridique, politique et devise' },
      ],
      clientType: 'Particulier',
      corporateMetrics: [
        'P&L minier (revenus BTC vs coûts)',
        'Coût marginal d\'opération',
        'Dépendance énergétique',
        'Structure de dette existante',
        'Qualité des contrats (PPAs, baux)'
      ]
    },
    assets: { 
      value: 150, 
      max: 200, 
      label: 'Asset-Based Metrics (RWA)',
      percentage: 75,
      weight: '10-20%',
      description: 'Évaluation de l\'actif financé : immobilier, mining, machines, infrastructure',
      details: [
        { label: 'Total NFT RWA value', value: 80, status: 'good', description: 'Valeur totale des actifs tokenisés' },
        { label: 'Available liquidity', value: 70, status: 'average', description: 'Facilité de revente et profondeur du marché' },
        { label: 'Asset diversification', value: 75, status: 'good', description: 'Portefeuille d\'actifs vs concentration excessive' },
        { label: 'Collateral quality', value: 85, status: 'good', description: 'Valeur de marché (oracles + évaluations indépendantes)' },
        { label: 'Location risk', value: 90, status: 'excellent', description: 'Risque politique, juridique, climat, réglementation' },
        { label: 'Depreciation rate', value: 80, status: 'good', description: 'Dépréciation attendue selon type d\'actif' },
        { label: 'Insurance quality', value: 85, status: 'good', description: 'Qualité de l\'assurance existante (incendie, catastrophe)' },
      ],
      assetTypes: [
        'Immobilier (villas, propriétés)',
        'Fermes de mining Bitcoin',
        'Infrastructure énergétique',
        'Machines et équipements',
        'Commodities tokenisées'
      ]
    },
    reputation: { 
      value: 70, 
      max: 100, 
      label: 'Reputation & Trust Layer',
      percentage: 70,
      weight: '5-10%',
      description: 'Historique de remboursement, durée de relation, vérifications et références',
      details: [
        { label: 'On-chain reputation', value: 75, status: 'good', description: 'Score via protocoles réputation et historique interactions' },
        { label: 'Payment history', value: 100, status: 'excellent', description: 'Historique de remboursement interne (prêts passés)' },
        { label: 'Platform relationship', value: 80, status: 'good', description: 'Durée de la relation avec la plateforme' },
        { label: 'KYC verifications', value: 90, status: 'excellent', description: 'Usage d\'identités vérifiables (DID, zk-KYC)' },
        { label: 'Voluntary audits', value: 60, status: 'average', description: 'Participation volontaire à des audits renforcés' },
        { label: 'References', value: 60, status: 'average', description: 'Signalement par autres institutions de confiance' },
      ],
      factors: [
        'Historique de remboursement interne',
        'Durée de la relation',
        'Participation audits renforcés',
        'Usage identités vérifiables',
        'Social graph Web3 (facultatif)'
      ]
    },
  }

  const scoreHistory = {
    '1m': [745, 748, 750],
    '6m': [680, 690, 700, 710, 720, 730, 738, 745, 750],
    '12m': [650, 665, 680, 690, 700, 710, 720, 730, 738, 745, 750],
    'all': [600, 620, 640, 660, 680, 690, 700, 710, 720, 730, 738, 745, 750],
  }

  const recommendations = [
    {
      title: 'Augmenter la liquidité disponible',
      description: 'Maintenir au moins 50,000 USDC en liquidité améliorerait votre score Asset-Based de 5 points. Cela démontre votre capacité à gérer les fluctuations de marché.',
      impact: '+5 points',
      priority: 'high',
      action: 'Déposer des stablecoins',
      category: 'Asset-Based'
    },
    {
      title: 'Diversifier vos actifs NFT RWA',
      description: 'Ajouter un actif de type infrastructure augmenterait votre diversification et réduirait le risque de concentration. Cela améliorerait votre score Asset-Based.',
      impact: '+3 points',
      priority: 'medium',
      action: 'Explorer le marketplace',
      category: 'Asset-Based'
    },
    {
      title: 'Améliorer l\'activité DeFi',
      description: 'Participer à plus de protocoles DeFi (lending, staking, LP) renforcerait votre profil on-chain et démontrerait votre sophistication technique.',
      impact: '+2 points',
      priority: 'low',
      action: 'Voir les protocoles',
      category: 'On-Chain'
    },
    {
      title: 'Augmenter la proportion de stablecoins',
      description: 'Maintenir plus de 40% de votre portefeuille en stablecoins pendant les périodes de stress améliorerait votre score On-Chain Behavioral.',
      impact: '+4 points',
      priority: 'high',
      action: 'Rééquilibrer le portefeuille',
      category: 'On-Chain'
    },
    {
      title: 'Compléter la vérification KYC',
      description: 'Compléter votre vérification KYC avec des documents supplémentaires améliorerait votre score Off-Chain Financial et Reputation.',
      impact: '+6 points',
      priority: 'medium',
      action: 'Mettre à jour KYC',
      category: 'Off-Chain'
    },
    {
      title: 'Améliorer l\'historique de paiement',
      description: 'Effectuer tous vos paiements de prêt à l\'avance ou à temps améliorerait significativement votre score Reputation & Trust.',
      impact: '+3 points',
      priority: 'medium',
      action: 'Voir mes prêts',
      category: 'Reputation'
    }
  ]

  const tierInfo = {
    'A+': {
      scoreRange: '>= 850',
      ltv: '70-85%',
      rate: '6-8%',
      maxAmount: '2,000,000 USDC',
      maxDuration: '48 months',
      insurance: 'Senior + Junior possible',
      riskLevel: 'Ultra faible',
      description: 'Risque ultra faible, clients premium',
      benefits: [
        'Taux préférentiels les plus bas',
        'LTV maximum élevé (70-85%)',
        'Processus accéléré',
        'Support prioritaire',
        'Accès assurance tranche senior + junior',
        'Montant maximum élevé'
      ]
    },
    A: { 
      scoreRange: '750-849',
      ltv: '60-70%', 
      rate: '6.5-8.5%', 
      maxAmount: '1,000,000 USDC',
      maxDuration: '48 months',
      insurance: 'Senior standard',
      riskLevel: 'Faible',
      description: 'Risque faible, conditions très favorables',
      benefits: [
        'Taux préférentiels',
        'LTV élevé (60-70%)',
        'Processus accéléré',
        'Support prioritaire',
        'Accès assurance senior standard'
      ]
    },
    B: {
      scoreRange: '600-749',
      ltv: '40-60%',
      rate: '8.5-10.5%',
      maxAmount: '500,000 USDC',
      maxDuration: '36 months',
      insurance: 'Senior + Mezzanine',
      riskLevel: 'Moyen',
      description: 'Risque moyen, LTV modéré',
      benefits: [
        'Taux compétitifs',
        'LTV modéré (40-60%)',
        'Accès assurance senior + mezzanine'
      ]
    },
    C: {
      scoreRange: '450-599',
      ltv: '30-40%',
      rate: '10.5-12.5%',
      maxAmount: '250,000 USDC',
      maxDuration: '24 months',
      insurance: 'Mezzanine uniquement',
      riskLevel: 'Élevé',
      description: 'Risque élevé, LTV limité',
      benefits: [
        'Accès crédit avec conditions strictes',
        'LTV limité (30-40%)',
        'Assurance mezzanine uniquement'
      ]
    },
    D: {
      scoreRange: '< 450',
      ltv: '< 30% ou 100% collatéral',
      rate: 'Non pertinent',
      maxAmount: 'Refusé ou cas spéciaux',
      maxDuration: 'N/A',
      insurance: 'Pas de couverture / cas spéciaux',
      riskLevel: 'Très élevé',
      description: 'Risque très élevé, crédit refusé ou collatéral quasi total',
      benefits: []
    }
  }

  const currentTier = tierInfo[tier as keyof typeof tierInfo]

  return (
    <div className="credit-score-page">
      <div className="score-page-header">
        <div>
          <h1>My Credit Score</h1>
          <p className="score-page-subtitle">Transparent and auditable hybrid on-chain/off-chain score</p>
        </div>
        <div className="score-header-actions">
          <button className="btn-secondary">Export report</button>
          <button className="btn-primary">Update</button>
        </div>
      </div>

      {/* Main score with evolution */}
      <div className="score-display-enhanced">
        <div className="score-circle-wrapper">
          <div className="score-circle">
            <div className="score-value">{score}</div>
            <div className="score-tier">Tier {tier}</div>
            <div className="score-change">
              {scoreChange > 0 ? '↑' : '↓'} {Math.abs(scoreChange)} points
            </div>
          </div>
          <div className="score-comparison">
            <div className="comparison-item">
              <span className="comparison-label">User average</span>
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
            <div className="score-badge badge-a">Tier {tier} • Excellent</div>
            <div className="score-trend-badge trend-up">
              <span>↑ +{scoreChange}</span>
              <span>vs last month</span>
            </div>
          </div>
          
          <div className="score-benefits">
            <h3>Benefits of your score</h3>
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
              <span className="condition-label">Plage de score</span>
              <span className="condition-value">{currentTier.scoreRange || '750-849'}</span>
            </div>
            <div className="condition-item">
              <span className="condition-label">LTV Maximum</span>
              <span className="condition-value">{currentTier.ltv}</span>
            </div>
            <div className="condition-item">
              <span className="condition-label">Taux d'intérêt (APY)</span>
              <span className="condition-value">{currentTier.rate}</span>
            </div>
            <div className="condition-item">
              <span className="condition-label">Montant maximum</span>
              <span className="condition-value">{currentTier.maxAmount}</span>
            </div>
            <div className="condition-item">
              <span className="condition-label">Durée maximum</span>
              <span className="condition-value">{currentTier.maxDuration || '48 months'}</span>
            </div>
            <div className="condition-item">
              <span className="condition-label">Accès assurance</span>
              <span className="condition-value">{currentTier.insurance || 'Standard'}</span>
            </div>
            <div className="condition-item">
              <span className="condition-label">Niveau de risque</span>
              <span className="condition-value">{currentTier.riskLevel || 'Faible'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Evolution chart */}
      <div className="score-chart-section">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Credit Score Evolution</h3>
          </div>
          <div className="chart-container-enhanced">
            <div className="line-chart-enhanced">
              {scoreHistory.all.map((value, index, array) => {
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
                <defs>
                  <linearGradient id="scoreLineGradient-all" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#1F2937" />
                    <stop offset="50%" stopColor="#4B5563" />
                    <stop offset="100%" stopColor="#1F2937" />
                  </linearGradient>
                  <linearGradient id="scoreGradient-all" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1F2937" stopOpacity="0.4" />
                    <stop offset="50%" stopColor="#4B5563" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#1F2937" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path 
                  d={`M ${scoreHistory.all.map((value, index, array) => {
                    const maxValue = Math.max(...array)
                    const minValue = Math.min(...array)
                    const range = maxValue - minValue
                    const percentage = ((value - minValue) / range) * 100
                    const x = (index / (array.length - 1)) * 1000
                    const y = 300 - (percentage / 100) * 300
                    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
                  }).join(' ')}`}
                  stroke="url(#scoreLineGradient-all)"
                  fill="none"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path 
                  d={`M ${scoreHistory.all.map((value, index, array) => {
                    const maxValue = Math.max(...array)
                    const minValue = Math.min(...array)
                    const range = maxValue - minValue
                    const percentage = ((value - minValue) / range) * 100
                    const x = (index / (array.length - 1)) * 1000
                    const y = 300 - (percentage / 100) * 300
                    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
                  }).join(' ')} L 1000 300 L 0 300 Z`}
                  fill="url(#scoreGradient-all)"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Score breakdown by component */}
      <div className="score-breakdown-enhanced">
        <h2>Score breakdown by component</h2>
        <div className="breakdown-grid-enhanced">
          {Object.entries(scoreBreakdown).map(([key, data]) => (
            <div key={key} className="breakdown-card">
              <div className="breakdown-card-header">
                <div>
                  <h4>{data.label}</h4>
                  <div className="breakdown-percentage">{data.percentage}%</div>
                  {data.weight && (
                    <div className="breakdown-weight">Pondération: {data.weight}</div>
                  )}
                </div>
                <div className="breakdown-score">
                  <span className="score-current">{data.value}</span>
                  <span className="score-max">/{data.max}</span>
                </div>
              </div>
              {data.description && (
                <p className="breakdown-description">{data.description}</p>
              )}
              
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
                      <div className="detail-name-wrapper">
                        <span className="detail-name">{detail.label}</span>
                        {detail.description && (
                          <span className="detail-tooltip" title={detail.description}>ℹ️</span>
                        )}
                      </div>
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
              {'techniques' in data && data.techniques && (
                <div className="breakdown-techniques">
                  <h5>Techniques utilisées :</h5>
                  <ul>
                    {data.techniques.map((tech: string, index: number) => (
                      <li key={index}>{tech}</li>
                    ))}
                  </ul>
                </div>
              )}
              {'corporateMetrics' in data && data.corporateMetrics && (
                <div className="breakdown-corporate">
                  <h5>Métriques Corporate (si applicable) :</h5>
                  <ul>
                    {data.corporateMetrics.map((metric: string, index: number) => (
                      <li key={index}>{metric}</li>
                    ))}
                  </ul>
                </div>
              )}
              {'assetTypes' in data && data.assetTypes && (
                <div className="breakdown-asset-types">
                  <h5>Types d'actifs évalués :</h5>
                  <ul>
                    {data.assetTypes.map((type: string, index: number) => (
                      <li key={index}>{type}</li>
                    ))}
                  </ul>
                </div>
              )}
              {'factors' in data && data.factors && (
                <div className="breakdown-factors">
                  <h5>Facteurs évalués :</h5>
                  <ul>
                    {data.factors.map((factor: string, index: number) => (
                      <li key={index}>{factor}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="score-recommendations">
        <h2>Recommendations to improve your score</h2>
            <div className="recommendations-grid">
              {recommendations.map((rec, index) => (
                <div key={index} className={`recommendation-card priority-${rec.priority}`}>
                  <div className="recommendation-header">
                    <div className="recommendation-icon">
                      {rec.priority === 'high' ? '🔥' : rec.priority === 'medium' ? '⚡' : '💡'}
                    </div>
                    <div className="recommendation-impact">{rec.impact}</div>
                    {rec.category && (
                      <div className="recommendation-category">{rec.category}</div>
                    )}
                  </div>
                  <h4>{rec.title}</h4>
                  <p>{rec.description}</p>
                  {rec.action && (
                    <button className="btn-secondary btn-small">{rec.action}</button>
                  )}
                </div>
              ))}
            </div>
      </div>

      {/* Change history */}
      <div className="score-history">
        <h2>Change history</h2>
        <div className="history-timeline">
          <div className="history-item">
            <div className="history-date">Jan 15, 2024</div>
            <div className="history-content">
              <div className="history-title">Score updated</div>
              <div className="history-details">+12 points • On-Chain Behavioral improvement</div>
            </div>
            <div className="history-score">750</div>
          </div>
          <div className="history-item">
            <div className="history-date">Jan 1, 2024</div>
            <div className="history-content">
              <div className="history-title">New NFT RWA added</div>
              <div className="history-details">+8 points • Asset-Based improved</div>
            </div>
            <div className="history-score">738</div>
          </div>
          <div className="history-item">
            <div className="history-date">Dec 15, 2023</div>
            <div className="history-content">
              <div className="history-title">Payment made on time</div>
              <div className="history-details">+5 points • Reputation improved</div>
            </div>
            <div className="history-score">730</div>
          </div>
        </div>
      </div>

      {/* Tokenisation NFT */}
      <div className="score-tokenisation">
        <h2>Tokenisation & NFT de Score</h2>
        <div className="tokenisation-card">
          <div className="tokenisation-info">
            <h3>Soulbound NFT de Score</h3>
            <p>
              Votre score est encapsulé dans un <strong>Soulbound NFT</strong> non transférable
              attaché à l'identité on-chain de votre wallet.
            </p>
            <div className="nft-content-list">
              <h4>Contenu du NFT de score :</h4>
              <ul>
                <li>Score global : <strong>{score}/1000</strong></li>
                <li>Tranche : <strong>{tier}</strong></li>
                <li>Détails synthétiques : sous-scores A/B/C/D</li>
                <li>Version du modèle de scoring : <strong>v2.1</strong></li>
                <li>Timestamp d'émission : <strong>{new Date().toLocaleDateString('fr-FR')}</strong></li>
                <li>Validité : <strong>30 jours</strong></li>
                <li>Hash des données sources (off-chain) pour audit</li>
                <li>Référence à la vérification KYC / AML</li>
              </ul>
            </div>
            <div className="nft-usage">
              <h4>Utilisation par les autres modules :</h4>
              <ul>
                <li>Les contrats de prêt lisent directement ce NFT pour décider des LTV</li>
                <li>Les pools d'assurance utilisent le score pour tarifer la prime</li>
                <li>Qatar et co-investisseurs peuvent auditer anonymement les portefeuilles par distribution de scores</li>
              </ul>
              <p className="nft-note">
                Le NFT joue un rôle de <strong>"passeport de risque"</strong> portable entre
                différents produits de crédit du protocole.
              </p>
            </div>
          </div>
          <div className="tokenisation-actions">
            <button className="btn-primary">Voir mon NFT de score</button>
            <button className="btn-secondary">Vérifier sur blockchain</button>
          </div>
        </div>
      </div>

      {/* KPIs et Gouvernance */}
      <div className="score-governance">
        <h2>KPIs, Gouvernance & Auditabilité</h2>
        <div className="governance-grid">
          <div className="governance-card">
            <h3>KPIs de Performance</h3>
            <div className="kpi-list">
              <div className="kpi-item">
                <span className="kpi-label">Taux de défaut par tranche</span>
                <span className="kpi-value">Tier {tier}: 0.8%</span>
              </div>
              <div className="kpi-item">
                <span className="kpi-label">Loss Given Default réelle vs attendue</span>
                <span className="kpi-value">-12% (meilleure que prévu)</span>
              </div>
              <div className="kpi-item">
                <span className="kpi-label">Stabilité du score (volatilité)</span>
                <span className="kpi-value">Faible (2.3 points/mois)</span>
              </div>
              <div className="kpi-item">
                <span className="kpi-label">Taux de migration entre tranches</span>
                <span className="kpi-value">B → A: 15% des utilisateurs</span>
              </div>
              <div className="kpi-item">
                <span className="kpi-label">Impact macro sur défauts</span>
                <span className="kpi-value">Corrélation faible avec cycles BTC</span>
              </div>
            </div>
          </div>
          <div className="governance-card">
            <h3>Gouvernance & Audits</h3>
            <div className="governance-list">
              <div className="governance-item">
                <span className="governance-icon">✓</span>
                <div>
                  <strong>Documentation détaillée</strong>
                  <p>Modèle de scoring entièrement documenté et versionné</p>
                </div>
              </div>
              <div className="governance-item">
                <span className="governance-icon">✓</span>
                <div>
                  <strong>Audit externe</strong>
                  <p>Audit régulier par cabinet de risk / Big Four</p>
                </div>
              </div>
              <div className="governance-item">
                <span className="governance-icon">✓</span>
                <div>
                  <strong>Journalisation</strong>
                  <p>Tous les changements de paramètres (pondérations, cut-offs) sont journalisés</p>
                </div>
              </div>
              <div className="governance-item">
                <span className="governance-icon">✓</span>
                <div>
                  <strong>Backtesting</strong>
                  <p>Tests récurrents vs base de prêts réalisée</p>
                </div>
              </div>
            </div>
            <p className="governance-note">
              Le modèle ne reste pas figé : il est versionné, testé,
              et ajusté selon la réalité terrain tout en restant stable
              pour ne pas être arbitraire.
            </p>
          </div>
        </div>
      </div>

      {/* Toutes les tranches de score */}
      <div className="score-all-tiers">
        <h2>Toutes les tranches de score</h2>
        <div className="tiers-table">
          <table>
            <thead>
              <tr>
                <th>Tranche</th>
                <th>Score</th>
                <th>LTV max</th>
                <th>Taux indicatif</th>
                <th>Montant max</th>
                <th>Durée max</th>
                <th>Accès assurance</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(tierInfo).map(([tierKey, tierData]) => (
                <tr key={tierKey} className={tier === tierKey ? 'current-tier' : ''}>
                  <td>
                    <span className={`badge-tier tier-${tierKey.toLowerCase().replace('+', 'plus')}`}>
                      {tierKey}
                    </span>
                  </td>
                  <td>{tierData.scoreRange}</td>
                  <td>{tierData.ltv}</td>
                  <td>{tierData.rate}</td>
                  <td>{tierData.maxAmount}</td>
                  <td>{tierData.maxDuration || 'N/A'}</td>
                  <td>{tierData.insurance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions */}
      <div className="score-actions-enhanced">
        <button className="btn-primary">Mettre à jour mon score</button>
        <button className="btn-secondary">Voir l'historique complet</button>
        <button className="btn-ghost">Télécharger le rapport PDF</button>
      </div>
    </div>
  )
}
