'use client'

import { useState, useEffect } from 'react'
import { formatDateShort } from '@/lib/utils'
import ChartIcon from '../icons/ChartIcon'
import ShieldIcon from '../icons/ShieldIcon'
import InfoIcon from '../icons/InfoIcon'
import { useAuth } from '@/contexts/AuthContext'
import type { CreditTier, PartnerPlatform, CreditScoreNFTMetadata, PartnerAccess } from '@/types'

type CreditScoreTab = 'overview' | 'nft' | 'partners'

// Permissions Editor Component
function PermissionsEditor({ 
  partner, 
  onSave, 
  onCancel 
}: { 
  partner: PartnerAccess
  onSave: (permissions: { readScore: boolean; readMetadata: boolean; readFullData: boolean }) => void
  onCancel: () => void
}) {
  const [permissions, setPermissions] = useState({
    readScore: partner.permissions.readScore,
    readMetadata: partner.permissions.readMetadata,
    readFullData: partner.permissions.readFullData,
  })

  const handleToggle = (key: keyof typeof permissions) => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <>
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'var(--space-3)',
          padding: 'var(--space-3)',
          background: 'var(--color-bg-secondary)',
          borderRadius: 'var(--radius-md)',
          marginBottom: 'var(--space-2)'
        }}>
          <input
            type="checkbox"
            id="readScore"
            checked={permissions.readScore}
            onChange={() => handleToggle('readScore')}
            style={{ cursor: 'pointer' }}
          />
          <label htmlFor="readScore" style={{ flex: 1, cursor: 'pointer' }}>
            Read Score
          </label>
        </div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'var(--space-3)',
          padding: 'var(--space-3)',
          background: 'var(--color-bg-secondary)',
          borderRadius: 'var(--radius-md)',
          marginBottom: 'var(--space-2)'
        }}>
          <input
            type="checkbox"
            id="readMetadata"
            checked={permissions.readMetadata}
            onChange={() => handleToggle('readMetadata')}
            style={{ cursor: 'pointer' }}
          />
          <label htmlFor="readMetadata" style={{ flex: 1, cursor: 'pointer' }}>
            Read Metadata
          </label>
        </div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'var(--space-3)',
          padding: 'var(--space-3)',
          background: 'var(--color-bg-secondary)',
          borderRadius: 'var(--radius-md)',
          marginBottom: 'var(--space-2)'
        }}>
          <input
            type="checkbox"
            id="readFullData"
            checked={permissions.readFullData}
            onChange={() => handleToggle('readFullData')}
            style={{ cursor: 'pointer' }}
          />
          <label htmlFor="readFullData" style={{ flex: 1, cursor: 'pointer' }}>
            Full Access
          </label>
        </div>
      </div>
      <div className="form-actions">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => onSave(permissions)}
          className="btn-primary"
        >
          Save Permissions
        </button>
      </div>
    </>
  )
}

