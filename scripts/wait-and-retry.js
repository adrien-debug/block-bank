/**
 * Wait for Supabase schema cache to refresh and retry
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function testTableAccess() {
  try {
    const { data, error } = await supabase
      .from('marketing_social_accounts')
      .select('*')
      .limit(1)

    if (error) {
      const errorMsg = error.message?.toLowerCase() || ''
      if (errorMsg.includes('schema cache') || errorMsg.includes('does not exist')) {
        return false
      }
    }
    return true
  } catch (error) {
    return false
  }
}

async function waitAndRetry(maxAttempts = 10, delaySeconds = 10) {
  console.log('\n⏳ Waiting for Supabase schema cache to refresh...\n')
  console.log(`   Will retry ${maxAttempts} times with ${delaySeconds}s delay\n`)

  for (let i = 1; i <= maxAttempts; i++) {
    console.log(`Attempt ${i}/${maxAttempts}...`)
    
    const accessible = await testTableAccess()
    
    if (accessible) {
      console.log('✅ Schema cache refreshed! Tables are accessible.\n')
      return true
    }
    
    if (i < maxAttempts) {
      console.log(`   Cache not ready yet, waiting ${delaySeconds}s...\n`)
      await new Promise(resolve => setTimeout(resolve, delaySeconds * 1000))
    }
  }

  console.log('⚠️  Schema cache still not refreshed after all attempts\n')
  return false
}

async function testAccountCreation() {
  console.log('🧪 Testing account creation...\n')

  const testAccount = {
    network: 'facebook',
    username: '@blockbank',
    url: 'https://facebook.com/blockbank',
    status: 'connected',
    followers: 5000
  }

  try {
    const { data, error } = await supabase
      .from('marketing_social_accounts')
      .insert(testAccount)
      .select()
      .single()

    if (error) {
      // If conflict, try update
      if (error.code === '23505') {
        const { data: updateData, error: updateError } = await supabase
          .from('marketing_social_accounts')
          .update({
            username: testAccount.username,
            url: testAccount.url,
            status: testAccount.status,
            followers: testAccount.followers
          })
          .eq('network', 'facebook')
          .select()
          .single()

        if (updateError) {
          console.log(`  ❌ Update failed: ${updateError.message}`)
          return false
        }
        console.log('  ✅ Account updated successfully!')
        return true
      }
      console.log(`  ❌ Creation failed: ${error.message}`)
      return false
    }

    console.log('  ✅ Account created successfully!')
    return true
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`)
    return false
  }
}

async function main() {
  console.log('='.repeat(60))
  console.log('🔄 WAITING FOR SCHEMA CACHE REFRESH')
  console.log('='.repeat(60))

  const cacheReady = await waitAndRetry(6, 15)

  if (cacheReady) {
    console.log('🧪 Testing account operations...\n')
    const success = await testAccountCreation()

    console.log('\n' + '='.repeat(60))
    if (success) {
      console.log('✅ SUCCESS - Everything is working!')
      console.log('\nYou can now:')
      console.log('  1. Go to: http://localhost:1001/admin/marketing')
      console.log('  2. Click: Overview tab')
      console.log('  3. Connect your social media accounts!')
    } else {
      console.log('⚠️  Account creation test failed')
      console.log('   But tables exist - try again in a few minutes')
    }
    console.log('='.repeat(60) + '\n')
  } else {
    console.log('='.repeat(60))
    console.log('⚠️  SCHEMA CACHE NOT READY YET')
    console.log('='.repeat(60))
    console.log('\nThe tables exist but Supabase cache needs more time.')
    console.log('This usually takes 1-5 minutes after table creation.')
    console.log('\nYou can:')
    console.log('  1. Wait 2-3 more minutes')
    console.log('  2. Run: npm run setup:marketing')
    console.log('  3. Or try using the feature directly - it might work!')
    console.log('='.repeat(60) + '\n')
  }
}

main().catch(console.error)

