/**
 * Script de test d'envoi d'email avec Resend
 * Teste que la configuration fonctionne correctement
 */

require('dotenv').config({ path: '.env.local' })

const { Resend } = require('resend')

const resendApiKey = process.env.RESEND_API_KEY
const adminEmail = process.env.ADMIN_EMAIL || 'admin@block-bank.com'

if (!resendApiKey) {
  console.error('❌ RESEND_API_KEY non trouvée dans .env.local')
  process.exit(1)
}

console.log('\n📧 Test d\'envoi d\'email avec Resend')
console.log('='.repeat(70))
console.log(`📤 From: ${adminEmail}`)
console.log(`🔑 API Key: ${resendApiKey.substring(0, 10)}...`)
console.log('')

const resend = new Resend(resendApiKey)

async function testEmail() {
  try {
    console.log('🚀 Envoi d\'un email de test...\n')
    
    // Demander l'email de destination
    const testEmail = process.argv[2] || adminEmail
    
    const { data, error } = await resend.emails.send({
      from: `Block Bank <${adminEmail}>`,
      to: [testEmail],
      subject: '✅ Test Email - Block Bank Configuration',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .success { color: #10b981; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Block Bank</h1>
            </div>
            <div class="content">
              <h2>✅ Configuration Email Réussie!</h2>
              <p>Félicitations ! Votre configuration email est opérationnelle.</p>
              <p class="success">L'email a été envoyé avec succès via Resend.</p>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
              <p style="color: #6b7280; font-size: 14px;">
                Cet email confirme que votre service email Block Bank est correctement configuré.<br>
                <strong>From:</strong> ${adminEmail}
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `✅ Configuration Email Réussie!\n\nFélicitations ! Votre configuration email est opérationnelle.\n\nFrom: ${adminEmail}`,
    })

    if (error) {
      console.error('❌ Erreur lors de l\'envoi:', error)
      process.exit(1)
    }

    console.log('✅ Email envoyé avec succès!')
    console.log(`   ID: ${data?.id || 'N/A'}`)
    console.log(`   To: ${testEmail}`)
    console.log(`   From: ${adminEmail}`)
    console.log('\n📬 Vérifiez votre boîte de réception (et les spams)')
    console.log('='.repeat(70) + '\n')

  } catch (error) {
    console.error('\n❌ Erreur:', error.message)
    if (error.message.includes('domain')) {
      console.error('\n💡 Solution:')
      console.error('   1. Vérifiez que le domaine est ajouté dans Resend')
      console.error('   2. Vérifiez que les DNS sont configurés correctement')
      console.error('   3. Voir: https://resend.com/domains')
    }
    process.exit(1)
  }
}

testEmail()

