# ✅ Corrections : Support des Shared Drives et OAuth Delegation

## 🎯 Problème résolu

Les Service Accounts Google Cloud **n'ont pas de quota de stockage** dans Google Drive. L'erreur suivante apparaissait :

```
Service Accounts do not have storage quota. Leverage shared drives 
(https://developers.google.com/workspace/drive/api/guides/about-shareddrives), 
or use OAuth delegation (http://support.google.com/a/answer/7281227) instead.
```

---

## ✅ Corrections effectuées

### 1. Support des Shared Drives (Google Workspace)

**Fichier modifié :** `lib/utils/googleDrive.ts`

- ✅ Ajout du support pour les Shared Drives dans toutes les fonctions
- ✅ Détection automatique via `GOOGLE_USE_SHARED_DRIVE=true`
- ✅ Utilisation de `supportsAllDrives: true` pour les requêtes API
- ✅ Support dans `createFolder()`, `uploadFile()`, `createJsonFile()`, et `listFiles()`

### 2. Support OAuth Delegation (Domain-Wide Delegation)

**Fichier modifié :** `lib/utils/googleDrive.ts`

- ✅ Ajout du support pour OAuth delegation avec `GOOGLE_DELEGATION_SUBJECT`
- ✅ Permet au Service Account d'agir au nom d'un utilisateur Workspace
- ✅ Utilise le quota de l'utilisateur impersonné

### 3. Gestion des erreurs améliorée

**Fichier modifié :** `lib/utils/googleDrive.ts`

- ✅ Détection spécifique des erreurs de quota
- ✅ Messages d'erreur explicites avec instructions
- ✅ Erreur `STORAGE_QUOTA_ERROR` avec recommandations

### 4. Documentation complète

**Fichiers créés :**

- ✅ `SOLUTION_SHARED_DRIVES.md` - Guide complet avec toutes les solutions
- ✅ `SOLUTION_GOOGLE_DRIVE.md` - Mise à jour avec référence au guide complet
- ✅ `CORRECTIONS_SHARED_DRIVES.md` - Ce document

---

## 🔧 Nouvelles variables d'environnement

### Pour Shared Drives

```bash
GOOGLE_USE_SHARED_DRIVE=true
GOOGLE_SHARED_DRIVE_ID=XXXXXXXXXXXXXXXXX
```

### Pour OAuth Delegation

```bash
GOOGLE_DELEGATION_SUBJECT=user@yourdomain.com
```

---

## 📋 Solutions disponibles

| Solution | Prérequis | Variables requises |
|----------|-----------|-------------------|
| **Shared Drives** | Google Workspace | `GOOGLE_USE_SHARED_DRIVE=true`<br>`GOOGLE_SHARED_DRIVE_ID=XXX` |
| **OAuth Delegation** | Google Workspace Admin | `GOOGLE_DELEGATION_SUBJECT=user@domain.com` |
| **OAuth Standard** | Compte Google | `GOOGLE_REFRESH_TOKEN=XXX` |

---

## 🚀 Prochaines étapes

### Option 1 : Configurer un Shared Drive (Recommandé si Workspace)

1. Créez un Shared Drive dans Google Drive
2. Partagez-le avec le Service Account
3. Ajoutez les variables dans Vercel :
   ```bash
   vercel env add GOOGLE_USE_SHARED_DRIVE production
   # Entrez: true
   
   vercel env add GOOGLE_SHARED_DRIVE_ID production
   # Entrez: l'ID du Shared Drive
   ```

### Option 2 : Configurer OAuth Delegation

1. Activez Domain-Wide Delegation dans Google Cloud Console
2. Configurez dans Google Admin Console
3. Ajoutez la variable :
   ```bash
   vercel env add GOOGLE_DELEGATION_SUBJECT production
   # Entrez: user@yourdomain.com
   ```

### Option 3 : Utiliser OAuth Standard

1. Obtenez un refresh token :
   ```bash
   node scripts/get-oauth-token-auto.js
   ```
2. Configurez les variables OAuth dans Vercel

---

## 📚 Documentation

- **Guide complet :** [SOLUTION_SHARED_DRIVES.md](./SOLUTION_SHARED_DRIVES.md)
- **Guide rapide :** [SOLUTION_GOOGLE_DRIVE.md](./SOLUTION_GOOGLE_DRIVE.md)

---

## ✅ Vérifications

Après configuration, testez :

1. **Vérifier les variables d'environnement** dans Vercel
2. **Tester une soumission** via l'interface
3. **Vérifier les logs** pour confirmer l'utilisation du Shared Drive

---

**Date :** Décembre 2025  
**Status :** ✅ **CORRECTIONS COMPLÈTES**

