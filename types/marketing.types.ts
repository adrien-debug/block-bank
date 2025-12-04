export type SocialNetwork = 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'tiktok' | 'youtube'

export type PostStatus = 'draft' | 'scheduled' | 'published' | 'archived'

export type CampaignStatus = 'planned' | 'active' | 'paused' | 'completed'

export interface SocialPost {
  id: string
  content: string
  networks: SocialNetwork[]
  scheduledAt?: string | null
  publishedAt?: string | null
  status: PostStatus
  mediaUrls: string[]
  createdAt: string
  updatedAt: string
  promotionId?: string | null
  createdBy?: string | null
}

export interface Promotion {
  id: string
  name: string
  description: string
  startDate: string
  endDate: string
  budget: number
  currency: string
  targetAudience?: string
  status: CampaignStatus
  createdAt: string
  updatedAt: string
  createdBy?: string | null
}

export interface AdWordsCampaign {
  id: string
  name: string
  description?: string
  dailyBudget?: number
  totalBudget?: number
  currency: string
  keywords: string[]
  startDate: string
  endDate?: string | null
  status: CampaignStatus
  adGroups?: string[]
  createdAt: string
  updatedAt: string
  createdBy?: string | null
}

export interface ContentSection {
  id: string
  name: string
  type: 'cta' | 'promotion' | 'announcement' | 'custom'
  content: string
  template: string
  previewImage?: string | null
  createdAt: string
  updatedAt: string
  createdBy?: string | null
}

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  startDate: string
  endDate?: string | null
  postId?: string | null
  promotionId?: string | null
  adWordsCampaignId?: string | null
  networks: SocialNetwork[]
  color?: string
  createdAt: string
  updatedAt: string
  createdBy?: string | null
}

