'use client'

import React from 'react'
import WarningIcon from '../icons/WarningIcon'
import InfoIcon from '../icons/InfoIcon'
import LockIcon from '../icons/LockIcon'

interface AlertItem {
  id: string
  type: 'important' | 'info' | 'warning'
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  icon?: React.ReactNode
}

interface AlertsPanelProps {
  alerts?: AlertItem[]
  className?: string
}

const defaultAlerts: AlertItem[] = [
  {
    id: '1',
    type: 'important',
    title: 'Upcoming payment',
    description: 'Loan #2 - Due in 5 days',
    action: {
      label: 'Pay',
      onClick: () => console.log('Pay clicked'),
    },
    icon: <WarningIcon />,
  },
  {
    id: '2',
    type: 'info',
    title: 'Insurance renewed',
    description: 'Coverage active until 03/15/2024',
    icon: <InfoIcon />,
  },
  {
    id: '3',
    type: 'warning',
    title: 'NFT RWA verification required',
    description: 'Please verify your NFT RWA assets',
    action: {
      label: 'Verify',
      onClick: () => console.log('Verify clicked'),
    },
    icon: <LockIcon />,
  },
]

export default function AlertsPanel({
  alerts = defaultAlerts,
  className = '',
}: AlertsPanelProps) {
  const getIcon = (alert: AlertItem) => {
    if (alert.icon) return alert.icon

    switch (alert.type) {
      case 'important':
        return <WarningIcon />
      case 'info':
        return <InfoIcon />
      case 'warning':
        return <LockIcon />
      default:
        return null
    }
  }

  return (
    <div className={`alerts-card ${className}`}>
      <div className="alerts-header">
        <h3>Alerts & Notifications</h3>
        {alerts.length > 0 && <span className="alerts-badge">{alerts.length}</span>}
      </div>
      <div className="alerts-list">
        {alerts.map((alert) => (
          <div key={alert.id} className={`alert-item alert-${alert.type}`}>
            <div className="alert-icon">{getIcon(alert)}</div>
            <div className="alert-content">
              <div className="alert-title">{alert.title}</div>
              <div className="alert-desc">{alert.description}</div>
            </div>
            {alert.action && (
              <button
                className="alert-action"
                onClick={alert.action.onClick}
                aria-label={alert.action.label}
              >
                {alert.action.label}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

