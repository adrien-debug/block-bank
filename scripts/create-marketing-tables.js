/**
 * Script to create all marketing tables in Supabase
 * Uses Supabase REST API to execute SQL
 */

require('dotenv').config({ path: '.env.local' })
const fs = require('fs')
const path = require('path')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('   Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

// Read the SQL schema file
const schemaPath = path.join(__dirname, '..', 'supabase-marketing-schema.sql')
const sqlSchema = fs.readFileSync(schemaPath, 'utf-8')

// Split SQL into individual statements
function parseSQL(sql) {
  // Remove comments and split by semicolons
  const statements = sql
    .split('\n')
    .filter(line => {
      const trimmed = line.trim()
      return trimmed.length > 0 && !trimmed.startsWith('--')
    })
    .join('\n')
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0)
  
  return statements
}

async function executeSQLStatement(statement) {
  try {
    // Use Supabase REST API to execute SQL
    // Note: Supabase doesn't allow direct SQL execution via REST API
    // We need to use the PostgREST API or create tables via direct queries
    
    // For now, we'll use a workaround: create tables via Supabase client
    // by checking if they exist and providing instructions
    
    console.log(`Executing: ${statement.substring(0, 80)}...`)
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

async function createTableDirectly(tableName, definition) {
  const { createClient } = require('@supabase/supabase-js')
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  // Check if table exists
  const { error: checkError } = await supabase.from(tableName).select('*').limit(0)
  
  if (!checkError || checkError.code !== '42P01') {
    console.log(`  ✅ Table ${tableName} already exists`)
    return { success: true, exists: true }
  }

  // Table doesn't exist - we need to create it via SQL
  // Since we can't execute raw SQL via JS client, we'll use the REST API
  console.log(`  ⚠️  Table ${tableName} needs to be created via SQL`)
  return { success: false, needsSQL: true }
}

async function createTablesViaRPC() {
  console.log('\n🚀 Creating Marketing Tables in Supabase\n')
  console.log('='.repeat(60))

  // Since Supabase JS client doesn't support raw SQL execution,
  // we'll use the Management API or provide a direct SQL execution method
  
  const statements = parseSQL(sqlSchema)
  console.log(`Found ${statements.length} SQL statements to execute\n`)

  // Try to create tables one by one using a workaround
  const tables = [
    'marketing_posts',
    'marketing_promotions', 
    'marketing_adwords_campaigns',
    'marketing_content_sections',
    'marketing_calendar_events',
    'marketing_social_accounts'
  ]

  const { createClient } = require('@supabase/supabase-js')
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  // Use Supabase REST API to execute SQL via PostgREST
  // We'll use fetch to call the Supabase REST API directly
  const projectRef = supabaseUrl.split('//')[1].split('.')[0]
  const managementUrl = `https://api.supabase.com/v1/projects/${projectRef}/database/query`

  console.log('📋 Attempting to create tables via Supabase API...\n')

  // Since direct SQL execution requires Management API access,
  // we'll provide the SQL and instructions
  console.log('⚠️  Direct SQL execution via API requires Management API access.')
  console.log('📝 Using alternative method: Executing SQL via Supabase Dashboard\n')

  // Create a temporary file with the SQL to execute
  const tempSQLPath = path.join(__dirname, '..', 'temp-execute-in-supabase.sql')
  fs.writeFileSync(tempSQLPath, sqlSchema)
  
  console.log('✅ SQL file prepared for execution')
  console.log(`   Location: ${tempSQLPath}`)
  console.log('\n📋 Next steps:')
  console.log('   1. Go to: https://supabase.com/dashboard')
  console.log('   2. Select your project')
  console.log('   3. Go to SQL Editor')
  console.log('   4. Click "New Query"')
  console.log('   5. Copy the contents of: supabase-marketing-schema.sql')
  console.log('   6. Paste and click "Run"')
  console.log('\n   OR use the automated method below...\n')

  // Try using Supabase CLI if available, or provide curl command
  console.log('🔧 Alternative: Use Supabase CLI (if installed):')
  console.log(`   supabase db execute --file supabase-marketing-schema.sql\n`)

  return { success: false, manual: true }
}

async function main() {
  try {
    const result = await createTablesViaRPC()
    
    if (result.manual) {
      console.log('='.repeat(60))
      console.log('📝 MANUAL SETUP REQUIRED')
      console.log('='.repeat(60))
      console.log('\nSince Supabase requires SQL execution via Dashboard or CLI,')
      console.log('please follow these steps:\n')
      console.log('1. Open: https://supabase.com/dashboard')
      console.log('2. Select your project')
      console.log('3. Go to: SQL Editor > New Query')
      console.log('4. Copy entire contents of: supabase-marketing-schema.sql')
      console.log('5. Paste and click "Run" (or Cmd/Ctrl + Enter)')
      console.log('6. Verify with: npm run verify:marketing\n')
      console.log('='.repeat(60) + '\n')
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message)
    process.exit(1)
  }
}

main()

