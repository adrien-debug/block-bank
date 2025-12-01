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

            {/* Graphiques et visualisations */}
            <div className="dashboard-charts">
              <div className="chart-card">
                <div className="chart-header">
                  <h3>Credit Score Evolution</h3>
                  <select className="chart-period">
                    <option>6 months</option>
                    <option>12 months</option>
                    <option>All</option>
                  </select>
                </div>
                <div className="chart-container">
                  <div className="line-chart">
                    {[680, 700, 720, 735, 745, 750].map((value, index) => (
                      <div key={index} className="chart-point" style={{ 
                        left: `${(index / 5) * 100}%`,
                        bottom: `${((value - 650) / 100) * 100}%`
                      }}>
                        <div className="point-value">{value}</div>
                        <div className="point-dot"></div>
                      </div>
                    ))}
                    <svg className="chart-line" viewBox="0 0 500 200">
                      <path d="M 0,120 Q 125,100 250,80 T 500,50" stroke="currentColor" fill="none" strokeWidth="2"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="chart-card">
                <div className="chart-header">
                  <h3>Asset Distribution</h3>
                </div>
                <div className="pie-chart">
                  <div className="pie-segment segment-1" style={{ '--percentage': '32%' } as React.CSSProperties}>
                    <span className="segment-label">Real Estate</span>
                    <span className="segment-value">300K</span>
                  </div>
                  <div className="pie-segment segment-2" style={{ '--percentage': '16%' } as React.CSSProperties}>
                    <span className="segment-label">Mining</span>
                    <span className="segment-value">150K</span>
                  </div>
                  <div className="pie-segment segment-3" style={{ '--percentage': '52%' } as React.CSSProperties}>
                    <span className="segment-label">Infrastructure</span>
                    <span className="segment-value">500K</span>
                  </div>
                </div>
                <div className="chart-legend">
                  <div className="legend-item">
                    <span className="legend-color" style={{ background: 'var(--color-primary)' }}></span>
                    <span>Real Estate: 300,000 USDC</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color" style={{ background: '#30D158' }}></span>
                    <span>Mining: 150,000 USDC</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color" style={{ background: '#FFD60A' }}></span>
                    <span>Infrastructure: 500,000 USDC</span>
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

