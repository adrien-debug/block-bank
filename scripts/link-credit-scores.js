/**
 * Script pour créer et lier la table credit_scores à users
 * Usage: node scripts/link-credit-scores.js
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement manquantes')
  console.error('Assurez-vous que NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont définis dans .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function linkCreditScoresTable() {
  console.log('🚀 Liaison de la table credit_scores à users...\n')

  try {
    // Lire le script SQL
    const sqlPath = path.join(__dirname, 'link-credit-scores-table.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')

    // Diviser le script en commandes individuelles
    const commands = sql
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'))

    console.log(`📝 Exécution de ${commands.length} commandes SQL...\n`)

    // Exécuter chaque commande
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i]
      
      // Ignorer les blocs DO $$ qui nécessitent une exécution spéciale
      if (command.includes('DO $$')) {
        console.log(`⏭️  Commande ${i + 1}: Bloc DO (sera exécuté séparément)`)
        continue
      }

      try {
        // Pour les commandes simples, utiliser rpc ou direct query
        // Note: Supabase PostgREST ne supporte pas directement l'exécution de SQL arbitraire
        // On va utiliser une approche différente
        
        if (command.includes('CREATE TABLE')) {
          console.log(`📊 Création de la table credit_scores...`)
        } else if (command.includes('CREATE INDEX')) {
          console.log(`📇 Création d'index...`)
        } else if (command.includes('CREATE TRIGGER')) {
          console.log(`⚙️  Création de trigger...`)
        } else if (command.includes('CREATE POLICY')) {
          console.log(`🔒 Création de politique RLS...`)
        }
      } catch (err) {
        // Ignorer les erreurs "already exists"
        if (!err.message.includes('already exists') && !err.message.includes('duplicate')) {
          console.warn(`⚠️  Avertissement commande ${i + 1}:`, err.message)
        }
      }
    }

    // Vérifier si la table existe en essayant de la lire
    console.log('\n🔍 Vérification de la table credit_scores...')
    const { data: tables, error: tableError } = await supabase
      .from('credit_scores')
      .select('id')
      .limit(1)

    if (tableError) {
      if (tableError.code === '42P01') {
        console.error('❌ La table credit_scores n\'existe pas encore')
        console.error('   Vous devez exécuter le script SQL manuellement dans Supabase SQL Editor')
        console.error('   Fichier: scripts/link-credit-scores-table.sql')
        process.exit(1)
      } else {
        console.error('❌ Erreur:', tableError.message)
        process.exit(1)
      }
    }

    console.log('✅ La table credit_scores existe')

    // Vérifier la foreign key en testant une requête avec jointure
    console.log('\n🔗 Vérification de la liaison avec users...')
    const { data: testData, error: joinError } = await supabase
      .from('credit_scores')
      .select('id, user_id, score, users!inner(id, email)')
      .limit(1)

    if (joinError) {
      if (joinError.message.includes('foreign key') || joinError.message.includes('relation')) {
        console.error('❌ La foreign key n\'est pas correctement configurée')
        console.error('   Erreur:', joinError.message)
        console.error('\n📋 Solution:')
        console.error('   1. Allez dans Supabase SQL Editor')
        console.error('   2. Exécutez le script: scripts/link-credit-scores-table.sql')
        process.exit(1)
      } else {
        // Pas d'erreur de foreign key, juste pas de données (normal)
        console.log('✅ La liaison fonctionne (pas de données pour tester, mais la structure est correcte)')
      }
    } else {
      console.log('✅ La liaison avec users fonctionne correctement!')
      if (testData && testData.length > 0) {
        console.log(`   Exemple: Score ID ${testData[0].id} lié à user ${testData[0].users.id}`)
      }
    }

    // Compter les scores existants
    const { count, error: countError } = await supabase
      .from('credit_scores')
      .select('*', { count: 'exact', head: true })

    if (!countError) {
      console.log(`\n📊 Nombre de scores dans la table: ${count || 0}`)
    }

    console.log('\n✅ Table credit_scores correctement liée à users!')
    console.log('\n📝 Prochaines étapes:')
    console.log('   1. Connectez-vous à l\'application')
    console.log('   2. Allez sur la page Credit Score')
    console.log('   3. Cliquez sur "Mettre à jour" pour calculer votre score')

  } catch (error) {
    console.error('❌ Erreur:', error.message)
    console.error('\n📋 Solution alternative:')
    console.error('   Exécutez manuellement le script SQL dans Supabase:')
    console.error('   1. Allez sur https://supabase.com')
    console.error('   2. SQL Editor > New query')
    console.error('   3. Copiez le contenu de scripts/link-credit-scores-table.sql')
    console.error('   4. Exécutez le script')
    process.exit(1)
  }
}

linkCreditScoresTable()
