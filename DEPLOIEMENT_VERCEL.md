# 🚀 Guide de Déploiement Vercel

## ✅ Étape 1 : Push GitHub (TERMINÉ)

Les modifications ont été poussées sur GitHub avec succès :
- **Branche** : `Stable`
- **Commit** : `8976e20`
- **Repository** : `https://github.com/adrien-debug/block-bank.git`

---

## 🔧 Étape 2 : Configuration Vercel

### Option A : Via le Dashboard Vercel (Recommandé)

1. **Aller sur** [vercel.com](https://vercel.com)
2. **Se connecter** avec votre compte
3. **Cliquer sur "Add New Project"**
4. **Importer le repository** : `adrien-debug/block-bank`
5. **Configurer le projet** :
   - **Framework Preset** : Next.js
   - **Root Directory** : `./` (par défaut)
   - **Build Command** : `npm run build` (par défaut)
   - **Output Directory** : `.next` (par défaut)
   - **Install Command** : `npm install` (par défaut)

### Option B : Via Vercel CLI

```bash
cd /Users/adrienbeyondcrypto/Desktop/MyBank
vercel login
vercel link
vercel --prod
```

---

## 🔑 Étape 3 : Variables d'Environnement Vercel

**IMPORTANT** : Ajouter ces variables dans Vercel Dashboard > Settings > Environment Variables :

### Variables Supabase (OBLIGATOIRES)

```
NEXT_PUBLIC_SUPABASE_URL=https://ipamfhfzflprptchlaei.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwYW1maGZ6ZmxwcnB0Y2hsYWVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4MjU1MTIsImV4cCI6MjA4MDQwMTUxMn0.PcBz9dNKIxqfBB6qZL-MEXZwNksPrmRd4NiqMl_DqIM
SUPABASE_SERVICE_ROLE_KEY=sb_secret_bwOb94DH5xVC05YNV_loOQ_HmdblB94
```

### Variables Admin (si nécessaire)

```
ADMIN_PASSWORD_HASH=votre-hash-bcrypt
ADMIN_SESSION_SECRET=votre-secret-session
```

### Variables Google Drive (si utilisé)

```
GOOGLE_SERVICE_ACCOUNT_EMAIL=...
GOOGLE_PRIVATE_KEY=...
GOOGLE_DRIVE_FOLDER_ID=...
```

### Configuration

- **Environnements** : Sélectionner `Production`, `Preview`, et `Development`
- **Cliquer sur "Save"**

---

## 📋 Étape 4 : Vérifications Post-Déploiement

### 1. Vérifier que Supabase est accessible

Une fois déployé, tester :
- Créer une nouvelle soumission
- Vérifier dans Supabase Dashboard que les données sont sauvegardées

### 2. Vérifier les fichiers

- Tester le téléchargement de fichiers depuis l'interface admin
- Vérifier que les URLs Supabase fonctionnent

### 3. Vérifier les performances

- Tester la vitesse de chargement des pages
- Vérifier que le cache fonctionne

---

## 🔄 Déploiement Automatique

Si vous configurez Vercel avec GitHub, chaque push sur la branche `Stable` déclenchera automatiquement un déploiement.

### Configuration automatique recommandée

1. Dans Vercel Dashboard > Settings > Git
2. Activer "Automatic deployments from Git"
3. Sélectionner la branche `Stable` pour Production

---

## 🐛 Dépannage

### Erreur : "Missing Supabase environment variables"

➡️ Vérifier que toutes les variables Supabase sont bien configurées dans Vercel

### Erreur : "Cannot find module '@supabase/supabase-js'"

➡️ Vérifier que `package.json` contient bien la dépendance (déjà ajoutée)

### Erreur : "Table does not exist"

➡️ Exécuter le script SQL `scripts/supabase-setup.sql` dans Supabase Dashboard

### Les fichiers ne se chargent pas

➡️ Vérifier que le bucket `submissions` existe dans Supabase Storage

---

## 📊 Statut Actuel

- ✅ **Code poussé sur GitHub** : `Stable` branch
- ⏳ **Vercel** : À configurer
- ✅ **Supabase** : Configuré et fonctionnel
- ✅ **Tables** : Créées
- ✅ **Bucket Storage** : Créé

---

**Prochaine étape** : Configurer Vercel via le Dashboard et ajouter les variables d'environnement.

