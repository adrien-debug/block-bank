# 🚀 Guide de Setup Rapide - Résolution Quota Google Drive

## 🎯 Objectif

Résoudre l'erreur **"Service Accounts do not have storage quota"** en configurant la meilleure solution automatiquement.

---

## ⚡ Setup Automatique (Recommandé)

### Option 1 : Script d'assistance interactif

```bash
node scripts/setup-shared-drive.js
```

Ce script vous guide étape par étape pour :
1. ✅ Vérifier votre configuration Service Account
2. 📝 Créer un Shared Drive (instructions détaillées)
3. 🔗 Partager avec le Service Account
4. ⚙️ Configurer les variables d'environnement
5. 🚀 Générer un script pour Vercel

---

## 📋 Setup Manuel Rapide

### Étape 1 : Créer un Shared Drive

1. Allez sur [Google Drive](https://drive.google.com)
2. Menu gauche → **"Shared drives"** (Dossiers partagés)
3. Cliquez sur **"+ New"**
4. Nommez-le : **"BlockBank Submissions"**
5. Notez l'ID dans l'URL : `https://drive.google.com/drive/folders/XXXXXXXXXXXXX`

### Étape 2 : Partager avec le Service Account

1. Ouvrez le Shared Drive créé
2. Cliquez sur le nom du Shared Drive (en haut)
3. **"Manage members"** (Gérer les membres)
4. Ajoutez l'email du Service Account (dans vos variables d'environnement)
5. Rôle : **"Content Manager"** ou **"Manager"**
6. **"Send"**

### Étape 3 : Configurer les variables

#### En local (.env.local)

```bash
GOOGLE_USE_SHARED_DRIVE=true
GOOGLE_SHARED_DRIVE_ID=XXXXXXXXXXXXX
```

#### Dans Vercel

```bash
vercel env add GOOGLE_USE_SHARED_DRIVE production
# Entrez: true

vercel env add GOOGLE_SHARED_DRIVE_ID production
# Entrez: XXXXXXXXXXXXX (l'ID du Shared Drive)
```

Ou utilisez le script généré :
```bash
bash scripts/configure-vercel-shared-drive.sh
```

---

## ✅ Vérification

### 1. Vérifier les variables dans Vercel

```bash
vercel env ls | grep GOOGLE
```

Vous devriez voir :
- ✅ `GOOGLE_USE_SHARED_DRIVE` = `true`
- ✅ `GOOGLE_SHARED_DRIVE_ID` = votre ID

### 2. Tester une soumission

1. Allez sur votre site
2. Soumettez un actif via le formulaire
3. Vérifiez que l'upload fonctionne sans erreur

---

## 🔧 Solutions Alternatives

Si vous n'avez pas Google Workspace :

### Option 2 : OAuth Standard

```bash
node scripts/get-oauth-token-auto.js
```

Suivez les instructions pour obtenir un refresh token OAuth.

### Option 3 : OAuth Delegation (Google Workspace Admin)

Consultez [SOLUTION_SHARED_DRIVES.md](./SOLUTION_SHARED_DRIVES.md) pour les instructions complètes.

---

## 📚 Documentation Complète

- **Guide détaillé :** [SOLUTION_SHARED_DRIVES.md](./SOLUTION_SHARED_DRIVES.md)
- **Solution rapide :** [SOLUTION_GOOGLE_DRIVE.md](./SOLUTION_GOOGLE_DRIVE.md)
- **Résumé des corrections :** [CORRECTIONS_SHARED_DRIVES.md](./CORRECTIONS_SHARED_DRIVES.md)

---

## 🆘 Problèmes Courants

### "Permission denied" avec Shared Drive

**Solution :**
- Vérifiez que le Service Account a été ajouté au Shared Drive
- Vérifiez que le rôle est "Content Manager" ou "Manager"
- Vérifiez que l'email du Service Account est correct

### "Shared Drive not found"

**Solution :**
- Vérifiez que l'ID du Shared Drive est correct (dans l'URL)
- Vérifiez que le Shared Drive existe bien
- Vérifiez que vous êtes connecté au bon compte Google

### Variables non prises en compte

**Solution :**
- Redéployez l'application sur Vercel après avoir ajouté les variables
- Vérifiez que les variables sont en mode "production"
- Vérifiez l'orthographe exacte des noms de variables

---

## ✅ Checklist Finale

- [ ] Shared Drive créé dans Google Drive
- [ ] Shared Drive partagé avec le Service Account
- [ ] Variables configurées dans Vercel (`GOOGLE_USE_SHARED_DRIVE` et `GOOGLE_SHARED_DRIVE_ID`)
- [ ] Application redéployée sur Vercel
- [ ] Test de soumission réussi

---

**Temps estimé :** 5-10 minutes  
**Difficulté :** ⭐ Facile

🚀 **Prêt ?** Exécutez `node scripts/setup-shared-drive.js` pour commencer !

