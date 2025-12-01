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
  const [selectedPeriod, setSelectedPeriod] = useState<string>('6 months')
  const [selectedAssetPeriod, setSelectedAssetPeriod] = useState<string>('6 months')

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
                <p className="dashboard-subtitle">Overview of your activity</p>
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

            {/* Graphiques et visualisations - Premium */}
            <div className="dashboard-charts-premium">
              <div className="chart-card-premium">
                <div className="chart-header-premium">
                  <div>
                    <h3>Credit Score Evolution</h3>
                    <p className="chart-subtitle">Track your credit score over time</p>
                  </div>
                  <div className="chart-period-menu-premium">
                    {['This month', '6 months', '12 months', 'All'].map((period) => (
                      <button
                        key={period}
                        className={`chart-period-btn ${period === selectedPeriod ? 'active' : ''}`}
                        onClick={() => setSelectedPeriod(period)}
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
                    // Data based on selected period
                    const dataByPeriod: Record<string, number[]> = {
                      'This month': [745, 748, 750],
                      '6 months': [680, 700, 720, 735, 745, 750],
                      '12 months': [650, 670, 690, 710, 730, 740, 745, 748, 750],
                      'All': [600, 620, 640, 660, 680, 700, 720, 735, 745, 748, 750]
                    }
                    
                    const data = dataByPeriod[selectedPeriod] || dataByPeriod['6 months']
                    const maxValue = 800
                    const minValue = selectedPeriod === 'All' ? 550 : 600
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
                        <div className="chart-points-container">
                          {data.map((value, index, array) => {
                            const percentage = ((value - minValue) / range) * 100
                            const leftPercent = (index / (array.length - 1)) * 100
                            
                            return (
                              <div key={index} className="chart-point-premium" style={{ 
                                left: `${leftPercent}%`,
                                bottom: `${percentage}%`
                              }}>
                                <div className="point-tooltip-premium">{value}</div>
                                <div className="point-dot-premium"></div>
                              </div>
                            )
                          })}
                        </div>
                        <div className="line-chart-premium">
                          <svg className="chart-line-premium" viewBox="0 0 1000 300" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
                            <defs>
                              <linearGradient id={`chartGradient-${selectedPeriod}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#0A84FF" stopOpacity="0.4" />
                                <stop offset="50%" stopColor="#409CFF" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="#0A84FF" stopOpacity="0" />
                              </linearGradient>
                              <linearGradient id={`chartLineGradient-${selectedPeriod}`} x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#0A84FF" />
                                <stop offset="50%" stopColor="#60A5FA" />
                                <stop offset="100%" stopColor="#0A84FF" />
                              </linearGradient>
                            </defs>
                            <path 
                              d={pathPoints} 
                              stroke={`url(#chartLineGradient-${selectedPeriod})`}
                              fill="none" 
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path 
                              d={areaPath} 
                              fill={`url(#chartGradient-${selectedPeriod})`}
                              stroke="none"
                            />
                          </svg>
                        </div>
                      </>
                    )
                  })()}
                </div>
              </div>

              <div className="chart-card-premium">
                <div className="chart-header-premium">
                  <div>
                    <h3>Asset Distribution</h3>
                    <p className="chart-subtitle">Breakdown of your NFT RWA portfolio</p>
                  </div>
                  <div className="chart-period-menu-premium">
                    {['This month', '6 months', '12 months', 'All'].map((period) => (
                      <button
                        key={period}
                        className={`chart-period-btn ${period === selectedAssetPeriod ? 'active' : ''}`}
                        onClick={() => setSelectedAssetPeriod(period)}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="chart-container-premium">
                  <div className="asset-distribution-chart">
                    {(() => {
                      // Data based on selected period - Premium Blue/White Chart Colors
                      const assetDataByPeriod: Record<string, { name: string; value: number; color: string }[]> = {
                        'This month': [
                          { name: 'Real Estate', value: 300000, color: '#1F6AE1' }, // Bleu profond → bleu moyen
                          { name: 'Mining', value: 150000, color: '#60A5FA' }, // Bleu moyen → bleu clair
                          { name: 'Infrastructure', value: 500000, color: '#123E6B' } // Bleu nuit
                        ],
                        '6 months': [
                          { name: 'Real Estate', value: 300000, color: '#1F6AE1' },
                          { name: 'Mining', value: 150000, color: '#60A5FA' },
                          { name: 'Infrastructure', value: 500000, color: '#123E6B' }
                        ],
                        '12 months': [
                          { name: 'Real Estate', value: 280000, color: '#1F6AE1' },
                          { name: 'Mining', value: 180000, color: '#60A5FA' },
                          { name: 'Infrastructure', value: 490000, color: '#123E6B' },
                          { name: 'Vehicles', value: 50000, color: '#0A2540' } // Bleu très profond
                        ],
                        'All': [
                          { name: 'Real Estate', value: 300000, color: '#1F6AE1' },
                          { name: 'Mining', value: 150000, color: '#60A5FA' },
                          { name: 'Infrastructure', value: 500000, color: '#123E6B' },
                          { name: 'Vehicles', value: 50000, color: '#0A2540' },
                          { name: 'Collectibles', value: 25000, color: '#409CFF' } // Dégradé primaire (remplace violet)
                        ]
                      }
                      
                      const assets = assetDataByPeriod[selectedAssetPeriod] || assetDataByPeriod['6 months']
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
                                // Créer des dégradés bleu premium selon le segment
                                let gradientColors: { start: string; end: string } = { start: segment.color, end: segment.color }
                                if (segment.color === '#1F6AE1') {
                                  gradientColors = { start: '#1F6AE1', end: '#60A5FA' } // Bleu profond → bleu moyen
                                } else if (segment.color === '#60A5FA') {
                                  gradientColors = { start: '#60A5FA', end: '#93C5FD' } // Bleu moyen → bleu clair
                                } else if (segment.color === '#123E6B') {
                                  gradientColors = { start: '#123E6B', end: '#1F6AE1' } // Bleu nuit → bleu profond
                                } else if (segment.color === '#0A2540') {
                                  gradientColors = { start: '#0A2540', end: '#123E6B' } // Bleu très profond → bleu nuit
                                } else if (segment.color === '#409CFF') {
                                  gradientColors = { start: '#409CFF', end: '#60A5FA' } // Dégradé primaire
                                }
                                return (
                                  <linearGradient key={index} id={`gradient-${selectedAssetPeriod}-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor={gradientColors.start} stopOpacity="1" />
                                    <stop offset="50%" stopColor={gradientColors.start} stopOpacity="0.9" />
                                    <stop offset="100%" stopColor={gradientColors.end} stopOpacity="0.8" />
                                  </linearGradient>
                                )
                              })}
                            </defs>
                            {segments.map((segment, index) => (
                              <path
                                key={index}
                                d={segment.path}
                                fill={`url(#gradient-${selectedAssetPeriod}-${index})`}
                                stroke="rgba(255, 255, 255, 0.15)"
                                strokeWidth="3"
                                className="donut-segment"
                                style={{ 
                                  filter: 'drop-shadow(0 2px 4px rgba(10, 132, 255, 0.25))'
                                }}
                              />
                            ))}
                            <circle cx="150" cy="150" r="80" fill="#FFFFFF" />
                            <text x="150" y="145" textAnchor="middle" className="donut-center-value" fill="#0F172A">
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

            {/* Quick Actions */}
            <div className="performance-metrics">
              <div className="quick-actions-card">
                <div className="quick-actions-header">
                  <h3>Quick Actions</h3>
                </div>
                <div className="quick-actions-grid">
                  <button className="quick-action-btn">
                    <div className="quick-action-icon">
                      <MoneyIcon />
                    </div>
                    <div className="quick-action-label">New loan</div>
                  </button>
                  <button className="quick-action-btn">
                    <div className="quick-action-icon">
                      <NFTIcon />
                    </div>
                    <div className="quick-action-label">Tokenize asset</div>
                  </button>
                  <button className="quick-action-btn">
                    <div className="quick-action-icon">
                      <ChartIcon />
                    </div>
                    <div className="quick-action-label">Update score</div>
                  </button>
                  <button className="quick-action-btn">
                    <div className="quick-action-icon">
                      <ShieldIcon />
                    </div>
                    <div className="quick-action-label">Manage insurance</div>
                  </button>
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

