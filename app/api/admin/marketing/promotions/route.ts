import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/utils/adminAuth'
import { supabaseAdmin } from '@/lib/supabase/server'
import { Promotion } from '@/types/marketing.types'
import { mapArrayToCamelCase } from '@/lib/utils/marketingMapper'

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
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }
    if (startDate) {
      query = query.gte('start_date', startDate)
    }
    if (endDate) {
      query = query.lte('end_date', endDate)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching promotions:', error)
      // If table doesn't exist or schema cache not ready, return empty array
      const errorMsg = error.message?.toLowerCase() || ''
      if (error.code === '42P01' || 
          error.code === 'PGRST205' ||
          errorMsg.includes('does not exist') || 
          errorMsg.includes('relation') ||
          errorMsg.includes('schema cache') ||
          errorMsg.includes('could not find the table')) {
        console.warn('Table marketing_promotions not accessible yet (schema cache may need refresh). Returning empty array.')
        return NextResponse.json({ success: true, promotions: [] })
      }
      return NextResponse.json({ error: 'Erreur lors de la récupération des promotions' }, { status: 500 })
    }

    const promotions = mapArrayToCamelCase<Promotion>(data || [])
    return NextResponse.json({ success: true, promotions })
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
        start_date: startDate,
        end_date: endDate,
        budget,
        currency: currency || 'USD',
        target_audience: targetAudience || null,
        status: status || 'planned',
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating promotion:', error)
      // If table doesn't exist, return error with helpful message
      if (error.code === '42P01' || error.message?.includes('does not exist') || error.message?.includes('relation')) {
        console.warn('Table marketing_promotions does not exist yet.')
        return NextResponse.json({ 
          error: 'Database table does not exist. Please run the schema migration.',
          details: error.message 
        }, { status: 500 })
      }
      return NextResponse.json({ error: 'Erreur lors de la création de la promotion' }, { status: 500 })
    }

    const promotion = mapArrayToCamelCase<Promotion>([data])[0]
    return NextResponse.json({ success: true, promotion }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/admin/marketing/promotions:', error)
    return NextResponse.json(
      { error: 'An error occurred', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

