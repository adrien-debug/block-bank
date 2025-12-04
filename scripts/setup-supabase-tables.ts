/**
 * Script pour créer les tables Supabase automatiquement
 * 
 * Usage: npx tsx scripts/setup-supabase-tables.ts
 */

// Charger les variables d'environnement
import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve as resolvePath } from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes!')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function setupTables() {
  console.log('🚀 Création des tables Supabase...\n')

  try {
    // Lire le script SQL
    const sqlPath = resolvePath(process.cwd(), 'scripts', 'supabase-setup.sql')
    const sqlScript = readFileSync(sqlPath, 'utf-8')

    // Diviser le script en commandes individuelles (séparées par ;)
    // On va exécuter les commandes principales une par une
    const commands = [
      // Créer la table submissions
      `CREATE TABLE IF NOT EXISTS submissions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        status VARCHAR(20) NOT NULL DEFAULT 'new',
        user_type VARCHAR(20) NOT NULL,
        asset_type VARCHAR(50) NOT NULL,
        custom_asset_type VARCHAR(255),
        asset_description TEXT NOT NULL,
        estimated_value DECIMAL(15,2) NOT NULL,
        location VARCHAR(255) NOT NULL,
        asset_link TEXT,
        additional_info TEXT,
        owner_name VARCHAR(255),
        owner_email VARCHAR(255),
        owner_phone VARCHAR(50),
        company_name VARCHAR(255),
        company_email VARCHAR(255),
        company_phone VARCHAR(50),
        company_registration VARCHAR(100),
        contact_person_name VARCHAR(255),
        seller_payment_method VARCHAR(20),
        seller_preferred_currency VARCHAR(10),
        seller_crypto_address TEXT,
        seller_bank_iban VARCHAR(50),
        seller_bank_bic VARCHAR(20),
        seller_bank_account_holder VARCHAR(255),
        seller_bank_name VARCHAR(255),
        seller_bank_currency VARCHAR(10),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )`,

      // Créer la table documents
      `CREATE TABLE IF NOT EXISTS documents (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
        document_type VARCHAR(50) NOT NULL,
        file_name VARCHAR(255) NOT NULL,
        file_path TEXT NOT NULL,
        file_size BIGINT,
        mime_type VARCHAR(100),
        uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )`,

      // Créer les index
      `CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status)`,
      `CREATE INDEX IF NOT EXISTS idx_submissions_user_type ON submissions(user_type)`,
      `CREATE INDEX IF NOT EXISTS idx_submissions_asset_type ON submissions(asset_type)`,
      `CREATE INDEX IF NOT EXISTS idx_submissions_submitted_at ON submissions(submitted_at DESC)`,
      `CREATE INDEX IF NOT EXISTS idx_submissions_owner_email ON submissions(owner_email)`,
      `CREATE INDEX IF NOT EXISTS idx_submissions_company_email ON submissions(company_email)`,
      `CREATE INDEX IF NOT EXISTS idx_documents_submission_id ON documents(submission_id)`,
      `CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(document_type)`,

      // Créer la fonction trigger
      `CREATE OR REPLACE FUNCTION update_updated_at_column()
       RETURNS TRIGGER AS $$
       BEGIN
         NEW.updated_at = NOW();
         RETURN NEW;
       END;
       $$ language 'plpgsql'`,

      // Créer le trigger
      `DROP TRIGGER IF EXISTS update_submissions_updated_at ON submissions`,
      `CREATE TRIGGER update_submissions_updated_at 
       BEFORE UPDATE ON submissions 
       FOR EACH ROW 
       EXECUTE FUNCTION update_updated_at_column()`,

      // Activer RLS
      `ALTER TABLE submissions ENABLE ROW LEVEL SECURITY`,
      `ALTER TABLE documents ENABLE ROW LEVEL SECURITY`,

      // Supprimer les anciennes politiques
      `DROP POLICY IF EXISTS "Public can create submissions" ON submissions`,
      `DROP POLICY IF EXISTS "Admin can read all submissions" ON submissions`,
      `DROP POLICY IF EXISTS "Admin can update submissions" ON submissions`,
      `DROP POLICY IF EXISTS "Documents linked to submissions" ON documents`,

      // Créer les politiques RLS
      `CREATE POLICY "Public can create submissions"
       ON submissions FOR INSERT
       TO anon
       WITH CHECK (true)`,

      `CREATE POLICY "Admin can read all submissions"
       ON submissions FOR SELECT
       TO authenticated
       USING (true)`,

      `CREATE POLICY "Admin can update submissions"
       ON submissions FOR UPDATE
       TO authenticated
       USING (true)`,

      `CREATE POLICY "Documents linked to submissions"
       ON documents FOR ALL
       TO anon
       USING (
         EXISTS (
           SELECT 1 FROM submissions 
           WHERE submissions.id = documents.submission_id
         )
       )`,
    ]

    console.log('📝 Exécution des commandes SQL...\n')

    // Exécuter chaque commande
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i]
      try {
        const { error } = await supabaseAdmin.rpc('exec_sql', { sql: command })
        
        // Si la fonction RPC n'existe pas, utiliser une autre méthode
        if (error && error.message.includes('function') && error.message.includes('does not exist')) {
          // Utiliser query directement (mais Supabase ne supporte pas les DDL via REST)
          // On va utiliser une approche différente : appeler via REST API
          console.log(`   ⚠️  Commande ${i + 1}: Utilisation de l'API REST...`)
          
          // Pour les commandes DDL, on doit utiliser l'API REST directement
          const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': supabaseServiceKey,
              'Authorization': `Bearer ${supabaseServiceKey}`
            },
            body: JSON.stringify({ sql: command })
          })

          if (!response.ok) {
            // Si ça ne marche pas, on essaie une autre approche
            console.log(`   ⚠️  Commande ${i + 1} nécessite une exécution manuelle`)
            console.log(`   SQL: ${command.substring(0, 50)}...`)
          } else {
            console.log(`   ✅ Commande ${i + 1} exécutée`)
          }
        } else if (error) {
          console.log(`   ⚠️  Commande ${i + 1}: ${error.message}`)
        } else {
          console.log(`   ✅ Commande ${i + 1} exécutée`)
        }
      } catch (err) {
        console.log(`   ⚠️  Commande ${i + 1}: ${err instanceof Error ? err.message : 'Erreur inconnue'}`)
      }
    }

    // Vérifier que les tables existent
    console.log('\n🔍 Vérification des tables...\n')

    const { data: submissions, error: submissionsError } = await supabaseAdmin
      .from('submissions')
      .select('id')
      .limit(1)

    if (submissionsError) {
      console.error('❌ Table submissions non accessible:', submissionsError.message)
      console.log('\n💡 Les tables doivent être créées manuellement via Supabase Dashboard > SQL Editor')
      console.log('   Copiez le contenu de scripts/supabase-setup.sql')
    } else {
      console.log('✅ Table submissions créée et accessible')
    }

    const { data: documents, error: documentsError } = await supabaseAdmin
      .from('documents')
      .select('id')
      .limit(1)

    if (documentsError) {
      console.error('❌ Table documents non accessible:', documentsError.message)
    } else {
      console.log('✅ Table documents créée et accessible')
    }

    // Créer le bucket Storage
    console.log('\n📦 Création du bucket Storage...\n')

    const { data: buckets, error: bucketsError } = await supabaseAdmin.storage.listBuckets()
    
    if (bucketsError) {
      console.error('❌ Erreur lors de la récupération des buckets:', bucketsError.message)
    } else {
      const submissionsBucket = buckets?.find(b => b.name === 'submissions')
      
      if (submissionsBucket) {
        console.log('✅ Bucket "submissions" existe déjà')
      } else {
        const { data: newBucket, error: createError } = await supabaseAdmin.storage.createBucket('submissions', {
          public: true,
          allowedMimeTypes: null,
          fileSizeLimit: null
        })

        if (createError) {
          console.error('❌ Erreur création bucket:', createError.message)
          console.log('💡 Créez le bucket manuellement dans Supabase Dashboard > Storage')
        } else {
          console.log('✅ Bucket "submissions" créé')
        }
      }
    }

    // Configurer les politiques Storage
    console.log('\n🔒 Configuration des politiques Storage...\n')
    
    // Les politiques Storage doivent être créées via SQL
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

    console.log('⚠️  Les politiques Storage doivent être créées manuellement via SQL Editor')
    console.log('   Copiez ces commandes dans Supabase Dashboard > SQL Editor:')
    storagePolicies.forEach((policy, i) => {
      console.log(`\n   ${i + 1}. ${policy.substring(0, 60)}...`)
    })

    console.log('\n✅ Configuration terminée!')
    console.log('\n📋 Prochaines étapes:')
    console.log('   1. Vérifiez que les tables existent dans Supabase Dashboard')
    console.log('   2. Si les tables n\'existent pas, exécutez scripts/supabase-setup.sql dans SQL Editor')
    console.log('   3. Créez les politiques Storage via SQL Editor si nécessaire')
    console.log('   4. Testez avec: npx tsx scripts/test-supabase-connection.ts')

  } catch (error) {
    console.error('\n❌ Erreur fatale:', error instanceof Error ? error.message : error)
    process.exit(1)
  }
}

setupTables()

