/**
 * Complete Marketing Setup Script
 * Creates all tables and tests functionality
 */

require('dotenv').config({ path: '.env.local' })
const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Read SQL schema
const schemaPath = path.join(__dirname, '..', 'supabase-marketing-schema.sql')
const sqlSchema = fs.readFileSync(schemaPath, 'utf-8')

async function executeSQLInSupabase() {
  console.log('\n🚀 Setting up Marketing Tables in Supabase\n')
  console.log('='.repeat(60))

  // Extract project reference
  const projectMatch = supabaseUrl.match(/https?:\/\/([^.]+)\.supabase\.co/)
  const projectRef = projectMatch ? projectMatch[1] : null

  if (!projectRef) {
    console.error('❌ Could not extract project reference')
    return false
  }

  console.log(`📋 Project: ${projectRef}`)
  console.log(`📋 Supabase URL: ${supabaseUrl}\n`)

  // Since Supabase JS client doesn't support DDL execution,
  // we'll use the Management API or provide clear instructions
  
  console.log('📝 SQL Execution Required\n')
  console.log('Supabase requires SQL execution via Dashboard or Management API.')
  console.log('Here are your options:\n')
  
  console.log('OPTION 1: Via Supabase Dashboard (Recommended)')
  console.log('  1. Go to: https://supabase.com/dashboard/project/' + projectRef)
  console.log('  2. Click: SQL Editor (left sidebar)')
  console.log('  3. Click: New Query')
  console.log('  4. Copy ALL content from: supabase-marketing-schema.sql')
  console.log('  5. Paste and click: Run (or Cmd/Ctrl + Enter)')
  console.log('  6. Wait for "Success" message\n')

  console.log('OPTION 2: Via Supabase CLI (if installed)')
  console.log('  supabase db execute --file supabase-marketing-schema.sql\n')

  // Create a ready-to-use SQL file
  const outputPath = path.join(__dirname, '..', 'EXECUTE-THIS-IN-SUPABASE.sql')
  fs.writeFileSync(outputPath, sqlSchema)
  console.log(`✅ SQL file ready: ${path.basename(outputPath)}`)
  console.log(`   Copy this file content and paste in Supabase SQL Editor\n`)

  return { needsManual: true, sqlFile: outputPath }
}

async function verifyAndTest() {
  console.log('🔍 Verifying setup...\n')

  const tables = [
    'marketing_posts',
    'marketing_promotions',
    'marketing_adwords_campaigns',
    'marketing_content_sections',
    'marketing_calendar_events',
    'marketing_social_accounts'
  ]

  let allExist = true
  const results = {}

  for (const table of tables) {
    try {
      // Use a simple count query to verify table exists
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })

      if (error) {
        const errorMsg = error.message?.toLowerCase() || ''
        if (errorMsg.includes('does not exist') || 
            errorMsg.includes('schema cache') ||
            errorMsg.includes('could not find')) {
          results[table] = { exists: false }
          allExist = false
          console.log(`  ❌ ${table} - Does not exist`)
        } else {
          // Other error might mean table exists but has issues
          results[table] = { exists: true, error: error.message }
          console.log(`  ⚠️  ${table} - Exists but has issues: ${error.message}`)
        }
      } else {
        results[table] = { exists: true, count: count || 0 }
        console.log(`  ✅ ${table} - Exists (${count || 0} rows)`)
      }
    } catch (error) {
      results[table] = { exists: false, error: error.message }
      allExist = false
      console.log(`  ❌ ${table} - Error: ${error.message}`)
    }
  }

  return { allExist, results }
}

async function testAccountCreation() {
  console.log('\n🧪 Testing account creation...\n')

  const testAccount = {
    network: 'facebook',
    username: '@blockbank',
    url: 'https://facebook.com/blockbank',
    status: 'connected',
    followers: 5000
  }

  try {
    // Check if exists
    const { data: existing } = await supabase
      .from('marketing_social_accounts')
      .select('*')
      .eq('network', 'facebook')
      .single()

    if (existing) {
      console.log('  📝 Facebook account exists, updating...')
      const { data, error } = await supabase
        .from('marketing_social_accounts')
        .update({
          username: testAccount.username,
          url: testAccount.url,
          status: testAccount.status,
          followers: testAccount.followers,
          updated_at: new Date().toISOString()
        })
        .eq('network', 'facebook')
        .select()
        .single()

      if (error) {
        console.log(`  ❌ Update failed: ${error.message}`)
        return false
      }
      console.log('  ✅ Account updated successfully!')
      return true
    } else {
      console.log('  📝 Creating Facebook account...')
      const { data, error } = await supabase
        .from('marketing_social_accounts')
        .insert(testAccount)
        .select()
        .single()

      if (error) {
        console.log(`  ❌ Creation failed: ${error.message}`)
        return false
      }
      console.log('  ✅ Account created successfully!')
      return true
    }
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`)
    return false
  }
}

async function main() {
  console.log('\n' + '='.repeat(60))
  console.log('🚀 COMPLETE MARKETING SETUP')
  console.log('='.repeat(60))

  // Step 1: Check current state
  const { allExist, results } = await verifyAndTest()

  if (!allExist) {
    console.log('\n⚠️  Some tables are missing. Setting up...\n')
    const setupResult = await executeSQLInSupabase()
    
    if (setupResult.needsManual) {
      console.log('\n' + '='.repeat(60))
      console.log('📝 ACTION REQUIRED')
      console.log('='.repeat(60))
      console.log('\nPlease execute the SQL in Supabase Dashboard, then run:')
      console.log('  npm run verify:marketing\n')
      return
    }
  }

  // Step 2: Test account creation (3 times)
  if (allExist) {
    console.log('\n🧪 Testing account creation (3 iterations)...\n')
    
    let allTestsPassed = true
    for (let i = 1; i <= 3; i++) {
      console.log(`\n--- Test Iteration #${i} ---`)
      const passed = await testAccountCreation()
      if (!passed) allTestsPassed = false
      
      if (i < 3) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    console.log('\n' + '='.repeat(60))
    if (allTestsPassed) {
      console.log('✅ SETUP COMPLETE - ALL TESTS PASSED!')
      console.log('\nYou can now:')
      console.log('  1. Go to: http://localhost:1001/admin/marketing')
      console.log('  2. Click on "Overview" tab')
      console.log('  3. See your Facebook account connected!')
    } else {
      console.log('⚠️  Some tests failed')
      console.log('   Please check the errors above')
    }
    console.log('='.repeat(60) + '\n')
  }
}

main().catch(error => {
  console.error('\n❌ Fatal error:', error)
  process.exit(1)
})

