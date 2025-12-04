# ✅ Quick Test Checklist

## 🧪 Test Rapide - Soumission

### 1. Créer une soumission
- [ ] Aller sur http://localhost:1001/legalblock/opportunity
- [ ] Remplir le formulaire
- [ ] Uploader des fichiers
- [ ] Soumettre

### 2. Vérifier les fichiers
```bash
# Voir les soumissions
ls storage/submissions/

# Voir les fichiers d'une soumission
ls storage/submissions/{id}/
```

### 3. Vérifier dans Admin
- [ ] Se connecter : http://localhost:1001/admin/login (password: `admin`)
- [ ] Voir la nouvelle soumission dans la liste
- [ ] Ouvrir les détails
- [ ] Vérifier la section Documents
- [ ] Tester View et Download

---

## ✅ Si tout fonctionne :
- ✅ Fichiers créés dans `storage/submissions/`
- ✅ Soumission visible dans admin
- ✅ Documents téléchargeables

**Prêt à tester ! 🚀**

