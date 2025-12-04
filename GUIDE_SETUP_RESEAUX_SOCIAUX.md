# 📱 Guide de Configuration des Réseaux Sociaux - Block Bank

## 🎯 Objectif

Configurer les comptes réseaux sociaux pour Block Bank et les connecter à l'application admin.

---

## 📧 Étape 1 : Configurer les Emails dans Resend

### Pour recevoir des emails sur `admin@block-bank.com`

1. **Connectez-vous à Resend**
   - Allez sur : https://resend.com/login
   - Connectez-vous avec votre compte

2. **Ajoutez votre domaine**
   - Allez dans : **Domains** > **Add Domain**
   - Entrez : `block-bank.com`
   - Cliquez sur **Add**

3. **Configurez les DNS**
   
   Resend vous donnera des enregistrements DNS à ajouter. Ajoutez-les dans votre registrar de domaine :

   **Enregistrements DNS à ajouter :**
   ```
   Type    Name    Value
   TXT     @       v=spf1 include:_spf.resend.com ~all
   TXT     _dmarc  v=dmarc1; p=none; rua=mailto:dmarc@resend.com
   CNAME   resend._domainkey  [valeur fournie par Resend]
   MX      @       feedback-smtp.resend.com (priorité 10)
   ```

4. **Vérifiez le domaine**
   - Attendez que les DNS se propagent (5-30 minutes)
   - Cliquez sur **Verify** dans Resend
   - Une fois vérifié, vous pouvez envoyer depuis `admin@block-bank.com`

5. **Testez l'envoi**
   ```bash
   npm run test:email:send votre-email@example.com
   ```

---

## 📱 Étape 2 : Créer les Comptes Réseaux Sociaux

### Facebook

1. **Créer une Page Facebook**
   - Allez sur : https://www.facebook.com/pages/create
   - Choisissez : **Entreprise ou marque**
   - Remplissez :
     - **Nom de la Page** : Block Bank
     - **Catégorie** : Services financiers / Fintech
     - **Description** : Infrastructure de crédit on-chain pour actifs réels & mining Bitcoin
   
2. **Configurer la Page**
   - **Email** : admin@block-bank.com
   - **Site web** : https://block-bank.com (votre URL de production)
   - **Téléphone** : (optionnel)
   - **Adresse** : (optionnel)
   
3. **Ajouter des photos**
   - Photo de profil : Logo Block Bank
   - Photo de couverture : Bannière Block Bank

4. **URL de la Page**
   - Notez l'URL : `https://www.facebook.com/BlockBank` (ou similaire)
   - Cette URL sera utilisée dans l'admin

### Twitter/X

1. **Créer un compte Twitter**
   - Allez sur : https://twitter.com/signup
   - Utilisez : `@BlockBank` ou `@BlockBankProtocol`
   - Email : admin@block-bank.com

2. **Vérifier le compte**
   - Complétez le profil
   - Ajoutez une photo de profil et bannière
   - Bio : "Infrastructure de crédit on-chain pour actifs réels & mining Bitcoin"

3. **URL du profil**
   - Notez l'URL : `https://twitter.com/BlockBank`

### Instagram

1. **Créer un compte Instagram Business**
   - Téléchargez l'app Instagram
   - Créez un compte avec : `@blockbank` ou `@blockbankprotocol`
   - Email : admin@block-bank.com

2. **Convertir en compte Business**
   - Paramètres > Compte > Passer à un compte professionnel
   - Choisissez : Entreprise
   - Connectez à votre Page Facebook (créée précédemment)

3. **URL du profil**
   - Notez l'URL : `https://www.instagram.com/blockbank/`

### LinkedIn

1. **Créer une Page LinkedIn**
   - Allez sur : https://www.linkedin.com/company/setup/new/
   - Remplissez :
     - **Nom** : Block Bank
     - **Type** : Entreprise
     - **Industrie** : Services financiers
     - **Taille** : 1-10 employés (ou selon votre cas)

2. **Configurer la Page**
   - **Email** : admin@block-bank.com
   - **Site web** : https://block-bank.com
   - **Description** : Infrastructure de crédit on-chain pour actifs réels

3. **URL de la Page**
   - Notez l'URL : `https://www.linkedin.com/company/block-bank/`

### TikTok

1. **Créer un compte TikTok Business**
   - Téléchargez l'app TikTok
   - Créez un compte avec : `@blockbank`
   - Email : admin@block-bank.com

