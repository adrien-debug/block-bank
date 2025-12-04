/**
 * Direct table check using Supabase client
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

const tables = [
  'marketing_posts',
  'marketing_promotions',
  'marketing_adwords_campaigns',
  'marketing_content_sections',
  'marketing_calendar_events',
  'marketing_social_accounts'
]

async function checkTable(tableName) {
  try {
    // Try a simple query
    const { data, error, count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true })
    
    if (error) {
      console.log(`  ❌ ${tableName}: ${error.message}`)
      return false
    }
    console.log(`  ✅ ${tableName}: Exists (${count || 0} rows)`)
    return true
  } catch (error) {
    console.log(`  ❌ ${tableName}: ${error.message}`)
    return false
  }
}

async function main() {
  console.log('\n🔍 Checking tables directly...\n')
  
  let allExist = true
  for (const table of tables) {
    const exists = await checkTable(table)
    if (!exists) allExist = false
  }
  
  console.log('\n' + '='.repeat(60))
  if (allExist) {
    console.log('✅ All tables exist!')
  } else {
    console.log('❌ Some tables are missing')
    console.log('\nTo create them, run the SQL from supabase-marketing-schema.sql in Supabase SQL Editor')
  }
  console.log('='.repeat(60) + '\n')
}

main().catch(console.error)

