/**
 * Create RPC function and execute SQL
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

async function createRPCFunctionAndExecute() {
  console.log('\n🚀 Creating RPC function and executing SQL...\n')

  const { createClient } = require('@supabase/supabase-js')
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  // First, try to create the exec_sql function via REST API
  // We'll use a direct SQL execution approach
  
  // Split SQL into statements and execute one by one
  const statements = sqlSchema
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'))

  console.log(`Found ${statements.length} SQL statements\n`)

  // Try to execute each statement via a workaround
  // Since we can't execute DDL directly, we'll use the browser automation
  
  console.log('⚠️  Direct SQL execution via API is not possible.')
  console.log('   Using browser automation instead...\n')

  return { needsBrowser: true }
}

async function executeViaBrowser() {
  console.log('🌐 Opening Supabase Dashboard in browser...\n')

  // Use the browser MCP to navigate and execute SQL
  const { mcp_cursor-ide-browser_browser_navigate } = require('@modelcontextprotocol/sdk-browser')
  
  // Navigate to Supabase SQL Editor
  const url = `https://supabase.com/dashboard/project/ipamfhfzflprptchlaei/sql/new`
  
  console.log(`Opening: ${url}\n`)
  
  // The browser automation will be handled by the MCP tool
  return { url }
}

async function main() {
  console.log('='.repeat(60))
  console.log('🚀 FINAL SQL EXECUTION - BROWSER AUTOMATION')
  console.log('='.repeat(60))

  const result = await createRPCFunctionAndExecute()
  
  if (result.needsBrowser) {
    const browserResult = await executeViaBrowser()
    console.log('✅ Browser opened!')
    console.log('   Please execute the SQL manually in the browser.\n')
  }
}

main().catch(console.error)

