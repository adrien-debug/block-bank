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

declare global {
  interface Window {
    ethereum?: any
  }
}

type Tab = 'dashboard' | 'explore' | 'credit-score' | 'loans' | 'nft' | 'insurance' | 'profile' | 'investor'

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
    { id: 'loans' as Tab, label: 'Mes Prêts', icon: MoneyIcon },
    { id: 'nft' as Tab, label: 'NFT RWA', icon: NFTIcon },
    { id: 'insurance' as Tab, label: 'Assurance', icon: ShieldIcon },
    { id: 'investor' as Tab, label: 'Investor', icon: InvestorIcon },
    { id: 'profile' as Tab, label: 'Profil', icon: UserIcon },
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
                <h1>Tableau de bord</h1>
                <p className="dashboard-subtitle">Vue d&apos;ensemble de votre activité</p>
              </div>
              <div className="dashboard-date">
                {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
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
                    <span className="trend-period">vs mois dernier</span>
                  </div>
                  <div className="stat-badge badge-a">Tranche A • Excellent</div>
                </div>
              </div>
              
              <div className="stat-card stat-card-success">
                <div className="stat-icon-wrapper">
                  <div className="stat-icon">
                    <MoneyIcon />
                  </div>
                </div>
                <div className="stat-content">
                  <div className="stat-label">Prêts actifs</div>
                  <div className="stat-value">2</div>
                  <div className="stat-subtitle">150,000 USDC</div>
                  <div className="stat-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: '65%' }}></div>
                    </div>
                    <span className="progress-text">65% LTV moyen</span>
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
                  <div className="stat-subtitle">Valeur totale: 950,000 USDC</div>
                  <div className="stat-breakdown">
                    <span>2 verrouillés</span>
                    <span>•</span>
                    <span>1 disponible</span>
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
                  <div className="stat-label">Assurance</div>
                  <div className="stat-value">Actif</div>
                  <div className="stat-subtitle">Couverture: 80%</div>
                  <div className="stat-info">Prime: 1,200 USDC/mois</div>
                </div>
              </div>
            </div>

            {/* Graphiques et visualisations */}
            <div className="dashboard-charts">
              <div className="chart-card">
                <div className="chart-header">
                  <h3>Évolution du Credit Score</h3>
                  <select className="chart-period">
                    <option>6 mois</option>
                    <option>12 mois</option>
                    <option>Tout</option>
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
                  <h3>Répartition des actifs</h3>
                </div>
                <div className="pie-chart">
                  <div className="pie-segment segment-1" style={{ '--percentage': '32%' } as React.CSSProperties}>
                    <span className="segment-label">Immobilier</span>
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
                    <span>Immobilier: 300,000 USDC</span>
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
                  <h3>Activité récente</h3>
                  <button className="btn-ghost">Voir tout</button>
                </div>
                <div className="activity-list">
                  <div className="activity-item">
                    <div className="activity-icon activity-success">
                      <CheckIcon />
                    </div>
                    <div className="activity-content">
                      <div className="activity-title">Paiement reçu</div>
                      <div className="activity-desc">Prêt #1 - 15,000 USDC</div>
                      <div className="activity-time">Il y a 2 heures</div>
                    </div>
                    <div className="activity-amount">+15,000 USDC</div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon activity-info">
                      <ChartIcon />
                    </div>
                    <div className="activity-content">
                      <div className="activity-title">Score mis à jour</div>
                      <div className="activity-desc">Credit Score: 750 (+12)</div>
                      <div className="activity-time">Il y a 1 jour</div>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon activity-warning">
                      <LockIcon />
                    </div>
                    <div className="activity-content">
                      <div className="activity-title">NFT verrouillé</div>
                      <div className="activity-desc">Villa Paris - Prêt #1</div>
                      <div className="activity-time">Il y a 3 jours</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="alerts-card">
                <div className="alerts-header">
                  <h3>Alertes & notifications</h3>
                  <span className="alerts-badge">2</span>
                </div>
                <div className="alerts-list">
                  <div className="alert-item alert-important">
                    <div className="alert-icon">
                      <WarningIcon />
                    </div>
                    <div className="alert-content">
                      <div className="alert-title">Paiement à venir</div>
                      <div className="alert-desc">Prêt #2 - Échéance dans 5 jours</div>
                    </div>
                    <button className="alert-action">Payer</button>
                  </div>
                  <div className="alert-item alert-info">
                    <div className="alert-icon">
                      <InfoIcon />
                    </div>
                    <div className="alert-content">
                      <div className="alert-title">Assurance renouvelée</div>
                      <div className="alert-desc">Couverture active jusqu&apos;au 15/03/2024</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Métriques de performance */}
            <div className="performance-metrics">
              <div className="metric-card">
                <div className="metric-header">
                  <h3>Performance globale</h3>
                </div>
                <div className="metric-grid">
                  <div className="metric-item">
                    <div className="metric-label">Taux d&apos;utilisation</div>
                    <div className="metric-value-large">65%</div>
                    <div className="metric-bar">
                      <div className="metric-bar-fill" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                  <div className="metric-item">
                    <div className="metric-label">Paiements à temps</div>
                    <div className="metric-value-large">100%</div>
                    <div className="metric-badge-success">Parfait</div>
                  </div>
                  <div className="metric-item">
                    <div className="metric-label">Valeur totale</div>
                    <div className="metric-value-large">950K USDC</div>
                    <div className="metric-trend-up">+5% ce mois</div>
                  </div>
                </div>
              </div>

              <div className="quick-actions-card">
                <div className="quick-actions-header">
                  <h3>Actions rapides</h3>
                </div>
                <div className="quick-actions-grid">
                  <button className="quick-action-btn">
                    <div className="quick-action-icon">
                      <MoneyIcon />
                    </div>
                    <div className="quick-action-label">Nouveau prêt</div>
                  </button>
                  <button className="quick-action-btn">
                    <div className="quick-action-icon">
                      <NFTIcon />
                    </div>
                    <div className="quick-action-label">Tokeniser actif</div>
                  </button>
                  <button className="quick-action-btn">
                    <div className="quick-action-icon">
                      <ChartIcon />
                    </div>
                    <div className="quick-action-label">Mettre à jour score</div>
                  </button>
                  <button className="quick-action-btn">
                    <div className="quick-action-icon">
                      <ShieldIcon />
                    </div>
                    <div className="quick-action-label">Gérer assurance</div>
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
      </div>
    </div>
  )
}

