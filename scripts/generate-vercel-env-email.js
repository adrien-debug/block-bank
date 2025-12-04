#!/usr/bin/env node

/**
 * Génère automatiquement les variables d'environnement pour l'email admin
 * à copier-coller dans Vercel
 */

const fs = require('fs')
const path = require('path')

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

// Configuration pour block-bank.com
const DOMAIN = 'block-bank.com'
const APP_URL = `https://${DOMAIN}`

// Variables d'email (sans les clés API qui doivent être ajoutées manuellement)
const emailVariables = {
  ADMIN_EMAIL: `admin@${DOMAIN}`,
  SUPPORT_EMAIL: `support@${DOMAIN}`,
  NO_REPLY_EMAIL: `noreply@${DOMAIN}`,
  NEXT_PUBLIC_APP_URL: APP_URL,
}

// Templates pour chaque service
const templates = {
  resend: {
    name: 'Resend (Recommandé)',
    variables: {
      ...emailVariables,
      RESEND_API_KEY: 're_xxxxxxxxxxxxx', // À remplacer
    },
    instructions: [
      '1. Créez un compte sur https://resend.com',
      '2. Allez dans Domains → Add Domain',
      '3. Entrez : block-bank.com',
      '4. Suivez les instructions DNS',
      '5. Créez une API Key : API Keys → Create API Key',
      '6. Remplacez RESEND_API_KEY ci-dessous par votre vraie clé',
    ],
  },
  sendgrid: {
    name: 'SendGrid',
    variables: {
      ...emailVariables,
      SENDGRID_API_KEY: 'SG.xxxxxxxxxxxxx', // À remplacer
    },
    instructions: [
      '1. Créez un compte sur https://sendgrid.com',
      '2. Allez dans Settings → Sender Authentication → Domain Authentication',
      '3. Ajoutez block-bank.com',
      '4. Suivez les instructions DNS',
      '5. Créez une API Key : Settings → API Keys → Create API Key',
      '6. Remplacez SENDGRID_API_KEY ci-dessous par votre vraie clé',
    ],
  },
  smtp: {
    name: 'SMTP personnalisé',
    variables: {
      ...emailVariables,
      SMTP_HOST: 'smtp.gmail.com',
      SMTP_PORT: '587',
      SMTP_USER: 'votre-email@gmail.com', // À remplacer
      SMTP_PASSWORD: 'votre-mot-de-passe-application', // À remplacer
      SMTP_SECURE: 'false',
    },
    instructions: [
      '1. Pour Gmail : Activez l\'authentification à 2 facteurs',
      '2. Créez un mot de passe d\'application',
      '3. Remplacez les valeurs SMTP ci-dessous',
    ],
  },
}

function generateEnvFile(template) {
  let content = `# Configuration Email Admin - ${template.name}\n`
  content += `# Domaine : ${DOMAIN}\n`
  content += `# Généré le : ${new Date().toISOString()}\n\n`
  content += `# Instructions :\n`
  template.instructions.forEach(instruction => {
    content += `# ${instruction}\n`
  })
  content += `\n# Variables à ajouter dans Vercel :\n`
  content += `# Lien : https://vercel.com/adrien-nejkovics-projects/block-bank/settings/environment-variables\n\n`
  
  Object.entries(template.variables).forEach(([key, value]) => {
    content += `${key}=${value}\n`
  })
  
  return content
}

function generateVercelCopyText(template) {
  let text = `\n📋 Variables pour ${template.name}\n`
  text += `─`.repeat(70) + `\n\n`
  
  Object.entries(template.variables).forEach(([key, value]) => {
    text += `${key}=${value}\n`
  })
  
  text += `\n─`.repeat(70) + `\n`
  
  return text
}

function main() {
  log('\n📧 Génération des Variables d\'Environnement Email Admin\n', 'cyan')
  log('='.repeat(70), 'cyan')
  
  log(`\n✅ Domaine : ${DOMAIN}`, 'green')
  log(`✅ URL : ${APP_URL}\n`, 'green')
  
  // Créer le dossier de sortie
  const outputDir = path.join(process.cwd(), 'vercel-email-config')
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }
  
  // Générer les fichiers pour chaque service
  Object.entries(templates).forEach(([key, template]) => {
    const filename = `vercel-env-${key}.txt`
    const filepath = path.join(outputDir, filename)
    const content = generateEnvFile(template)
    
    fs.writeFileSync(filepath, content, 'utf8')
    log(`\n✅ Fichier créé : ${filename}`, 'green')
  })
  
  // Afficher le résumé
  log('\n' + '='.repeat(70), 'cyan')
  log('\n📋 RÉSUMÉ\n', 'magenta')
  
  log('\n📁 Fichiers générés dans : vercel-email-config/', 'cyan')
  log('   - vercel-env-resend.txt (Recommandé)', 'green')
  log('   - vercel-env-sendgrid.txt', 'green')
  log('   - vercel-env-smtp.txt', 'green')
  
  log('\n🔗 Lien Vercel :', 'yellow')
  log('   https://vercel.com/adrien-nejkovics-projects/block-bank/settings/environment-variables\n', 'cyan')
  
  log('📝 Variables communes (toujours nécessaires) :', 'yellow')
  Object.entries(emailVariables).forEach(([key, value]) => {
    log(`   ${key}=${value}`, 'cyan')
  })
  
  log('\n⚠️  IMPORTANT :', 'yellow')
  log('   1. Choisissez UN service (Resend recommandé)', 'cyan')
  log('   2. Suivez les instructions dans le fichier .txt correspondant', 'cyan')
  log('   3. Remplacez les valeurs placeholder (xxxxxxxxxxxxx)', 'cyan')
  log('   4. Ajoutez les variables dans Vercel', 'cyan')
  log('   5. Sélectionnez : Production, Preview, Development', 'cyan')
  log('   6. Redéployez l\'application\n', 'cyan')
  
  // Afficher le texte à copier pour Resend (recommandé)
  log('='.repeat(70), 'cyan')
  log('\n📋 VARIABLES RESEND (Recommandé) - À COPIER DANS VERCEL :\n', 'magenta')
  log(generateVercelCopyText(templates.resend), 'green')
  
  log('\n📚 Documentation :', 'yellow')
  log('   - QUICK_START_EMAIL.md', 'cyan')
  log('   - CONFIGURATION_EMAIL_ADMIN_FINAL.md', 'cyan')
  log('   - GUIDE_EMAIL_ADMIN.md\n', 'cyan')
  
  log('='.repeat(70), 'cyan')
  log('\n✅ Génération terminée !\n', 'green')
}

main()

