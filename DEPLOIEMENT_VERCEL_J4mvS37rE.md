# 🚀 Guide de Déploiement Vercel - État Stable J4mvS37rE

## 📋 Vue d'ensemble

Ce guide vous permet de déployer **exactement** comme dans l'état stable J4mvS37rE, à la lettre.

---

## ✅ Checklist Pré-Déploiement

### 1. Fichiers de Configuration

Tous ces fichiers doivent être présents et identiques :

- ✅ `next.config.js` - Configuration Next.js
- ✅ `vercel.json` - Configuration Vercel
- ✅ `.vercelignore` - Fichiers à ignorer
- ✅ `package.json` - Dépendances
- ✅ `tsconfig.json` - Configuration TypeScript
- ✅ `middleware.ts` - Protection des routes admin

### 2. Variables d'Environnement Vercel

**Variables REQUISES (Service Account uniquement) :**

```bash
✅ GOOGLE_SERVICE_ACCOUNT_EMAIL
✅ GOOGLE_PRIVATE_KEY
✅ GOOGLE_DRIVE_FOLDER_ID
✅ ADMIN_PASSWORD_HASH
✅ ADMIN_SESSION_SECRET
✅ NODE_ENV (production)
✅ NEXT_PUBLIC_APP_URL
```

**Variables à SUPPRIMER (OAuth) :**

```bash
❌ GOOGLE_CLIENT_ID
❌ GOOGLE_CLIENT_SECRET
❌ GOOGLE_REFRESH_TOKEN
```

### 3. Vercel Authentication

**🚨 CRITIQUE :** Vercel Authentication doit être **DÉSACTIVÉ** dans le Dashboard.

---

## 🚀 Méthode 1 : Script Automatique (Recommandé)

### Exécution du script

```bash
./scripts/deploy-vercel-j4mvs37re.sh
```

Le script va :
1. ✅ Vérifier tous les fichiers de configuration
2. ✅ Vérifier les variables d'environnement
3. ✅ Proposer de supprimer les variables OAuth
4. ✅ Vérifier que Vercel Authentication est désactivé
5. ✅ Tester le build local
6. ✅ Déployer sur Vercel

---

## 🚀 Méthode 2 : Déploiement Manuel

### Étape 1 : Désactiver Vercel Authentication

**⚠️ ACTION MANUELLE OBLIGATOIRE**

1. Ouvrez : https://vercel.com/adrien-nejkovics-projects/block-bank/settings/deployment-protection
2. Changez : `Vercel Authentication` → **`Only Vercel for GitHub`**
3. Cliquez sur **"Save"**

**Pourquoi ?** Vercel Authentication bloque toutes les routes API (`/api/*`) et retourne une page HTML au lieu de JSON.

### Étape 2 : Nettoyer les Variables OAuth

```bash
# Vérifier les variables actuelles
vercel env ls

# Supprimer les variables OAuth (si présentes)
vercel env rm GOOGLE_CLIENT_ID production --yes
vercel env rm GOOGLE_CLIENT_SECRET production --yes
vercel env rm GOOGLE_REFRESH_TOKEN production --yes 2>/dev/null || true
```

### Étape 3 : Vérifier les Variables Requises

```bash
# Vérifier que vous avez uniquement ces variables :
vercel env ls | grep -E "(GOOGLE_SERVICE_ACCOUNT_EMAIL|GOOGLE_PRIVATE_KEY|GOOGLE_DRIVE_FOLDER_ID|ADMIN_PASSWORD_HASH|ADMIN_SESSION_SECRET|NODE_ENV|NEXT_PUBLIC_APP_URL)"
```

**Doit afficher :**
- ✅ GOOGLE_SERVICE_ACCOUNT_EMAIL
- ✅ GOOGLE_PRIVATE_KEY
- ✅ GOOGLE_DRIVE_FOLDER_ID
- ✅ ADMIN_PASSWORD_HASH
- ✅ ADMIN_SESSION_SECRET
- ✅ NODE_ENV
- ✅ NEXT_PUBLIC_APP_URL

**Ne doit PAS afficher :**
- ❌ GOOGLE_CLIENT_ID
- ❌ GOOGLE_CLIENT_SECRET

