'use client'

import { useState } from 'react'
import MarketingNav from '@/components/admin/MarketingNav'
import SocialNetworksOverview from '@/components/admin/marketing/SocialNetworksOverview'
import SocialPostsManager from '@/components/admin/marketing/SocialPostsManager'
import ContentGenerator from '@/components/admin/marketing/ContentGenerator'
import PromotionsManager from '@/components/admin/marketing/PromotionsManager'
import AdWordsManager from '@/components/admin/marketing/AdWordsManager'
import ContentCalendar from '@/components/admin/marketing/ContentCalendar'
import ContentSections from '@/components/admin/marketing/ContentSections'
import type { MarketingTab } from '@/components/admin/marketing/types'

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useState<MarketingTab>('overview')

  return (
    <div className="admin-page-container">
      <div className="admin-page-header dashboard-header admin-dashboard-header">
        <div>
          <h1 className="admin-page-title">
            Marketing Management
          </h1>
          <p className="admin-page-description">
            Gérer tous vos réseaux sociaux, promotions, campagnes Google AdWords et calendrier éditorial
          </p>
        </div>
        <div className="admin-header-controls">
          {/* Contrôles optionnels pour le menu Marketing */}
        </div>
      </div>

      <MarketingNav activeTab={activeTab} onTabChange={setActiveTab} />

      <div style={{ marginTop: 'var(--space-6)' }}>
        {activeTab === 'overview' && <SocialNetworksOverview />}
        {activeTab === 'posts' && <SocialPostsManager />}
        {activeTab === 'generator' && <ContentGenerator />}
        {activeTab === 'promotions' && <PromotionsManager />}
        {activeTab === 'adwords' && <AdWordsManager />}
        {activeTab === 'calendar' && <ContentCalendar />}
        {activeTab === 'sections' && <ContentSections />}
      </div>
    </div>
  )
}

