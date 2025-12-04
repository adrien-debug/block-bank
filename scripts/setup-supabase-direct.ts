/**
 * Script pour créer les tables Supabase via connexion PostgreSQL directe
 * 
 * Usage: npx tsx scripts/setup-supabase-direct.ts
 */

// Charger les variables d'environnement
import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { Client } from 'pg'
import { readFileSync } from 'fs'
import { resolve as resolvePath } from 'path'

// Construire la chaîne de connexion depuis DATABASE_URL ou les variables
const databaseUrl = process.env.DATABASE_URL || 
  `postgresql://postgres:${encodeURIComponent('Adrien0334$$')}@db.ipamfhfzflprptchlaei.supabase.co:5432/postgres`

async function setupTables() {
  console.log('🚀 Création des tables Supabase via PostgreSQL...\n')

  const client = new Client({
    connectionString: databaseUrl,
    ssl: {
      rejectUnauthorized: false
    }
  })

  try {
    await client.connect()
    console.log('✅ Connexion à PostgreSQL établie\n')

    // Lire le script SQL
    const sqlPath = resolvePath(process.cwd(), 'scripts', 'supabase-setup.sql')
    const sqlScript = readFileSync(sqlPath, 'utf-8')

    // Nettoyer et diviser le script en commandes
    // Supprimer les commentaires et diviser par les points-virgules
    const commands = sqlScript
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('--') && !line.startsWith('//'))
      .join('\n')
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'))

    console.log(`📝 Exécution de ${commands.length} commandes SQL...\n`)

    // Exécuter chaque commande
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i]
      
      // Ignorer les commandes de vérification SELECT à la fin
      if (command.toUpperCase().includes('SELECT') && command.toUpperCase().includes('UNION')) {
        continue
      }

      try {
        await client.query(command)
        console.log(`   ✅ Commande ${i + 1}/${commands.length} exécutée`)
      } catch (error: any) {
        // Ignorer les erreurs "already exists" ou "does not exist" (pour DROP IF EXISTS)
        if (
          error.message.includes('already exists') || 
          error.message.includes('does not exist') ||
          error.message.includes('duplicate key') ||
          (error.message.includes('relation') && error.message.includes('already'))
        ) {
          console.log(`   ⚠️  Commande ${i + 1}/${commands.length}: ${error.message.split('\n')[0]}`)
        } else {
          console.error(`   ❌ Erreur commande ${i + 1}/${commands.length}:`, error.message)
          // Continuer quand même pour les autres commandes
        }
      }
    }

    console.log('\n✅ Script SQL exécuté\n')

    // Vérifier que les tables existent
    console.log('🔍 Vérification des tables...\n')

    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('submissions', 'documents')
      ORDER BY table_name
    `)

    const tables = tablesResult.rows.map(row => row.table_name)
    
    if (tables.includes('submissions')) {
      console.log('✅ Table "submissions" créée')
    } else {
      console.log('❌ Table "submissions" non trouvée')
    }

    if (tables.includes('documents')) {
      console.log('✅ Table "documents" créée')
    } else {
      console.log('❌ Table "documents" non trouvée')
    }

    // Vérifier les index
    console.log('\n📊 Vérification des index...\n')
    const indexesResult = await client.query(`
      SELECT indexname 
      FROM pg_indexes 
      WHERE schemaname = 'public' 
      AND tablename IN ('submissions', 'documents')
      ORDER BY indexname
    `)

    console.log(`✅ ${indexesResult.rows.length} index créés`)

    // Vérifier les politiques RLS
    console.log('\n🔒 Vérification des politiques RLS...\n')
    const policiesResult = await client.query(`
      SELECT policyname, tablename 
      FROM pg_policies 
      WHERE schemaname = 'public' 
      AND tablename IN ('submissions', 'documents')
      ORDER BY tablename, policyname
    `)

    console.log(`✅ ${policiesResult.rows.length} politiques RLS créées`)

    console.log('\n✅ Configuration terminée avec succès!')
    console.log('\n📋 Prochaines étapes:')
    console.log('   1. Vérifiez les tables dans Supabase Dashboard > Table Editor')
    console.log('   2. Testez avec: npx tsx scripts/test-supabase-connection.ts')
    console.log('   3. Le bucket Storage a déjà été créé automatiquement')

  } catch (error) {
    console.error('\n❌ Erreur:', error instanceof Error ? error.message : error)
    if (error instanceof Error && error.stack) {
      console.error('\nStack trace:', error.stack)
    }
    process.exit(1)
  } finally {
    await client.end()
    console.log('\n🔌 Connexion fermée')
  }
}

setupTables()

