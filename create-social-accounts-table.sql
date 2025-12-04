-- Script SQL pour créer la table marketing_social_accounts
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- Table des comptes réseaux sociaux
CREATE TABLE IF NOT EXISTS marketing_social_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  network TEXT NOT NULL UNIQUE CHECK (network IN ('facebook', 'twitter', 'instagram', 'linkedin', 'tiktok', 'youtube')),
  username TEXT NOT NULL,
  url TEXT,
  status TEXT NOT NULL DEFAULT 'not-connected' CHECK (status IN ('connected', 'not-connected', 'pending')),
  followers INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by TEXT
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_marketing_social_accounts_network ON marketing_social_accounts(network);
CREATE INDEX IF NOT EXISTS idx_marketing_social_accounts_status ON marketing_social_accounts(status);

-- Fonction pour mettre à jour automatiquement updated_at (si elle n'existe pas déjà)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour mettre à jour updated_at automatiquement
DROP TRIGGER IF EXISTS update_marketing_social_accounts_updated_at ON marketing_social_accounts;
CREATE TRIGGER update_marketing_social_accounts_updated_at BEFORE UPDATE ON marketing_social_accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

