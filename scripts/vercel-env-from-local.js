#!/usr/bin/env node

/**
 * Configure Vercel environment variables from .env.local
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// Read .env.local
const envPath = path.join(__dirname, '..', '.env.local')
if (!fs.existsSync(envPath)) {
  console.error('❌ .env.local file not found')
  process.exit(1)
}

const envContent = fs.readFileSync(envPath, 'utf8')
const envVars = {}

// Parse .env.local
envContent.split('\n').forEach(line => {
  line = line.trim()
  if (line && !line.startsWith('#')) {
    const [key, ...valueParts] = line.split('=')
    if (key && valueParts.length > 0) {
      let value = valueParts.join('=')
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }
      // Replace \n with actual newlines
      value = value.replace(/\\n/g, '\n')
      envVars[key.trim()] = value
    }
  }
})

const requiredVars = [
  'GOOGLE_SERVICE_ACCOUNT_EMAIL',
  'GOOGLE_PRIVATE_KEY',
  'GOOGLE_DRIVE_FOLDER_ID',
  'ADMIN_PASSWORD_HASH',
  'ADMIN_SESSION_SECRET',
]

console.log('\n🔧 Configuring Vercel Environment Variables from .env.local\n')

// Check all required vars are present
for (const varName of requiredVars) {
  if (!envVars[varName]) {
    console.error(`❌ Missing required variable: ${varName}`)
    process.exit(1)
  }
}

// Set NODE_ENV
envVars.NODE_ENV = envVars.NODE_ENV || 'production'

const environments = ['production', 'preview', 'development']

for (const env of environments) {
  console.log(`\n🌍 Setting variables for ${env} environment:`)
  console.log('─'.repeat(50))
  
  for (const [key, value] of Object.entries(envVars)) {
    if (!requiredVars.includes(key) && key !== 'NODE_ENV') continue
    
    try {
      console.log(`Setting ${key}...`)
      
      // Check if variable already exists
      try {
        execSync(`vercel env rm ${key} ${env} --yes`, { 
          stdio: 'pipe',
          encoding: 'utf8'
        })
      } catch {
        // Variable doesn't exist, that's fine
      }
      
      // Set the variable
      const command = `echo "${value.replace(/"/g, '\\"')}" | vercel env add ${key} ${env}`
      execSync(command, { 
        stdio: 'inherit',
        shell: '/bin/bash',
        encoding: 'utf8'
      })
      
      console.log(`✓ ${key} set for ${env}\n`)
    } catch (error) {
      console.error(`✗ Failed to set ${key} for ${env}: ${error.message}\n`)
    }
  }
}

console.log('\n✅ All environment variables configured in Vercel!')
console.log('\n📝 To verify, run: vercel env ls')





