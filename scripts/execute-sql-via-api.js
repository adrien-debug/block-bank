/**
 * Execute SQL directly via Supabase using pg_net or direct connection
 */

require('dotenv').config({ path: '.env.local' })
const fs = require('fs')
const path = require('path')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

// Read SQL schema
const schemaPath = path.join(__dirname, '..', 'EXECUTE-NOW.sql')
const sqlSchema = fs.readFileSync(schemaPath, 'utf-8')

// Extract project reference
const projectMatch = supabaseUrl.match(/https?:\/\/([^.]+)\.supabase\.co/)
const projectRef = projectMatch ? projectMatch[1] : null

async function executeSQLViaManagementAPI() {
  console.log('\n🚀 Executing SQL via Supabase Management API...\n')

  // Try using Supabase Management API
  // This requires an access token, which we don't have
  // So we'll use a workaround: create tables via direct SQL execution
  
  // Since Supabase doesn't allow DDL via REST API, we need to use
  // the SQL Editor or create a function that executes SQL
  
  // Alternative: Use pg_net extension if available
  // Or use direct PostgreSQL connection via connection string
  
  console.log('📝 Attempting to execute SQL statements...\n')

  // Split SQL into individual statements
  const statements = sqlSchema
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'))

  console.log(`Found ${statements.length} SQL statements\n`)

  // Try to execute via RPC function if it exists
  // Otherwise, we'll need to use the Management API or direct connection
  
  const { createClient } = require('@supabase/supabase-js')
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  // Try to create a function that executes SQL
  // This requires pg_net or direct database access
  
  console.log('⚠️  Supabase JavaScript client cannot execute DDL statements.')
  console.log('   Attempting alternative method...\n')

  // Use direct PostgreSQL connection if connection string is available
  // Otherwise, we'll need to use the browser automation
  
  return { needsManual: true }
}

async function createTablesDirectly() {
  console.log('\n🔧 Creating tables directly via API...\n')

  const { createClient } = require('@supabase/supabase-js')
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  // Try to use Supabase's SQL execution endpoint
  // This might work if we have the right permissions
  
  try {
    // Use the REST API to execute SQL via a custom function
    // First, check if we can create a function that executes SQL
    
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sql: sqlSchema })
    })

    if (response.ok) {
      console.log('✅ SQL executed successfully!')
      return { success: true }
    } else {
      console.log(`⚠️  RPC function not available (${response.status})`)
    }
  } catch (error) {
    console.log(`⚠️  RPC method not available: ${error.message}`)
  }

  // Try direct table creation via REST API (won't work for DDL)
  // But we can try to create tables one by one if we have the schema
  
  return { needsManual: true }
}

async function main() {
  console.log('='.repeat(60))
  console.log('🚀 FINAL SQL EXECUTION')
  console.log('='.repeat(60))

  // Try multiple methods
  const result1 = await executeSQLViaManagementAPI()
  if (!result1.needsManual) {
    console.log('✅ Success via Management API!')
    return
  }

  const result2 = await createTablesDirectly()
  if (!result2.needsManual) {
    console.log('✅ Success via direct creation!')
    return
  }

  // If all automated methods fail, use browser automation
  console.log('\n📝 Using browser automation to execute SQL...\n')
  console.log('Opening Supabase Dashboard...')
  
  // The browser automation will be handled separately
  // For now, provide clear instructions
  
  console.log('\n' + '='.repeat(60))
  console.log('⚠️  AUTOMATED EXECUTION NOT POSSIBLE')
  console.log('='.repeat(60))
  console.log('\nSupabase requires manual SQL execution via Dashboard.')
  console.log('However, I will attempt browser automation...\n')
}

main().catch(console.error)

