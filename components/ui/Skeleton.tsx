'use client'

import React from 'react'

interface SkeletonProps {
  width?: string | number
  height?: string | number
  borderRadius?: string
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  style?: React.CSSProperties
}

export default function Skeleton({
  width,
  height,
  borderRadius,
  className = '',
  variant = 'rectangular',
  style,
}: SkeletonProps) {
  const variantStyles: Record<string, React.CSSProperties> = {
    text: {
      width: width || '100%',
      height: height || '1em',
      borderRadius: borderRadius || '4px',
    },
    circular: {
      width: width || '40px',
      height: height || width || '40px',
      borderRadius: '50%',
    },
    rectangular: {
      width: width || '100%',
      height: height || '100%',
      borderRadius: borderRadius || '8px',
    },
  }

  return (
    <div
      className={`skeleton ${className}`}
      style={{ ...variantStyles[variant], ...style }}
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Chargement...</span>
    </div>
  )
}

// Composant spécialisé pour StatCard
export function StatCardSkeleton() {
  return (
    <div className="stat-card skeleton-card">
      <div className="stat-icon-wrapper">
        <Skeleton variant="circular" width="48px" height="48px" />
      </div>
      <div className="stat-content">
        <Skeleton variant="text" width="60%" height="14px" />
        <Skeleton variant="text" width="40%" height="32px" style={{ marginTop: '8px' }} />
        <Skeleton variant="text" width="50%" height="12px" style={{ marginTop: '8px' }} />
      </div>
    </div>
  )
}

// Composant spécialisé pour Chart Card
export function ChartCardSkeleton() {
  return (
    <div className="chart-card-premium skeleton-card">
      <div className="chart-header-premium">
        <Skeleton variant="text" width="200px" height="24px" />
      </div>
      <div className="chart-container-premium">
        <Skeleton variant="rectangular" width="100%" height="300px" />
      </div>
    </div>
  )
}

// Composant spécialisé pour Activity Item
export function ActivityItemSkeleton() {
  return (
    <div className="activity-item skeleton-item">
      <Skeleton variant="circular" width="40px" height="40px" />
      <div className="activity-content" style={{ flex: 1 }}>
        <Skeleton variant="text" width="70%" height="14px" />
        <Skeleton variant="text" width="50%" height="12px" style={{ marginTop: '4px' }} />
      </div>
    </div>
  )
}

