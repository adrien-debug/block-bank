/**
 * Script pour créer la table user_documents et vérifier le bucket de stockage
 * Usage: node scripts/setup-user-documents.js
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement manquantes')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function setupUserDocuments() {
  console.log('🚀 Configuration de la table user_documents...\n')

  try {
    // Lire le script SQL
    const sqlPath = path.join(__dirname, 'create-user-documents-table.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')

    console.log('📝 Script SQL chargé')
    console.log('\n⚠️  IMPORTANT:')
    console.log('   Ce script nécessite l\'exécution manuelle du SQL dans Supabase.')
    console.log('   Le script Node.js ne peut pas exécuter directement les commandes DDL.\n')
    console.log('📋 Étapes:')
    console.log('   1. Allez sur https://supabase.com')
    console.log('   2. Sélectionnez votre projet')
    console.log('   3. SQL Editor > New query')
    console.log('   4. Copiez le contenu de scripts/create-user-documents-table.sql')
    console.log('   5. Exécutez le script\n')

    // Vérifier si la table existe déjà
    console.log('🔍 Vérification de la table user_documents...')
    const { data: testData, error: tableError } = await supabase
      .from('user_documents')
      .select('id')
      .limit(1)

    if (tableError) {
      if (tableError.code === '42P01') {
        console.log('❌ La table user_documents n\'existe pas encore')
        console.log('   Exécutez le script SQL dans Supabase SQL Editor\n')
      } else {
        console.error('❌ Erreur:', tableError.message)
      }
    } else {
      console.log('✅ La table user_documents existe déjà!')
      
      // Compter les documents
      const { count } = await supabase
        .from('user_documents')
        .select('*', { count: 'exact', head: true })
      
      console.log(`   ${count || 0} document(s) enregistré(s)\n`)
    }

    // Vérifier le bucket de stockage
    console.log('🔍 Vérification du bucket de stockage...')
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets()

    if (bucketError) {
      console.error('❌ Erreur récupération buckets:', bucketError.message)
    } else {
      const userDocsBucket = buckets?.find(b => b.name === 'user-documents')
      if (userDocsBucket) {
        console.log('✅ Bucket user-documents existe')
        console.log(`   ID: ${userDocsBucket.id}`)
        console.log(`   Public: ${userDocsBucket.public ? 'Oui' : 'Non (privé)'}`)
      } else {
        console.log('⚠️  Bucket user-documents n\'existe pas')
        console.log('\n📋 Pour créer le bucket:')
        console.log('   1. Allez dans Supabase > Storage')
        console.log('   2. Cliquez sur "New bucket"')
        console.log('   3. Nom: user-documents')
        console.log('   4. Public: Non (privé)')
        console.log('   5. Créez le bucket\n')
      }
    }

    console.log('✅ Configuration terminée!')
    console.log('\n📝 Prochaines étapes:')
    console.log('   1. Exécutez le script SQL dans Supabase SQL Editor')
    console.log('   2. Créez le bucket user-documents dans Supabase Storage')
    console.log('   3. Testez l\'upload de documents depuis le profil')

  } catch (error) {
    console.error('❌ Erreur:', error.message)
    process.exit(1)
  }
}

setupUserDocuments()
