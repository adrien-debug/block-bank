'use client'

import { useState } from 'react'
import DocumentIcon from '../icons/DocumentIcon'

type AssetType = 'real-estate' | 'vehicles' | 'objects' | 'overview'

export default function TermsAndConditions() {
  const [activeType, setActiveType] = useState<AssetType>('overview')

  const assetTypes = [
    { id: 'overview' as AssetType, label: 'Overview', icon: '📋' },
    { id: 'real-estate' as AssetType, label: 'Real Estate', icon: '🏢' },
    { id: 'vehicles' as AssetType, label: 'Vehicles', icon: '🚗' },
    { id: 'objects' as AssetType, label: 'Objects', icon: '📦' },
  ]

  return (
    <div className="terms-page">
      <div className="page-header">
        <div>
          <h1>Terms and Conditions</h1>
          <p className="page-subtitle">Complete legal framework for NFT RWA collateralized loans</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="terms-nav-menu">
        <nav className="sidebar-nav">
          {assetTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setActiveType(type.id)}
              className={`nav-item ${activeType === type.id ? 'active' : ''}`}
            >
              <span className="nav-icon" style={{ fontSize: '20px' }}>
                {type.icon}
              </span>
              <span className="nav-label">{type.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="terms-content">
        {activeType === 'overview' && <OverviewSection />}
        {activeType === 'real-estate' && <RealEstateSection />}
        {activeType === 'vehicles' && <VehiclesSection />}
        {activeType === 'objects' && <ObjectsSection />}
      </div>
    </div>
  )
}

function OverviewSection() {
  return (
    <div className="legal-overview-section">
      {/* Stats Grid - Jurisdictions */}
      <div className="stats-grid legal-stats-grid">
        <div className="stat-card stat-card-primary">
          <div className="stat-icon-wrapper">
            <div className="stat-icon" style={{ fontSize: '32px' }}>🇶🇦</div>
          </div>
          <div className="stat-content">
            <div className="stat-label">Qatar</div>
            <div className="stat-value">60-90 days</div>
            <div className="stat-subtitle">Recovery Time</div>
            <div className="stat-badge badge-a">Sharia Compliant</div>
          </div>
        </div>

        <div className="stat-card stat-card-success">
          <div className="stat-icon-wrapper">
            <div className="stat-icon" style={{ fontSize: '32px' }}>🇫🇷</div>
          </div>
          <div className="stat-content">
            <div className="stat-label">France</div>
            <div className="stat-value">6-12 months</div>
            <div className="stat-subtitle">Recovery Time</div>
            <div className="stat-badge badge-a">Civil Code (1804)</div>
          </div>
        </div>

        <div className="stat-card stat-card-info">
          <div className="stat-icon-wrapper">
            <div className="stat-icon" style={{ fontSize: '32px' }}>🇺🇸</div>
          </div>
          <div className="stat-content">
            <div className="stat-label">United States</div>
            <div className="stat-value">90-180 days</div>
            <div className="stat-subtitle">Recovery Time</div>
            <div className="stat-badge badge-a">UCC Article 9</div>
          </div>
        </div>

        <div className="stat-card stat-card-warning">
          <div className="stat-icon-wrapper">
            <div className="stat-icon" style={{ fontSize: '32px' }}>🇦🇪</div>
          </div>
          <div className="stat-content">
            <div className="stat-label">UAE</div>
            <div className="stat-value">45-90 days</div>
            <div className="stat-subtitle">Recovery Time</div>
            <div className="stat-badge badge-a">Federal Law</div>
          </div>
        </div>
      </div>

      {/* Wide Process Flow */}
      <div className="legal-process-wide">
        <h2 className="section-title-wide">Loan Lifecycle Process</h2>
        <div className="process-flow-wide">
          <div className="flow-step-wide">
            <div className="step-number-wide">1</div>
            <div className="step-content-wide">
              <h4>Asset Verification</h4>
              <p>Title verification, debt check, legal compliance</p>
              <span className="step-duration-wide">7-90 days</span>
            </div>
          </div>
          <div className="flow-connector-wide"></div>
          <div className="flow-step-wide">
            <div className="step-number-wide">2</div>
            <div className="step-content-wide">
              <h4>SPV Transfer</h4>
              <p>Asset transfer to SPV, NFT RWA issuance</p>
              <span className="step-duration-wide">1-7 days</span>
            </div>
          </div>
          <div className="flow-connector-wide"></div>
          <div className="flow-step-wide">
            <div className="step-number-wide">3</div>
            <div className="step-content-wide">
              <h4>Loan Activation</h4>
              <p>Smart contract deployment, collateral lock</p>
              <span className="step-duration-wide">Instant</span>
            </div>
          </div>
          <div className="flow-connector-wide"></div>
          <div className="flow-step-wide">
            <div className="step-number-wide">4</div>
            <div className="step-content-wide">
              <h4>Loan Management</h4>
              <p>Monthly payments, maintenance, monitoring</p>
              <span className="step-duration-wide">12-48 months</span>
            </div>
          </div>
          <div className="flow-connector-wide"></div>
          <div className="flow-step-wide">
            <div className="step-number-wide">5</div>
            <div className="step-content-wide">
              <h4>Completion/Default</h4>
              <p>Repayment or recovery process</p>
              <span className="step-duration-wide">20-180 days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Discount System Cards */}
      <div className="legal-discounts-wide">
        <h2 className="section-title-wide">NFT RWA Discount System</h2>
        <div className="discounts-grid-wide">
          <div className="discount-card-wide">
            <div className="discount-badge-wide">10%</div>
            <h3>Standard Discount</h3>
            <p>Applied for moderate risk NFTs</p>
            <div className="discount-details-wide">
              <div className="discount-detail-item">
                <span>LTV Adjustment</span>
                <span className="discount-value">-10%</span>
              </div>
              <div className="discount-detail-item">
                <span>Rate Adjustment</span>
                <span className="discount-value">Base</span>
              </div>
            </div>
          </div>

          <div className="discount-card-wide">
            <div className="discount-badge-wide">15%</div>
            <h3>Premium Discount</h3>
            <p>Applied for safe NFTs with good credit</p>
            <div className="discount-details-wide">
              <div className="discount-detail-item">
                <span>LTV Adjustment</span>
                <span className="discount-value">-15%</span>
              </div>
              <div className="discount-detail-item">
                <span>Rate Adjustment</span>
                <span className="discount-value">Base</span>
              </div>
            </div>
          </div>

          <div className="discount-card-wide">
            <div className="discount-badge-wide">20%</div>
            <h3>Maximum Discount</h3>
            <p>Applied for safe NFTs with excellent credit</p>
            <div className="discount-details-wide">
              <div className="discount-detail-item">
                <span>LTV Adjustment</span>
                <span className="discount-value">-20%</span>
              </div>
              <div className="discount-detail-item">
                <span>Rate Adjustment</span>
                <span className="discount-value">-0.5% APY</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Asset Types Overview */}
      <div className="legal-assets-wide">
        <h2 className="section-title-wide">Asset Types Coverage</h2>
        <div className="assets-grid-wide">
          <div className="asset-card-wide">
            <div className="asset-icon-wide">🏢</div>
            <h3>Real Estate</h3>
            <div className="asset-metrics">
              <div className="asset-metric">
                <span>LTV Range</span>
                <span>30-70%</span>
              </div>
              <div className="asset-metric">
                <span>Recovery Time</span>
                <span>60-180 days</span>
              </div>
              <div className="asset-metric">
                <span>Rate Range</span>
                <span>6-15% APY</span>
              </div>
            </div>
          </div>

          <div className="asset-card-wide">
            <div className="asset-icon-wide">🚗</div>
            <h3>Vehicles</h3>
            <div className="asset-metrics">
              <div className="asset-metric">
                <span>LTV Range</span>
                <span>30-70%</span>
              </div>
              <div className="asset-metric">
                <span>Recovery Time</span>
                <span>15-45 days</span>
              </div>
              <div className="asset-metric">
                <span>Rate Range</span>
                <span>7-16% APY</span>
              </div>
            </div>
          </div>

          <div className="asset-card-wide">
            <div className="asset-icon-wide">📦</div>
            <h3>Objects</h3>
            <div className="asset-metrics">
              <div className="asset-metric">
                <span>LTV Range</span>
                <span>20-60%</span>
              </div>
              <div className="asset-metric">
                <span>Recovery Time</span>
                <span>20-40 days</span>
              </div>
              <div className="asset-metric">
                <span>Rate Range</span>
                <span>8-17% APY</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function RealEstateSection() {
  return (
    <div className="terms-section">
      <div className="section-card">
        <h2>Real Estate Terms & Conditions</h2>
        
        <div className="terms-grid">
          <div className="term-card">
            <h3>📄 Title Acquisition</h3>
            <div className="term-details">
              <div className="term-item">
                <span className="term-label">Required Documents</span>
                <ul>
                  <li>Notarized sale deed</li>
                  <li>Property certificate</li>
                  <li>Cadastral plan</li>
                  <li>Debt-free certificate</li>
                </ul>
              </div>
              <div className="term-item">
                <span className="term-label">Verification Process</span>
                <ul>
                  <li>Title authenticity check</li>
                  <li>Debt and mortgage verification</li>
                  <li>Cadastral verification</li>
                  <li>Legal compliance check</li>
                </ul>
              </div>
              <div className="term-item">
                <span className="term-label">Timeline</span>
                <span className="term-value">30-90 days</span>
              </div>
            </div>
          </div>

          <div className="term-card">
            <h3>💰 Loan Conditions</h3>
            <div className="term-details">
              <div className="term-item">
                <span className="term-label">LTV by Credit Tier</span>
                <div className="ltv-table">
                  <div className="ltv-row">
                    <span>Tier A (800-1000)</span>
                    <span>60-70%</span>
                  </div>
                  <div className="ltv-row">
                    <span>Tier B (600-799)</span>
                    <span>50-60%</span>
                  </div>
                  <div className="ltv-row">
                    <span>Tier C (400-599)</span>
                    <span>40-50%</span>
                  </div>
                  <div className="ltv-row">
                    <span>Tier D (0-399)</span>
                    <span>30-40%</span>
                  </div>
                </div>
              </div>
              <div className="term-item">
                <span className="term-label">Interest Rates</span>
                <div className="rate-table">
                  <div className="rate-row">
                    <span>Tier A</span>
                    <span>6-8% APY</span>
                  </div>
                  <div className="rate-row">
                    <span>Tier B</span>
                    <span>8-10% APY</span>
                  </div>
                  <div className="rate-row">
                    <span>Tier C</span>
                    <span>10-12% APY</span>
                  </div>
                  <div className="rate-row">
                    <span>Tier D</span>
                    <span>12-15% APY</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="term-card">
            <h3>⚖️ Recovery Process</h3>
            <div className="recovery-process">
              <div className="process-step">
                <div className="process-number">1</div>
                <div className="process-content">
                  <h4>Default Trigger</h4>
                  <p>Payment delay &gt; 30 days</p>
                </div>
              </div>
              <div className="process-arrow">↓</div>
              <div className="process-step">
                <div className="process-number">2</div>
                <div className="process-content">
                  <h4>Notification</h4>
                  <p>15-30 days grace period</p>
                </div>
              </div>
              <div className="process-arrow">↓</div>
              <div className="process-step">
                <div className="process-number">3</div>
                <div className="process-content">
                  <h4>Legal Action</h4>
                  <p>Court filing, judgment</p>
                </div>
              </div>
              <div className="process-arrow">↓</div>
              <div className="process-step">
                <div className="process-number">4</div>
                <div className="process-content">
                  <h4>Eviction</h4>
                  <p>30 days after judgment</p>
                </div>
              </div>
              <div className="process-arrow">↓</div>
              <div className="process-step">
                <div className="process-number">5</div>
                <div className="process-content">
                  <h4>Sale</h4>
                  <p>Auction or private sale</p>
                </div>
              </div>
            </div>
            <div className="recovery-timeline">
              <div className="timeline-item">
                <span className="timeline-jurisdiction">Qatar</span>
                <span className="timeline-duration">60-90 days</span>
              </div>
              <div className="timeline-item">
                <span className="timeline-jurisdiction">France</span>
                <span className="timeline-duration">6-12 months</span>
              </div>
              <div className="timeline-item">
                <span className="timeline-jurisdiction">USA</span>
                <span className="timeline-duration">90-180 days</span>
              </div>
            </div>
          </div>

          <div className="term-card">
            <h3>💵 Fees & Costs</h3>
            <div className="fees-list">
              <div className="fee-item">
                <span className="fee-label">Initial Fees</span>
                <span className="fee-value">0.5-1% of loan amount</span>
              </div>
              <div className="fee-item">
                <span className="fee-label">Notary Fees</span>
                <span className="fee-value">2-5% of property value</span>
              </div>
              <div className="fee-item">
                <span className="fee-label">Registration</span>
                <span className="fee-value">0.5-2% of property value</span>
              </div>
              <div className="fee-item">
                <span className="fee-label">Recovery Costs</span>
                <span className="fee-value">$1,000-$5,000</span>
              </div>
              <div className="fee-item">
                <span className="fee-label">Eviction Costs</span>
                <span className="fee-value">$500-$2,000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function VehiclesSection() {
  return (
    <div className="terms-section">
      <div className="section-card">
        <h2>Vehicles Terms & Conditions</h2>
        
        <div className="terms-grid">
          <div className="term-card">
            <h3>📄 Title Acquisition</h3>
            <div className="term-details">
              <div className="term-item">
                <span className="term-label">Required Documents</span>
                <ul>
                  <li>Vehicle title certificate</li>
                  <li>Registration certificate</li>
                  <li>Debt-free certificate</li>
                  <li>Technical inspection (if required)</li>
                </ul>
              </div>
              <div className="term-item">
                <span className="term-label">Timeline</span>
                <span className="term-value">7-15 days</span>
              </div>
            </div>
          </div>

          <div className="term-card">
            <h3>💰 Loan Conditions</h3>
            <div className="term-details">
              <div className="term-item">
                <span className="term-label">LTV by Credit Tier</span>
                <div className="ltv-table">
                  <div className="ltv-row">
                    <span>Tier A</span>
                    <span>60-70%</span>
                  </div>
                  <div className="ltv-row">
                    <span>Tier B</span>
                    <span>50-60%</span>
                  </div>
                  <div className="ltv-row">
                    <span>Tier C</span>
                    <span>40-50%</span>
                  </div>
                  <div className="ltv-row">
                    <span>Tier D</span>
                    <span>30-40%</span>
                  </div>
                </div>
              </div>
              <div className="term-item">
                <span className="term-label">Interest Rates</span>
                <div className="rate-table">
                  <div className="rate-row">
                    <span>Tier A</span>
                    <span>7-9% APY</span>
                  </div>
                  <div className="rate-row">
                    <span>Tier B</span>
                    <span>9-11% APY</span>
                  </div>
                  <div className="rate-row">
                    <span>Tier C</span>
                    <span>11-13% APY</span>
                  </div>
                  <div className="rate-row">
                    <span>Tier D</span>
                    <span>13-16% APY</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="term-card">
            <h3>⚖️ Repossession Process</h3>
            <div className="recovery-process">
              <div className="process-step">
                <div className="process-number">1</div>
                <div className="process-content">
                  <h4>Default</h4>
                  <p>Payment delay &gt; 30 days</p>
                </div>
              </div>
              <div className="process-arrow">↓</div>
              <div className="process-step">
                <div className="process-number">2</div>
                <div className="process-content">
                  <h4>Notification</h4>
                  <p>8-15 days grace period</p>
                </div>
              </div>
              <div className="process-arrow">↓</div>
              <div className="process-step">
                <div className="process-number">3</div>
                <div className="process-content">
                  <h4>Repossession</h4>
                  <p>With or without court order</p>
                </div>
              </div>
              <div className="process-arrow">↓</div>
              <div className="process-step">
                <div className="process-number">4</div>
                <div className="process-content">
                  <h4>Storage</h4>
                  <p>10-30 days minimum</p>
                </div>
              </div>
              <div className="process-arrow">↓</div>
              <div className="process-step">
                <div className="process-number">5</div>
                <div className="process-content">
                  <h4>Sale</h4>
                  <p>Auction or private sale</p>
                </div>
              </div>
            </div>
            <div className="recovery-timeline">
              <div className="timeline-item">
                <span className="timeline-jurisdiction">Qatar</span>
                <span className="timeline-duration">15-30 days</span>
              </div>
              <div className="timeline-item">
                <span className="timeline-jurisdiction">France</span>
                <span className="timeline-duration">20-45 days</span>
              </div>
              <div className="timeline-item">
                <span className="timeline-jurisdiction">USA</span>
                <span className="timeline-duration">20-40 days</span>
              </div>
            </div>
          </div>

          <div className="term-card">
            <h3>💵 Fees & Costs</h3>
            <div className="fees-list">
              <div className="fee-item">
                <span className="fee-label">Initial Fees</span>
                <span className="fee-value">0.5-1% (max $500)</span>
              </div>
              <div className="fee-item">
                <span className="fee-label">Registration</span>
                <span className="fee-value">$50-$200</span>
              </div>
              <div className="fee-item">
                <span className="fee-label">Repossession</span>
                <span className="fee-value">$200-$800</span>
              </div>
              <div className="fee-item">
                <span className="fee-label">Storage</span>
                <span className="fee-value">$50-$200/day</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ObjectsSection() {
  return (
    <div className="terms-section">
      <div className="section-card">
        <h2>Objects & Movable Assets Terms & Conditions</h2>
        
        <div className="terms-grid">
          <div className="term-card">
            <h3>📄 Title Acquisition</h3>
            <div className="term-details">
              <div className="term-item">
                <span className="term-label">Required Documents</span>
                <ul>
                  <li>Purchase invoice</li>
                  <li>Authenticity certificate</li>
                  <li>Detailed inventory with photos</li>
                  <li>Debt-free verification</li>
                </ul>
              </div>
              <div className="term-item">
                <span className="term-label">Timeline</span>
                <span className="term-value">1-7 days</span>
              </div>
            </div>
          </div>

          <div className="term-card">
            <h3>💰 Loan Conditions</h3>
            <div className="term-details">
              <div className="term-item">
                <span className="term-label">LTV by Credit Tier</span>
                <div className="ltv-table">
                  <div className="ltv-row">
                    <span>Tier A</span>
                    <span>50-60%</span>
                  </div>
                  <div className="ltv-row">
                    <span>Tier B</span>
                    <span>40-50%</span>
                  </div>
                  <div className="ltv-row">
                    <span>Tier C</span>
                    <span>30-40%</span>
                  </div>
                  <div className="ltv-row">
                    <span>Tier D</span>
                    <span>20-30%</span>
                  </div>
                </div>
              </div>
              <div className="term-item">
                <span className="term-label">Interest Rates</span>
                <div className="rate-table">
                  <div className="rate-row">
                    <span>Tier A</span>
                    <span>8-10% APY</span>
                  </div>
                  <div className="rate-row">
                    <span>Tier B</span>
                    <span>10-12% APY</span>
                  </div>
                  <div className="rate-row">
                    <span>Tier C</span>
                    <span>12-14% APY</span>
                  </div>
                  <div className="rate-row">
                    <span>Tier D</span>
                    <span>14-17% APY</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="term-card">
            <h3>⚖️ Seizure Process</h3>
            <div className="recovery-process">
              <div className="process-step">
                <div className="process-number">1</div>
                <div className="process-content">
                  <h4>Default</h4>
                  <p>Payment delay &gt; 30 days</p>
                </div>
              </div>
              <div className="process-arrow">↓</div>
              <div className="process-step">
                <div className="process-number">2</div>
                <div className="process-content">
                  <h4>Notification</h4>
                  <p>5-10 days grace period</p>
                </div>
              </div>
              <div className="process-arrow">↓</div>
              <div className="process-step">
                <div className="process-number">3</div>
                <div className="process-content">
                  <h4>Seizure</h4>
                  <p>Voluntary or forced</p>
                </div>
              </div>
              <div className="process-arrow">↓</div>
              <div className="process-step">
                <div className="process-number">4</div>
                <div className="process-content">
                  <h4>Storage</h4>
                  <p>Secure storage facility</p>
                </div>
              </div>
              <div className="process-arrow">↓</div>
              <div className="process-step">
                <div className="process-number">5</div>
                <div className="process-content">
                  <h4>Sale</h4>
                  <p>Auction or private sale</p>
                </div>
              </div>
            </div>
            <div className="recovery-timeline">
              <div className="timeline-item">
                <span className="timeline-jurisdiction">Standard</span>
                <span className="timeline-duration">20-40 days</span>
              </div>
            </div>
          </div>

          <div className="term-card">
            <h3>📦 Asset-Specific Terms</h3>
            <div className="asset-types">
              <div className="asset-type-item">
                <h4>Mining Equipment</h4>
                <p>Rapid depreciation (20-30% per year)</p>
                <p>Max LTV: 40-50%, Max Duration: 24 months</p>
              </div>
              <div className="asset-type-item">
                <h4>Industrial Machines</h4>
                <p>Regular maintenance required</p>
                <p>Max LTV: Standard, Max Duration: 36 months</p>
              </div>
              <div className="asset-type-item">
                <h4>Collectibles</h4>
                <p>Stable or growing value</p>
                <p>Max LTV: 60-70%, Max Duration: 48 months</p>
              </div>
              <div className="asset-type-item">
                <h4>Precious Metals</h4>
                <p>Market-linked value</p>
                <p>Max LTV: 50-70%, Max Duration: 36 months</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

