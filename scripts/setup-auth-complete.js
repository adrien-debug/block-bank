/**
 * Script complet pour configurer l'authentification avec la table users et la colonne role
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes')
  console.error('   Assurez-vous que NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont définies dans .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function checkTableExists() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .limit(1)

    if (error) {
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        return false
      }
      throw error
    }
    return true
  } catch (error) {
    if (error.code === '42P01' || error.message?.includes('does not exist')) {
      return false
    }
    throw error
  }
}

async function checkColumnExists() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .limit(1)

    if (error) {
      if (error.code === '42703' || error.message?.includes('column') || error.message?.includes('does not exist')) {
        return false
      }
      throw error
    }
    return true
  } catch (error) {
    if (error.code === '42703' || error.message?.includes('column')) {
      return false
    }
    throw error
  }
}

async function main() {
  console.log('\n🚀 Configuration de l\'authentification avec système de rôles\n')
  console.log('='.repeat(60))

  try {
    // Vérifier si la table existe
    console.log('📋 Vérification de la table users...')
    const tableExists = await checkTableExists()

    if (!tableExists) {
      console.log('❌ La table users n\'existe pas encore')
      console.log('\n📝 Création de la table nécessaire...\n')
      console.log('🔧 INSTRUCTIONS:\n')
      console.log('   1. Ouvrez Supabase Dashboard: https://supabase.com/dashboard')
      console.log('   2. Sélectionnez votre projet')
      console.log('   3. Allez dans SQL Editor (menu de gauche)')
      console.log('   4. Cliquez sur "New Query"')
      console.log('   5. Copiez-collez le contenu du fichier: scripts/setup-users-table-complete.sql')
      console.log('   6. Cliquez sur "Run" (ou Cmd/Ctrl + Enter)')
      console.log('   7. Vérifiez que la table a été créée\n')

      const sqlFile = path.join(__dirname, 'setup-users-table-complete.sql')
      if (fs.existsSync(sqlFile)) {
        console.log(`✅ Fichier SQL prêt: ${sqlFile}\n`)
      }

      console.log('='.repeat(60))
      console.log('📝 ACTION REQUISE: Créer la table users')
      console.log('='.repeat(60))
      console.log('\nAprès avoir créé la table, relancez ce script.\n')
      process.exit(0)
    }

    console.log('✅ La table users existe')

    // Vérifier si la colonne role existe
    console.log('📋 Vérification de la colonne role...')
    const columnExists = await checkColumnExists()

    if (!columnExists) {
      console.log('❌ La colonne role n\'existe pas encore')
      console.log('\n📝 Ajout de la colonne role nécessaire...\n')
      console.log('🔧 INSTRUCTIONS:\n')
      console.log('   1. Ouvrez Supabase Dashboard: https://supabase.com/dashboard')
      console.log('   2. Sélectionnez votre projet')
      console.log('   3. Allez dans SQL Editor (menu de gauche)')
      console.log('   4. Cliquez sur "New Query"')
      console.log('   5. Copiez-collez le contenu du fichier: scripts/add-role-column-simple.sql')
      console.log('   6. Cliquez sur "Run" (ou Cmd/Ctrl + Enter)')
      console.log('   7. Vérifiez que la colonne a été ajoutée\n')

      const sqlFile = path.join(__dirname, 'add-role-column-simple.sql')
      if (fs.existsSync(sqlFile)) {
        console.log(`✅ Fichier SQL prêt: ${sqlFile}\n`)
      }

      console.log('='.repeat(60))
      console.log('📝 ACTION REQUISE: Ajouter la colonne role')
      console.log('='.repeat(60))
      console.log('\nAprès avoir ajouté la colonne, relancez ce script.\n')
      process.exit(0)
    }

    console.log('✅ La colonne role existe')

    // Vérifier que les utilisateurs existants ont un rôle
    console.log('📋 Vérification des utilisateurs existants...')
    const { data: usersWithoutRole, error: checkError } = await supabase
      .from('users')
      .select('id, email, role')
      .is('role', null)
      .limit(10)

    if (checkError) {
      console.log('⚠️  Impossible de vérifier les utilisateurs sans rôle')
    } else if (usersWithoutRole && usersWithoutRole.length > 0) {
      console.log(`⚠️  ${usersWithoutRole.length} utilisateur(s) sans rôle détecté(s)`)
      console.log('   Exécutez ce SQL pour corriger:')
      console.log('   UPDATE users SET role = \'user\' WHERE role IS NULL;\n')
    } else {
      console.log('✅ Tous les utilisateurs ont un rôle défini')
    }

    console.log('\n' + '='.repeat(60))
    console.log('✅ Configuration complète - Système de rôles prêt!')
    console.log('='.repeat(60))
    console.log('\nVous pouvez maintenant:')
    console.log('  1. Tester la connexion email/mdp')
    console.log('  2. Tester la connexion wallet')
    console.log('  3. Créer un utilisateur admin (UPDATE users SET role = \'admin\' WHERE email = \'...\')')
    console.log('  4. Vérifier les redirections selon les rôles\n')

  } catch (error) {
    console.error('\n❌ Erreur:', error.message)
    if (error.details) {
      console.error('   Détails:', error.details)
    }
    if (error.hint) {
      console.error('   Indice:', error.hint)
    }
    process.exit(1)
  }
}

main()

