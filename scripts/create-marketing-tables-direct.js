/**
 * Script pour créer automatiquement toutes les tables marketing dans Supabase
 * Utilise une connexion PostgreSQL directe
 */

require('dotenv').config({ path: '.env.local' })
const { Client } = require('pg')
const fs = require('fs')
const path = require('path')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes')
  console.error('   Vérifiez que .env.local contient:')
  console.error('   - NEXT_PUBLIC_SUPABASE_URL')
  console.error('   - SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

// Extraire les informations de connexion depuis l'URL Supabase
// Format: https://[project-ref].supabase.co
const projectRef = supabaseUrl.match(/https?:\/\/([^.]+)\.supabase\.co/)?.[1]

if (!projectRef) {
  console.error('❌ Impossible d\'extraire le project reference depuis l\'URL Supabase')
  process.exit(1)
}

// Construire l'URL de connexion PostgreSQL
// Format: postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
// Pour Supabase, on peut aussi utiliser: db.[project-ref].supabase.co:5432
// Le mot de passe est dans les settings du projet, mais on peut utiliser le service role key pour certaines opérations

// Construire l'URL de connexion PostgreSQL
// Essayer plusieurs sources
let databaseUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL

if (!databaseUrl) {
  // Essayer de lire depuis .env.local (même commenté)
  try {
    const envContent = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf-8')
    // Chercher DATABASE_URL même commenté
    const dbUrlMatch = envContent.match(/DATABASE_URL=(.+)/)
    if (dbUrlMatch) {
      const url = dbUrlMatch[1].trim()
      if (!url.startsWith('#')) {
        databaseUrl = url
      } else {
        // Extraire depuis le commentaire
        const commentedMatch = envContent.match(/#\s*DATABASE_URL=postgresql:\/\/postgres:([^@]+)@db\.([^.]+)\.supabase\.co:(\d+)\/(.+)/)
        if (commentedMatch) {
          const [, password, projRef, port, db] = commentedMatch
          databaseUrl = `postgresql://postgres:${password}@db.${projRef}.supabase.co:${port}/${db}`
        }
      }
    }
  } catch (e) {
    // Ignorer
  }
}

// Si toujours pas trouvé, construire depuis projectRef
if (!databaseUrl) {
  console.log('⚠️  DATABASE_URL non trouvé, tentative de construction automatique...')
  databaseUrl = `postgresql://postgres.${projectRef}:${encodeURIComponent(supabaseServiceKey.substring(0, 20))}@db.${projectRef}.supabase.co:5432/postgres`
}

async function createMarketingTables() {
  console.log('\n🚀 Création automatique des tables marketing dans Supabase')
  console.log('='.repeat(70))
  console.log(`📊 Projet: ${projectRef}`)
  console.log(`🔗 URL: ${supabaseUrl}`)
  console.log('')

  // Lire le fichier SQL
  const sqlPath = path.join(__dirname, '..', 'supabase-marketing-schema.sql')
  
  if (!fs.existsSync(sqlPath)) {
    console.error(`❌ Fichier SQL non trouvé: ${sqlPath}`)
    process.exit(1)
  }

  const sqlScript = fs.readFileSync(sqlPath, 'utf-8')
  console.log('✅ Fichier SQL chargé\n')

  // Créer le client PostgreSQL
  const client = new Client({
    connectionString: databaseUrl,
    ssl: {
      rejectUnauthorized: false
    }
  })

  try {
    console.log('🔌 Connexion à PostgreSQL...')
    await client.connect()
    console.log('✅ Connexion établie\n')

    // Nettoyer le SQL: supprimer les commentaires et diviser en commandes
    // Gérer correctement les fonctions PostgreSQL avec $$ (dollar-quoted strings)
    const lines = sqlScript
      .split('\n')
      .map(line => line.trim())
      .filter(line => {
        const trimmed = line.trim()
        return trimmed.length > 0 && !trimmed.startsWith('--')
      })
    
    // Reconstruire en gérant les $$ correctement
    let commands = []
    let currentCommand = ''
    let inDollarQuote = false
    let dollarTag = ''
    
    for (const line of lines) {
      currentCommand += (currentCommand ? '\n' : '') + line
      
      // Détecter les $$ (dollar-quoted strings)
      const dollarMatches = line.match(/\$([^$]*)\$/g)
      if (dollarMatches) {
        for (const match of dollarMatches) {
          if (!inDollarQuote) {
            inDollarQuote = true
            dollarTag = match
          } else if (match === dollarTag) {
            inDollarQuote = false
            dollarTag = ''
          }
        }
      }
      
      // Si on n'est pas dans un dollar-quote et qu'on trouve un ;, c'est la fin d'une commande
      if (!inDollarQuote && line.includes(';')) {
        const cmd = currentCommand.trim()
        if (cmd.length > 0) {
          commands.push(cmd)
        }
        currentCommand = ''
      }
    }
    
    // Ajouter la dernière commande si elle existe
    if (currentCommand.trim().length > 0) {
      commands.push(currentCommand.trim())
    }
    
    commands = commands.filter(cmd => cmd.length > 0)

    console.log(`📝 Exécution de ${commands.length} commandes SQL...\n`)

    let successCount = 0
    let errorCount = 0
    let skippedCount = 0

    // Exécuter chaque commande
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i]
      
      if (!command || command.length < 10) {
        continue
      }

      try {
        await client.query(command)
        const preview = command.substring(0, 60).replace(/\s+/g, ' ')
        console.log(`   ✅ [${i + 1}/${commands.length}] ${preview}...`)
        successCount++
      } catch (error) {
        const errorMsg = error.message || ''
        
        // Ignorer les erreurs "already exists" ou "does not exist" (pour IF NOT EXISTS)
        if (
          errorMsg.includes('already exists') ||
          errorMsg.includes('duplicate') ||
          (errorMsg.includes('does not exist') && command.toUpperCase().includes('DROP'))
        ) {
          const preview = command.substring(0, 60).replace(/\s+/g, ' ')
          console.log(`   ⚠️  [${i + 1}/${commands.length}] ${preview}... (déjà existant)`)
          skippedCount++
        } else {
          const preview = command.substring(0, 60).replace(/\s+/g, ' ')
          console.log(`   ❌ [${i + 1}/${commands.length}] ${preview}...`)
          console.log(`      Erreur: ${errorMsg.substring(0, 100)}`)
          errorCount++
        }
      }
    }

    console.log('\n' + '='.repeat(70))
    console.log('📊 Résumé:')
    console.log(`   ✅ Succès: ${successCount}`)
    console.log(`   ⚠️  Ignoré (déjà existant): ${skippedCount}`)
    console.log(`   ❌ Erreurs: ${errorCount}`)
    console.log('='.repeat(70))

    // Vérifier que les tables existent
    console.log('\n🔍 Vérification des tables créées...\n')

    const tables = [
      'marketing_posts',
      'marketing_promotions',
      'marketing_adwords_campaigns',
      'marketing_content_sections',
      'marketing_calendar_events',
      'marketing_social_accounts'
    ]

    const existingTables = []
    const missingTables = []

    for (const table of tables) {
      try {
        const result = await client.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = $1
          )
        `, [table])
        
        if (result.rows[0].exists) {
          existingTables.push(table)
          console.log(`   ✅ ${table}`)
        } else {
          missingTables.push(table)
          console.log(`   ❌ ${table} - Non trouvée`)
        }
      } catch (error) {
        missingTables.push(table)
        console.log(`   ❌ ${table} - Erreur: ${error.message}`)
      }
    }

    console.log('\n' + '='.repeat(70))
    if (missingTables.length === 0) {
      console.log('✅ TOUTES LES TABLES ONT ÉTÉ CRÉÉES AVEC SUCCÈS!')
      console.log('\n📋 Prochaines étapes:')
      console.log('   1. Attendez 1-2 minutes pour le rafraîchissement du cache Supabase')
      console.log('   2. Exécutez: npm run verify:marketing')
      console.log('   3. Testez l\'application: http://localhost:1001/admin/marketing')
    } else {
      console.log('⚠️  CERTAINES TABLES SONT MANQUANTES')
      console.log('\nTables manquantes:')
      missingTables.forEach(t => console.log(`   - ${t}`))
      console.log('\n💡 Solution:')
      console.log('   1. Vérifiez les erreurs ci-dessus')
      console.log('   2. Essayez d\'exécuter le SQL manuellement dans Supabase Dashboard')
      console.log('   3. Ou réessayez ce script après quelques minutes')
    }
    console.log('='.repeat(70) + '\n')

  } catch (error) {
    console.error('\n❌ Erreur de connexion:', error.message)
    console.error('\n💡 Solutions possibles:')
    console.error('   1. Vérifiez que DATABASE_URL est défini dans .env.local')
    console.error('   2. Ou utilisez le mot de passe de la base de données depuis Supabase Dashboard')
    console.error('   3. Format: DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres')
    console.error('\n   Alternative: Exécutez le SQL manuellement dans Supabase Dashboard > SQL Editor')
    process.exit(1)
  } finally {
    await client.end()
    console.log('🔌 Connexion fermée\n')
  }
}

// Exécuter la création des tables
createMarketingTables().catch(error => {
  console.error('\n❌ Erreur fatale:', error.message)
  if (error.message.includes('password authentication failed') || error.message.includes('connection')) {
    console.error('\n💡 Solution:')
    console.error('   1. Allez sur: https://supabase.com/dashboard/project/' + projectRef)
    console.error('   2. Settings > Database > Connection string')
    console.error('   3. Copiez la "Connection string" (URI)')
    console.error('   4. Ajoutez dans .env.local: DATABASE_URL=[votre-connection-string]')
    console.error('   5. Réexécutez: npm run create:marketing:tables\n')
    console.error('   OU exécutez le SQL manuellement:')
    console.error('   1. SQL Editor > New Query')
    console.error('   2. Copiez le contenu de: supabase-marketing-schema.sql')
    console.error('   3. Exécutez (Run)\n')
  }
  process.exit(1)
})

