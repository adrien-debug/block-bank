/**
 * Script de configuration automatique de l'email admin
 * Guide interactif pour configurer l'email
 */

require('dotenv').config({ path: '.env.local' })
const fs = require('fs')
const path = require('path')

console.log('\n📧 Configuration Email Admin - Block Bank')
console.log('='.repeat(70))

const envPath = path.join(__dirname, '..', '.env.local')

// Lire le fichier .env.local
let envContent = ''
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf-8')
}

// Vérifier la configuration actuelle
const hasAdminEmail = envContent.includes('ADMIN_EMAIL=')
const hasResend = envContent.includes('RESEND_API_KEY=')
const hasSendGrid = envContent.includes('SENDGRID_API_KEY=')
const hasSMTP = envContent.includes('SMTP_HOST=')

console.log('\n📋 Configuration Actuelle:')
console.log(`   Admin Email: ${hasAdminEmail ? '✅' : '❌'}`)
console.log(`   Resend: ${hasResend ? '✅' : '❌'}`)
console.log(`   SendGrid: ${hasSendGrid ? '✅' : '❌'}`)
console.log(`   SMTP: ${hasSMTP ? '✅' : '❌'}`)

// Recommandations
console.log('\n💡 Recommandation:')
console.log('   Pour une configuration rapide et simple, utilisez Resend:')
console.log('   1. Créez un compte sur https://resend.com')
console.log('   2. Ajoutez votre domaine block-bank.com')
console.log('   3. Copiez votre API key')
console.log('   4. Ajoutez dans .env.local: RESEND_API_KEY=re_xxxxx')
console.log('   5. Installez: npm install resend')

// Vérifier si resend est installé
try {
  require.resolve('resend')
  console.log('\n✅ Package resend est installé')
} catch {
  console.log('\n⚠️  Package resend non installé')
  console.log('   Installez avec: npm install resend')
}

// Afficher le contenu actuel de .env.local pour les emails
console.log('\n📝 Configuration Email dans .env.local:')
const emailLines = envContent
  .split('\n')
  .filter(line => line.includes('EMAIL') || line.includes('RESEND') || line.includes('SENDGRID') || line.includes('SMTP'))

if (emailLines.length > 0) {
  emailLines.forEach(line => {
    if (line.trim() && !line.trim().startsWith('#')) {
      // Masquer les clés API
      const masked = line.replace(/(API_KEY|PASSWORD|SECRET)=[^\s]+/, (match) => {
        const [key, value] = match.split('=')
        return `${key}=${value.substring(0, 8)}...`
      })
      console.log(`   ${masked}`)
    }
  })
} else {
  console.log('   Aucune configuration email trouvée')
}

console.log('\n' + '='.repeat(70))
console.log('✅ Configuration Email Admin')
console.log('='.repeat(70))
console.log('\n📖 Pour plus de détails, consultez: GUIDE_EMAIL_ADMIN.md\n')
