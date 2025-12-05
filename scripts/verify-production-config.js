#!/usr/bin/env node

/**
 * Script de vérification de la configuration production
 * Vérifie toutes les variables d'environnement et teste la connexion Google Drive
 */

const { google } = require('googleapis')
const fs = require('fs')
const path = require('path')

// Couleurs pour la console
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
  return `${colors.green}✓${colors.reset}`
}

function cross() {
  return `${colors.red}✗${colors.reset}`
}

function warning() {
  return `${colors.yellow}⚠${colors.reset}`
}

// Charger les variables d'environnement
require('dotenv').config({ path: path.join(process.cwd(), '.env.local') })

const checks = {
  googleDrive: {
    serviceAccount: false,
    oauth: false,
    folderId: false,
  },
  admin: {
    passwordHash: false,
    sessionSecret: false,
  },
  nextjs: {
    nodeEnv: false,
    appUrl: false,
  },
}

let errors = []
let warnings = []

log('\n🔍 Vérification de la configuration production\n', 'cyan')

// 1. Vérification Google Drive - Service Account
log('📁 Google Drive Configuration:', 'blue')
const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL

if (privateKey && clientEmail) {
  if (privateKey.includes('BEGIN PRIVATE KEY') && privateKey.includes('END PRIVATE KEY')) {
    checks.googleDrive.serviceAccount = true
    log(`  ${checkmark()} Service Account configuré`, 'green')
  } else {
    errors.push('GOOGLE_PRIVATE_KEY doit contenir la clé complète avec BEGIN/END PRIVATE KEY')
    log(`  ${cross()} GOOGLE_PRIVATE_KEY invalide`, 'red')
  }
} else {
  warnings.push('Service Account non configuré - OAuth sera utilisé si configuré')
  log(`  ${warning()} Service Account non configuré`, 'yellow')
}

// 2. Vérification Google Drive - OAuth
const clientId = process.env.GOOGLE_CLIENT_ID
const clientSecret = process.env.GOOGLE_CLIENT_SECRET
const refreshToken = process.env.GOOGLE_REFRESH_TOKEN

if (clientId && clientSecret && refreshToken) {
  checks.googleDrive.oauth = true
  log(`  ${checkmark()} OAuth configuré`, 'green')
} else if (!checks.googleDrive.serviceAccount) {
  errors.push('Aucune méthode d\'authentification Google Drive configurée (Service Account ou OAuth requis)')
  log(`  ${cross()} OAuth non configuré`, 'red')
}

// 3. Vérification Folder ID
const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID
if (folderId && folderId.length > 0) {
  checks.googleDrive.folderId = true
  log(`  ${checkmark()} GOOGLE_DRIVE_FOLDER_ID configuré`, 'green')
} else {
  errors.push('GOOGLE_DRIVE_FOLDER_ID est requis')
  log(`  ${cross()} GOOGLE_DRIVE_FOLDER_ID manquant`, 'red')
}

// 4. Vérification Admin
log('\n🔐 Admin Authentication:', 'blue')
const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH
if (adminPasswordHash && adminPasswordHash.length > 0) {
  checks.admin.passwordHash = true
  log(`  ${checkmark()} ADMIN_PASSWORD_HASH configuré`, 'green')
} else {
  errors.push('ADMIN_PASSWORD_HASH est requis')
  log(`  ${cross()} ADMIN_PASSWORD_HASH manquant`, 'red')
}

const adminSessionSecret = process.env.ADMIN_SESSION_SECRET
if (adminSessionSecret && adminSessionSecret.length >= 32) {
  checks.admin.sessionSecret = true
  log(`  ${checkmark()} ADMIN_SESSION_SECRET configuré (longueur: ${adminSessionSecret.length})`, 'green')
} else {
  errors.push('ADMIN_SESSION_SECRET doit faire au moins 32 caractères')
  log(`  ${cross()} ADMIN_SESSION_SECRET invalide ou trop court`, 'red')
}

// 5. Vérification Next.js
log('\n⚙️  Next.js Configuration:', 'blue')
const nodeEnv = process.env.NODE_ENV
if (nodeEnv === 'production') {
  checks.nextjs.nodeEnv = true
  log(`  ${checkmark()} NODE_ENV=production`, 'green')
} else {
  warnings.push(`NODE_ENV=${nodeEnv || 'non défini'} - devrait être 'production' en production`)
  log(`  ${warning()} NODE_ENV=${nodeEnv || 'non défini'}`, 'yellow')
}

const appUrl = process.env.NEXT_PUBLIC_APP_URL
if (appUrl) {
  checks.nextjs.appUrl = true
  log(`  ${checkmark()} NEXT_PUBLIC_APP_URL=${appUrl}`, 'green')
} else {
  warnings.push('NEXT_PUBLIC_APP_URL non défini - OAuth redirect URI utilisera la valeur par défaut')
  log(`  ${warning()} NEXT_PUBLIC_APP_URL non défini`, 'yellow')
}

