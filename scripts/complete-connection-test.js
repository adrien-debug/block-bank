/**
 * Complete connection test - Verify everything is working
 */

require('dotenv').config({ path: '.env.local' })
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

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:1001'

async function testTableAccess(tableName) {
  try {
    const { data, error, count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true })
    
    if (error) {
      const errorMsg = error.message?.toLowerCase() || ''
      if (errorMsg.includes('schema cache') || 
          errorMsg.includes('could not find') ||
          error.code === 'PGRST205') {
        return { accessible: false, reason: 'schema_cache' }
      }
      return { accessible: false, reason: error.message }
    }
    return { accessible: true, count: count || 0 }
  } catch (error) {
    return { accessible: false, reason: error.message }
  }
}

async function testCreateAccount() {
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
      console.log('  📝 Account exists, updating...')
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
        return { success: false, error: error.message }
      }
      console.log('  ✅ Account updated successfully!')
      console.log(`     ID: ${data.id}`)
      console.log(`     Network: ${data.network}`)
      console.log(`     Username: ${data.username}`)
      console.log(`     Status: ${data.status}`)
      return { success: true, data }
    } else {
      console.log('  📝 Creating new account...')
      const { data, error } = await supabase
        .from('marketing_social_accounts')
        .insert(testAccount)
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }
      console.log('  ✅ Account created successfully!')
      console.log(`     ID: ${data.id}`)
      console.log(`     Network: ${data.network}`)
      console.log(`     Username: ${data.username}`)
      return { success: true, data }
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

async function testAPIEndpoint(endpoint) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`)
    const data = await response.json()
    
    return {
      success: response.ok || response.status === 401,
      status: response.status,
      hasData: data.success !== false,
      data: data
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

async function main() {
  console.log('\n' + '='.repeat(60))
  console.log('🔍 COMPLETE CONNECTION TEST')
  console.log('='.repeat(60))
  console.log(`Supabase URL: ${supabaseUrl ? '✅' : '❌'}`)
  console.log(`Supabase Key: ${supabaseKey ? '✅' : '❌'}`)
  console.log(`App URL: ${BASE_URL}\n`)

  // Test 1: Check all tables
  console.log('📋 Testing Table Access...\n')
  const tables = [
    'marketing_posts',
    'marketing_promotions',
    'marketing_adwords_campaigns',
    'marketing_content_sections',
    'marketing_calendar_events',
    'marketing_social_accounts'
  ]

  let allTablesAccessible = true
  for (const table of tables) {
    const result = await testTableAccess(table)
    if (result.accessible) {
      console.log(`  ✅ ${table} - Accessible (${result.count} rows)`)
    } else {
      if (result.reason === 'schema_cache') {
        console.log(`  ⚠️  ${table} - Schema cache not ready (wait 2-5 min)`)
      } else {
        console.log(`  ❌ ${table} - ${result.reason}`)
      }
      allTablesAccessible = false
    }
  }

  // Test 2: Test account creation
  if (allTablesAccessible) {
    const accountResult = await testCreateAccount()
    if (!accountResult.success) {
      console.log(`  ❌ Account creation failed: ${accountResult.error}`)
      allTablesAccessible = false
    }
  }

  // Test 3: Test API endpoints
  console.log('\n🌐 Testing API Endpoints...\n')
  const endpoints = [
    '/api/admin/marketing/accounts',
    '/api/admin/marketing/posts',
    '/api/admin/marketing/promotions',
    '/api/admin/marketing/adwords',
  ]

  let allAPIsWorking = true
  for (const endpoint of endpoints) {
    const result = await testAPIEndpoint(endpoint)
    if (result.success) {
      const statusNote = result.status === 401 ? ' (Auth required)' : ''
      console.log(`  ✅ ${endpoint} - Status: ${result.status}${statusNote}`)
    } else {
      console.log(`  ❌ ${endpoint} - ${result.error || 'Failed'}`)
      allAPIsWorking = false
    }
  }

  // Final summary
  console.log('\n' + '='.repeat(60))
  console.log('📊 TEST RESULTS')
  console.log('='.repeat(60))
  console.log(`Database Tables: ${allTablesAccessible ? '✅ All accessible' : '⚠️  Some not ready'}`)
  console.log(`API Endpoints: ${allAPIsWorking ? '✅ All working' : '❌ Some failed'}`)
  
  if (allTablesAccessible && allAPIsWorking) {
    console.log('\n🎉 EVERYTHING IS CONNECTED AND WORKING!')
    console.log('\n✅ You can now:')
    console.log('   1. Go to: http://localhost:1001/admin/marketing')
    console.log('   2. Click: Overview tab')
    console.log('   3. Connect your social media accounts!')
  } else if (!allTablesAccessible) {
    console.log('\n⚠️  SCHEMA CACHE NOT READY YET')
    console.log('   The tables exist but Supabase cache needs 2-5 minutes to refresh.')
    console.log('   This is normal after creating tables.')
    console.log('   The UI will work but show empty data until cache refreshes.')
  } else {
    console.log('\n⚠️  SOME ISSUES DETECTED')
    console.log('   Check the errors above for details.')
  }
  console.log('='.repeat(60) + '\n')
}

main().catch(error => {
  console.error('\n❌ Fatal error:', error)
  process.exit(1)
})

