# 🔧 CORRECTION : GOOGLE_PRIVATE_KEY dans Vercel

## ❌ Problème Identifié

La variable `GOOGLE_PRIVATE_KEY` dans Vercel **n'a pas les en-têtes** `-----BEGIN PRIVATE KEY-----` et `-----END PRIVATE KEY-----`.

**État actuel dans Vercel :**
```
[Votre clé privée sans les en-têtes BEGIN/END]
```

**Ce qui est requis :**
```
-----BEGIN PRIVATE KEY-----
[Votre clé privée complète avec toutes les lignes]
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
VOTRE_CLE_PRIVEE_COMPLETE_ICI_AVEC_TOUTES_LES_LIGNES
REMPLACEZ_CECI_PAR_VOTRE_VRAIE_CLE_PRIVEE_DU_SERVICE_ACCOUNT
LA_CLE_DOIT_FAIRE_ENVIRON_1600_CARACTERES_ET_CONTENIR_MULTIPLES_LIGNES
-----END PRIVATE KEY-----
```

**⚠️ IMPORTANT :** Remplacez le contenu ci-dessus par votre vraie clé privée complète obtenue depuis Google Cloud Console. La clé doit inclure toutes les lignes entre `-----BEGIN PRIVATE KEY-----` et `-----END PRIVATE KEY-----`.

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


