#!/usr/bin/env node

/**
 * Script pour tester la vérification du mot de passe admin
 */

const crypto = require('crypto')
require('dotenv').config({ path: '.env.local' })

// Simuler la fonction verifyPassword comme dans adminAuth.ts
async function verifyPassword(password, hash) {
  // Try to use bcryptjs if available
  try {
    const bcrypt = require('bcryptjs')
    const result = await bcrypt.compare(password, hash)
    console.log(`✅ Test bcrypt: ${result}`)
    return result
  } catch (error) {
    console.log(`❌ bcrypt non disponible: ${error.message}`)
    // Fallback for development
    const sessionSecret = process.env.ADMIN_SESSION_SECRET || 'default-secret'
    const passwordHash = crypto.createHash('sha256').update(password + sessionSecret).digest('hex')
    const result = crypto.timingSafeEqual(Buffer.from(passwordHash), Buffer.from(hash))
    console.log(`✅ Test SHA256: ${result}`)
    return result
  }
}

async function testPassword() {
  const password = 'admin'
  const hash = process.env.ADMIN_PASSWORD_HASH

  console.log('🔐 Test du mot de passe admin\n')
  console.log(`Mot de passe testé: ${password}`)
  console.log(`Hash dans .env.local: ${hash ? hash.substring(0, 30) + '...' : 'NON DÉFINI'}`)
  console.log(`Session Secret: ${process.env.ADMIN_SESSION_SECRET || 'default-secret'}\n`)

  if (!hash) {
    console.log('❌ ADMIN_PASSWORD_HASH n\'est pas défini dans .env.local')
    return
  }

  console.log('🧪 Test de vérification...\n')
  
  try {
    const result = await verifyPassword(password, hash)
    if (result) {
      console.log('\n✅ SUCCÈS : Le mot de passe "admin" fonctionne avec ce hash !')
    } else {
      console.log('\n❌ ÉCHEC : Le mot de passe "admin" ne fonctionne pas avec ce hash.')
      console.log('\n💡 Solution : Le hash doit être régénéré.')
    }
  } catch (error) {
    console.log(`\n❌ ERREUR : ${error.message}`)
  }
}

testPassword()





