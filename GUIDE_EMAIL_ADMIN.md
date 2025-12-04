# 📧 Guide de Configuration Email Admin - Block Bank

## ✅ Configuration Actuelle

L'adresse email **admin@block-bank.com** est configurée dans l'application.

---

## 🎯 Adresses Email Configurées

- **Admin:** `admin@block-bank.com` (ou depuis `ADMIN_EMAIL`)
- **Support:** `support@block-bank.com` (ou depuis `SUPPORT_EMAIL`)
- **No Reply:** `noreply@block-bank.com` (ou depuis `NO_REPLY_EMAIL`)

Les adresses email sont automatiquement générées depuis :
1. Les variables d'environnement (`ADMIN_EMAIL`, etc.)
2. Le domaine extrait de `NEXT_PUBLIC_APP_URL`
3. Le domaine par défaut `block-bank.com`

---

## 🚀 Configuration Rapide

### Étape 1 : Choisir un Service Email

**Option recommandée : Resend** ⭐
- Simple et moderne
- API claire
- Gratuit jusqu'à 3,000 emails/mois
- [Créer un compte](https://resend.com)

### Étape 2 : Configurer dans `.env.local`

```env
# Adresses email (utiliser votre domaine déployé)
ADMIN_EMAIL=admin@block-bank.com
SUPPORT_EMAIL=support@block-bank.com
NO_REPLY_EMAIL=noreply@block-bank.com

# Resend (Recommandé)
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

### Étape 3 : Installer le Package

```bash
npm install resend
```

### Étape 4 : Vérifier la Configuration

```bash
npm run verify:marketing
```

---

## 📋 Services Email Disponibles

### 1. Resend (Recommandé) ⭐

**Avantages:**
- Simple et moderne
- API intuitive
- Gratuit jusqu'à 3,000 emails/mois
- Support excellent

**Configuration:**

1. Créez un compte sur [Resend](https://resend.com)
2. Ajoutez votre domaine `block-bank.com`
3. Vérifiez les DNS (instructions dans Resend)
4. Copiez votre API key
5. Ajoutez dans `.env.local`:
   ```env
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   ```
6. Installez le package:
   ```bash
   npm install resend
   ```

**Prix:** Gratuit jusqu'à 3,000 emails/mois, puis $20/mois pour 50,000 emails

---

### 2. SendGrid

**Avantages:**
- Robuste et professionnel
- Analytics avancés
- Très fiable

**Configuration:**

1. Créez un compte sur [SendGrid](https://sendgrid.com)
2. Créez une API key
3. Ajoutez votre domaine
4. Vérifiez les DNS
5. Ajoutez dans `.env.local`:
   ```env
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
   ```
6. Installez le package:
   ```bash
   npm install @sendgrid/mail
   ```

**Prix:** Gratuit jusqu'à 100 emails/jour, puis plans payants

---

### 3. AWS SES

**Avantages:**
- Très économique pour gros volumes
- Intégration AWS facile
- Scalable

**Configuration:**

1. Créez un compte AWS
2. Activez SES dans votre région
3. Vérifiez votre domaine
4. Créez des credentials IAM
5. Ajoutez dans `.env.local`:
   ```env
   AWS_SES_REGION=us-east-1
   AWS_SES_ACCESS_KEY_ID=xxxxxxxxxxxxx
   AWS_SES_SECRET_ACCESS_KEY=xxxxxxxxxxxxx
   ```
6. Installez le package:
   ```bash
   npm install aws-sdk
   ```

**Prix:** $0.10 pour 1,000 emails (très économique)

---

### 4. SMTP Personnalisé (Gmail, Outlook, etc.)

**Avantages:**
- Utilise votre compte email existant
- Pas de service tiers

**Configuration Gmail:**

1. Activez l'authentification à 2 facteurs
2. Créez un [mot de passe d'application](https://myaccount.google.com/apppasswords)
3. Ajoutez dans `.env.local`:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=votre-email@gmail.com
   SMTP_PASSWORD=votre-mot-de-passe-application
   SMTP_SECURE=false
   ```
4. Installez le package:
   ```bash
   npm install nodemailer
   ```

**Limites Gmail:** 500 emails/jour (gratuit), 2,000/jour (Google Workspace)

---

## 🔧 Configuration Avancée

### Adresses Email Dynamiques

Les adresses email sont automatiquement générées depuis votre domaine :

```typescript
// Si NEXT_PUBLIC_APP_URL=https://block-bank.com
// Les emails seront : admin@block-bank.com, support@block-bank.com, etc.

// Ou définissez explicitement :
ADMIN_EMAIL=admin@votre-domaine.com
```

### Utilisation dans le Code

```typescript
import { getAdminEmail, sendEmail, getAdminNotificationTemplate } from '@/lib/services/email'

// Obtenir l'adresse admin
const adminEmail = getAdminEmail() // admin@block-bank.com

// Envoyer un email
const result = await sendEmail({
  from: getAdminEmail(),
  to: 'user@example.com',
  subject: 'Notification Block Bank',
  html: getAdminNotificationTemplate({
    title: 'Nouvelle soumission',
    message: 'Vous avez reçu une nouvelle demande de tokenisation.',
    actionUrl: 'https://block-bank.com/admin/submissions',
    actionText: 'Voir la demande'
  })
})

if (result.success) {
  console.log('Email envoyé avec succès!')
} else {
  console.error('Erreur:', result.error)
}
```

---

## 📝 Exemples d'Utilisation

### Email de Notification Admin

```typescript
import { sendEmail, getAdminNotificationTemplate, getAdminEmail } from '@/lib/services/email'

await sendEmail({
  from: getAdminEmail(),
  to: 'admin@block-bank.com',
  subject: 'Nouvelle soumission reçue',
  html: getAdminNotificationTemplate({
    title: 'Nouvelle demande de tokenisation',
    message: 'Une nouvelle demande a été soumise et nécessite votre attention.',
    actionUrl: 'https://block-bank.com/admin/submissions/123',
    actionText: 'Voir la demande'
  })
})
```

### Email Simple

```typescript
import { sendEmail, getSimpleEmailTemplate, getSupportEmail } from '@/lib/services/email'

await sendEmail({
  from: getSupportEmail(),
  to: 'user@example.com',
  subject: 'Bienvenue sur Block Bank',
  html: getSimpleEmailTemplate({
    title: 'Bienvenue!',
    content: '<p>Merci de vous être inscrit sur Block Bank.</p>'
  })
})
```

---

## ✅ Vérification

### Tester la Configuration

1. **Vérifier les variables d'environnement:**
   ```bash
   cat .env.local | grep EMAIL
   ```

2. **Tester l'envoi (mode développement):**
   ```typescript
   // En développement, les emails sont simulés et loggés dans la console
   await sendEmail({ ... })
   // Vérifiez la console pour voir l'email simulé
   ```

3. **Tester l'envoi réel:**
   ```typescript
   // En production avec un service configuré
   const result = await sendEmail({ ... })
   console.log(result) // { success: true } ou { success: false, error: '...' }
   ```

---

## 🔒 Sécurité

### Variables d'Environnement

⚠️ **Important:** Ne commitez jamais vos clés API dans Git!

- ✅ Utilisez `.env.local` (déjà dans `.gitignore`)
- ✅ Utilisez les variables d'environnement Vercel en production
- ❌ Ne mettez jamais les clés dans le code source

### Vérification DNS

Pour envoyer depuis `admin@block-bank.com`, vous devez :
1. Avoir le domaine `block-bank.com` enregistré
2. Configurer les DNS MX dans votre service email
3. Vérifier le domaine dans votre service email (Resend, SendGrid, etc.)

---

## 🐛 Dépannage

### Erreur: "Package resend non installé"

```bash
npm install resend
```

### Erreur: "Aucun service email configuré"

Vérifiez que vous avez configuré au moins un service dans `.env.local`:
- `RESEND_API_KEY` (recommandé)
- `SENDGRID_API_KEY`
- `AWS_SES_ACCESS_KEY_ID`
- `SMTP_HOST`

### Emails non reçus

1. Vérifiez les logs de votre service email (Resend, SendGrid, etc.)
2. Vérifiez les spams
3. Vérifiez que le domaine est vérifié
4. Vérifiez les DNS MX

### Mode développement

En développement, les emails sont simulés si aucun service n'est configuré. Les emails apparaissent dans la console.

---

## 📚 Ressources

- [Resend Documentation](https://resend.com/docs)
- [SendGrid Documentation](https://docs.sendgrid.com)
- [AWS SES Documentation](https://docs.aws.amazon.com/ses/)
- [Nodemailer Documentation](https://nodemailer.com)

---

## ✅ Checklist de Configuration

- [ ] Service email choisi (Resend recommandé)
- [ ] Compte créé sur le service
- [ ] Domaine ajouté et vérifié
- [ ] DNS configurés
- [ ] API key copiée
- [ ] Variables ajoutées dans `.env.local`
- [ ] Package installé (`npm install resend`)
- [ ] Test d'envoi réussi
- [ ] Emails reçus correctement

---

**Dernière mise à jour:** Configuration automatique avec support multi-services
