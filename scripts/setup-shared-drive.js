#!/usr/bin/env node

/**
 * Script d'assistance pour configurer un Shared Drive Google
 * Résout le problème de quota des Service Accounts
 */

const readline = require('readline')
const fs = require('fs')
const path = require('path')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

function log(message, color = 'white') {
  const colors = {
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    reset: '\x1b[0m'
  }
  console.log(`${colors[color] || ''}${message}${colors.reset}`)
}

async function main() {
  console.clear()
  log('🚀 Configuration Shared Drive Google - Résolution du quota Service Account\n', 'cyan')
  
  log('═══════════════════════════════════════════════════════════════════', 'blue')
  log('  Cette configuration résout le problème de quota des Service Accounts', 'blue')
  log('═══════════════════════════════════════════════════════════════════\n', 'blue')

  // Étape 1 : Vérifier les prérequis
  log('📋 ÉTAPE 1 : Vérification des prérequis\n', 'yellow')
  
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  if (!serviceAccountEmail) {
    log('❌ GOOGLE_SERVICE_ACCOUNT_EMAIL n\'est pas configuré', 'red')
    log('   Configurez d\'abord votre Service Account Google Cloud', 'yellow')
    process.exit(1)
  }
  
  log(`✅ Service Account trouvé: ${serviceAccountEmail}\n`, 'green')

  // Étape 2 : Instructions pour créer le Shared Drive
  log('📋 ÉTAPE 2 : Créer un Shared Drive\n', 'yellow')
  log('Pour créer un Shared Drive :', 'white')
  log('  1. Allez sur https://drive.google.com', 'white')
  log('  2. Dans le menu gauche, cliquez sur "Shared drives" (Dossiers partagés)', 'white')
  log('  3. Cliquez sur "+ New" pour créer un nouveau Shared Drive', 'white')
  log('  4. Nommez-le (ex: "BlockBank Submissions")', 'white')
  log('  5. Ouvrez le Shared Drive créé\n', 'white')

  // Étape 3 : Instructions pour partager
  log('📋 ÉTAPE 3 : Partager le Shared Drive avec le Service Account\n', 'yellow')
  log('Une fois le Shared Drive créé :', 'white')
  log('  1. Cliquez sur le nom du Shared Drive (en haut à gauche)', 'white')
  log('  2. Cliquez sur "Manage members" (Gérer les membres)', 'white')
  log(`  3. Ajoutez cet email: ${serviceAccountEmail}`, 'cyan')
  log('  4. Donnez-lui le rôle "Content Manager" ou "Manager"', 'white')
  log('  5. Cliquez sur "Send"\n', 'white')

  // Étape 4 : Demander l'ID du Shared Drive
  log('📋 ÉTAPE 4 : Configuration de l\'ID du Shared Drive\n', 'yellow')
  log('Pour trouver l\'ID du Shared Drive :', 'white')
  log('  1. Ouvrez le Shared Drive dans Google Drive', 'white')
  log('  2. Regardez l\'URL dans votre navigateur', 'white')
  log('  3. L\'ID est la partie après /folders/', 'white')
  log('     Exemple: https://drive.google.com/drive/folders/XXXXXXXXXXXXXXXXX\n', 'white')

  const sharedDriveId = await question('Entrez l\'ID du Shared Drive: ')

  if (!sharedDriveId || sharedDriveId.trim().length === 0) {
    log('❌ ID du Shared Drive requis', 'red')
    process.exit(1)
  }

  // Étape 5 : Proposer de mettre à jour les variables
  log('\n📋 ÉTAPE 5 : Configuration des variables d\'environnement\n', 'yellow')

  const updateEnvLocal = await question('Voulez-vous mettre à jour .env.local ? (o/n): ')
  
  if (updateEnvLocal.toLowerCase() === 'o' || updateEnvLocal.toLowerCase() === 'oui' || updateEnvLocal.toLowerCase() === 'y' || updateEnvLocal.toLowerCase() === 'yes') {
    const envPath = path.join(process.cwd(), '.env.local')
    let envContent = ''
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf-8')
    }

    // Mettre à jour ou ajouter les variables
    const lines = envContent.split('\n')
    let foundUseSharedDrive = false
    let foundSharedDriveId = false

    const newLines = lines.map(line => {
      if (line.startsWith('GOOGLE_USE_SHARED_DRIVE=')) {
        foundUseSharedDrive = true
        return 'GOOGLE_USE_SHARED_DRIVE=true'
      }
      if (line.startsWith('GOOGLE_SHARED_DRIVE_ID=')) {
        foundSharedDriveId = true
        return `GOOGLE_SHARED_DRIVE_ID=${sharedDriveId.trim()}`
      }
      return line
    })

    if (!foundUseSharedDrive) {
      newLines.push('GOOGLE_USE_SHARED_DRIVE=true')
    }
    if (!foundSharedDriveId) {
      newLines.push(`GOOGLE_SHARED_DRIVE_ID=${sharedDriveId.trim()}`)
    }

    fs.writeFileSync(envPath, newLines.join('\n'))
    log(`\n✅ Variables ajoutées dans .env.local`, 'green')
    log(`   GOOGLE_USE_SHARED_DRIVE=true`, 'cyan')
    log(`   GOOGLE_SHARED_DRIVE_ID=${sharedDriveId.trim()}\n`, 'cyan')
  }

  // Étape 6 : Instructions pour Vercel
  log('📋 ÉTAPE 6 : Configuration dans Vercel (Production)\n', 'yellow')
  log('Pour configurer dans Vercel, exécutez ces commandes :\n', 'white')
  log('  vercel env add GOOGLE_USE_SHARED_DRIVE production', 'cyan')
  log('    → Entrez: true\n', 'white')
  log(`  vercel env add GOOGLE_SHARED_DRIVE_ID production`, 'cyan')
  log(`    → Entrez: ${sharedDriveId.trim()}\n`, 'white')

  const addToVercel = await question('Voulez-vous que je génère un script pour Vercel ? (o/n): ')

  if (addToVercel.toLowerCase() === 'o' || addToVercel.toLowerCase() === 'oui' || addToVercel.toLowerCase() === 'y' || addToVercel.toLowerCase() === 'yes') {
    const vercelScript = `#!/bin/bash
# Script pour configurer les variables Shared Drive dans Vercel

echo "🔧 Configuration des variables Shared Drive dans Vercel..."
echo ""
echo "Variable 1: GOOGLE_USE_SHARED_DRIVE"
echo "true" | vercel env add GOOGLE_USE_SHARED_DRIVE production
echo ""
echo "Variable 2: GOOGLE_SHARED_DRIVE_ID"
echo "${sharedDriveId.trim()}" | vercel env add GOOGLE_SHARED_DRIVE_ID production
echo ""
echo "✅ Variables configurées !"
echo ""
echo "🔍 Vérifiez avec: vercel env ls | grep GOOGLE"
`

    const scriptPath = path.join(process.cwd(), 'scripts', 'configure-vercel-shared-drive.sh')
    fs.writeFileSync(scriptPath, vercelScript)
    fs.chmodSync(scriptPath, '755')
    
    log(`\n✅ Script créé: scripts/configure-vercel-shared-drive.sh`, 'green')
    log('   Exécutez-le avec: bash scripts/configure-vercel-shared-drive.sh\n', 'cyan')
  }

  // Résumé final
  log('\n═══════════════════════════════════════════════════════════════════', 'green')
  log('✅ Configuration terminée !', 'green')
  log('═══════════════════════════════════════════════════════════════════\n', 'green')

  log('📝 Récapitulatif :', 'yellow')
  log(`   • Service Account: ${serviceAccountEmail}`, 'white')
  log(`   • Shared Drive ID: ${sharedDriveId.trim()}`, 'white')
  log(`   • Variables à configurer dans Vercel:`, 'white')
  log(`     - GOOGLE_USE_SHARED_DRIVE=true`, 'cyan')
  log(`     - GOOGLE_SHARED_DRIVE_ID=${sharedDriveId.trim()}\n`, 'cyan')

  log('🚀 Prochaines étapes :', 'yellow')
  log('   1. Vérifiez que le Shared Drive est bien partagé avec le Service Account', 'white')
  log('   2. Configurez les variables dans Vercel (ou exécutez le script)', 'white')
  log('   3. Redéployez l\'application sur Vercel', 'white')
  log('   4. Testez une soumission d\'actif\n', 'white')

  log('📚 Documentation complète: SOLUTION_SHARED_DRIVES.md\n', 'cyan')

  rl.close()
}

main().catch((error) => {
  console.error('❌ Erreur:', error)
  rl.close()
  process.exit(1)
})




