'use client'

import type { MarketingTab } from '@/components/admin/marketing/types'
import SocialIcon from '@/components/icons/SocialIcon'
import TargetIcon from '@/components/icons/TargetIcon'
import SearchIcon from '@/components/icons/SearchIcon'
import CalendarIcon from '@/components/icons/CalendarIcon'
import DocumentIcon from '@/components/icons/DocumentIcon'

interface MarketingNavProps {
  activeTab: MarketingTab
  onTabChange: (tab: MarketingTab) => void
}

export default function MarketingNav({ activeTab, onTabChange }: MarketingNavProps) {
  const tabs = [
    { id: 'posts' as MarketingTab, label: 'Posts Réseaux Sociaux', icon: SocialIcon },
    { id: 'promotions' as MarketingTab, label: 'Promotions', icon: TargetIcon },
    { id: 'adwords' as MarketingTab, label: 'Google AdWords', icon: SearchIcon },
    { id: 'calendar' as MarketingTab, label: 'Calendrier', icon: CalendarIcon },
    { id: 'sections' as MarketingTab, label: 'Sections', icon: DocumentIcon },
  ]

  return (
    <div className="marketing-nav admin-submenu">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        const IconComponent = tab.icon
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`marketing-nav-item ${isActive ? 'active' : ''}`}
          >
            <IconComponent size={16} />
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

