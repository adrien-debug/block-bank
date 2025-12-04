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
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    let query = supabaseAdmin
      .from('marketing_promotions')
      .select('*')
      .order('createdAt', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }
    if (startDate) {
      query = query.gte('startDate', startDate)
    }
    if (endDate) {
      query = query.lte('endDate', endDate)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching promotions:', error)
      return NextResponse.json({ error: 'Erreur lors de la récupération des promotions' }, { status: 500 })
    }

    return NextResponse.json({ success: true, promotions: data || [] })
  } catch (error) {
    console.error('Error in GET /api/admin/marketing/promotions:', error)
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
      startDate,
      endDate,
      budget,
      currency,
      targetAudience,
      status,
    } = body

    if (!name || !startDate || !endDate || budget === undefined) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('marketing_promotions')
      .insert({
        name,
        description: description || '',
        startDate,
        endDate,
        budget,
        currency: currency || 'USD',
        targetAudience: targetAudience || null,
        status: status || 'planned',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating promotion:', error)
      return NextResponse.json({ error: 'Erreur lors de la création de la promotion' }, { status: 500 })
    }

    return NextResponse.json({ success: true, promotion: data }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/admin/marketing/promotions:', error)
    return NextResponse.json(
      { error: 'An error occurred', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

