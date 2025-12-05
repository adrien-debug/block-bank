/**
 * Script pour tester les API routes
 * Usage: node scripts/test-api-routes.js [userId] [sessionToken]
 */

const fetch = require('node-fetch')

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:1001'

async function testAPI(userId, sessionToken) {
  console.log('🧪 Test des API routes...\n')

  const cookies = `user_id=${userId}; auth_session=${sessionToken}`

  const tests = [
    {
      name: 'GET /api/credit-score',
      url: `${BASE_URL}/api/credit-score`,
      method: 'GET'
    },
    {
      name: 'GET /api/credit-score/history',
      url: `${BASE_URL}/api/credit-score/history`,
      method: 'GET'
    },
    {
      name: 'GET /api/loans',
      url: `${BASE_URL}/api/loans`,
      method: 'GET'
    },
    {
      name: 'GET /api/nft-assets',
      url: `${BASE_URL}/api/nft-assets`,
      method: 'GET'
    },
    {
      name: 'GET /api/insurance',
      url: `${BASE_URL}/api/insurance`,
      method: 'GET'
    }
  ]

  let passed = 0
  let failed = 0

  for (const test of tests) {
    try {
      console.log(`Testing ${test.name}...`)
      const response = await fetch(test.url, {
        method: test.method,
        headers: {
          'Cookie': cookies,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (response.ok) {
        console.log(`✅ ${test.name}: OK`)
        console.log(`   Status: ${response.status}`)
        console.log(`   Data keys: ${Object.keys(data).join(', ')}`)
        passed++
      } else {
        console.log(`❌ ${test.name}: FAILED`)
        console.log(`   Status: ${response.status}`)
        console.log(`   Error: ${data.error || 'Unknown error'}`)
        failed++
      }
    } catch (error) {
      console.log(`❌ ${test.name}: ERROR`)
      console.log(`   ${error.message}`)
      failed++
    }
    console.log('')
  }

  console.log('\n📊 Résultats:')
  console.log(`   ✅ Passed: ${passed}`)
  console.log(`   ❌ Failed: ${failed}`)
  console.log(`   📈 Total: ${passed + failed}`)
}

const userId = process.argv[2]
const sessionToken = process.argv[3]

if (!userId || !sessionToken) {
  console.error('❌ Usage: node scripts/test-api-routes.js <userId> <sessionToken>')
  console.log('\n💡 Pour obtenir ces valeurs, connectez-vous à l\'application et regardez les cookies.')
  process.exit(1)
}

testAPI(userId, sessionToken)
  .then(() => {
    console.log('\n✨ Terminé!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Erreur fatale:', error)
    process.exit(1)
  })


