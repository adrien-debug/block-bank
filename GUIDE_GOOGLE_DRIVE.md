# 🚀 Guide Rapide : Configuration Google Drive

Ce guide vous explique comment configurer Google Drive pour stocker automatiquement les documents des soumissions.

## ⚡ Méthode Rapide (Recommandée)

Utilisez le script interactif qui vous guide étape par étape :

```bash
npm run setup:google-drive
```

ou directement :

```bash
node scripts/setup-google-drive-complete.js
```

Le script va :
1. ✅ Ouvrir Google Cloud Console dans votre navigateur
2. ✅ Vous guider pour créer le Service Account
3. ✅ Extraire automatiquement les credentials depuis le fichier JSON
4. ✅ Ouvrir Google Drive pour créer et partager le dossier
5. ✅ Configurer les variables d'environnement locales (.env.local)
6. ✅ Configurer automatiquement Vercel (si vous êtes connecté)

## 📋 Configuration Manuelle

Si vous préférez configurer manuellement, suivez ces étapes :

### 1. Google Cloud Console

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet (ou sélectionnez un existant)
3. Activez l'API Google Drive :
   - Menu → **APIs & Services** → **Library**
   - Recherchez "Google Drive API"
   - Cliquez sur **Enable**

### 2. Service Account

1. Menu → **APIs & Services** → **Credentials**
2. Cliquez sur **Create Credentials** → **Service Account**
3. Donnez un nom (ex: "blockbank-drive")
4. Cliquez sur **Create and Continue**
5. Cliquez sur **Done**

### 3. Télécharger les Credentials

1. Dans la liste des Service Accounts, cliquez sur celui créé
2. Onglet **Keys** → **Add Key** → **Create new key**
3. Sélectionnez **JSON**
4. Téléchargez le fichier JSON

### 4. Google Drive

1. Créez un dossier dans Google Drive (ex: "BlockBank Submissions")
2. Cliquez droit sur le dossier → **Share**
3. Ajoutez l'email du Service Account (trouvé dans le fichier JSON, champ `client_email`)
4. Donnez les droits **Editor** (Éditeur)
5. Copiez l'ID du dossier depuis l'URL :
   - URL : `https://drive.google.com/drive/folders/1ABC123...`
   - ID : `1ABC123...` (la partie après `/folders/`)

### 5. Variables d'Environnement

Créez ou modifiez `.env.local` :

```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=votre-email@project-id.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nVotre clé privée ici\n-----END PRIVATE KEY-----\n"
GOOGLE_DRIVE_FOLDER_ID=votre-folder-id

ADMIN_PASSWORD_HASH=votre-hash-bcrypt
ADMIN_SESSION_SECRET=votre-secret-aleatoire
NODE_ENV=production
```

**Important pour GOOGLE_PRIVATE_KEY :**
- Copiez TOUT le contenu entre `-----BEGIN PRIVATE KEY-----` et `-----END PRIVATE KEY-----`
- Remplacez les retours à la ligne par `\n` (ou laissez le script le faire automatiquement)

### 6. Configuration Vercel

**Option A : Script automatique**
```bash
npm run vercel:env:setup
```

**Option B : Manuellement**
```bash
# Pour chaque variable
echo "valeur" | vercel env add GOOGLE_SERVICE_ACCOUNT_EMAIL production
echo "valeur" | vercel env add GOOGLE_PRIVATE_KEY production
echo "valeur" | vercel env add GOOGLE_DRIVE_FOLDER_ID production
echo "valeur" | vercel env add ADMIN_PASSWORD_HASH production
echo "valeur" | vercel env add ADMIN_SESSION_SECRET production
```

## 🔍 Vérification

1. **Test local :**
   ```bash
   npm run dev
   ```
   Soumettez une demande via le formulaire et vérifiez que les fichiers apparaissent dans Google Drive.

2. **Vérifier les variables Vercel :**
   ```bash
   vercel env ls
   ```

3. **Dashboard Admin :**
   - Allez sur `/admin/login`
   - Connectez-vous avec le mot de passe configuré

## 🆘 Dépannage

### Erreur : "Google Drive is not configured"
- Vérifiez que toutes les variables d'environnement sont définies
- Vérifiez que le Service Account a accès au dossier Google Drive
- Vérifiez que l'API Google Drive est activée

### Erreur : "Permission denied"
- Vérifiez que le Service Account a les droits "Editor" sur le dossier
- Vérifiez que l'email du Service Account est correct

### Les fichiers n'apparaissent pas dans Google Drive
- Vérifiez que le `GOOGLE_DRIVE_FOLDER_ID` est correct
- Vérifiez les logs du serveur pour plus de détails
- Vérifiez les quotas de l'API Google Drive

## 📚 Ressources

- [Documentation Google Drive API](https://developers.google.com/drive/api/v3/about-sdk)
- [Service Accounts](https://cloud.google.com/iam/docs/service-accounts)
- [SETUP_GOOGLE_DRIVE.md](./SETUP_GOOGLE_DRIVE.md) - Guide détaillé


