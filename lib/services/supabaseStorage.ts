import { supabaseAdmin } from '@/lib/supabase/server'
import { AssetSubmission, SubmissionMetadata } from '@/types/submission.types'

const BUCKET_NAME = 'submissions'

export interface SaveSubmissionResult {
  submissionId: string
  folderId: string
}

/**
 * Sauvegarde une soumission complète avec tous ses fichiers dans Supabase
 */
export async function saveSubmissionToSupabase(
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
): Promise<SaveSubmissionResult> {
  console.log('[Supabase Storage] Début sauvegarde soumission...')

  // 1. Créer la soumission dans la base de données
  const { data: submission, error: submissionError } = await supabaseAdmin
    .from('submissions')
    .insert({
      status: 'new',
      user_type: submissionData.userType,
      asset_type: submissionData.assetType,
      custom_asset_type: submissionData.customAssetType || null,
      asset_description: submissionData.assetDescription,
      estimated_value: parseFloat(submissionData.estimatedValue) || 0,
      location: submissionData.location,
      asset_link: submissionData.assetLink || null,
      additional_info: submissionData.additionalInfo || null,
      owner_name: submissionData.ownerName || null,
      owner_email: submissionData.ownerEmail || null,
      owner_phone: submissionData.ownerPhone || null,
      company_name: submissionData.companyName || null,
      company_email: submissionData.companyEmail || null,
      company_phone: submissionData.companyPhone || null,
      company_registration: submissionData.companyRegistration || null,
      contact_person_name: submissionData.contactPersonName || null,
      seller_payment_method: submissionData.sellerPaymentMethod || null,
      seller_preferred_currency: submissionData.sellerPreferredCurrency || null,
      seller_crypto_address: submissionData.sellerCryptoAddress || null,
      seller_bank_iban: submissionData.sellerBankAccount?.iban || null,
      seller_bank_bic: submissionData.sellerBankAccount?.bic || null,
      seller_bank_account_holder: submissionData.sellerBankAccount?.accountHolder || null,
      seller_bank_name: submissionData.sellerBankAccount?.bankName || null,
      seller_bank_currency: submissionData.sellerBankAccount?.currency || null,
    })
    .select()
    .single()

  if (submissionError) {
    console.error('[Supabase Storage] Erreur création soumission:', submissionError)
    throw new Error(`Erreur lors de la création de la soumission: ${submissionError.message}`)
  }

  const submissionId = submission.id
  console.log('[Supabase Storage] Soumission créée:', submissionId)

  // 2. Uploader les fichiers vers Supabase Storage
  const uploadPromises: Promise<void>[] = []

  // Fonction helper pour uploader un fichier
  const uploadFile = async (
    file: File,
    documentType: string,
    index: number
  ): Promise<void> => {
    const fileName = `${submissionId}/${documentType}/${index + 1}-${sanitizeFileName(file.name)}`
    
    console.log(`[Supabase Storage] Upload ${documentType}/${index + 1}: ${file.name}`)

    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        contentType: file.type || 'application/octet-stream',
        upsert: false,
      })

    if (uploadError) {
      console.error(`[Supabase Storage] Erreur upload ${file.name}:`, uploadError)
      throw new Error(`Erreur upload fichier ${file.name}: ${uploadError.message}`)
    }

    // Enregistrer le document dans la base de données
    const { error: docError } = await supabaseAdmin
      .from('documents')
      .insert({
        submission_id: submissionId,
        document_type: documentType,
        file_name: file.name,
        file_path: fileName,
        file_size: file.size,
        mime_type: file.type || 'application/octet-stream',
      })

    if (docError) {
      console.error(`[Supabase Storage] Erreur enregistrement document ${file.name}:`, docError)
      // Ne pas throw, on continue même si l'enregistrement DB échoue
    }

    console.log(`[Supabase Storage] ✅ ${file.name} uploadé`)
  }

  // Uploader tous les fichiers
  if (files.passport) {
    files.passport.forEach((file, index) => {
      uploadPromises.push(uploadFile(file, 'passport', index))
    })
  }

  if (files.identityDocument) {
    files.identityDocument.forEach((file, index) => {
      uploadPromises.push(uploadFile(file, 'identityDocument', index))
    })
  }

  if (files.companyStatutes) {
    files.companyStatutes.forEach((file, index) => {
      uploadPromises.push(uploadFile(file, 'companyStatutes', index))
    })
  }

  if (files.companyBalanceSheet) {
    files.companyBalanceSheet.forEach((file, index) => {
      uploadPromises.push(uploadFile(file, 'companyBalanceSheet', index))
    })
  }

  if (files.companyRegistrationDoc) {
    files.companyRegistrationDoc.forEach((file, index) => {
      uploadPromises.push(uploadFile(file, 'companyRegistrationDoc', index))
    })
  }

  if (files.assetDocuments) {
    files.assetDocuments.forEach((file, index) => {
      uploadPromises.push(uploadFile(file, 'assetDocuments', index))
    })
  }

  if (files.additionalDocuments) {
    files.additionalDocuments.forEach((file, index) => {
      uploadPromises.push(uploadFile(file, 'additionalDocuments', index))
    })
  }

  // Attendre que tous les fichiers soient uploadés
  await Promise.all(uploadPromises)

  console.log('[Supabase Storage] ✅ Tous les fichiers uploadés')

  return {
    submissionId,
    folderId: `${BUCKET_NAME}/${submissionId}`,
  }
}

