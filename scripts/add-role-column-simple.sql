-- Migration simplifiée : Ajouter la colonne role à la table users
-- Exécuter ce script dans Supabase SQL Editor

-- Ajouter la colonne role si elle n'existe pas déjà
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';

-- Mettre à jour les utilisateurs existants pour avoir 'user' par défaut
UPDATE users SET role = 'user' WHERE role IS NULL;

-- Index sur role pour les recherches rapides
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

