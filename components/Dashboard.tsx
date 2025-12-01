'use client'

import { useState, useEffect } from 'react'
import CreditScore from './dashboard/CreditScore'
import Loans from './dashboard/Loans'
import NFTAssets from './dashboard/NFTAssets'
import Insurance from './dashboard/Insurance'
import Profile from './dashboard/Profile'
import Explore from './dashboard/Explore'
import Investor from './dashboard/Investor'
import DashboardIcon from './icons/DashboardIcon'
import StarIcon from './icons/StarIcon'
import MoneyIcon from './icons/MoneyIcon'
import NFTIcon from './icons/NFTIcon'
import ShieldIcon from './icons/ShieldIcon'
import UserIcon from './icons/UserIcon'
import ExploreIcon from './icons/ExploreIcon'
import InvestorIcon from './icons/InvestorIcon'
import ChartIcon from './icons/ChartIcon'
import CheckIcon from './icons/CheckIcon'
import LockIcon from './icons/LockIcon'
import WarningIcon from './icons/WarningIcon'
import InfoIcon from './icons/InfoIcon'
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

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' }).then((accounts: string[]) => {
        if (accounts.length > 0) {
          setAddress(accounts[0])
        }
      }).catch(() => {
        // Ignorer les erreurs silencieusement
      })
    }
  }, [])

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
      <div className={`dashboard-sidebar ${isMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <h2>BLOCKBANK</h2>
          </div>
          <p className="wallet-address-small">{address?.slice(0, 6)}...{address?.slice(-4)}</p>
        </div>
        <nav className="sidebar-nav">
          {tabs.map((tab) => {
            const IconComponent = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  // Le menu reste ouvert après sélection
                }}
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

      <div className={`dashboard-content ${isMenuOpen ? 'menu-open' : ''}`}>
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
              <div className="stat-card stat-card-primary">
                <div className="stat-icon-wrapper">
                  <div className="stat-icon">
                    <ChartIcon />
                  </div>
                </div>
                <div className="stat-content">
                  <div className="stat-label">Credit Score</div>
                  <div className="stat-value">750</div>
                  <div className="stat-trend">
                    <span className="trend-up">↑ +12</span>
                    <span className="trend-period">vs last month</span>
                  </div>
                  <div className="stat-badge badge-a">Tier A • Excellent</div>
                </div>
              </div>
              
              <div className="stat-card stat-card-success">
                <div className="stat-icon-wrapper">
                  <div className="stat-icon">
                    <MoneyIcon />
                  </div>
                </div>
                <div className="stat-content">
                  <div className="stat-label">Active Loans</div>
                  <div className="stat-value">2</div>
                  <div className="stat-subtitle">150,000 USDC</div>
                  <div className="stat-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: '65%' }}></div>
                    </div>
                    <span className="progress-text">65% avg LTV</span>
                  </div>
                </div>
              </div>
              
              <div className="stat-card stat-card-info">
                <div className="stat-icon-wrapper">
                  <div className="stat-icon">
                    <NFTIcon />
                  </div>
                </div>
                <div className="stat-content">
                  <div className="stat-label">NFT RWA</div>
                  <div className="stat-value">3</div>
                  <div className="stat-subtitle">Total value: 950,000 USDC</div>
                  <div className="stat-breakdown">
                    <span>2 locked</span>
                    <span>•</span>
                    <span>1 available</span>
                  </div>
                </div>
              </div>
              
              <div className="stat-card stat-card-warning">
                <div className="stat-icon-wrapper">
                  <div className="stat-icon">
                    <ShieldIcon />
                  </div>
                </div>
                <div className="stat-content">
                  <div className="stat-label">Insurance</div>
                  <div className="stat-value">Active</div>
                  <div className="stat-subtitle">Coverage: 80%</div>
                  <div className="stat-info">Premium: 1,200 USDC/month</div>
                </div>
              </div>
            </div>

            {/* Graphiques et visualisations - Premium Dynamic High Level */}
            <div className="dashboard-charts-premium">
              <div className="chart-card-premium-dynamic">
                {/* Header Premium avec séparation élégante */}
                <div className="chart-header-dynamic">
                  <div className="chart-title-section">
                    <div className="chart-title-wrapper">
                      <h3 className="chart-title-main">Credit Score Evolution</h3>
                      <div className="chart-title-accent"></div>
                    </div>
                  </div>
                  <div className="chart-divider-vertical"></div>
                  <div className="chart-title-section">
                    <div className="chart-title-wrapper">
                      <h3 className="chart-title-main">Asset Distribution</h3>
                      <div className="chart-title-accent"></div>
                    </div>
                  </div>
                </div>

                {/* Container Premium avec layout dynamique */}
                <div className="chart-container-dynamic">
                  {/* Credit Score Evolution - Section Premium */}
                  <div className="chart-section-dynamic chart-section-left">
                    <div className="chart-wrapper-premium">
                      <div className="chart-container-premium-enhanced">
                        <div className="chart-grid-lines-enhanced">
                          {[800, 750, 700, 650, 600].map((value, index) => (
                            <div key={index} className="grid-line-enhanced">
                              <span className="grid-label-enhanced">{value}</span>
                            </div>
                          ))}
                        </div>
                        {(() => {
                          // Data - All historical data
                          const data = [600, 620, 640, 660, 680, 700, 720, 735, 745, 748, 750]
                          const maxValue = 800
                          const minValue = 550
                          const range = maxValue - minValue
                          
                          // Generate path for SVG
                          const pathPoints = data.map((value, index) => {
                            const x = (index / (data.length - 1)) * 1000
                            const y = 300 - ((value - minValue) / range) * 300
                            return `${index === 0 ? 'M' : 'L'} ${x},${y}`
                          }).join(' ')
                          
                          const areaPath = `${pathPoints} L 1000,300 L 0,300 Z`
                          
                          return (
                            <>
                              <div className="chart-points-container-enhanced">
                                {data.map((value, index, array) => {
                                  const percentage = ((value - minValue) / range) * 100
                                  const leftPercent = (index / (array.length - 1)) * 100
                                  
                                  return (
                                    <div key={index} className="chart-point-premium-enhanced" style={{ 
                                      left: `${leftPercent}%`,
                                      bottom: `${percentage}%`
                                    }}>
                                      <div className="point-tooltip-premium-enhanced">{value}</div>
                                      <div className="point-dot-premium-enhanced"></div>
                                    </div>
                                  )
                                })}
                              </div>
                              <div className="line-chart-premium-enhanced">
                                <svg className="chart-line-premium-enhanced" viewBox="0 0 1000 300" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
                                  <defs>
                                    <linearGradient id="chartGradient-dynamic" x1="0%" y1="0%" x2="0%" y2="100%">
                                      <stop offset="0%" stopColor="#0A84FF" stopOpacity="0.5" />
                                      <stop offset="30%" stopColor="#409CFF" stopOpacity="0.3" />
                                      <stop offset="70%" stopColor="#60A5FA" stopOpacity="0.15" />
                                      <stop offset="100%" stopColor="#0A84FF" stopOpacity="0" />
                                    </linearGradient>
                                    <linearGradient id="chartLineGradient-dynamic" x1="0%" y1="0%" x2="100%" y2="0%">
                                      <stop offset="0%" stopColor="#0A84FF" />
                                      <stop offset="25%" stopColor="#409CFF" />
                                      <stop offset="50%" stopColor="#60A5FA" />
                                      <stop offset="75%" stopColor="#409CFF" />
                                      <stop offset="100%" stopColor="#0A84FF" />
                                    </linearGradient>
                                    <filter id="glow">
                                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                                      <feMerge>
                                        <feMergeNode in="coloredBlur"/>
                                        <feMergeNode in="SourceGraphic"/>
                                      </feMerge>
                                    </filter>
                                  </defs>
                                  <path 
                                    d={pathPoints} 
                                    stroke="url(#chartLineGradient-dynamic)"
                                    fill="none" 
                                    strokeWidth="3.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    filter="url(#glow)"
                                  />
                                  <path 
                                    d={areaPath} 
                                    fill="url(#chartGradient-dynamic)"
                                    stroke="none"
                                  />
                                </svg>
                              </div>
                            </>
                          )
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* Divider Premium */}
                  <div className="chart-divider-premium">
                    <div className="divider-line"></div>
                    <div className="divider-glow"></div>
                  </div>

                  {/* Asset Distribution - Section Premium */}
                  <div className="chart-section-dynamic chart-section-right">
                    <div className="chart-wrapper-premium">
                      <div className="chart-container-premium-enhanced">
                        <div className="asset-distribution-chart-enhanced">
                          {(() => {
                            // Data - All historical data - Premium Blue/White Chart Colors
                            const assets = [
                              { name: 'Real Estate', value: 300000, color: '#1F6AE1' },
                              { name: 'Mining', value: 150000, color: '#60A5FA' },
                              { name: 'Infrastructure', value: 500000, color: '#123E6B' },
                              { name: 'Vehicles', value: 50000, color: '#0A2540' },
                              { name: 'Collectibles', value: 25000, color: '#409CFF' }
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
                                <div className="donut-wrapper-premium">
                                  <svg className="donut-chart-premium-enhanced" viewBox="0 0 300 300">
                                    <defs>
                                      {segments.map((segment, index) => {
                                        let gradientColors: { start: string; end: string } = { start: segment.color, end: segment.color }
                                        if (segment.color === '#1F6AE1') {
                                          gradientColors = { start: '#1F6AE1', end: '#60A5FA' }
                                        } else if (segment.color === '#60A5FA') {
                                          gradientColors = { start: '#60A5FA', end: '#93C5FD' }
                                        } else if (segment.color === '#123E6B') {
                                          gradientColors = { start: '#123E6B', end: '#1F6AE1' }
                                        } else if (segment.color === '#0A2540') {
                                          gradientColors = { start: '#0A2540', end: '#123E6B' }
                                        } else if (segment.color === '#409CFF') {
                                          gradientColors = { start: '#409CFF', end: '#60A5FA' }
                                        }
                                        return (
                                          <linearGradient key={index} id={`gradient-dynamic-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor={gradientColors.start} stopOpacity="1" />
                                            <stop offset="50%" stopColor={gradientColors.start} stopOpacity="0.95" />
                                            <stop offset="100%" stopColor={gradientColors.end} stopOpacity="0.85" />
                                          </linearGradient>
                                        )
                                      })}
                                      <radialGradient id="donutCenterGradient-dynamic" cx="50%" cy="30%" r="70%">
                                        <stop offset="0%" stopColor="#0A84FF" stopOpacity="0.15" />
                                        <stop offset="60%" stopColor="#0A84FF" stopOpacity="0.08" />
                                        <stop offset="100%" stopColor="#020617" stopOpacity="1" />
                                      </radialGradient>
                                      <filter id="donutGlow">
                                        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                                        <feMerge>
                                          <feMergeNode in="coloredBlur"/>
                                          <feMergeNode in="SourceGraphic"/>
                                        </feMerge>
                                      </filter>
                                    </defs>
                                    {segments.map((segment, index) => (
                                      <path
                                        key={index}
                                        d={segment.path}
                                        fill={`url(#gradient-dynamic-${index})`}
                                        stroke="rgba(255, 255, 255, 0.2)"
                                        strokeWidth="3.5"
                                        className="donut-segment-enhanced"
                                        filter="url(#donutGlow)"
                                      />
                                    ))}
                                    <circle cx="150" cy="150" r="80" fill="url(#donutCenterGradient-dynamic)" />
                                    <text x="150" y="145" textAnchor="middle" className="donut-center-value-enhanced" fill="#E5F0FF">
                                      {total.toLocaleString()}
                                    </text>
                                    <text x="150" y="165" textAnchor="middle" className="donut-center-label-enhanced" fill="#94A3B8">
                                      USDC
                                    </text>
                                  </svg>
                                </div>
                                <div className="asset-legend-premium-enhanced">
                                  {segments.map((segment, index) => (
                                    <div key={index} className="legend-item-premium-enhanced">
                                      <div className="legend-color-premium-enhanced" style={{ background: segment.color }}></div>
                                      <span className="legend-name-premium-enhanced">{segment.name}</span>
                                      <div className="legend-values-enhanced">
                                        <span className="legend-value-premium-enhanced">{segment.value.toLocaleString()} USDC</span>
                                        <span className="legend-percentage-premium-enhanced">{segment.percentage.toFixed(1)}%</span>
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
                </div>
              </div>
            </div>

            {/* Activité récente et alertes */}
            <div className="dashboard-activity">
              <div className="activity-card">
                <div className="activity-header">
                  <h3>Recent Activity</h3>
                  <button className="btn-ghost">View all</button>
                </div>
                <div className="activity-list">
                  <div className="activity-item">
                    <div className="activity-icon activity-success">
                      <CheckIcon />
                    </div>
                    <div className="activity-content">
                      <div className="activity-title">Payment received</div>
                      <div className="activity-desc">Loan #1 - 15,000 USDC</div>
                      <div className="activity-time">2 hours ago</div>
                    </div>
                    <div className="activity-amount">+15,000 USDC</div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon activity-info">
                      <ChartIcon />
                    </div>
                    <div className="activity-content">
                      <div className="activity-title">Score updated</div>
                      <div className="activity-desc">Credit Score: 750 (+12)</div>
                      <div className="activity-time">1 day ago</div>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon activity-warning">
                      <LockIcon />
                    </div>
                    <div className="activity-content">
                      <div className="activity-title">NFT locked</div>
                      <div className="activity-desc">Villa Paris - Loan #1</div>
                      <div className="activity-time">3 days ago</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="alerts-card">
                <div className="alerts-header">
                  <h3>Alerts & Notifications</h3>
                  <span className="alerts-badge">2</span>
                </div>
                <div className="alerts-list">
                  <div className="alert-item alert-important">
                    <div className="alert-icon">
                      <WarningIcon />
                    </div>
                    <div className="alert-content">
                      <div className="alert-title">Upcoming payment</div>
                      <div className="alert-desc">Loan #2 - Due in 5 days</div>
                    </div>
                    <button className="alert-action">Pay</button>
                  </div>
                  <div className="alert-item alert-info">
                    <div className="alert-icon">
                      <InfoIcon />
                    </div>
                    <div className="alert-content">
                      <div className="alert-title">Insurance renewed</div>
                      <div className="alert-desc">Coverage active until 03/15/2024</div>
                    </div>
                  </div>
                </div>
              </div>
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

