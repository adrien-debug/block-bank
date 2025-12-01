'use client'

import { useState, useEffect } from 'react'
import CreditScore from './dashboard/CreditScore'
import Loans from './dashboard/Loans'
import NFTAssets from './dashboard/NFTAssets'
import Insurance from './dashboard/Insurance'
import Profile from './dashboard/Profile'
import Explore from './dashboard/Explore'
import Investor from './dashboard/Investor'
import ActivityFeed from './dashboard/ActivityFeed'
import AlertsPanel from './dashboard/AlertsPanel'
import Sidebar from './ui/Sidebar'
import StatCard from './ui/StatCard'
import DashboardIcon from './icons/DashboardIcon'
import StarIcon from './icons/StarIcon'
import MoneyIcon from './icons/MoneyIcon'
import NFTIcon from './icons/NFTIcon'
import ShieldIcon from './icons/ShieldIcon'
import UserIcon from './icons/UserIcon'
import ExploreIcon from './icons/ExploreIcon'
import InvestorIcon from './icons/InvestorIcon'
import ChartIcon from './icons/ChartIcon'
import DocumentIcon from './icons/DocumentIcon'
import TermsAndConditions from './dashboard/TermsAndConditions'

declare global {
  interface Window {
    ethereum?: any
  }
}

type Tab = 'dashboard' | 'explore' | 'credit-score' | 'loans' | 'nft' | 'insurance' | 'profile' | 'investor' | 'terms'

