# 🔧 CORRECTION : GOOGLE_PRIVATE_KEY dans Vercel

## ❌ Problème Identifié

La variable `GOOGLE_PRIVATE_KEY` dans Vercel **n'a pas les en-têtes** `-----BEGIN PRIVATE KEY-----` et `-----END PRIVATE KEY-----`.

**État actuel dans Vercel :**
```
VOTRE_CLE_PRIVEE_COMPLETE_ICI
```

**Ce qui est requis :**
```
-----BEGIN PRIVATE KEY-----
VOTRE_CLE_PRIVEE_COMPLETE_ICI
-----END PRIVATE KEY-----
```

## ✅ Solution : Mettre à Jour GOOGLE_PRIVATE_KEY

### Étape 1 : Supprimer l'ancienne variable

1. Allez sur : https://vercel.com/adrien-nejkovics-projects/block-bank/settings/environment-variables
2. Trouvez `GOOGLE_PRIVATE_KEY`
3. Cliquez sur les 3 points (⋯) → **Delete**
4. Confirmez la suppression

### Étape 2 : Ajouter la clé complète avec en-têtes

1. Cliquez sur **"Add New"**
2. **Nom :** `GOOGLE_PRIVATE_KEY`
3. **Valeur :** (Copiez TOUTE la clé ci-dessous, y compris BEGIN et END)

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

4. **Environnements :** Cochez **Production** (et Preview/Development si nécessaire)
5. Cliquez sur **"Save"**

### Étape 3 : Redéployer

Après avoir mis à jour la variable, redéployez :

```bash
vercel --prod
```

Ou attendez que Vercel redéploie automatiquement.

## ✅ Vérification

Après le redéploiement, testez à nouveau la soumission. L'erreur "Google Drive is not configured" devrait disparaître.

---

**⚠️ IMPORTANT :** La clé doit inclure les lignes `-----BEGIN PRIVATE KEY-----` et `-----END PRIVATE KEY-----` au début et à la fin.


