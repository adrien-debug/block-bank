# 📧 Configuration Email Admin - Guide Rapide

## 🎯 Objectif

Configurer une adresse email admin avec votre domaine déployé (ex: `admin@votre-domaine.com`).

---

## ⚡ Démarrage Rapide (5 minutes)

### 1. Choisir Resend (Recommandé) ⭐

1. **Créer un compte** : https://resend.com
2. **Ajouter votre domaine** : Domains → Add Domain → Suivre les instructions DNS
3. **Créer une API Key** : API Keys → Create API Key
4. **Configurer dans Vercel** :
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   ADMIN_EMAIL=admin@votre-domaine.com
   SUPPORT_EMAIL=support@votre-domaine.com
   NO_REPLY_EMAIL=noreply@votre-domaine.com
   NEXT_PUBLIC_APP_URL=https://votre-domaine.com
   ```
5. **Redéployer** l'application

---

## 📋 Variables d'Environnement Requises

### Obligatoires

```
NEXT_PUBLIC_APP_URL=https://votre-domaine.com
ADMIN_EMAIL=admin@votre-domaine.com
```

### Optionnelles (choisir UN service)

**Resend (Recommandé)**
```
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

**SendGrid**
```
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
```

**AWS SES**
```
AWS_SES_REGION=us-east-1
AWS_SES_ACCESS_KEY_ID=xxxxxxxxxxxxx
AWS_SES_SECRET_ACCESS_KEY=xxxxxxxxxxxxx
```

**SMTP personnalisé**
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASSWORD=votre-mot-de-passe
SMTP_SECURE=false
```

---

## ✅ Test de Configuration

```bash
node scripts/test-email-config.js
```

Ce script vérifie que toutes les variables sont correctement configurées.

---

## 📚 Documentation Complète

Pour plus de détails, consultez **GUIDE_EMAIL_ADMIN.md**

---

## 🔗 Liens Utiles

- [Resend](https://resend.com) - Service recommandé
- [SendGrid](https://sendgrid.com) - Alternative robuste
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

**Date :** Décembre 2025


