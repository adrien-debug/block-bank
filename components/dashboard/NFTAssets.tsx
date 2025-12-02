'use client'

import { useState } from 'react'
import { formatNumber, formatDateShort } from '@/lib/utils'
import { AssetType, NFTRiskClass, Marketplace } from '@/types'
import NFTIcon from '../icons/NFTIcon'
import NFTAssetIcon from '../icons/NFTAssetIcon'
import ChartIcon from '../icons/ChartIcon'
import PackageIcon from '../icons/PackageIcon'

type NFTTab = 'my-nfts' | 'marketplace' | 'tokenization' | 'analytics'

interface SPVInfo {
  name: string
  jurisdiction: string
  registrationNumber: string
  legalForm: string
}

interface NFTMetadata {
  location?: string
  size?: string
  yearBuilt?: number
  condition?: string
  documentationHash?: string
  inspectionDate?: string
  maintenanceHistory?: string[]
}

interface NFTAsset {
  id: string
  tokenId: string
  contractAddress: string
  type: string
  name: string
  description: string
  value: number
  currency: string
  status: 'locked' | 'available'
  lockedIn?: string
  assetType: AssetType
  riskClass: NFTRiskClass
  riskScore: number
  marketplace?: Marketplace
  spv?: SPVInfo
  metadata?: NFTMetadata
  createdAt: string
  updatedAt: string
  currentValue?: number
  originalValue?: number
  imageURI?: string
  metadataURI?: string
  ownerAddress?: string
}

type FilterType = 'all' | AssetType
type FilterStatus = 'all' | 'available' | 'locked'
type FilterRisk = 'all' | NFTRiskClass