/**
 * Récupère une soumission depuis Supabase
 */
export async function getSubmissionFromSupabase(
  submissionId: string
): Promise<AssetSubmission | null> {
  try {
    // Optimisation: Récupérer la soumission et les documents en parallèle
    const [submissionResult, documentsResult] = await Promise.all([
      supabaseAdmin
        .from('submissions')
        .select('*')
        .eq('id', submissionId)
        .single(),
      supabaseAdmin
        .from('documents')
        .select('*')
        .eq('submission_id', submissionId)
    ])

    const { data: submission, error: submissionError } = submissionResult
    const { data: documents, error: documentsError } = documentsResult

    if (submissionError || !submission) {
      console.error('[Supabase Storage] Erreur récupération soumission:', submissionError)
      return null
    }

    if (documentsError) {
      console.error('[Supabase Storage] Erreur récupération documents:', documentsError)
    }

    // Organiser les documents par type et générer les URLs en parallèle
    const documentsByType: Record<string, string[]> = {}
    
    if (documents && documents.length > 0) {
      // Générer toutes les URLs en parallèle pour améliorer les performances
      const urlPromises = documents.map(async (doc) => {
        // Utiliser l'URL publique si le bucket est public (plus rapide)
        const { data: publicUrlData } = supabaseAdmin.storage
          .from(BUCKET_NAME)
          .getPublicUrl(doc.file_path)
        
        // Si l'URL publique fonctionne, l'utiliser directement
        // Sinon, générer une URL signée
        try {
          // Tester si l'URL publique est accessible (optionnel, peut être omis pour plus de vitesse)
          return {
            doc,
            url: publicUrlData.publicUrl,
            type: doc.document_type
          }
        } catch {
          // Fallback vers URL signée si nécessaire
          const { data: signedUrlData } = await supabaseAdmin.storage
            .from(BUCKET_NAME)
            .createSignedUrl(doc.file_path, 3600)
          return {
            doc,
            url: signedUrlData?.signedUrl || publicUrlData.publicUrl,
            type: doc.document_type
          }
        }
      })

      // Attendre toutes les URLs en parallèle
      const urlResults = await Promise.all(urlPromises)

      // Organiser par type
      urlResults.forEach(({ url, type }) => {
        if (!documentsByType[type]) {
          documentsByType[type] = []
        }
        documentsByType[type].push(url)
      })
    }

    // Convertir au format AssetSubmission
    return {
      id: submission.id,
      submittedAt: submission.submitted_at,
      status: submission.status,
      userType: submission.user_type,
      assetType: submission.asset_type,
      customAssetType: submission.custom_asset_type || undefined,
      assetDescription: submission.asset_description,
      estimatedValue: submission.estimated_value?.toString() || '0',
      location: submission.location,
      assetLink: submission.asset_link || undefined,
      additionalInfo: submission.additional_info || undefined,
      ownerName: submission.owner_name || undefined,
      ownerEmail: submission.owner_email || undefined,
      ownerPhone: submission.owner_phone || undefined,
      companyName: submission.company_name || undefined,
      companyEmail: submission.company_email || undefined,
      companyPhone: submission.company_phone || undefined,
      companyRegistration: submission.company_registration || undefined,
      contactPersonName: submission.contact_person_name || undefined,
      documents: documentsByType as AssetSubmission['documents'],
      sellerPaymentMethod: submission.seller_payment_method as any,
      sellerPreferredCurrency: submission.seller_preferred_currency || undefined,
      sellerCryptoAddress: submission.seller_crypto_address || undefined,
      sellerBankAccount: submission.seller_bank_iban
        ? {
            iban: submission.seller_bank_iban,
            bic: submission.seller_bank_bic || '',
            accountHolder: submission.seller_bank_account_holder || '',
            bankName: submission.seller_bank_name || '',
            currency: (submission.seller_bank_currency as any) || 'EUR',
          }
        : undefined,
    }
  } catch (error) {
    console.error('[Supabase Storage] Erreur getSubmission:', error)
    return null
  }
}

