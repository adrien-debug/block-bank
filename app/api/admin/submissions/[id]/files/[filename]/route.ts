/**
 * Route API pour télécharger un fichier d'une soumission
 */

import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/utils/adminAuth'
import { getSubmission } from '@/lib/utils/submissionStorage'
import { promises as fs } from 'fs'
import path from 'path'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; filename: string } }
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
    const filename = decodeURIComponent(params.filename)

    // Vérifier que la soumission existe
    const submission = await getSubmission(submissionId)

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      )
    }

    // Construire le chemin du fichier
    // Le filename peut contenir un chemin relatif comme "asset-documents/file.png"
    const STORAGE_ROOT = path.join(process.cwd(), 'storage', 'submissions')
    const filePath = path.join(STORAGE_ROOT, submissionId, filename)

    // Sécurité : s'assurer que le fichier est dans le dossier de la soumission
    const normalizedFilePath = path.normalize(filePath)
    const normalizedSubmissionFolder = path.normalize(path.join(STORAGE_ROOT, submissionId))

    if (!normalizedFilePath.startsWith(normalizedSubmissionFolder)) {
      return NextResponse.json(
        { error: 'Invalid file path' },
        { status: 403 }
      )
    }

    // Vérifier que le fichier existe
    try {
      await fs.access(filePath)
    } catch {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    // Lire le fichier
    const fileBuffer = await fs.readFile(filePath)
    const stats = await fs.stat(filePath)

    // Déterminer le type MIME
    const ext = path.extname(filename).toLowerCase()
    const mimeTypes: Record<string, string> = {
      '.pdf': 'application/pdf',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xls': 'application/vnd.ms-excel',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    }

    const contentType = mimeTypes[ext] || 'application/octet-stream'

    // Retourner le fichier
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${filename}"`,
        'Content-Length': stats.size.toString(),
      },
    })
  } catch (error) {
    console.error('[File Download] Error downloading file:', error)
    console.error('[File Download] Details:', {
      submissionId: params.id,
      filename: params.filename,
      decodedFilename: decodeURIComponent(params.filename || ''),
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

