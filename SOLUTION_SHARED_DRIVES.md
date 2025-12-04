# Solution : Service Accounts sans quota de stockage

## 🚨 Problème

Les Service Accounts Google Cloud **n'ont pas de quota de stockage** dans Google Drive, même dans des dossiers partagés. C'est une limitation de Google.

**Erreur typique :**
```
Service Accounts do not have storage quota. Leverage shared drives 
(https://developers.google.com/workspace/drive/api/guides/about-shareddrives), 
or use OAuth delegation (http://support.google.com/a/answer/7281227) instead.
```

---

## ✅ Solutions disponibles

### Solution 1 : Utiliser des Shared Drives (Google Workspace) ⭐ RECOMMANDÉE

Les Shared Drives (anciennement Team Drives) permettent aux Service Accounts de stocker des fichiers car ils n'utilisent pas le quota personnel.

**Prérequis :** Avoir Google Workspace (pas un compte Google personnel)

#### Étape 1 : Créer un Shared Drive

1. Allez sur [Google Drive](https://drive.google.com)
2. Dans le menu gauche, cliquez sur **"Shared drives"** (Dossiers partagés)
3. Cliquez sur **"+ New"** pour créer un nouveau Shared Drive
4. Nommez-le (ex: "BlockBank Submissions")
5. Notez l'ID du Shared Drive dans l'URL : `https://drive.google.com/drive/folders/XXXXXXXXXXXXXXXXX`

#### Étape 2 : Partager le Shared Drive avec le Service Account

1. Ouvrez le Shared Drive créé
2. Cliquez sur le nom du Shared Drive (en haut à gauche)
3. Cliquez sur **"Manage members"** (Gérer les membres)
4. Ajoutez l'email du Service Account (trouvé dans `GOOGLE_SERVICE_ACCOUNT_EMAIL`)
5. Donnez-lui le rôle **"Content Manager"** ou **"Manager"**
6. Cliquez sur **"Send"**

#### Étape 3 : Configurer les variables d'environnement

Ajoutez ces variables dans Vercel ou votre `.env.local` :

```bash
# Activer le support des Shared Drives
GOOGLE_USE_SHARED_DRIVE=true

# ID du Shared Drive (trouvé dans l'URL)
GOOGLE_SHARED_DRIVE_ID=XXXXXXXXXXXXXXXXX
```

**Note :** Le `GOOGLE_DRIVE_FOLDER_ID` existant n'est plus nécessaire si vous utilisez un Shared Drive.

#### Étape 4 : Vérifier la configuration

```bash
# Dans Vercel
vercel env add GOOGLE_USE_SHARED_DRIVE production
# Entrez: true

vercel env add GOOGLE_SHARED_DRIVE_ID production
# Entrez: l'ID du Shared Drive
```

---

### Solution 2 : OAuth Delegation (Domain-Wide Delegation)

Pour les comptes Google Workspace, vous pouvez utiliser OAuth delegation pour que le Service Account agisse au nom d'un utilisateur qui a du quota.

**Prérequis :** 
- Google Workspace Admin
- Domain-wide delegation configuré

#### Étape 1 : Activer Domain-Wide Delegation

1. Dans Google Cloud Console, allez dans **IAM & Admin** → **Service Accounts**
2. Ouvrez votre Service Account
3. Cliquez sur l'onglet **"Advanced settings"**
4. Activez **"Enable G Suite Domain-wide Delegation"**
5. Notez le **Client ID** du Service Account

#### Étape 2 : Configurer dans Google Admin Console

1. Allez dans [Google Admin Console](https://admin.google.com)
2. **Security** → **API Controls** → **Domain-wide Delegation**
3. Cliquez sur **"Add new"**
4. Entrez le **Client ID** du Service Account
5. Dans **OAuth scopes**, ajoutez :
   ```
   https://www.googleapis.com/auth/drive
   https://www.googleapis.com/auth/drive.file
   ```
6. Cliquez sur **"Authorize"**

#### Étape 3 : Configurer les variables d'environnement

```bash
# Email de l'utilisateur Google Workspace à impersonner
GOOGLE_DELEGATION_SUBJECT=user@yourdomain.com
```

#### Étape 4 : Vérifier la configuration

```bash
# Dans Vercel
vercel env add GOOGLE_DELEGATION_SUBJECT production
# Entrez: l'email de l'utilisateur Workspace
```

---

### Solution 3 : Utiliser OAuth Standard (Simple)

Si vous n'avez pas Google Workspace, utilisez OAuth standard avec un compte utilisateur.

#### Étape 1 : Obtenir un Refresh Token

```bash
node scripts/get-oauth-token-auto.js
```

1. Suivez les instructions
2. Autorisez l'application avec votre compte Google
3. Copiez le code d'autorisation
4. Le refresh token sera automatiquement ajouté à `.env.local`

#### Étape 2 : Configurer les variables OAuth

```bash
GOOGLE_CLIENT_ID=votre-client-id
GOOGLE_CLIENT_SECRET=votre-client-secret
GOOGLE_REFRESH_TOKEN=votre-refresh-token
```

**Note :** Le code utilisera automatiquement OAuth si `GOOGLE_REFRESH_TOKEN` est configuré.

---

## 📋 Comparaison des solutions

| Solution | Prérequis | Complexité | Recommandé pour |
|----------|-----------|------------|-----------------|
| **Shared Drives** | Google Workspace | ⭐ Facile | Production (si Workspace) |
| **OAuth Delegation** | Google Workspace Admin | ⭐⭐ Moyen | Entreprises Workspace |
| **OAuth Standard** | Compte Google | ⭐ Facile | Développement / Petits projets |

---

## 🔧 Variables d'environnement complètes

### Pour Shared Drives (Solution 1)

```bash
# Service Account (toujours requis)
GOOGLE_SERVICE_ACCOUNT_EMAIL=votre-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...

# Shared Drive configuration
GOOGLE_USE_SHARED_DRIVE=true
GOOGLE_SHARED_DRIVE_ID=XXXXXXXXXXXXXXXXX
```

### Pour OAuth Delegation (Solution 2)

```bash
# Service Account
GOOGLE_SERVICE_ACCOUNT_EMAIL=votre-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...

# OAuth Delegation
GOOGLE_DELEGATION_SUBJECT=user@yourdomain.com
```

### Pour OAuth Standard (Solution 3)

```bash
# OAuth (remplace le Service Account)
GOOGLE_CLIENT_ID=votre-client-id
GOOGLE_CLIENT_SECRET=votre-client-secret
GOOGLE_REFRESH_TOKEN=votre-refresh-token
GOOGLE_REDIRECT_URI=http://localhost:1001  # ou votre URL de prod
```

---

## ✅ Vérification

Après avoir configuré une solution, testez :

```bash
# Test de création de dossier
curl -X POST http://localhost:1001/api/test-drive

# Ou testez directement une soumission d'actif
```

---

## 🚨 Erreurs communes

### "Service Accounts do not have storage quota"

**Cause :** Vous utilisez un Service Account avec un dossier personnel (pas Shared Drive).

**Solution :** 
- Configurez `GOOGLE_USE_SHARED_DRIVE=true` et `GOOGLE_SHARED_DRIVE_ID`
- OU utilisez OAuth au lieu du Service Account

### "Permission denied" avec Shared Drive

**Cause :** Le Service Account n'a pas accès au Shared Drive.

**Solution :**
1. Vérifiez que le Shared Drive existe
2. Vérifiez que le Service Account a été ajouté avec le rôle "Content Manager" ou "Manager"
3. Vérifiez que l'email du Service Account est correct

### "Invalid delegation subject"

**Cause :** L'utilisateur dans `GOOGLE_DELEGATION_SUBJECT` n'existe pas ou n'est pas dans votre domaine Workspace.

**Solution :**
1. Vérifiez que l'email est valide
2. Vérifiez que Domain-Wide Delegation est activé
3. Vérifiez les scopes OAuth dans Google Admin Console

---

## 📚 Ressources

- [Google Shared Drives Documentation](https://developers.google.com/workspace/drive/api/guides/about-shareddrives)
- [OAuth Delegation Guide](http://support.google.com/a/answer/7281227)
- [Service Accounts Best Practices](https://cloud.google.com/iam/docs/service-accounts)

---

**Dernière mise à jour :** Décembre 2025