// 6. Test de connexion Google Drive
log('\n🧪 Test de connexion Google Drive:', 'blue')

async function testGoogleDriveConnection() {
  try {
    let auth
    
    // Essayer Service Account d'abord
    if (privateKey && clientEmail) {
      auth = new google.auth.JWT({
        email: clientEmail,
        key: privateKey,
        scopes: ['https://www.googleapis.com/auth/drive'],
      })
    } else if (clientId && clientSecret && refreshToken) {
      const redirectUri = process.env.GOOGLE_REDIRECT_URI || 
        (nodeEnv === 'production' 
          ? appUrl || 'https://your-domain.com'
          : 'http://localhost:1001')
      
      const oauth2Client = new google.auth.OAuth2(
        clientId,
        clientSecret,
        redirectUri
      )
      
      oauth2Client.setCredentials({
        refresh_token: refreshToken
      })
      
      auth = oauth2Client
    } else {
      log(`  ${cross()} Impossible de tester - aucune authentification configurée`, 'red')
      return false
    }

    const drive = google.drive({ version: 'v3', auth })
    
    // Tester l'accès au dossier
    if (folderId) {
      try {
        const folder = await drive.files.get({
          fileId: folderId,
          fields: 'id, name, mimeType',
        })
        
        if (folder.data.mimeType === 'application/vnd.google-apps.folder') {
          log(`  ${checkmark()} Connexion réussie - Dossier trouvé: "${folder.data.name}"`, 'green')
          return true
        } else {
          log(`  ${cross()} L'ID fourni n'est pas un dossier`, 'red')
          errors.push(`GOOGLE_DRIVE_FOLDER_ID pointe vers un fichier, pas un dossier`)
          return false
        }
      } catch (error) {
        if (error.code === 404) {
          log(`  ${cross()} Dossier non trouvé - Vérifiez que le dossier existe et est partagé avec le Service Account`, 'red')
          errors.push('Le dossier Google Drive n\'existe pas ou n\'est pas accessible')
        } else if (error.code === 403) {
          log(`  ${cross()} Permission refusée - Vérifiez que le Service Account a accès au dossier`, 'red')
          errors.push('Permission refusée - Le Service Account n\'a pas accès au dossier')
        } else {
          log(`  ${cross()} Erreur: ${error.message}`, 'red')
          errors.push(`Erreur Google Drive: ${error.message}`)
        }
        return false
      }
    } else {
      log(`  ${warning()} Impossible de tester le dossier - GOOGLE_DRIVE_FOLDER_ID manquant`, 'yellow')
      return false
    }
  } catch (error) {
    log(`  ${cross()} Erreur de connexion: ${error.message}`, 'red')
    errors.push(`Erreur de connexion Google Drive: ${error.message}`)
    return false
  }
}

// Résumé
async function printSummary() {
  const connectionOk = await testGoogleDriveConnection()
  
  log('\n' + '='.repeat(60), 'cyan')
  log('📊 Résumé de la vérification', 'cyan')
  log('='.repeat(60) + '\n', 'cyan')

  const allChecks = [
    checks.googleDrive.serviceAccount || checks.googleDrive.oauth,
    checks.googleDrive.folderId,
    checks.admin.passwordHash,
    checks.admin.sessionSecret,
    checks.nextjs.nodeEnv,
  ]

  const allPassed = allChecks.every(check => check) && connectionOk && errors.length === 0

  if (allPassed) {
    log('✅ Configuration production VALIDE', 'green')
    log('\nToutes les vérifications sont passées. Votre application est prête pour la production !\n', 'green')
  } else {
    log('❌ Configuration production INCOMPLÈTE', 'red')
    
    if (errors.length > 0) {
      log('\n🔴 Erreurs critiques:', 'red')
      errors.forEach((error, index) => {
        log(`  ${index + 1}. ${error}`, 'red')
      })
    }
    
    if (warnings.length > 0) {
      log('\n🟡 Avertissements:', 'yellow')
      warnings.forEach((warning, index) => {
        log(`  ${index + 1}. ${warning}`, 'yellow')
      })
    }
    
    log('\n📖 Consultez PRODUCTION_SETUP.md pour les instructions de configuration.\n', 'blue')
  }

  return allPassed ? 0 : 1
}

// Exécuter la vérification
printSummary()
  .then(exitCode => {
    process.exit(exitCode)
  })
  .catch(error => {
    log(`\n❌ Erreur fatale: ${error.message}`, 'red')
    console.error(error)
    process.exit(1)
  })






