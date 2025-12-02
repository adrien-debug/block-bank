'use client'

import { useState } from 'react'
import { formatDateShort } from '@/lib/utils'
import ChartIcon from '../icons/ChartIcon'
import ShieldIcon from '../icons/ShieldIcon'
import InfoIcon from '../icons/InfoIcon'
import type { CreditTier, PartnerPlatform, CreditScoreNFTMetadata, PartnerAccess } from '@/types'

type CreditScoreTab = 'overview' | 'nft' | 'partners'

export default function CreditScore() {
  const [activeTab, setActiveTab] = useState<CreditScoreTab>('overview')
  const score = 750
  const tier: CreditTier = 'A'
  const previousScore = 738
  const scoreChange = score - previousScore
  
  // Données simplifiées pour le graphique donut
  const scoreComponents = {
    onChain: { value: 280, max: 300, label: 'On-Chain', color: '#2563EB' },
    offChain: { value: 250, max: 300, label: 'Off-Chain', color: '#3B82F6' },
    assets: { value: 150, max: 200, label: 'Assets', color: '#60A5FA' },
    reputation: { value: 70, max: 100, label: 'Reputation', color: '#93C5FD' },
  }

  const tierInfo = {
    'A+': {
      scoreRange: '>= 850',
      ltv: '70-85%',
      rate: '6-8%',
      maxAmount: '2,000,000 USDC',
    },
    A: { 
      scoreRange: '750-849',
      ltv: '60-70%', 
      rate: '6.5-8.5%', 
      maxAmount: '1,000,000 USDC',
    },
    B: {
      scoreRange: '600-749',
      ltv: '40-60%',
      rate: '8.5-10.5%',
      maxAmount: '500,000 USDC',
    },
    C: {
      scoreRange: '450-599',
      ltv: '30-40%',
      rate: '10.5-12.5%',
      maxAmount: '250,000 USDC',
    },
    D: {
      scoreRange: '< 450',
      ltv: '< 30%',
      rate: 'N/A',
      maxAmount: 'Refusé',
    }
  }

  const currentTier = tierInfo[tier]

  // Métadonnées NFT
  const nftMetadata: CreditScoreNFTMetadata = {
    tokenId: '0x1234...5678',
    contractAddress: '0xBlockBankCreditScore',
    walletAddress: '0xUser...Wallet',
    globalScore: score,
    tier: tier,
    subScores: {
      onChain: 280,
      offChain: 250,
      assets: 150,
      reputation: 70,
    },
    modelVersion: 'v2.1',
    issuedAt: Date.now() - 7 * 24 * 60 * 60 * 1000, // Il y a 7 jours
    validUntil: Date.now() + 23 * 24 * 60 * 60 * 1000, // Valide 30 jours
    dataHash: '0xabc123...def456',
    kycVerified: true,
    amlVerified: true,
    verificationLevel: 'enhanced',
    scoreHistory: {
      lastUpdate: Date.now() - 7 * 24 * 60 * 60 * 1000,
      trend: 'up',
      change: scoreChange,
    }
  }

  // Partenaires
  const partners: PartnerAccess[] = [
    { platform: 'REALT', platformName: 'RealT', authorized: true, accessCount: 12, lastAccessed: Date.now() - 2 * 24 * 60 * 60 * 1000, permissions: { readScore: true, readMetadata: true, readFullData: false } },
    { platform: 'TANGIBL', platformName: 'Tangibl', authorized: true, accessCount: 8, lastAccessed: Date.now() - 5 * 24 * 60 * 60 * 1000, permissions: { readScore: true, readMetadata: true, readFullData: false } },
    { platform: 'COURTYARD', platformName: 'Courtyard', authorized: false, accessCount: 0, permissions: { readScore: false, readMetadata: false, readFullData: false } },
    { platform: '4K', platformName: '4K', authorized: true, accessCount: 5, lastAccessed: Date.now() - 10 * 24 * 60 * 60 * 1000, permissions: { readScore: true, readMetadata: false, readFullData: false } },
    { platform: 'MAPLE', platformName: 'Maple', authorized: false, accessCount: 0, permissions: { readScore: false, readMetadata: false, readFullData: false } },
    { platform: 'BACKED', platformName: 'Backed Finance', authorized: true, accessCount: 3, lastAccessed: Date.now() - 15 * 24 * 60 * 60 * 1000, permissions: { readScore: true, readMetadata: true, readFullData: false } },
    { platform: 'CENTRIFUGE', platformName: 'Centrifuge', authorized: false, accessCount: 0, permissions: { readScore: false, readMetadata: false, readFullData: false } },
    { platform: 'LANDSHARE', platformName: 'Landshare', authorized: false, accessCount: 0, permissions: { readScore: false, readMetadata: false, readFullData: false } },
    { platform: '21CO', platformName: '21.co', authorized: true, accessCount: 2, lastAccessed: Date.now() - 20 * 24 * 60 * 60 * 1000, permissions: { readScore: true, readMetadata: false, readFullData: false } },
    { platform: 'DIBBS', platformName: 'Dibbs', authorized: false, accessCount: 0, permissions: { readScore: false, readMetadata: false, readFullData: false } },
  ]

  const tabs = [
    { id: 'overview' as CreditScoreTab, label: 'Vue d\'ensemble', icon: ChartIcon },
    { id: 'nft' as CreditScoreTab, label: 'NFT Score', icon: ShieldIcon },
    { id: 'partners' as CreditScoreTab, label: 'Partenaires', icon: InfoIcon },
  ]

  // Fonction pour calculer le donut chart
  const calculateDonutChart = () => {
    const total = Object.values(scoreComponents).reduce((sum, comp) => sum + comp.value, 0)
    const radius = 80
    const circumference = 2 * Math.PI * radius
    let currentOffset = 0

    return Object.entries(scoreComponents).map(([key, comp]) => {
      const percentage = (comp.value / total) * 100
      const strokeDasharray = (comp.value / total) * circumference
      
      const result = {
        key,
        ...comp,
        percentage: percentage.toFixed(1),
        strokeDasharray,
        strokeDashoffset: currentOffset,
      }
      
      currentOffset += strokeDasharray
      return result
    })
  }

  const donutSegments = calculateDonutChart()

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Mon Credit Score</h1>
          <p className="page-subtitle">Score hybride on-chain/off-chain transparent et auditable</p>
        </div>
        <div className="score-header-actions">
          <button className="btn-secondary">Exporter le rapport</button>
          <button className="btn-primary">Mettre à jour</button>
        </div>
      </div>

      {/* Navigation Menu - 3 onglets simplifiés */}
      <div className="credit-score-nav-menu-premium">
        <nav className="credit-score-nav-horizontal">
          {tabs.map((tab) => {
            const IconComponent = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`credit-score-nav-item-premium ${activeTab === tab.id ? 'active' : ''}`}
              >
                <span className="credit-score-nav-icon-premium">
                  <IconComponent />
                </span>
                <span className="credit-score-nav-label-premium">{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Onglet Overview - Simplifié */}
      {activeTab === 'overview' && (
        <div className="credit-score-overview-simplified">
          {/* Score principal avec donut chart */}
          <div className="score-display-donut">
            <div className="donut-chart-container">
              <svg className="donut-chart" viewBox="0 0 200 200">
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="20"
                />
                {donutSegments.map((segment, index) => {
                  // Calculer l'angle de départ et de fin pour chaque segment
                  const total = Object.values(scoreComponents).reduce((sum, comp) => sum + comp.value, 0)
                  let startAngle = 0
                  for (let i = 0; i < index; i++) {
                    startAngle += (scoreComponents[Object.keys(scoreComponents)[i] as keyof typeof scoreComponents].value / total) * 360
                  }
                  const endAngle = startAngle + (segment.value / total) * 360
                  
                  // Convertir en radians
                  const startRad = (startAngle - 90) * (Math.PI / 180)
                  const endRad = (endAngle - 90) * (Math.PI / 180)
                  
                  // Calculer les points de l'arc
                  const x1 = 100 + 80 * Math.cos(startRad)
                  const y1 = 100 + 80 * Math.sin(startRad)
                  const x2 = 100 + 80 * Math.cos(endRad)
                  const y2 = 100 + 80 * Math.sin(endRad)
                  
                  const largeArc = endAngle - startAngle > 180 ? 1 : 0
                  
                  return (
                    <path
                      key={segment.key}
                      d={`M ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2}`}
                      fill="none"
                      stroke={segment.color}
                      strokeWidth="20"
                      strokeLinecap="round"
                    />
                  )
                })}
              </svg>
              <div className="donut-center">
                <div className="score-value-large">{score}</div>
                <div className="score-tier-badge">Tier {tier}</div>
                <div className="score-change-indicator">
                  {scoreChange > 0 ? '↑' : scoreChange < 0 ? '↓' : '→'} {Math.abs(scoreChange)} points
                </div>
              </div>
            </div>
            
            {/* Légende */}
            <div className="donut-legend">
              {Object.entries(scoreComponents).map(([key, comp]) => {
                const segment = donutSegments.find(s => s.key === key)
                return (
                  <div key={key} className="legend-item">
                    <div className="legend-color" style={{ backgroundColor: comp.color }}></div>
                    <div className="legend-info">
                      <span className="legend-label">{comp.label}</span>
                      <span className="legend-value">{comp.value}/{comp.max} ({segment?.percentage}%)</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Métriques essentielles */}
          <div className="score-metrics-grid">
            <div className="metric-card">
              <div className="metric-label">LTV Maximum</div>
              <div className="metric-value">{currentTier.ltv}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Taux d'intérêt (APY)</div>
              <div className="metric-value">{currentTier.rate}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Montant maximum</div>
              <div className="metric-value">{currentTier.maxAmount}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Plage de score</div>
              <div className="metric-value">{currentTier.scoreRange}</div>
            </div>
          </div>

          {/* Bouton vers NFT */}
          <div className="score-cta-nft">
            <button 
              className="btn-primary btn-large"
              onClick={() => setActiveTab('nft')}
            >
              Voir mon NFT de Score
            </button>
          </div>
        </div>
      )}

      {/* Onglet NFT Score */}
      {activeTab === 'nft' && (
        <div className="credit-score-nft">
          <div className="nft-visualization-card">
            <div className="nft-card-header">
              <h2>Soulbound NFT de Score</h2>
              <div className="nft-badge-soulbound">Soulbound • Non transférable</div>
            </div>
            
            {/* Visualisation NFT */}
            <div className="nft-card-visual">
              <div className="nft-card-design">
                <div className="nft-card-background">
                  <div className="nft-card-content">
                    <div className="nft-logo">BlockBank</div>
                    <div className="nft-score-display">{nftMetadata.globalScore}</div>
                    <div className="nft-tier-display">Tier {nftMetadata.tier}</div>
                    <div className="nft-token-id">#{nftMetadata.tokenId.slice(-8)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Métadonnées structurées */}
            <div className="nft-metadata-section">
              <h3>Métadonnées du NFT</h3>
              <div className="metadata-grid">
                <div className="metadata-item">
                  <span className="metadata-label">Token ID</span>
                  <span className="metadata-value">{nftMetadata.tokenId}</span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-label">Contract Address</span>
                  <span className="metadata-value font-mono">{nftMetadata.contractAddress}</span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-label">Wallet Address</span>
                  <span className="metadata-value font-mono">{nftMetadata.walletAddress}</span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-label">Score Global</span>
                  <span className="metadata-value">{nftMetadata.globalScore}/1000</span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-label">Tier</span>
                  <span className="metadata-value">Tier {nftMetadata.tier}</span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-label">Version du modèle</span>
                  <span className="metadata-value">{nftMetadata.modelVersion}</span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-label">Émis le</span>
                  <span className="metadata-value">{formatDateShort(new Date(nftMetadata.issuedAt))}</span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-label">Valide jusqu'au</span>
                  <span className="metadata-value">{formatDateShort(new Date(nftMetadata.validUntil))}</span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-label">Hash des données</span>
                  <span className="metadata-value font-mono text-xs">{nftMetadata.dataHash}</span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-label">KYC Vérifié</span>
                  <span className="metadata-value">{nftMetadata.kycVerified ? '✓ Oui' : '✗ Non'}</span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-label">AML Vérifié</span>
                  <span className="metadata-value">{nftMetadata.amlVerified ? '✓ Oui' : '✗ Non'}</span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-label">Niveau de vérification</span>
                  <span className="metadata-value capitalize">{nftMetadata.verificationLevel}</span>
                </div>
              </div>

              {/* Sous-scores */}
              <div className="nft-sub-scores">
                <h4>Sous-scores détaillés</h4>
                <div className="sub-scores-grid">
                  <div className="sub-score-item">
                    <span className="sub-score-label">On-Chain</span>
                    <span className="sub-score-value">{nftMetadata.subScores.onChain}/300</span>
                  </div>
                  <div className="sub-score-item">
                    <span className="sub-score-label">Off-Chain</span>
                    <span className="sub-score-value">{nftMetadata.subScores.offChain}/300</span>
                  </div>
                  <div className="sub-score-item">
                    <span className="sub-score-label">Assets</span>
                    <span className="sub-score-value">{nftMetadata.subScores.assets}/200</span>
                  </div>
                  <div className="sub-score-item">
                    <span className="sub-score-label">Reputation</span>
                    <span className="sub-score-value">{nftMetadata.subScores.reputation}/100</span>
                  </div>
                </div>
              </div>

              {/* Historique synthétique */}
              <div className="nft-history">
                <h4>Historique</h4>
                <div className="history-summary">
                  <div className="history-item">
                    <span className="history-label">Dernière mise à jour</span>
                    <span className="history-value">{formatDateShort(new Date(nftMetadata.scoreHistory.lastUpdate))}</span>
                  </div>
                  <div className="history-item">
                    <span className="history-label">Tendance</span>
                    <span className={`history-value history-trend-${nftMetadata.scoreHistory.trend}`}>
                      {nftMetadata.scoreHistory.trend === 'up' ? '↑ Hausse' : nftMetadata.scoreHistory.trend === 'down' ? '↓ Baisse' : '→ Stable'}
                    </span>
                  </div>
                  <div className="history-item">
                    <span className="history-label">Variation</span>
                    <span className="history-value">{nftMetadata.scoreHistory.change > 0 ? '+' : ''}{nftMetadata.scoreHistory.change} points</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="nft-actions">
              <button className="btn-primary">Vérifier sur blockchain</button>
              <button className="btn-secondary">Télécharger métadonnées JSON</button>
            </div>
          </div>
        </div>
      )}

      {/* Onglet Partenaires */}
      {activeTab === 'partners' && (
        <div className="credit-score-partners">
          <div className="partners-header">
            <div>
              <h2>Plateformes Partenaires</h2>
              <p>Gérez l'accès de vos partenaires à votre NFT de score via BlockBank</p>
            </div>
            <div className="partners-stats">
              <div className="stat-item">
                <span className="stat-value">{partners.filter(p => p.authorized).length}</span>
                <span className="stat-label">Autorisés</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{partners.reduce((sum, p) => sum + p.accessCount, 0)}</span>
                <span className="stat-label">Consultations</span>
              </div>
            </div>
          </div>

          <div className="partners-list">
            {partners.map((partner) => (
              <div key={partner.platform} className={`partner-card ${partner.authorized ? 'authorized' : ''}`}>
                <div className="partner-header">
                  <div className="partner-info">
                    <h3>{partner.platformName}</h3>
                    <div className="partner-status">
                      {partner.authorized ? (
                        <span className="status-badge authorized">✓ Autorisé</span>
                      ) : (
                        <span className="status-badge not-authorized">✗ Non autorisé</span>
                      )}
                    </div>
                  </div>
                  <div className="partner-stats-mini">
                    <div className="stat-mini">
                      <span className="stat-mini-value">{partner.accessCount}</span>
                      <span className="stat-mini-label">consultations</span>
                    </div>
                    {partner.lastAccessed && (
                      <div className="stat-mini">
                        <span className="stat-mini-label">Dernière consultation</span>
                        <span className="stat-mini-value">{formatDateShort(new Date(partner.lastAccessed))}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="partner-permissions">
                  <h4>Permissions actuelles</h4>
                  <div className="permissions-list">
                    <div className="permission-item">
                      <span className={`permission-icon ${partner.permissions.readScore ? 'enabled' : 'disabled'}`}>
                        {partner.permissions.readScore ? '✓' : '✗'}
                      </span>
                      <span>Lecture du score</span>
                    </div>
                    <div className="permission-item">
                      <span className={`permission-icon ${partner.permissions.readMetadata ? 'enabled' : 'disabled'}`}>
                        {partner.permissions.readMetadata ? '✓' : '✗'}
                      </span>
                      <span>Lecture des métadonnées</span>
                    </div>
                    <div className="permission-item">
                      <span className={`permission-icon ${partner.permissions.readFullData ? 'enabled' : 'disabled'}`}>
                        {partner.permissions.readFullData ? '✓' : '✗'}
                      </span>
                      <span>Accès complet</span>
                    </div>
                  </div>
                </div>

                <div className="partner-actions">
                  {partner.authorized ? (
                    <>
                      <button className="btn-secondary btn-small">Modifier permissions</button>
                      <button className="btn-danger btn-small">Révoquer l'accès</button>
                      {partner.apiKey && (
                        <button className="btn-ghost btn-small">Voir clé API</button>
                      )}
                    </>
                  ) : (
                    <button className="btn-primary btn-small">Autoriser l'accès</button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Documentation API */}
          <div className="partners-api-docs">
            <h3>Documentation API pour partenaires</h3>
            <p>Les plateformes partenaires peuvent intégrer votre NFT de score via notre API BlockBank.</p>
            <div className="api-info">
              <div className="api-endpoint">
                <span className="api-method">GET</span>
                <span className="api-path">/api/credit-score/nft/{'{tokenId}'}</span>
              </div>
              <div className="api-endpoint">
                <span className="api-method">GET</span>
                <span className="api-path">/api/credit-score/nft/metadata/{'{tokenId}'}</span>
              </div>
            </div>
            <button className="btn-secondary">Voir la documentation complète</button>
          </div>
        </div>
      )}
    </div>
  )
}
