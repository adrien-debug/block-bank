'use client'

import React from 'react'

interface StatCardProps {
  icon?: React.ReactNode
  label: string
  value: string | number
  subtitle?: string
  trend?: {
    value: string
    isPositive: boolean
    period?: string
  }
  badge?: {
    text: string
    variant?: 'primary' | 'success' | 'warning' | 'info'
  }
  progress?: {
    value: number
    label?: string
  }
  breakdown?: string[]
  extraInfo?: string
  variant?: 'primary' | 'success' | 'info' | 'warning'
  className?: string
}

export default function StatCard({
  icon,
  label,
  value,
  subtitle,
  trend,
  badge,
  progress,
  breakdown,
  extraInfo,
  variant = 'primary',
  className = '',
}: StatCardProps) {
  const variantClasses = {
    primary: 'stat-card-primary',
    success: 'stat-card-success',
    info: 'stat-card-info',
    warning: 'stat-card-warning',
  }

  const badgeVariantClasses = {
    primary: 'badge-a',
    success: 'badge-success',
    warning: 'badge-warning',
    info: 'badge-info',
  }

  return (
    <div className={`stat-card ${variantClasses[variant]} ${className}`}>
      {icon && (
        <div className="stat-icon-wrapper">
          <div className="stat-icon">{icon}</div>
        </div>
      )}
      <div className="stat-content">
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
        {subtitle && <div className="stat-subtitle">{subtitle}</div>}
        {trend && (
          <div className="stat-trend">
            <span className={trend.isPositive ? 'trend-up' : 'trend-down'}>
              {trend.isPositive ? '↑' : '↓'} {trend.value}
            </span>
            {trend.period && <span className="trend-period">{trend.period}</span>}
          </div>
        )}
        {badge && (
          <div className={`stat-badge ${badgeVariantClasses[badge.variant || 'primary']}`}>
            {badge.text}
          </div>
        )}
        {progress && (
          <div className="stat-progress">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${Math.min(100, Math.max(0, progress.value))}%` }}
              />
            </div>
            {progress.label && <span className="progress-text">{progress.label}</span>}
          </div>
        )}
        {breakdown && breakdown.length > 0 && (
          <div className="stat-breakdown">
            {breakdown.map((item, index) => (
              <React.Fragment key={index}>
                <span>{item}</span>
                {index < breakdown.length - 1 && <span>•</span>}
              </React.Fragment>
            ))}
          </div>
        )}
        {extraInfo && <div className="stat-extra-info">{extraInfo}</div>}
      </div>
    </div>
  )
}

