/**
 * Script pour finaliser la configuration Supabase
 * Corrige la fonction trigger et les politiques Storage
 */

import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { Client } from 'pg'

const databaseUrl = process.env.DATABASE_URL || 
  `postgresql://postgres:${encodeURIComponent('Adrien0334$$')}@db.ipamfhfzflprptchlaei.supabase.co:5432/postgres`

async function fixFinal() {
  console.log('🔧 Finalisation de la configuration Supabase...\n')

  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false }
  })

  try {
    await client.connect()
    console.log('✅ Connexion établie\n')

    // Créer la fonction trigger
    console.log('📝 Création de la fonction trigger...')
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `)
    console.log('✅ Fonction trigger créée\n')

    // Créer le trigger
    console.log('📝 Création du trigger...')
    await client.query(`
      DROP TRIGGER IF EXISTS update_submissions_updated_at ON submissions;
      CREATE TRIGGER update_submissions_updated_at 
        BEFORE UPDATE ON submissions 
        FOR EACH ROW 
        EXECUTE FUNCTION update_updated_at_column();
    `)
    console.log('✅ Trigger créé\n')

    // Créer les politiques Storage
    console.log('📝 Création des politiques Storage...')
    
    const storagePolicies = [
      `CREATE POLICY IF NOT EXISTS "Public can upload files"
       ON storage.objects FOR INSERT
       TO anon
       WITH CHECK (bucket_id = 'submissions')`,
      
      `CREATE POLICY IF NOT EXISTS "Public can read files"
       ON storage.objects FOR SELECT
       TO anon
       USING (bucket_id = 'submissions')`,
      
      `CREATE POLICY IF NOT EXISTS "Admin can delete files"
       ON storage.objects FOR DELETE
       TO authenticated
       USING (bucket_id = 'submissions')`
    ]

    for (const policy of storagePolicies) {
      try {
        await client.query(policy)
        console.log(`   ✅ Politique créée`)
      } catch (error: any) {
        if (error.message.includes('already exists')) {
          console.log(`   ⚠️  Politique existe déjà`)
        } else {
          console.log(`   ⚠️  ${error.message.split('\n')[0]}`)
        }
      }
    }

    console.log('\n✅ Configuration finalisée avec succès!')

  } catch (error) {
    console.error('\n❌ Erreur:', error instanceof Error ? error.message : error)
    process.exit(1)
  } finally {
    await client.end()
  }
}

fixFinal()

