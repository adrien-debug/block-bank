/**
 * FINAL SQL EXECUTION - Execute SQL directly via PostgreSQL connection
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

// Extract database connection info from Supabase URL
const projectMatch = supabaseUrl.match(/https?:\/\/([^.]+)\.supabase\.co/)
const projectRef = projectMatch ? projectMatch[1] : null

async function executeViaPostgreSQL() {
  console.log('\n🚀 Executing SQL via PostgreSQL connection...\n')

  // Try to use pg library if available
  let pg
  try {
    pg = require('pg')
  } catch (error) {
    console.log('⚠️  pg library not installed')
    console.log('   Installing pg...\n')
    
    // Try to install pg
    const { execSync } = require('child_process')
    try {
      execSync('npm install pg --save-dev', { stdio: 'inherit' })
      pg = require('pg')
    } catch (installError) {
      console.log('❌ Could not install pg library')
      return { success: false, needsManual: true }
    }
  }

  // Construct PostgreSQL connection string from Supabase
  // Supabase provides connection string in format:
  // postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
  
  // We need the database password from Supabase
  // This is usually in the connection string or can be retrieved from Supabase dashboard
  
  console.log('📝 Attempting to connect to PostgreSQL...\n')
  
  // For now, we'll need the connection string
  // Let's try to construct it or use environment variable
  
  const dbPassword = process.env.SUPABASE_DB_PASSWORD
  const dbHost = `db.${projectRef}.supabase.co`
  const dbPort = 5432
  const dbName = 'postgres'
  const dbUser = 'postgres'

  if (!dbPassword) {
    console.log('⚠️  Database password not found in environment')
    console.log('   Trying alternative method...\n')
    return { success: false, needsManual: true }
  }

  const connectionString = `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`

  const client = new pg.Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  })

  try {
    await client.connect()
    console.log('✅ Connected to PostgreSQL!\n')

    // Execute SQL
    console.log('📝 Executing SQL statements...\n')
    await client.query(sqlSchema)
    
    console.log('✅ SQL executed successfully!\n')
    await client.end()
    
    return { success: true }
  } catch (error) {
    console.log(`❌ Error executing SQL: ${error.message}\n`)
    try {
      await client.end()
    } catch {}
    return { success: false, error: error.message }
  }
}

async function executeViaSupabaseRPC() {
  console.log('\n🔧 Attempting to execute via Supabase RPC...\n')

  const { createClient } = require('@supabase/supabase-js')
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  // Try to create a function that executes SQL
  // First, create the exec_sql function if it doesn't exist
  const createFunctionSQL = `
    CREATE OR REPLACE FUNCTION exec_sql(sql_text text)
    RETURNS void
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
      EXECUTE sql_text;
    END;
    $$;
  `

  try {
    // Try to call exec_sql via RPC
    const { data, error } = await supabase.rpc('exec_sql', { 
      sql_text: sqlSchema 
    })

    if (!error) {
      console.log('✅ SQL executed via RPC!\n')
      return { success: true }
    } else {
      console.log(`⚠️  RPC function not available: ${error.message}\n`)
    }
  } catch (error) {
    console.log(`⚠️  RPC method failed: ${error.message}\n`)
  }

  return { success: false }
}

async function main() {
  console.log('='.repeat(60))
  console.log('🚀 FINAL SQL EXECUTION')
  console.log('='.repeat(60))
  console.log(`Project: ${projectRef || 'Unknown'}`)
  console.log(`URL: ${supabaseUrl}\n`)

  // Method 1: Try PostgreSQL direct connection
  const result1 = await executeViaPostgreSQL()
  if (result1.success) {
    console.log('='.repeat(60))
    console.log('✅ SUCCESS - SQL EXECUTED!')
    console.log('='.repeat(60))
    console.log('\nAll tables have been created successfully!')
    console.log('You can now run: npm run setup:marketing\n')
    return
  }

  // Method 2: Try Supabase RPC
  const result2 = await executeViaSupabaseRPC()
  if (result2.success) {
    console.log('='.repeat(60))
    console.log('✅ SUCCESS - SQL EXECUTED!')
    console.log('='.repeat(60))
    console.log('\nAll tables have been created successfully!')
    console.log('You can now run: npm run setup:marketing\n')
    return
  }

  // If both methods fail, provide instructions
  console.log('='.repeat(60))
  console.log('⚠️  AUTOMATED EXECUTION NOT POSSIBLE')
  console.log('='.repeat(60))
  console.log('\nPlease execute the SQL manually:')
  console.log('1. Open: https://supabase.com/dashboard/project/' + projectRef + '/sql/new')
  console.log('2. Copy content from: EXECUTE-NOW.sql')
  console.log('3. Paste and click Run\n')
}

main().catch(error => {
  console.error('\n❌ Fatal error:', error)
  process.exit(1)
})