export default function NFTAssets() {
  const [activeTab, setActiveTab] = useState<NFTTab>('my-nfts')
  const [hoveredNFT, setHoveredNFT] = useState<string | null>(null)
  const [selectedNFT, setSelectedNFT] = useState<NFTAsset | null>(null)
  const [showTokenizeModal, setShowTokenizeModal] = useState(false)
  const [filterType, setFilterType] = useState<FilterType>('all')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [filterRisk, setFilterRisk] = useState<FilterRisk>('all')

  const nftAssets: NFTAsset[] = [
    {
      id: '1',
      tokenId: '1234',
      contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
      type: 'Immobilier',
      name: 'Villa Paris',
      description: 'Appartement de luxe de 150m² dans le 16ème arrondissement de Paris',
      value: 300000,
      currency: 'USDC',
      status: 'locked',
      lockedIn: 'LOAN-2024-001',
      assetType: 'REAL_ESTATE',
      riskClass: 'SAFE',
      riskScore: 25,
      marketplace: 'REALT',
      spv: {
        name: 'SPV Paris Real Estate I',
        jurisdiction: 'France',
        registrationNumber: 'FR-123456789',
        legalForm: 'Société Civile Immobilière',
      },
      metadata: {
        location: 'Paris 16ème, France',
        size: '150 m²',
        yearBuilt: 2010,
        condition: 'Excellent',
        documentationHash: 'QmXxxx...',
        inspectionDate: '2024-01-10',
        maintenanceHistory: ['Inspection annuelle 2024', 'Rénovation 2020'],
      },
      createdAt: '2023-06-15',
      updatedAt: '2024-01-15',
      currentValue: 310000,
      originalValue: 300000,
      metadataURI: 'ipfs://QmXxxx...',
      imageURI: '/Villa-paris.jpeg',
      ownerAddress: '0xabc...def',
    },
    {
      id: '2',
      tokenId: '5678',
      contractAddress: '0x567890abcdef1234567890abcdef1234567890ab',
      type: 'Mining',
      name: 'Mining Farm',
      description: 'Installation de mining Bitcoin de 10MW avec 5000 ASICs',
      value: 150000,
      currency: 'USDC',
      status: 'locked',
      lockedIn: 'LOAN-2024-002',
      assetType: 'MINING',
      riskClass: 'MODERATE',
      riskScore: 45,
      marketplace: '4K',
      spv: {
        name: 'SPV Mining Operations I',
        jurisdiction: 'Qatar',
        registrationNumber: 'QA-987654321',
        legalForm: 'Limited Liability Company',
      },
      metadata: {
        location: 'Doha, Qatar',
        size: '10 MW',
        yearBuilt: 2022,
        condition: 'Bon',
        documentationHash: 'QmYyyy...',
        inspectionDate: '2024-01-05',
        maintenanceHistory: ['Maintenance trimestrielle', 'Mise à jour firmware'],
      },
      createdAt: '2023-08-20',
      updatedAt: '2024-01-20',
      currentValue: 145000,
      originalValue: 150000,
      metadataURI: 'ipfs://QmYyyy...',
      imageURI: '/Mining1.webp',
      ownerAddress: '0xabc...def',
    },
    {
      id: '3',
      tokenId: '9012',
      contractAddress: '0x9012abcdef34567890abcdef34567890abcdef34',
      type: 'Infrastructure',
      name: 'Data Center',
      description: 'Data center de 5000m² avec certification Tier III',
      value: 500000,
      currency: 'USDC',
      status: 'available',
      assetType: 'INFRASTRUCTURE',
      riskClass: 'SAFE',
      riskScore: 20,
      marketplace: '4K',
      spv: {
        name: 'SPV Infrastructure I',
        jurisdiction: 'Luxembourg',
        registrationNumber: 'LU-456789123',
        legalForm: 'Société à Responsabilité Limitée',
      },
      metadata: {
        location: 'Luxembourg',
        size: '5000 m²',
        yearBuilt: 2021,
        condition: 'Excellent',
        documentationHash: 'QmZzzz...',
        inspectionDate: '2024-01-15',
        maintenanceHistory: ['Audit sécurité 2024', 'Mise à niveau équipements'],
      },
      createdAt: '2023-11-01',
      updatedAt: '2024-01-15',
      currentValue: 520000,
      originalValue: 500000,
      metadataURI: 'ipfs://QmZzzz...',
      imageURI: '/Data-Center.avif',
      ownerAddress: '0xabc...def',
    },
    {
      id: '4',
      tokenId: '3456',
      contractAddress: '0x3456cdef78901234cdef78901234cdef78901234',
      type: 'Commodities',
      name: 'Gold Reserve',
      description: 'Réserve d\'or physique de 100 kg stockée en Suisse',
      value: 8000000,
      currency: 'USDC',
      status: 'available',
      assetType: 'COMMODITIES',
      riskClass: 'SAFE',
      riskScore: 15,
      marketplace: 'COURTYARD',
      spv: {
        name: 'SPV Precious Metals I',
        jurisdiction: 'Switzerland',
        registrationNumber: 'CH-789123456',
        legalForm: 'Aktiengesellschaft',
      },
      metadata: {
        location: 'Zurich, Switzerland',
        size: '100 kg',
        yearBuilt: 2023,
        condition: 'Excellent',
        documentationHash: 'QmWwww...',
        inspectionDate: '2024-01-20',
        maintenanceHistory: ['Audit annuel', 'Vérification pureté'],
      },
      createdAt: '2023-12-10',
      updatedAt: '2024-01-20',
      currentValue: 8200000,
      originalValue: 8000000,
      metadataURI: 'ipfs://QmWwww...',
      imageURI: '/Gold1.jpg',
      ownerAddress: '0xabc...def',
    },
  ]

  const filteredNFTs = nftAssets.filter(nft => {
    if (filterType !== 'all' && nft.assetType !== filterType) return false
    if (filterStatus !== 'all' && nft.status !== filterStatus) return false
    if (filterRisk !== 'all' && nft.riskClass !== filterRisk) return false
    return true
  })

  const stats = {
    total: nftAssets.length,
    available: nftAssets.filter(nft => nft.status === 'available').length,
    locked: nftAssets.filter(nft => nft.status === 'locked').length,
    totalValue: nftAssets.reduce((sum, nft) => sum + (nft.currentValue || nft.value), 0),
    availableValue: nftAssets.filter(nft => nft.status === 'available').reduce((sum, nft) => sum + (nft.currentValue || nft.value), 0),
  }

  const getRiskBadgeClass = (riskClass: string) => {
    if (riskClass === 'SAFE') return 'risk-badge-safe'
    if (riskClass === 'MODERATE') return 'risk-badge-moderate'
    return 'risk-badge-risky'
  }

  const tabs = [
    { id: 'my-nfts' as NFTTab, label: 'Mes NFT', icon: NFTAssetIcon },
    { id: 'marketplace' as NFTTab, label: 'Marketplace', icon: NFTIcon },
    { id: 'tokenization' as NFTTab, label: 'Tokenisation', icon: PackageIcon },
    { id: 'analytics' as NFTTab, label: 'Analytics', icon: ChartIcon },
  ]

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Mes NFT RWA</h1>
          <p className="page-subtitle">Gérez vos actifs réels tokenisés</p>
        </div>
        <button 
          className="btn-primary"
          onClick={() => setShowTokenizeModal(true)}
        >
          + Tokeniser un actif
        </button>
      </div>

      {/* Navigation Menu Horizontal */}
      <div className="nft-nav-menu">
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

      {/* Contenu selon l'onglet actif */}
      {activeTab === 'my-nfts' && (
        <>
      {/* Statistiques */}
      <div className="nft-stats">
        <div className="stat-card-nft">
          <div className="stat-label-nft">Total NFT</div>
          <div className="stat-value-nft">{stats.total}</div>
        </div>
        <div className="stat-card-nft">
          <div className="stat-label-nft">Disponibles</div>
          <div className="stat-value-nft">{stats.available}</div>
        </div>
        <div className="stat-card-nft">
          <div className="stat-label-nft">Verrouillés</div>
          <div className="stat-value-nft">{stats.locked}</div>
          </div>
        <div className="stat-card-nft">
          <div className="stat-label-nft">Valeur totale</div>
          <div className="stat-value-nft">{formatNumber(stats.totalValue)} USDC</div>
        </div>
        <div className="stat-card-nft">
          <div className="stat-label-nft">Valeur disponible</div>
          <div className="stat-value-nft">{formatNumber(stats.availableValue)} USDC</div>
            </div>
          </div>

      {/* Filtres simplifiés sur une ligne */}
      <div className="nft-filters-single-line">
        <div className="filter-section">
          <span className="filter-section-label">Type</span>
          <div className="filter-buttons">
            <button 
              className={`filter-btn-small ${filterType === 'all' ? 'active' : ''}`}
              onClick={() => setFilterType('all')}
            >
              Tous
            </button>
            <button 
              className={`filter-btn-small ${filterType === 'REAL_ESTATE' ? 'active' : ''}`}
              onClick={() => setFilterType('REAL_ESTATE')}
            >
              Immobilier
            </button>
            <button 
              className={`filter-btn-small ${filterType === 'MINING' ? 'active' : ''}`}
              onClick={() => setFilterType('MINING')}
            >
              Mining
            </button>
            <button 
              className={`filter-btn-small ${filterType === 'INFRASTRUCTURE' ? 'active' : ''}`}
              onClick={() => setFilterType('INFRASTRUCTURE')}
            >
              Infrastructure
            </button>
            <button 
              className={`filter-btn-small ${filterType === 'COMMODITIES' ? 'active' : ''}`}
              onClick={() => setFilterType('COMMODITIES')}
            >
              Commodities
            </button>
          </div>
        </div>
        
        <div className="filter-separator"></div>
        
        <div className="filter-section">
          <span className="filter-section-label">Statut</span>
          <div className="filter-buttons">
            <button 
              className={`filter-btn-small ${filterStatus === 'all' ? 'active' : ''}`}
              onClick={() => setFilterStatus('all')}
            >
              Tous
            </button>
            <button 
              className={`filter-btn-small ${filterStatus === 'available' ? 'active' : ''}`}
              onClick={() => setFilterStatus('available')}
            >
              Disponibles
            </button>
            <button 
              className={`filter-btn-small ${filterStatus === 'locked' ? 'active' : ''}`}
              onClick={() => setFilterStatus('locked')}
            >
              Verrouillés
            </button>
          </div>
        </div>
        
        <div className="filter-separator"></div>
        
        <div className="filter-section">
          <span className="filter-section-label">Risque</span>
          <div className="filter-buttons">
            <button 
              className={`filter-btn-small ${filterRisk === 'all' ? 'active' : ''}`}
              onClick={() => setFilterRisk('all')}
            >
              Tous
            </button>
            <button 
              className={`filter-btn-small ${filterRisk === 'SAFE' ? 'active' : ''}`}
              onClick={() => setFilterRisk('SAFE')}
            >
              SAFE
            </button>
            <button 
              className={`filter-btn-small ${filterRisk === 'MODERATE' ? 'active' : ''}`}
              onClick={() => setFilterRisk('MODERATE')}
            >
              MODERATE
            </button>
            <button 
              className={`filter-btn-small ${filterRisk === 'RISKY' ? 'active' : ''}`}
              onClick={() => setFilterRisk('RISKY')}
            >
              RISKY
            </button>
          </div>
        </div>
        
        {(filterType !== 'all' || filterStatus !== 'all' || filterRisk !== 'all') && (
          <button 
            className="btn-reset-filters-inline"
            onClick={() => {
              setFilterType('all')
              setFilterStatus('all')
              setFilterRisk('all')
            }}
            title="Réinitialiser les filtres"
          >
            ✕ Réinitialiser
          </button>
        )}
      </div>

      {/* Grille NFT */}
      <div className="nft-grid">
        {filteredNFTs.length === 0 ? (
          <div className="nft-empty-state">
            <div className="empty-state-icon">📦</div>
            <h3>Aucun NFT RWA trouvé</h3>
            <p>Tokenisez votre premier actif réel pour commencer</p>
            <button 
              className="btn-primary" 
              style={{ marginTop: 'var(--space-4)' }}
              onClick={() => setShowTokenizeModal(true)}
            >
              + Tokeniser un actif
            </button>
          </div>
        ) : (
          filteredNFTs.map((nft) => (
          <div 
            key={nft.id} 
            className={`explore-nft-card ${nft.status === 'locked' ? 'locked' : ''} ${hoveredNFT === nft.id ? 'hovered' : ''}`}
            onMouseEnter={() => setHoveredNFT(nft.id)}
            onMouseLeave={() => setHoveredNFT(null)}
          >
            {/* Badges Header */}
            <div className="nft-card-badges">
              <span className="nft-marketplace-badge-premium">
                {nft.type}
              </span>
              <span className={`nft-risk-badge-premium ${getRiskBadgeClass(nft.riskClass)}`}>
                {nft.riskClass}
              </span>
            </div>

            {/* Image/Preview */}
            <div className="nft-card-preview">
              {nft.imageURI ? (
                <>
                  <div className="nft-preview-image">
                    <img 
                      src={nft.imageURI} 
                      alt={nft.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: 'var(--radius-lg)'
                      }}
                    />
                  </div>
                  {nft.status === 'locked' && (
                    <div className="nft-selected-indicator">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" fill="var(--color-warning)" />
                        <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="nft-preview-gradient">
                    <div className="nft-preview-icon">
                      {nft.assetType === 'REAL_ESTATE' && '🏢'}
                      {nft.assetType === 'MINING' && '⛏️'}
                      {nft.assetType === 'INFRASTRUCTURE' && '🏗️'}
                      {nft.assetType === 'COMMODITIES' && '💎'}
                      {nft.assetType === 'OTHER' && '📦'}
                    </div>
                  </div>
                  {nft.status === 'locked' && (
                    <div className="nft-selected-indicator">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" fill="var(--color-warning)" />
                        <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Card Body */}
            <div className="nft-card-content">
              <div className="nft-card-title-section">
                <h3 className="nft-card-title">{nft.name}</h3>
                <span className="nft-card-type">{nft.type}</span>
              </div>

              <p className="nft-card-description">{nft.description}</p>

              <div className="nft-card-value">
                <div className="value-main">
                  <span className="value-amount-premium">{formatNumber(nft.value)}</span>
                  <span className="value-currency-premium">{nft.currency}</span>
                </div>
              </div>

              <div className="nft-card-meta">
                <div className="meta-row">
                  <span className="meta-label-premium">Token ID</span>
                  <span className="meta-value-premium">#{nft.tokenId}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label-premium">Risk Score</span>
                  <span className="meta-value-premium">{nft.riskScore}/100</span>
                </div>
                {nft.status === 'locked' && (
                  <div className="meta-row">
                    <span className="meta-label-premium">Used in</span>
                    <span className="meta-value-premium">{nft.lockedIn}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Card Footer */}
            <div className="nft-card-footer">
              {nft.status === 'available' ? (
                <>
                  <button 
                    className="btn-secondary"
                    style={{ marginBottom: 'var(--space-2)', width: '100%' }}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedNFT(nft)
                    }}
                  >
                    Voir détails
                  </button>
                  <button 
                    className="btn-primary"
                    style={{ width: '100%' }}
                    onClick={(e) => {
                      e.stopPropagation()
                      // Rediriger vers la création de prêt avec ce NFT
                      window.location.href = '/dashboard?tab=loans&nft=' + nft.id
                    }}
                  >
                    Utiliser pour prêt
                  </button>
                </>
              ) : (
                <button 
                  className="btn-secondary"
                  disabled
                  style={{ width: '100%' }}
                >
                  🔒 Locked - {nft.lockedIn}
                </button>
              )}
            </div>
          </div>
          ))
        )}
      </div>

        </>
      )}

      {activeTab === 'marketplace' && (
        <div className="nft-tab-content">
          <p>Marketplace - En développement</p>
        </div>
      )}

      {activeTab === 'tokenization' && (
        <div className="nft-tab-content">
          <p>Tokenisation - En développement</p>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="nft-tab-content">
          <p>Analytics - En développement</p>
        </div>
      )}

      {/* Modal détails NFT */}
      {selectedNFT && (
        <div className="nft-detail-modal" onClick={() => setSelectedNFT(null)}>
          <div className="nft-detail-content" onClick={(e) => e.stopPropagation()}>
            <div className="nft-detail-header">
              <div>
                <h2>{selectedNFT.name}</h2>
                <span className={`nft-risk-badge-premium ${getRiskBadgeClass(selectedNFT.riskClass)}`}>
                  {selectedNFT.riskClass} • Score: {selectedNFT.riskScore}/100
                </span>
              </div>
              <button className="btn-ghost" onClick={() => setSelectedNFT(null)}>✕</button>
            </div>

            <div className="nft-detail-body">
              {/* Image NFT */}
              {selectedNFT.imageURI && (
                <div className="detail-section">
                  <div className="nft-detail-image-container">
                    <img 
                      src={selectedNFT.imageURI} 
                      alt={selectedNFT.name}
                      style={{
                        width: '100%',
                        maxWidth: '600px',
                        height: 'auto',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid rgba(37, 99, 235, 0.1)',
                        boxShadow: 'var(--shadow-card)'
                      }}
                    />
                  </div>
                </div>
              )}
              
              {/* Informations principales */}
              <div className="detail-section">
                <h3>Informations principales</h3>
                <div className="nft-main-info-grid">
                  <div className="info-item">
                    <span className="info-label">Type</span>
                    <span className="info-value">{selectedNFT.type}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Valeur actuelle</span>
                    <span className="info-value">{formatNumber(selectedNFT.currentValue || selectedNFT.value)} {selectedNFT.currency}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Valeur initiale</span>
                    <span className="info-value">{formatNumber(selectedNFT.originalValue || selectedNFT.value)} {selectedNFT.currency}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Token ID</span>
                    <span className="info-value">#{selectedNFT.tokenId}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Contract Address</span>
                    <span className="info-value code">{selectedNFT.contractAddress}</span>
                  </div>
                  {selectedNFT.marketplace && (
                    <div className="info-item">
                      <span className="info-label">Marketplace</span>
                      <span className="info-value">{selectedNFT.marketplace}</span>
                    </div>
                  )}
                  <div className="info-item">
                    <span className="info-label">Statut</span>
                    <span className={`info-value status-${selectedNFT.status}`}>
                      {selectedNFT.status === 'locked' ? '🔒 Verrouillé' : '✅ Disponible'}
                    </span>
                  </div>
                  {selectedNFT.status === 'locked' && selectedNFT.lockedIn && (
                    <div className="info-item">
                      <span className="info-label">Utilisé dans</span>
                      <span className="info-value">{selectedNFT.lockedIn}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="detail-section">
                <h3>Description</h3>
                <p className="nft-description-full">{selectedNFT.description}</p>
              </div>

              {/* Métadonnées */}
              {selectedNFT.metadata && (
                <div className="detail-section">
                  <h3>Métadonnées</h3>
                  <div className="metadata-grid">
                    {selectedNFT.metadata.location && (
                      <div className="metadata-item">
                        <span className="metadata-label">Localisation</span>
                        <span className="metadata-value">{selectedNFT.metadata.location}</span>
                      </div>
                    )}
                    {selectedNFT.metadata.size && (
                      <div className="metadata-item">
                        <span className="metadata-label">Taille</span>
                        <span className="metadata-value">{selectedNFT.metadata.size}</span>
                      </div>
                    )}
                    {selectedNFT.metadata.yearBuilt && (
                      <div className="metadata-item">
                        <span className="metadata-label">Année de construction</span>
                        <span className="metadata-value">{selectedNFT.metadata.yearBuilt}</span>
                      </div>
                    )}
                    {selectedNFT.metadata.condition && (
                      <div className="metadata-item">
                        <span className="metadata-label">Condition</span>
                        <span className="metadata-value">{selectedNFT.metadata.condition}</span>
                      </div>
                    )}
                    {selectedNFT.metadata.inspectionDate && (
                      <div className="metadata-item">
                        <span className="metadata-label">Date d'inspection</span>
                        <span className="metadata-value">{formatDateShort(selectedNFT.metadata.inspectionDate)}</span>
                      </div>
                    )}
                    {selectedNFT.metadata.documentationHash && (
                      <div className="metadata-item">
                        <span className="metadata-label">Hash documentation</span>
                        <span className="metadata-value code">{selectedNFT.metadata.documentationHash}</span>
                      </div>
                    )}
                  </div>
                  {selectedNFT.metadata.maintenanceHistory && selectedNFT.metadata.maintenanceHistory.length > 0 && (
                    <div className="maintenance-history">
                      <h4>Historique de maintenance</h4>
                      <ul>
                        {selectedNFT.metadata.maintenanceHistory.map((item: string, index: number) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* SPV Information */}
              {selectedNFT.spv && (
                <div className="detail-section">
                  <h3>Informations SPV</h3>
                  <div className="spv-info-card">
                    <div className="spv-item">
                      <span className="spv-label">Nom SPV</span>
                      <span className="spv-value">{selectedNFT.spv.name}</span>
                    </div>
                    <div className="spv-item">
                      <span className="spv-label">Juridiction</span>
                      <span className="spv-value">{selectedNFT.spv.jurisdiction}</span>
                    </div>
                    <div className="spv-item">
                      <span className="spv-label">Numéro d'enregistrement</span>
                      <span className="spv-value">{selectedNFT.spv.registrationNumber}</span>
                    </div>
                    <div className="spv-item">
                      <span className="spv-label">Forme légale</span>
                      <span className="spv-value">{selectedNFT.spv.legalForm}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Informations blockchain */}
              <div className="detail-section">
                <h3>Informations blockchain</h3>
                <div className="blockchain-info">
                  <div className="blockchain-item">
                    <span className="blockchain-label">Metadata URI (IPFS)</span>
                    <a href={selectedNFT.metadataURI} target="_blank" rel="noopener noreferrer" className="blockchain-link">
                      {selectedNFT.metadataURI || 'N/A'}
                    </a>
                  </div>
                  <div className="blockchain-item">
                    <span className="blockchain-label">Propriétaire</span>
                    <span className="blockchain-value code">{selectedNFT.ownerAddress || 'N/A'}</span>
                  </div>
                  <div className="blockchain-item">
                    <span className="blockchain-label">Date de création</span>
                    <span className="blockchain-value">{formatDateShort(selectedNFT.createdAt)}</span>
                  </div>
                  <div className="blockchain-item">
                    <span className="blockchain-label">Dernière mise à jour</span>
                    <span className="blockchain-value">{formatDateShort(selectedNFT.updatedAt)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {selectedNFT.status === 'available' && (
                <div className="detail-section">
                  <h3>Actions</h3>
                  <div className="nft-actions-grid">
                    <button 
                      className="btn-primary"
                      onClick={() => {
                        setSelectedNFT(null)
                        window.location.href = '/dashboard?tab=loans&nft=' + selectedNFT.id
                      }}
                    >
                      Utiliser pour prêt
                    </button>
                    <button className="btn-secondary">
                      Voir sur blockchain
                    </button>
                    <button className="btn-secondary">
                      Télécharger documentation
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal tokenisation */}
      {showTokenizeModal && (
        <div className="tokenize-modal" onClick={() => setShowTokenizeModal(false)}>
          <div className="tokenize-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="tokenize-modal-header">
              <h2>Tokeniser un actif réel</h2>
              <button className="btn-ghost" onClick={() => setShowTokenizeModal(false)}>✕</button>
            </div>
            <form className="tokenize-form" onSubmit={(e) => {
              e.preventDefault()
              setShowTokenizeModal(false)
            }}>
              <div className="form-group">
                <label>Type d'actif</label>
                <select required>
                  <option value="">Sélectionner un type</option>
                  <option value="REAL_ESTATE">Immobilier</option>
                  <option value="MINING">Mining</option>
                  <option value="INFRASTRUCTURE">Infrastructure</option>
                  <option value="COMMODITIES">Commodities</option>
                  <option value="OTHER">Autre</option>
                </select>
              </div>
              <div className="form-group">
                <label>Nom de l'actif</label>
                <input type="text" placeholder="Ex: Villa Paris" required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea placeholder="Description détaillée de l'actif" rows={4} required></textarea>
              </div>
              <div className="form-group">
                <label>Valeur estimée (USDC)</label>
                <input type="number" placeholder="300000" required />
              </div>
              <div className="form-group">
                <label>Localisation</label>
                <input type="text" placeholder="Ex: Paris, France" required />
              </div>
              <div className="form-group">
                <label>Marketplace source (optionnel)</label>
                <select>
                  <option value="">Aucun</option>
                  <option value="REALT">RealT</option>
                  <option value="TANGIBL">Tangibl</option>
                  <option value="COURTYARD">Courtyard</option>
                  <option value="4K">4K</option>
                  <option value="MAPLE">Maple</option>
                  <option value="BACKED">Backed Finance</option>
                  <option value="CENTRIFUGE">Centrifuge</option>
                  <option value="LANDSHARE">Landshare</option>
                  <option value="21CO">21.co</option>
                  <option value="DIBBS">Dibbs</option>
                </select>
              </div>
              <div className="form-group">
                <label>Documentation (hash IPFS ou URL)</label>
                <input type="text" placeholder="ipfs://QmXxxx..." />
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowTokenizeModal(false)} className="btn-secondary">
                  Annuler
                </button>
                <button type="submit" className="btn-primary">
                  Tokeniser l'actif
          </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