export default function CreditScore() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<CreditScoreTab>('overview')
  const [score, setScore] = useState<number>(600)
  const [tier, setTier] = useState<CreditTier>('C')
  const [previousScore, setPreviousScore] = useState<number | null>(null)
  const [scoreData, setScoreData] = useState<any>(null)
  const [partners, setPartners] = useState<PartnerAccess[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAdviceModal, setShowAdviceModal] = useState(false)
  const [selectedCriterion, setSelectedCriterion] = useState<'onChain' | 'offChain' | 'assets' | 'reputation' | null>(null)
  const [showApiKeyModal, setShowApiKeyModal] = useState(false)
  const [selectedPartner, setSelectedPartner] = useState<PartnerAccess | null>(null)
  const [showPermissionsModal, setShowPermissionsModal] = useState(false)
  
  // Charger les données réelles
  useEffect(() => {
    const loadCreditScore = async () => {
      if (!user) return

      setIsLoading(true)
      try {
        const response = await fetch('/api/credit-score')
        if (response.ok) {
          const data = await response.json()
          if (data.creditScore) {
            setScore(data.creditScore.score)
            setTier(data.creditScore.tier as CreditTier)
            setPreviousScore(data.creditScore.previous_score)
            setScoreData(data.creditScore)
            
            // Transformer les partenaires
            const transformedPartners: PartnerAccess[] = (data.partners || []).map((p: any) => ({
              platform: p.platform as PartnerPlatform,
              platformName: p.platform_name,
              authorized: p.authorized,
              accessCount: p.access_count,
              lastAccessed: p.last_accessed ? new Date(p.last_accessed).getTime() : null,
              permissions: {
                readScore: p.read_score,
                readMetadata: p.read_metadata,
                readFullData: p.read_full_data
              }
            }))
            setPartners(transformedPartners)
          }
        }
      } catch (error) {
        console.error('Error loading credit score:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCreditScore()
  }, [user])

  // Calculs basés sur les états (après les hooks, avant le return)
  const scoreChange = previousScore ? score - previousScore : 0
  
  // Données pour le graphique donut (basées sur les données réelles)
  const scoreComponents = {
    onChain: { 
      value: scoreData?.on_chain_score || 0, 
      max: 350, 
      label: 'On-Chain', 
      color: '#2563EB' 
    },
    offChain: { 
      value: scoreData?.off_chain_score || 0, 
      max: 300, 
      label: 'Off-Chain', 
      color: '#3B82F6' 
    },
    assets: { 
      value: scoreData?.assets_score || 0, 
      max: 200, 
      label: 'Assets', 
      color: '#60A5FA' 
    },
    reputation: { 
      value: scoreData?.reputation_score || 0, 
      max: 150, 
      label: 'Reputation', 
      color: '#93C5FD' 
    },
  }

  if (isLoading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading credit score...</p>
      </div>
    )
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

  // Export Report functionality
  const handleExportReport = () => {
    const report = {
      creditScore: {
        score,
        tier,
        previousScore,
        scoreChange: scoreChange,
        components: scoreComponents,
        tierInfo: currentTier,
        calculatedAt: new Date().toISOString(),
      },
      nftMetadata: nftMetadata,
      partners: partners,
      user: {
        id: user?.id,
        email: user?.email,
      }
    }

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `credit-score-report-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Download JSON Metadata
  const handleDownloadMetadata = () => {
    const blob = new Blob([JSON.stringify(nftMetadata, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `nft-metadata-${nftMetadata.tokenId.slice(-8)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Verify on Blockchain
  const handleVerifyOnBlockchain = () => {
    // Open blockchain explorer (Etherscan, etc.)
    const explorerUrl = `https://etherscan.io/token/${nftMetadata.contractAddress}?a=${nftMetadata.tokenId}`
    window.open(explorerUrl, '_blank')
  }

  // Partner management functions
  const handleAuthorizePartner = async (partner: PartnerAccess) => {
    try {
      const response = await fetch('/api/credit-score/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: partner.platform,
          action: 'authorize',
        }),
      })
      
      if (response.ok) {
        const updatedPartners = partners.map(p => 
          p.platform === partner.platform ? { ...p, authorized: true } : p
        )
        setPartners(updatedPartners)
      }
    } catch (error) {
      console.error('Error authorizing partner:', error)
    }
  }

  const handleRevokePartner = async (partner: PartnerAccess) => {
    if (!confirm(`Are you sure you want to revoke access for ${partner.platformName}?`)) {
      return
    }

    try {
      const response = await fetch('/api/credit-score/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: partner.platform,
          action: 'revoke',
        }),
      })
      
      if (response.ok) {
        const updatedPartners = partners.map(p => 
          p.platform === partner.platform ? { ...p, authorized: false } : p
        )
        setPartners(updatedPartners)
      }
    } catch (error) {
      console.error('Error revoking partner:', error)
    }
  }

  const handleModifyPermissions = (partner: PartnerAccess) => {
    setSelectedPartner(partner)
    setShowPermissionsModal(true)
  }

  const handleSavePermissions = async (permissions: { readScore: boolean; readMetadata: boolean; readFullData: boolean }) => {
    if (!selectedPartner) return

    try {
      const response = await fetch('/api/credit-score/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: selectedPartner.platform,
          action: 'update-permissions',
          permissions,
        }),
      })
      
      if (response.ok) {
        const updatedPartners = partners.map(p => 
          p.platform === selectedPartner.platform 
            ? { ...p, permissions } 
            : p
        )
        setPartners(updatedPartners)
        setShowPermissionsModal(false)
        setSelectedPartner(null)
      }
    } catch (error) {
      console.error('Error updating permissions:', error)
    }
  }

  const handleViewApiKey = (partner: PartnerAccess) => {
    setSelectedPartner(partner)
    setShowApiKeyModal(true)
  }

  const handleViewFullDocumentation = () => {
    window.open('https://docs.blockbank.com/api/credit-score', '_blank')
  }

  // NFT Metadata (based on real data)
  const nftMetadata: CreditScoreNFTMetadata = {
    tokenId: scoreData?.nft_token_id || '0x1234...5678',
    contractAddress: scoreData?.nft_contract_address || '0xBlockBankCreditScore',
    walletAddress: user?.wallet_address || '0xUser...Wallet',
    globalScore: score,
    tier: tier,
    subScores: {
      onChain: scoreData?.on_chain_score || 0,
      offChain: scoreData?.off_chain_score || 0,
      assets: scoreData?.assets_score || 0,
      reputation: scoreData?.reputation_score || 0,
    },
    modelVersion: scoreData?.model_version || 'v2.1',
    issuedAt: scoreData?.issued_at ? new Date(scoreData.issued_at).getTime() : Date.now() - 7 * 24 * 60 * 60 * 1000,
    validUntil: scoreData?.valid_until ? new Date(scoreData.valid_until).getTime() : Date.now() + 23 * 24 * 60 * 60 * 1000,
    dataHash: scoreData?.data_hash || '0xabc123...def456',
    kycVerified: scoreData?.kyc_verified || false,
    amlVerified: scoreData?.aml_verified || false,
    verificationLevel: scoreData?.verification_level || 'basic',
    scoreHistory: {
      lastUpdate: scoreData?.created_at ? new Date(scoreData.created_at).getTime() : Date.now() - 7 * 24 * 60 * 60 * 1000,
      trend: scoreChange > 0 ? 'up' : scoreChange < 0 ? 'down' : 'stable',
      change: scoreChange,
    }
  }

  const tabs = [
    { id: 'overview' as CreditScoreTab, label: 'Overview', icon: ChartIcon },
    { id: 'nft' as CreditScoreTab, label: 'NFT Score', icon: ShieldIcon },
    { id: 'partners' as CreditScoreTab, label: 'Partners', icon: InfoIcon },
  ]

  // Function to calculate the donut chart
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
          <h1>My Credit Score</h1>
          <p className="page-subtitle">Transparent and auditable hybrid on-chain/off-chain score</p>
        </div>
        <div className="score-header-actions">
          <button className="btn-secondary" onClick={handleExportReport}>Export Report</button>
          <button 
            className="btn-primary"
            onClick={async () => {
              setIsLoading(true)
              try {
                const response = await fetch('/api/credit-score?recalculate=true')
                if (response.ok) {
                  const data = await response.json()
                  if (data.creditScore) {
                    setScore(data.creditScore.score)
                    setTier(data.creditScore.tier as CreditTier)
                    setPreviousScore(data.creditScore.previous_score)
                    setScoreData(data.creditScore)
                  }
                }
              } catch (error) {
                console.error('Error updating credit score:', error)
              } finally {
                setIsLoading(false)
              }
            }}
          >
            Update
          </button>
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
                  // Calculate start and end angle for each segment
                  const total = Object.values(scoreComponents).reduce((sum, comp) => sum + comp.value, 0)
                  let startAngle = 0
                  for (let i = 0; i < index; i++) {
                    startAngle += (scoreComponents[Object.keys(scoreComponents)[i] as keyof typeof scoreComponents].value / total) * 360
                  }
                  const endAngle = startAngle + (segment.value / total) * 360
                  
                  // Convert to radians
                  const startRad = (startAngle - 90) * (Math.PI / 180)
                  const endRad = (endAngle - 90) * (Math.PI / 180)
                  
                  // Calculate arc points
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
            
            {/* Légende avec boutons */}
            <div className="donut-legend">
              {Object.entries(scoreComponents).map(([key, comp]) => {
                const segment = donutSegments.find(s => s.key === key)
                const percentage = parseFloat(segment?.percentage || '0')
                const isLow = percentage < 50
                
                return (
                  <div key={key} className="legend-item" style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: 'var(--space-2)',
                    borderRadius: 'var(--radius-md)',
                    background: isLow ? 'rgba(239, 68, 68, 0.05)' : 'transparent',
                    border: isLow ? '1px solid rgba(239, 68, 68, 0.2)' : 'none'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flex: 1 }}>
                      <div className="legend-color" style={{ backgroundColor: comp.color }}></div>
                      <div className="legend-info" style={{ flex: 1 }}>
                        <span className="legend-label">{comp.label}</span>
                        <span className="legend-value">{comp.value}/{comp.max} ({segment?.percentage}%)</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedCriterion(key as 'onChain' | 'offChain' | 'assets' | 'reputation')
                        setShowAdviceModal(true)
                      }}
                      className="btn-secondary btn-small"
                      style={{
                        fontSize: 'var(--text-xs)',
                        padding: 'var(--space-1) var(--space-2)',
                        whiteSpace: 'nowrap'
                      }}
                      title={`Tips to improve ${comp.label}`}
                    >
                      💡 Improve
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Essential metrics */}
          <div className="score-metrics-grid">
            <div className="metric-card">
              <div className="metric-label">Max LTV</div>
              <div className="metric-value">{currentTier.ltv}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Interest Rate (APY)</div>
              <div className="metric-value">{currentTier.rate}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Max Amount</div>
              <div className="metric-value">{currentTier.maxAmount}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Score Range</div>
              <div className="metric-value">{currentTier.scoreRange}</div>
            </div>
          </div>

          {/* Button to NFT */}
          <div className="score-cta-nft">
            <button 
              className="btn-primary btn-large"
              onClick={() => setActiveTab('nft')}
            >
              View my Score NFT
            </button>
          </div>
        </div>
      )}

      {/* NFT Score Tab */}
      {activeTab === 'nft' && (
        <div className="credit-score-nft">
          <div className="nft-visualization-card">
            <div className="nft-card-header">
              <h2>Soulbound Score NFT</h2>
              <div className="nft-badge-soulbound">Soulbound • Non-transferable</div>
            </div>
            
            {/* NFT Visualization */}
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

            {/* Structured Metadata */}
            <div className="nft-metadata-section">
              <h3>NFT Metadata</h3>
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
                  <span className="metadata-label">Global Score</span>
                  <span className="metadata-value">{nftMetadata.globalScore}/1000</span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-label">Tier</span>
                  <span className="metadata-value">Tier {nftMetadata.tier}</span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-label">Model Version</span>
                  <span className="metadata-value">{nftMetadata.modelVersion}</span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-label">Issued On</span>
                  <span className="metadata-value">{formatDateShort(new Date(nftMetadata.issuedAt))}</span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-label">Valid Until</span>
                  <span className="metadata-value">{formatDateShort(new Date(nftMetadata.validUntil))}</span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-label">Data Hash</span>
                  <span className="metadata-value font-mono text-xs">{nftMetadata.dataHash}</span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-label">KYC Verified</span>
                  <span className="metadata-value">{nftMetadata.kycVerified ? '✓ Yes' : '✗ No'}</span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-label">AML Verified</span>
                  <span className="metadata-value">{nftMetadata.amlVerified ? '✓ Yes' : '✗ No'}</span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-label">Verification Level</span>
                  <span className="metadata-value capitalize">{nftMetadata.verificationLevel}</span>
                </div>
              </div>

              {/* Sub-scores */}
              <div className="nft-sub-scores">
                <h4>Detailed Sub-scores</h4>
                <div className="sub-scores-grid">
                  <div className="sub-score-item">
                    <span className="sub-score-label">On-Chain</span>
                    <span className="sub-score-value">{nftMetadata.subScores.onChain}/350</span>
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
                    <span className="sub-score-value">{nftMetadata.subScores.reputation}/150</span>
                  </div>
                </div>
              </div>

              {/* History Summary */}
              <div className="nft-history">
                <h4>History</h4>
                <div className="history-summary">
                  <div className="history-item">
                    <span className="history-label">Last Update</span>
                    <span className="history-value">{formatDateShort(new Date(nftMetadata.scoreHistory.lastUpdate))}</span>
                  </div>
                  <div className="history-item">
                    <span className="history-label">Trend</span>
                    <span className={`history-value history-trend-${nftMetadata.scoreHistory.trend}`}>
                      {nftMetadata.scoreHistory.trend === 'up' ? '↑ Up' : nftMetadata.scoreHistory.trend === 'down' ? '↓ Down' : '→ Stable'}
                    </span>
                  </div>
                  <div className="history-item">
                    <span className="history-label">Change</span>
                    <span className="history-value">{nftMetadata.scoreHistory.change > 0 ? '+' : ''}{nftMetadata.scoreHistory.change} points</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="nft-actions">
              <button className="btn-primary" onClick={handleVerifyOnBlockchain}>Verify on Blockchain</button>
              <button className="btn-secondary" onClick={handleDownloadMetadata}>Download JSON Metadata</button>
            </div>
          </div>
        </div>
      )}

      {/* Partners Tab */}
      {activeTab === 'partners' && (
        <div className="credit-score-partners">
          <div className="partners-header">
            <div>
              <h2>Partner Platforms</h2>
              <p>Manage partner access to your score NFT via BlockBank</p>
            </div>
            <div className="partners-stats">
              <div className="stat-item">
                <span className="stat-value">{partners.filter(p => p.authorized).length}</span>
                <span className="stat-label">Authorized</span>
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
                        <span className="status-badge authorized">✓ Authorized</span>
                      ) : (
                        <span className="status-badge not-authorized">✗ Not authorized</span>
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
                        <span className="stat-mini-label">Last consultation</span>
                        <span className="stat-mini-value">{formatDateShort(new Date(partner.lastAccessed))}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="partner-permissions">
                  <h4>Current Permissions</h4>
                  <div className="permissions-list">
                    <div className="permission-item">
                      <span className={`permission-icon ${partner.permissions.readScore ? 'enabled' : 'disabled'}`}>
                        {partner.permissions.readScore ? '✓' : '✗'}
                      </span>
                      <span>Read Score</span>
                    </div>
                    <div className="permission-item">
                      <span className={`permission-icon ${partner.permissions.readMetadata ? 'enabled' : 'disabled'}`}>
                        {partner.permissions.readMetadata ? '✓' : '✗'}
                      </span>
                      <span>Read Metadata</span>
                    </div>
                    <div className="permission-item">
                      <span className={`permission-icon ${partner.permissions.readFullData ? 'enabled' : 'disabled'}`}>
                        {partner.permissions.readFullData ? '✓' : '✗'}
                      </span>
                      <span>Full Access</span>
                    </div>
                  </div>
                </div>

                <div className="partner-actions">
                  {partner.authorized ? (
                    <>
                      <button 
                        className="btn-secondary btn-small" 
                        onClick={() => handleModifyPermissions(partner)}
                      >
                        Modify Permissions
                      </button>
                      <button 
                        className="btn-danger btn-small" 
                        onClick={() => handleRevokePartner(partner)}
                      >
                        Revoke Access
                      </button>
                      {partner.apiKey && (
                        <button 
                          className="btn-ghost btn-small" 
                          onClick={() => handleViewApiKey(partner)}
                        >
                          View API Key
                        </button>
                      )}
                    </>
                  ) : (
                    <button 
                      className="btn-primary btn-small" 
                      onClick={() => handleAuthorizePartner(partner)}
                    >
                      Authorize Access
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* API Documentation */}
          <div className="partners-api-docs">
            <h3>API Documentation for Partners</h3>
            <p>Partner platforms can integrate your score NFT via our BlockBank API.</p>
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
            <button className="btn-secondary" onClick={handleViewFullDocumentation}>View Full Documentation</button>
          </div>
        </div>
      )}

      {/* API Key Modal */}
      {showApiKeyModal && selectedPartner && (
        <div className="new-loan-modal" onClick={() => setShowApiKeyModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h2>API Key - {selectedPartner.platformName}</h2>
              <button 
                type="button" 
                className="modal-close-button" 
                onClick={() => {
                  setShowApiKeyModal(false)
                  setSelectedPartner(null)
                }}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="loan-form" style={{ padding: 'var(--space-4)' }}>
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: '500' }}>
                  API Key
                </label>
                <div style={{ 
                  display: 'flex', 
                  gap: 'var(--space-2)',
                  alignItems: 'center'
                }}>
                  <input
                    type="text"
                    readOnly
                    value={selectedPartner.apiKey || 'No API key generated'}
                    style={{
                      flex: 1,
                      padding: 'var(--space-2)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      fontFamily: 'monospace',
                      fontSize: 'var(--text-sm)',
                      background: 'var(--color-bg-secondary)'
                    }}
                  />
                  <button
                    className="btn-secondary btn-small"
                    onClick={() => {
                      if (selectedPartner.apiKey) {
                        navigator.clipboard.writeText(selectedPartner.apiKey)
                        alert('API key copied to clipboard!')
                      }
                    }}
                  >
                    Copy
                  </button>
                </div>
                <p style={{ 
                  fontSize: 'var(--text-xs)', 
                  color: 'var(--color-text-secondary)',
                  marginTop: 'var(--space-2)'
                }}>
                  Keep this key secure. Do not share it publicly.
                </p>
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => {
                    setShowApiKeyModal(false)
                    setSelectedPartner(null)
                  }}
                  className="btn-primary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Permissions Modal */}
      {showPermissionsModal && selectedPartner && (
        <div className="new-loan-modal" onClick={() => setShowPermissionsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h2>Modify Permissions - {selectedPartner.platformName}</h2>
              <button 
                type="button" 
                className="modal-close-button" 
                onClick={() => {
                  setShowPermissionsModal(false)
                  setSelectedPartner(null)
                }}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="loan-form" style={{ padding: 'var(--space-4)' }}>
              <PermissionsEditor
                partner={selectedPartner}
                onSave={handleSavePermissions}
                onCancel={() => {
                  setShowPermissionsModal(false)
                  setSelectedPartner(null)
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Advice Modal to Improve Score */}
      {showAdviceModal && selectedCriterion && (
        <div className="new-loan-modal" onClick={() => setShowAdviceModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h2>Improve your {scoreComponents[selectedCriterion].label} Score</h2>
              <button 
                type="button" 
                className="modal-close-button" 
                onClick={() => setShowAdviceModal(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="loan-form" style={{ padding: 'var(--space-4)' }}>
              {selectedCriterion === 'onChain' && (
                <div>
                  <h3 style={{ marginBottom: 'var(--space-4)', color: '#2563EB' }}>
                    On-Chain Score (Current: {scoreComponents.onChain.value}/350)
                  </h3>
                  <p style={{ marginBottom: 'var(--space-4)', color: 'var(--color-text-secondary)' }}>
                    The On-Chain score evaluates your behavior and activity on the blockchain.
                  </p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    <div style={{
                      padding: 'var(--space-3)',
                      background: 'rgba(37, 99, 235, 0.05)',
                      borderRadius: 'var(--radius-md)',
                      borderLeft: '3px solid #2563EB'
                    }}>
                      <h4 style={{ marginBottom: 'var(--space-2)' }}>📅 Wallet Age</h4>
                      <p style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>
                        The older your wallet, the more points you earn (max 100 points).
                      </p>
                      <ul style={{ fontSize: 'var(--text-sm)', paddingLeft: 'var(--space-4)', margin: 0 }}>
                        <li>2+ years: 100 points</li>
                        <li>1-2 years: 80 points</li>
                        <li>6-12 months: 60 points</li>
                        <li>3-6 months: 40 points</li>
                      </ul>
                      <p style={{ fontSize: 'var(--text-xs)', marginTop: 'var(--space-2)', fontStyle: 'italic' }}>
                        💡 Use an existing wallet or wait to accumulate age.
                      </p>
                    </div>

                    <div style={{
                      padding: 'var(--space-3)',
                      background: 'rgba(37, 99, 235, 0.05)',
                      borderRadius: 'var(--radius-md)',
                      borderLeft: '3px solid #2563EB'
                    }}>
                      <h4 style={{ marginBottom: 'var(--space-2)' }}>🔄 Transaction Volume</h4>
                      <p style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>
                        The more transactions you make, the more points you earn (max 100 points).
                      </p>
                      <ul style={{ fontSize: 'var(--text-sm)', paddingLeft: 'var(--space-4)', margin: 0 }}>
                        <li>1000+ transactions: 100 points</li>
                        <li>500-999 transactions: 80 points</li>
                        <li>100-499 transactions: 60 points</li>
                        <li>50-99 transactions: 40 points</li>
                      </ul>
                      <p style={{ fontSize: 'var(--text-xs)', marginTop: 'var(--space-2)', fontStyle: 'italic' }}>
                        💡 Make regular transactions on your wallet.
                      </p>
                    </div>

                    <div style={{
                      padding: 'var(--space-3)',
                      background: 'rgba(37, 99, 235, 0.05)',
                      borderRadius: 'var(--radius-md)',
                      borderLeft: '3px solid #2563EB'
                    }}>
                      <h4 style={{ marginBottom: 'var(--space-2)' }}>💰 Stablecoin Ratio</h4>
                      <p style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>
                        Maintain a high ratio of stablecoins in your portfolio (max 150 points).
                      </p>
                      <ul style={{ fontSize: 'var(--text-sm)', paddingLeft: 'var(--space-4)', margin: 0 }}>
                        <li>70%+ stablecoins: 150 points</li>
                        <li>50-69%: 120 points</li>
                        <li>30-49%: 90 points</li>
                        <li>10-29%: 60 points</li>
                      </ul>
                      <p style={{ fontSize: 'var(--text-xs)', marginTop: 'var(--space-2)', fontStyle: 'italic' }}>
                        💡 Hold a significant proportion of stablecoins (USDC, USDT, DAI) to show your stability.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedCriterion === 'offChain' && (
                <div>
                  <h3 style={{ marginBottom: 'var(--space-4)', color: '#3B82F6' }}>
                    Off-Chain Score (Current: {scoreComponents.offChain.value}/300)
                  </h3>
                  <p style={{ marginBottom: 'var(--space-4)', color: 'var(--color-text-secondary)' }}>
                    The Off-Chain score evaluates your financial and repayment history.
                  </p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    <div style={{
                      padding: 'var(--space-3)',
                      background: 'rgba(59, 130, 246, 0.05)',
                      borderRadius: 'var(--radius-md)',
                      borderLeft: '3px solid #3B82F6'
                    }}>
                      <h4 style={{ marginBottom: 'var(--space-2)' }}>✅ Repayment History</h4>
                      <p style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>
                        Pay your loans on time to maximize this score (max 150 points).
                      </p>
                      <ul style={{ fontSize: 'var(--text-sm)', paddingLeft: 'var(--space-4)', margin: 0 }}>
                        <li>100% on-time payments: 150 points</li>
                        <li>90-99%: 120 points</li>
                        <li>80-89%: 90 points</li>
                        <li>70-79%: 60 points</li>
                      </ul>
                      <p style={{ fontSize: 'var(--text-xs)', marginTop: 'var(--space-2)', fontStyle: 'italic' }}>
                        💡 Make all your loan payments before the due date.
                      </p>
                    </div>

                    <div style={{
                      padding: 'var(--space-3)',
                      background: 'rgba(59, 130, 246, 0.05)',
                      borderRadius: 'var(--radius-md)',
                      borderLeft: '3px solid #3B82F6'
                    }}>
                      <h4 style={{ marginBottom: 'var(--space-2)' }}>💵 Repayment Ratio</h4>
                      <p style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>
                        Repay more than you borrow to earn points (max 100 points).
                      </p>
                      <ul style={{ fontSize: 'var(--text-sm)', paddingLeft: 'var(--space-4)', margin: 0 }}>
                        <li>Repaid ≥ 100%: 100 points</li>
                        <li>80-99%: 80 points</li>
                        <li>50-79%: 60 points</li>
                        <li>30-49%: 40 points</li>
                      </ul>
                      <p style={{ fontSize: 'var(--text-xs)', marginTop: 'var(--space-2)', fontStyle: 'italic' }}>
                        💡 Repay your loans completely and quickly.
                      </p>
                    </div>

                    <div style={{
                      padding: 'var(--space-3)',
                      background: 'rgba(59, 130, 246, 0.05)',
                      borderRadius: 'var(--radius-md)',
                      borderLeft: '3px solid #3B82F6'
                    }}>
                      <h4 style={{ marginBottom: 'var(--space-2)' }}>🚫 Avoid Defaults</h4>
                      <p style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>
                        No payment defaults gives you 50 additional points.
                      </p>
                      <p style={{ fontSize: 'var(--text-xs)', marginTop: 'var(--space-2)', fontStyle: 'italic' }}>
                        💡 Absolutely avoid payment defaults. Contact us if you have difficulties.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedCriterion === 'assets' && (
                <div>
                  <h3 style={{ marginBottom: 'var(--space-4)', color: '#60A5FA' }}>
                    Assets Score (Current: {scoreComponents.assets.value}/200)
                  </h3>
                  <p style={{ marginBottom: 'var(--space-4)', color: 'var(--color-text-secondary)' }}>
                    The Assets score evaluates the value and diversity of your RWA NFTs.
                  </p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    <div style={{
                      padding: 'var(--space-3)',
                      background: 'rgba(96, 165, 250, 0.05)',
                      borderRadius: 'var(--radius-md)',
                      borderLeft: '3px solid #60A5FA'
                    }}>
                      <h4 style={{ marginBottom: 'var(--space-2)' }}>💎 Total Asset Value</h4>
                      <p style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>
                        The more valuable your RWA NFTs, the more points you earn (max 80 points).
                      </p>
                      <ul style={{ fontSize: 'var(--text-sm)', paddingLeft: 'var(--space-4)', margin: 0 }}>
                        <li>1M+ USDC: 80 points</li>
                        <li>500K-1M: 70 points</li>
                        <li>250K-500K: 60 points</li>
                        <li>100K-250K: 50 points</li>
                        <li>50K-100K: 40 points</li>
                      </ul>
                      <p style={{ fontSize: 'var(--text-xs)', marginTop: 'var(--space-2)', fontStyle: 'italic' }}>
                        💡 Tokenize high-value assets (real estate, mining, infrastructure).
                      </p>
                    </div>

                    <div style={{
                      padding: 'var(--space-3)',
                      background: 'rgba(96, 165, 250, 0.05)',
                      borderRadius: 'var(--radius-md)',
                      borderLeft: '3px solid #60A5FA'
                    }}>
                      <h4 style={{ marginBottom: 'var(--space-2)' }}>🎨 Asset Diversity</h4>
                      <p style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>
                        Diversify your asset types to maximize this score (max 60 points).
                      </p>
                      <ul style={{ fontSize: 'var(--text-sm)', paddingLeft: 'var(--space-4)', margin: 0 }}>
                        <li>4+ different types: 60 points</li>
                        <li>3 types: 50 points</li>
                        <li>2 types: 40 points</li>
                        <li>1 type: 30 points</li>
                      </ul>
                      <p style={{ fontSize: 'var(--text-xs)', marginTop: 'var(--space-2)', fontStyle: 'italic' }}>
                        💡 Tokenize different asset types: real estate, vehicles, collectibles, mining, etc.
                      </p>
                    </div>

                    <div style={{
                      padding: 'var(--space-3)',
                      background: 'rgba(96, 165, 250, 0.05)',
                      borderRadius: 'var(--radius-md)',
                      borderLeft: '3px solid #60A5FA'
                    }}>
                      <h4 style={{ marginBottom: 'var(--space-2)' }}>📦 Number of Assets</h4>
                      <p style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>
                        The more tokenized assets you have, the more points you earn (max 40 points).
                      </p>
                      <ul style={{ fontSize: 'var(--text-sm)', paddingLeft: 'var(--space-4)', margin: 0 }}>
                        <li>10+ NFTs: 40 points</li>
                        <li>5-9 NFTs: 35 points</li>
                        <li>3-4 NFTs: 30 points</li>
                        <li>2 NFTs: 25 points</li>
                        <li>1 NFT: 15 points</li>
                      </ul>
                      <p style={{ fontSize: 'var(--text-xs)', marginTop: 'var(--space-2)', fontStyle: 'italic' }}>
                        💡 Tokenize multiple assets to increase your score.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedCriterion === 'reputation' && (
                <div>
                  <h3 style={{ marginBottom: 'var(--space-4)', color: '#93C5FD' }}>
                    Reputation Score (Current: {scoreComponents.reputation.value}/150)
                  </h3>
                  <p style={{ marginBottom: 'var(--space-4)', color: 'var(--color-text-secondary)' }}>
                    The Reputation score evaluates your account age, verifications, and history on the platform.
                  </p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    <div style={{
                      padding: 'var(--space-3)',
                      background: 'rgba(147, 197, 253, 0.05)',
                      borderRadius: 'var(--radius-md)',
                      borderLeft: '3px solid #93C5FD'
                    }}>
                      <h4 style={{ marginBottom: 'var(--space-2)' }}>📅 Account Age</h4>
                      <p style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>
                        The older your account, the more points you earn (max 50 points).
                      </p>
                      <ul style={{ fontSize: 'var(--text-sm)', paddingLeft: 'var(--space-4)', margin: 0 }}>
                        <li>2+ years: 50 points</li>
                        <li>1-2 years: 40 points</li>
                        <li>6-12 months: 30 points</li>
                        <li>3-6 months: 20 points</li>
                      </ul>
                      <p style={{ fontSize: 'var(--text-xs)', marginTop: 'var(--space-2)', fontStyle: 'italic' }}>
                        💡 Time passes automatically. Stay active on the platform.
                      </p>
                    </div>

                    <div style={{
                      padding: 'var(--space-3)',
                      background: 'rgba(147, 197, 253, 0.05)',
                      borderRadius: 'var(--radius-md)',
                      borderLeft: '3px solid #93C5FD'
                    }}>
                      <h4 style={{ marginBottom: 'var(--space-2)' }}>🛡️ KYC/AML Verification</h4>
                      <p style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>
                        Complete your verifications to earn points (max 50 points).
                      </p>
                      <ul style={{ fontSize: 'var(--text-sm)', paddingLeft: 'var(--space-4)', margin: 0 }}>
                        <li>KYC + AML + Enhanced: 50 points</li>
                        <li>KYC + AML + Standard: 40 points</li>
                        <li>KYC + AML: 30 points</li>
                        <li>KYC only: 20 points</li>
                        <li>No verification: 10 points</li>
                      </ul>
                      <p style={{ fontSize: 'var(--text-xs)', marginTop: 'var(--space-2)', fontStyle: 'italic' }}>
                        💡 Go to your Profile to complete your KYC/AML verification.
                      </p>
                    </div>

                    <div style={{
                      padding: 'var(--space-3)',
                      background: 'rgba(147, 197, 253, 0.05)',
                      borderRadius: 'var(--radius-md)',
                      borderLeft: '3px solid #93C5FD'
                    }}>
                      <h4 style={{ marginBottom: 'var(--space-2)' }}>📊 Loan History</h4>
                      <p style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>
                        Have a long and positive loan history (max 50 points).
                      </p>
                      <ul style={{ fontSize: 'var(--text-sm)', paddingLeft: 'var(--space-4)', margin: 0 }}>
                        <li>2+ years history: 50 points</li>
                        <li>1-2 years: 40 points</li>
                        <li>6-12 months: 30 points</li>
                        <li>3-6 months: 20 points</li>
                      </ul>
                      <p style={{ fontSize: 'var(--text-xs)', marginTop: 'var(--space-2)', fontStyle: 'italic' }}>
                        💡 Take out loans and repay them on time to build your history.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="form-actions" style={{ marginTop: 'var(--space-6)' }}>
                <button
                  type="button"
                  onClick={() => setShowAdviceModal(false)}
                  className="btn-primary"
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
