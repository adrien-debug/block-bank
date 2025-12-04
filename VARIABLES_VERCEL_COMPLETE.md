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
**Valeur :** (Copiez TOUTE la clé ci-dessous, y compris les lignes BEGIN et END)
```
-----BEGIN PRIVATE KEY-----
VOTRE_CLE_PRIVEE_COMPLETE_ICI
REMPLACEZ_CECI_PAR_VOTRE_VRAIE_CLE
+tWiGSkKBpfu7x/ussw3O7oHriNgBGsxsTDy3q6tyHbygKJ9KzyElP3YQeziktq3
[Fragment de clé privée - remplacé]n94sbV+DR9DA3Bn
rmUB+6xLWls2FeY/JXPZOCVQQN1FxzHrGrsH7cw6B8Ac6WL/QUqYtknmJVwCFPNj
[Fragment de clé privée - remplacé]n81pv1KZ5GlSzHpCICVAp
JFv29y3+WssDs5gBS13Xz+YWypDpsBUh6PvXw5UoErBimW88zTfTsVsDGizWnEum
LUuXRJhZdFNjuAJ8e1W98sbzeOh5W6gYqbqF6iOpXdtK1bv19cscMzGTGVN+59lB
rkEoJGO038KgW3J9UWropLC+iybKkp7tpfAiczaqEQKBgQDrUJFNwGr6S57H3qod
dSqcIABQ3303QUXeFf5tKRo8jhnyHp9ZIJpJwrkDK1kDl5jU4ddFQzo/pmspsZZd
7grzt2QBdrjVa1ckDb5Zw/IzYadR/F7gXeNEBGt0LaGKM6xWR0+0cm+B/5RPPyaW
lTp6/Eyieg1C2KvpnnFEK6lrYwKBgQC4PiWBNpHuyLuGcZ7aZ6UvSScCK7a0hsIO
4MgwRDL0whyhwKMmR1eV2cBwpiA4Pm2e7YrJVGO+Gx4UXwiFqr+byp/Q4DnMTXRK
RTAbcxpX9R84Tntn5mmm+2gFV5OD/Z9EofG6+pfsgCBYEHDU/HU4dx8IW1pzMuXi
3WkgmNX66wKBgQDfHELIz5oeuzhPFWWCDKdb5FOoWl5k13ShP4U+huwjYjBjinlX
jjv7l67HvH/nkgMMRR1QxI8j7mxI2eJSKPMlZUpiwOg7Ik07F/TVM54e7YYxi/GB
FkP3J6GiQ+mYGapbG74MvzvOrD84bA3wVIlgNnuKyeJs8Pb+yIVoN2WpNQKBgQCs
jyBHXhneIElqiR40BqDyobwUT2bmu9QjZSp58lYbYXa5lJf5sRX6NqEDoMRKiUXY
dTjoic6FbhaFE+ECeELPoj5+vpPDosOJEDYXb3275cvgy7jPPkGz8IGjhzuVgsRZ
3qdt7Wi/S91/PZ7ADNepFACPrigP/xrKmX7t1deMEwKBgF9+caw2H0f/+hx+m1fA
jEPPgQ+FGa7dO422KcRAalX75EHTuxrDGPshzN5Mlple5ASHuAXVbxaP/wFOutGQ
oVZWUiu4/5sx4AlUQK/zvBA0Jq5kq87+hB1wCOc9l0lBT6IDSPFqjNIParepnX4q
Zexy6/4vxKMFhyTd93qHBUVQ
-----END PRIVATE KEY-----
```
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


