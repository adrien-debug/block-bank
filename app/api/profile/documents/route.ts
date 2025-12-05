import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

const BUCKET_NAME = 'user-documents'

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

    const formData = await request.formData()
    const file = formData.get('file') as File
    const documentType = formData.get('documentType') as string

    if (!file || !documentType) {
      return NextResponse.json(
        { error: 'Fichier et type de document requis' },
        { status: 400 }
      )
    }

    // Créer le nom du fichier
    const timestamp = Date.now()
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const fileName = `${userId}/${documentType}/${timestamp}-${sanitizedFileName}`

    // Uploader le fichier vers Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        contentType: file.type || 'application/octet-stream',
        upsert: false,
      })

    if (uploadError) {
      console.error('Erreur upload document:', uploadError)
      return NextResponse.json(
        { error: `Erreur lors de l'upload: ${uploadError.message}` },
        { status: 500 }
      )
    }

    // Enregistrer le document dans la base de données
    const { data: document, error: docError } = await supabaseAdmin
      .from('user_documents')
      .insert({
        user_id: userId,
        document_type: documentType,
        file_name: file.name,
        file_path: fileName,
        file_size: file.size,
        mime_type: file.type,
      })
      .select()
      .single()

    if (docError) {
      // Si la table n'existe pas, créer un enregistrement simple
      console.warn('Table user_documents n\'existe peut-être pas:', docError.message)
      // On retourne quand même le succès de l'upload
    }

    return NextResponse.json({
      success: true,
      document: {
        id: document?.id || uploadData.path,
        fileName: file.name,
        filePath: fileName,
        documentType,
        uploadedAt: new Date().toISOString(),
      }
    }, { status: 200 })

  } catch (error: any) {
    console.error('Erreur API upload document:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

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

    // Récupérer les documents de l'utilisateur
    const { data: documents, error } = await supabaseAdmin
      .from('user_documents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error && error.code !== '42P01') {
      console.error('Erreur récupération documents:', error)
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des documents' },
        { status: 500 }
      )
    }

    // Générer les URLs signées pour chaque document
    const documentsWithUrls = await Promise.all(
      (documents || []).map(async (doc) => {
        const { data: urlData } = await supabaseAdmin.storage
          .from(BUCKET_NAME)
          .createSignedUrl(doc.file_path, 3600) // URL valide 1 heure

        return {
          ...doc,
          downloadUrl: urlData?.signedUrl || null,
        }
      })
    )

    return NextResponse.json({ documents: documentsWithUrls }, { status: 200 })
  } catch (error: any) {
    console.error('Erreur API récupération documents:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
