# Configuration Vercel - Variables d'environnement

## Méthode 1 : Script automatique depuis .env.local

Si vous avez un fichier `.env.local` avec toutes les variables :

```bash
node scripts/vercel-env-from-local.js
```

## Méthode 2 : Configuration interactive

```bash
node scripts/set-vercel-env.js
```

## Méthode 3 : Configuration manuelle via CLI

Pour chaque variable, exécutez :

```bash
# Pour production
echo "valeur" | vercel env add NOM_VARIABLE production

# Pour preview
echo "valeur" | vercel env add NOM_VARIABLE preview

# Pour development
echo "valeur" | vercel env add NOM_VARIABLE development
```

## Variables requises

1. **GOOGLE_SERVICE_ACCOUNT_EMAIL**
   - Email du Service Account Google Cloud
   - Format: `xxx@xxx.iam.gserviceaccount.com`

2. **GOOGLE_PRIVATE_KEY**
   - Clé privée complète du Service Account
   - Format: `-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n`

3. **GOOGLE_DRIVE_FOLDER_ID**
   - ID du dossier Google Drive
   - Trouvé dans l'URL du dossier partagé

4. **ADMIN_PASSWORD_HASH**
   - Hash bcrypt du mot de passe admin
   - Générer avec: `node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('votre-mot-de-passe', 10).then(console.log)"`

5. **ADMIN_SESSION_SECRET**
   - Clé secrète aléatoire pour les sessions
   - Générer avec: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

6. **NODE_ENV**
   - Toujours: `production`

## Vérification

Après configuration, vérifiez avec :

```bash
vercel env ls
```

## Script rapide

Pour configurer toutes les variables rapidement, utilisez le script bash :

```bash
./scripts/quick-vercel-setup.sh
```

