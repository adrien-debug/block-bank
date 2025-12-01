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
  const [showDetails, setShowDetails] = useState(false)
  
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
    setShowDetails(true)
  }

  const handleUseForLoan = () => {
    if (selectedNFT) {
      onSelectNFT(selectedNFT)
    }
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
    <div className="marketplace-nft-page">
      <div className="page-header">
        <div>
          <h1>Sélectionner un NFT RWA</h1>
          <p className="page-subtitle">Choisissez un actif réel tokenisé depuis nos marketplaces partenaires</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="marketplace-filters">
        <div className="filter-group">
          <label>Marketplace</label>
          <select 
            value={selectedMarketplace} 
            onChange={(e) => setSelectedMarketplace(e.target.value as Marketplace | 'ALL')}
            className="filter-select"
          >
            <option value="ALL">Toutes</option>
            {marketplaces.map(mp => (
              <option key={mp} value={mp}>{getMarketplaceLabel(mp)}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Type d'actif</label>
          <select 
            value={selectedAssetType} 
            onChange={(e) => setSelectedAssetType(e.target.value as AssetType | 'ALL')}
            className="filter-select"
          >
            <option value="ALL">Tous</option>
            {assetTypes.map(type => (
              <option key={type} value={type}>{getAssetTypeLabel(type)}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Valeur min (USDC)</label>
          <input 
            type="number" 
            value={minValue}
            onChange={(e) => setMinValue(e.target.value)}
            placeholder="0"
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label>Valeur max (USDC)</label>
          <input 
            type="number" 
            value={maxValue}
            onChange={(e) => setMaxValue(e.target.value)}
            placeholder="∞"
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label>Risque</label>
          <select 
            value={selectedRiskClass} 
            onChange={(e) => setSelectedRiskClass(e.target.value as any)}
            className="filter-select"
          >
            <option value="ALL">Tous</option>
            <option value="SAFE">Sûr</option>
            <option value="MODERATE">Modéré</option>
            <option value="RISKY">Risqué</option>
          </select>
        </div>
      </div>

      {/* Liste NFT */}
      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Chargement des NFT RWA...</p>
        </div>
      ) : (
        <div className="nft-grid-marketplace">
          {nfts.map((nft) => (
            <div key={nft.id} className="nft-card-marketplace">
              <div className="nft-card-header">
                <span className="nft-marketplace-badge">{getMarketplaceLabel(nft.marketplace)}</span>
                <span className={`nft-risk-badge ${getRiskBadgeClass(nft.riskClass)}`}>
                  {nft.riskClass}
                </span>
              </div>
              
              <div className="nft-card-image">
                <div className="nft-image-placeholder">
                  {nft.name.charAt(0)}
                </div>
              </div>
              
              <div className="nft-card-body">
                <h3>{nft.name}</h3>
                <p className="nft-type">{getAssetTypeLabel(nft.assetType)}</p>
                <p className="nft-description">{nft.description}</p>
                
                <div className="nft-value-large">
                  <span className="value-amount">{nft.value.toLocaleString()}</span>
                  <span className="value-currency">{nft.valueCurrency}</span>
                </div>
                
                <div className="nft-meta">
                  <div className="meta-item">
                    <span className="meta-label">Token ID</span>
                    <span className="meta-value">#{nft.tokenId}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Risque</span>
                    <span className="meta-value">{nft.riskScore}/100</span>
                  </div>
                </div>
              </div>
              
              <div className="nft-card-actions">
                <button 
                  className="btn-secondary"
                  onClick={() => handleSelectNFT(nft)}
                >
                  Voir détails
                </button>
                <button 
                  className="btn-primary"
                  onClick={() => handleSelectNFT(nft)}
                >
                  Utiliser pour prêt
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Détails NFT */}
      {showDetails && selectedNFT && (
        <div className="modal-overlay" onClick={() => setShowDetails(false)}>
          <div className="modal-content-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedNFT.name}</h2>
              <button className="modal-close" onClick={() => setShowDetails(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="nft-details-grid">
                <div className="nft-details-image">
                  <div className="nft-image-large">
                    {selectedNFT.name.charAt(0)}
                  </div>
                </div>
                
                <div className="nft-details-info">
                  <div className="detail-section">
                    <h3>Informations</h3>
                    <div className="detail-row">
                      <span className="detail-label">Type</span>
                      <span className="detail-value">{getAssetTypeLabel(selectedNFT.assetType)}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Marketplace</span>
                      <span className="detail-value">{getMarketplaceLabel(selectedNFT.marketplace)}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Valeur</span>
                      <span className="detail-value">{selectedNFT.value.toLocaleString()} {selectedNFT.valueCurrency}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Token ID</span>
                      <span className="detail-value">#{selectedNFT.tokenId}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Contract</span>
                      <span className="detail-value address">{selectedNFT.contractAddress.slice(0, 10)}...{selectedNFT.contractAddress.slice(-8)}</span>
                    </div>
                  </div>
                  
                  <div className="detail-section">
                    <h3>Risque</h3>
                    <div className="detail-row">
                      <span className="detail-label">Score risque</span>
                      <span className="detail-value">{selectedNFT.riskScore}/100</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Classe</span>
                      <span className={`detail-value ${getRiskBadgeClass(selectedNFT.riskClass)}`}>
                        {selectedNFT.riskClass}
                      </span>
                    </div>
                  </div>
                  
                  <div className="detail-section">
                    <h3>Description</h3>
                    <p>{selectedNFT.description}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowDetails(false)}>
                Annuler
              </button>
              <button className="btn-primary" onClick={handleUseForLoan}>
                Utiliser pour prêt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

