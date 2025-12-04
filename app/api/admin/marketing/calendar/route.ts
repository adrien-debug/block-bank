import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/utils/adminAuth'
import { supabaseAdmin } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const network = searchParams.get('network')

    let query = supabaseAdmin
      .from('marketing_calendar_events')
      .select('*')
      .order('startDate', { ascending: true })

    if (startDate) {
      query = query.gte('startDate', startDate)
    }
    if (endDate) {
      query = query.lte('startDate', endDate)
    }
    if (network) {
      query = query.contains('networks', [network])
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching calendar events:', error)
      return NextResponse.json({ error: 'Erreur lors de la récupération des événements' }, { status: 500 })
    }

    return NextResponse.json({ success: true, events: data || [] })
  } catch (error) {
    console.error('Error in GET /api/admin/marketing/calendar:', error)
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
      title,
      description,
      startDate,
      endDate,
      postId,
      promotionId,
      adWordsCampaignId,
      networks,
      color,
    } = body

    if (!title || !startDate || !networks || !Array.isArray(networks)) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('marketing_calendar_events')
      .insert({
        title,
        description: description || null,
        startDate,
        endDate: endDate || null,
        postId: postId || null,
        promotionId: promotionId || null,
        adWordsCampaignId: adWordsCampaignId || null,
        networks,
        color: color || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating calendar event:', error)
      return NextResponse.json({ error: 'Erreur lors de la création de l\'événement' }, { status: 500 })
    }

    return NextResponse.json({ success: true, event: data }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/admin/marketing/calendar:', error)
    return NextResponse.json(
      { error: 'An error occurred', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