2. **Passer en compte Business**
   - Paramètres > Gérer le compte > Passer à un compte professionnel
   - Choisissez : Entreprise

3. **URL du profil**
   - Notez l'URL : `https://www.tiktok.com/@blockbank`

### YouTube

1. **Créer une chaîne YouTube**
   - Allez sur : https://www.youtube.com
   - Connectez-vous avec un compte Google (créez-en un si nécessaire)
   - Créez une chaîne : **Block Bank**

2. **Configurer la chaîne**
   - **Nom** : Block Bank
   - **Description** : Infrastructure de crédit on-chain pour actifs réels & mining Bitcoin
   - **Email de contact** : admin@block-bank.com
   - **Site web** : https://block-bank.com

3. **URL de la chaîne**
   - Notez l'URL : `https://www.youtube.com/@BlockBank` (ou similaire)

---

## 🔗 Étape 3 : Connecter les Comptes dans l'Application

Une fois tous les comptes créés, connectez-les dans l'application admin :

1. **Accédez à l'admin**
   - Allez sur : http://localhost:1001/admin/login
   - Connectez-vous avec le mot de passe : `admin`

2. **Allez dans Marketing**
   - Cliquez sur : **Marketing** dans le menu
   - Ou allez directement : http://localhost:1001/admin/marketing

3. **Connectez chaque réseau**
   - Cliquez sur **"Connect Account"** pour chaque réseau
   - Remplissez :
     - **Username** : Le nom d'utilisateur (ex: `@blockbank`)
     - **URL** : L'URL complète du profil
     - **Status** : `connected`
     - **Followers** : (optionnel) Nombre de followers actuels

4. **Sauvegardez**
   - Cliquez sur **Save**
   - Les données seront sauvegardées dans Supabase

---

## 📋 Checklist de Configuration

### Emails
- [ ] Compte Resend créé
- [ ] Domaine `block-bank.com` ajouté dans Resend
- [ ] DNS configurés et vérifiés
- [ ] Test d'envoi réussi

### Réseaux Sociaux
- [ ] Facebook Page créée
- [ ] Twitter/X compte créé
- [ ] Instagram Business créé
- [ ] LinkedIn Company Page créée
- [ ] TikTok Business créé
- [ ] YouTube Channel créée

### Application
- [ ] Tous les comptes connectés dans `/admin/marketing`
- [ ] URLs et usernames corrects
- [ ] Statut "connected" pour tous

---

## 🎨 Ressources Nécessaires

### Images à préparer
- **Logo Block Bank** (carré, 512x512px minimum)
- **Bannière** (1920x1080px pour Facebook, Twitter)
- **Photo de profil** (400x400px pour Instagram, Twitter)
- **Favicon** (32x32px)

### Textes à préparer
- **Description courte** : "Infrastructure de crédit on-chain pour actifs réels"
- **Description longue** : Description complète du projet
- **Mots-clés** : blockchain, crédit, RWA, NFT, Bitcoin mining
- **Hashtags** : #BlockBank #Blockchain #Credit #RWA #NFT

---

## 🔐 Sécurité

### Bonnes Pratiques
- Utilisez des mots de passe forts pour chaque compte
- Activez l'authentification à 2 facteurs (2FA) partout où possible
- Ne partagez pas les identifiants
- Utilisez un gestionnaire de mots de passe (1Password, LastPass, etc.)

### Stockage des Identifiants
- Ne stockez JAMAIS les mots de passe dans le code
- Utilisez des variables d'environnement pour les clés API
- Les identifiants doivent être stockés de manière sécurisée

---

## 📚 Ressources Utiles

- **Resend Documentation** : https://resend.com/docs
- **Facebook Business** : https://www.facebook.com/business
- **Twitter Business** : https://business.twitter.com
- **Instagram Business** : https://business.instagram.com
- **LinkedIn Marketing** : https://business.linkedin.com/marketing-solutions
- **TikTok Business** : https://www.tiktok.com/business
- **YouTube Creator** : https://www.youtube.com/creators

---

## ✅ Prochaines Étapes

Une fois tout configuré :

1. **Créer du contenu**
   - Posts de présentation
   - Annonces de fonctionnalités
   - Actualités du projet

2. **Planifier les publications**
   - Utilisez le calendrier dans `/admin/marketing`
   - Planifiez les posts à l'avance

3. **Analyser les performances**
   - Suivez les statistiques dans chaque plateforme
   - Ajustez votre stratégie selon les résultats

---

**Dernière mise à jour :** Configuration complète des réseaux sociaux Block Bank