export default function Dashboard() {
  const [address, setAddress] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')
  const [isMenuOpen, setIsMenuOpen] = useState(true)
  const [chartTimeRange, setChartTimeRange] = useState<'1M' | '6M' | '12M' | 'All'>('All')
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null)
  const [hoveredSegmentIndex, setHoveredSegmentIndex] = useState<number | null>(null)
  const [chartLoaded, setChartLoaded] = useState(false)
  
  // Sur desktop, le menu est toujours ouvert (pas de toggle)
  // Sur mobile, on peut le fermer/ouvrir
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(true)
      }
    }
    
    window.addEventListener('resize', handleResize)
    handleResize() // Check initial size
    
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const checkConnection = async () => {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' })
          if (accounts.length > 0) {
            setAddress(accounts[0])
          } else {
            setAddress(null)
          }
        } catch (error) {
          console.error('Error checking connection:', error)
          setAddress(null)
        }
      }
      
      checkConnection()

      // Écouter les changements de compte (déconnexion depuis MetaMask ou WalletConnect)
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          setAddress(null)
        } else {
          setAddress(accounts[0])
        }
      }

      window.ethereum.on('accountsChanged', handleAccountsChanged)

      return () => {
        if (window.ethereum && window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
        }
      }
    }
  }, [])

  // Animation au chargement des graphiques
  useEffect(() => {
    if (activeTab === 'dashboard') {
      setChartLoaded(false)
      const timer = setTimeout(() => setChartLoaded(true), 100)
      return () => clearTimeout(timer)
    }
  }, [activeTab])

  // Données pour différents périodes
  const scoreDataByPeriod = {
    '1M': [745, 748, 750],
    '6M': [680, 690, 700, 710, 720, 730, 738, 745, 750],
    '12M': [650, 665, 680, 690, 700, 710, 720, 730, 738, 745, 750],
    'All': [600, 620, 640, 660, 680, 700, 720, 735, 745, 748, 750]
  }

  const tabs = [
    { id: 'dashboard' as Tab, label: 'Dashboard', icon: DashboardIcon },
    { id: 'explore' as Tab, label: 'Explore', icon: ExploreIcon },
    { id: 'credit-score' as Tab, label: 'Credit Score', icon: StarIcon },
    { id: 'loans' as Tab, label: 'My Loans', icon: MoneyIcon },
    { id: 'nft' as Tab, label: 'NFT RWA', icon: NFTIcon },
    { id: 'insurance' as Tab, label: 'Insurance', icon: ShieldIcon },
    { id: 'investor' as Tab, label: 'Investor', icon: InvestorIcon },
    { id: 'profile' as Tab, label: 'Profile', icon: UserIcon },
    { id: 'terms' as Tab, label: 'Terms & Conditions', icon: DocumentIcon },
  ]

  return (
    <div className="dashboard">
      {/* Menu latéral */}
      <Sidebar
        items={tabs.map(tab => ({
          id: tab.id,
          label: tab.label,
          icon: tab.icon,
        }))}
        activeItem={activeTab}
        onItemClick={(id) => setActiveTab(id as Tab)}
        isOpen={isMenuOpen}
        onToggle={() => setIsMenuOpen(!isMenuOpen)}
        walletAddress={address}
      />

      <div className="dashboard-content">
        {activeTab === 'dashboard' && (
          <div className="dashboard-overview">
            <div className="dashboard-header">
              <div>
                <h1>Dashboard</h1>
              </div>
              <div className="dashboard-date">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>

            {/* Stats principales */}
            <div className="stats-grid">
              <StatCard
                icon={<ChartIcon />}
                label="Credit Score"
                value={750}
                trend={{ value: '+12', isPositive: true, period: 'vs last month' }}
                badge={{ text: 'Tier A • Excellent', variant: 'primary' }}
                variant="primary"
              />
              
              <StatCard
                icon={<MoneyIcon />}
                label="Active Loans"
                value={2}
                subtitle="150,000 USDC"
                progress={{ value: 65, label: '65% avg LTV' }}
                variant="success"
              />
              
              <StatCard
                icon={<NFTIcon />}
                label="NFT RWA"
                value={3}
                subtitle="Total value: 950,000 USDC"
                breakdown={['2 locked', '1 available']}
                variant="info"
              />
              
              <StatCard
                icon={<ShieldIcon />}
                label="Insurance"
                value="Active"
                subtitle="Coverage: 80%"
                extraInfo="Premium: 1,200 USDC/month"
                variant="warning"
              />
            </div>

            {/* Graphiques et visualisations - Premium */}
            <div className="dashboard-charts-premium">
              <div className="chart-card-premium">
                <div className="chart-header-premium">
                  <div>
                    <h3>Credit Score Evolution</h3>
                  </div>
                  <div className="chart-time-filters">
                    {(['1M', '6M', '12M', 'All'] as const).map((period) => (
                      <button
                        key={period}
                        className={`time-filter-btn ${chartTimeRange === period ? 'active' : ''}`}
                        onClick={() => setChartTimeRange(period)}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="chart-container-premium">
                  <div className="chart-grid-lines">
                    {[800, 750, 700, 650, 600].map((value, index) => (
                      <div key={index} className="grid-line">
                        <span className="grid-label">{value}</span>
                      </div>
                    ))}
                  </div>
                  {(() => {
                    const data = scoreDataByPeriod[chartTimeRange]
                    const maxValue = 800
                    const minValue = 550
                    const range = maxValue - minValue
                    const totalBars = data.length
                    const chartWidth = 1000
                    const chartHeight = 300
                    const barSpacing = 8
                    const totalSpacing = barSpacing * (totalBars - 1)
                    const availableWidth = chartWidth - totalSpacing
                    const barWidth = availableWidth / totalBars
                    
                    return (
                      <div className="bar-chart-premium">
                        {hoveredBarIndex !== null && (
                          <div 
                            className="bar-tooltip"
                            style={{
                              left: `${(hoveredBarIndex * (barWidth + barSpacing) + barWidth / 2) / chartWidth * 100}%`,
                              bottom: `${((data[hoveredBarIndex] - minValue) / range) * 100 + 5}%`
                            }}
                          >
                            <div className="tooltip-value">{data[hoveredBarIndex]}</div>
                            <div className="tooltip-label">Credit Score</div>
                          </div>
                        )}
                        <svg className="chart-bars-svg" viewBox="0 0 1000 300" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
                          <defs>
                            <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#4B5563" />
                              <stop offset="50%" stopColor="#1F2937" />
                              <stop offset="100%" stopColor="#374151" />
                            </linearGradient>
                            <linearGradient id="barGradientHover" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#6B7280" />
                              <stop offset="50%" stopColor="#4B5563" />
                              <stop offset="100%" stopColor="#1F2937" />
                            </linearGradient>
                          </defs>
                          {data.map((value, index) => {
                            const barHeight = ((value - minValue) / range) * chartHeight
                            const x = index * (barWidth + barSpacing)
                            const y = chartHeight - barHeight
                            const isHovered = hoveredBarIndex === index
                            const animationDelay = index * 50
                            
                            return (
                              <g 
                                key={index} 
                                className="bar-group"
                                onMouseEnter={() => setHoveredBarIndex(index)}
                                onMouseLeave={() => setHoveredBarIndex(null)}
                              >
                                <rect
                                  x={x}
                                  y={chartHeight}
                                  width={barWidth}
                                  height="0"
                                  fill={isHovered ? "url(#barGradientHover)" : "url(#barGradient)"}
                                  className="chart-bar"
                                  rx="4"
                                  style={{
                                    transformOrigin: 'bottom',
                                    transform: chartLoaded ? `translateY(-${barHeight}px) scaleY(1)` : 'translateY(0) scaleY(0)',
                                    height: chartLoaded ? `${barHeight}px` : '0',
                                    transition: chartLoaded ? 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), height 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), fill 0.3s ease' : 'none',
                                    transitionDelay: chartLoaded ? `${animationDelay}ms` : '0ms',
                                    opacity: chartLoaded ? 1 : 0
                                  }}
                                />
                                <text
                                  x={x + barWidth / 2}
                                  y={y - 8}
                                  textAnchor="middle"
                                  className="bar-value-label"
                                  fill="var(--color-text-primary)"
                                  fontSize="12"
                                  fontWeight="600"
                                  opacity={isHovered && chartLoaded ? "1" : "0"}
                                  style={{ 
                                    transition: 'opacity 0.3s ease',
                                    animationDelay: chartLoaded ? `${animationDelay + 300}ms` : '0ms'
                                  }}
                                >
                                  {value}
                                </text>
                              </g>
                            )
                          })}
                        </svg>
                        <div className="bar-labels-container">
                          {data.map((value, index) => {
                            const barWidthPercent = (barWidth / chartWidth) * 100
                            const barSpacingPercent = (barSpacing / chartWidth) * 100
                            const leftPercent = (index * (barWidthPercent + barSpacingPercent)) + (barWidthPercent / 2)
                            return (
                              <div
                                key={index}
                                className="bar-label"
                                style={{ left: `${leftPercent}%` }}
                              >
                                {index === 0 ? 'Start' : index === data.length - 1 ? 'Now' : ''}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })()}
                </div>
              </div>

              <div className="chart-card-premium">
                <div className="chart-header-premium">
                  <div>
                    <h3>Asset Distribution</h3>
                  </div>
                </div>
                <div className="chart-container-premium">
                  <div className="asset-distribution-chart">
                    {(() => {
                      // Data - All historical data - Couleurs neutres (bleu retiré)
                      const assets = [
                        { name: 'Real Estate', value: 300000, color: '#374151' }, // Gris foncé
                        { name: 'Mining', value: 150000, color: '#6B7280' }, // Gris moyen
                        { name: 'Infrastructure', value: 500000, color: '#1F2937' }, // Gris très foncé
                        { name: 'Vehicles', value: 50000, color: '#111827' }, // Presque noir
                        { name: 'Collectibles', value: 25000, color: '#4B5563' } // Gris
                      ]
                      const total = assets.reduce((sum, asset) => sum + asset.value, 0)
                      
                      let currentAngle = 0
                      const segments = assets.map((asset, index) => {
                        const percentage = (asset.value / total) * 100
                        const angle = (asset.value / total) * 360
                        const startAngle = currentAngle
                        const endAngle = currentAngle + angle
                        currentAngle = endAngle
                        
                        const startAngleRad = (startAngle - 90) * (Math.PI / 180)
                        const endAngleRad = (endAngle - 90) * (Math.PI / 180)
                        const largeArcFlag = angle > 180 ? 1 : 0
                        
                        const x1 = 150 + 120 * Math.cos(startAngleRad)
                        const y1 = 150 + 120 * Math.sin(startAngleRad)
                        const x2 = 150 + 120 * Math.cos(endAngleRad)
                        const y2 = 150 + 120 * Math.sin(endAngleRad)
                        
                        return {
                          ...asset,
                          percentage,
                          path: `M 150,150 L ${x1},${y1} A 120,120 0 ${largeArcFlag},1 ${x2},${y2} Z`,
                          startAngle,
                          endAngle
                        }
                      })
                      
                      return (
                        <>
                          <svg className="donut-chart-premium" viewBox="0 0 300 300">
                            <defs>
                              {segments.map((segment, index) => {
                                // Créer des dégradés neutres selon le segment (bleu retiré)
                                let gradientColors: { start: string; end: string } = { start: segment.color, end: segment.color }
                                if (segment.color === '#374151') {
                                  gradientColors = { start: '#374151', end: '#4B5563' }
                                } else if (segment.color === '#6B7280') {
                                  gradientColors = { start: '#6B7280', end: '#9CA3AF' }
                                } else if (segment.color === '#1F2937') {
                                  gradientColors = { start: '#1F2937', end: '#374151' }
                                } else if (segment.color === '#111827') {
                                  gradientColors = { start: '#111827', end: '#1F2937' }
                                } else {
                                  gradientColors = { start: segment.color, end: '#6B7280' }
                                }
                                return (
                                  <linearGradient key={index} id={`gradient-all-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor={gradientColors.start} stopOpacity="1" />
                                    <stop offset="50%" stopColor={gradientColors.start} stopOpacity="0.9" />
                                    <stop offset="100%" stopColor={gradientColors.end} stopOpacity="0.8" />
                                  </linearGradient>
                                )
                              })}
                            </defs>
                            {segments.map((segment, index) => {
                              const isHovered = hoveredSegmentIndex === index
                              const animationDelay = index * 100
                              return (
                                <path
                                  key={index}
                                  d={segment.path}
                                  fill={`url(#gradient-all-${index})`}
                                  stroke="rgba(255, 255, 255, 0.15)"
                                  strokeWidth="3"
                                  className="donut-segment"
                                  onMouseEnter={() => setHoveredSegmentIndex(index)}
                                  onMouseLeave={() => setHoveredSegmentIndex(null)}
                                  style={{ 
                                    filter: isHovered ? 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))' : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15))',
                                    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                                    transformOrigin: '150px 150px',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    animation: chartLoaded ? `segmentFadeIn 0.8s ease-out ${animationDelay}ms forwards` : 'none',
                                    opacity: chartLoaded ? 1 : 0
                                  }}
                                />
                              )
                            })}
                            <circle cx="150" cy="150" r="80" fill="#FFFFFF" />
                            <text x="150" y="145" textAnchor="middle" className="donut-center-value" fill="#0A0A0A">
                              {total.toLocaleString()}
                            </text>
                            <text x="150" y="165" textAnchor="middle" className="donut-center-label" fill="#64748B">
                              USDC
                            </text>
                          </svg>
                          <div className="asset-legend-premium">
                            {segments.map((segment, index) => (
                              <div key={index} className="legend-item-premium">
                                <div className="legend-color-premium" style={{ background: segment.color }}></div>
                                <span className="legend-name-premium">{segment.name}</span>
                                <div className="legend-values">
                                  <span className="legend-value-premium">{segment.value.toLocaleString()} USDC</span>
                                  <span className="legend-percentage-premium">{segment.percentage.toFixed(1)}%</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )
                    })()}
                  </div>
                </div>
              </div>
            </div>

            {/* Activité récente et alertes */}
            <div className="dashboard-activity">
              <ActivityFeed />
              <AlertsPanel />
            </div>

          </div>
        )}
        {activeTab === 'explore' && <Explore />}
        {activeTab === 'credit-score' && <CreditScore />}
        {activeTab === 'loans' && <Loans />}
        {activeTab === 'nft' && <NFTAssets />}
        {activeTab === 'insurance' && <Insurance />}
        {activeTab === 'investor' && <Investor />}
        {activeTab === 'profile' && <Profile />}
        {activeTab === 'terms' && <TermsAndConditions />}
      </div>
    </div>
  )
}