### Étape 4 : Test de Build Local

```bash
# Installer les dépendances
npm install

# Tester le build
npm run build
```

Si le build échoue, corrigez les erreurs avant de déployer.

### Étape 5 : Déploiement

```bash
# Déployer en production
vercel --prod
```

---

## 🔍 Vérification Post-Déploiement

### 1. Tester l'API

```bash
# Tester que l'API est accessible (devrait retourner JSON, pas HTML)
curl -X GET "https://block-bank-xxxxx.vercel.app/api/admin/submissions" \
  -H "Content-Type: application/json"
```

**Si vous recevez une page HTML** → Vercel Authentication est toujours activé.

**Si vous recevez du JSON** → ✅ C'est bon !

### 2. Tester une Soumission

1. Ouvrez votre application en production
2. Remplissez le formulaire de soumission
3. Soumettez avec des fichiers < 3MB
4. Vérifiez :
   - ✅ La soumission se complète (pas de timeout)
   - ✅ Les fichiers apparaissent sur Google Drive
   - ✅ La soumission apparaît dans `/admin/submissions`

### 3. Vérifier les Logs

```bash
# Suivre les logs en temps réel
vercel logs --follow
```

---

## 📋 Configuration des Fichiers

### next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: false,
  },
  // Optimizations for Vercel
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  
  // Augmenter la limite de taille pour les uploads de fichiers
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb'
    }
  }
}

module.exports = nextConfig
```

### vercel.json

```json
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, PUT, DELETE, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type, Authorization"
        }
      ]
    }
  ],
  "regions": ["iad1"],
  "framework": "nextjs",
  "buildCommand": "next build",
  "devCommand": "next dev",
  "installCommand": "npm install",
  "outputDirectory": ".next"
}
```

### .vercelignore

```
# Vercel ignore file
.env.local
.env.*.local
*.backup
```

---

## 🚨 Problèmes Courants

### Erreur : "API retourne HTML au lieu de JSON"

**Cause :** Vercel Authentication est activé.

**Solution :** Désactivez Vercel Authentication dans le Dashboard :
1. https://vercel.com/adrien-nejkovics-projects/block-bank/settings/deployment-protection
2. Changez vers "Only Vercel for GitHub"
3. Redéployez : `vercel --prod`

### Erreur : "invalid_grant"

**Cause :** Variables OAuth présentes en même temps que Service Account.

**Solution :** Supprimez les variables OAuth :
```bash
vercel env rm GOOGLE_CLIENT_ID production --yes
vercel env rm GOOGLE_CLIENT_SECRET production --yes
vercel --prod
```

### Erreur : "FUNCTION_PAYLOAD_TOO_LARGE"

**Cause :** Fichiers trop volumineux (> 4.5MB).

**Solution :** Limitez la taille des fichiers uploadés à 3MB maximum.

### Erreur : "Google Drive is not configured"

**Cause :** Variables Google Drive manquantes ou incorrectes.

**Solution :** Vérifiez les variables :
```bash
vercel env ls | grep GOOGLE
```

Doit afficher :
- GOOGLE_SERVICE_ACCOUNT_EMAIL
- GOOGLE_PRIVATE_KEY
- GOOGLE_DRIVE_FOLDER_ID

---

## 📖 Documentation Complémentaire

- **`RESTAURATION_J4mvS37rE.md`** - Guide complet de restauration
- **`VARIABLES_VERCEL.md`** - Configuration détaillée des variables
- **`GUIDE_RAPIDE_RESTAURATION.md`** - Guide rapide (5 minutes)
- **`PRODUCTION_SETUP.md`** - Configuration Google Drive

---

## ✅ Résultat Attendu

Après avoir suivi ce guide, votre déploiement devrait fonctionner **exactement comme J4mvS37rE** :

- ✅ API accessibles publiquement
- ✅ Soumissions fonctionnelles
- ✅ Upload Google Drive opérationnel
- ✅ Pas d'erreurs `invalid_grant`
- ✅ Build réussi
- ✅ Pas de blocage par Vercel Authentication

---

**Dernière mise à jour** : Décembre 2025  
**Référence** : Déploiement stable J4mvS37rE


