# 📧 Configuration Email - Block Bank

## ✅ Adresse Email Configurée

L'adresse email **admin@block-bank.com** a été configurée dans l'application.

### Adresses Email Block Bank

- **Admin:** `admin@block-bank.com`
- **Support:** `support@block-bank.com`
- **No Reply:** `noreply@block-bank.com`

---

## 🔧 Configuration Actuelle

Les adresses email sont configurées dans :
- `.env.local` - Variables d'environnement
- `lib/services/email.ts` - Service email

---

## 📨 Pour Envoyer de Vrais Emails

Actuellement, l'application simule l'envoi d'emails en développement. Pour envoyer de vrais emails, vous devez :

### Option 1 : Resend (Recommandé - Simple)

1. Créez un compte sur [Resend](https://resend.com)
2. Vérifiez votre domaine `block-bank.com`
3. Ajoutez dans `.env.local` :
```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

### Option 2 : SendGrid

1. Créez un compte sur [SendGrid](https://sendgrid.com)
2. Configurez votre domaine
3. Ajoutez dans `.env.local` :
```env
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
```

### Option 3 : SMTP Personnalisé

1. Configurez un serveur SMTP (Gmail, Outlook, serveur dédié)
2. Ajoutez dans `.env.local` :
```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=admin@block-bank.com
SMTP_PASSWORD=your-password
SMTP_SECURE=false
```

---

## 🚀 Créer l'Adresse Email Réelle

Pour créer réellement l'adresse `admin@block-bank.com`, vous devez :

### 1. Avoir le Domaine `block-bank.com`

- Enregistrez le domaine si ce n'est pas déjà fait
- Ou utilisez un sous-domaine existant

### 2. Choisir un Service Email

**Option A : Google Workspace**
- Coût: ~6€/mois par utilisateur
- Configuration: https://workspace.google.com
- Ajoutez `admin@block-bank.com` comme utilisateur

**Option B : Microsoft 365**
- Coût: ~5€/mois par utilisateur
- Configuration: https://www.microsoft.com/microsoft-365
- Ajoutez `admin@block-bank.com` comme utilisateur

**Option C : Service Email Dédié**
- Zoho Mail (gratuit pour 5 utilisateurs)
- ProtonMail Business
- Votre propre serveur email

### 3. Configurer les DNS

Ajoutez ces enregistrements DNS pour votre domaine :

```
Type    Name    Value
MX      @       aspmx.l.google.com (pour Google)
MX      @       alt1.aspmx.l.google.com
TXT     @       v=spf1 include:_spf.google.com ~all
TXT     @       v=dmarc1; p=none;
```

### 4. Vérifier l'Email

Une fois configuré, vous pouvez :
- Recevoir des emails sur `admin@block-bank.com`
- Envoyer des emails depuis cette adresse
- L'utiliser dans l'application

---

## 📝 Utilisation dans l'Application

Le service email est disponible via :

```typescript
import { ADMIN_EMAIL, sendEmail, getAdminNotificationTemplate } from '@/lib/services/email'

// Utiliser l'adresse admin
const from = ADMIN_EMAIL

// Envoyer un email
await sendEmail({
  from: ADMIN_EMAIL,
  to: 'user@example.com',
  subject: 'Notification Block Bank',
  html: getAdminNotificationTemplate({
    title: 'Nouvelle soumission',
    message: 'Vous avez reçu une nouvelle demande de tokenisation.',
    actionUrl: 'https://block-bank.com/admin/submissions',
    actionText: 'Voir la demande'
  })
})
```

---

## ✅ Statut Actuel

- ✅ Adresse email configurée dans l'application
- ✅ Service email créé (`lib/services/email.ts`)
- ✅ Variables d'environnement ajoutées
- ⏳ En attente de configuration du domaine réel
- ⏳ En attente de service SMTP pour l'envoi réel

---

## 🔗 Ressources

- [Resend Documentation](https://resend.com/docs)
- [SendGrid Documentation](https://docs.sendgrid.com)
- [Google Workspace Setup](https://support.google.com/a/answer/140034)
- [Microsoft 365 Setup](https://docs.microsoft.com/microsoft-365/admin/)

---

**Note:** L'application fonctionne actuellement en mode simulation d'email. Les emails sont loggés dans la console en développement.

