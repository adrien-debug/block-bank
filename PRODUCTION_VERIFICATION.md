# 🔍 Guide de Vérification Production - Google Drive API

Ce guide vous permet de vérifier que votre intégration Google Drive est correctement configurée pour la production.

## ⚡ Vérification Rapide

Exécutez le script de vérification automatique :

```bash
npm run verify:production
```

Ce script vérifie :
- ✅ Configuration Service Account ou OAuth
- ✅ Variables d'environnement requises
- ✅ Connexion à Google Drive
- ✅ Accès au dossier configuré
- ✅ Configuration Admin
- ✅ Configuration Next.js

## 📋 Checklist Manuelle

### 1. Google Cloud Console

#### ✅ API Google Drive activée
1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Sélectionnez votre projet
3. Menu → **APIs & Services** → **Library**
4. Recherchez "Google Drive API"
5. Vérifiez que l'API est **Enabled**

#### ✅ Service Account créé (Méthode 1 - Recommandée)
1. Menu → **APIs & Services** → **Credentials**
2. Vérifiez que votre Service Account existe
3. Vérifiez que l'email est au format : `xxx@xxx.iam.gserviceaccount.com`
4. Vérifiez que la clé JSON a été téléchargée

#### ✅ OAuth 2.0 Client ID (Méthode 2 - Alternative)
Si vous utilisez OAuth au lieu du Service Account :
1. Menu → **APIs & Services** → **Credentials**
2. Vérifiez que votre OAuth 2.0 Client ID existe
3. Vérifiez les **Authorized redirect URIs** :
   - Pour développement : `http://localhost:1001`
   - Pour production : `https://votre-domaine.com` (ou l'URL de votre app)

### 2. Google Drive

#### ✅ Dossier créé et partagé
1. Ouvrez [Google Drive](https://drive.google.com)
2. Vérifiez que le dossier "BlockBank Submissions" (ou votre nom de dossier) existe
3. Clic droit sur le dossier → **Share**
4. Vérifiez que le Service Account email est dans la liste avec les droits **Editor**
5. Copiez l'ID du dossier depuis l'URL :
   - URL : `https://drive.google.com/drive/folders/1ABC123...`
   - ID : `1ABC123...` (la partie après `/folders/`)

### 3. Variables d'Environnement Locales (.env.local)

Vérifiez que votre fichier `.env.local` contient toutes les variables :

```env
# Service Account (Méthode 1)
GOOGLE_SERVICE_ACCOUNT_EMAIL=votre-email@project-id.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nVotre clé complète ici\n-----END PRIVATE KEY-----\n"
GOOGLE_DRIVE_FOLDER_ID=votre-folder-id

# OU OAuth (Méthode 2)
GOOGLE_CLIENT_ID=votre-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=votre-client-secret
GOOGLE_REFRESH_TOKEN=votre-refresh-token
GOOGLE_REDIRECT_URI=https://votre-domaine.com

# Admin
ADMIN_PASSWORD_HASH=votre-hash-bcrypt
ADMIN_SESSION_SECRET=votre-secret-aleatoire-32-caracteres-minimum

# Next.js
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://votre-domaine.com
```

**Points importants :**
- `GOOGLE_PRIVATE_KEY` doit inclure `-----BEGIN PRIVATE KEY-----` et `-----END PRIVATE KEY-----`
- `GOOGLE_PRIVATE_KEY` peut utiliser `\n` pour les retours à la ligne
- `ADMIN_SESSION_SECRET` doit faire au moins 32 caractères
- `NEXT_PUBLIC_APP_URL` doit être l'URL complète de votre application en production

### 4. Variables d'Environnement Vercel

#### ✅ Configuration Vercel

**Option A : Script automatique**
```bash
npm run vercel:env:setup
```

**Option B : Vérification manuelle**
```bash
vercel env ls
```

Vérifiez que toutes ces variables sont définies pour **production** :
- `GOOGLE_SERVICE_ACCOUNT_EMAIL` (ou variables OAuth)
- `GOOGLE_PRIVATE_KEY` (ou `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`)
- `GOOGLE_DRIVE_FOLDER_ID`
- `GOOGLE_REDIRECT_URI` (optionnel, auto-détecté si `NEXT_PUBLIC_APP_URL` est défini)
- `ADMIN_PASSWORD_HASH`
- `ADMIN_SESSION_SECRET`
- `NODE_ENV=production`
- `NEXT_PUBLIC_APP_URL`

**Pour ajouter une variable manuellement :**
```bash
echo "valeur" | vercel env add NOM_VARIABLE production
```

## 🧪 Tests de Validation

### Test 1 : Vérification Locale

```bash
# 1. Vérifier la configuration
npm run verify:production

# 2. Démarrer le serveur
npm run dev

# 3. Tester une soumission
# Allez sur http://localhost:1001
# Remplissez le formulaire de soumission
# Vérifiez que les fichiers apparaissent dans Google Drive
```

### Test 2 : Test de Connexion Google Drive

Créez un fichier de test `test-drive-connection.js` :

```javascript
const { initGoogleDrive, listFiles } = require('./lib/utils/googleDrive')

async function test() {
  try {
    const drive = initGoogleDrive()
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID
    const files = await listFiles(folderId)
    console.log('✅ Connexion réussie !')
    console.log(`📁 Fichiers trouvés : ${files.length}`)
  } catch (error) {
    console.error('❌ Erreur :', error.message)
  }
}

test()
```

Exécutez :
```bash
node test-drive-connection.js
```

### Test 3 : Test Production (Vercel)

1. **Déployer sur Vercel**
   ```bash
   vercel --prod
   ```

2. **Vérifier les logs**
   ```bash
   vercel logs
   ```

3. **Tester une soumission en production**
   - Allez sur votre URL de production
   - Remplissez le formulaire
   - Vérifiez les logs Vercel pour les erreurs
   - Vérifiez que les fichiers apparaissent dans Google Drive

## 🚨 Dépannage

### Erreur : "GOOGLE_DRIVE_CONFIG_MISSING"

**Cause :** Variables d'environnement manquantes

**Solution :**
1. Vérifiez que `.env.local` existe et contient les variables
2. Vérifiez que les variables sont définies dans Vercel (pour production)
3. Exécutez `npm run verify:production` pour identifier les variables manquantes

### Erreur : "Permission denied" ou "403"

**Cause :** Le Service Account n'a pas accès au dossier

**Solution :**
1. Ouvrez Google Drive
2. Clic droit sur le dossier → **Share**
3. Ajoutez l'email du Service Account (trouvé dans `GOOGLE_SERVICE_ACCOUNT_EMAIL`)
4. Donnez les droits **Editor**
5. Attendez quelques minutes pour la propagation

### Erreur : "404 - Dossier non trouvé"

**Cause :** `GOOGLE_DRIVE_FOLDER_ID` incorrect

**Solution :**
1. Ouvrez le dossier dans Google Drive
2. Copiez l'ID depuis l'URL : `https://drive.google.com/drive/folders/ID_ICI`
3. Mettez à jour `GOOGLE_DRIVE_FOLDER_ID` dans `.env.local` et Vercel

### Erreur : "Invalid redirect URI"

**Cause :** Le redirect URI OAuth ne correspond pas

**Solution :**
1. Allez sur Google Cloud Console → **Credentials** → **OAuth 2.0 Client ID**
2. Vérifiez les **Authorized redirect URIs**
3. Ajoutez l'URL de production si manquante
4. Mettez à jour `GOOGLE_REDIRECT_URI` ou `NEXT_PUBLIC_APP_URL`

### Les fichiers n'apparaissent pas dans Google Drive

**Causes possibles :**
1. **Quota Service Account :** Les Service Accounts n'ont pas de quota de stockage par défaut
   - **Solution :** Utilisez OAuth au lieu du Service Account
   - **OU :** Utilisez un Shared Drive (Google Workspace)

2. **Erreur silencieuse :** Vérifiez les logs du serveur
   ```bash
   vercel logs
   ```

3. **Permissions insuffisantes :** Vérifiez que le Service Account a les droits **Editor**

## 📊 Résumé des Méthodes d'Authentification

### Méthode 1 : Service Account (Recommandée)

**Avantages :**
- ✅ Pas besoin de refresh token
- ✅ Plus simple à configurer
- ✅ Idéal pour les applications serveur

**Limitations :**
- ⚠️ Pas de quota de stockage (doit utiliser un dossier partagé)
- ⚠️ Nécessite un dossier partagé avec un compte Google réel

**Variables requises :**
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_PRIVATE_KEY`
- `GOOGLE_DRIVE_FOLDER_ID`

### Méthode 2 : OAuth 2.0

**Avantages :**
- ✅ Utilise le quota de votre compte Google
- ✅ Pas de limitation de stockage
- ✅ Plus flexible

**Limitations :**
- ⚠️ Nécessite un refresh token (configuration initiale plus complexe)
- ⚠️ Le refresh token peut expirer (rare)

**Variables requises :**
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REFRESH_TOKEN`
- `GOOGLE_REDIRECT_URI` (optionnel)
- `GOOGLE_DRIVE_FOLDER_ID`

## ✅ Checklist Finale

Avant de déployer en production, vérifiez :

- [ ] API Google Drive activée dans Google Cloud Console
- [ ] Service Account créé OU OAuth 2.0 Client ID configuré
- [ ] Dossier Google Drive créé et partagé avec le Service Account
- [ ] Toutes les variables d'environnement définies dans `.env.local`
- [ ] Toutes les variables d'environnement définies dans Vercel (production)
- [ ] `npm run verify:production` passe sans erreur
- [ ] Test de soumission local fonctionne
- [ ] Test de soumission en production fonctionne
- [ ] Les fichiers apparaissent dans Google Drive après soumission
- [ ] Le dashboard admin est accessible

## 📚 Ressources

- [Documentation Google Drive API](https://developers.google.com/drive/api/v3/about-sdk)
- [Service Accounts](https://cloud.google.com/iam/docs/service-accounts)
- [OAuth 2.0 pour Google APIs](https://developers.google.com/identity/protocols/oauth2)
- [GUIDE_GOOGLE_DRIVE.md](./GUIDE_GOOGLE_DRIVE.md) - Guide de configuration initiale
- [PRODUCTION_SETUP.md](./PRODUCTION_SETUP.md) - Guide de setup production


