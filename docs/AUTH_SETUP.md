# Configuration de l'authentification

## ✅ État actuel

Le système d'authentification est **entièrement configuré et prêt à l'emploi** :

- ✅ API d'inscription (`/api/auth/register`)
- ✅ API de connexion (`/api/auth/login`)
- ✅ API de session (`/api/auth`)
- ✅ API de déconnexion (`/api/auth/logout`)
- ✅ API de connexion wallet (`/api/auth/connect-wallet`)
- ✅ Composants UI (RegistrationModal, LoginModal)
- ✅ Context d'authentification (AuthContext)
- ✅ Gestion des sessions avec cookies

## 🚀 Configuration requise

### 1. Variables d'environnement

Assurez-vous d'avoir ces variables dans votre `.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-anon-key
SUPABASE_SERVICE_ROLE_KEY=votre-service-role-key
```

### 2. Création de la table users

#### Option A : Via le script automatique

```bash
npm run setup:users
```

#### Option B : Manuellement dans Supabase

1. Allez dans votre projet Supabase
2. Ouvrez le **SQL Editor**
3. Copiez-collez le contenu de `scripts/create-users-table.sql`
4. Exécutez le script

### 3. Structure de la table users

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  address TEXT,
  wallet_address VARCHAR(42),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 📝 Utilisation

### Inscription

Les utilisateurs peuvent s'inscrire via :
- La modale d'inscription (s'ouvre automatiquement si non authentifié)
- Le bouton "S'inscrire" dans la modale de connexion

### Connexion

Les utilisateurs peuvent se connecter via :
- Email / Mot de passe
- Wallet Web3 (MetaMask)

### Fonctionnalités

- ✅ Validation des champs
- ✅ Hash des mots de passe (bcrypt)
- ✅ Gestion des sessions (cookies httpOnly)
- ✅ Vérification de l'authentification au chargement
- ✅ Déconnexion

## 🔍 Vérification

Pour tester que tout fonctionne :

1. Vérifiez que la table `users` existe dans Supabase
2. Essayez de créer un compte via l'interface
3. Vérifiez que l'utilisateur apparaît dans la table `users`
4. Testez la connexion avec les identifiants créés

## 🐛 Dépannage

### Erreur : "Missing Supabase environment variables"
- Vérifiez que `.env.local` existe et contient les bonnes variables
- Redémarrez le serveur de développement

### Erreur : "Table users does not exist"
- Exécutez `npm run setup:users` ou créez la table manuellement

### Erreur : "Email already exists"
- C'est normal, l'email doit être unique
- Utilisez un autre email ou connectez-vous avec l'email existant

### La modale ne s'ouvre pas
- Vérifiez que `ModalProvider` est bien dans `app/providers.tsx`
- Vérifiez la console du navigateur pour les erreurs
