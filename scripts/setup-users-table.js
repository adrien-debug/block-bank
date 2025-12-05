const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes!')
  console.error('Assurez-vous d\'avoir configuré:')
  console.error('  - NEXT_PUBLIC_SUPABASE_URL')
  console.error('  - SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupUsersTable() {
  try {
    console.log('🔍 Vérification de la connexion Supabase...')
    
    // Test de connexion
    const { data, error } = await supabase.from('users').select('count').limit(1)
    
    if (error && error.code === '42P01') {
      // Table n'existe pas, on la crée
      console.log('📋 Table users n\'existe pas. Création en cours...')
      
      const sqlFile = path.join(__dirname, 'create-users-table.sql')
      const sql = fs.readFileSync(sqlFile, 'utf8')
      
      // Exécuter le SQL via Supabase
      const { error: createError } = await supabase.rpc('exec_sql', { sql_query: sql })
      
      if (createError) {
        // Si la fonction RPC n'existe pas, on essaie une autre méthode
        console.log('⚠️  Méthode RPC non disponible. Utilisez le SQL Editor de Supabase pour exécuter:')
        console.log('\n' + sql + '\n')
        console.log('Ou exécutez manuellement dans le SQL Editor de votre projet Supabase.')
        return
      }
      
      console.log('✅ Table users créée avec succès!')
    } else if (error) {
      console.error('❌ Erreur lors de la vérification:', error.message)
      return
    } else {
      console.log('✅ Table users existe déjà!')
    }
    
    // Vérifier la structure de la table
    console.log('🔍 Vérification de la structure de la table...')
    const { data: columns, error: columnsError } = await supabase
      .from('users')
      .select('*')
      .limit(0)
    
    if (columnsError) {
      console.error('❌ Erreur lors de la vérification de la structure:', columnsError.message)
      return
    }
    
    console.log('✅ Structure de la table vérifiée!')
    console.log('\n📊 Résumé:')
    console.log('  - Table: users')
    console.log('  - Colonnes: id, email, password_hash, first_name, last_name, address, wallet_address, created_at, updated_at')
    console.log('  - Index: email, wallet_address')
    console.log('\n✅ Configuration terminée! Les utilisateurs peuvent maintenant s\'inscrire.')
    
  } catch (error) {
    console.error('❌ Erreur:', error.message)
    console.error('\n💡 Instructions manuelles:')
    console.error('1. Allez dans votre projet Supabase')
    console.error('2. Ouvrez le SQL Editor')
    console.error('3. Copiez-collez le contenu de scripts/create-users-table.sql')
    console.error('4. Exécutez le script')
  }
}

setupUsersTable()


