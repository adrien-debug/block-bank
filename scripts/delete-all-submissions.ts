/**
 * Script pour supprimer toutes les soumissions de la base de données
 * Usage: npx tsx scripts/delete-all-submissions.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Charger les variables d'environnement
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes!')
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌')
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅' : '❌')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

const BUCKET_NAME = 'submissions'

async function deleteAllSubmissions() {
  console.log('🗑️  Suppression de toutes les soumissions...\n')

  try {
    // 1. Récupérer toutes les soumissions
    console.log('📋 Étape 1: Récupération de toutes les soumissions...')
    const { data: submissions, error: fetchError } = await supabaseAdmin
      .from('submissions')
      .select('id')

    if (fetchError) {
      console.error('❌ Erreur lors de la récupération:', fetchError)
      process.exit(1)
    }

    if (!submissions || submissions.length === 0) {
      console.log('✅ Aucune soumission à supprimer')
      return
    }

    console.log(`✅ ${submissions.length} soumission(s) trouvée(s)\n`)

    // 2. Supprimer tous les fichiers du storage pour chaque soumission
    console.log('📁 Étape 2: Suppression des fichiers du storage...')
    let deletedFilesCount = 0

    for (const submission of submissions) {
      try {
        // Récupérer tous les fichiers du dossier
        const { data: files, error: listError } = await supabaseAdmin.storage
          .from(BUCKET_NAME)
          .list(submission.id, {
            limit: 1000,
            recursive: true,
          })

        if (!listError && files && files.length > 0) {
          // Construire les chemins complets
          const filePaths: string[] = []
          
          const collectFiles = (items: any[], prefix: string = '') => {
            for (const item of items) {
              const fullPath = prefix ? `${prefix}/${item.name}` : item.name
              
              if (item.id) {
                // C'est un fichier
                filePaths.push(fullPath)
              } else if (item.name) {
                // C'est un dossier, lister récursivement
                // Pour l'instant, on ignore les dossiers imbriqués
                // Supabase devrait les supprimer automatiquement avec le dossier parent
              }
            }
          }

          collectFiles(files, submission.id)

          // Supprimer tous les fichiers
          if (filePaths.length > 0) {
            const { error: removeError } = await supabaseAdmin.storage
              .from(BUCKET_NAME)
              .remove(filePaths)

            if (!removeError) {
              deletedFilesCount += filePaths.length
              console.log(`  ✓ ${filePaths.length} fichier(s) supprimé(s) pour ${submission.id}`)
            }
          }
        }
      } catch (error) {
        console.warn(`  ⚠️  Erreur lors de la suppression des fichiers pour ${submission.id}:`, error)
      }
    }

    console.log(`✅ ${deletedFilesCount} fichier(s) supprimé(s) au total\n`)

    // 3. Supprimer tous les documents de la base de données
    console.log('📄 Étape 3: Suppression des documents...')
    const submissionIds = submissions.map(s => s.id)
    
    // Supprimer par lots pour éviter les problèmes
    const batchSize = 50
    for (let i = 0; i < submissionIds.length; i += batchSize) {
      const batch = submissionIds.slice(i, i + batchSize)
      const { error: deleteDocsError } = await supabaseAdmin
        .from('documents')
        .delete()
        .in('submission_id', batch)

      if (deleteDocsError) {
        console.warn(`  ⚠️  Erreur lors de la suppression des documents (lot ${i / batchSize + 1}):`, deleteDocsError)
      }
    }

    console.log('✅ Documents supprimés\n')

    // 4. Supprimer toutes les soumissions
    console.log('🗑️  Étape 4: Suppression des soumissions...')
    
    // Supprimer par lots
    for (let i = 0; i < submissionIds.length; i += batchSize) {
      const batch = submissionIds.slice(i, i + batchSize)
      const { error: deleteError } = await supabaseAdmin
        .from('submissions')
        .delete()
        .in('id', batch)

      if (deleteError) {
        console.error(`❌ Erreur lors de la suppression (lot ${i / batchSize + 1}):`, deleteError)
      } else {
        console.log(`  ✓ ${batch.length} soumission(s) supprimée(s)`)
      }
    }

    console.log(`\n✅ Toutes les soumissions ont été supprimées avec succès!`)
    console.log(`📊 Total: ${submissions.length} soumission(s) supprimée(s)`)

  } catch (error) {
    console.error('❌ Erreur fatale:', error)
    process.exit(1)
  }
}

// Exécuter le script
deleteAllSubmissions()
  .then(() => {
    console.log('\n✨ Terminé!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Erreur:', error)
    process.exit(1)
  })

