'use client'

import { useState } from 'react'
import { AssetType, NFTRiskClass } from '@/types'

interface NFTAsset {
  id: string
  tokenId: string
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
}

export default function NFTAssets() {
  const [hoveredNFT, setHoveredNFT] = useState<string | null>(null)

  const nftAssets: NFTAsset[] = [
    {
      id: '1',
      tokenId: '1234',
      type: 'Real Estate',
      name: 'Villa Paris',
      description: 'Luxury apartment of 150m² in the 16th arrondissement of Paris',
      value: 300000,
      currency: 'USDC',
      status: 'locked',
      lockedIn: 'Loan #1',
      assetType: 'REAL_ESTATE',
      riskClass: 'SAFE',
      riskScore: 25,
    },
    {
      id: '2',
      tokenId: '5678',
      type: 'Mining',
      name: 'Mining Farm',
      description: 'Bitcoin mining installation of 10MW with 5000 ASICs',
      value: 150000,
      currency: 'USDC',
      status: 'locked',
      lockedIn: 'Loan #2',
      assetType: 'MINING',
      riskClass: 'MODERATE',
      riskScore: 45,
    },
    {
      id: '3',
      tokenId: '9012',
      type: 'Infrastructure',
      name: 'Data Center',
      description: 'Data center of 5000m² with Tier III certification',
      value: 500000,
      currency: 'USDC',
      status: 'available',
      assetType: 'INFRASTRUCTURE',
      riskClass: 'SAFE',
      riskScore: 20,
    },
  ]

  const getRiskBadgeClass = (riskClass: string) => {
    if (riskClass === 'SAFE') return 'risk-badge-safe'
    if (riskClass === 'MODERATE') return 'risk-badge-moderate'
    return 'risk-badge-risky'
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="explore-marketplace-page">
      {/* Header Premium */}
      <div className="explore-page-header">
        <div className="explore-header-content">
          <div>
            <h1 className="explore-title">My NFT RWA</h1>
            <p className="explore-subtitle">Manage your tokenized real-world assets</p>
          </div>
          <div className="explore-stats">
            <div className="stat-item">
              <span className="stat-value">{nftAssets.length}</span>
              <span className="stat-label">Total NFTs</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{nftAssets.filter(nft => nft.status === 'available').length}</span>
              <span className="stat-label">Available</span>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 'var(--space-6)' }}>
          <button className="btn-primary">+ Tokenize asset</button>
        </div>
      </div>

      {/* Grille NFT Premium */}
      <div className="explore-nft-grid">
        {nftAssets.map((nft) => (
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
                  <span className="value-amount-premium">{formatCurrency(nft.value)}</span>
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
                      // View details action
                    }}
                  >
                    View details
                  </button>
                  <button 
                    className="btn-select-nft"
                    onClick={(e) => {
                      e.stopPropagation()
                      // Use for loan action
                    }}
                  >
                    Use for loan
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
        ))}
      </div>

      {/* Empty State (if no NFTs) */}
      {nftAssets.length === 0 && (
        <div className="explore-empty-state">
          <div className="empty-state-icon">📦</div>
          <h3>No NFT RWA found</h3>
          <p>Tokenize your first real-world asset to get started</p>
          <button className="btn-primary" style={{ marginTop: 'var(--space-4)' }}>
            + Tokenize asset
          </button>
        </div>
      )}
    </div>
  )
}
