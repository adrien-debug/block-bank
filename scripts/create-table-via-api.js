/**
 * Tentative de création de la table via l'API Supabase directement
 * Utilise fetch pour appeler l'API REST
 */

require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement manquantes')
  process.exit(1)
}

// Extraire le project reference
const projectRef = supabaseUrl.match(/https?:\/\/([^.]+)\.supabase\.co/)?.[1]

async function createTableViaAPI() {
  console.log('\n🚀 Tentative de création de la table via API Supabase\n')
  console.log('='.repeat(60))

  // L'API Supabase REST standard ne permet pas d'exécuter du DDL
  // Nous devons utiliser l'API Management ou créer via des requêtes HTTP POST
  
  // Option: Utiliser l'endpoint /rest/v1/ avec des requêtes POST
  // Mais cela ne fonctionne que pour INSERT, UPDATE, DELETE, pas CREATE TABLE
  
  // La seule façon d'automatiser serait:
  // 1. Supabase CLI (si installé)
  // 2. Management API avec access token
  // 3. Créer une fonction RPC dans Supabase qui exécute le SQL
  
  console.log('📋 Informations du projet:')
  console.log(`   URL: ${supabaseUrl}`)
  console.log(`   Project Ref: ${projectRef}\n`)

  // Essayer de créer via une requête HTTP POST directe
  // Note: Cela ne fonctionnera probablement pas car Supabase ne permet pas
  // d'exécuter du DDL via l'API REST standard
  
  const sql = `
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  address TEXT,
  wallet_address VARCHAR(42),
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
  `.trim()

  console.log('⚠️  L\'API REST Supabase ne permet pas d\'exécuter du DDL directement')
  console.log('   (CREATE TABLE, ALTER TABLE, etc.)\n')
  
  console.log('💡 Solutions possibles:\n')
  console.log('   1. ✅ Utiliser Supabase Dashboard (recommandé)')
  console.log('      → https://supabase.com/dashboard/project/' + projectRef + '/sql/new')
  console.log('      → Copier scripts/setup-users-table-complete.sql')
  console.log('      → Exécuter\n')
  
  console.log('   2. 🔧 Utiliser Supabase CLI (si installé)')
  console.log('      → supabase db push')
  console.log('      → Ou créer un fichier migration\n')
  
  console.log('   3. 🔑 Utiliser Management API (nécessite access token)')
  console.log('      → Nécessite SUPABASE_ACCESS_TOKEN')
  console.log('      → Plus complexe à configurer\n')

  // Afficher le SQL formaté pour faciliter le copier-coller
  console.log('='.repeat(60))
  console.log('📋 SQL À EXÉCUTER (copier-coller):')
  console.log('='.repeat(60))
  console.log('\n' + sql + '\n')
  console.log('='.repeat(60) + '\n')

  return { success: false, needsManual: true, projectRef }
}

async function main() {
  try {
    const result = await createTableViaAPI()
    
    if (result.needsManual) {
      console.log('📝 Veuillez exécuter le SQL dans Supabase Dashboard')
      console.log('   Après exécution, vérifiez avec: node scripts/setup-auth-complete.js\n')
    }
  } catch (error) {
    console.error('\n❌ Erreur:', error.message)
    process.exit(1)
  }
}

main()

