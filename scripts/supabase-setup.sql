-- ============================================
-- Script de configuration Supabase pour MyBank
-- ============================================
-- 
-- Instructions:
-- 1. Ouvrir Supabase Dashboard > SQL Editor
-- 2. Coller ce script
-- 3. Exécuter le script
-- ============================================

-- Table principale des soumissions
CREATE TABLE IF NOT EXISTS submissions (
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
CREATE TABLE IF NOT EXISTS documents (
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
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_user_type ON submissions(user_type);
CREATE INDEX IF NOT EXISTS idx_submissions_asset_type ON submissions(asset_type);
CREATE INDEX IF NOT EXISTS idx_submissions_submitted_at ON submissions(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_owner_email ON submissions(owner_email);
CREATE INDEX IF NOT EXISTS idx_submissions_company_email ON submissions(company_email);
CREATE INDEX IF NOT EXISTS idx_documents_submission_id ON documents(submission_id);
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(document_type);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour updated_at
DROP TRIGGER IF EXISTS update_submissions_updated_at ON submissions;
CREATE TRIGGER update_submissions_updated_at 
  BEFORE UPDATE ON submissions 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Row Level Security (RLS)
-- ============================================

-- Activer RLS
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Public can create submissions" ON submissions;
DROP POLICY IF EXISTS "Admin can read all submissions" ON submissions;
DROP POLICY IF EXISTS "Admin can update submissions" ON submissions;
DROP POLICY IF EXISTS "Documents linked to submissions" ON documents;

-- Politique : Public peut créer des soumissions (pour le formulaire)
CREATE POLICY "Public can create submissions"
  ON submissions FOR INSERT
  TO anon
  WITH CHECK (true);

-- Politique : Admin peut tout lire (utiliser service role key côté serveur)
-- Note: Les requêtes avec service role key bypassent RLS automatiquement
CREATE POLICY "Admin can read all submissions"
  ON submissions FOR SELECT
  TO authenticated
  USING (true);

-- Politique : Admin peut mettre à jour
CREATE POLICY "Admin can update submissions"
  ON submissions FOR UPDATE
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

-- ============================================
-- Storage Bucket Configuration
-- ============================================
-- 
-- Note: Le bucket doit être créé manuellement dans Supabase Dashboard:
-- 1. Aller dans Storage
-- 2. Créer un nouveau bucket nommé "submissions"
-- 3. Configurer les politiques ci-dessous dans SQL Editor
-- ============================================

-- Politique pour upload de fichiers (public peut uploader)
-- Note: Remplacer 'submissions' par le nom de votre bucket
CREATE POLICY IF NOT EXISTS "Public can upload files"
  ON storage.objects FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'submissions');

-- Politique pour lire les fichiers (public peut lire)
CREATE POLICY IF NOT EXISTS "Public can read files"
  ON storage.objects FOR SELECT
  TO anon
  USING (bucket_id = 'submissions');

-- Politique pour supprimer les fichiers (admin seulement)
CREATE POLICY IF NOT EXISTS "Admin can delete files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'submissions');

-- ============================================
-- Vérification
-- ============================================

-- Vérifier que les tables existent
SELECT 
  'submissions' as table_name,
  COUNT(*) as row_count
FROM submissions
UNION ALL
SELECT 
  'documents' as table_name,
  COUNT(*) as row_count
FROM documents;

