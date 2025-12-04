/**
 * Auto-execute SQL by opening Chrome and preparing clipboard
 */

const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')

const sqlFile = path.join(__dirname, '..', 'EXECUTE-NOW.sql')
const sqlContent = fs.readFileSync(sqlFile, 'utf-8')

// Open Chrome with Supabase
const chromeCommand = `open -a "Google Chrome" "https://supabase.com/dashboard/project/ipamfhfzflprptchlaei/sql/new"`

console.log('\n🚀 Opening Supabase in Chrome...\n')

exec(chromeCommand, (error, stdout, stderr) => {
  if (error) {
    console.error(`❌ Error: ${error.message}`)
    return
  }

  console.log('✅ Chrome opened!\n')
  console.log('📋 SQL content ready to copy:\n')
  console.log('='.repeat(60))
  console.log(sqlContent.substring(0, 500) + '...')
  console.log('='.repeat(60))
  console.log('\n📝 Instructions:')
  console.log('   1. Wait for Supabase to load')
  console.log('   2. Make sure you\'re logged in')
  console.log('   3. Copy the entire content from: EXECUTE-NOW.sql')
  console.log('   4. Paste in the SQL Editor')
  console.log('   5. Click "Run" (or Cmd/Ctrl + Enter)')
  console.log('   6. Wait for "Success" message')
  console.log('\n✅ After execution, run: npm run setup:marketing\n')
})

