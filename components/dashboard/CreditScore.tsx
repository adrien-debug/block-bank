'use client'

import { useState } from 'react'

export default function CreditScore() {
  const score = 750
  const tier = 'A'
  const previousScore = 738
  const scoreChange = score - previousScore
  
  const scoreBreakdown = {
    onChain: { 
      value: 280, 
      max: 300, 
      label: 'On-Chain Behavioral',
      percentage: 93,
      details: [
        { label: 'Transaction volume', value: 95, status: 'excellent' },
        { label: 'Wallet history', value: 88, status: 'good' },
        { label: 'Asset diversity', value: 92, status: 'excellent' },
        { label: 'DeFi activity', value: 85, status: 'good' },
      ]
    },
    offChain: { 
      value: 250, 
      max: 300, 
      label: 'Off-Chain Financial',
      percentage: 83,
      details: [
        { label: 'Stable income', value: 90, status: 'excellent' },
        { label: 'Debt-to-income ratio', value: 75, status: 'good' },
        { label: 'Banking history', value: 88, status: 'good' },
        { label: 'Professional stability', value: 85, status: 'good' },
      ]
    },
    assets: { 
      value: 150, 
      max: 200, 
      label: 'Asset-Based',
      percentage: 75,
      details: [
        { label: 'Total NFT RWA value', value: 80, status: 'good' },
        { label: 'Available liquidity', value: 70, status: 'average' },
        { label: 'Asset diversification', value: 75, status: 'good' },
        { label: 'Collateral quality', value: 85, status: 'good' },
      ]
    },
    reputation: { 
      value: 70, 
      max: 100, 
      label: 'Reputation & Trust',
      percentage: 70,
      details: [
        { label: 'On-chain reputation', value: 75, status: 'good' },
        { label: 'Payment history', value: 100, status: 'excellent' },
        { label: 'References', value: 60, status: 'average' },
        { label: 'KYC verifications', value: 90, status: 'excellent' },
      ]
    },
  }

  const scoreHistory = {
    '1m': [745, 748, 750],
    '6m': [680, 690, 700, 710, 720, 730, 738, 745, 750],
    '12m': [650, 665, 680, 690, 700, 710, 720, 730, 738, 745, 750],
    'all': [600, 620, 640, 660, 680, 690, 700, 710, 720, 730, 738, 745, 750],
  }

  const recommendations = [
    {
      title: 'Increase available liquidity',
      description: 'Maintaining at least 50,000 USDC in liquidity would improve your Asset-Based score by 5 points',
      impact: '+5 points',
      priority: 'high'
    },
    {
      title: 'Diversify your NFT RWA assets',
      description: 'Adding an infrastructure-type asset would increase your diversification',
      impact: '+3 points',
      priority: 'medium'
    },
    {
      title: 'Improve DeFi activity',
      description: 'Participating in more DeFi protocols would strengthen your on-chain profile',
      impact: '+2 points',
      priority: 'low'
    }
  ]

  const tierInfo = {
    A: { 
      ltv: '60-70%', 
      rate: '6.5-8.5%', 
      maxAmount: '1,000,000 USDC',
      benefits: ['Preferential rates', 'High LTV', 'Accelerated process', 'Priority support']
    },
    B: { ltv: '50-60%', rate: '8.5-10.5%', maxAmount: '500,000 USDC', benefits: [] },
    C: { ltv: '40-50%', rate: '10.5-12.5%', maxAmount: '250,000 USDC', benefits: [] },
  }

  const currentTier = tierInfo[tier as keyof typeof tierInfo]

  return (
    <div className="credit-score-page">
      <div className="score-page-header">
        <div>
          <h1>My Credit Score</h1>
          <p className="score-page-subtitle">Transparent and auditable hybrid on-chain/off-chain score</p>
        </div>
        <div className="score-header-actions">
          <button className="btn-secondary">Export report</button>
          <button className="btn-primary">Update</button>
        </div>
      </div>

      {/* Main score with evolution */}
      <div className="score-display-enhanced">
        <div className="score-circle-wrapper">
          <div className="score-circle">
            <div className="score-value">{score}</div>
            <div className="score-tier">Tier {tier}</div>
            <div className="score-change">
              {scoreChange > 0 ? '↑' : '↓'} {Math.abs(scoreChange)} points
            </div>
          </div>
          <div className="score-comparison">
            <div className="comparison-item">
              <span className="comparison-label">User average</span>
              <span className="comparison-value">685</span>
            </div>
            <div className="comparison-item">
              <span className="comparison-label">Top 10%</span>
              <span className="comparison-value">780+</span>
            </div>
          </div>
        </div>
        
        <div className="score-info-enhanced">
          <div className="score-badges">
            <div className="score-badge badge-a">Tier {tier} • Excellent</div>
            <div className="score-trend-badge trend-up">
              <span>↑ +{scoreChange}</span>
              <span>vs last month</span>
            </div>
          </div>
          
          <div className="score-benefits">
            <h3>Benefits of your score</h3>
            <div className="benefits-grid">
              {currentTier.benefits && currentTier.benefits.map((benefit: string, index: number) => (
                <div key={index} className="benefit-item">
                  <span className="benefit-icon">✓</span>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="score-conditions">
            <div className="condition-item">
              <span className="condition-label">Maximum LTV</span>
              <span className="condition-value">{currentTier.ltv}</span>
            </div>
            <div className="condition-item">
              <span className="condition-label">Interest rate</span>
              <span className="condition-value">{currentTier.rate}</span>
            </div>
            <div className="condition-item">
              <span className="condition-label">Maximum amount</span>
              <span className="condition-value">{currentTier.maxAmount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Evolution chart */}
      <div className="score-chart-section">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Credit Score Evolution</h3>
          </div>
          <div className="chart-container-enhanced">
            <div className="line-chart-enhanced">
              {scoreHistory.all.map((value, index, array) => {
                const maxValue = Math.max(...array)
                const minValue = Math.min(...array)
                const range = maxValue - minValue
                const percentage = ((value - minValue) / range) * 100
                const left = (index / (array.length - 1)) * 100
                
                return (
                  <div key={index} className="chart-point-enhanced" style={{ 
                    left: `${left}%`,
                    bottom: `${percentage}%`
                  }}>
                    <div className="point-tooltip">{value}</div>
                    <div className="point-dot-enhanced"></div>
                  </div>
                )
              })}
              <svg className="chart-line-enhanced" viewBox="0 0 1000 300">
                <defs>
                  <linearGradient id="scoreLineGradient-all" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0A84FF" />
                    <stop offset="50%" stopColor="#60A5FA" />
                    <stop offset="100%" stopColor="#0A84FF" />
                  </linearGradient>
                  <linearGradient id="scoreGradient-all" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#0A84FF" stopOpacity="0.4" />
                    <stop offset="50%" stopColor="#409CFF" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#0A84FF" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path 
                  d={`M ${scoreHistory.all.map((value, index, array) => {
                    const maxValue = Math.max(...array)
                    const minValue = Math.min(...array)
                    const range = maxValue - minValue
                    const percentage = ((value - minValue) / range) * 100
                    const x = (index / (array.length - 1)) * 1000
                    const y = 300 - (percentage / 100) * 300
                    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
                  }).join(' ')}`}
                  stroke="url(#scoreLineGradient-all)"
                  fill="none"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path 
                  d={`M ${scoreHistory.all.map((value, index, array) => {
                    const maxValue = Math.max(...array)
                    const minValue = Math.min(...array)
                    const range = maxValue - minValue
                    const percentage = ((value - minValue) / range) * 100
                    const x = (index / (array.length - 1)) * 1000
                    const y = 300 - (percentage / 100) * 300
                    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
                  }).join(' ')} L 1000 300 L 0 300 Z`}
                  fill="url(#scoreGradient-all)"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Score breakdown by component */}
      <div className="score-breakdown-enhanced">
        <h2>Score breakdown by component</h2>
        <div className="breakdown-grid-enhanced">
          {Object.entries(scoreBreakdown).map(([key, data]) => (
            <div key={key} className="breakdown-card">
              <div className="breakdown-card-header">
                <div>
                  <h4>{data.label}</h4>
                  <div className="breakdown-percentage">{data.percentage}%</div>
                </div>
                <div className="breakdown-score">
                  <span className="score-current">{data.value}</span>
                  <span className="score-max">/{data.max}</span>
                </div>
              </div>
              
              <div className="breakdown-bar-enhanced">
                <div 
                  className="breakdown-fill-enhanced"
                  style={{ width: `${data.percentage}%` }}
                />
              </div>

              <div className="breakdown-details">
                {data.details.map((detail, index) => (
                  <div key={index} className="detail-row">
                    <div className="detail-info">
                      <span className="detail-name">{detail.label}</span>
                      <span className={`detail-status status-${detail.status}`}>
                        {detail.status === 'excellent' ? 'Excellent' : 
                         detail.status === 'good' ? 'Good' : 'Average'}
                      </span>
                    </div>
                    <div className="detail-bar-mini">
                      <div 
                        className="detail-bar-fill"
                        style={{ width: `${detail.value}%` }}
                      />
                    </div>
                    <span className="detail-value">{detail.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="score-recommendations">
        <h2>Recommendations to improve your score</h2>
        <div className="recommendations-grid">
          {recommendations.map((rec, index) => (
            <div key={index} className={`recommendation-card priority-${rec.priority}`}>
              <div className="recommendation-header">
                <div className="recommendation-icon">
                  {rec.priority === 'high' ? '🔥' : rec.priority === 'medium' ? '⚡' : '💡'}
                </div>
                <div className="recommendation-impact">{rec.impact}</div>
              </div>
              <h4>{rec.title}</h4>
              <p>{rec.description}</p>
              <button className="btn-secondary btn-small">Learn more</button>
            </div>
          ))}
        </div>
      </div>

      {/* Change history */}
      <div className="score-history">
        <h2>Change history</h2>
        <div className="history-timeline">
          <div className="history-item">
            <div className="history-date">Jan 15, 2024</div>
            <div className="history-content">
              <div className="history-title">Score updated</div>
              <div className="history-details">+12 points • On-Chain Behavioral improvement</div>
            </div>
            <div className="history-score">750</div>
          </div>
          <div className="history-item">
            <div className="history-date">Jan 1, 2024</div>
            <div className="history-content">
              <div className="history-title">New NFT RWA added</div>
              <div className="history-details">+8 points • Asset-Based improved</div>
            </div>
            <div className="history-score">738</div>
          </div>
          <div className="history-item">
            <div className="history-date">Dec 15, 2023</div>
            <div className="history-content">
              <div className="history-title">Payment made on time</div>
              <div className="history-details">+5 points • Reputation improved</div>
            </div>
            <div className="history-score">730</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="score-actions-enhanced">
        <button className="btn-primary">Update my score</button>
        <button className="btn-secondary">View full history</button>
        <button className="btn-ghost">Download PDF report</button>
      </div>
    </div>
  )
}
