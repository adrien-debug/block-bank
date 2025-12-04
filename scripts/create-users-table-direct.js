/**
 * Script pour créer la table users directement via l'API Supabase
 * Utilise l'API REST de Supabase pour exécuter du SQL
 */

require('dotenv').config({ path: '.env.local' })
const fs = require('fs')
const path = require('path')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes')
  process.exit(1)
}

// Extraire le project reference
const projectRef = supabaseUrl.match(/https?:\/\/([^.]+)\.supabase\.co/)?.[1]

if (!projectRef) {
  console.error('❌ Impossible d\'extraire le project reference')
  process.exit(1)
}

async function createTableViaRPC() {
  console.log('\n🚀 Création de la table users via Supabase\n')
  console.log('='.repeat(60))

  try {
    const { createClient } = require('@supabase/supabase-js')
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Lire le SQL
    const sqlFile = path.join(__dirname, 'setup-users-table-complete.sql')
    const sql = fs.readFileSync(sqlFile, 'utf-8')

    // Le client Supabase JS ne peut pas exécuter directement du DDL
    // Nous devons utiliser l'API Management ou créer une fonction RPC
    
    // Option 1: Essayer via une fonction RPC (si elle existe)
    console.log('📝 Tentative de création via fonction RPC...\n')

    // Créer une fonction temporaire qui exécute le SQL
    const createFunctionSQL = `
      CREATE OR REPLACE FUNCTION create_users_table()
      RETURNS void
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        ${sql.replace(/--.*$/gm, '').replace(/\n\s*\n/g, '\n')}
      END;
      $$;
    `

    // Malheureusement, nous ne pouvons pas créer une fonction sans avoir déjà accès
    // Donc nous allons utiliser l'API REST directement

    console.log('⚠️  Le client Supabase JS ne peut pas exécuter du DDL directement')
    console.log('   Utilisation de l\'API REST Supabase...\n')

    // Utiliser l'API REST de Supabase pour exécuter du SQL
    // Note: Cela nécessite généralement l'API Management qui n'est pas accessible via le client JS standard
    
    // Alternative: Utiliser fetch pour appeler l'API directement
    const apiUrl = `${supabaseUrl}/rest/v1/rpc/exec_sql`
    
    // Mais cette fonction n'existe probablement pas par défaut
    
    // La meilleure approche est d'utiliser l'API Management de Supabase
    // qui nécessite un access token différent
    
    console.log('📋 SQL à exécuter:\n')
    console.log(sql.substring(0, 500) + '...\n')
    
    console.log('='.repeat(60))
    console.log('⚠️  EXÉCUTION AUTOMATIQUE NON POSSIBLE')
    console.log('='.repeat(60))
    console.log('\nLe client Supabase JS ne peut pas exécuter du DDL (CREATE TABLE)')
    console.log('directement pour des raisons de sécurité.\n')
    console.log('🔧 SOLUTION: Exécuter manuellement dans Supabase Dashboard\n')
    console.log('   1. Ouvrez: https://supabase.com/dashboard/project/' + projectRef)
    console.log('   2. Allez dans: SQL Editor (menu gauche)')
    console.log('   3. Cliquez sur: "New Query"')
    console.log('   4. Copiez le contenu de: scripts/setup-users-table-complete.sql')
    console.log('   5. Collez dans l\'éditeur')
    console.log('   6. Cliquez sur: "Run" (ou Cmd/Ctrl + Enter)\n')
    
    // Mais essayons quand même une approche alternative avec l'API REST
    console.log('🔄 Tentative alternative via API REST...\n')
    
    // Essayer d'utiliser l'endpoint SQL de Supabase (si disponible)
    // Note: Cette fonctionnalité peut ne pas être disponible selon la configuration
    
    return { success: false, needsManual: true, projectRef }
    
  } catch (error) {
    console.error('\n❌ Erreur:', error.message)
    return { success: false, error: error.message }
  }
}

async function tryDirectSQLExecution() {
  // Essayer d'utiliser l'API Management de Supabase
  // Cela nécessite un access token de management API
  
  const managementApiUrl = `https://api.supabase.com/v1/projects/${projectRef}`
  
  // Mais nous n'avons pas l'access token de management API
  // Il faudrait l'obtenir via l'interface Supabase ou les variables d'environnement
  
  console.log('💡 Pour automatiser complètement, vous auriez besoin de:')
  console.log('   - SUPABASE_ACCESS_TOKEN (Management API token)')
  console.log('   - Ou utiliser Supabase CLI\n')
  
  return false
}

async function main() {
  const result = await createTableViaRPC()
  
  if (result.needsManual) {
    // Essayer quand même avec une autre méthode
    const alternative = await tryDirectSQLExecution()
    
    if (!alternative) {
      console.log('='.repeat(60))
      console.log('📝 ACTION MANUELLE REQUISE')
      console.log('='.repeat(60))
      console.log('\nVeuillez exécuter le SQL dans Supabase Dashboard.')
      console.log('Après exécution, relancez: node scripts/setup-auth-complete.js\n')
    }
  }
}

main().catch(console.error)

