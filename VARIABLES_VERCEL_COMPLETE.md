# 📋 Variables d'Environnement Vercel - Liste Complète

## 🔵 Variable 1 : GOOGLE_SERVICE_ACCOUNT_EMAIL

**Nom :** `GOOGLE_SERVICE_ACCOUNT_EMAIL`  
**Valeur :**
```
blockbank-drive@legalblock-480122.iam.gserviceaccount.com
```
**Environnement :** Production  
**Description :** Email du Service Account Google Cloud

---

## 🔵 Variable 2 : GOOGLE_PRIVATE_KEY

**Nom :** `GOOGLE_PRIVATE_KEY`  
**Valeur :** (Copiez TOUTE la clé depuis Google Cloud Console, y compris les lignes BEGIN et END)
```
-----BEGIN PRIVATE KEY-----
VOTRE_CLE_PRIVEE_COMPLETE_ICI
REMPLACEZ_CECI_PAR_VOTRE_VRAIE_CLE_PRIVEE_DU_SERVICE_ACCOUNT
OBTENUE_DEPUIS_GOOGLE_CLOUD_CONSOLE
LA_CLE_DOIT_INCLURE_TOUTES_LES_LIGNES_ENTRE_BEGIN_ET_END
-----END PRIVATE KEY-----
```

**⚠️ IMPORTANT :** 
- Obtenez votre clé privée depuis Google Cloud Console → IAM & Admin → Service Accounts
- Copiez TOUTE la clé incluant les lignes `-----BEGIN PRIVATE KEY-----` et `-----END PRIVATE KEY-----`
- Ne partagez JAMAIS votre clé privée dans des fichiers publics ou des dépôts Git
**Environnement :** Production  
**Description :** Clé privée complète du Service Account (inclure BEGIN et END)

---

## 🔵 Variable 3 : GOOGLE_DRIVE_FOLDER_ID

**Nom :** `GOOGLE_DRIVE_FOLDER_ID`  
**Valeur :**
```
1zB6CNLjpak7Bi-3YR-MktFM52ASDeSlX
```
**Environnement :** Production  
**Description :** ID du dossier Google Drive

---

## 🔵 Variable 4 : ADMIN_PASSWORD_HASH

**Nom :** `ADMIN_PASSWORD_HASH`  
**Valeur :**
```
85c817583b90d51b1adb4fbc73f085ef7e5f5672f9be8993ed8787ddb48a9e89
```
**Environnement :** Production  
**Description :** Hash bcrypt du mot de passe admin

---

## 🔵 Variable 5 : ADMIN_SESSION_SECRET

**Nom :** `ADMIN_SESSION_SECRET`  
**Valeur :**
```
5462fa786c6106befd1384966a011c29ca373adf2f56a3135d4a76dfd2c35c92
```
**Environnement :** Production  
**Description :** Clé secrète pour les sessions admin

---

## 🔵 Variable 6 : NODE_ENV

**Nom :** `NODE_ENV`  
**Valeur :**
```
production
```
**Environnement :** Production  
**Description :** Environnement Node.js

---

## 🔵 Variable 7 : NEXT_PUBLIC_APP_URL

**Nom :** `NEXT_PUBLIC_APP_URL`  
**Valeur :**
```
https://blockbank.com
```
**Environnement :** Production  
**Description :** URL publique de l'application

---

## ❌ Variables à NE PAS AJOUTER (OAuth - Causent des erreurs)

Ces variables **NE DOIVENT PAS** être présentes :
- ❌ `GOOGLE_CLIENT_ID` (à supprimer si présente)
- ❌ `GOOGLE_CLIENT_SECRET` (à supprimer si présente)
- ❌ `GOOGLE_REFRESH_TOKEN` (ne doit pas exister)

---

## 📝 Instructions pour Ajouter dans Vercel Dashboard

1. Allez sur : https://vercel.com/adrien-nejkovics-projects/block-bank/settings/environment-variables
2. Pour chaque variable ci-dessus :
   - Cliquez sur "Add New"
   - Entrez le **Nom** de la variable
   - Collez la **Valeur** exacte
   - Sélectionnez **Production** dans "Environments"
   - Cliquez sur "Save"

---

## ✅ Checklist Finale

Après avoir ajouté toutes les variables, vous devriez avoir exactement **7 variables** :

- [ ] ✅ GOOGLE_SERVICE_ACCOUNT_EMAIL
- [ ] ✅ GOOGLE_PRIVATE_KEY
- [ ] ✅ GOOGLE_DRIVE_FOLDER_ID
- [ ] ✅ ADMIN_PASSWORD_HASH
- [ ] ✅ ADMIN_SESSION_SECRET
- [ ] ✅ NODE_ENV
- [ ] ✅ NEXT_PUBLIC_APP_URL

Et **AUCUNE** variable OAuth :
- [ ] ❌ GOOGLE_CLIENT_ID (absente)
- [ ] ❌ GOOGLE_CLIENT_SECRET (absente)

---

**⚠️ IMPORTANT :** Pour `GOOGLE_PRIVATE_KEY`, copiez TOUTE la clé incluant les lignes `-----BEGIN PRIVATE KEY-----` et `-----END PRIVATE KEY-----`


