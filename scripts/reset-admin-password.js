#!/usr/bin/env node

/**
 * Script pour réinitialiser le mot de passe admin à "admin"
 */

const crypto = require('crypto')
const fs = require('fs')
const path = require('path')

const envPath = path.join(process.cwd(), '.env.local')

// Fonction pour générer le hash SHA256 (comme dans adminAuth.ts)
function generateHash(password, secret = 'default-secret') {
  return crypto.createHash('sha256').update(password + secret).digest('hex')
}

// Vérifier si bcryptjs est disponible
async function generateBcryptHash(password) {
  try {
    const bcrypt = require('bcryptjs')
    return await bcrypt.hash(password, 10)
  } catch {
    return null
  }
}

async function main() {
  console.log('🔐 Réinitialisation du mot de passe admin...\n')

  // Lire le fichier .env.local
  let envContent = ''
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf-8')
  }

  // Extraire ADMIN_SESSION_SECRET si présent
  const sessionSecretMatch = envContent.match(/ADMIN_SESSION_SECRET=(.+)/)
  const sessionSecret = sessionSecretMatch ? sessionSecretMatch[1].trim() : 'default-secret'

  console.log(`📝 Utilisation du secret: ${sessionSecret === 'default-secret' ? 'default-secret (par défaut)' : sessionSecret}\n`)

  // Générer le hash pour "admin"
  const sha256Hash = generateHash('admin', sessionSecret)
  console.log(`✅ Hash SHA256 pour "admin": ${sha256Hash}`)

  // Essayer de générer un hash bcrypt
  const bcryptHash = await generateBcryptHash('admin')
  if (bcryptHash) {
    console.log(`✅ Hash bcrypt pour "admin": ${bcryptHash}`)
    console.log('\n💡 Note: Le système essaie d\'utiliser bcrypt en premier, puis SHA256 comme fallback.\n')
  }

  // Mettre à jour ou créer le fichier .env.local
  const newPasswordHash = bcryptHash || sha256Hash

  if (envContent.includes('ADMIN_PASSWORD_HASH=')) {
    // Mettre à jour le hash existant
    envContent = envContent.replace(/ADMIN_PASSWORD_HASH=.*/, `ADMIN_PASSWORD_HASH=${newPasswordHash}`)
    console.log('✏️  Mise à jour de ADMIN_PASSWORD_HASH dans .env.local\n')
  } else {
    // Ajouter le hash
    envContent += `\nADMIN_PASSWORD_HASH=${newPasswordHash}\n`
    console.log('➕ Ajout de ADMIN_PASSWORD_HASH dans .env.local\n')
  }

  fs.writeFileSync(envPath, envContent, 'utf-8')

  console.log('✅ Mot de passe admin réinitialisé !\n')
  console.log('📋 Informations de connexion:')
  console.log('   - URL: http://localhost:1001/admin/login')
  console.log('   - Mot de passe: admin\n')
  console.log('⚠️  N\'oubliez pas de redémarrer le serveur: npm run dev\n')
}

main().catch((error) => {
  console.error('❌ Erreur:', error.message)
  process.exit(1)
})

