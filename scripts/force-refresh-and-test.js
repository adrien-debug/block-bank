/**
 * Force refresh Supabase schema cache and test
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables')
  process.exit(1)
}

// Create client with fresh connection
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  db: {
    schema: 'public'
  }
})

async function forceRefreshCache() {
  console.log('\n🔄 Attempting to refresh schema cache...\n')
  
  // Try to query each table to force cache refresh
  const tables = [
    'marketing_posts',
    'marketing_promotions',
    'marketing_adwords_campaigns',
    'marketing_content_sections',
    'marketing_calendar_events',
    'marketing_social_accounts'
  ]

  for (const table of tables) {
    try {
      // Use a direct REST API call to bypass cache
      const response = await fetch(`${supabaseUrl}/rest/v1/${table}?select=*&limit=0`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        }
      })

      if (response.ok || response.status === 200) {
        console.log(`  ✅ ${table} - Accessible via REST API`)
      } else {
        const text = await response.text()
        console.log(`  ⚠️  ${table} - Status ${response.status}: ${text.substring(0, 100)}`)
      }
    } catch (error) {
      console.log(`  ⚠️  ${table} - ${error.message}`)
    }
  }
}

async function testCreateAccountDirect() {
  console.log('\n🧪 Testing direct account creation via REST API...\n')

  const testAccount = {
    network: 'facebook',
    username: '@blockbank',
    url: 'https://facebook.com/blockbank',
    status: 'connected',
    followers: 5000
  }

  // Try direct REST API call
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/marketing_social_accounts`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(testAccount)
    })

    if (response.ok) {
      const data = await response.json()
      console.log('  ✅ Account created via REST API!')
      console.log(`     ID: ${data[0]?.id}`)
      console.log(`     Network: ${data[0]?.network}`)
      return true
    } else {
      const errorText = await response.text()
      console.log(`  ❌ Failed: ${response.status} - ${errorText.substring(0, 200)}`)
      
      // If conflict, try update
      if (response.status === 409) {
        console.log('  📝 Account exists, trying to update...')
        const updateResponse = await fetch(`${supabaseUrl}/rest/v1/marketing_social_accounts?network=eq.facebook`, {
          method: 'PATCH',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({
            username: testAccount.username,
            url: testAccount.url,
            status: testAccount.status,
            followers: testAccount.followers
          })
        })
        
        if (updateResponse.ok) {
          const data = await updateResponse.json()
          console.log('  ✅ Account updated via REST API!')
          return true
        }
      }
      
      return false
    }
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`)
    return false
  }
}

async function testReadAccountDirect() {
  console.log('\n📖 Testing account retrieval via REST API...\n')

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/marketing_social_accounts?network=eq.facebook&select=*`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      const data = await response.json()
      if (data && data.length > 0) {
        console.log('  ✅ Account retrieved!')
        console.log(`     Username: ${data[0].username}`)
        console.log(`     Status: ${data[0].status}`)
        console.log(`     Followers: ${data[0].followers || 'N/A'}`)
        return true
      } else {
        console.log('  ⚠️  No account found')
        return false
      }
    } else {
      const errorText = await response.text()
      console.log(`  ❌ Failed: ${response.status} - ${errorText.substring(0, 200)}`)
      return false
    }
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`)
    return false
  }
}

async function main() {
  console.log('\n' + '='.repeat(60))
  console.log('🚀 FORCE REFRESH & FINAL TEST')
  console.log('='.repeat(60))

  // Step 1: Force refresh cache
  await forceRefreshCache()

  // Step 2: Test account creation (3 times)
  console.log('\n🧪 Testing Account Creation (3 iterations)...\n')
  
  let allPassed = true
  for (let i = 1; i <= 3; i++) {
    console.log(`--- Iteration #${i} ---`)
    const createPassed = await testCreateAccountDirect()
    const readPassed = await testReadAccountDirect()
    
    if (!createPassed || !readPassed) {
      allPassed = false
    }
    
    if (i < 3) {
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }

  // Final summary
  console.log('\n' + '='.repeat(60))
  if (allPassed) {
    console.log('✅ ALL TESTS PASSED (3/3 iterations)!')
    console.log('\n🎉 SETUP COMPLETE!')
    console.log('\nYour Facebook account is now in the database.')
    console.log('You can see it at: http://localhost:1001/admin/marketing (Overview tab)')
  } else {
    console.log('⚠️  Some tests failed')
    console.log('\nThe issue is likely a schema cache problem in Supabase.')
    console.log('Try:')
    console.log('  1. Wait 1-2 minutes for cache to refresh')
    console.log('  2. Or restart your Supabase project')
    console.log('  3. Then run: npm run setup:marketing')
  }
  console.log('='.repeat(60) + '\n')
}

main().catch(error => {
  console.error('\n❌ Fatal error:', error)
  process.exit(1)
})

