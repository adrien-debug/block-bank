'use client'

import { useState } from 'react'
import ShieldIcon from '../icons/ShieldIcon'
import InfoIcon from '../icons/InfoIcon'
import ChartIcon from '../icons/ChartIcon'
import WarningIcon from '../icons/WarningIcon'

type InsuranceTab = 'policies' | 'coverage' | 'claims' | 'history'

export default function Insurance() {
  const [activeTab, setActiveTab] = useState<InsuranceTab>('policies')

  const insurancePolicies = [
    {
      id: 1,
      loanId: 'Loan #1',
      coverage: '80%',
      premium: '2,400',
      currency: 'USDC',
      period: 'Annual',
      status: 'active',
      risks: ['Borrower default', 'Market risk'],
    },
    {
      id: 2,
      loanId: 'Loan #2',
      coverage: '75%',
      premium: '1,200',
      currency: 'USDC',
      period: 'Annual',
      status: 'active',
      risks: ['Borrower default'],
    },
  ]

  const tabs = [
    { id: 'policies' as InsuranceTab, label: 'Active Policies', icon: ShieldIcon },
    { id: 'coverage' as InsuranceTab, label: 'Coverage Options', icon: InfoIcon },
    { id: 'claims' as InsuranceTab, label: 'Claims', icon: WarningIcon },
    { id: 'history' as InsuranceTab, label: 'History', icon: ChartIcon },
  ]

  return (
    <div className="insurance-page">
      <div className="page-header">
        <div>
          <h1>My Insurance</h1>
          <p className="page-subtitle">Manage your insurance policies and coverage</p>
        </div>
      </div>

      {/* Navigation Menu with Dashboard Style */}
      <div className="insurance-nav-menu">
        <nav className="sidebar-nav">
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
      
      <div className="insurance-summary">
        <div className="summary-card">
          <div className="summary-label">Total coverage</div>
          <div className="summary-value">155%</div>
          <div className="summary-subtitle">of loan value</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Annual premium</div>
          <div className="summary-value">3,600 USDC</div>
          <div className="summary-subtitle">Across 2 policies</div>
        </div>
      </div>

      {activeTab === 'policies' && (
        <div className="insurance-policies">
          <h2>Active policies</h2>
          {insurancePolicies.map((policy) => (
          <div key={policy.id} className="policy-card">
            <div className="policy-header">
              <h3>{policy.loanId}</h3>
              <span className={`policy-status ${policy.status}`}>Active</span>
            </div>
            <div className="policy-details">
              <div className="detail-row">
                <span className="detail-label">Coverage</span>
                <span className="detail-value">{policy.coverage}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">{policy.period} premium</span>
                <span className="detail-value">{policy.premium} {policy.currency}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Covered risks</span>
                <div className="risks-list">
                  {policy.risks.map((risk, idx) => (
                    <span key={idx} className="risk-badge">{risk}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="policy-actions">
              <button className="btn-secondary">View details</button>
              <button className="btn-primary">Renew</button>
            </div>
          </div>
        ))}
        </div>
      )}

      {activeTab === 'coverage' && (
        <div className="insurance-coverage">
          <h2>Coverage Options</h2>
          <div className="coverage-options-grid">
            <div className="coverage-card">
              <h3>Borrower Default Coverage</h3>
              <p>Protection against borrower payment defaults</p>
              <div className="coverage-levels">
                <span className="coverage-badge">50%</span>
                <span className="coverage-badge">75%</span>
                <span className="coverage-badge active">100%</span>
              </div>
            </div>
            <div className="coverage-card">
              <h3>Market Risk Coverage</h3>
              <p>Protection against market volatility</p>
              <div className="coverage-levels">
                <span className="coverage-badge">0%</span>
                <span className="coverage-badge">50%</span>
                <span className="coverage-badge">75%</span>
              </div>
            </div>
            <div className="coverage-card">
              <h3>Asset Risk Coverage</h3>
              <p>Protection against asset devaluation</p>
              <div className="coverage-levels">
                <span className="coverage-badge">0%</span>
                <span className="coverage-badge">50%</span>
                <span className="coverage-badge">75%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'claims' && (
        <div className="insurance-claims">
          <h2>Claims</h2>
          <div className="claims-empty">
            <p>No active claims</p>
            <button className="btn-primary">File a claim</button>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="insurance-history">
          <h2>Policy History</h2>
          <div className="history-list">
            <div className="history-item">
              <div className="history-date">2024-01-15</div>
              <div className="history-action">Policy renewed - Loan #1</div>
              <div className="history-amount">+2,400 USDC</div>
            </div>
            <div className="history-item">
              <div className="history-date">2023-12-01</div>
              <div className="history-action">Policy created - Loan #2</div>
              <div className="history-amount">+1,200 USDC</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
