/**
 * Script de test de connexion Supabase
 * 
 * Usage: npx tsx scripts/test-supabase-connection.ts
 */

// Charger les variables d'environnement AVANT tout autre import
import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

// Vérifier que les variables sont chargées
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Variables d\'environnement manquantes!')
  console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅' : '❌')
  console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅' : '❌')
  process.exit(1)
}

// Créer le client Supabase directement ici pour éviter les problèmes d'import
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function testConnection() {
  console.log('🔍 Test de connexion Supabase...\n')

  try {
    // Test 1: Vérifier les variables d'environnement
    console.log('1️⃣ Vérification des variables d\'environnement...')
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url) {
      console.error('❌ NEXT_PUBLIC_SUPABASE_URL manquante')
      return
    }
    console.log('   ✅ NEXT_PUBLIC_SUPABASE_URL:', url.substring(0, 30) + '...')

    if (!serviceKey) {
      console.error('❌ SUPABASE_SERVICE_ROLE_KEY manquante')
      console.log('   💡 Ajoutez-la dans .env.local')
      return
    }
    console.log('   ✅ SUPABASE_SERVICE_ROLE_KEY:', serviceKey.substring(0, 20) + '...')

    // Test 2: Vérifier la connexion à la base de données
    console.log('\n2️⃣ Test de connexion à la base de données...')
    const { data, error } = await supabaseAdmin
      .from('submissions')
      .select('count')
      .limit(1)

    if (error) {
      console.error('   ❌ Erreur de connexion:', error.message)
      if (error.message.includes('relation') || error.message.includes('does not exist')) {
        console.log('   💡 Les tables n\'existent pas encore. Exécutez le script SQL dans Supabase Dashboard.')
      }
      return
    }
    console.log('   ✅ Connexion réussie à la base de données')

    // Test 3: Vérifier le bucket Storage
    console.log('\n3️⃣ Test du bucket Storage...')
    const { data: buckets, error: bucketError } = await supabaseAdmin.storage.listBuckets()

    if (bucketError) {
      console.error('   ❌ Erreur Storage:', bucketError.message)
      return
    }

    const submissionsBucket = buckets?.find(b => b.name === 'submissions')
    if (!submissionsBucket) {
      console.log('   ⚠️  Bucket "submissions" non trouvé')
      console.log('   💡 Créez le bucket "submissions" dans Supabase Dashboard > Storage')
    } else {
      console.log('   ✅ Bucket "submissions" trouvé')
    }

    // Test 4: Vérifier les tables
    console.log('\n4️⃣ Vérification des tables...')
    const { data: submissions, error: submissionsError } = await supabaseAdmin
      .from('submissions')
      .select('id')
      .limit(1)

    if (submissionsError) {
      console.error('   ❌ Table "submissions" non accessible:', submissionsError.message)
      console.log('   💡 Exécutez le script supabase-setup.sql dans Supabase Dashboard')
    } else {
      console.log('   ✅ Table "submissions" accessible')
    }

    const { data: documents, error: documentsError } = await supabaseAdmin
      .from('documents')
      .select('id')
      .limit(1)

    if (documentsError) {
      console.error('   ❌ Table "documents" non accessible:', documentsError.message)
      console.log('   💡 Exécutez le script supabase-setup.sql dans Supabase Dashboard')
    } else {
      console.log('   ✅ Table "documents" accessible')
    }

    console.log('\n✅ Tous les tests sont passés!')
    console.log('🚀 Votre configuration Supabase est prête!')

  } catch (error) {
    console.error('\n❌ Erreur fatale:', error instanceof Error ? error.message : error)
    process.exit(1)
  }
}

testConnection()

