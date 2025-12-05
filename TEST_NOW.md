# 🧪 Test Immédiat - Système d'Authentification

## ✅ État Actuel

- ✅ Code 100% implémenté
- ✅ Serveur actif : http://localhost:1001
- ✅ API fonctionnelle : `/api/auth` répond
- ⏳ Table `users` : À créer dans Supabase

## 🚀 Créer la Table (2 minutes)

### Option Rapide

1. **Ouvrez ce lien** : https://supabase.com/dashboard/project/ipamfhfzflprptchlaei/sql/new

2. **Copiez-collez ce SQL** :

```sql
-- Script complet pour créer la table users avec la colonne role
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  address TEXT,
  wallet_address VARCHAR(42),
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

3. **Cliquez sur "Run"** (ou Cmd/Ctrl + Enter)

4. **Vérifiez** :
```bash
node scripts/setup-auth-complete.js
```

Vous devriez voir : ✅ Configuration complète

## 🧪 Tests Rapides (5 minutes)

### Test 1 : Inscription
1. Ouvrez http://localhost:1001
2. Cliquez "Login" → "S'inscrire"
3. Remplissez le formulaire
4. ✅ **Attendu** : Redirection vers `/dashboard`

### Test 2 : Connexion User
1. Déconnectez-vous
2. Connectez-vous avec email/mdp
3. ✅ **Attendu** : Redirection vers `/dashboard`

### Test 3 : Créer Admin
Dans Supabase SQL Editor :
```sql
UPDATE users SET role = 'admin' WHERE email = 'votre-email@example.com';
```

### Test 4 : Connexion Admin
1. Déconnectez-vous
2. Connectez-vous avec le compte admin
3. ✅ **Attendu** : Redirection vers `/admin/dashboard`

### Test 5 : Wallet
1. Cliquez "Login" → Onglet "Wallet"
2. Connectez MetaMask
3. ✅ **Attendu** : Création compte + Redirection `/dashboard`

## 🔍 Vérification Cookies

DevTools (F12) → Application → Cookies → http://localhost:1001

Après connexion, vous devriez voir :
- `auth_session`
- `user_id`
- `user_role` (user ou admin)

## ✅ Checklist

- [ ] Table créée dans Supabase
- [ ] Script de vérification passe
- [ ] Inscription fonctionne
- [ ] Connexion fonctionne
- [ ] Redirections fonctionnent
- [ ] Wallet fonctionne
- [ ] Protection routes fonctionne

## 🎉 C'est Prêt !

Une fois la table créée, tout fonctionnera automatiquement !


