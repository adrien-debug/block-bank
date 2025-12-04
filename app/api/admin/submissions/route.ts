import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/utils/adminAuth'
import { listSubmissionsFromSupabase } from '@/lib/services/supabaseStorage'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification
    if (!isAuthenticated(request)) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    // Récupérer les paramètres de filtrage
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const assetType = searchParams.get('assetType')
    const userType = searchParams.get('userType')

    // Optimisation: Appliquer les filtres directement dans la requête SQL au lieu de filtrer après
    // Lister les soumissions depuis Supabase avec filtres optimisés
    let submissions = await listSubmissionsFromSupabase(status || undefined, assetType || undefined, userType || undefined)

    return NextResponse.json({
      success: true,
      submissions,
      total: submissions.length,
    })
  } catch (error) {
    console.error('Error retrieving submissions:', error)
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    )
  }
}

