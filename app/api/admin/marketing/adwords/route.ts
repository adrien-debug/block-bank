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
    const status = searchParams.get('status')

    let query = supabaseAdmin
      .from('marketing_adwords_campaigns')
      .select('*')
      .order('createdAt', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching AdWords campaigns:', error)
      return NextResponse.json({ error: 'Erreur lors de la récupération des campagnes' }, { status: 500 })
    }

    return NextResponse.json({ success: true, campaigns: data || [] })
  } catch (error) {
    console.error('Error in GET /api/admin/marketing/adwords:', error)
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
      name,
      description,
      dailyBudget,
      totalBudget,
      currency,
      keywords,
      startDate,
      endDate,
      status,
      adGroups,
    } = body

    if (!name || !startDate || keywords === undefined || !Array.isArray(keywords)) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('marketing_adwords_campaigns')
      .insert({
        name,
        description: description || null,
        dailyBudget: dailyBudget || null,
        totalBudget: totalBudget || null,
        currency: currency || 'USD',
        keywords,
        startDate,
        endDate: endDate || null,
        status: status || 'planned',
        adGroups: adGroups || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating AdWords campaign:', error)
      return NextResponse.json({ error: 'Erreur lors de la création de la campagne' }, { status: 500 })
    }

    return NextResponse.json({ success: true, campaign: data }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/admin/marketing/adwords:', error)
    return NextResponse.json(
      { error: 'An error occurred', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

