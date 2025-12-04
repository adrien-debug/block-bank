# 🚀 Configuration Rapide - BlockBank

## ⚡ Setup en 3 étapes

### 1️⃣ Installation

```bash
npm install
```

### 2️⃣ Configuration Google Drive (Résout le quota Service Account)

**Option A : Setup automatique interactif (Recommandé)**

```bash
npm run setup:shared-drive
```

Ou directement :

```bash
node scripts/setup-shared-drive.js
```

Ce script vous guide automatiquement pour :
- ✅ Créer un Shared Drive
- ✅ Le partager avec votre Service Account
- ✅ Configurer toutes les variables

**Option B : Setup manuel**

Consultez [GUIDE_SETUP_RAPIDE.md](./GUIDE_SETUP_RAPIDE.md) pour les instructions détaillées.

### 3️⃣ Lancer le serveur

```bash
npm run dev
```

L'application sera accessible sur [http://localhost:1001](http://localhost:1001)

---

## 🔧 Configuration Vercel

### Variables d'environnement requises

#### Service Account (Minimum requis)

```bash
GOOGLE_SERVICE_ACCOUNT_EMAIL=votre-email@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...
GOOGLE_DRIVE_FOLDER_ID=XXXXXXXXXXXXX
```

#### Shared Drive (Recommandé - résout le quota)

```bash
GOOGLE_USE_SHARED_DRIVE=true
GOOGLE_SHARED_DRIVE_ID=XXXXXXXXXXXXX
```

#### Admin

```bash
ADMIN_PASSWORD_HASH=$2a$10$...
ADMIN_SESSION_SECRET=votre-secret-session
```

### Ajouter dans Vercel

```bash
# Via l'interface Vercel Dashboard
# OU via CLI
vercel env add GOOGLE_USE_SHARED_DRIVE production
vercel env add GOOGLE_SHARED_DRIVE_ID production
```

---

## 📚 Documentation

### Guides rapides

- **[GUIDE_SETUP_RAPIDE.md](./GUIDE_SETUP_RAPIDE.md)** - Setup en 5 minutes
- **[SOLUTION_GOOGLE_DRIVE.md](./SOLUTION_GOOGLE_DRIVE.md)** - Solution rapide quota

### Guides complets

- **[SOLUTION_SHARED_DRIVES.md](./SOLUTION_SHARED_DRIVES.md)** - Toutes les solutions détaillées
- **[CORRECTIONS_SHARED_DRIVES.md](./CORRECTIONS_SHARED_DRIVES.md)** - Résumé des corrections

---

## 🆘 Problèmes courants

### Erreur "Service Accounts do not have storage quota"

**Solution :** Utilisez un Shared Drive

```bash
npm run setup:shared-drive
```

### Erreur 500 en développement

**Solution :** Le cache Next.js est corrompu

```bash
rm -rf .next
npm run dev
```

### Variables d'environnement non prises en compte

**Solution :** Redéployez sur Vercel après avoir ajouté les variables

---

## ✅ Checklist de déploiement

- [ ] `npm install` exécuté
- [ ] Variables d'environnement configurées
- [ ] Shared Drive configuré (si applicable)
- [ ] Build local réussi (`npm run build`)
- [ ] Déploiement Vercel réussi
- [ ] Test de soumission d'actif fonctionnel

---

## 🎯 Commandes utiles

```bash
# Développement
npm run dev

# Build production
npm run build

# Setup Shared Drive (résout quota)
npm run setup:shared-drive

# Vérifier la config production
npm run verify:production
```

---

**Besoin d'aide ?** Consultez les guides dans le dossier `docs/` ou `SOLUTION_SHARED_DRIVES.md`

