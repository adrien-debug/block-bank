import { supabase } from '@/lib/supabase/client'
import {
  SocialPost,
  Promotion,
  AdWordsCampaign,
  ContentSection,
  CalendarEvent,
  PostStatus,
  CampaignStatus,
  SocialNetwork,
} from '@/types/marketing.types'

// Posts
export async function getMarketingPosts(filters?: {
  network?: SocialNetwork
  status?: PostStatus
  startDate?: string
  endDate?: string
}): Promise<SocialPost[]> {
  let query = supabase
    .from('marketing_posts')
    .select('*')
    .order('createdAt', { ascending: false })

  if (filters?.network) {
    query = query.contains('networks', [filters.network])
  }
  if (filters?.status) {
    query = query.eq('status', filters.status)
  }
  if (filters?.startDate) {
    query = query.gte('scheduledAt', filters.startDate)
  }
  if (filters?.endDate) {
    query = query.lte('scheduledAt', filters.endDate)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching posts:', error)
    throw error
  }

  return (data || []) as SocialPost[]
}

export async function getMarketingPost(id: string): Promise<SocialPost | null> {
  const { data, error } = await supabase
    .from('marketing_posts')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching post:', error)
    return null
  }

  return data as SocialPost
}

export async function createMarketingPost(post: Omit<SocialPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<SocialPost> {
  const { data, error } = await supabase
    .from('marketing_posts')
    .insert({
      ...post,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating post:', error)
    throw error
  }

  return data as SocialPost
}

export async function updateMarketingPost(
  id: string,
  updates: Partial<Omit<SocialPost, 'id' | 'createdAt'>>,
): Promise<SocialPost> {
  const { data, error } = await supabase
    .from('marketing_posts')
    .update({
      ...updates,
      updatedAt: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating post:', error)
    throw error
  }

  return data as SocialPost
}

export async function deleteMarketingPost(id: string): Promise<void> {
  const { error } = await supabase
    .from('marketing_posts')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting post:', error)
    throw error
  }
}

// Promotions
export async function getPromotions(filters?: {
  status?: CampaignStatus
  startDate?: string
  endDate?: string
}): Promise<Promotion[]> {
  let query = supabase
    .from('marketing_promotions')
    .select('*')
    .order('createdAt', { ascending: false })

  if (filters?.status) {
    query = query.eq('status', filters.status)
  }
  if (filters?.startDate) {
    query = query.gte('startDate', filters.startDate)
  }
  if (filters?.endDate) {
    query = query.lte('endDate', filters.endDate)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching promotions:', error)
    throw error
  }

  return (data || []) as Promotion[]
}

export async function createPromotion(
  promotion: Omit<Promotion, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<Promotion> {
  const { data, error } = await supabase
    .from('marketing_promotions')
    .insert({
      ...promotion,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating promotion:', error)
    throw error
  }

  return data as Promotion
}

export async function updatePromotion(
  id: string,
  updates: Partial<Omit<Promotion, 'id' | 'createdAt'>>,
): Promise<Promotion> {
  const { data, error } = await supabase
    .from('marketing_promotions')
    .update({
      ...updates,
      updatedAt: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating promotion:', error)
    throw error
  }

  return data as Promotion
}

export async function deletePromotion(id: string): Promise<void> {
  const { error } = await supabase
    .from('marketing_promotions')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting promotion:', error)
    throw error
  }
}

// AdWords Campaigns
export async function getAdWordsCampaigns(filters?: {
  status?: CampaignStatus
}): Promise<AdWordsCampaign[]> {
  let query = supabase
    .from('marketing_adwords_campaigns')
    .select('*')
    .order('createdAt', { ascending: false })

  if (filters?.status) {
    query = query.eq('status', filters.status)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching AdWords campaigns:', error)
    throw error
  }

  return (data || []) as AdWordsCampaign[]
}

export async function createAdWordsCampaign(
  campaign: Omit<AdWordsCampaign, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<AdWordsCampaign> {
  const { data, error } = await supabase
    .from('marketing_adwords_campaigns')
    .insert({
      ...campaign,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating AdWords campaign:', error)
    throw error
  }

  return data as AdWordsCampaign
}

export async function updateAdWordsCampaign(
  id: string,
  updates: Partial<Omit<AdWordsCampaign, 'id' | 'createdAt'>>,
): Promise<AdWordsCampaign> {
  const { data, error } = await supabase
    .from('marketing_adwords_campaigns')
    .update({
      ...updates,
      updatedAt: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating AdWords campaign:', error)
    throw error
  }

  return data as AdWordsCampaign
}

export async function deleteAdWordsCampaign(id: string): Promise<void> {
  const { error } = await supabase
    .from('marketing_adwords_campaigns')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting AdWords campaign:', error)
    throw error
  }
}

// Content Sections
export async function getContentSections(): Promise<ContentSection[]> {
  const { data, error } = await supabase
    .from('marketing_content_sections')
    .select('*')
    .order('createdAt', { ascending: false })

  if (error) {
    console.error('Error fetching content sections:', error)
    throw error
  }

  return (data || []) as ContentSection[]
}

export async function createContentSection(
  section: Omit<ContentSection, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<ContentSection> {
  const { data, error } = await supabase
    .from('marketing_content_sections')
    .insert({
      ...section,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating content section:', error)
    throw error
  }

  return data as ContentSection
}

export async function updateContentSection(
  id: string,
  updates: Partial<Omit<ContentSection, 'id' | 'createdAt'>>,
): Promise<ContentSection> {
  const { data, error } = await supabase
    .from('marketing_content_sections')
    .update({
      ...updates,
      updatedAt: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating content section:', error)
    throw error
  }

  return data as ContentSection
}

export async function deleteContentSection(id: string): Promise<void> {
  const { error } = await supabase
    .from('marketing_content_sections')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting content section:', error)
    throw error
  }
}

// Calendar Events
export async function getCalendarEvents(filters?: {
  startDate?: string
  endDate?: string
  network?: SocialNetwork
}): Promise<CalendarEvent[]> {
  let query = supabase
    .from('marketing_calendar_events')
    .select('*')
    .order('startDate', { ascending: true })

  if (filters?.startDate) {
    query = query.gte('startDate', filters.startDate)
  }
  if (filters?.endDate) {
    query = query.lte('startDate', filters.endDate)
  }
  if (filters?.network) {
    query = query.contains('networks', [filters.network])
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching calendar events:', error)
    throw error
  }

  return (data || []) as CalendarEvent[]
}

export async function createCalendarEvent(
  event: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<CalendarEvent> {
  const { data, error } = await supabase
    .from('marketing_calendar_events')
    .insert({
      ...event,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating calendar event:', error)
    throw error
  }

  return data as CalendarEvent
}

export async function updateCalendarEvent(
  id: string,
  updates: Partial<Omit<CalendarEvent, 'id' | 'createdAt'>>,
): Promise<CalendarEvent> {
  const { data, error } = await supabase
    .from('marketing_calendar_events')
    .update({
      ...updates,
      updatedAt: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating calendar event:', error)
    throw error
  }

  return data as CalendarEvent
}

export async function deleteCalendarEvent(id: string): Promise<void> {
  const { error } = await supabase
    .from('marketing_calendar_events')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting calendar event:', error)
    throw error
  }
}

