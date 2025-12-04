# Protocole de Credit Banking On-Chain

Interface Next.js pour le protocole de crédit banking on-chain - Adrien × Qatar

## 🚀 Démarrage Rapide (Local)

### 1. Installation des dépendances

```bash
npm install
```

### 2. Configuration de l'environnement

Créez un fichier `.env.local` à la racine avec les variables suivantes :

```env
# Supabase (OBLIGATOIRE)
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-anon-key
SUPABASE_SERVICE_ROLE_KEY=votre-service-role-key

# Admin (OBLIGATOIRE)
ADMIN_PASSWORD_HASH=votre-hash-bcrypt
ADMIN_SESSION_SECRET=clé-secrète-aléatoire

# Next.js
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:1001
```

**Générer le hash du mot de passe admin :**
```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('votre-mot-de-passe', 10).then(console.log)"
```

### 3. Configurer Supabase

1. Créez un projet sur [supabase.com](https://supabase.com)
2. Exécutez le script SQL `supabase-marketing-schema.sql` dans l'éditeur SQL de Supabase
3. Copiez vos clés API depuis Settings > API

### 4. Vérifier la configuration

```bash
npm run check:local
```

### 5. Démarrer l'application

```bash
npm run dev
```

Ouvrez [http://localhost:1001](http://localhost:1001) dans votre navigateur.

**Accès Admin :** [http://localhost:1001/admin/login](http://localhost:1001/admin/login)

## 📚 Documentation

- **[GUIDE_DEMARRAGE_LOCAL.md](GUIDE_DEMARRAGE_LOCAL.md)** - Guide complet de démarrage local
- **[GUIDE_ADMIN.md](GUIDE_ADMIN.md)** - Guide d'utilisation de l'interface admin

## 🏗️ Build Production

```bash
npm run build
npm start
```

## 📁 Structure

- `app/` - Pages et layout Next.js
- `components/` - Composants React réutilisables
- `app/admin/` - Interface admin (Dashboard, Submissions, Marketing)
- `app/api/` - Routes API
- `lib/` - Services et utilitaires
- `types/` - Types TypeScript
- `styles/` - Styles CSS

## ✨ Nouveautés

### Module Marketing Admin

Nouveau module complet pour gérer :
- 📱 Posts réseaux sociaux (Facebook, Twitter, Instagram, LinkedIn, TikTok, YouTube)
- 🎯 Promotions et campagnes
- 🔍 Google AdWords
- 📅 Calendrier éditorial
- 📝 Sections de contenu réutilisables

Accessible via : `/admin/marketing`

