#!/usr/bin/env node

/**
 * Script de vérification de la préparation pour Vercel
 * Vérifie que tous les composants UI sont correctement exportés et trackés par Git
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const UI_COMPONENTS_DIR = path.join(process.cwd(), 'components/ui')
const REQUIRED_COMPONENTS = [
  'Button.tsx',
  'Card.tsx',
  'ToastProvider.tsx',
  'Badge.tsx',
  'Grid.tsx',
  'Section.tsx',
  'SeeMore.tsx',
  'Sidebar.tsx',
  'Skeleton.tsx',
  'StatCard.tsx',
  'ThemeToggle.tsx',
  'Toast.tsx',
  'index.ts'
]

const IMPORT_PATTERNS = [
  /@\/components\/ui\/(Button|Card)/g,
  /from ['"]@\/components\/ui\/Button['"]/g,
  /from ['"]@\/components\/ui\/Card['"]/g,
]

let errors = []
let warnings = []

console.log('🔍 Vérification de la préparation pour Vercel...\n')

// 1. Vérifier que tous les composants UI existent
console.log('1️⃣  Vérification des fichiers UI...')
REQUIRED_COMPONENTS.forEach(component => {
  const filePath = path.join(UI_COMPONENTS_DIR, component)
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${component}`)
  } else {
    errors.push(`   ❌ ${component} est manquant`)
    console.log(`   ❌ ${component} est manquant`)
  }
})

// 2. Vérifier que tous les composants sont trackés par Git
console.log('\n2️⃣  Vérification du tracking Git...')
try {
  const trackedFiles = execSync(
    `git ls-files ${UI_COMPONENTS_DIR}/*.tsx ${UI_COMPONENTS_DIR}/*.ts`,
    { encoding: 'utf-8', cwd: path.join(__dirname, '../..') }
  ).trim().split('\n').filter(Boolean)

  REQUIRED_COMPONENTS.forEach(component => {
    const relativePath = `components/ui/${component}`
    if (trackedFiles.some(file => file.includes(component))) {
      console.log(`   ✅ ${component} est tracké`)
    } else {
      errors.push(`   ❌ ${component} n'est pas tracké par Git`)
      console.log(`   ❌ ${component} n'est pas tracké par Git`)
    }
  })
} catch (error) {
  warnings.push('Impossible de vérifier le tracking Git')
  console.log('   ⚠️  Impossible de vérifier le tracking Git')
}

// 3. Vérifier les exports dans index.ts
console.log('\n3️⃣  Vérification des exports dans index.ts...')
const indexPath = path.join(UI_COMPONENTS_DIR, 'index.ts')
if (fs.existsSync(indexPath)) {
  const indexContent = fs.readFileSync(indexPath, 'utf-8')
  const hasButton = indexContent.includes('Button')
  const hasCard = indexContent.includes('Card')
  const hasToastProvider = indexContent.includes('ToastProvider')
  
  if (hasButton && hasCard && hasToastProvider) {
    console.log('   ✅ Exports Button, Card et ToastProvider présents dans index.ts')
  } else {
    if (!hasButton) errors.push('Button manquant dans index.ts')
    if (!hasCard) errors.push('Card manquant dans index.ts')
    if (!hasToastProvider) errors.push('ToastProvider manquant dans index.ts')
  }
} else {
  errors.push('index.ts n\'existe pas')
}

// 4. Vérifier que Button.tsx et Card.tsx ont des exports corrects
console.log('\n4️⃣  Vérification des exports des composants...')
const buttonPath = path.join(UI_COMPONENTS_DIR, 'Button.tsx')
const cardPath = path.join(UI_COMPONENTS_DIR, 'Card.tsx')

if (fs.existsSync(buttonPath)) {
  const buttonContent = fs.readFileSync(buttonPath, 'utf-8')
  const hasDefaultExport = buttonContent.includes('export default')
  const hasNamedExport = buttonContent.includes('export { Button }')
  
  if (hasDefaultExport && hasNamedExport) {
    console.log('   ✅ Button.tsx a les exports par défaut et nommé')
  } else {
    warnings.push('Button.tsx pourrait avoir des exports incomplets')
    console.log('   ⚠️  Button.tsx devrait avoir export default et export { Button }')
  }
}

if (fs.existsSync(cardPath)) {
  const cardContent = fs.readFileSync(cardPath, 'utf-8')
  const hasDefaultExport = cardContent.includes('export default')
  const hasNamedExport = cardContent.includes('export { Card }')
  
  if (hasDefaultExport && hasNamedExport) {
    console.log('   ✅ Card.tsx a les exports par défaut et nommé')
  } else {
    warnings.push('Card.tsx pourrait avoir des exports incomplets')
    console.log('   ⚠️  Card.tsx devrait avoir export default et export { Card }')
  }
}

// 5. Vérifier tsconfig.json
console.log('\n5️⃣  Vérification de la configuration TypeScript...')
const tsconfigPath = path.join(__dirname, '../../tsconfig.json')
if (fs.existsSync(tsconfigPath)) {
  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'))
  if (tsconfig.compilerOptions?.paths?.['@/*']) {
    console.log('   ✅ Alias @/* configuré dans tsconfig.json')
  } else {
    errors.push('Alias @/* manquant dans tsconfig.json')
  }
  
  if (tsconfig.compilerOptions?.forceConsistentCasingInFileNames) {
    console.log('   ✅ forceConsistentCasingInFileNames est activé')
  } else {
    warnings.push('forceConsistentCasingInFileNames devrait être activé')
  }
}

// Résumé
console.log('\n' + '='.repeat(60))
console.log('📊 RÉSUMÉ')
console.log('='.repeat(60))

if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ Tous les contrôles sont passés ! Le projet est prêt pour Vercel.')
  process.exit(0)
} else {
  if (errors.length > 0) {
    console.log(`\n❌ ERREURS (${errors.length}):`)
    errors.forEach(err => console.log(`   ${err}`))
  }
  
  if (warnings.length > 0) {
    console.log(`\n⚠️  AVERTISSEMENTS (${warnings.length}):`)
    warnings.forEach(warn => console.log(`   ${warn}`))
  }
  
  console.log('\n⚠️  Des problèmes ont été détectés. Corrigez-les avant de déployer sur Vercel.')
  process.exit(errors.length > 0 ? 1 : 0)
}

