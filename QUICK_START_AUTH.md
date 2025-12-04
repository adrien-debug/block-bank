# ⚡ Quick Start - Système d'Authentification

## 🎯 État Actuel

✅ **Code implémenté** - Tous les fichiers sont prêts  
⏳ **Table users** - À créer dans Supabase  
✅ **Serveur** - Démarré sur http://localhost:1001

## 🚀 Étape 1 : Créer la Table (2 minutes)

### Option A : Via Supabase Dashboard (Recommandé)

1. **Ouvrez** https://supabase.com/dashboard
2. **Sélectionnez** votre projet
3. **Cliquez** sur "SQL Editor" (menu gauche)
4. **Cliquez** sur "New Query"
5. **Copiez** le contenu de `scripts/setup-users-table-complete.sql`
6. **Collez** dans l'éditeur
7. **Exécutez** (bouton "Run" ou Cmd/Ctrl + Enter)

### Option B : Via Terminal (si vous avez psql)

```bash
# Si vous avez l'URL de connexion directe
psql "votre-connection-string" -f scripts/setup-users-table-complete.sql
```

## ✅ Étape 2 : Vérifier (30 secondes)

```bash
node scripts/setup-auth-complete.js
```

Vous devriez voir :
```
✅ La table users existe
✅ La colonne role existe
✅ Configuration complète - Système de rôles prêt!
```

## 🧪 Étape 3 : Tester (5 minutes)

### Test 1 : Inscription User

1. Ouvrez http://localhost:1001
2. Cliquez sur "Login" dans le header
3. Cliquez sur "S'inscrire"
4. Remplissez le formulaire :
   - Email : `test@example.com`
   - Mot de passe : `test123`
   - Prénom, Nom, Adresse
5. Cliquez sur "S'inscrire"
6. ✅ **Attendu** : Redirection vers `/dashboard`

### Test 2 : Connexion User

1. Déconnectez-vous
2. Cliquez sur "Login"
3. Entrez : `test@example.com` / `test123`
4. ✅ **Attendu** : Redirection vers `/dashboard`

### Test 3 : Créer un Admin

Dans Supabase SQL Editor, exécutez :
```sql
UPDATE users SET role = 'admin' WHERE email = 'test@example.com';
```

### Test 4 : Connexion Admin

1. Déconnectez-vous
2. Connectez-vous avec `test@example.com` / `test123`
3. ✅ **Attendu** : Redirection vers `/admin/dashboard`

### Test 5 : Connexion Wallet

1. Déconnectez-vous
2. Cliquez sur "Login" → Onglet "Wallet"
3. Cliquez sur "Connecter Wallet"
4. Approuvez dans MetaMask
5. ✅ **Attendu** : 
   - Création automatique d'un compte (si nouveau wallet)
   - Redirection vers `/dashboard` (user) ou `/admin/dashboard` (admin)

### Test 6 : Protection des Routes

1. **Sans connexion** :
   - Allez sur http://localhost:1001/dashboard
   - ✅ **Attendu** : Redirection vers `/`

2. **En tant qu'user** :
   - Connectez-vous en user
   - Allez sur http://localhost:1001/admin/dashboard
   - ✅ **Attendu** : Redirection vers `/dashboard`

3. **En tant qu'admin** :
   - Connectez-vous en admin
   - Allez sur http://localhost:1001/dashboard
   - ✅ **Attendu** : Redirection vers `/admin/dashboard`

## 🔍 Vérification des Cookies

Ouvrez les DevTools (F12) → Application → Cookies → http://localhost:1001

Vous devriez voir après connexion :
- `auth_session` - Token de session
- `user_id` - ID de l'utilisateur
- `user_role` - Rôle (user ou admin)

## 🐛 Dépannage

### Erreur "Table users does not exist"
→ Exécutez `scripts/setup-users-table-complete.sql` dans Supabase

### Erreur "Column role does not exist"
→ Exécutez `scripts/add-role-column-simple.sql` dans Supabase

### Redirections ne fonctionnent pas
→ Vérifiez les cookies dans DevTools
→ Vérifiez la console du navigateur pour les erreurs
→ Vérifiez les logs du serveur Next.js

### Wallet ne se connecte pas
→ Vérifiez que MetaMask est installé
→ Vérifiez que vous avez approuvé la connexion
→ Vérifiez la console pour les erreurs

## 📊 Checklist Complète

- [ ] Table `users` créée dans Supabase
- [ ] Colonne `role` présente
- [ ] Script de vérification passe
- [ ] Inscription fonctionne
- [ ] Connexion email/mdp fonctionne
- [ ] Redirection user → `/dashboard`
- [ ] Redirection admin → `/admin/dashboard`
- [ ] Connexion wallet fonctionne
- [ ] Protection des routes fonctionne
- [ ] Cookies correctement définis

## 🎉 C'est Prêt !

Une fois tous les tests passés, le système d'authentification avec rôles est opérationnel !

