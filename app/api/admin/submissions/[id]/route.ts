import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/utils/adminAuth'
import { getSubmissionFromSupabase, updateSubmissionStatus } from '@/lib/services/supabaseStorage'

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

