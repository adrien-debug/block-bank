# 🔐 Guide Admin - Voir les Demandes

## 🎯 Comment accéder à l'interface admin

### 1. Connexion Admin

Accédez à : **http://localhost:1001/admin/login**

**Identifiants par défaut :**
- Email : `admin@blockbank.app`
- Mot de passe : `admin` (ou celui configuré dans `.env.local`)

---

## 📋 Interface Admin

### Page principale : `/admin`

**Fonctionnalités :**
- ✅ Liste de toutes les demandes (submissions)
- ✅ Filtres par statut (New, In Review, Approved, Rejected, Processed)
- ✅ Filtres par type d'actif (Real Estate, Vehicle, etc.)
- ✅ Affichage des informations principales :
  - Nom du propriétaire / Entreprise
  - Type d'actif
  - Valeur estimée
  - Localisation
  - Date de soumission
  - Statut (badge coloré)

### Page de détails : `/admin/submissions/[id]`

**Informations affichées :**

1. **Informations générales**
   - Date de soumission
   - Statut
   - Type d'utilisateur (Individual/Company)
   - Type d'actif

2. **Informations utilisateur**
   - Pour les particuliers : Nom, Email, Téléphone
   - Pour les entreprises : Nom, Email, Contact, SIRET/RCS

3. **Informations actif**
   - Valeur estimée
   - Localisation
   - Description
   - Informations supplémentaires

4. **Documents** 📄
   - Liste de tous les fichiers uploadés
   - Téléchargement possible (bouton "View")
   - Affichage du type et de la taille
   - Documents organisés par catégorie

---

## 🔄 Workflow Admin

### 1. Voir toutes les demandes

```
1. Se connecter à /admin/login
2. Aller sur /admin
3. Voir la liste de toutes les soumissions
4. Utiliser les filtres si nécessaire
```

### 2. Voir les détails d'une demande

```
1. Cliquer sur une demande dans la liste
2. Ou cliquer sur "View Details"
3. Voir toutes les informations
4. Consulter les documents
```

### 3. Télécharger un document

```
1. Aller sur la page de détails
2. Section "Documents"
3. Cliquer sur "View" pour ouvrir le fichier
```

---

## 🔧 Routes API Admin

### `/api/admin/submissions`
- **GET** : Liste toutes les soumissions (avec filtres)
- **Authentification requise**

### `/api/admin/submissions/[id]`
- **GET** : Détails d'une soumission
- **Authentification requise**

### `/api/admin/submissions/[id]/files`
- **GET** : Liste tous les fichiers d'une soumission
- **Authentification requise**

### `/api/admin/submissions/[id]/files/[filename]`
- **GET** : Télécharge un fichier spécifique
- **Authentification requise**

---

## 📁 Où sont stockés les fichiers ?

Les fichiers sont stockés dans :
```
storage/
└── submissions/
    └── {submission-id}/
        ├── metadata.json
        ├── passport-1-xxx.pdf
        ├── identity-1-xxx.pdf
        ├── asset-documents/
        │   └── asset-1-xxx.jpg
        └── additional-documents/
            └── additional-1-xxx.pdf
```

---

## 🔐 Configuration Admin

### Variables d'environnement

Créez un fichier `.env.local` :

```bash
ADMIN_EMAIL=admin@blockbank.app
ADMIN_PASSWORD=your-secure-password
ADMIN_SECRET_KEY=your-secret-key-for-sessions
```

---

## ✅ Fonctionnalités disponibles

- [x] Connexion/Déconnexion admin
- [x] Liste des soumissions avec filtres
- [x] Détails complets d'une soumission
- [x] Affichage des documents
- [x] Téléchargement des fichiers
- [x] Filtres par statut et type d'actif
- [x] Interface responsive

---

## 🚀 Utilisation

```bash
# 1. Démarrer le serveur
npm run dev

# 2. Aller sur http://localhost:1001/admin/login

# 3. Se connecter avec les identifiants admin

# 4. Explorer les demandes !
```

---

**Status :** ✅ **INTERFACE ADMIN OPÉRATIONNELLE**


