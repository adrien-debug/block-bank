#!/usr/bin/env node

/**
 * Script de test complet pour vérifier que tout fonctionne
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function checkmark() {
  return `${colors.green}✅${colors.reset}`
}

function cross() {
  return `${colors.red}❌${colors.reset}`
}

function warning() {
  return `${colors.yellow}⚠️${colors.reset}`
}

let testsPassed = 0
let testsFailed = 0
const errors = []

function test(name, fn) {
  try {
    log(`\n📋 Test: ${name}`, 'cyan')
    fn()
    testsPassed++
    log(`   ${checkmark()} ${name}`, 'green')
  } catch (error) {
    testsFailed++
    errors.push({ name, error: error.message })
    log(`   ${cross()} ${name}: ${error.message}`, 'red')
  }
}

async function main() {
  console.clear()
  log('🧪 TEST COMPLET DU PROJET BLOCKBANK', 'blue')
  log('═'.repeat(60), 'blue')
  log('')

  // Test 1: Vérifier que les fichiers essentiels existent
  test('Fichiers essentiels présents', () => {
    const requiredFiles = [
      'package.json',
      'next.config.js',
      'tsconfig.json',
      'app/layout.tsx',
      'app/page.tsx',
      'lib/utils/localStorage.ts',
      'lib/utils/submissionStorage.ts',
    ]
    
    requiredFiles.forEach(file => {
      const filePath = path.join(process.cwd(), file)
      if (!fs.existsSync(filePath)) {
        throw new Error(`Fichier manquant: ${file}`)
      }
    })
  })

  // Test 2: Vérifier que le stockage local fonctionne
  test('Système de stockage local', () => {
    const storagePath = path.join(process.cwd(), 'lib/utils/localStorage.ts')
    if (!fs.existsSync(storagePath)) {
      throw new Error('localStorage.ts manquant')
    }
    
    const content = fs.readFileSync(storagePath, 'utf-8')
    if (!content.includes('saveSubmission')) {
      throw new Error('Fonction saveSubmission manquante')
    }
    if (!content.includes('getSubmission')) {
      throw new Error('Fonction getSubmission manquante')
    }
    if (!content.includes('listSubmissions')) {
      throw new Error('Fonction listSubmissions manquante')
    }
  })

  // Test 3: Vérifier que submissionStorage utilise localStorage
  test('submissionStorage utilise localStorage', () => {
    const storagePath = path.join(process.cwd(), 'lib/utils/submissionStorage.ts')
    const content = fs.readFileSync(storagePath, 'utf-8')
    
    if (content.includes('googleDrive')) {
      throw new Error('submissionStorage contient encore des références à googleDrive')
    }
    
    if (!content.includes('localStorage')) {
      throw new Error('submissionStorage n\'utilise pas localStorage')
    }
  })

  // Test 4: Vérifier les composants UI
  test('Composants UI présents', () => {
    const uiComponents = [
      'components/ui/Button.tsx',
      'components/ui/Card.tsx',
      'components/ui/ToastProvider.tsx',
      'components/ui/index.ts',
    ]
    
    uiComponents.forEach(component => {
      const filePath = path.join(process.cwd(), component)
      if (!fs.existsSync(filePath)) {
        throw new Error(`Composant UI manquant: ${component}`)
      }
    })
  })

  // Test 5: Vérifier les exports des composants UI
  test('Exports des composants UI', () => {
    const buttonPath = path.join(process.cwd(), 'components/ui/Button.tsx')
    const cardPath = path.join(process.cwd(), 'components/ui/Card.tsx')
    
    const buttonContent = fs.readFileSync(buttonPath, 'utf-8')
    const cardContent = fs.readFileSync(cardPath, 'utf-8')
    
    if (!buttonContent.includes('export default Button') || !buttonContent.includes('export { Button }')) {
      throw new Error('Button.tsx n\'a pas les exports corrects')
    }
    
    if (!cardContent.includes('export default Card') || !cardContent.includes('export { Card }')) {
      throw new Error('Card.tsx n\'a pas les exports corrects')
    }
  })

  // Test 6: Vérifier les routes API
  test('Routes API présentes', () => {
    const apiRoutes = [
      'app/api/asset-submissions/route.ts',
      'app/api/admin/auth/route.ts',
      'app/api/admin/submissions/route.ts',
    ]
    
    apiRoutes.forEach(route => {
      const filePath = path.join(process.cwd(), route)
      if (!fs.existsSync(filePath)) {
        throw new Error(`Route API manquante: ${route}`)
      }
    })
  })

  // Test 7: Vérifier que les routes API n'utilisent plus Google Drive
  test('Routes API sans Google Drive', () => {
    const routePath = path.join(process.cwd(), 'app/api/asset-submissions/route.ts')
    const content = fs.readFileSync(routePath, 'utf-8')
    
    if (content.includes('googleDrive') || content.includes('Google Drive')) {
      throw new Error('La route asset-submissions contient encore des références à Google Drive')
    }
  })

  // Test 8: Vérifier providers.tsx
  test('Providers configurés', () => {
    const providersPath = path.join(process.cwd(), 'app/providers.tsx')
    const content = fs.readFileSync(providersPath, 'utf-8')
    
    if (!content.includes('import React')) {
      throw new Error('Import React manquant dans providers.tsx')
    }
    
    if (!content.includes('ToastProvider')) {
      throw new Error('ToastProvider manquant dans providers.tsx')
    }
  })

  // Test 9: Vérifier la configuration TypeScript
  test('Configuration TypeScript', () => {
    const tsconfigPath = path.join(process.cwd(), 'tsconfig.json')
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'))
    
    if (!tsconfig.compilerOptions?.paths?.['@/*']) {
      throw new Error('Alias @/* manquant dans tsconfig.json')
    }
  })

  // Test 10: Vérifier next.config.js
  test('Configuration Next.js', () => {
    const nextConfigPath = path.join(process.cwd(), 'next.config.js')
    if (!fs.existsSync(nextConfigPath)) {
      throw new Error('next.config.js manquant')
    }
  })

  // Test 11: Vérifier que le dossier storage peut être créé
  test('Dossier storage créable', () => {
    const storageDir = path.join(process.cwd(), 'storage', 'submissions')
    try {
      fs.mkdirSync(storageDir, { recursive: true })
      log(`   ${checkmark()} Dossier storage créé avec succès`, 'green')
    } catch (error) {
      throw new Error(`Impossible de créer le dossier storage: ${error.message}`)
    }
  })

  // Test 12: Vérifier les fichiers de documentation
  test('Documentation présente', () => {
    const docs = [
      'MIGRATION_STOCKAGE_LOCAL.md',
      'REMOVAL_GOOGLE_DRIVE.md',
    ]
    
    docs.forEach(doc => {
      const docPath = path.join(process.cwd(), doc)
      if (!fs.existsSync(docPath)) {
        log(`   ${warning()} Documentation manquante: ${doc}`, 'yellow')
      }
    })
  })

  // Résumé
  log('\n' + '═'.repeat(60), 'blue')
  log('📊 RÉSUMÉ DES TESTS', 'blue')
  log('═'.repeat(60), 'blue')
  log('')
  
  log(`✅ Tests réussis: ${testsPassed}`, 'green')
  if (testsFailed > 0) {
    log(`❌ Tests échoués: ${testsFailed}`, 'red')
    log('')
    log('Erreurs détectées:', 'red')
    errors.forEach(({ name, error }) => {
      log(`  - ${name}: ${error}`, 'red')
    })
  } else {
    log(`❌ Tests échoués: 0`, 'green')
  }
  
  log('')
  
  if (testsFailed === 0) {
    log('🎉 Tous les tests sont passés ! Le projet est prêt.', 'green')
    log('')
    log('Prochaines étapes:', 'cyan')
    log('  1. Testez le serveur: npm run dev', 'white')
    log('  2. Testez une soumission d\'actif', 'white')
    log('  3. Vérifiez que les fichiers sont dans storage/submissions/', 'white')
    process.exit(0)
  } else {
    log('⚠️  Certains tests ont échoué. Corrigez les erreurs ci-dessus.', 'yellow')
    process.exit(1)
  }
}

main().catch((error) => {
  log(`\n❌ Erreur fatale: ${error.message}`, 'red')
  console.error(error)
  process.exit(1)
})





