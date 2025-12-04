/**
 * Script pour connecter le compte Facebook Block Bank dans l'application
 */

require('dotenv').config({ path: '.env.local' })

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:1001'

const facebookAccount = {
  network: 'facebook',
  username: '@BlockBank',
  url: 'https://www.facebook.com/people/Block-Bank/61584596674036/',
  status: 'connected',
  followers: null // À remplir manuellement
}

console.log('\n📱 Connexion du compte Facebook Block Bank')
console.log('='.repeat(70))
console.log(`🌐 URL: ${facebookAccount.url}`)
console.log(`👤 Username: ${facebookAccount.username}`)
console.log(`📊 Status: ${facebookAccount.status}`)
console.log('')

console.log('📋 Pour connecter ce compte dans l\'application:\n')
console.log('1. Allez sur: http://localhost:1001/admin/login')
console.log('   Mot de passe: admin\n')
console.log('2. Allez dans: Marketing > Overview\n')
console.log('3. Cliquez sur "Connect Account" pour Facebook\n')
console.log('4. Remplissez le formulaire:')
console.log(`   - Username: ${facebookAccount.username}`)
console.log(`   - URL: ${facebookAccount.url}`)
console.log(`   - Status: ${facebookAccount.status}`)
console.log('   - Followers: (optionnel, à remplir manuellement)\n')
console.log('5. Cliquez sur "Save"\n')

console.log('='.repeat(70))
console.log('✅ Le compte sera sauvegardé dans Supabase')
console.log('='.repeat(70) + '\n')

// Option: Essayer de connecter automatiquement via l'API (nécessite d'être connecté en admin)
async function connectViaAPI() {
  console.log('💡 Option: Connexion automatique via API\n')
  console.log('Pour connecter automatiquement, vous devez être connecté en admin.')
  console.log('Sinon, utilisez les étapes manuelles ci-dessus.\n')
  
  try {
    const response = await fetch(`${BASE_URL}/api/admin/marketing/accounts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Note: Nécessite un cookie de session admin
      },
      body: JSON.stringify(facebookAccount)
    })
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ Compte Facebook connecté avec succès!')
      console.log('   ID:', data.account?.id || 'N/A')
    } else if (response.status === 401) {
      console.log('⚠️  Authentification requise')
      console.log('   Connectez-vous d\'abord sur http://localhost:1001/admin/login')
    } else {
      const error = await response.json()
      console.log('❌ Erreur:', error.error || 'Erreur inconnue')
    }
  } catch (error) {
    console.log('⚠️  Impossible de se connecter automatiquement')
    console.log('   Utilisez les étapes manuelles ci-dessus')
  }
}

// Ne pas exécuter automatiquement, juste afficher les instructions
// connectViaAPI()

