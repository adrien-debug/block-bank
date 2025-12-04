import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/utils/adminAuth'
import { getSubmission } from '@/lib/utils/submissionStorage'
import { getFileDownloadUrl, listFiles } from '@/lib/utils/googleDrive'

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

    // Récupérer la soumission
    const submission = await getSubmission(submissionId)

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      )
    }

    // Pour l'instant, on retourne les métadonnées de base
    // Dans une version complète, on téléchargerait le metadata.json depuis Google Drive
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

