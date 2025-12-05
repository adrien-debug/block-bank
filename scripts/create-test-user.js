/**
 * Script pour créer un utilisateur de test
 * Usage: node scripts/create-test-user.js
 */

const { createClient } = require('@supabase/supabase-js')
const bcrypt = require('bcryptjs')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement manquantes')
  console.error('Assurez-vous que NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont définis dans .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createTestUser() {
  console.log('🚀 Création d\'un utilisateur de test...\n')

  // Informations de l'utilisateur de test
  const testEmail = 'test@example.com'
  const testPassword = 'Test123!'
  const firstName = 'Test'
  const lastName = 'User'
  const address = '0x0000000000000000000000000000000000000000'

  try {
    // Vérifier si l'utilisateur existe déjà
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', testEmail)
      .maybeSingle()

    if (existingUser) {
      console.log('⚠️  Un utilisateur avec cet email existe déjà')
      console.log(`   ID: ${existingUser.id}`)
      console.log(`   Email: ${existingUser.email}`)
      console.log('\n✅ Vous pouvez vous connecter avec:')
      console.log(`   Email: ${testEmail}`)
      console.log(`   Mot de passe: ${testPassword}`)
      return
    }

    // Hasher le mot de passe
    console.log('🔐 Hachage du mot de passe...')
    const passwordHash = await bcrypt.hash(testPassword, 10)

    // Créer l'utilisateur
    console.log('👤 Création de l\'utilisateur...')
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        email: testEmail,
        password_hash: passwordHash,
        first_name: firstName,
        last_name: lastName,
        address: address,
        role: 'user',
      })
      .select('id, email, first_name, last_name, role')
      .single()

    if (userError) {
      console.error('❌ Erreur création utilisateur:', userError.message)
      console.error('   Détails:', userError)
      process.exit(1)
    }

    console.log('✅ Utilisateur créé avec succès!')
    console.log(`   ID: ${user.id}`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Nom: ${user.first_name} ${user.last_name}`)
    console.log(`   Rôle: ${user.role}`)
    
    console.log('\n📝 Informations de connexion:')
    console.log(`   Email: ${testEmail}`)
    console.log(`   Mot de passe: ${testPassword}`)
    console.log('\n✅ Vous pouvez maintenant vous connecter avec ces identifiants')

  } catch (error) {
    console.error('❌ Erreur:', error.message)
    process.exit(1)
  }
}

createTestUser()
