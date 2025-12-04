/**
 * Route API pour lister les fichiers d'une soumission depuis Supabase
 */

import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/utils/adminAuth'
import { getSubmissionFromSupabase } from '@/lib/services/supabaseStorage'
import { supabaseAdmin } from '@/lib/supabase/server'

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

    // Vérifier rapidement que la soumission existe (sans charger tous les détails)
    const { data: submissionCheck, error: checkError } = await supabaseAdmin
      .from('submissions')
      .select('id')
      .eq('id', submissionId)
      .single()

    if (checkError || !submissionCheck) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      )
    }

    // Récupérer les documents depuis la table documents
    const { data: documents, error: documentsError } = await supabaseAdmin
      .from('documents')
      .select('file_name, file_path, mime_type, file_size, document_type')
      .eq('submission_id', submissionId)
      .order('uploaded_at', { ascending: true })

    if (documentsError) {
      console.error('[Files List] Error fetching documents:', documentsError)
      return NextResponse.json(
        { error: 'Error fetching documents' },
        { status: 500 }
      )
    }

    if (!documents || documents.length === 0) {
      return NextResponse.json({
        success: true,
        files: [],
      })
    }

    // Générer toutes les URLs en parallèle (optimisation majeure)
    // Utiliser les URLs publiques directement si le bucket est public (plus rapide)
    const files = await Promise.all(
      documents.map(async (doc) => {
        // Utiliser l'URL publique directement (plus rapide que signée)
        const { data: publicUrlData } = supabaseAdmin.storage
          .from('submissions')
          .getPublicUrl(doc.file_path)

        return {
          name: doc.file_name,
          path: doc.file_path,
          type: doc.mime_type || 'application/octet-stream',
          size: doc.file_size || 0,
          documentType: doc.document_type,
          url: publicUrlData.publicUrl, // URL publique (instantanée, pas de génération)
        }
      })
    )

    return NextResponse.json({
      success: true,
      files,
    })
  } catch (error) {
    console.error('[Files List] Error:', error)
    return NextResponse.json(
      { 
        error: 'An error occurred',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
