/**
 * Script de test de la configuration email
 * Vérifie que tout est configuré correctement
 */

require('dotenv').config({ path: '.env.local' })

// Fonctions email simplifiées pour le test (sans import TypeScript)
function getAdminEmail() {
  return process.env.ADMIN_EMAIL || `admin@${getDomainFromUrl()}`
}

function getSupportEmail() {
  return process.env.SUPPORT_EMAIL || `support@${getDomainFromUrl()}`
}

function getNoReplyEmail() {
  return process.env.NO_REPLY_EMAIL || `noreply@${getDomainFromUrl()}`
}

function getDomainFromUrl() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || ''
  if (appUrl) {
    try {
      const url = new URL(appUrl)
      return url.hostname.replace('www.', '')
    } catch {
      const match = appUrl.match(/(?:https?:\/\/)?(?:www\.)?([^\/]+)/)
      if (match) {
        return match[1]
      }
    }
  }
  return 'block-bank.com'
}

function getEmailConfig() {
  return {
    resendApiKey: process.env.RESEND_API_KEY,
    sendGridApiKey: process.env.SENDGRID_API_KEY,
    awsSesAccessKeyId: process.env.AWS_SES_ACCESS_KEY_ID,
    smtpHost: process.env.SMTP_HOST,
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

console.log('\n📧 Test de Configuration Email - Block Bank')
console.log('='.repeat(70))

// Test 1: Vérifier les adresses email
console.log('\n✅ Adresses Email Configurées:')
console.log(`   Admin: ${getAdminEmail()}`)
console.log(`   Support: ${getSupportEmail()}`)
console.log(`   No Reply: ${getNoReplyEmail()}`)

// Test 2: Valider les formats
console.log('\n🔍 Validation des Formats:')
const adminEmail = getAdminEmail()
const supportEmail = getSupportEmail()
const noReplyEmail = getNoReplyEmail()

console.log(`   Admin (${isValidEmail(adminEmail) ? '✅' : '❌'}): ${adminEmail}`)
console.log(`   Support (${isValidEmail(supportEmail) ? '✅' : '❌'}): ${supportEmail}`)
console.log(`   No Reply (${isValidEmail(noReplyEmail) ? '✅' : '❌'}): ${noReplyEmail}`)

// Test 3: Vérifier la configuration
console.log('\n⚙️  Configuration Email:')
const emailConfig = getEmailConfig()

console.log(`   Resend API Key: ${emailConfig.resendApiKey ? '✅ Configuré' : '❌ Non configuré'}`)
console.log(`   SendGrid API Key: ${emailConfig.sendGridApiKey ? '✅ Configuré' : '❌ Non configuré'}`)
console.log(`   AWS SES: ${emailConfig.awsSesAccessKeyId ? '✅ Configuré' : '❌ Non configuré'}`)
console.log(`   SMTP Host: ${emailConfig.smtpHost ? `✅ ${emailConfig.smtpHost}` : '❌ Non configuré'}`)

// Test 4: Vérifier les packages installés
console.log('\n📦 Packages Installés:')

async function checkPackages() {
  const packages = {
    'resend': 'resend',
    '@sendgrid/mail': '@sendgrid/mail',
    'aws-sdk': 'aws-sdk',
    'nodemailer': 'nodemailer'
  }

  for (const [name, importName] of Object.entries(packages)) {
    try {
      require.resolve(importName)
      console.log(`   ✅ ${name}`)
    } catch {
      console.log(`   ❌ ${name} (non installé)`)
    }
  }
}

checkPackages().then(() => {
  // Test 5: Recommandations
console.log('\n💡 Recommandations:')

const hasService = emailConfig.resendApiKey || 
                  emailConfig.sendGridApiKey || 
                  emailConfig.awsSesAccessKeyId || 
                  emailConfig.smtpHost

if (!hasService) {
  console.log('   ⚠️  Aucun service email configuré')
  console.log('   📝 Pour envoyer de vrais emails:')
  console.log('      1. Créez un compte sur https://resend.com (recommandé)')
  console.log('      2. Ajoutez RESEND_API_KEY dans .env.local')
  console.log('      3. Installez: npm install resend')
  console.log('   📖 Voir GUIDE_EMAIL_ADMIN.md pour plus de détails')
} else {
  console.log('   ✅ Service email configuré!')
  
  if (emailConfig.resendApiKey) {
    console.log('   ⭐ Resend est configuré (recommandé)')
  }
}

// Test 6: Variables d'environnement
console.log('\n🔐 Variables d\'Environnement:')
console.log(`   NEXT_PUBLIC_APP_URL: ${process.env.NEXT_PUBLIC_APP_URL || '❌ Non défini'}`)
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`)

// Résumé final
console.log('\n' + '='.repeat(70))
const allValid = isValidEmail(adminEmail) && isValidEmail(supportEmail) && isValidEmail(noReplyEmail)

if (allValid && hasService) {
  console.log('✅ CONFIGURATION EMAIL COMPLÈTE ET PRÊTE!')
  console.log('\n📋 Prochaines étapes:')
  console.log('   1. Testez l\'envoi avec: npm run test:email')
  console.log('   2. Utilisez sendEmail() dans votre code')
} else if (allValid) {
  console.log('⚠️  ADRESSES EMAIL CONFIGURÉES - SERVICE EMAIL MANQUANT')
  console.log('\n📋 Pour activer l\'envoi d\'emails:')
  console.log('   1. Configurez un service email (voir GUIDE_EMAIL_ADMIN.md)')
  console.log('   2. Ajoutez la clé API dans .env.local')
} else {
  console.log('❌ CONFIGURATION INCOMPLÈTE')
  console.log('\n📋 Actions requises:')
  console.log('   1. Vérifiez les adresses email dans .env.local')
  console.log('   2. Voir GUIDE_EMAIL_ADMIN.md pour la configuration complète')
}
console.log('='.repeat(70) + '\n')
}).catch(err => {
  console.error('Erreur:', err)
  process.exit(1)
})
