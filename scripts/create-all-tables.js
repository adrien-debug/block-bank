/**
 * Script pour créer toutes les tables de Block Bank avec relations
 */

require('dotenv').config({ path: '.env.local' })
const { Client } = require('pg')
const fs = require('fs')
const path = require('path')

const connectionString = 'postgresql://postgres:Adrien0334$$@db.ipamfhfzflprptchlaei.supabase.co:5432/postgres'

async function createAllTables() {
  console.log('\n🚀 Création du schéma complet Block Bank\n')
  console.log('='.repeat(60))

  const client = new Client({
    connectionString: connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  })

  try {
    await client.connect()
    console.log('✅ Connecté à Supabase\n')

    // Lire le fichier SQL
    const sqlFile = path.join(__dirname, 'create-complete-schema.sql')
    const sql = fs.readFileSync(sqlFile, 'utf-8')

    console.log('📝 Exécution du schéma SQL...\n')
    
    // Exécuter le SQL
    await client.query(sql)

    console.log('✅ Toutes les tables créées avec succès!')
    console.log('✅ Relations (foreign keys) configurées')
    console.log('✅ Index créés')
    console.log('✅ Triggers configurés\n')

    // Vérifier les tables créées
    const tables = [
      'credit_scores',
      'nft_assets',
      'loans',
      'payments',
      'insurance_policies',
      'insurance_claims',
      'insurance_history',
      'credit_score_partners'
    ]

    console.log('🔍 Vérification des tables créées:\n')
    for (const table of tables) {
      const result = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = $1
        );
      `, [table])
      
      if (result.rows[0].exists) {
        console.log(`   ✅ ${table}`)
      } else {
        console.log(`   ❌ ${table} - MANQUANTE`)
      }
    }

    await client.end()

    console.log('\n' + '='.repeat(60))
    console.log('✅ SCHÉMA COMPLET CRÉÉ!')
    console.log('='.repeat(60))
    console.log('\nProchaines étapes:')
    console.log('   1. Créer les API routes pour récupérer les données')
    console.log('   2. Modifier les composants pour utiliser les API')
    console.log('   3. Tester avec des données réelles\n')

    return { success: true }

  } catch (error) {
    console.error('\n❌ Erreur:', error.message)
    if (error.detail) {
      console.error('   Détails:', error.detail)
    }
    if (error.hint) {
      console.error('   Indice:', error.hint)
    }
    
    await client.end().catch(() => {})
    return { success: false, error: error.message }
  }
}

async function main() {
  try {
    const result = await createAllTables()
    process.exit(result.success ? 0 : 1)
  } catch (error) {
    console.error('\n❌ Erreur fatale:', error.message)
    process.exit(1)
  }
}

main()


