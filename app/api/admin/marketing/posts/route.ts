import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/utils/adminAuth'
import { supabaseAdmin } from '@/lib/supabase/server'
import { SocialPost, SocialNetwork } from '@/types/marketing.types'
import { mapArrayToCamelCase } from '@/lib/utils/marketingMapper'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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

    // Note: Array filtering is done client-side after fetching
    // This avoids issues with Postgres array operators
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
      // If table doesn't exist or schema cache not ready, return empty array
      const errorMsg = error.message?.toLowerCase() || ''
      if (error.code === '42P01' || 
          error.code === 'PGRST205' ||
          errorMsg.includes('does not exist') || 
          errorMsg.includes('relation') ||
          errorMsg.includes('schema cache') ||
          errorMsg.includes('could not find the table')) {
        console.warn('Table marketing_posts not accessible yet (schema cache may need refresh). Returning empty array.')
        return NextResponse.json({ success: true, posts: [] })
      }
      return NextResponse.json(
        { 
          error: 'Error fetching posts', 
          details: error.message,
          code: error.code,
          hint: error.hint
        }, 
        { status: 500 }
      )
    }

    let posts = mapArrayToCamelCase<SocialPost>(data || [])
    
    // Filter by network client-side if needed (since array filtering in Supabase can be complex)
    if (network) {
      const validNetworks: SocialNetwork[] = ['facebook', 'twitter', 'instagram', 'linkedin', 'tiktok', 'youtube']
      const networkParam = network as SocialNetwork
      if (validNetworks.includes(networkParam)) {
        posts = posts.filter(post => 
          post.networks && Array.isArray(post.networks) && post.networks.includes(networkParam)
        )
      }
    }
    
    return NextResponse.json({ success: true, posts })
  } catch (error) {
    console.error('Error in GET /api/admin/marketing/posts:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : undefined
    console.error('Full error details:', { errorMessage, errorStack, error })
    return NextResponse.json(
      { 
        error: 'An error occurred', 
        details: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? errorStack : undefined
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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
      return NextResponse.json({ error: 'Content and networks are required' }, { status: 400 })
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
      return NextResponse.json({ error: 'Error creating post' }, { status: 500 })
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

