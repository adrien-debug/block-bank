'use client'

import { useState } from 'react'
import MarketingNav from '@/components/admin/MarketingNav'
import SocialPostsManager from '@/components/admin/marketing/SocialPostsManager'
import PromotionsManager from '@/components/admin/marketing/PromotionsManager'
import AdWordsManager from '@/components/admin/marketing/AdWordsManager'
import ContentCalendar from '@/components/admin/marketing/ContentCalendar'
import ContentSections from '@/components/admin/marketing/ContentSections'

type MarketingTab = 'posts' | 'promotions' | 'adwords' | 'calendar' | 'sections'

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useState<MarketingTab>('posts')

  return (
    <div style={{ width: '100%' }}>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: 'var(--space-2)' }}>
          Marketing Management
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '16px' }}>
          Gérer tous vos réseaux sociaux, promotions, campagnes Google AdWords et calendrier éditorial
        </p>
      </div>

      <MarketingNav activeTab={activeTab} onTabChange={setActiveTab} />

      <div style={{ marginTop: 'var(--space-6)' }}>
        {activeTab === 'posts' && <SocialPostsManager />}
        {activeTab === 'promotions' && <PromotionsManager />}
        {activeTab === 'adwords' && <AdWordsManager />}
        {activeTab === 'calendar' && <ContentCalendar />}
        {activeTab === 'sections' && <ContentSections />}
      </div>
    </div>
  )
}

