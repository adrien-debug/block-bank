# 📋 Variables d'Environnement Vercel - Configuration Production

## ✅ Variables REQUISES (Service Account - Recommandé)

Ces variables sont **obligatoires** pour que Google Drive fonctionne en production.

### 1. GOOGLE_SERVICE_ACCOUNT_EMAIL
```
blockbank-drive@legalblock-480122.iam.gserviceaccount.com
```

### 2. GOOGLE_PRIVATE_KEY
**⚠️ IMPORTANT :** Copiez TOUTE la clé, y compris `-----BEGIN PRIVATE KEY-----` et `-----END PRIVATE KEY-----`

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

**Note :** Dans Vercel, vous pouvez coller la clé avec les retours à la ligne, ou utiliser `\n` pour les retours à la ligne.

### 3. GOOGLE_DRIVE_FOLDER_ID
```
1zB6CNLjpak7Bi-3YR-MktFM52ASDeSlX
```

---

## 🔐 Variables Admin (REQUISES)

### 4. ADMIN_PASSWORD_HASH
```
85c817583b90d51b1adb4fbc73f085ef7e5f5672f9be8993ed8787ddb48a9e89
```

### 5. ADMIN_SESSION_SECRET
```
5462fa786c6106befd1384966a011c29ca373adf2f56a3135d4a76dfd2c35c92
```

---

## ⚙️ Variables Next.js (REQUISES)

### 6. NODE_ENV
```
production
```

### 7. NEXT_PUBLIC_APP_URL
```
https://blockbank.com
```

---

## ❌ Variables à SUPPRIMER (OAuth invalide)

Ces variables causent l'erreur `invalid_grant`. **Supprimez-les** de Vercel car vous utilisez le Service Account :

- ❌ `GOOGLE_CLIENT_ID` (à supprimer)
- ❌ `GOOGLE_CLIENT_SECRET` (à supprimer)
- ❌ `GOOGLE_REFRESH_TOKEN` (n'existe pas, c'est normal)

---

## 📝 Commandes pour Configurer dans Vercel

### Option 1 : Via Dashboard Vercel (Recommandé)
1. Allez sur https://vercel.com
2. Sélectionnez votre projet `block-bank`
3. Allez dans **Settings** → **Environment Variables**
4. Ajoutez/modifiez chaque variable pour **Production**

### Option 2 : Via CLI Vercel

```bash
# Service Account
echo "blockbank-drive@legalblock-480122.iam.gserviceaccount.com" | vercel env add GOOGLE_SERVICE_ACCOUNT_EMAIL production

# Private Key (copiez toute la clé depuis ci-dessus)
echo "-----BEGIN PRIVATE KEY-----
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
-----END PRIVATE KEY-----" | vercel env add GOOGLE_PRIVATE_KEY production

# Folder ID
echo "1zB6CNLjpak7Bi-3YR-MktFM52ASDeSlX" | vercel env add GOOGLE_DRIVE_FOLDER_ID production

# Admin
echo "85c817583b90d51b1adb4fbc73f085ef7e5f5672f9be8993ed8787ddb48a9e89" | vercel env add ADMIN_PASSWORD_HASH production

echo "5462fa786c6106befd1384966a011c29ca373adf2f56a3135d4a76dfd2c35c92" | vercel env add ADMIN_SESSION_SECRET production

# Next.js
echo "production" | vercel env add NODE_ENV production

echo "https://blockbank.com" | vercel env add NEXT_PUBLIC_APP_URL production

# Supprimer les variables OAuth invalides
vercel env rm GOOGLE_CLIENT_ID production --yes
vercel env rm GOOGLE_CLIENT_SECRET production --yes
```

---

## ✅ Vérification

Après configuration, vérifiez avec :

```bash
vercel env ls
```

Vous devriez voir :
- ✅ GOOGLE_SERVICE_ACCOUNT_EMAIL
- ✅ GOOGLE_PRIVATE_KEY
- ✅ GOOGLE_DRIVE_FOLDER_ID
- ✅ ADMIN_PASSWORD_HASH
- ✅ ADMIN_SESSION_SECRET
- ✅ NODE_ENV
- ✅ NEXT_PUBLIC_APP_URL
- ❌ GOOGLE_CLIENT_ID (supprimé)
- ❌ GOOGLE_CLIENT_SECRET (supprimé)

---

## 🚨 Important

1. **GOOGLE_PRIVATE_KEY** : Copiez TOUTE la clé, y compris les lignes `-----BEGIN PRIVATE KEY-----` et `-----END PRIVATE KEY-----`
2. **Supprimez les variables OAuth** : Elles causent l'erreur `invalid_grant`
3. **Redéployez** après avoir modifié les variables : `vercel --prod`

