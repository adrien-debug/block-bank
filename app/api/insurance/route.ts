import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const userId = cookies().get('user_id')?.value
    const sessionToken = cookies().get('auth_session')?.value

    if (!userId || !sessionToken) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Récupérer les polices d'assurance avec les prêts associés
    const { data: policies, error: policiesError } = await supabaseAdmin
      .from('insurance_policies')
      .select(`
        *,
        loans (
          id,
          loan_number,
          amount,
          status
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (policiesError) {
      console.error('Erreur récupération policies:', policiesError)
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des polices' },
        { status: 500 }
      )
    }

    // Récupérer les réclamations
    const policyIds = (policies || []).map(p => p.id)
    const { data: claims } = policyIds.length > 0 ? await supabaseAdmin
      .from('insurance_claims')
      .select('*')
      .in('policy_id', policyIds)
      .order('submitted_date', { ascending: false }) : { data: [] }

    // Récupérer l'historique
    const { data: history } = policyIds.length > 0 ? await supabaseAdmin
      .from('insurance_history')
      .select('*')
      .in('policy_id', policyIds)
      .order('entry_date', { ascending: false }) : { data: [] }

    return NextResponse.json({
      policies: policies || [],
      claims: claims || [],
      history: history || []
    }, { status: 200 })
  } catch (error: any) {
    console.error('Erreur API insurance:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = cookies().get('user_id')?.value
    const sessionToken = cookies().get('auth_session')?.value

    if (!userId || !sessionToken) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      loan_id,
      loan_number,
      loan_amount,
      currency = 'USDC',
      start_date,
      end_date,
      renewal_date,
      borrower_default_coverage = 0,
      market_risk_coverage = 0,
      asset_risk_coverage = 0,
      operational_risk_coverage = 0,
      legal_risk_coverage = 0,
      total_coverage,
      annual_premium,
      monthly_premium,
      credit_tier,
      nft_risk_class = 'MODERATE',
      impact_on_ltv = 0,
      impact_on_rate = 0,
      covered_risks = []
    } = body

    // Validation
    if (!loan_id || !loan_number || !loan_amount || !start_date || !end_date || 
        total_coverage === undefined || !annual_premium || !monthly_premium || !credit_tier) {
      return NextResponse.json(
        { error: 'Tous les champs requis doivent être remplis' },
        { status: 400 }
      )
    }

    // Générer un numéro de police unique
    const policyNumber = `POL-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`

    // Créer la police
    const { data: policy, error } = await supabaseAdmin
      .from('insurance_policies')
      .insert({
        user_id: userId,
        loan_id,
        policy_number: policyNumber,
        loan_number,
        loan_amount: parseFloat(loan_amount),
        currency,
        start_date,
        end_date,
        renewal_date,
        borrower_default_coverage: parseInt(borrower_default_coverage),
        market_risk_coverage: parseInt(market_risk_coverage),
        asset_risk_coverage: parseInt(asset_risk_coverage),
        operational_risk_coverage: parseInt(operational_risk_coverage),
        legal_risk_coverage: parseInt(legal_risk_coverage),
        total_coverage: parseInt(total_coverage),
        annual_premium: parseFloat(annual_premium),
        monthly_premium: parseFloat(monthly_premium),
        credit_tier,
        nft_risk_class,
        impact_on_ltv: parseFloat(impact_on_ltv),
        impact_on_rate: parseFloat(impact_on_rate),
        covered_risks: covered_risks || [],
        status: 'active'
      })
      .select()
      .single()

    if (error) {
      console.error('Erreur création policy:', error)
      return NextResponse.json(
        { error: error.message || 'Erreur lors de la création de la police' },
        { status: 400 }
      )
    }

    // Créer une entrée d'historique
    await supabaseAdmin
      .from('insurance_history')
      .insert({
        policy_id: policy.id,
        entry_type: 'CREATED',
        description: `Police créée pour ${loan_number}`,
        amount: parseFloat(annual_premium),
        currency
      })

    return NextResponse.json({ policy }, { status: 201 })
  } catch (error: any) {
    console.error('Erreur API création insurance:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}


