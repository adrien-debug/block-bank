#!/usr/bin/env node

/**
 * Configure Vercel Environment Variables
 * This script reads from .env.local and sets variables in Vercel
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function setVercelEnv(varName, value, environment = 'all') {
  const environments = environment === 'all' ? ['production', 'preview', 'development'] : [environment]
  
  for (const env of environments) {
    try {
      log(`Setting ${varName} for ${env}...`, 'blue')
      
      // Use vercel env add command
      const command = `echo "${value}" | vercel env add ${varName} ${env}`
      execSync(command, { 
        stdio: 'pipe',
        encoding: 'utf8',
        shell: '/bin/bash'
      })
      
      log(`✓ ${varName} set for ${env}`, 'green')
    } catch (error) {
      // Check if variable already exists
      if (error.message.includes('already exists') || error.message.includes('already set')) {
        log(`⚠️  ${varName} already exists for ${env}, updating...`, 'yellow')
        try {
          // Try to remove and re-add
          execSync(`vercel env rm ${varName} ${env} --yes`, { stdio: 'pipe' })
          execSync(`echo "${value}" | vercel env add ${varName} ${env}`, { 
            stdio: 'pipe',
            shell: '/bin/bash'
          })
          log(`✓ ${varName} updated for ${env}`, 'green')
        } catch (updateError) {
          log(`✗ Failed to update ${varName} for ${env}: ${updateError.message}`, 'red')
        }
      } else {
        log(`✗ Failed to set ${varName} for ${env}: ${error.message}`, 'red')
      }
    }
  }
}

async function main() {
  log('\n🔧 Configuring Vercel Environment Variables\n', 'yellow')
  
  // Check if .env.local exists
  const envPath = path.join(__dirname, '..', '.env.local')
  if (!fs.existsSync(envPath)) {
    log('❌ Error: .env.local file not found', 'red')
    log('Please create .env.local with your environment variables first', 'yellow')
    log('You can use env.example as a template', 'yellow')
    process.exit(1)
  }
  
  // Required variables
  const requiredVars = [
    'GOOGLE_SERVICE_ACCOUNT_EMAIL',
    'GOOGLE_PRIVATE_KEY',
    'GOOGLE_DRIVE_FOLDER_ID',
    'ADMIN_PASSWORD_HASH',
    'ADMIN_SESSION_SECRET',
  ]
  
  const optionalVars = [
    'NODE_ENV',
  ]
  
  log('📋 Checking required variables...\n', 'blue')
  
  // Check required variables
  for (const varName of requiredVars) {
    const value = process.env[varName]
    if (!value) {
      log(`❌ Error: ${varName} is not set in .env.local`, 'red')
      log('Please set all required variables before running this script', 'yellow')
      process.exit(1)
    }
  }
  
  log('✓ All required variables found\n', 'green')
  log('📝 Setting environment variables in Vercel...\n', 'blue')
  
  // Set required variables
  for (const varName of requiredVars) {
    const value = process.env[varName]
    if (value) {
      setVercelEnv(varName, value)
      console.log('') // Empty line for readability
    }
  }
  
  // Set optional variables
  for (const varName of optionalVars) {
    const value = process.env[varName] || 'production'
    setVercelEnv(varName, value)
    console.log('')
  }
  
  log('\n✅ Environment variables configuration complete!', 'green')
  log('\n📝 To verify, run: vercel env ls', 'blue')
  log('📝 To view a specific variable: vercel env pull', 'blue')
}

main().catch(error => {
  log(`\n❌ Error: ${error.message}`, 'red')
  process.exit(1)
})





