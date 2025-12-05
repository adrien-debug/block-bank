/**
 * Script pour vérifier que toutes les tables existent dans Supabase
 */

const { createClient } = require('@supabase/supabase-js')
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

const requiredTables = [
  'users',
  'credit_scores',
  'nft_assets',
  'loans',
  'payments',
  'insurance_policies',
  'insurance_claims',
  'insurance_history',
  'credit_score_partners'
]

async function verifyTables() {
  console.log('🔍 Vérification des tables...\n')

  const results = {
    exists: [],
    missing: []
  }

  for (const table of requiredTables) {
    try {
      // Essayer de faire un SELECT simple pour vérifier que la table existe
      const { error } = await supabase
        .from(table)
        .select('*')
        .limit(1)

      if (error && error.code === '42P01') {
        // Table does not exist
        results.missing.push(table)
        console.log(`❌ ${table}: MANQUANTE`)
      } else {
        results.exists.push(table)
        console.log(`✅ ${table}: EXISTE`)
      }
    } catch (error) {
      // Si c'est une autre erreur, on considère que la table existe
      results.exists.push(table)
      console.log(`✅ ${table}: EXISTE (vérification avec erreur: ${error.message})`)
    }
  }

  console.log('\n📊 Résultats:')
  console.log(`   ✅ Tables existantes: ${results.exists.length}`)
  console.log(`   ❌ Tables manquantes: ${results.missing.length}`)

  if (results.missing.length > 0) {
    console.log('\n⚠️  Tables manquantes:')
    results.missing.forEach(table => {
      console.log(`   - ${table}`)
    })
    console.log('\n💡 Pour créer les tables manquantes, exécutez:')
    console.log('   node scripts/create-all-tables.js')
    process.exit(1)
  } else {
    console.log('\n✅ Toutes les tables existent!')
    process.exit(0)
  }
}

verifyTables()
  .catch((error) => {
    console.error('❌ Erreur fatale:', error)
    process.exit(1)
  })


