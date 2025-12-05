-- Script pour réinitialiser toutes les tables (vider les données)
-- ATTENTION: Ce script supprime TOUTES les données !
-- Exécutez ce script dans Supabase SQL Editor

-- Désactiver temporairement les foreign keys pour permettre le TRUNCATE
SET session_replication_role = 'replica';

-- Vider les tables dans l'ordre (enfants d'abord, puis parents)
TRUNCATE TABLE IF EXISTS insurance_claims CASCADE;
TRUNCATE TABLE IF EXISTS insurance_history CASCADE;
TRUNCATE TABLE IF EXISTS insurance_policies CASCADE;
TRUNCATE TABLE IF EXISTS payments CASCADE;
TRUNCATE TABLE IF EXISTS loans CASCADE;
TRUNCATE TABLE IF EXISTS nft_assets CASCADE;
TRUNCATE TABLE IF EXISTS credit_score_partners CASCADE;
TRUNCATE TABLE IF EXISTS credit_scores CASCADE;
TRUNCATE TABLE IF EXISTS documents CASCADE;
TRUNCATE TABLE IF EXISTS submissions CASCADE;

-- Réactiver les foreign keys
SET session_replication_role = 'origin';

-- Réinitialiser les séquences si nécessaire (pour les IDs auto-incrémentés)
-- Note: Les UUID n'ont pas besoin de réinitialisation

-- Vérification
SELECT 
  'Tables réinitialisées' as status,
  (SELECT COUNT(*) FROM users) as users_count,
  (SELECT COUNT(*) FROM credit_scores) as credit_scores_count,
  (SELECT COUNT(*) FROM loans) as loans_count,
  (SELECT COUNT(*) FROM nft_assets) as nft_assets_count,
  (SELECT COUNT(*) FROM submissions) as submissions_count;
