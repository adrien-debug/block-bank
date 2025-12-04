# 🔍 Vérification des Variables d'Environnement Vercel

## ❌ Problème Persistant

L'erreur "Google Drive is not configured" persiste même après la mise à jour de `GOOGLE_PRIVATE_KEY`.

## ✅ Checklist de Vérification

### 1. Vérifier que la variable a été mise à jour

1. Allez sur : https://vercel.com/adrien-nejkovics-projects/block-bank/settings/environment-variables
2. Vérifiez que `GOOGLE_PRIVATE_KEY` contient :
   - `-----BEGIN PRIVATE KEY-----` au début
   - `-----END PRIVATE KEY-----` à la fin
   - Toute la clé entre les deux

### 2. Vérifier que le déploiement a été redéployé

**IMPORTANT :** Après avoir mis à jour une variable d'environnement dans Vercel, vous devez **redéployer** pour que les changements prennent effet.

**Option A : Redéploiement automatique**
- Si vous avez fait un commit récent, Vercel devrait redéployer automatiquement
- Vérifiez dans le Dashboard Vercel si un nouveau déploiement est en cours

**Option B : Redéploiement manuel**
1. Allez sur : https://vercel.com/adrien-nejkovics-projects/block-bank/deployments
2. Cliquez sur les 3 points (⋯) du dernier déploiement
3. Sélectionnez **"Redeploy"**
4. Attendez que le déploiement se termine

### 3. Vérifier le format de la clé

La clé doit être sur **UNE SEULE LIGNE** dans Vercel, avec `\n` pour les retours à la ligne :

```
-----BEGIN PRIVATE KEY-----\nVOTRE_CLE_PRIVEE_COMPLETE_ICI\nREMPLACEZ_CECI_PAR_VOTRE_VRAIE_CLE\n...\n-----END PRIVATE KEY-----
```

**OU** sur plusieurs lignes (selon comment Vercel les gère) :

```
-----BEGIN PRIVATE KEY-----
VOTRE_CLE_PRIVEE_COMPLETE_ICI
REMPLACEZ_CECI_PAR_VOTRE_VRAIE_CLE
...
-----END PRIVATE KEY-----
```

### 4. Variables Requises

Assurez-vous que **TOUTES** ces variables sont présentes dans Vercel (Production) :

- ✅ `GOOGLE_PRIVATE_KEY` (avec BEGIN/END)
- ✅ `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- ✅ `GOOGLE_DRIVE_FOLDER_ID`
- ✅ `ADMIN_USERNAME`
- ✅ `ADMIN_PASSWORD`
- ✅ `NEXT_PUBLIC_APP_URL`
- ✅ `NODE_ENV` (optionnel, généralement "production")

### 5. Test Après Redéploiement

Après avoir redéployé, testez à nouveau la soumission. Si l'erreur persiste :

1. Vérifiez les logs Vercel pour voir l'erreur exacte
2. Vérifiez que la variable est bien dans l'environnement **Production** (pas seulement Preview/Development)

---

**⚠️ RAPPEL :** Les variables d'environnement ne sont appliquées qu'après un **redéploiement**.


