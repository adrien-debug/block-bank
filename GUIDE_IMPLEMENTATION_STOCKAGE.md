# 🛠️ Guide d'Implémentation - Système de Stockage

## Solution Recommandée : Supabase

Ce guide détaille l'implémentation de la solution Supabase pour remplacer le stockage local actuel.

---

## 📦 Installation

### 1. Installer les dépendances

```bash
npm install @supabase/supabase-js
npm install @supabase/ssr --save-dev
```

### 2. Configuration Supabase

Créer un fichier `.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-clé-anon
SUPABASE_SERVICE_ROLE_KEY=votre-clé-service-role
```

---

## 🗄️ Configuration de la Base de Données

### 1. Créer les tables dans Supabase SQL Editor

```sql
-- Table principale des soumissions
CREATE TABLE submissions (
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
  
  -- Informations particuliers
  owner_name VARCHAR(255),
  owner_email VARCHAR(255),
  owner_phone VARCHAR(50),
  
  -- Informations entreprise
  company_name VARCHAR(255),
  company_email VARCHAR(255),
  company_phone VARCHAR(50),
  company_registration VARCHAR(100),
  contact_person_name VARCHAR(255),
  
  -- Paiement vendeur
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
);

-- Table des documents
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  document_type VARCHAR(50) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  mime_type VARCHAR(100),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_user_type ON submissions(user_type);
CREATE INDEX idx_submissions_asset_type ON submissions(asset_type);
CREATE INDEX idx_submissions_submitted_at ON submissions(submitted_at DESC);
CREATE INDEX idx_documents_submission_id ON documents(submission_id);
CREATE INDEX idx_documents_type ON documents(document_type);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour updated_at
CREATE TRIGGER update_submissions_updated_at 
  BEFORE UPDATE ON submissions 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
```

### 2. Configurer Row Level Security (RLS)

```sql
-- Activer RLS sur submissions
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Politique : Admin peut tout voir (utiliser service role key)
-- Politique : Public peut créer des soumissions
CREATE POLICY "Public can create submissions"
  ON submissions FOR INSERT
  TO anon
  WITH CHECK (true);

-- Politique : Admin peut tout lire
CREATE POLICY "Admin can read all submissions"
  ON submissions FOR SELECT
  TO authenticated
  USING (true);

-- Politique : Documents liés aux soumissions
CREATE POLICY "Documents linked to submissions"
  ON documents FOR ALL
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM submissions 
      WHERE submissions.id = documents.submission_id
    )
  );
```

### 3. Configurer Storage Bucket

Dans Supabase Dashboard :
1. Aller dans **Storage**
2. Créer un bucket `submissions`
3. Configurer les politiques :

```sql
-- Politique pour upload de fichiers
CREATE POLICY "Public can upload files"
  ON storage.objects FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'submissions');

-- Politique pour lire les fichiers
CREATE POLICY "Public can read files"
  ON storage.objects FOR SELECT
  TO anon
  USING (bucket_id = 'submissions');
```

---

## 💻 Code d'Implémentation

### 1. Client Supabase

Créer `lib/supabase/client.ts` :

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

Créer `lib/supabase/server.ts` :

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client avec service role pour opérations admin
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
```

### 2. Service de Stockage Supabase

Créer `lib/services/supabaseStorage.ts` :

```typescript
import { supabaseAdmin } from '@/lib/supabase/server'
import { AssetSubmission } from '@/types/submission.types'

const BUCKET_NAME = 'submissions'

export interface SaveSubmissionResult {
  submissionId: string
  folderId: string
}

