# 🚀 Guide de Configuration Resend - block-bank.com

## ✅ Étapes Automatisées (Déjà Faites)

- [x] Domaine identifié : block-bank.com
- [x] Variables d'environnement préparées
- [x] Code mis à jour pour support Resend
- [x] Scripts de test créés

## 📋 Étapes Manuelles (À FAIRE)

### Étape 1 : Créer un Compte Resend

1. Allez sur : https://resend.com
2. Cliquez sur "Get Started" ou "Sign Up"
3. Entrez votre email
4. Vérifiez votre email (vérifiez votre boîte de réception)
5. Complétez votre profil

### Étape 2 : Ajouter le Domaine

1. Connectez-vous à Resend : https://resend.com/login
2. Allez dans **Domains** (menu de gauche)
3. Cliquez sur **Add Domain**
4. Entrez : `block-bank.com`
5. Cliquez sur **Add**

### Étape 3 : Configurer les DNS

Resend vous affichera les enregistrements DNS à ajouter.

1. Notez les valeurs affichées par Resend
2. Connectez-vous à votre registraire de domaine
3. Allez dans la section DNS / Zone DNS
4. Ajoutez les enregistrements (voir DNS_INSTRUCTIONS.md)
5. Attendez la propagation (5-30 minutes)
6. Retournez dans Resend et cliquez sur **Verify**

### Étape 4 : Créer une API Key

1. Dans Resend, allez dans **API Keys** (menu de gauche)
2. Cliquez sur **Create API Key**
3. Nommez-la : "Block Bank Production"
4. Copiez la clé (format : `re_xxxxxxxxxxxxx`)
5. ⚠️  Notez-la bien, elle ne sera affichée qu'une fois !

### Étape 5 : Ajouter les Variables dans Vercel

1. Allez sur : https://vercel.com/adrien-nejkovics-projects/block-bank/settings/environment-variables
2. Pour chaque variable ci-dessous :
   - Cliquez sur "Add New"
   - Collez le nom et la valeur
   - Sélectionnez : **Production**, **Preview**, **Development**
   - Cliquez sur "Save"

**Variables à ajouter :**
```
ADMIN_EMAIL=admin@block-bank.com
SUPPORT_EMAIL=support@block-bank.com
NO_REPLY_EMAIL=noreply@block-bank.com
NEXT_PUBLIC_APP_URL=https://block-bank.com
RESEND_API_KEY=re_VOTRE_CLE_ICI
```

⚠️  Remplacez `re_VOTRE_CLE_ICI` par la clé obtenue à l'étape 4.

### Étape 6 : Redéployer l'Application

1. Allez dans **Deployments** sur Vercel
2. Cliquez sur les **3 points** (⋯) du dernier déploiement
3. Sélectionnez **Redeploy**
4. Attendez la fin du déploiement

### Étape 7 : Tester

```bash
npm run test:email
```

## ✅ Checklist

- [ ] Compte Resend créé
- [ ] Email vérifié
- [ ] Domaine block-bank.com ajouté dans Resend
- [ ] Enregistrements DNS ajoutés
- [ ] Domaine vérifié dans Resend
- [ ] API Key créée et copiée
- [ ] Variables ajoutées dans Vercel
- [ ] Application redéployée
- [ ] Test réussi

## 🔗 Liens Utiles

- **Resend** : https://resend.com
- **Resend Login** : https://resend.com/login
- **Vercel Environment Variables** : https://vercel.com/adrien-nejkovics-projects/block-bank/settings/environment-variables
- **Vercel Domains** : https://vercel.com/adrien-nejkovics-projects/block-bank/settings/domains

## 📚 Documentation

- **DNS_INSTRUCTIONS.md** - Instructions détaillées DNS
- **VARIABLES_VERCEL_EMAIL.txt** - Variables prêtes à copier
- **CONFIGURATION_EMAIL_ADMIN_FINAL.md** - Guide complet

