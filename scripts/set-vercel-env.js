#!/usr/bin/env node

/**
 * Set Vercel Environment Variables directly
 * This script uses Vercel CLI to set environment variables
 */

const { execSync } = require('child_process')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

function setEnvVar(name, value, env = 'production') {
  try {
    console.log(`Setting ${name} for ${env}...`)
    execSync(`echo "${value}" | vercel env add ${name} ${env}`, { 
      stdio: 'inherit',
      shell: '/bin/bash'
    })
    console.log(`✓ ${name} set for ${env}\n`)
    return true
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log(`⚠️  ${name} already exists for ${env}, updating...`)
      try {
        execSync(`vercel env rm ${name} ${env} --yes`, { stdio: 'pipe' })
        execSync(`echo "${value}" | vercel env add ${name} ${env}`, { 
          stdio: 'inherit',
          shell: '/bin/bash'
        })
        console.log(`✓ ${name} updated for ${env}\n`)
        return true
      } catch (updateError) {
        console.error(`✗ Failed to update ${name}: ${updateError.message}\n`)
        return false
      }
    }
    console.error(`✗ Failed to set ${name}: ${error.message}\n`)
    return false
  }
}

async function main() {
  console.log('\n🔧 Vercel Environment Variables Setup\n')
  console.log('This script will help you configure environment variables in Vercel.\n')
  
  const vars = {}
  
  // Google Drive Configuration
  console.log('📁 Google Drive Configuration:')
  vars.GOOGLE_SERVICE_ACCOUNT_EMAIL = await question('Google Service Account Email: ')
  vars.GOOGLE_PRIVATE_KEY = await question('Google Private Key (full key with BEGIN/END): ')
  vars.GOOGLE_DRIVE_FOLDER_ID = await question('Google Drive Folder ID: ')
  console.log('')
  
  // Admin Authentication
  console.log('🔐 Admin Authentication:')
  vars.ADMIN_PASSWORD_HASH = await question('Admin Password Hash (bcrypt): ')
  vars.ADMIN_SESSION_SECRET = await question('Admin Session Secret (random string): ')
  console.log('')
  
  // Node Environment
  vars.NODE_ENV = 'production'
  
  // Confirm
  console.log('\n📋 Summary:')
  console.log(`- GOOGLE_SERVICE_ACCOUNT_EMAIL: ${vars.GOOGLE_SERVICE_ACCOUNT_EMAIL.substring(0, 30)}...`)
  console.log(`- GOOGLE_PRIVATE_KEY: ${vars.GOOGLE_PRIVATE_KEY.substring(0, 30)}...`)
  console.log(`- GOOGLE_DRIVE_FOLDER_ID: ${vars.GOOGLE_DRIVE_FOLDER_ID}`)
  console.log(`- ADMIN_PASSWORD_HASH: ${vars.ADMIN_PASSWORD_HASH.substring(0, 30)}...`)
  console.log(`- ADMIN_SESSION_SECRET: ${vars.ADMIN_SESSION_SECRET.substring(0, 30)}...`)
  console.log(`- NODE_ENV: ${vars.NODE_ENV}`)
  
  const confirm = await question('\n✅ Proceed with setting these variables in Vercel? (yes/no): ')
  
  if (confirm.toLowerCase() !== 'yes' && confirm.toLowerCase() !== 'y') {
    console.log('❌ Cancelled.')
    rl.close()
    return
  }
  
  console.log('\n📝 Setting environment variables...\n')
  
  const environments = ['production', 'preview', 'development']
  
  for (const env of environments) {
    console.log(`\n🌍 Setting variables for ${env} environment:`)
    console.log('─'.repeat(50))
    
    for (const [key, value] of Object.entries(vars)) {
      setEnvVar(key, value, env)
    }
  }
  
  console.log('\n✅ All environment variables configured!')
  console.log('\n📝 To verify, run: vercel env ls')
  
  rl.close()
}

main().catch(error => {
  console.error(`\n❌ Error: ${error.message}`)
  rl.close()
  process.exit(1)
})


