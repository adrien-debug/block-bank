/**
 * Route API pour télécharger un fichier d'une soumission depuis Supabase Storage
 */

import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/utils/adminAuth'
import { getSubmissionFromSupabase, getFileUrl } from '@/lib/services/supabaseStorage'
import path from 'path'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; filename: string[] } }
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
    // Reconstruire le chemin du fichier à partir du tableau de segments
    const filename = Array.isArray(params.filename) 
      ? params.filename.map(segment => decodeURIComponent(segment)).join('/')
      : decodeURIComponent(params.filename)

    // Vérifier que la soumission existe
    const submission = await getSubmissionFromSupabase(submissionId)

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      )
    }

    // Construire le chemin complet du fichier dans Supabase Storage
    // Format: {submissionId}/{documentType}/{index}-{filename}
    const filePath = `${submissionId}/${filename}`

    // Récupérer l'URL signée du fichier (valide 1 heure)
    const fileUrl = await getFileUrl(filePath, 3600)

    if (!fileUrl) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    // Rediriger vers l'URL signée Supabase
    // Alternative: télécharger le fichier et le servir (pour plus de contrôle)
    try {
      const response = await fetch(fileUrl)
      if (!response.ok) {
        return NextResponse.json(
          { error: 'Failed to fetch file' },
          { status: 500 }
        )
      }

      const fileBuffer = await response.arrayBuffer()
      const contentType = response.headers.get('content-type') || 'application/octet-stream'
      
      // Extraire le nom du fichier pour l'en-tête
      const baseFileName = path.basename(filename)
      
      // Normaliser le nom de fichier pour les headers HTTP
      let safeFileName = baseFileName
        .replace(/[''\u2018\u2019\u201B\u2032]/g, "'")
        .replace(/[""\u201C\u201D\u201E\u2033]/g, '"')
        .replace(/[–—\u2013\u2014]/g, '-')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .split('')
        .map(char => {
          const code = char.charCodeAt(0)
          return (code >= 32 && code <= 126) ? char : '_'
        })
        .join('')
        .replace(/_{2,}/g, '_')
      
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `inline; filename="${safeFileName}"`,
          'Content-Length': fileBuffer.byteLength.toString(),
        },
      })
    } catch (error) {
      console.error('[File Download] Error fetching file from Supabase:', error)
      // Fallback: redirection directe vers l'URL
      return NextResponse.redirect(fileUrl)
    }
  } catch (error) {
    const filenameForLog = Array.isArray(params.filename)
      ? params.filename.map(seg => decodeURIComponent(seg)).join('/')
      : decodeURIComponent(params.filename || '')
    
    console.error('[File Download] Error downloading file:', error)
    console.error('[File Download] Details:', {
      submissionId: params.id,
      filename: params.filename,
      decodedFilename: filenameForLog,
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : error
    })
    return NextResponse.json(
      { 
        error: 'An error occurred',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