export async function saveSubmissionToSupabase(
  submissionData: Omit<AssetSubmission, 'id' | 'submittedAt' | 'status' | 'documents'>,
  files: {
    passport?: File[]
    identityDocument?: File[]
    companyStatutes?: File[]
    companyBalanceSheet?: File[]
    companyRegistrationDoc?: File[]
    assetDocuments?: File[]
    additionalDocuments?: File[]
  }
): Promise<SaveSubmissionResult> {
  // 1. Créer la soumission dans la base de données
  const { data: submission, error: submissionError } = await supabaseAdmin
    .from('submissions')
    .insert({
      status: 'new',
      user_type: submissionData.userType,
      asset_type: submissionData.assetType,
      custom_asset_type: submissionData.customAssetType,
      asset_description: submissionData.assetDescription,
      estimated_value: submissionData.estimatedValue,
      location: submissionData.location,
      asset_link: submissionData.assetLink,
      additional_info: submissionData.additionalInfo,
      owner_name: submissionData.ownerName,
      owner_email: submissionData.ownerEmail,
      owner_phone: submissionData.ownerPhone,
      company_name: submissionData.companyName,
      company_email: submissionData.companyEmail,
      company_phone: submissionData.companyPhone,
      company_registration: submissionData.companyRegistration,
      contact_person_name: submissionData.contactPersonName,
      seller_payment_method: submissionData.sellerPaymentMethod,
      seller_preferred_currency: submissionData.sellerPreferredCurrency,
      seller_crypto_address: submissionData.sellerCryptoAddress,
      seller_bank_iban: submissionData.sellerBankAccount?.iban,
      seller_bank_bic: submissionData.sellerBankAccount?.bic,
      seller_bank_account_holder: submissionData.sellerBankAccount?.accountHolder,
      seller_bank_name: submissionData.sellerBankAccount?.bankName,
      seller_bank_currency: submissionData.sellerBankAccount?.currency,
    })
    .select()
    .single()

  if (submissionError) {
    throw new Error(`Erreur lors de la création de la soumission: ${submissionError.message}`)
  }

  const submissionId = submission.id

  // 2. Uploader les fichiers vers Supabase Storage
  const documentPaths: string[] = []

  // Fonction helper pour uploader un fichier
  const uploadFile = async (
    file: File,
    documentType: string,
    index: number
  ): Promise<string> => {
    const fileName = `${submissionId}/${documentType}/${index + 1}-${file.name}`
    const filePath = `${documentType}/${index + 1}-${file.name}`

    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      throw new Error(`Erreur upload fichier ${file.name}: ${uploadError.message}`)
    }

    // Enregistrer le document dans la base de données
    const { error: docError } = await supabaseAdmin
      .from('documents')
      .insert({
        submission_id: submissionId,
        document_type: documentType,
        file_name: file.name,
        file_path: fileName,
        file_size: file.size,
        mime_type: file.type,
      })

    if (docError) {
      console.error(`Erreur enregistrement document ${file.name}:`, docError)
    }

    return fileName
  }

  // Uploader tous les fichiers
  const uploadPromises: Promise<string>[] = []

  if (files.passport) {
    files.passport.forEach((file, index) => {
      uploadPromises.push(uploadFile(file, 'passport', index))
    })
  }

  if (files.identityDocument) {
    files.identityDocument.forEach((file, index) => {
      uploadPromises.push(uploadFile(file, 'identityDocument', index))
    })
  }

  if (files.companyStatutes) {
    files.companyStatutes.forEach((file, index) => {
      uploadPromises.push(uploadFile(file, 'companyStatutes', index))
    })
  }

  if (files.companyBalanceSheet) {
    files.companyBalanceSheet.forEach((file, index) => {
      uploadPromises.push(uploadFile(file, 'companyBalanceSheet', index))
    })
  }

  if (files.companyRegistrationDoc) {
    files.companyRegistrationDoc.forEach((file, index) => {
      uploadPromises.push(uploadFile(file, 'companyRegistrationDoc', index))
    })
  }

  if (files.assetDocuments) {
    files.assetDocuments.forEach((file, index) => {
      uploadPromises.push(uploadFile(file, 'assetDocuments', index))
    })
  }

  if (files.additionalDocuments) {
    files.additionalDocuments.forEach((file, index) => {
      uploadPromises.push(uploadFile(file, 'additionalDocuments', index))
    })
  }

  await Promise.all(uploadPromises)

  return {
    submissionId,
    folderId: `${BUCKET_NAME}/${submissionId}`,
  }
}

