# 🔧 Fix: Table marketing_social_accounts - Cache Schema

## Problème
L'erreur "Could not find the table 'public.marketing_social_accounts' in the schema cache" indique que le cache PostgREST de Supabase n'a pas été rafraîchi.

## ✅ Solution 1 : Exécuter le SQL dans Supabase Dashboard (RECOMMANDÉ)

1. **Allez sur votre dashboard Supabase** :
   - https://supabase.com/dashboard
   - Sélectionnez votre projet

2. **Ouvrez l'éditeur SQL** :
   - Cliquez sur "SQL Editor" dans le menu de gauche
   - Cliquez sur "New Query"

3. **Copiez et collez ce SQL** :

```sql
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

-- Index
CREATE INDEX IF NOT EXISTS idx_marketing_social_accounts_network ON marketing_social_accounts(network);
CREATE INDEX IF NOT EXISTS idx_marketing_social_accounts_status ON marketing_social_accounts(status);

-- Fonction et trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_marketing_social_accounts_updated_at ON marketing_social_accounts;
CREATE TRIGGER update_marketing_social_accounts_updated_at BEFORE UPDATE ON marketing_social_accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

4. **Exécutez le SQL** :
   - Cliquez sur "Run" ou appuyez sur `Cmd/Ctrl + Enter`

5. **Attendez 1-2 minutes** pour que le cache se rafraîchisse automatiquement

6. **Testez** :
   - Rechargez la page http://localhost:1001/admin/marketing
   - Essayez de sauvegarder un compte réseau social

---

## ✅ Solution 2 : Attendre le rafraîchissement automatique

Le cache Supabase se rafraîchit automatiquement toutes les 1-2 minutes. Si vous venez de créer la table, attendez simplement 1-2 minutes puis rechargez la page.

---

## ✅ Solution 3 : Forcer le refresh via script

Exécutez ce script pour forcer un refresh :

```bash
node scripts/force-refresh-and-test.js
```

---

## 📝 Fichier SQL simplifié

Un fichier `create-social-accounts-table.sql` a été créé à la racine du projet avec uniquement la table manquante.

---

## ✅ Vérification

Après avoir exécuté le SQL, vérifiez que ça fonctionne :

1. Allez sur : http://localhost:1001/admin/marketing
2. Cliquez sur l'onglet "Overview"
3. Cliquez sur "Connect Account" pour un réseau social
4. Remplissez le formulaire et sauvegardez

Si vous ne voyez plus l'erreur "database table does not exist", c'est résolu ! ✅

