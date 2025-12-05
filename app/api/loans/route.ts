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

    // Récupérer les prêts de l'utilisateur
    const { data: loans, error } = await supabaseAdmin
      .from('loans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erreur récupération loans:', error)
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des prêts' },
        { status: 500 }
      )
    }

    // Récupérer les NFT assets et paiements pour chaque prêt
    const loansWithPayments = await Promise.all(
      (loans || []).map(async (loan) => {
        // Récupérer le NFT asset associé
        let nftAsset = null
        if (loan.nft_asset_id) {
          const { data: nft } = await supabaseAdmin
            .from('nft_assets')
            .select('id, token_id, contract_address, name, type, asset_type, value, current_value, image_uri')
            .eq('id', loan.nft_asset_id)
            .single()
          nftAsset = nft
        }

        // Récupérer les paiements
        const { data: payments } = await supabaseAdmin
          .from('payments')
          .select('*')
          .eq('loan_id', loan.id)
          .order('payment_date', { ascending: false })

        return {
          ...loan,
          nft_assets: nftAsset,
          payments: payments || []
        }
      })
    )

    return NextResponse.json({ loans: loansWithPayments }, { status: 200 })
  } catch (error: any) {
    console.error('Erreur API loans:', error)
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
      nft_asset_id,
      amount,
      currency = 'USDC',
      ltv,
      rate,
      term_months,
      profile = 'BALANCED',
      start_date,
      end_date,
      monthly_payment,
      down_payment = 0
    } = body

    // Validation
    if (!nft_asset_id || !amount || !ltv || !rate || !term_months || !start_date || !end_date || !monthly_payment) {
      return NextResponse.json(
        { error: 'Tous les champs requis doivent être remplis' },
        { status: 400 }
      )
    }

    // Générer un numéro de prêt unique
    const loanNumber = `LOAN-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`

    // Créer le prêt
    const { data: loan, error } = await supabaseAdmin
      .from('loans')
      .insert({
        user_id: userId,
        loan_number: loanNumber,
        nft_asset_id,
        amount: parseFloat(amount),
        currency,
        ltv: parseFloat(ltv),
        rate: parseFloat(rate),
        term_months: parseInt(term_months),
        profile,
        start_date,
        end_date,
        next_payment_date: end_date, // À calculer correctement
        next_payment_amount: parseFloat(monthly_payment),
        remaining_balance: parseFloat(amount),
        monthly_payment: parseFloat(monthly_payment),
        down_payment: parseFloat(down_payment),
        status: 'active'
      })
      .select()
      .single()

    if (error) {
      console.error('Erreur création loan:', error)
      return NextResponse.json(
        { error: error.message || 'Erreur lors de la création du prêt' },
        { status: 400 }
      )
    }

    // Mettre à jour le statut du NFT asset à "locked"
    await supabaseAdmin
      .from('nft_assets')
      .update({ 
        status: 'locked',
        locked_in_loan_id: loan.id
      })
      .eq('id', nft_asset_id)

    return NextResponse.json({ loan }, { status: 201 })
  } catch (error: any) {
    console.error('Erreur API création loan:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

