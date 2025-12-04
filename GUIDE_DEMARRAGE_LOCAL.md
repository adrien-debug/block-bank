# Guide de Démarrage Local

Ce guide vous explique comment démarrer l'application BlockBank en local.

## Prérequis

- Node.js 18+ installé
- npm ou yarn
- Compte Supabase (gratuit)
- Variables d'environnement configurées

## 1. Installation des dépendances

```bash
npm install
```

## 2. Configuration des variables d'environnement

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```env
# Supabase Configuration (OBLIGATOIRE)
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-anon-key
SUPABASE_SERVICE_ROLE_KEY=votre-service-role-key

# Admin Authentication
ADMIN_PASSWORD_HASH=votre-hash-bcrypt
ADMIN_SESSION_SECRET=une-clé-secrète-aléatoire

# Next.js Configuration
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:1001
```

### Générer le hash du mot de passe admin

```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('votre-mot-de-passe', 10).then(console.log)"
```

Remplacez `votre-mot-de-passe` par le mot de passe que vous souhaitez utiliser pour l'admin.

### Obtenir les clés Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un projet (ou utilisez un existant)
3. Allez dans Settings > API
4. Copiez :
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Ne partagez jamais cette clé)

## 3. Configuration de la base de données Supabase

### Créer les tables marketing

1. Allez dans votre projet Supabase
2. Ouvrez l'éditeur SQL
3. Copiez et exécutez le contenu du fichier `supabase-marketing-schema.sql`

Ce script créera toutes les tables nécessaires pour le module marketing :
- `marketing_posts`
- `marketing_promotions`
- `marketing_adwords_campaigns`
- `marketing_content_sections`
- `marketing_calendar_events`

## 4. Démarrer l'application

```bash
npm run dev
```

L'application sera accessible sur : **http://localhost:1001**

## 5. Accéder à l'interface admin

1. Allez sur : http://localhost:1001/admin/login
2. Entrez le mot de passe que vous avez utilisé pour générer le hash
3. Vous serez redirigé vers le dashboard admin

## Structure de l'admin

Une fois connecté, vous aurez accès à :

- **Dashboard** : Vue d'ensemble des soumissions
- **Submissions** : Gestion des demandes de tokenisation
- **Marketing** : Nouveau module marketing avec :
  - 📱 Posts Réseaux Sociaux
  - 🎯 Promotions
  - 🔍 Google AdWords
  - 📅 Calendrier
  - 📝 Sections de contenu

## Dépannage

### Erreur : "Missing Supabase environment variables"

Vérifiez que votre fichier `.env.local` contient bien toutes les variables Supabase.

### Erreur : "Non autorisé" lors de l'accès à l'admin

Vérifiez que :
1. Vous avez généré le hash avec le bon mot de passe
2. La variable `ADMIN_PASSWORD_HASH` est correctement définie
3. Vous utilisez le même mot de passe pour vous connecter

### Les tables marketing n'existent pas

Assurez-vous d'avoir exécuté le script SQL dans Supabase. Vérifiez dans l'éditeur SQL de Supabase que les tables existent bien.

### Port 1001 déjà utilisé

Si le port 1001 est déjà utilisé, modifiez le script dans `package.json` :

```json
"dev": "next dev -p 3000"
```

Puis redémarrez avec `npm run dev`.

## Commandes utiles

- `npm run dev` - Démarre le serveur de développement
- `npm run build` - Compile l'application pour la production
- `npm run start` - Démarre le serveur de production (après build)
- `npm run lint` - Vérifie le code avec ESLint

## Support

Pour toute question ou problème, consultez la documentation :
- [README.md](README.md)
- [GUIDE_ADMIN.md](GUIDE_ADMIN.md)

