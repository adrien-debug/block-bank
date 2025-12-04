/**
 * Système de stockage local simple
 * Stockage de fichiers sur le système de fichiers
 * 
 * IMPORTANT: Ce module utilise des APIs Node.js (fs, path) et doit uniquement
 * être utilisé côté serveur (dans les API routes).
 */

import { promises as fs } from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'
import { AssetSubmission, SubmissionMetadata } from '@/types/submission.types'

const STORAGE_ROOT = path.join(process.cwd(), 'storage', 'submissions')

// S'assurer que le dossier de stockage existe
async function ensureStorageDir(): Promise<void> {
  try {
    await fs.mkdir(STORAGE_ROOT, { recursive: true })
  } catch (error) {
    console.error('[Local Storage] Error creating storage directory:', error)
    throw error
  }
}

/**
 * Convertit un File en Buffer
 */
async function fileToBuffer(file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

/**
 * Sauvegarde un fichier dans le système de fichiers
 */
async function saveFile(file: File, filePath: string): Promise<string> {
  const buffer = await fileToBuffer(file)
  await fs.writeFile(filePath, buffer)
  return filePath
}

/**
 * Sauvegarde une soumission complète avec tous ses fichiers
 */
export async function saveSubmission(
  submissionData: Omit<AssetSubmission, 'id' | 'submittedAt' | 'status' | 'documents'>,
  files: {
    passport?: File[]
    identityDocument?: File[]
    companyStatutes?: File[]
    companyBalanceSheet?: File[]
    companyRegistrationDoc?: File[]
    assetDocuments?: File[]
    additionalDocuments?: File[]
  }
): Promise<{ submissionId: string; folderId: string }> {
  await ensureStorageDir()

  const submissionId = randomUUID()
  const submissionDate = new Date().toISOString()
  const submissionFolder = path.join(STORAGE_ROOT, submissionId)

  // Créer le dossier de la soumission
  await fs.mkdir(submissionFolder, { recursive: true })
  await fs.mkdir(path.join(submissionFolder, 'asset-documents'), { recursive: true })
  await fs.mkdir(path.join(submissionFolder, 'additional-documents'), { recursive: true })

  const documentPaths: AssetSubmission['documents'] = {}

  // Sauvegarder tous les fichiers
  const savePromises: Promise<void>[] = []

  // Passport
  if (files.passport && files.passport.length > 0) {
    const paths: string[] = []
    files.passport.forEach((file, index) => {
      const fileName = `passport-${index + 1}-${file.name}`
      const filePath = path.join(submissionFolder, fileName)
      paths.push(filePath)
      savePromises.push(saveFile(file, filePath).then(() => {}))
    })
    documentPaths.passport = paths
  }

  // Identity Document
  if (files.identityDocument && files.identityDocument.length > 0) {
    const paths: string[] = []
    files.identityDocument.forEach((file, index) => {
      const fileName = `identity-${index + 1}-${file.name}`
      const filePath = path.join(submissionFolder, fileName)
      paths.push(filePath)
      savePromises.push(saveFile(file, filePath).then(() => {}))
    })
    documentPaths.identityDocument = paths
  }

  // Company Statutes
  if (files.companyStatutes && files.companyStatutes.length > 0) {
    const paths: string[] = []
    files.companyStatutes.forEach((file, index) => {
      const fileName = `statutes-${index + 1}-${file.name}`
      const filePath = path.join(submissionFolder, fileName)
      paths.push(filePath)
      savePromises.push(saveFile(file, filePath).then(() => {}))
    })
    documentPaths.companyStatutes = paths
  }

  // Company Balance Sheet
  if (files.companyBalanceSheet && files.companyBalanceSheet.length > 0) {
    const paths: string[] = []
    files.companyBalanceSheet.forEach((file, index) => {
      const fileName = `balance-sheet-${index + 1}-${file.name}`
      const filePath = path.join(submissionFolder, fileName)
      paths.push(filePath)
      savePromises.push(saveFile(file, filePath).then(() => {}))
    })
    documentPaths.companyBalanceSheet = paths
  }

  // Company Registration Doc
  if (files.companyRegistrationDoc && files.companyRegistrationDoc.length > 0) {
    const paths: string[] = []
    files.companyRegistrationDoc.forEach((file, index) => {
      const fileName = `registration-${index + 1}-${file.name}`
      const filePath = path.join(submissionFolder, fileName)
      paths.push(filePath)
      savePromises.push(saveFile(file, filePath).then(() => {}))
    })
    documentPaths.companyRegistrationDoc = paths
  }

  // Asset Documents
  if (files.assetDocuments && files.assetDocuments.length > 0) {
    const paths: string[] = []
    files.assetDocuments.forEach((file, index) => {
      const fileName = `asset-${index + 1}-${file.name}`
      const filePath = path.join(submissionFolder, 'asset-documents', fileName)
      paths.push(filePath)
      savePromises.push(saveFile(file, filePath).then(() => {}))
    })
    documentPaths.assetDocuments = paths
  }

  // Additional Documents
  if (files.additionalDocuments && files.additionalDocuments.length > 0) {
    const paths: string[] = []
    files.additionalDocuments.forEach((file, index) => {
      const fileName = `additional-${index + 1}-${file.name}`
      const filePath = path.join(submissionFolder, 'additional-documents', fileName)
      paths.push(filePath)
      savePromises.push(saveFile(file, filePath).then(() => {}))
    })
    documentPaths.additionalDocuments = paths
  }

  // Attendre que tous les fichiers soient sauvegardés
  await Promise.all(savePromises)

  // Créer l'objet de soumission complet
  const submission: AssetSubmission = {
    id: submissionId,
    submittedAt: submissionDate,
    status: 'new',
    ...submissionData,
    documents: documentPaths,
  }

  // Sauvegarder les métadonnées dans un fichier JSON
  const metadataPath = path.join(submissionFolder, 'metadata.json')
  await fs.writeFile(metadataPath, JSON.stringify(submission, null, 2), 'utf-8')

  console.log(`[Local Storage] Submission saved: ${submissionId}`)

  return {
    submissionId,
    folderId: submissionFolder,
  }
}

/**
 * Récupère une soumission depuis le stockage local
 */
export async function getSubmission(submissionId: string): Promise<AssetSubmission | null> {
  try {
    const submissionFolder = path.join(STORAGE_ROOT, submissionId)
    const metadataPath = path.join(submissionFolder, 'metadata.json')

    // Vérifier si le dossier existe
    try {
      await fs.access(submissionFolder)
    } catch {
      return null
    }

    // Lire le fichier metadata.json
    const metadataContent = await fs.readFile(metadataPath, 'utf-8')
    const submission: AssetSubmission = JSON.parse(metadataContent)

    return submission
  } catch (error) {
    console.error('[Local Storage] Error getting submission:', error)
    return null
  }
}

/**
 * Liste toutes les soumissions (métadonnées uniquement)
 */
export async function listSubmissions(): Promise<SubmissionMetadata[]> {
  try {
    await ensureStorageDir()

    const entries = await fs.readdir(STORAGE_ROOT, { withFileTypes: true })
    const submissions: SubmissionMetadata[] = []

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const submissionId = entry.name
        const metadataPath = path.join(STORAGE_ROOT, submissionId, 'metadata.json')

        try {
          const metadataContent = await fs.readFile(metadataPath, 'utf-8')
          const submission: AssetSubmission = JSON.parse(metadataContent)

          submissions.push({
            id: submission.id,
            submittedAt: submission.submittedAt,
            status: submission.status,
            userType: submission.userType,
            assetType: submission.assetType,
            estimatedValue: submission.estimatedValue,
            location: submission.location,
            ownerName: submission.userType === 'individual' ? submission.ownerName : undefined,
            ownerEmail: submission.userType === 'individual' ? submission.ownerEmail : undefined,
            companyName: submission.userType === 'company' ? submission.companyName : undefined,
            companyEmail: submission.userType === 'company' ? submission.companyEmail : undefined,
            folderId: path.join(STORAGE_ROOT, submissionId),
          })
        } catch (error) {
          console.error(`[Local Storage] Error reading submission ${submissionId}:`, error)
        }
      }
    }

    return submissions.sort((a, b) =>
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    )
  } catch (error) {
    console.error('[Local Storage] Error listing submissions:', error)
    return []
  }
}

