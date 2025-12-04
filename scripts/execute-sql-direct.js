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
const schemaPath = path.join(__dirname, '..', 'supabase-marketing-schema.sql')
const sqlSchema = fs.readFileSync(schemaPath, 'utf-8')

async function executeViaRPC() {
  const { createClient } = require('@supabase/supabase-js')
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  // Try to create a function that executes SQL
  // This requires pg_net extension or direct database access
  
  console.log('\n🚀 Attempting to execute SQL via Supabase...\n')

  // Split SQL into statements
  const statements = sqlSchema
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'))

  console.log(`Found ${statements.length} SQL statements\n`)

  // Since Supabase JS client doesn't support DDL, we need Management API
  // For now, provide the SQL and use browser automation or manual execution
  
  console.log('⚠️  Supabase JavaScript client cannot execute DDL statements.')
  console.log('   We need to use the Supabase Dashboard or Management API.\n')
  
  // Create a one-click SQL file
  const outputFile = path.join(process.cwd(), 'EXECUTE-NOW.sql')
  fs.writeFileSync(outputFile, sqlSchema)
  
  console.log('✅ Created SQL file: EXECUTE-NOW.sql')
  console.log('\n📋 NEXT STEPS:\n')
  console.log('1. Open Supabase Dashboard:')
  console.log(`   https://supabase.com/dashboard/project/${supabaseUrl.match(/https?:\/\/([^.]+)\.supabase\.co/)?.[1]}`)
  console.log('2. Go to: SQL Editor > New Query')
  console.log('3. Open file: EXECUTE-NOW.sql (in this project folder)')
  console.log('4. Copy ALL content (Cmd/Ctrl + A, then Cmd/Ctrl + C)')
  console.log('5. Paste in Supabase SQL Editor')
  console.log('6. Click: Run (or Cmd/Ctrl + Enter)')
  console.log('7. Wait for success message')
  console.log('8. Run: npm run verify:marketing\n')

  return { needsManual: true, sqlFile: outputFile }
}

async function main() {
  const result = await executeViaRPC()
  
  if (result.needsManual) {
    console.log('='.repeat(60))
    console.log('📝 Manual SQL execution required')
    console.log('='.repeat(60))
    console.log('\nThe SQL file is ready: EXECUTE-NOW.sql')
    console.log('After executing in Supabase, everything will work!\n')
  }
}

main().catch(console.error)

