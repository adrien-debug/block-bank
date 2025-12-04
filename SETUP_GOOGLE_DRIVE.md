# Configuration Google Drive pour BlockBank

## Étapes de configuration

### 1. Créer un projet Google Cloud

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Notez le nom du projet

### 2. Activer l'API Google Drive

1. Dans le menu, allez dans **APIs & Services** > **Library**
2. Recherchez "Google Drive API"
3. Cliquez sur **Enable**

### 3. Créer un Service Account

1. Allez dans **APIs & Services** > **Credentials**
2. Cliquez sur **Create Credentials** > **Service Account**
3. Donnez un nom au service account (ex: "blockbank-drive")
4. Cliquez sur **Create and Continue**
5. Optionnel : Ajoutez un rôle (peut être laissé vide)
6. Cliquez sur **Done**

### 4. Télécharger les credentials

1. Dans la liste des Service Accounts, cliquez sur celui que vous venez de créer
2. Allez dans l'onglet **Keys**
3. Cliquez sur **Add Key** > **Create new key**
4. Sélectionnez **JSON**
5. Téléchargez le fichier JSON

### 5. Configurer Google Drive

1. Ouvrez le fichier JSON téléchargé
2. Notez l'email du service account (champ `client_email`)
3. Notez la clé privée (champ `private_key`)

### 6. Créer et partager un dossier Google Drive

1. Créez un dossier dans Google Drive (ex: "BlockBank Submissions")
2. Cliquez droit sur le dossier > **Share**
3. Ajoutez l'email du Service Account (celui du fichier JSON)
4. Donnez les droits **Editor** (Éditeur)
5. Cliquez sur **Done**
6. Copiez l'ID du dossier depuis l'URL :
   - L'URL ressemble à : `https://drive.google.com/drive/folders/1ABC123...`
   - L'ID est la partie après `/folders/`

### 7. Configurer les variables d'environnement

1. Copiez `.env.local.example` vers `.env.local`
2. Remplissez les valeurs :
   - `GOOGLE_DRIVE_FOLDER_ID` : L'ID du dossier partagé
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL` : L'email du Service Account
   - `GOOGLE_PRIVATE_KEY` : La clé privée (avec les `\n` pour les retours à la ligne)

### 8. Générer le hash du mot de passe admin

Pour générer le hash du mot de passe admin, vous pouvez :

**Option 1 : Utiliser Node.js**
```bash
node -e "const crypto = require('crypto'); const secret = 'votre_secret_aleatoire'; const password = 'votre_mot_de_passe'; console.log(crypto.createHash('sha256').update(password + secret).digest('hex'))"
```

**Option 2 : Utiliser le code dans `lib/utils/adminAuth.ts`**
- Créez un script temporaire qui utilise `hashPassword()`

**Option 3 : Utiliser un mot de passe par défaut**
- Si `ADMIN_PASSWORD_HASH` n'est pas défini, le mot de passe par défaut est "admin"
- ⚠️ **Changez-le en production !**

### 9. Générer un secret de session

Générez une chaîne aléatoire d'au moins 32 caractères pour `ADMIN_SESSION_SECRET` :

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Vérification

Une fois configuré, testez en :
1. Démarrant le serveur : `npm run dev`
2. Soumettant une demande via le formulaire
3. Vérifiant que les fichiers apparaissent dans Google Drive
4. Vous connectant au dashboard admin : `/admin/login`

## Sécurité

- ⚠️ Ne commitez **jamais** le fichier `.env.local` dans Git
- ⚠️ Ne partagez **jamais** les credentials du Service Account
- ⚠️ Utilisez un mot de passe fort pour l'admin
- ⚠️ En production, utilisez les secrets de votre plateforme de déploiement (Vercel, etc.)


