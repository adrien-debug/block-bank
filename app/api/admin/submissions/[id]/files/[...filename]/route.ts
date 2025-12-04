/**
 * Route API pour télécharger un fichier d'une soumission
 */

import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/utils/adminAuth'
import { getSubmission } from '@/lib/utils/submissionStorage'
import { promises as fs } from 'fs'
import path from 'path'

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

    // Extraire le nom du fichier pour l'en-tête (sans le chemin)
    const baseFileName = path.basename(filename)
    
    // Normaliser le nom de fichier pour les headers HTTP (ASCII seulement)
    // Les headers HTTP ne supportent que les caractères ASCII (0-255)
    // Le caractère Unicode 8217 (apostrophe courbe ') cause des erreurs
    let safeFileName = baseFileName
      // Remplacer les apostrophes Unicode par apostrophe ASCII
      .replace(/[''\u2018\u2019\u201B\u2032]/g, "'")
      // Remplacer les guillemets Unicode
      .replace(/[""\u201C\u201D\u201E\u2033]/g, '"')
      // Remplacer les tirets Unicode
      .replace(/[–—\u2013\u2014]/g, '-')
      // Normaliser et supprimer les accents (é → e, à → a, etc.)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      // Filtrer tous les caractères non-ASCII (code > 126)
      .split('')
      .map(char => {
        const code = char.charCodeAt(0)
        // Garder uniquement les caractères ASCII imprimables (32-126)
        return (code >= 32 && code <= 126) ? char : '_'
      })
      .join('')
      // Nettoyer les underscores multiples
      .replace(/_{2,}/g, '_')
    
    // Retourner le fichier
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${safeFileName}"`,
        'Content-Length': stats.size.toString(),
      },
    })
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

