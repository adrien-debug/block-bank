/**
 * Script pour ajouter la colonne role à la table users
 * Utilise l'API Supabase pour vérifier et créer la colonne si nécessaire
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

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

async function checkColumnExists() {
  try {
    // Essayer de sélectionner la colonne role
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .limit(1)

    if (error) {
      // Si l'erreur indique que la colonne n'existe pas
      if (error.code === '42703' || error.message?.includes('column') || error.message?.includes('does not exist')) {
        return false
      }
      throw error
    }
    return true
  } catch (error) {
    // Si on ne peut pas vérifier, on assume que la colonne n'existe pas
    if (error.code === '42703' || error.message?.includes('column')) {
      return false
    }
    throw error
  }
}

async function addRoleColumn() {
  console.log('\n🚀 Migration : Ajout de la colonne role à la table users\n')
  console.log('='.repeat(60))

  try {
    // Vérifier si la colonne existe déjà
    console.log('📋 Vérification de l\'existence de la colonne role...')
    const columnExists = await checkColumnExists()

    if (columnExists) {
      console.log('✅ La colonne role existe déjà dans la table users')
      
      // Vérifier que les utilisateurs existants ont un rôle
      const { data: usersWithoutRole, error: checkError } = await supabase
        .from('users')
        .select('id, email, role')
        .is('role', null)
        .limit(10)

      if (checkError) {
        console.log('⚠️  Impossible de vérifier les utilisateurs sans rôle')
      } else if (usersWithoutRole && usersWithoutRole.length > 0) {
        console.log(`\n⚠️  ${usersWithoutRole.length} utilisateur(s) sans rôle détecté(s)`)
        console.log('   Mise à jour en cours...')
        
        const { error: updateError } = await supabase
          .from('users')
          .update({ role: 'user' })
          .is('role', null)

        if (updateError) {
          console.log('❌ Erreur lors de la mise à jour:', updateError.message)
        } else {
          console.log('✅ Tous les utilisateurs ont maintenant un rôle')
        }
      } else {
        console.log('✅ Tous les utilisateurs ont un rôle défini')
      }
      
      console.log('\n' + '='.repeat(60))
      console.log('✅ Migration déjà effectuée - Aucune action nécessaire')
      console.log('='.repeat(60) + '\n')
      return { success: true, alreadyExists: true }
    }

    console.log('❌ La colonne role n\'existe pas encore')
    console.log('\n📝 Exécution de la migration SQL...\n')

    // Le client Supabase JS ne peut pas exécuter directement du DDL
    // Nous devons utiliser l'API Management ou exécuter manuellement
    console.log('⚠️  Le client Supabase JS ne peut pas exécuter de DDL directement')
    console.log('   Nous allons utiliser une approche alternative...\n')

    // Approche alternative : utiliser une fonction RPC ou exécuter via l'API REST
    // Pour l'instant, on va créer un script SQL simplifié et donner des instructions

    const sqlStatements = [
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';",
      "UPDATE users SET role = 'user' WHERE role IS NULL;",
      "CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);"
    ]

    console.log('📝 SQL à exécuter dans Supabase Dashboard:\n')
    sqlStatements.forEach((sql, index) => {
      console.log(`   ${index + 1}. ${sql}`)
    })

    console.log('\n🔧 INSTRUCTIONS:\n')
    console.log('   1. Ouvrez Supabase Dashboard: https://supabase.com/dashboard')
    console.log('   2. Sélectionnez votre projet')
    console.log('   3. Allez dans SQL Editor (menu de gauche)')
    console.log('   4. Cliquez sur "New Query"')
    console.log('   5. Copiez-collez les commandes SQL ci-dessus')
    console.log('   6. Cliquez sur "Run" (ou Cmd/Ctrl + Enter)')
    console.log('   7. Vérifiez que la colonne a été créée\n')

    // Créer un fichier SQL pour faciliter l'exécution
    const fs = require('fs')
    const path = require('path')
    const sqlFile = path.join(__dirname, 'add-role-column-simple.sql')
    const sqlContent = sqlStatements.join('\n\n') + '\n'
    fs.writeFileSync(sqlFile, sqlContent)
    console.log(`✅ Fichier SQL créé: ${sqlFile}`)
    console.log('   Vous pouvez copier ce fichier et l\'exécuter dans Supabase Dashboard\n')

    console.log('='.repeat(60))
    console.log('📝 ACTION MANUELLE REQUISE')
    console.log('='.repeat(60))
    console.log('\nAprès avoir exécuté le SQL, relancez ce script pour vérifier.\n')

    return { success: false, needsManual: true }

  } catch (error) {
    console.error('\n❌ Erreur lors de la migration:', error.message)
    if (error.details) {
      console.error('   Détails:', error.details)
    }
    if (error.hint) {
      console.error('   Indice:', error.hint)
    }
    process.exit(1)
  }
}

async function main() {
  try {
    const result = await addRoleColumn()
    
    if (result.success && result.alreadyExists) {
      console.log('✅ Migration vérifiée - Tout est en ordre!\n')
      process.exit(0)
    } else if (result.needsManual) {
      console.log('⚠️  Veuillez exécuter le SQL manuellement dans Supabase Dashboard\n')
      process.exit(0)
    }
  } catch (error) {
    console.error('\n❌ Erreur fatale:', error.message)
    process.exit(1)
  }
}

main()

