'use client'

import React from 'react'
import CheckIcon from '../icons/CheckIcon'
import ChartIcon from '../icons/ChartIcon'
import LockIcon from '../icons/LockIcon'

interface ActivityItem {
  id: string
  type: 'success' | 'info' | 'warning'
  title: string
  description: string
  amount?: string
  icon?: React.ReactNode
}

interface ActivityFeedProps {
  activities?: ActivityItem[]
  onViewAll?: () => void
  className?: string
}

const defaultActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'success',
    title: 'Payment received',
    description: 'Loan #1 - 15,000 USDC',
    amount: '+15,000 USDC',
    icon: <CheckIcon />,
  },
  {
    id: '2',
    type: 'info',
    title: 'Score updated',
    description: 'Credit Score: 750 (+12)',
    icon: <ChartIcon />,
  },
  {
    id: '3',
    type: 'warning',
    title: 'NFT locked',
    description: 'Villa Paris - Loan #1',
    icon: <LockIcon />,
  },
]

export default function ActivityFeed({
  activities = defaultActivities,
  onViewAll,
  className = '',
}: ActivityFeedProps) {
  const getIcon = (item: ActivityItem) => {
    if (item.icon) return item.icon

    switch (item.type) {
      case 'success':
        return <CheckIcon />
      case 'info':
        return <ChartIcon />
      case 'warning':
        return <LockIcon />
      default:
        return null
    }
  }

  return (
    <div className={`activity-card ${className}`}>
      <div className="activity-header">
        <h3>Recent Activity</h3>
        {onViewAll && (
          <button className="btn-ghost" onClick={onViewAll}>
            View all
          </button>
        )}
      </div>
      <div className="activity-list">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className={`activity-item activity-${activity.type}`}
          >
            <div className="activity-icon">{getIcon(activity)}</div>
            <div className="activity-content">
              <div className="activity-title">{activity.title}</div>
              <div className="activity-desc">{activity.description}</div>
            </div>
            {activity.amount && (
              <div className="activity-amount">{activity.amount}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}


