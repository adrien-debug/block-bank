# Test du Flow d'Authentification

## ✅ Checklist de Test

### 1. Migration Base de Données
- [ ] Exécuter le script SQL : `scripts/add-role-column-to-users.sql`
- [ ] Vérifier que la colonne `role` existe dans la table `users`

### 2. Test Connexion Email/Mot de passe

#### Test User Normal
- [ ] Créer un compte avec email/mdp (rôle user par défaut)
- [ ] Se connecter avec email/mdp
- [ ] Vérifier redirection vers `/dashboard`
- [ ] Vérifier que le cookie `user_role` = `user`

#### Test Admin
- [ ] Créer un compte admin (modifier manuellement en DB : `UPDATE users SET role = 'admin' WHERE email = 'admin@test.com'`)
- [ ] Se connecter avec email/mdp admin
- [ ] Vérifier redirection vers `/admin/dashboard`
- [ ] Vérifier que le cookie `user_role` = `admin`

### 3. Test Connexion Wallet

#### Test Nouveau Wallet (Première connexion)
- [ ] Connecter un wallet qui n'existe pas encore
- [ ] Vérifier création automatique d'un compte avec `role = 'user'`
- [ ] Vérifier redirection vers `/dashboard`
- [ ] Vérifier que le cookie `user_role` = `user`

#### Test Wallet Existant (User)
- [ ] Connecter un wallet déjà lié à un compte user
- [ ] Vérifier redirection vers `/dashboard`
- [ ] Vérifier que le cookie `user_role` = `user`

#### Test Wallet Existant (Admin)
- [ ] Lier un wallet à un compte admin (modifier en DB)
- [ ] Connecter ce wallet
- [ ] Vérifier redirection vers `/admin/dashboard`
- [ ] Vérifier que le cookie `user_role` = `admin`

### 4. Test Protection des Routes

#### Routes Dashboard User
- [ ] Accéder à `/dashboard` sans être connecté → Redirection vers `/`
- [ ] Accéder à `/dashboard` en tant qu'admin → Redirection vers `/admin/dashboard`
- [ ] Accéder à `/dashboard` en tant qu'user → Accès autorisé

#### Routes Admin
- [ ] Accéder à `/admin/dashboard` sans être connecté → Redirection vers `/`
- [ ] Accéder à `/admin/dashboard` en tant qu'user → Redirection vers `/dashboard`
- [ ] Accéder à `/admin/dashboard` en tant qu'admin → Accès autorisé

### 5. Test Déconnexion
- [ ] Se déconnecter
- [ ] Vérifier suppression des cookies (`auth_session`, `user_id`, `user_role`)
- [ ] Vérifier redirection vers `/`

### 6. Test Reconnexion Automatique
- [ ] Se connecter avec wallet
- [ ] Fermer et rouvrir le navigateur
- [ ] Vérifier que la session est restaurée
- [ ] Vérifier redirection automatique selon le rôle

## 🔧 Commandes Utiles

### Vérifier les cookies dans le navigateur
```javascript
// Console du navigateur
document.cookie
```

### Vérifier la session API
```bash
curl http://localhost:1001/api/auth
```

### Créer un utilisateur admin en DB
```sql
-- Dans Supabase SQL Editor
UPDATE users SET role = 'admin' WHERE email = 'votre-email@example.com';
```

## 📝 Notes

- Le serveur tourne sur `http://localhost:1001`
- Les cookies sont httpOnly, donc non accessibles via JavaScript côté client
- Le middleware vérifie les rôles avant d'autoriser l'accès
- Les layouts vérifient aussi les rôles pour une double sécurité

