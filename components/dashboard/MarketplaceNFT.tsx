'use client'

import { useState, useEffect } from 'react'
import { NFTRWA, Marketplace, AssetType } from '@/types'
import { fetchNFTsFromMarketplaces, getAvailableMarketplaces, getAvailableAssetTypes } from '@/lib/services/marketplaceAggregator'

interface MarketplaceNFTProps {
  onSelectNFT: (nft: NFTRWA) => void
}

export default function MarketplaceNFT({ onSelectNFT }: MarketplaceNFTProps) {
  const [nfts, setNfts] = useState<NFTRWA[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedNFT, setSelectedNFT] = useState<NFTRWA | null>(null)
  const [hoveredNFT, setHoveredNFT] = useState<string | null>(null)
  
  // Filtres
  const [selectedMarketplace, setSelectedMarketplace] = useState<Marketplace | 'ALL'>('ALL')
  const [selectedAssetType, setSelectedAssetType] = useState<AssetType | 'ALL'>('ALL')
  const [minValue, setMinValue] = useState('')
  const [maxValue, setMaxValue] = useState('')
  const [selectedRiskClass, setSelectedRiskClass] = useState<'SAFE' | 'MODERATE' | 'RISKY' | 'ALL'>('ALL')

  const marketplaces = getAvailableMarketplaces()
  const assetTypes = getAvailableAssetTypes()

  useEffect(() => {
    loadNFTs()
  }, [selectedMarketplace, selectedAssetType, minValue, maxValue, selectedRiskClass])

  const loadNFTs = async () => {
    setLoading(true)
    try {
      const filters: any = {}
      if (selectedMarketplace !== 'ALL') filters.marketplace = selectedMarketplace
      if (selectedAssetType !== 'ALL') filters.assetType = selectedAssetType
      if (minValue) filters.minValue = parseFloat(minValue)
      if (maxValue) filters.maxValue = parseFloat(maxValue)
      if (selectedRiskClass !== 'ALL') filters.riskClass = selectedRiskClass
      
      const fetchedNFTs = await fetchNFTsFromMarketplaces(filters)
      setNfts(fetchedNFTs)
    } catch (error) {
      console.error('Erreur lors du chargement des NFT:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectNFT = (nft: NFTRWA) => {
    setSelectedNFT(nft)
    onSelectNFT(nft)
  }

  const getMarketplaceLabel = (marketplace: Marketplace): string => {
    const labels: Record<Marketplace, string> = {
      REALT: 'RealT',
      TANGIBL: 'Tangibl',
      COURTYARD: 'Courtyard',
      '4K': '4K',
      MAPLE: 'Maple',
      BACKED: 'Backed Finance',
      CENTRIFUGE: 'Centrifuge',
      LANDSHARE: 'Landshare',
      '21CO': '21.co',
      DIBBS: 'Dibbs',
    }
    return labels[marketplace]
  }

  const getAssetTypeLabel = (type: AssetType): string => {
    const labels: Record<AssetType, string> = {
      REAL_ESTATE: 'Immobilier',
      MINING: 'Mining',
      INFRASTRUCTURE: 'Infrastructure',
      COMMODITIES: 'Commodities',
      OTHER: 'Autre',
    }
    return labels[type]
  }

  const getRiskBadgeClass = (riskClass: string) => {
    if (riskClass === 'SAFE') return 'risk-badge-safe'
    if (riskClass === 'MODERATE') return 'risk-badge-moderate'
    return 'risk-badge-risky'
  }

  return (
    <div className="explore-marketplace-page">
      {/* Header Premium */}
      <div className="explore-page-header">
        <div className="explore-header-content">
          <div>
            <h1 className="explore-title">Explore NFT RWA</h1>
            <p className="explore-subtitle">Sélectionnez un actif réel tokenisé pour créer votre prêt</p>
          </div>
          <div className="explore-stats">
            <div className="stat-item">
              <span className="stat-value">{nfts.length}</span>
              <span className="stat-label">NFT disponibles</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres Premium */}
      <div className="explore-filters-card">
        <div className="filters-header">
          <h3>Filtres</h3>
          <button 
            className="btn-ghost-small"
            onClick={() => {
              setSelectedMarketplace('ALL')
              setSelectedAssetType('ALL')
              setMinValue('')
              setMaxValue('')
              setSelectedRiskClass('ALL')
            }}
          >
            Réinitialiser
          </button>
        </div>
        <div className="filters-grid">
          <div className="filter-item">
            <label className="filter-label">Marketplace</label>
            <select 
              value={selectedMarketplace} 
              onChange={(e) => setSelectedMarketplace(e.target.value as Marketplace | 'ALL')}
              className="filter-select-premium"
            >
              <option value="ALL">Toutes les marketplaces</option>
              {marketplaces.map(mp => (
                <option key={mp} value={mp}>{getMarketplaceLabel(mp)}</option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <label className="filter-label">Type d'actif</label>
            <select 
              value={selectedAssetType} 
              onChange={(e) => setSelectedAssetType(e.target.value as AssetType | 'ALL')}
              className="filter-select-premium"
            >
              <option value="ALL">Tous les types</option>
              {assetTypes.map(type => (
                <option key={type} value={type}>{getAssetTypeLabel(type)}</option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <label className="filter-label">Valeur minimale</label>
            <input 
              type="number" 
              value={minValue}
              onChange={(e) => setMinValue(e.target.value)}
              placeholder="0 USDC"
              className="filter-input-premium"
            />
          </div>

          <div className="filter-item">
            <label className="filter-label">Valeur maximale</label>
            <input 
              type="number" 
              value={maxValue}
              onChange={(e) => setMaxValue(e.target.value)}
              placeholder="Aucune limite"
              className="filter-input-premium"
            />
          </div>

          <div className="filter-item">
            <label className="filter-label">Niveau de risque</label>
            <select 
              value={selectedRiskClass} 
              onChange={(e) => setSelectedRiskClass(e.target.value as any)}
              className="filter-select-premium"
            >
              <option value="ALL">Tous les niveaux</option>
              <option value="SAFE">Sûr (0-30)</option>
              <option value="MODERATE">Modéré (31-60)</option>
              <option value="RISKY">Risqué (61-100)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grille NFT Premium */}
      {loading ? (
        <div className="explore-loading">
          <div className="loading-spinner-large"></div>
          <p>Chargement des NFT RWA...</p>
        </div>
      ) : (
        <div className="explore-nft-grid">
          {nfts.map((nft) => (
            <div 
              key={nft.id} 
              className={`explore-nft-card ${selectedNFT?.id === nft.id ? 'selected' : ''} ${hoveredNFT === nft.id ? 'hovered' : ''}`}
              onClick={() => handleSelectNFT(nft)}
              onMouseEnter={() => setHoveredNFT(nft.id)}
              onMouseLeave={() => setHoveredNFT(null)}
            >
              {/* Badges Header */}
              <div className="nft-card-badges">
                <span className="nft-marketplace-badge-premium">
                  {getMarketplaceLabel(nft.marketplace)}
                </span>
                <span className={`nft-risk-badge-premium ${getRiskBadgeClass(nft.riskClass)}`}>
                  {nft.riskClass}
                </span>
              </div>

              {/* Image/Preview */}
              <div className="nft-card-preview">
                <div className="nft-preview-gradient">
                  <div className="nft-preview-icon">
                    {nft.assetType === 'REAL_ESTATE' && '🏢'}
                    {nft.assetType === 'MINING' && '⛏️'}
                    {nft.assetType === 'INFRASTRUCTURE' && '🏗️'}
                    {nft.assetType === 'COMMODITIES' && '💎'}
                    {nft.assetType === 'OTHER' && '📦'}
                  </div>
                </div>
                {selectedNFT?.id === nft.id && (
                  <div className="nft-selected-indicator">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" fill="var(--color-primary-500)" />
                      <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="nft-card-content">
                <div className="nft-card-title-section">
                  <h3 className="nft-card-title">{nft.name}</h3>
                  <span className="nft-card-type">{getAssetTypeLabel(nft.assetType)}</span>
                </div>

                <p className="nft-card-description">{nft.description}</p>

                <div className="nft-card-value">
                  <div className="value-main">
                    <span className="value-amount-premium">{nft.value.toLocaleString()}</span>
                    <span className="value-currency-premium">{nft.valueCurrency}</span>
                  </div>
                </div>

                <div className="nft-card-meta">
                  <div className="meta-row">
                    <span className="meta-label-premium">Token ID</span>
                    <span className="meta-value-premium">#{nft.tokenId}</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-label-premium">Score risque</span>
                    <span className="meta-value-premium">{nft.riskScore}/100</span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="nft-card-footer">
                <button 
                  className="btn-select-nft"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSelectNFT(nft)
                  }}
                >
                  {selectedNFT?.id === nft.id ? '✓ Sélectionné' : 'Sélectionner'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Message si aucun résultat */}
      {!loading && nfts.length === 0 && (
        <div className="explore-empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3>Aucun NFT trouvé</h3>
          <p>Essayez de modifier vos filtres pour voir plus de résultats</p>
        </div>
      )}
    </div>
  )
}

