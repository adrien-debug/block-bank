import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/utils/adminAuth'
import { getSubmissionFromSupabase, updateSubmissionStatus, deleteSubmissionFromSupabase } from '@/lib/services/supabaseStorage'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier l'authentification
    if (!isAuthenticated(request)) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    const submissionId = params.id

    // Récupérer la soumission depuis Supabase
    const submission = await getSubmissionFromSupabase(submissionId)

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      )
    }

    // Retourner les métadonnées de la soumission
    return NextResponse.json({
      success: true,
      submission,
    })
  } catch (error) {
    console.error('Error retrieving submission:', error)
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier l'authentification
    if (!isAuthenticated(request)) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    const submissionId = params.id
    const body = await request.json()
    const { status } = body

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      )
    }

    // Mettre à jour le statut
    const success = await updateSubmissionStatus(submissionId, status)

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update submission status' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Submission status updated',
    })
  } catch (error) {
    console.error('Error updating submission:', error)
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const startTime = Date.now()
  console.log('[Admin API] ========== DELETE SUBMISSION ==========')
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

    const submissionId = params.id
    console.log('[Admin API] Step 2: Suppression de la soumission:', submissionId)

    // Supprimer la soumission et tous ses fichiers
    const success = await deleteSubmissionFromSupabase(submissionId)

    if (!success) {
      console.log('[Admin API] ❌ Échec de la suppression')
      return NextResponse.json(
        { error: 'Failed to delete submission' },
        { status: 500 }
      )
    }

    const duration = Date.now() - startTime
    console.log(`[Admin API] ✅ Soumission supprimée avec succès en ${duration}ms`)

    return NextResponse.json({
      success: true,
      message: 'Submission deleted successfully',
    })
  } catch (error) {
    const duration = Date.now() - startTime
    console.error(`[Admin API] ❌ Erreur après ${duration}ms:`, error)
    console.error('[Admin API] Détails:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    return NextResponse.json(
      { error: 'An error occurred', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

