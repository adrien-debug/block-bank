/**
 * Test creating a Facebook account via API
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function testCreateAccount() {
  console.log('\n🧪 Testing Facebook Account Creation\n')
  console.log('='.repeat(60))

  // Test data
  const testAccount = {
    network: 'facebook',
    username: '@blockbank',
    url: 'https://facebook.com/blockbank',
    status: 'connected',
    followers: 5000
  }

  console.log('📝 Test account data:')
  console.log(JSON.stringify(testAccount, null, 2))
  console.log()

  // Check if account exists
  const { data: existing } = await supabase
    .from('marketing_social_accounts')
    .select('*')
    .eq('network', 'facebook')
    .single()

  if (existing) {
    console.log('✅ Facebook account already exists')
    console.log('   Updating...')
    
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
      console.log(`❌ Error updating: ${error.message}`)
      return false
    }

    console.log('✅ Account updated successfully!')
    console.log('   Data:', JSON.stringify(data, null, 2))
    return true
  } else {
    console.log('📝 Creating new Facebook account...')
    
    const { data, error } = await supabase
      .from('marketing_social_accounts')
      .insert({
        network: testAccount.network,
        username: testAccount.username,
        url: testAccount.url,
        status: testAccount.status,
        followers: testAccount.followers
      })
      .select()
      .single()

    if (error) {
      console.log(`❌ Error creating: ${error.message}`)
      return false
    }

    console.log('✅ Account created successfully!')
    console.log('   Data:', JSON.stringify(data, null, 2))
    return true
  }
}

async function testReadAccount() {
  console.log('\n📖 Testing Account Retrieval\n')
  
  const { data, error } = await supabase
    .from('marketing_social_accounts')
    .select('*')
    .eq('network', 'facebook')
    .single()

  if (error) {
    console.log(`❌ Error reading: ${error.message}`)
    return false
  }

  console.log('✅ Account retrieved:')
  console.log(JSON.stringify(data, null, 2))
  return true
}

async function main() {
  try {
    // Test 1: Create/Update account
    const createResult = await testCreateAccount()
    
    // Test 2: Read account
    const readResult = await testReadAccount()

    console.log('\n' + '='.repeat(60))
    if (createResult && readResult) {
      console.log('✅ ALL TESTS PASSED!')
      console.log('\nYour Facebook account is now in the database.')
      console.log('You can see it at: /admin/marketing (Overview tab)')
    } else {
      console.log('⚠️  Some tests failed')
    }
    console.log('='.repeat(60) + '\n')
  } catch (error) {
    console.error('\n❌ Fatal error:', error.message)
    process.exit(1)
  }
}

main()

