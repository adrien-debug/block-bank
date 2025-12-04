# 🚀 Configuration du Système d'Authentification avec Rôles

## Étape 1 : Créer la table users dans Supabase

### Instructions

1. **Ouvrez Supabase Dashboard**
   - Allez sur https://supabase.com/dashboard
   - Sélectionnez votre projet

2. **Ouvrez SQL Editor**
   - Cliquez sur "SQL Editor" dans le menu de gauche
   - Cliquez sur "New Query"

3. **Exécutez le script SQL**
   - Ouvrez le fichier : `scripts/setup-users-table-complete.sql`
   - **Copiez TOUT le contenu** du fichier
   - Collez-le dans l'éditeur SQL de Supabase
   - Cliquez sur "Run" (ou appuyez sur Cmd/Ctrl + Enter)

4. **Vérifiez la création**
   - Allez dans "Table Editor" dans le menu de gauche
   - Vous devriez voir la table `users` avec les colonnes suivantes :
     - `id` (UUID)
     - `email` (VARCHAR)
     - `password_hash` (VARCHAR)
     - `first_name` (VARCHAR)
     - `last_name` (VARCHAR)
     - `address` (TEXT)
     - `wallet_address` (VARCHAR)
     - `role` (VARCHAR) ← **IMPORTANT : Cette colonne doit exister**
     - `created_at` (TIMESTAMP)
     - `updated_at` (TIMESTAMP)

## Étape 2 : Vérifier la configuration

Après avoir créé la table, exécutez :

```bash
node scripts/setup-auth-complete.js
```

Ce script vérifiera que :
- ✅ La table `users` existe
- ✅ La colonne `role` existe
- ✅ Tous les utilisateurs ont un rôle défini

## Étape 3 : Créer un utilisateur admin (optionnel)

Pour tester le système admin, créez un utilisateur admin :

1. **Créer un compte normal** via l'interface d'inscription
2. **Dans Supabase SQL Editor**, exécutez :

```sql
UPDATE users SET role = 'admin' WHERE email = 'votre-email@example.com';
```

Remplacez `votre-email@example.com` par l'email que vous avez utilisé pour créer le compte.

## Étape 4 : Tester le système

### Test Connexion Email/MDP

1. **User Normal**
   - Créez un compte avec email/mdp
   - Connectez-vous
   - ✅ Devrait rediriger vers `/dashboard`

2. **Admin**
   - Connectez-vous avec un compte admin
   - ✅ Devrait rediriger vers `/admin/dashboard`

### Test Connexion Wallet

1. **Nouveau Wallet**
   - Connectez un wallet qui n'a jamais été utilisé
   - ✅ Devrait créer un compte automatiquement avec `role = 'user'`
   - ✅ Devrait rediriger vers `/dashboard`

2. **Wallet Existant**
   - Connectez un wallet déjà lié à un compte
   - ✅ Devrait rediriger selon le rôle (user → `/dashboard`, admin → `/admin/dashboard`)

### Test Protection des Routes

1. **Sans authentification**
   - Essayez d'accéder à `/dashboard` → ✅ Redirection vers `/`
   - Essayez d'accéder à `/admin/dashboard` → ✅ Redirection vers `/`

2. **Avec authentification**
   - User accède à `/admin/dashboard` → ✅ Redirection vers `/dashboard`
   - Admin accède à `/dashboard` → ✅ Redirection vers `/admin/dashboard`

## 📝 Fichiers SQL Disponibles

- `scripts/setup-users-table-complete.sql` - Script complet pour créer la table avec la colonne role
- `scripts/add-role-column-simple.sql` - Script pour ajouter uniquement la colonne role (si la table existe déjà)

## 🔧 Dépannage

### La table users n'existe pas
→ Exécutez `scripts/setup-users-table-complete.sql` dans Supabase SQL Editor

### La colonne role n'existe pas
→ Exécutez `scripts/add-role-column-simple.sql` dans Supabase SQL Editor

### Erreur "Could not find the table"
→ Vérifiez que vous avez bien créé la table dans Supabase Dashboard

### Les redirections ne fonctionnent pas
→ Vérifiez que le serveur Next.js est bien démarré (`npm run dev`)
→ Vérifiez les cookies dans les DevTools du navigateur (Application > Cookies)

## ✅ Checklist Finale

- [ ] Table `users` créée dans Supabase
- [ ] Colonne `role` présente dans la table
- [ ] Script de vérification exécuté avec succès
- [ ] Test connexion email/mdp user → `/dashboard`
- [ ] Test connexion email/mdp admin → `/admin/dashboard`
- [ ] Test connexion wallet → création compte + redirection
- [ ] Test protection des routes fonctionne

Une fois tous les éléments cochés, le système est prêt ! 🎉

