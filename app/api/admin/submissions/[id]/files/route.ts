/**
 * Route API pour lister les fichiers d'une soumission
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

    // Lister tous les fichiers dans le dossier de la soumission
    const STORAGE_ROOT = path.join(process.cwd(), 'storage', 'submissions')
    const submissionFolder = path.join(STORAGE_ROOT, submissionId)

    try {
      await fs.access(submissionFolder)
    } catch {
      return NextResponse.json({
        success: true,
        files: [],
        documents: submission.documents || {},
      })
    }

    const files: Array<{
      name: string
      path: string
      type: string
      size: number
    }> = []

    // Fonction récursive pour lister les fichiers
    async function listFilesRecursive(dir: string, baseDir: string) {
      const entries = await fs.readdir(dir, { withFileTypes: true })

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)
        const relativePath = path.relative(baseDir, fullPath)

        if (entry.isDirectory()) {
          await listFilesRecursive(fullPath, baseDir)
        } else if (entry.name !== 'metadata.json') {
          // Ignorer metadata.json, on veut juste les fichiers uploadés
          const stats = await fs.stat(fullPath)
          files.push({
            name: entry.name,
            path: relativePath,
            type: path.extname(entry.name).slice(1) || 'unknown',
            size: stats.size,
          })
        }
      }
    }

    await listFilesRecursive(submissionFolder, submissionFolder)

    return NextResponse.json({
      success: true,
      files,
      documents: submission.documents || {},
    })
  } catch (error) {
    console.error('Error listing files:', error)
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    )
  }
}

