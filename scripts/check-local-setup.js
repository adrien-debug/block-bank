#!/usr/bin/env node

/**
 * Script de vérification de la configuration locale
 * Vérifie que toutes les variables d'environnement nécessaires sont configurées
 */

require('dotenv').config({ path: '.env.local' })

const requiredEnvVars = {
  'NEXT_PUBLIC_SUPABASE_URL': 'URL du projet Supabase',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY': 'Clé publique anonyme Supabase',
  'SUPABASE_SERVICE_ROLE_KEY': 'Clé service role Supabase',
  'ADMIN_PASSWORD_HASH': 'Hash du mot de passe admin (généré avec bcrypt)',
  'ADMIN_SESSION_SECRET': 'Clé secrète pour les sessions admin',
}

const optionalEnvVars = {
  'NEXT_PUBLIC_APP_URL': 'URL de l\'application (par défaut: http://localhost:1001)',
  'NODE_ENV': 'Environnement Node.js (par défaut: development)',
}

console.log('🔍 Vérification de la configuration locale...\n')

let hasErrors = false
let hasWarnings = false

// Vérifier les variables requises
console.log('📋 Variables d\'environnement requises:')
for (const [varName, description] of Object.entries(requiredEnvVars)) {
  const value = process.env[varName]
  if (!value || value.trim() === '') {
    console.log(`  ❌ ${varName}`)
    console.log(`     Description: ${description}`)
    console.log(`     Status: MANQUANTE\n`)
    hasErrors = true
  } else {
    const displayValue = varName.includes('KEY') || varName.includes('SECRET') || varName.includes('HASH')
      ? `${value.substring(0, 10)}...` // Afficher seulement les 10 premiers caractères pour les clés
      : value
    console.log(`  ✅ ${varName}`)
    console.log(`     Valeur: ${displayValue}\n`)
  }
}

// Vérifier les variables optionnelles
console.log('📋 Variables d\'environnement optionnelles:')
for (const [varName, description] of Object.entries(optionalEnvVars)) {
  const value = process.env[varName]
  if (!value || value.trim() === '') {
    console.log(`  ⚠️  ${varName} - Non définie (utilisera la valeur par défaut)`)
    console.log(`     Description: ${description}\n`)
    hasWarnings = true
  } else {
    console.log(`  ✅ ${varName}: ${value}\n`)
  }
}

// Vérifications supplémentaires
console.log('🔧 Vérifications supplémentaires:\n')

// Vérifier le format de l'URL Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
if (supabaseUrl && !supabaseUrl.startsWith('https://') && !supabaseUrl.startsWith('http://')) {
  console.log('  ⚠️  NEXT_PUBLIC_SUPABASE_URL ne semble pas être une URL valide')
  console.log(`     Valeur actuelle: ${supabaseUrl}\n`)
  hasWarnings = true
} else if (supabaseUrl) {
  console.log('  ✅ Format de l\'URL Supabase: Valide\n')
}

// Vérifier le hash du mot de passe admin
const adminHash = process.env.ADMIN_PASSWORD_HASH
if (adminHash) {
  // Un hash bcrypt commence généralement par $2a$ ou $2b$
  if (!adminHash.startsWith('$2a$') && !adminHash.startsWith('$2b$')) {
    console.log('  ⚠️  ADMIN_PASSWORD_HASH ne semble pas être un hash bcrypt valide')
    console.log('     Un hash bcrypt doit commencer par $2a$ ou $2b$')
    console.log('     Générer un hash avec: node -e "const bcrypt = require(\'bcryptjs\'); bcrypt.hash(\'votre-mot-de-passe\', 10).then(console.log)"\n')
    hasWarnings = true
  } else {
    console.log('  ✅ Format du hash admin: Valide\n')
  }
}

// Résumé
console.log('━'.repeat(50))
if (hasErrors) {
  console.log('\n❌ Configuration incomplète!')
  console.log('\nVeuillez créer un fichier .env.local avec toutes les variables requises.')
  console.log('Consultez GUIDE_DEMARRAGE_LOCAL.md pour plus d\'informations.\n')
  process.exit(1)
} else if (hasWarnings) {
  console.log('\n⚠️  Configuration complète avec avertissements')
  console.log('L\'application devrait fonctionner, mais vérifiez les avertissements ci-dessus.\n')
  process.exit(0)
} else {
  console.log('\n✅ Configuration complète!')
  console.log('\nVous pouvez démarrer l\'application avec:')
  console.log('  npm run dev\n')
  process.exit(0)
}

