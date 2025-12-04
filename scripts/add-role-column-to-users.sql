-- Migration : Ajouter la colonne role à la table users
-- Date : 2025-12-01

-- Ajouter la colonne role si elle n'existe pas déjà
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'role'
    ) THEN
        ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user';
        
        -- Mettre à jour les utilisateurs existants pour avoir 'user' par défaut
        UPDATE users SET role = 'user' WHERE role IS NULL;
        
        -- Ajouter un commentaire
        COMMENT ON COLUMN users.role IS 'Rôle de l''utilisateur : ''user'' ou ''admin''';
    END IF;
END $$;

-- Index sur role pour les recherches rapides (optionnel mais utile)
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

