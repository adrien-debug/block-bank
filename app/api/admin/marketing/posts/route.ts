import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/utils/adminAuth'
import { supabaseAdmin } from '@/lib/supabase/server'
import { SocialPost } from '@/types/marketing.types'
import { mapArrayToCamelCase } from '@/lib/utils/marketingMapper'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const network = searchParams.get('network')
    const status = searchParams.get('status')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    let query = supabaseAdmin
      .from('marketing_posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (network) {
      query = query.contains('networks', [network])
    }
    if (status) {
      query = query.eq('status', status)
    }
    if (startDate) {
      query = query.gte('scheduled_at', startDate)
    }
    if (endDate) {
      query = query.lte('scheduled_at', endDate)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching posts:', error)
      return NextResponse.json({ error: 'Erreur lors de la récupération des posts' }, { status: 500 })
    }

    const posts = mapArrayToCamelCase<SocialPost>(data || [])
    return NextResponse.json({ success: true, posts })
  } catch (error) {
    console.error('Error in GET /api/admin/marketing/posts:', error)
    return NextResponse.json(
      { error: 'An error occurred', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await request.json()
    const {
      content,
      networks,
      scheduledAt,
      status,
      mediaUrls,
      promotionId,
    } = body

    if (!content || !networks || !Array.isArray(networks) || networks.length === 0) {
      return NextResponse.json({ error: 'Content et networks sont requis' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('marketing_posts')
      .insert({
        content,
        networks,
        scheduled_at: scheduledAt || null,
        status: status || 'draft',
        media_urls: mediaUrls || [],
        promotion_id: promotionId || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating post:', error)
      return NextResponse.json({ error: 'Erreur lors de la création du post' }, { status: 500 })
    }

    const post = mapArrayToCamelCase<SocialPost>([data])[0]
    return NextResponse.json({ success: true, post }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/admin/marketing/posts:', error)
    return NextResponse.json(
      { error: 'An error occurred', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

