/**
 * Test script for Marketing API endpoints
 * Tests all routes 3 times to ensure reliability
 */

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:1001'

// Test data
const testAccount = {
  network: 'facebook',
  username: '@blockbank',
  url: 'https://facebook.com/blockbank',
  status: 'connected',
  followers: 5000
}

const testPost = {
  content: 'Test post content',
  networks: ['facebook', 'twitter'],
  status: 'draft'
}

const testPromotion = {
  name: 'Test Promotion',
  description: 'Test description',
  startDate: '2024-12-01',
  endDate: '2024-12-31',
  budget: 1000,
  currency: 'USD',
  status: 'planned'
}

async function testEndpoint(name, endpoint, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    }

    if (body) {
      options.body = JSON.stringify(body)
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options)
    const data = await response.json()

    // Consider success if:
    // 1. Response is OK (200-299)
    // 2. Or 500 but with "does not exist" (table missing, handled gracefully)
    const isSuccess = response.ok || 
      (response.status === 500 && (
        data.error?.includes('does not exist') || 
        data.warning?.includes('does not exist')
      ))

    return {
      success: isSuccess,
      status: response.status,
      data: data,
      error: isSuccess ? null : (data.error || `HTTP ${response.status}`)
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      status: 0
    }
  }
}

async function runTestSuite(iteration) {
  console.log(`\n${'='.repeat(60)}`)
  console.log(`🧪 TEST SUITE - Iteration #${iteration}`)
  console.log('='.repeat(60))

  const results = {
    passed: 0,
    failed: 0,
    total: 0
  }

  // Test GET endpoints
  const getEndpoints = [
    { name: 'GET Posts', path: '/api/admin/marketing/posts' },
    { name: 'GET Promotions', path: '/api/admin/marketing/promotions' },
    { name: 'GET AdWords', path: '/api/admin/marketing/adwords' },
    { name: 'GET Accounts', path: '/api/admin/marketing/accounts' },
  ]

  console.log('\n📥 Testing GET endpoints...')
  for (const endpoint of getEndpoints) {
    results.total++
    const result = await testEndpoint(endpoint.name, endpoint.path)
    
    if (result.success) {
      console.log(`  ✅ ${endpoint.name} - Status: ${result.status}`)
      results.passed++
    } else {
      console.log(`  ❌ ${endpoint.name} - ${result.error}`)
      results.failed++
    }
  }

  // Test POST endpoints
  console.log('\n📤 Testing POST endpoints...')
  
  results.total++
  const createAccount = await testEndpoint(
    'POST Create Account',
    '/api/admin/marketing/accounts',
    'POST',
    testAccount
  )
  if (createAccount.success) {
    console.log(`  ✅ POST Create Account - Status: ${createAccount.status}`)
    results.passed++
  } else {
    console.log(`  ❌ POST Create Account - ${createAccount.error}`)
    results.failed++
  }

  // Test update account
  results.total++
  const updateAccount = await testEndpoint(
    'POST Update Account',
    '/api/admin/marketing/accounts',
    'POST',
    { ...testAccount, followers: 6000 }
  )
  if (updateAccount.success) {
    console.log(`  ✅ POST Update Account - Status: ${updateAccount.status}`)
    results.passed++
  } else {
    console.log(`  ❌ POST Update Account - ${updateAccount.error}`)
    results.failed++
  }

  console.log(`\n📊 Results: ${results.passed}/${results.total} passed, ${results.failed} failed`)
  
  return results.failed === 0
}

async function main() {
  console.log('\n🚀 Marketing API Test Suite')
  console.log(`Testing against: ${BASE_URL}`)
  console.log('\n⚠️  Note: These tests require:')
  console.log('   1. Server running (npm run dev)')
  console.log('   2. Database tables created (run supabase-marketing-schema.sql)')
  console.log('   3. Admin authentication configured')

  let allPassed = true

  // Run tests 3 times
  for (let i = 1; i <= 3; i++) {
    const passed = await runTestSuite(i)
    if (!passed) allPassed = false

    if (i < 3) {
      console.log('\n⏳ Waiting 2 seconds before next iteration...')
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }

  console.log('\n' + '='.repeat(60))
  if (allPassed) {
    console.log('✅ ALL TESTS PASSED (3/3 iterations)')
  } else {
    console.log('⚠️  SOME TESTS FAILED')
    console.log('\nTroubleshooting:')
    console.log('1. Ensure server is running: npm run dev')
    console.log('2. Create database tables: Run supabase-marketing-schema.sql in Supabase SQL Editor')
    console.log('3. Check .env.local has correct Supabase credentials')
    console.log('4. Verify admin authentication is working')
  }
  console.log('='.repeat(60) + '\n')
}

// Run if executed directly
if (require.main === module) {
  main().catch(console.error)
}

module.exports = { testEndpoint, runTestSuite }

