# 📧 Configuration Email Admin - Block Bank

## ✅ Domaine Identifié

**Domaine principal :** `block-bank.com`  
**Domaine avec www :** `www.block-bank.com`  
**Domaine Vercel :** `block-bank-eight.vercel.app`

---

## 🎯 Configuration Email Admin

### Adresses Email à Configurer

```
ADMIN_EMAIL=admin@block-bank.com
SUPPORT_EMAIL=support@block-bank.com
NO_REPLY_EMAIL=noreply@block-bank.com
NEXT_PUBLIC_APP_URL=https://block-bank.com
```

---

## 📋 Étapes de Configuration

### 1. Choisir un Service Email (Recommandé : Resend)

#### Option A : Resend ⭐ (Recommandé)

1. **Créer un compte** : https://resend.com
2. **Ajouter votre domaine** :
   - Allez dans **Domains** → **Add Domain**
   - Entrez : `block-bank.com`
   - Suivez les instructions pour ajouter les enregistrements DNS :
     ```
     Type: TXT
     Name: @
     Value: [valeur fournie par Resend]
     
     Type: MX
     Name: @
     Value: [valeur fournie par Resend]
     ```
3. **Vérifier le domaine** (5-30 minutes)
4. **Créer une API Key** :
   - Allez dans **API Keys** → **Create API Key**
   - Nommez-la : "Block Bank Production"
   - Copiez la clé (format : `re_xxxxxxxxxxxxx`)

#### Option B : SendGrid

1. **Créer un compte** : https://sendgrid.com
2. **Ajouter votre domaine** : Settings → Sender Authentication → Domain Authentication
3. **Créer une API Key** : Settings → API Keys → Create API Key

#### Option C : SMTP (Gmail, etc.)

Pour Gmail :
1. Activer l'authentification à 2 facteurs
2. Créer un mot de passe d'application
3. Utiliser les credentials SMTP

---

### 2. Configurer dans Vercel

1. **Aller sur** : https://vercel.com/adrien-nejkovics-projects/block-bank/settings/environment-variables

2. **Ajouter les variables suivantes** :

#### Pour Resend (Recommandé)
```
RESEND_API_KEY=re_xxxxxxxxxxxxx
ADMIN_EMAIL=admin@block-bank.com
SUPPORT_EMAIL=support@block-bank.com
NO_REPLY_EMAIL=noreply@block-bank.com
NEXT_PUBLIC_APP_URL=https://block-bank.com
```

#### Pour SendGrid
```
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
ADMIN_EMAIL=admin@block-bank.com
SUPPORT_EMAIL=support@block-bank.com
NO_REPLY_EMAIL=noreply@block-bank.com
NEXT_PUBLIC_APP_URL=https://block-bank.com
```

#### Pour SMTP
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASSWORD=votre-mot-de-passe-application
SMTP_SECURE=false
ADMIN_EMAIL=admin@block-bank.com
SUPPORT_EMAIL=support@block-bank.com
NO_REPLY_EMAIL=noreply@block-bank.com
NEXT_PUBLIC_APP_URL=https://block-bank.com
```

3. **Sélectionner les environnements** : Production, Preview, Development
4. **Sauvegarder**

---

### 3. Redéployer l'Application

1. Allez dans **Deployments**
2. Cliquez sur les **3 points** (⋯) du dernier déploiement
3. Sélectionnez **Redeploy**
4. Attendez la fin du déploiement

---

### 4. Tester la Configuration

#### Test Local
```bash
npm run test:email
```

#### Test en Production
1. Connectez-vous à l'admin panel : https://block-bank.com/admin
2. Testez l'envoi d'un email depuis l'interface admin
3. Vérifiez votre boîte de réception

---

## ✅ Checklist de Configuration

- [ ] Compte créé sur le service d'email (Resend/SendGrid/etc.)
- [ ] Domaine `block-bank.com` ajouté et vérifié dans le service d'email
- [ ] API Key créée et copiée
- [ ] Variables d'environnement ajoutées dans Vercel
- [ ] Application redéployée
- [ ] Test d'envoi d'email réussi
- [ ] Email reçu dans la boîte de réception

---

## 📧 Adresses Email Configurées

Une fois configuré, ces adresses seront utilisées :

- **Admin** : `admin@block-bank.com`
- **Support** : `support@block-bank.com`
- **No Reply** : `noreply@block-bank.com`

---

## 🔗 Liens Utiles

- **Vercel Domains** : https://vercel.com/adrien-nejkovics-projects/block-bank/settings/domains
- **Vercel Environment Variables** : https://vercel.com/adrien-nejkovics-projects/block-bank/settings/environment-variables
- **Resend** : https://resend.com
- **SendGrid** : https://sendgrid.com
- **Guide Complet** : Voir `GUIDE_EMAIL_ADMIN.md`

---

## 📚 Documentation

- **GUIDE_EMAIL_ADMIN.md** - Guide complet avec toutes les options
- **EMAIL_ADMIN_SETUP.md** - Guide rapide (5 minutes)
- **scripts/test-email-config.js** - Script de test de configuration

---

**Date de création :** Décembre 2025  
**Domaine :** block-bank.com


