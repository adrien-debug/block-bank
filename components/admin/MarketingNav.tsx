'use client'

import type { MarketingTab } from './marketing/types'

interface MarketingNavProps {
  activeTab: MarketingTab
  onTabChange: (tab: MarketingTab) => void
}

export default function MarketingNav({ activeTab, onTabChange }: MarketingNavProps) {
  const tabs = [
    { id: 'posts' as MarketingTab, label: 'Posts Réseaux Sociaux', icon: '📱' },
    { id: 'promotions' as MarketingTab, label: 'Promotions', icon: '🎯' },
    { id: 'adwords' as MarketingTab, label: 'Google AdWords', icon: '🔍' },
    { id: 'calendar' as MarketingTab, label: 'Calendrier', icon: '📅' },
    { id: 'sections' as MarketingTab, label: 'Sections', icon: '📝' },
  ]

  return (
    <div style={{
      display: 'flex',
      gap: 'var(--space-2)',
      borderBottom: '2px solid var(--color-border-default)',
      paddingBottom: 'var(--space-2)',
    }}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              padding: 'var(--space-3) var(--space-5)',
              border: 'none',
              background: 'transparent',
              borderBottom: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
              color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              fontWeight: isActive ? '600' : '400',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              marginBottom: '-2px',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
            }}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

