# 🧪 Guide de Test - Soumission Complète

## ✅ Système Prêt pour les Tests

Le système de soumission et de stockage des documents est **opérationnel** et prêt à être testé.

---

## 📋 Checklist de Test

### 1. **Créer une nouvelle soumission**

**URL :** http://localhost:1001/legalblock/opportunity

**À tester :**
- [ ] Remplir tous les champs du formulaire
- [ ] Uploader des fichiers (passport, documents d'actif, etc.)
- [ ] Soumettre le formulaire
- [ ] Vérifier le message de succès

### 2. **Vérifier le stockage local**

Après la soumission, vérifiez que les fichiers sont bien sauvegardés :

```bash
# Voir toutes les soumissions
ls -la storage/submissions/

# Voir les fichiers d'une soumission spécifique
ls -la storage/submissions/{submission-id}/

# Voir le fichier metadata.json
cat storage/submissions/{submission-id}/metadata.json
```

**À vérifier :**
- [ ] Dossier créé avec l'ID de la soumission
- [ ] Fichiers uploadés présents
- [ ] metadata.json créé avec toutes les informations
- [ ] Dossiers asset-documents/ et additional-documents/ créés si nécessaire

### 3. **Vérifier dans l'interface admin**

**URL :** http://localhost:1001/admin/login

**À vérifier :**
- [ ] La nouvelle soumission apparaît dans la liste
- [ ] Cliquer sur la soumission pour voir les détails
- [ ] Section "Documents" affiche tous les fichiers
- [ ] Boutons "View" et "Download" fonctionnent
- [ ] Compteur de documents affiché en haut

---

## 🔍 Structure des fichiers créés

```
storage/
└── submissions/
    └── {submission-id}/
        ├── metadata.json                    # Métadonnées complètes
        ├── passport-1-xxx.pdf              # Documents personnels
        ├── identity-1-xxx.pdf
        ├── statutes-1-xxx.pdf              # Documents entreprise
        ├── balance-sheet-1-xxx.pdf
        ├── registration-1-xxx.pdf
        ├── asset-documents/
        │   ├── asset-1-xxx.jpg             # Documents d'actif
        │   └── asset-2-xxx.pdf
        └── additional-documents/
            └── additional-1-xxx.pdf        # Documents additionnels
```

---

## ✅ Points de vérification

### Fichiers sauvegardés
- ✅ Tous les fichiers uploadés sont sauvegardés
- ✅ Noms de fichiers organisés et préfixés
- ✅ Métadonnées complètes dans metadata.json

### Interface Admin
- ✅ Liste des soumissions avec filtres
- ✅ Détails complets d'une soumission
- ✅ Section Documents avec tous les fichiers
- ✅ Boutons View et Download fonctionnels

### API Routes
- ✅ `/api/asset-submissions` - Crée une soumission
- ✅ `/api/admin/submissions` - Liste les soumissions
- ✅ `/api/admin/submissions/[id]` - Détails d'une soumission
- ✅ `/api/admin/submissions/[id]/files` - Liste les fichiers
- ✅ `/api/admin/submissions/[id]/files/[filename]` - Télécharge un fichier

---

## 🚀 Étapes de test

1. **Soumission :**
   - Remplissez le formulaire sur `/legalblock/opportunity`
   - Uploadez plusieurs fichiers
   - Soumettez

2. **Vérification fichiers :**
   ```bash
   ls -la storage/submissions/
   ```

3. **Vérification admin :**
   - Connectez-vous sur `/admin/login`
   - Vérifiez la nouvelle soumission
   - Consultez les documents

4. **Test téléchargement :**
   - Cliquez sur "View" pour ouvrir
   - Cliquez sur "Download" pour télécharger

---

## 📊 Logs à surveiller

Dans la console du serveur, vous devriez voir :

```
[Asset Submission API] Step 6: Storage successful!
[Local Storage] Submission saved: {submission-id}
```

---

## ✅ Résultat attendu

Après une soumission réussie :
- ✅ Message de succès affiché
- ✅ Fichiers sauvegardés dans `storage/submissions/`
- ✅ Soumission visible dans l'interface admin
- ✅ Documents accessibles et téléchargeables

---

**Status :** ✅ **SYSTÈME PRÊT POUR LES TESTS**

Testez maintenant avec une nouvelle soumission !