export async function getSubmissionFromSupabase(
  submissionId: string
): Promise<AssetSubmission | null> {
  // Récupérer la soumission
  const { data: submission, error: submissionError } = await supabaseAdmin
    .from('submissions')
    .select('*')
    .eq('id', submissionId)
    .single()

  if (submissionError || !submission) {
    return null
  }

  // Récupérer les documents
  const { data: documents, error: documentsError } = await supabaseAdmin
    .from('documents')
    .select('*')
    .eq('submission_id', submissionId)

  if (documentsError) {
    console.error('Erreur récupération documents:', documentsError)
  }

  // Organiser les documents par type
  const documentsByType: Record<string, string[]> = {}
  documents?.forEach((doc) => {
    if (!documentsByType[doc.document_type]) {
      documentsByType[doc.document_type] = []
    }
    // Générer l'URL publique du fichier
    const { data: urlData } = supabaseAdmin.storage
      .from(BUCKET_NAME)
      .getPublicUrl(doc.file_path)
    
    documentsByType[doc.document_type].push(urlData.publicUrl)
  })

  // Convertir au format AssetSubmission
  return {
    id: submission.id,
    submittedAt: submission.submitted_at,
    status: submission.status,
    userType: submission.user_type,
    assetType: submission.asset_type,
    customAssetType: submission.custom_asset_type,
    assetDescription: submission.asset_description,
    estimatedValue: submission.estimated_value.toString(),
    location: submission.location,
    assetLink: submission.asset_link,
    additionalInfo: submission.additional_info,
    ownerName: submission.owner_name,
    ownerEmail: submission.owner_email,
    ownerPhone: submission.owner_phone,
    companyName: submission.company_name,
    companyEmail: submission.company_email,
    companyPhone: submission.company_phone,
    companyRegistration: submission.company_registration,
    contactPersonName: submission.contact_person_name,
    documents: documentsByType as AssetSubmission['documents'],
    sellerPaymentMethod: submission.seller_payment_method as any,
    sellerPreferredCurrency: submission.seller_preferred_currency,
    sellerCryptoAddress: submission.seller_crypto_address,
    sellerBankAccount: submission.seller_bank_iban
      ? {
          iban: submission.seller_bank_iban,
          bic: submission.seller_bank_bic,
          accountHolder: submission.seller_bank_account_holder,
          bankName: submission.seller_bank_name,
          currency: submission.seller_bank_currency as any,
        }
      : undefined,
  }
}

export async function listSubmissionsFromSupabase(): Promise<any[]> {
  const { data: submissions, error } = await supabaseAdmin
    .from('submissions')
    .select('*')
    .order('submitted_at', { ascending: false })

  if (error) {
    console.error('Erreur liste soumissions:', error)
    return []
  }

  return submissions || []
}
```

### 3. Mettre à jour l'API Route

Modifier `app/api/asset-submissions/route.ts` :

```typescript
// Remplacer l'import
import { saveSubmissionToSupabase } from '@/lib/services/supabaseStorage'

// Dans la fonction POST, remplacer :
const { submissionId, folderId } = await saveSubmissionToSupabase(submissionData, files)
```

### 4. Script de Migration

Créer `scripts/migrate-to-supabase.ts` :

```typescript
import { promises as fs } from 'fs'
import path from 'path'
import { supabaseAdmin } from '@/lib/supabase/server'

const STORAGE_ROOT = path.join(process.cwd(), 'storage', 'submissions')

async function migrateSubmissions() {
  const entries = await fs.readdir(STORAGE_ROOT, { withFileTypes: true })

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const submissionId = entry.name
      const metadataPath = path.join(STORAGE_ROOT, submissionId, 'metadata.json')

      try {
        const metadataContent = await fs.readFile(metadataPath, 'utf-8')
        const submission = JSON.parse(metadataContent)

        console.log(`Migration de ${submissionId}...`)

        // Migrer la soumission vers Supabase
        // (utiliser saveSubmissionToSupabase ou insertion directe)
        
        // Migrer les fichiers vers Supabase Storage
        // ...

        console.log(`✅ ${submissionId} migré`)
      } catch (error) {
        console.error(`❌ Erreur migration ${submissionId}:`, error)
      }
    }
  }
}

migrateSubmissions()
```

---

## ✅ Checklist d'Implémentation

- [ ] Créer compte Supabase
- [ ] Configurer les variables d'environnement
- [ ] Créer les tables SQL
- [ ] Configurer RLS policies
- [ ] Configurer Storage bucket
- [ ] Installer dépendances
- [ ] Créer clients Supabase
- [ ] Implémenter service de stockage
- [ ] Mettre à jour API routes
- [ ] Tester création soumission
- [ ] Tester récupération soumission
- [ ] Tester upload fichiers
- [ ] Créer script de migration
- [ ] Migrer données existantes
- [ ] Tests complets
- [ ] Déploiement production

---

## 🔒 Sécurité

1. **Ne jamais exposer la service role key côté client**
2. **Utiliser RLS pour protéger les données**
3. **Valider tous les inputs**
4. **Limiter la taille des fichiers**
5. **Scanner les fichiers uploadés (optionnel)**

---

## 📊 Monitoring

Dans Supabase Dashboard, vous pouvez :
- Voir les requêtes en temps réel
- Monitorer l'utilisation du storage
- Voir les logs d'erreur
- Analyser les performances

---

**Besoin d'aide ?** Consultez la documentation Supabase : https://supabase.com/docs