/**
 * Liste toutes les soumissions (métadonnées uniquement)
 * Optimisé avec filtres optionnels pour réduire la charge
 */
export async function listSubmissionsFromSupabase(
  status?: string,
  assetType?: string,
  userType?: string
): Promise<SubmissionMetadata[]> {
  try {
    // Construire la requête avec filtres optimisés
    let query = supabaseAdmin
      .from('submissions')
      .select('id, submitted_at, status, user_type, asset_type, estimated_value, location, owner_name, owner_email, company_name, company_email')
      .order('submitted_at', { ascending: false })

    // Appliquer les filtres directement dans la requête SQL (plus rapide)
    if (status) {
      query = query.eq('status', status)
    }
    if (assetType) {
      query = query.eq('asset_type', assetType)
    }
    if (userType) {
      query = query.eq('user_type', userType)
    }

    const { data: submissions, error } = await query

    if (error) {
      console.error('[Supabase Storage] Erreur liste soumissions:', error)
      return []
    }

    if (!submissions) {
      return []
    }

    // Convertir au format SubmissionMetadata
    return submissions.map((submission) => ({
      id: submission.id,
      submittedAt: submission.submitted_at,
      status: submission.status,
      userType: submission.user_type,
      assetType: submission.asset_type,
      estimatedValue: submission.estimated_value?.toString() || '0',
      location: submission.location,
      ownerName: submission.user_type === 'individual' ? submission.owner_name : undefined,
      ownerEmail: submission.user_type === 'individual' ? submission.owner_email : undefined,
      companyName: submission.user_type === 'company' ? submission.company_name : undefined,
      companyEmail: submission.user_type === 'company' ? submission.company_email : undefined,
      folderId: `${BUCKET_NAME}/${submission.id}`, // Chemin virtuel pour compatibilité
    }))
  } catch (error) {
    console.error('[Supabase Storage] Erreur listSubmissions:', error)
    return []
  }
}

/**
 * Met à jour le statut d'une soumission
 */
export async function updateSubmissionStatus(
  submissionId: string,
  status: AssetSubmission['status']
): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin
      .from('submissions')
      .update({ status })
      .eq('id', submissionId)

    if (error) {
      console.error('[Supabase Storage] Erreur mise à jour statut:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('[Supabase Storage] Erreur updateSubmissionStatus:', error)
    return false
  }
}

/**
 * Récupère l'URL d'un fichier pour téléchargement
 */
export async function getFileUrl(filePath: string, expiresIn: number = 3600): Promise<string | null> {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .createSignedUrl(filePath, expiresIn)

    if (error || !data) {
      console.error('[Supabase Storage] Erreur génération URL:', error)
      // Fallback: URL publique
      const { data: publicUrlData } = supabaseAdmin.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath)
      return publicUrlData.publicUrl
    }

    return data.signedUrl
  } catch (error) {
    console.error('[Supabase Storage] Erreur getFileUrl:', error)
    return null
  }
}

/**
 * Nettoie le nom de fichier pour éviter les problèmes
 */
function sanitizeFileName(fileName: string): string {
  // Remplacer les caractères problématiques
  return fileName
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/\s+/g, '_')
    .substring(0, 255) // Limiter la longueur
}

