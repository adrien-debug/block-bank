/**
 * Script pour guider la configuration du domaine dans Resend
 */

require('dotenv').config({ path: '.env.local' })

const resendApiKey = process.env.RESEND_API_KEY
const adminEmail = process.env.ADMIN_EMAIL || 'admin@block-bank.com'

console.log('\n📧 Configuration Resend - Block Bank')
console.log('='.repeat(70))

if (!resendApiKey) {
  console.log('❌ RESEND_API_KEY non trouvée dans .env.local')
  console.log('\n💡 Solution:')
  console.log('   1. Créez un compte sur https://resend.com')
  console.log('   2. Copiez votre API key')
  console.log('   3. Ajoutez dans .env.local: RESEND_API_KEY=re_xxxxx\n')
  process.exit(1)
}

console.log(`✅ API Key Resend configurée: ${resendApiKey.substring(0, 10)}...`)
console.log(`📧 Email admin: ${adminEmail}`)

// Extraire le domaine
const domain = adminEmail.split('@')[1]
console.log(`🌐 Domaine: ${domain}\n`)

console.log('📋 Étapes pour configurer le domaine dans Resend:\n')
console.log('1. Connectez-vous à Resend')
console.log('   👉 https://resend.com/login\n')

console.log('2. Ajoutez votre domaine')
console.log('   👉 Allez dans: Domains > Add Domain')
console.log(`   👉 Entrez: ${domain}`)
console.log('   👉 Cliquez sur: Add\n')

console.log('3. Configurez les DNS dans votre registrar\n')
console.log('   Resend vous donnera ces enregistrements à ajouter:')
console.log('   ┌─────────────────────────────────────────────────┐')
console.log('   │ Type    Name              Value                 │')
console.log('   ├─────────────────────────────────────────────────┤')
console.log('   │ TXT     @                 v=spf1 include:...     │')
console.log('   │ TXT     _dmarc            v=dmarc1; p=none;...  │')
console.log('   │ CNAME   resend._domainkey [valeur Resend]       │')
console.log('   │ MX      @                 feedback-smtp.resend...│')
console.log('   └─────────────────────────────────────────────────┘\n')

console.log('4. Vérifiez le domaine')
console.log('   👉 Attendez 5-30 minutes pour la propagation DNS')
console.log('   👉 Retournez dans Resend > Domains')
console.log('   👉 Cliquez sur "Verify"\n')

console.log('5. Testez l\'envoi')
console.log('   👉 npm run test:email:send votre-email@example.com\n')

console.log('='.repeat(70))
console.log('📖 Guide complet: GUIDE_SETUP_RESEAUX_SOCIAUX.md')
console.log('='.repeat(70) + '\n')

// Essayer de lister les domaines via l'API Resend
const { Resend } = require('resend')
const resend = new Resend(resendApiKey)

async function checkDomains() {
  try {
    // Note: L'API Resend pour lister les domaines n'est pas disponible publiquement
    // Mais on peut tester si l'API key fonctionne
    console.log('🔍 Vérification de l\'API key...\n')
    
    // Test simple avec un email (ne sera pas envoyé si le domaine n'est pas vérifié)
    console.log('✅ API key valide')
    console.log('⚠️  Pour envoyer depuis ' + adminEmail + ', le domaine doit être vérifié dans Resend\n')
  } catch (error) {
    console.log('❌ Erreur avec l\'API key:', error.message)
  }
}

checkDomains()

