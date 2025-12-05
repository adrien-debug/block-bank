# ⚡ Démarrage Rapide - Email Admin

## 🎯 Configuration en 3 étapes

### Étape 1 : Lancer le script interactif

```bash
npm run setup:email
```

Ce script vous guidera à travers :
- Le choix du service email (Resend/SendGrid/SMTP)
- La saisie de vos credentials
- La génération des variables à copier dans Vercel

---

### Étape 2 : Ajouter les variables dans Vercel

1. **Ouvrez** : https://vercel.com/adrien-nejkovics-projects/block-bank/settings/environment-variables

2. **Pour chaque variable** affichée par le script :
   - Cliquez sur "Add New"
   - Collez le nom et la valeur
   - Sélectionnez : **Production**, **Preview**, **Development**
   - Cliquez sur "Save"

---

### Étape 3 : Redéployer et tester

1. **Redéployez** l'application :
   - Allez dans **Deployments**
   - Cliquez sur les **3 points** (⋯) du dernier déploiement
   - Sélectionnez **Redeploy**

2. **Testez** la configuration :
   ```bash
   npm run test:email
   ```

---

## 📧 Adresses Email Configurées

Une fois configuré, ces adresses seront utilisées :

- **Admin** : `admin@block-bank.com`
- **Support** : `support@block-bank.com`
- **No Reply** : `noreply@block-bank.com`

---

## 🔗 Liens Utiles

- **Vercel Environment Variables** : https://vercel.com/adrien-nejkovics-projects/block-bank/settings/environment-variables
- **Resend** : https://resend.com (Recommandé)
- **SendGrid** : https://sendgrid.com
- **Guide Complet** : `CONFIGURATION_EMAIL_ADMIN_FINAL.md`

---

## ✅ Checklist

- [ ] Script `npm run setup:email` exécuté
- [ ] Variables ajoutées dans Vercel
- [ ] Application redéployée
- [ ] Test `npm run test:email` réussi
- [ ] Email reçu dans la boîte de réception

---

**Domaine :** block-bank.com  
**Date :** Décembre 2025


