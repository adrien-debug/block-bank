/**
 * Script de migration des soumissions depuis le stockage local vers Supabase
 * 
 * Usage:
 *   npx tsx scripts/migrate-to-supabase.ts
 * 
 * Prérequis:
 *   - Variables d'environnement Supabase configurées
 *   - Bucket "submissions" créé dans Supabase Storage
 *   - Tables créées via supabase-setup.sql
 */

import { promises as fs } from 'fs'
import path from 'path'
import { supabaseAdmin } from '../lib/supabase/server'

const STORAGE_ROOT = path.join(process.cwd(), 'storage', 'submissions')
const BUCKET_NAME = 'submissions'

interface LocalSubmission {
  id: string
  submittedAt: string
  status: string
  userType: string
  assetType: string
  [key: string]: any
}

async function migrateSubmissions() {
  console.log('🚀 Début de la migration vers Supabase...\n')

  try {
    // Vérifier que le dossier existe
    await fs.access(STORAGE_ROOT)
  } catch {
    console.error(`❌ Le dossier ${STORAGE_ROOT} n'existe pas`)
    process.exit(1)
  }

  // Lister tous les dossiers de soumissions
  const entries = await fs.readdir(STORAGE_ROOT, { withFileTypes: true })
  const submissionDirs = entries.filter(entry => entry.isDirectory())

  console.log(`📁 ${submissionDirs.length} soumissions trouvées\n`)

  let successCount = 0
  let errorCount = 0
  const errors: Array<{ id: string; error: string }> = []

  for (const entry of submissionDirs) {
    const submissionId = entry.name
    const metadataPath = path.join(STORAGE_ROOT, submissionId, 'metadata.json')

    try {
      // Lire les métadonnées
      const metadataContent = await fs.readFile(metadataPath, 'utf-8')
      const submission: LocalSubmission = JSON.parse(metadataContent)

      console.log(`📄 Migration de ${submissionId}...`)

      // Vérifier si la soumission existe déjà dans Supabase
      const { data: existing } = await supabaseAdmin
        .from('submissions')
        .select('id')
        .eq('id', submissionId)
        .single()

      if (existing) {
        console.log(`   ⚠️  Déjà présente, skip...`)
        continue
      }

      // Insérer la soumission dans Supabase
      const { error: submissionError } = await supabaseAdmin
        .from('submissions')
        .insert({
          id: submission.id,
          submitted_at: submission.submittedAt,
          status: submission.status,
          user_type: submission.userType,
          asset_type: submission.assetType,
          custom_asset_type: submission.customAssetType || null,
          asset_description: submission.assetDescription,
          estimated_value: parseFloat(submission.estimatedValue) || 0,
          location: submission.location,
          asset_link: submission.assetLink || null,
          additional_info: submission.additionalInfo || null,
          owner_name: submission.ownerName || null,
          owner_email: submission.ownerEmail || null,
          owner_phone: submission.ownerPhone || null,
          company_name: submission.companyName || null,
          company_email: submission.companyEmail || null,
          company_phone: submission.companyPhone || null,
          company_registration: submission.companyRegistration || null,
          contact_person_name: submission.contactPersonName || null,
          seller_payment_method: submission.sellerPaymentMethod || null,
          seller_preferred_currency: submission.sellerPreferredCurrency || null,
          seller_crypto_address: submission.sellerCryptoAddress || null,
          seller_bank_iban: submission.sellerBankAccount?.iban || null,
          seller_bank_bic: submission.sellerBankAccount?.bic || null,
          seller_bank_account_holder: submission.sellerBankAccount?.accountHolder || null,
          seller_bank_name: submission.sellerBankAccount?.bankName || null,
          seller_bank_currency: submission.sellerBankAccount?.currency || null,
        })

      if (submissionError) {
        throw new Error(`Erreur insertion soumission: ${submissionError.message}`)
      }

      // Migrer les fichiers
      if (submission.documents) {
        const documentTypes = Object.keys(submission.documents)
        
        for (const docType of documentTypes) {
          const filePaths = submission.documents[docType] as string[]
          
          if (!Array.isArray(filePaths)) continue

          for (let index = 0; index < filePaths.length; index++) {
            const localFilePath = filePaths[index]
            
            // Vérifier que le fichier existe localement
            try {
              await fs.access(localFilePath)
            } catch {
              console.log(`   ⚠️  Fichier non trouvé: ${localFilePath}`)
              continue
            }

            // Lire le fichier
            const fileBuffer = await fs.readFile(localFilePath)
            const fileName = path.basename(localFilePath)
            
            // Déterminer le chemin dans Supabase Storage
            // Format: {submissionId}/{documentType}/{index}-{filename}
            const supabasePath = `${submissionId}/${docType}/${index + 1}-${fileName}`

            // Uploader vers Supabase Storage
            const { error: uploadError } = await supabaseAdmin.storage
              .from(BUCKET_NAME)
              .upload(supabasePath, fileBuffer, {
                contentType: getMimeType(fileName),
                upsert: false,
              })

            if (uploadError) {
              console.log(`   ⚠️  Erreur upload ${fileName}: ${uploadError.message}`)
              continue
            }

            // Enregistrer dans la table documents
            const stats = await fs.stat(localFilePath)
            const { error: docError } = await supabaseAdmin
              .from('documents')
              .insert({
                submission_id: submissionId,
                document_type: docType,
                file_name: fileName,
                file_path: supabasePath,
                file_size: stats.size,
                mime_type: getMimeType(fileName),
              })

            if (docError) {
              console.log(`   ⚠️  Erreur enregistrement document ${fileName}: ${docError.message}`)
            }
          }
        }
      }

      console.log(`   ✅ ${submissionId} migré avec succès`)
      successCount++
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error(`   ❌ Erreur migration ${submissionId}:`, errorMessage)
      errors.push({ id: submissionId, error: errorMessage })
      errorCount++
    }
  }

  // Résumé
  console.log('\n' + '='.repeat(50))
  console.log('📊 Résumé de la migration:')
  console.log(`   ✅ Succès: ${successCount}`)
  console.log(`   ❌ Erreurs: ${errorCount}`)
  
  if (errors.length > 0) {
    console.log('\n❌ Erreurs détaillées:')
    errors.forEach(({ id, error }) => {
      console.log(`   - ${id}: ${error}`)
    })
  }
  
  console.log('='.repeat(50))
}

function getMimeType(fileName: string): string {
  const ext = path.extname(fileName).toLowerCase()
  const mimeTypes: Record<string, string> = {
    '.pdf': 'application/pdf',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  }
  return mimeTypes[ext] || 'application/octet-stream'
}

// Exécuter la migration
migrateSubmissions()
  .then(() => {
    console.log('\n✅ Migration terminée!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Erreur fatale:', error)
    process.exit(1)
  })

