import { AssetSubmission, SubmissionMetadata } from '@/types/submission.types'
import { createFolder, uploadFile, createJsonFile, listFiles } from './googleDrive'
import { randomUUID } from 'crypto'

const ROOT_FOLDER_NAME = 'BlockBank Submissions'
let rootFolderId: string | null = null

async function uploadDocumentGroup(
  fileList: File[] | undefined,
  targetFolderId: string
): Promise<string[] | undefined> {
  if (!fileList || fileList.length === 0) {
    return undefined
  }

  const uploadedIds = await Promise.all(
    fileList.map(file => uploadFile(file, file.name, targetFolderId))
  )

  return uploadedIds
}

/**
 * Obtient ou crée le dossier racine dans Google Drive
 */
async function getRootFolder(): Promise<string> {
  if (rootFolderId) {
    return rootFolderId
  }

  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID
  if (folderId) {
    rootFolderId = folderId
    return folderId
  }

  // Si pas de folder ID dans env, créer le dossier (nécessite permissions)
  rootFolderId = await createFolder(ROOT_FOLDER_NAME)
  return rootFolderId
}

/**
 * Sauvegarde une soumission complète dans Google Drive
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
  const rootFolder = await getRootFolder()
  const submissionId = randomUUID()
  const submissionDate = new Date().toISOString()

  // Créer le dossier de la soumission
  const submissionFolder = await createFolder(submissionId, rootFolder)

  // Créer les sous-dossiers
  const [assetDocumentsFolder, additionalDocumentsFolder] = await Promise.all([
    createFolder('asset-documents', submissionFolder),
    createFolder('additional-documents', submissionFolder),
  ])

  const documentIds: AssetSubmission['documents'] = {}

  const [
    passportIds,
    identityDocumentIds,
    companyStatutesIds,
    companyBalanceSheetIds,
    companyRegistrationDocIds,
    assetDocumentIds,
    additionalDocumentIds,
  ] = await Promise.all([
    uploadDocumentGroup(files.passport, submissionFolder),
    uploadDocumentGroup(files.identityDocument, submissionFolder),
    uploadDocumentGroup(files.companyStatutes, submissionFolder),
    uploadDocumentGroup(files.companyBalanceSheet, submissionFolder),
    uploadDocumentGroup(files.companyRegistrationDoc, submissionFolder),
    uploadDocumentGroup(files.assetDocuments, assetDocumentsFolder),
    uploadDocumentGroup(files.additionalDocuments, additionalDocumentsFolder),
  ])

  if (passportIds) {
    documentIds.passport = passportIds
  }
  if (identityDocumentIds) {
    documentIds.identityDocument = identityDocumentIds
  }
  if (companyStatutesIds) {
    documentIds.companyStatutes = companyStatutesIds
  }
  if (companyBalanceSheetIds) {
    documentIds.companyBalanceSheet = companyBalanceSheetIds
  }
  if (companyRegistrationDocIds) {
    documentIds.companyRegistrationDoc = companyRegistrationDocIds
  }
  if (assetDocumentIds) {
    documentIds.assetDocuments = assetDocumentIds
  }
  if (additionalDocumentIds) {
    documentIds.additionalDocuments = additionalDocumentIds
  }

  // Créer l'objet de soumission complet
  const submission: AssetSubmission = {
    id: submissionId,
    submittedAt: submissionDate,
    status: 'new',
    ...submissionData,
    documents: documentIds,
  }

  // Sauvegarder les métadonnées dans un fichier JSON
  await createJsonFile(submission, 'metadata.json', submissionFolder)

  return {
    submissionId,
    folderId: submissionFolder,
  }
}

/**
 * Récupère une soumission depuis Google Drive
 */
export async function getSubmission(submissionId: string): Promise<AssetSubmission | null> {
  try {
    const rootFolder = await getRootFolder()
    const files = await listFiles(rootFolder)
    
    // Trouver le dossier de la soumission
    const submissionFolder = files.find(f => f.name === submissionId && f.mimeType === 'application/vnd.google-apps.folder')
    
    if (!submissionFolder) {
      return null
    }

    // Trouver le fichier metadata.json
    const folderFiles = await listFiles(submissionFolder.id)
    const metadataFile = folderFiles.find(f => f.name === 'metadata.json')

    if (!metadataFile) {
      return null
    }

    // Télécharger et parser le JSON
    // Note: Pour une implémentation complète, il faudrait télécharger le fichier
    // Pour l'instant, on retourne null et on gérera ça dans l'API route
    return null
  } catch (error) {
    console.error('Erreur lors de la récupération de la soumission:', error)
    return null
  }
}

/**
 * Liste toutes les soumissions (métadonnées uniquement)
 */
export async function listSubmissions(): Promise<SubmissionMetadata[]> {
  try {
    const rootFolder = await getRootFolder()
    const files = await listFiles(rootFolder)
    
    // Filtrer pour ne garder que les dossiers (soumissions)
    const submissionFolders = files.filter(f => f.mimeType === 'application/vnd.google-apps.folder')
    
    const submissions: SubmissionMetadata[] = []
    
    for (const folder of submissionFolders) {
      // Pour chaque dossier, récupérer le metadata.json
      // Note: Implémentation simplifiée - dans la vraie version, il faudrait
      // télécharger et parser chaque metadata.json
      submissions.push({
        id: folder.name,
        submittedAt: folder.createdTime || new Date().toISOString(),
        status: 'new',
        userType: 'individual', // À récupérer depuis metadata
        assetType: 'real-estate', // À récupérer depuis metadata
        estimatedValue: '0', // À récupérer depuis metadata
        location: '', // À récupérer depuis metadata
        folderId: folder.id,
      })
    }
    
    return submissions.sort((a, b) => 
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    )
  } catch (error) {
    console.error('Erreur lors de la liste des soumissions:', error)
    return []
  }
}

