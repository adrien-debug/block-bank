# 🚨 URGENT : Créer la table `users` dans Supabase

## Problème
L'erreur "Erreur de connexion à la base de données" indique que la table `users` n'existe pas dans votre projet Supabase.

## Solution : Créer la table `users`

### Étape 1 : Ouvrir Supabase SQL Editor
1. Allez sur https://supabase.com
2. Sélectionnez votre projet
3. Cliquez sur **SQL Editor** dans le menu de gauche
4. Cliquez sur **New query**

### Étape 2 : Exécuter ce script SQL

Copiez et collez ce script dans l'éditeur SQL :

```sql
-- Table users pour l'authentification
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  password_hash TEXT,
  first_name TEXT,
  last_name TEXT,
  address TEXT,
  wallet_address TEXT,
  role TEXT DEFAULT 'user',
  kyc_verified BOOLEAN DEFAULT false,
  aml_verified BOOLEAN DEFAULT false,
  verification_level TEXT DEFAULT 'basic',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Permissions (RLS - Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre au service role d'accéder à tout
CREATE POLICY "Service role can access all users"
  ON users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
```

### Étape 3 : Exécuter le script
1. Cliquez sur **Run** ou appuyez sur `Ctrl+Enter` (ou `Cmd+Enter` sur Mac)
2. Vous devriez voir "Success. No rows returned"

### Étape 4 : Vérifier que la table existe
1. Allez dans **Table Editor** dans le menu de gauche
2. Vous devriez voir la table `users` dans la liste
3. Cliquez dessus pour voir sa structure

### Étape 5 : Redémarrer le serveur
```bash
# Arrêter le serveur (Ctrl+C)
# Puis redémarrer
npm run dev
```

### Étape 6 : Tester l'inscription
1. Allez sur http://localhost:1001
2. Cliquez sur "Connecter Wallet" ou "Connexion"
3. Cliquez sur "S'inscrire"
4. Remplissez le formulaire et testez

---

## Alternative : Utiliser le script complet

Si vous voulez créer toutes les tables d'un coup, utilisez le script complet :

1. Ouvrez `scripts/create-complete-schema.sql`
2. Copiez tout le contenu
3. Collez-le dans Supabase SQL Editor
4. Exécutez-le

---

## Vérification

Pour vérifier que tout fonctionne, testez cette requête dans Supabase SQL Editor :

```sql
SELECT * FROM users LIMIT 1;
```

Si vous voyez une table vide (pas d'erreur), c'est que la table existe et fonctionne !

---

## Besoin d'aide ?

Si vous avez toujours des erreurs :
1. Vérifiez les logs dans Supabase Dashboard > Logs
2. Vérifiez que votre `SUPABASE_SERVICE_ROLE_KEY` est correct dans `.env.local`
3. Vérifiez que votre projet Supabase est actif (pas suspendu)
