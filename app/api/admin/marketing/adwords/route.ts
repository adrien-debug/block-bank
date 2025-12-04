import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/utils/adminAuth'
import { supabaseAdmin } from '@/lib/supabase/server'
import { AdWordsCampaign } from '@/types/marketing.types'
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

    let query = supabaseAdmin
      .from('marketing_adwords_campaigns')
      .select('*')
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching AdWords campaigns:', error)
      // If table doesn't exist or schema cache not ready, return empty array
      const errorMsg = error.message?.toLowerCase() || ''
      if (error.code === '42P01' || 
          error.code === 'PGRST205' ||
          errorMsg.includes('does not exist') || 
          errorMsg.includes('relation') ||
          errorMsg.includes('schema cache') ||
          errorMsg.includes('could not find the table')) {
        console.warn('Table marketing_adwords_campaigns not accessible yet (schema cache may need refresh). Returning empty array.')
        return NextResponse.json({ success: true, campaigns: [] })
      }
      return NextResponse.json({ error: 'Erreur lors de la récupération des campagnes' }, { status: 500 })
    }

    const campaigns = mapArrayToCamelCase<AdWordsCampaign>(data || [])
    return NextResponse.json({ success: true, campaigns })
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
        daily_budget: dailyBudget || null,
        total_budget: totalBudget || null,
        currency: currency || 'USD',
        keywords,
        start_date: startDate,
        end_date: endDate || null,
        status: status || 'planned',
        ad_groups: adGroups || [],
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating AdWords campaign:', error)
      // If table doesn't exist, return error with helpful message
      if (error.code === '42P01' || error.message?.includes('does not exist') || error.message?.includes('relation')) {
        console.warn('Table marketing_adwords_campaigns does not exist yet.')
        return NextResponse.json({ 
          error: 'Database table does not exist. Please run the schema migration.',
          details: error.message 
        }, { status: 500 })
      }
      return NextResponse.json({ error: 'Erreur lors de la création de la campagne' }, { status: 500 })
    }

    const campaign = mapArrayToCamelCase<AdWordsCampaign>([data])[0]
    return NextResponse.json({ success: true, campaign }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/admin/marketing/adwords:', error)
    return NextResponse.json(
      { error: 'An error occurred', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

