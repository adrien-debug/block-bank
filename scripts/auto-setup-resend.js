#!/usr/bin/env node

/**
 * Script automatisé pour configurer Resend
 * Préparation complète de la configuration email admin
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

const DOMAIN = 'block-bank.com'
const APP_URL = `https://${DOMAIN}`

function main() {
  log('\n🚀 Configuration Automatique Email Admin - Resend\n', 'cyan')
  log('='.repeat(70), 'cyan')
  
  log(`\n✅ Domaine : ${DOMAIN}`, 'green')
  log(`✅ URL : ${APP_URL}\n`, 'green')
  
  // 1. Vérifier que le package resend peut être installé
  log('📦 Étape 1 : Vérification des dépendances...', 'yellow')
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
    if (!packageJson.dependencies.resend && !packageJson.devDependencies.resend) {
      log('   ⚠️  Package resend non trouvé dans package.json', 'yellow')
      log('   💡 Installation recommandée : npm install resend', 'cyan')
    } else {
      log('   ✅ Package resend trouvé', 'green')
    }
  } catch (error) {
    log('   ⚠️  Impossible de vérifier package.json', 'yellow')
  }
  
  // 2. Créer le fichier de configuration Resend
  log('\n📝 Étape 2 : Création des fichiers de configuration...', 'yellow')
  
  const configDir = path.join(process.cwd(), 'resend-config')
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true })
  }
  
  // Fichier avec instructions DNS
  const dnsInstructions = `# Instructions DNS pour Resend - ${DOMAIN}

## 📋 Enregistrements DNS à Ajouter

Une fois que vous avez ajouté le domaine ${DOMAIN} dans Resend, vous devrez ajouter ces enregistrements DNS :

### 1. Enregistrement TXT (Vérification du domaine)
Type: TXT
Name: @
Value: [Valeur fournie par Resend après ajout du domaine]
TTL: 3600 (ou par défaut)

### 2. Enregistrement MX (Réception d'emails)
Type: MX
Name: @
Value: [Valeur fournie par Resend]
Priority: 10
TTL: 3600 (ou par défaut)

### 3. Enregistrement SPF (Optionnel mais recommandé)
Type: TXT
Name: @
Value: v=spf1 include:_spf.resend.com ~all
TTL: 3600

### 4. Enregistrement DKIM (Optionnel mais recommandé)
Type: TXT
Name: [Nom fourni par Resend]
Value: [Valeur fourni par Resend]
TTL: 3600

## 🔗 Où Ajouter ces Enregistrements

1. Connectez-vous à votre registraire de domaine (où vous avez acheté ${DOMAIN})
2. Allez dans la section DNS / Zone DNS
3. Ajoutez les enregistrements ci-dessus
4. Attendez la propagation DNS (5-30 minutes)
5. Retournez dans Resend et cliquez sur "Verify"

## ⚠️ Important

- Les valeurs exactes seront fournies par Resend après l'ajout du domaine
- Ne supprimez pas les enregistrements existants
- La propagation DNS peut prendre jusqu'à 48h (généralement 5-30 minutes)

`
  
  fs.writeFileSync(
    path.join(configDir, 'DNS_INSTRUCTIONS.md'),
    dnsInstructions,
    'utf8'
  )
  log('   ✅ DNS_INSTRUCTIONS.md créé', 'green')
  
  // Fichier avec les étapes complètes
  const setupGuide = `# 🚀 Guide de Configuration Resend - ${DOMAIN}

## ✅ Étapes Automatisées (Déjà Faites)

- [x] Domaine identifié : ${DOMAIN}
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
4. Entrez : \`${DOMAIN}\`
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
4. Copiez la clé (format : \`re_xxxxxxxxxxxxx\`)
5. ⚠️  Notez-la bien, elle ne sera affichée qu'une fois !

### Étape 5 : Ajouter les Variables dans Vercel

1. Allez sur : https://vercel.com/adrien-nejkovics-projects/block-bank/settings/environment-variables
2. Pour chaque variable ci-dessous :
   - Cliquez sur "Add New"
   - Collez le nom et la valeur
   - Sélectionnez : **Production**, **Preview**, **Development**
   - Cliquez sur "Save"

**Variables à ajouter :**
\`\`\`
ADMIN_EMAIL=admin@${DOMAIN}
SUPPORT_EMAIL=support@${DOMAIN}
NO_REPLY_EMAIL=noreply@${DOMAIN}
NEXT_PUBLIC_APP_URL=${APP_URL}
RESEND_API_KEY=re_VOTRE_CLE_ICI
\`\`\`

⚠️  Remplacez \`re_VOTRE_CLE_ICI\` par la clé obtenue à l'étape 4.

### Étape 6 : Redéployer l'Application

1. Allez dans **Deployments** sur Vercel
2. Cliquez sur les **3 points** (⋯) du dernier déploiement
3. Sélectionnez **Redeploy**
4. Attendez la fin du déploiement

### Étape 7 : Tester

\`\`\`bash
npm run test:email
\`\`\`

## ✅ Checklist

- [ ] Compte Resend créé
- [ ] Email vérifié
- [ ] Domaine ${DOMAIN} ajouté dans Resend
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

`
  
  fs.writeFileSync(
    path.join(configDir, 'SETUP_GUIDE.md'),
    setupGuide,
    'utf8'
  )
  log('   ✅ SETUP_GUIDE.md créé', 'green')
  
  // Fichier avec les variables Vercel
  const vercelVars = `# Variables Vercel - Resend Configuration
# Domaine : ${DOMAIN}
# Date : ${new Date().toISOString()}

# ⚠️  IMPORTANT : Remplacez re_VOTRE_CLE_ICI par votre vraie clé Resend

ADMIN_EMAIL=admin@${DOMAIN}
SUPPORT_EMAIL=support@${DOMAIN}
NO_REPLY_EMAIL=noreply@${DOMAIN}
NEXT_PUBLIC_APP_URL=${APP_URL}
RESEND_API_KEY=re_VOTRE_CLE_ICI

# Instructions :
# 1. Copiez ces variables
# 2. Allez sur : https://vercel.com/adrien-nejkovics-projects/block-bank/settings/environment-variables
# 3. Ajoutez chaque variable (remplacez re_VOTRE_CLE_ICI par votre vraie clé)
# 4. Sélectionnez : Production, Preview, Development
# 5. Redéployez l'application

`
  
  fs.writeFileSync(
    path.join(configDir, 'VERCEL_VARIABLES.txt'),
    vercelVars,
    'utf8'
  )
  log('   ✅ VERCEL_VARIABLES.txt créé', 'green')
  
  // 3. Vérifier le code
  log('\n🔍 Étape 3 : Vérification du code...', 'yellow')
  const emailServicePath = path.join(process.cwd(), 'lib/services/email.ts')
  if (fs.existsSync(emailServicePath)) {
    const emailService = fs.readFileSync(emailServicePath, 'utf8')
    if (emailService.includes('resend')) {
      log('   ✅ Service email supporte Resend', 'green')
    } else {
      log('   ⚠️  Service email ne semble pas supporter Resend', 'yellow')
    }
  } else {
    log('   ⚠️  Service email non trouvé', 'yellow')
  }
  
  // 4. Résumé
  log('\n' + '='.repeat(70), 'cyan')
  log('\n✅ CONFIGURATION AUTOMATIQUE TERMINÉE\n', 'green')
  
  log('📁 Fichiers créés dans : resend-config/', 'cyan')
  log('   - SETUP_GUIDE.md (Guide complet)', 'green')
  log('   - DNS_INSTRUCTIONS.md (Instructions DNS)', 'green')
  log('   - VERCEL_VARIABLES.txt (Variables à copier)', 'green')
  
  log('\n📋 PROCHAINES ÉTAPES :\n', 'yellow')
  log('1. Créez un compte Resend : https://resend.com', 'cyan')
  log('2. Suivez le guide : resend-config/SETUP_GUIDE.md', 'cyan')
  log('3. Ajoutez le domaine ${DOMAIN} dans Resend', 'cyan')
  log('4. Configurez les DNS (voir DNS_INSTRUCTIONS.md)', 'cyan')
  log('5. Créez une API Key', 'cyan')
  log('6. Ajoutez les variables dans Vercel', 'cyan')
  log('7. Redéployez l\'application', 'cyan')
  log('8. Testez : npm run test:email\n', 'cyan')
  
  log('🔗 Liens Rapides :', 'yellow')
  log('   - Resend : https://resend.com', 'cyan')
  log('   - Vercel Variables : https://vercel.com/adrien-nejkovics-projects/block-bank/settings/environment-variables\n', 'cyan')
  
  log('='.repeat(70), 'cyan')
  log('\n🎉 Tout est prêt ! Suivez le guide dans resend-config/SETUP_GUIDE.md\n', 'green')
}

main()


