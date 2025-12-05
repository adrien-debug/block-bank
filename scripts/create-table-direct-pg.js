/**
 * Script pour créer la table users directement via PostgreSQL
 * Utilise la connection string fournie
 */

require('dotenv').config({ path: '.env.local' })
const { Client } = require('pg')
const fs = require('fs')
const path = require('path')

// Connection string
const connectionString = 'postgresql://postgres:Adrien0334$$@db.ipamfhfzflprptchlaei.supabase.co:5432/postgres'

async function createTable() {
  console.log('\n🚀 Création de la table users dans Supabase\n')
  console.log('='.repeat(60))

  const client = new Client({
    connectionString: connectionString,
    ssl: {
      rejectUnauthorized: false // Supabase nécessite SSL
    }
  })

  try {
    // Se connecter
    console.log('📡 Connexion à la base de données...')
    await client.connect()
    console.log('✅ Connecté à Supabase\n')

    // Vérifier si la table existe déjà
    console.log('📋 Vérification de l\'existence de la table users...')
    const checkTable = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `)

    if (checkTable.rows[0].exists) {
      console.log('⚠️  La table users existe déjà')
      
      // Vérifier si la colonne role existe
      const checkColumn = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = 'users' 
          AND column_name = 'role'
        );
      `)

      if (checkColumn.rows[0].exists) {
        console.log('✅ La colonne role existe déjà')
        console.log('\n✅ Table déjà configurée - Aucune action nécessaire\n')
        await client.end()
        return { success: true, alreadyExists: true }
      } else {
        console.log('❌ La colonne role n\'existe pas')
        console.log('📝 Ajout de la colonne role...\n')
        
        // Ajouter la colonne role
        await client.query(`
          ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';
          UPDATE users SET role = 'user' WHERE role IS NULL;
          CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
        `)
        
        console.log('✅ Colonne role ajoutée avec succès\n')
        await client.end()
        return { success: true }
      }
    }

    // Lire le fichier SQL
    console.log('📝 Lecture du script SQL...')
    const sqlFile = path.join(__dirname, 'setup-users-table-complete.sql')
    const sql = fs.readFileSync(sqlFile, 'utf-8')

    // Exécuter le SQL
    console.log('🔨 Exécution du script SQL...\n')
    await client.query(sql)

    console.log('✅ Table users créée avec succès!')
    console.log('✅ Colonne role ajoutée')
    console.log('✅ Index créés')
    console.log('✅ Trigger créé\n')

    // Vérifier la création
    console.log('🔍 Vérification de la table...')
    const verify = await client.query(`
      SELECT column_name, data_type, column_default
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position;
    `)

    console.log('\n📊 Colonnes de la table users:')
    verify.rows.forEach((row, index) => {
      console.log(`   ${index + 1}. ${row.column_name} (${row.data_type})${row.column_default ? ' - Default: ' + row.column_default : ''}`)
    })

    await client.end()

    console.log('\n' + '='.repeat(60))
    console.log('✅ MIGRATION RÉUSSIE!')
    console.log('='.repeat(60))
    console.log('\nLa table users est maintenant prête pour l\'authentification.\n')

    return { success: true }

  } catch (error) {
    console.error('\n❌ Erreur lors de la création de la table:', error.message)
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
    const result = await createTable()
    
    if (result.success) {
      console.log('🎉 Prochaine étape:')
      console.log('   → Vérifiez avec: node scripts/setup-auth-complete.js')
      console.log('   → Testez l\'inscription sur http://localhost:1001\n')
      process.exit(0)
    } else {
      process.exit(1)
    }
  } catch (error) {
    console.error('\n❌ Erreur fatale:', error.message)
    process.exit(1)
  }
}

main()


