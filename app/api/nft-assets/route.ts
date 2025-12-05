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

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const assetType = searchParams.get('asset_type')

    let query = supabaseAdmin
      .from('nft_assets')
      .select('*')
      .eq('user_id', userId)

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    if (assetType && assetType !== 'all') {
      query = query.eq('asset_type', assetType)
    }

    const { data: nftAssets, error } = await query
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erreur récupération NFT assets:', error)
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des NFT' },
        { status: 500 }
      )
    }

    return NextResponse.json({ nftAssets: nftAssets || [] }, { status: 200 })
  } catch (error: any) {
    console.error('Erreur API NFT assets:', error)
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
      token_id,
      contract_address,
      type,
      asset_type,
      name,
      description,
      value,
      currency = 'USDC',
      current_value,
      original_value,
      risk_class = 'MODERATE',
      risk_score = 50,
      marketplace,
      spv_name,
      spv_jurisdiction,
      spv_registration_number,
      spv_legal_form,
      metadata_location,
      metadata_size,
      metadata_year_built,
      metadata_condition,
      metadata_documentation_hash,
      metadata_inspection_date,
      metadata_maintenance_history,
      metadata_uri,
      image_uri,
      owner_address
    } = body

    // Validation
    if (!token_id || !contract_address || !type || !asset_type || !name || !value) {
      return NextResponse.json(
        { error: 'Les champs obligatoires doivent être remplis' },
        { status: 400 }
      )
    }

    // Créer le NFT asset
    const { data: nftAsset, error } = await supabaseAdmin
      .from('nft_assets')
      .insert({
        user_id: userId,
        token_id,
        contract_address,
        type,
        asset_type,
        name,
        description,
        value: parseFloat(value),
        currency,
        current_value: current_value ? parseFloat(current_value) : parseFloat(value),
        original_value: original_value ? parseFloat(original_value) : parseFloat(value),
        risk_class,
        risk_score: parseInt(risk_score),
        marketplace,
        spv_name,
        spv_jurisdiction,
        spv_registration_number,
        spv_legal_form,
        metadata_location,
        metadata_size,
        metadata_year_built: metadata_year_built ? parseInt(metadata_year_built) : null,
        metadata_condition,
        metadata_documentation_hash,
        metadata_inspection_date,
        metadata_maintenance_history: metadata_maintenance_history || [],
        metadata_uri,
        image_uri,
        owner_address,
        status: 'available'
      })
      .select()
      .single()

    if (error) {
      console.error('Erreur création NFT asset:', error)
      return NextResponse.json(
        { error: error.message || 'Erreur lors de la création du NFT' },
        { status: 400 }
      )
    }

    return NextResponse.json({ nftAsset }, { status: 201 })
  } catch (error: any) {
    console.error('Erreur API création NFT asset:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}


