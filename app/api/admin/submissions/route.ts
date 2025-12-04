import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/utils/adminAuth'
import { listSubmissionsFromSupabase } from '@/lib/services/supabaseStorage'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0 // Désactiver complètement le cache

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  console.log('[Admin API] ========== GET /api/admin/submissions ==========')
  console.log('[Admin API] Timestamp:', new Date().toISOString())
  
  try {
    // Vérifier l'authentification
    console.log('[Admin API] Step 1: Vérification de l\'authentification...')
    if (!isAuthenticated(request)) {
      console.log('[Admin API] ❌ Authentification échouée')
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }
    console.log('[Admin API] ✅ Authentification réussie')

    // Récupérer les paramètres de filtrage
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const assetType = searchParams.get('assetType')
    const userType = searchParams.get('userType')
    
    console.log('[Admin API] Step 2: Paramètres de filtrage:', { status, assetType, userType })

    // Lister les soumissions depuis Supabase avec filtres optimisés
    // Toujours récupérer les données fraîches depuis la base de données
    console.log('[Admin API] Step 3: Récupération des soumissions depuis Supabase...')
    let submissions = await listSubmissionsFromSupabase(status || undefined, assetType || undefined, userType || undefined)
    
    console.log('[Admin API] Step 4: Soumissions récupérées:', {
      count: submissions.length,
      ids: submissions.map(s => s.id),
      statuses: submissions.map(s => s.status),
      firstSubmission: submissions[0] ? {
        id: submissions[0].id,
        status: submissions[0].status,
        userType: submissions[0].userType,
        assetType: submissions[0].assetType,
        submittedAt: submissions[0].submittedAt
      } : null
    })

    // Headers pour empêcher tout cache
    const headers = new Headers()
    headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    headers.set('Pragma', 'no-cache')
    headers.set('Expires', '0')
    headers.set('Surrogate-Control', 'no-store')

    const duration = Date.now() - startTime
    console.log(`[Admin API] ✅ Réponse envoyée en ${duration}ms`)

    return NextResponse.json({
      success: true,
      submissions,
      total: submissions.length,
      timestamp: new Date().toISOString(), // Ajouter un timestamp pour le debug
    }, { headers })
  } catch (error) {
    const duration = Date.now() - startTime
    console.error('[Admin API] ❌ Erreur après', duration, 'ms:', error)
    console.error('[Admin API] Détails de l\'erreur:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    })
    return NextResponse.json(
      { error: 'An error occurred', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

