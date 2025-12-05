/**
 * Script pour vérifier la structure de la table users
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

async function checkUsersTable() {
  console.log('🔍 Vérification de la structure de la table users...\n')

  try {
    // Essayer d'insérer un utilisateur de test pour voir quelle erreur on obtient
    const testData = {
      email: 'test-check@example.com',
      password_hash: 'test',
      first_name: 'Test',
      last_name: 'User',
      address: 'Test Address',
      role: 'user'
    }

    const { data, error } = await supabase
      .from('users')
      .insert(testData)
      .select()

    if (error) {
      console.log('❌ Erreur lors de l\'insertion de test:')
      console.log('   Code:', error.code)
      console.log('   Message:', error.message)
      console.log('   Details:', error.details)
      console.log('   Hint:', error.hint)
      
      if (error.message.includes('column') && error.message.includes('does not exist')) {
        console.log('\n⚠️  La colonne "role" n\'existe probablement pas dans la table users!')
        console.log('💡 Exécutez: node scripts/add-role-column-to-users.js')
      }
    } else {
      console.log('✅ Structure OK - Test réussi')
      // Supprimer l'utilisateur de test
      await supabase
        .from('users')
        .delete()
        .eq('email', 'test-check@example.com')
    }
  } catch (error) {
    console.error('❌ Erreur:', error)
  }
}

checkUsersTable()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Erreur fatale:', error)
    process.exit(1)
  })


