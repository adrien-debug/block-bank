-- Script pour créer et lier la table credit_scores à users
-- Exécutez ce script dans Supabase SQL Editor

-- 1. Créer la table credit_scores si elle n'existe pas
CREATE TABLE IF NOT EXISTS credit_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 1000),
  tier VARCHAR(2) NOT NULL CHECK (tier IN ('A+', 'A', 'B', 'C', 'D')),
  on_chain_score INTEGER DEFAULT 0 CHECK (on_chain_score >= 0 AND on_chain_score <= 350),
  off_chain_score INTEGER DEFAULT 0 CHECK (off_chain_score >= 0 AND off_chain_score <= 300),
  assets_score INTEGER DEFAULT 0 CHECK (assets_score >= 0 AND assets_score <= 200),
  reputation_score INTEGER DEFAULT 0 CHECK (reputation_score >= 0 AND reputation_score <= 150),
  previous_score INTEGER,
  nft_token_id VARCHAR(255),
  nft_contract_address VARCHAR(42),
  model_version VARCHAR(20) DEFAULT 'v2.1',
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE,
  data_hash VARCHAR(255),
  kyc_verified BOOLEAN DEFAULT false,
  aml_verified BOOLEAN DEFAULT false,
  verification_level VARCHAR(20) DEFAULT 'basic',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Créer la foreign key si elle n'existe pas déjà
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'credit_scores_user_id_fkey'
  ) THEN
    ALTER TABLE credit_scores
    ADD CONSTRAINT credit_scores_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- 3. Créer les index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_credit_scores_user_id ON credit_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_scores_score ON credit_scores(score);
CREATE INDEX IF NOT EXISTS idx_credit_scores_tier ON credit_scores(tier);
CREATE INDEX IF NOT EXISTS idx_credit_scores_created_at ON credit_scores(created_at DESC);

-- 4. Créer le trigger pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_credit_scores_updated_at ON credit_scores;
CREATE TRIGGER update_credit_scores_updated_at 
  BEFORE UPDATE ON credit_scores
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- 5. Activer RLS (Row Level Security) si nécessaire
ALTER TABLE credit_scores ENABLE ROW LEVEL SECURITY;

-- 6. Politique pour permettre au service role d'accéder à tout
DROP POLICY IF EXISTS "Service role can access all credit_scores" ON credit_scores;
CREATE POLICY "Service role can access all credit_scores"
  ON credit_scores
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 7. Politique pour permettre aux utilisateurs de voir leurs propres scores
DROP POLICY IF EXISTS "Users can view their own credit scores" ON credit_scores;
CREATE POLICY "Users can view their own credit scores"
  ON credit_scores
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Vérification
SELECT 
  'Table credit_scores créée et liée à users' as status,
  COUNT(*) as total_scores
FROM credit_scores;
