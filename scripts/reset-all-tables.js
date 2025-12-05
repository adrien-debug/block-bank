/**
 * Script pour réinitialiser toutes les tables (vider les données)
 * ATTENTION: Ce script supprime TOUTES les données !
 * Usage: node scripts/reset-all-tables.js
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

async function resetAllTables() {
  console.log('⚠️  ATTENTION: Ce script va supprimer TOUTES les données!\n')
  console.log('📋 Tables qui seront vidées:')
  console.log('   - insurance_claims')
  console.log('   - insurance_history')
  console.log('   - insurance_policies')
  console.log('   - payments')
  console.log('   - loans')
  console.log('   - nft_assets')
  console.log('   - credit_score_partners')
  console.log('   - credit_scores')
  console.log('   - documents')
  console.log('   - submissions')
  console.log('\n💡 La table users sera conservée (pour garder les comptes)\n')

  // Compter avant
  console.log('📊 Comptage avant réinitialisation...')
  const before = {
    credit_scores: await supabase.from('credit_scores').select('*', { count: 'exact', head: true }),
    loans: await supabase.from('loans').select('*', { count: 'exact', head: true }),
    nft_assets: await supabase.from('nft_assets').select('*', { count: 'exact', head: true }),
    submissions: await supabase.from('submissions').select('*', { count: 'exact', head: true }),
    users: await supabase.from('users').select('*', { count: 'exact', head: true }),
  }

  console.log(`   Credit scores: ${before.credit_scores.count || 0}`)
  console.log(`   Prêts: ${before.loans.count || 0}`)
  console.log(`   NFT assets: ${before.nft_assets.count || 0}`)
  console.log(`   Soumissions: ${before.submissions.count || 0}`)
  console.log(`   Utilisateurs: ${before.users.count || 0} (sera conservé)\n`)

  try {
    // Supprimer dans l'ordre (enfants d'abord)
    console.log('🗑️  Suppression des données...\n')

    const tables = [
      'insurance_claims',
      'insurance_history',
      'insurance_policies',
      'payments',
      'loans',
      'nft_assets',
      'credit_score_partners',
      'credit_scores',
      'documents',
      'submissions'
    ]

    for (const table of tables) {
      console.log(`   Suppression de ${table}...`)
      const { error } = await supabase
        .from(table)
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000') // Condition toujours vraie pour tout supprimer

      if (error) {
        console.error(`   ❌ Erreur ${table}:`, error.message)
      } else {
        console.log(`   ✅ ${table} vidée`)
      }
    }

    // Vérification après
    console.log('\n📊 Vérification après réinitialisation...')
    const after = {
      credit_scores: await supabase.from('credit_scores').select('*', { count: 'exact', head: true }),
      loans: await supabase.from('loans').select('*', { count: 'exact', head: true }),
      nft_assets: await supabase.from('nft_assets').select('*', { count: 'exact', head: true }),
      submissions: await supabase.from('submissions').select('*', { count: 'exact', head: true }),
      users: await supabase.from('users').select('*', { count: 'exact', head: true }),
    }

    console.log(`   Credit scores: ${after.credit_scores.count || 0}`)
    console.log(`   Prêts: ${after.loans.count || 0}`)
    console.log(`   NFT assets: ${after.nft_assets.count || 0}`)
    console.log(`   Soumissions: ${after.submissions.count || 0}`)
    console.log(`   Utilisateurs: ${after.users.count || 0} (conservé)\n`)

    console.log('✅ Toutes les tables ont été réinitialisées!')
    console.log('\n📝 Prochaines étapes:')
    console.log('   1. Connectez-vous à l\'application')
    console.log('   2. Allez sur votre profil')
    console.log('   3. Liez votre adresse wallet')
    console.log('   4. Uploadez vos documents')

  } catch (error) {
    console.error('❌ Erreur:', error.message)
    process.exit(1)
  }
}

resetAllTables()
