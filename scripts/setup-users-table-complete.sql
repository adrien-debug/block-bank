-- Script complet pour créer la table users avec la colonne role
-- Exécuter ce script dans Supabase SQL Editor

-- Création de la table users pour l'authentification
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  address TEXT,
  wallet_address VARCHAR(42), -- Adresse Ethereum (0x + 40 caractères hex)
  role VARCHAR(20) DEFAULT 'user', -- Rôle de l'utilisateur : 'user' ou 'admin'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index sur l'email pour les recherches rapides
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Index sur wallet_address pour les recherches par wallet
CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON users(wallet_address);

-- Index sur role pour les recherches rapides
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Commentaires pour la documentation
COMMENT ON TABLE users IS 'Table des utilisateurs pour l''authentification et la gestion des comptes';
COMMENT ON COLUMN users.email IS 'Email unique de l''utilisateur';
COMMENT ON COLUMN users.password_hash IS 'Hash bcrypt du mot de passe';
COMMENT ON COLUMN users.wallet_address IS 'Adresse du wallet Ethereum (optionnel, peut être connecté après inscription)';
COMMENT ON COLUMN users.role IS 'Rôle de l''utilisateur : ''user'' ou ''admin''';

