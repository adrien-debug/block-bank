'use client'

import { useState, useEffect } from 'react'
import { formatNumber, formatDateLong } from '@/lib/utils'
import ActivityFeed from '@/components/dashboard/ActivityFeed'
import AlertsPanel from '@/components/dashboard/AlertsPanel'
import StatCard from '@/components/ui/StatCard'
import ChartIcon from '@/components/icons/ChartIcon'
import MoneyIcon from '@/components/icons/MoneyIcon'
import NFTIcon from '@/components/icons/NFTIcon'
import ShieldIcon from '@/components/icons/ShieldIcon'

export default function DashboardPage() {
  const [chartTimeRange, setChartTimeRange] = useState<'1M' | '6M' | '12M' | 'All'>('All')
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null)
  const [hoveredSegmentIndex, setHoveredSegmentIndex] = useState<number | null>(null)
  const [chartLoaded, setChartLoaded] = useState(false)

  useEffect(() => {
    setChartLoaded(false)
    const timer = setTimeout(() => setChartLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Données pour différents périodes
  const scoreDataByPeriod = {
    '1M': [745, 748, 750],
    '6M': [680, 690, 700, 710, 720, 730, 738, 745, 750],
    '12M': [650, 665, 680, 690, 700, 710, 720, 730, 738, 745, 750],
    'All': [600, 620, 640, 660, 680, 700, 720, 735, 745, 748, 750]
  }

  return (
    <div className="dashboard-overview">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
        </div>
        <div className="dashboard-date">
          {formatDateLong(new Date())}
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
          label="RWA Tokens"
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
                        <stop offset="0%" stopColor="#2563EB" />
                        <stop offset="50%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#60A5FA" />
                      </linearGradient>
                      <linearGradient id="barGradientHover" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#1D4ED8" />
                        <stop offset="50%" stopColor="#2563EB" />
                        <stop offset="100%" stopColor="#3B82F6" />
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
                const assets = [
                  { name: 'Real Estate', value: 300000, color: '#1E40AF' },
                  { name: 'Mining', value: 150000, color: '#3B82F6' },
                  { name: 'Infrastructure', value: 500000, color: '#2563EB' },
                  { name: 'Vehicles', value: 50000, color: '#60A5FA' },
                  { name: 'Collectibles', value: 25000, color: '#93C5FD' }
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
                          let gradientColors: { start: string; end: string } = { start: segment.color, end: segment.color }
                          if (segment.color === '#1E40AF') {
                            gradientColors = { start: '#1E40AF', end: '#2563EB' }
                          } else if (segment.color === '#2563EB') {
                            gradientColors = { start: '#2563EB', end: '#3B82F6' }
                          } else if (segment.color === '#3B82F6') {
                            gradientColors = { start: '#3B82F6', end: '#60A5FA' }
                          } else if (segment.color === '#60A5FA') {
                            gradientColors = { start: '#60A5FA', end: '#93C5FD' }
                          } else if (segment.color === '#93C5FD') {
                            gradientColors = { start: '#93C5FD', end: '#DBEAFE' }
                          } else {
                            gradientColors = { start: segment.color, end: '#3B82F6' }
                          }
                          return (
                            <linearGradient key={index} id={`gradient-all-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor={gradientColors.start} stopOpacity="1" />
                              <stop offset="50%" stopColor={gradientColors.start} stopOpacity="0.95" />
                              <stop offset="100%" stopColor={gradientColors.end} stopOpacity="0.85" />
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
                              filter: isHovered ? 'drop-shadow(0 4px 12px rgba(37, 99, 235, 0.4))' : 'drop-shadow(0 2px 6px rgba(37, 99, 235, 0.2))',
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
                        {formatNumber(total)}
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
                            <span className="legend-value-premium">{formatNumber(segment.value)} USDC</span>
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
  )
}

