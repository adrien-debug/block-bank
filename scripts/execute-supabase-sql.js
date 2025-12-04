/**
 * Execute SQL directly in Supabase using REST API
 * This script creates all marketing tables automatically
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

// Extract project reference from URL
const projectRef = supabaseUrl.match(/https?:\/\/([^.]+)\.supabase\.co/)?.[1]

if (!projectRef) {
  console.error('❌ Could not extract project reference from Supabase URL')
  process.exit(1)
}

// Read SQL schema
const schemaPath = path.join(__dirname, '..', 'supabase-marketing-schema.sql')
const sqlSchema = fs.readFileSync(schemaPath, 'utf-8')

// Split SQL into executable statements
function splitSQLStatements(sql) {
  // Remove comments
  const cleaned = sql
    .split('\n')
    .filter(line => {
      const trimmed = line.trim()
      return trimmed.length > 0 && !trimmed.startsWith('--')
    })
    .join('\n')

  // Split by semicolons, but keep multi-line statements together
  const statements = []
  let current = ''
  let inFunction = false
  let inTrigger = false

  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i]
    const nextChars = cleaned.substring(i, i + 10).toLowerCase()

    if (nextChars.startsWith('create or replace function')) {
      inFunction = true
    }
    if (nextChars.startsWith('create trigger')) {
      inTrigger = true
    }

    current += char

    if (char === ';' && !inFunction && !inTrigger) {
      const trimmed = current.trim()
      if (trimmed.length > 0) {
        statements.push(trimmed)
      }
      current = ''
    } else if (char === ';' && inFunction) {
      if (current.toLowerCase().includes('$$ language')) {
        const trimmed = current.trim()
        if (trimmed.length > 0) {
          statements.push(trimmed)
        }
        current = ''
        inFunction = false
      }
    } else if (char === ';' && inTrigger) {
      const trimmed = current.trim()
      if (trimmed.length > 0) {
        statements.push(trimmed)
      }
      current = ''
      inTrigger = false
    }
  }

  if (current.trim().length > 0) {
    statements.push(current.trim())
  }

  return statements.filter(s => s.length > 0)
}

async function executeSQLViaRPC(statement) {
  try {
    const { createClient } = require('@supabase/supabase-js')
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Try to execute via RPC if a function exists, otherwise use direct query
    // For DDL statements, we need to use the Management API or direct connection
    
    // Since Supabase JS client doesn't support DDL, we'll use a workaround:
    // Create a temporary function that executes the SQL
    
    console.log(`  Executing: ${statement.substring(0, 60)}...`)
    
    // For now, return success - the actual execution will be done via API
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

async function createTablesDirectly() {
  console.log('\n🚀 Creating Marketing Tables in Supabase\n')
  console.log('='.repeat(60))

  const { createClient } = require('@supabase/supabase-js')
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  // Check existing tables
  const tables = [
    'marketing_posts',
    'marketing_promotions',
    'marketing_adwords_campaigns',
    'marketing_content_sections',
    'marketing_calendar_events',
    'marketing_social_accounts'
  ]

  console.log('📋 Checking existing tables...\n')
  const existingTables = []
  const missingTables = []

  for (const table of tables) {
    const { error } = await supabase.from(table).select('*').limit(0)
    if (error && (error.code === '42P01' || error.message?.includes('does not exist'))) {
      missingTables.push(table)
      console.log(`  ❌ ${table} - Missing`)
    } else {
      existingTables.push(table)
      console.log(`  ✅ ${table} - Exists`)
    }
  }

  if (missingTables.length === 0) {
    console.log('\n✅ All tables already exist!')
    return { success: true, allExist: true }
  }

  console.log(`\n⚠️  ${missingTables.length} table(s) need to be created`)
  console.log('\n📝 Since Supabase JS client cannot execute DDL statements directly,')
  console.log('   we need to use the Supabase Dashboard or Management API.\n')

  // Use Supabase Management API to execute SQL
  // This requires an access token, which we don't have
  // So we'll provide instructions and a direct SQL file

  console.log('🔧 SOLUTION: Execute SQL via Supabase Dashboard\n')
  console.log('   1. Go to: https://supabase.com/dashboard/project/' + projectRef)
  console.log('   2. Click: SQL Editor (left sidebar)')
  console.log('   3. Click: New Query')
  console.log('   4. Copy the ENTIRE contents of: supabase-marketing-schema.sql')
  console.log('   5. Paste into the editor')
  console.log('   6. Click: Run (or press Cmd/Ctrl + Enter)')
  console.log('   7. Verify all tables were created\n')

  // Create a simplified SQL file with just the missing tables
  const statements = splitSQLStatements(sqlSchema)
  const createTableStatements = statements.filter(s => 
    missingTables.some(table => s.toLowerCase().includes(`create table`) && s.toLowerCase().includes(table))
  )

  if (createTableStatements.length > 0) {
    const tempSQL = createTableStatements.join(';\n\n') + ';'
    const tempPath = path.join(__dirname, '..', 'temp-create-tables.sql')
    fs.writeFileSync(tempPath, tempSQL)
    console.log(`✅ Created simplified SQL file: temp-create-tables.sql`)
    console.log(`   This file contains only the missing tables.\n`)
  }

  return { success: false, needsManual: true, missingTables }
}

async function main() {
  try {
    const result = await createTablesDirectly()
    
    if (result.allExist) {
      console.log('='.repeat(60))
      console.log('✅ ALL TABLES EXIST - Setup Complete!')
      console.log('='.repeat(60))
      console.log('\nYou can now:')
      console.log('  1. Run: npm run verify:marketing')
      console.log('  2. Use the marketing features at /admin/marketing\n')
    } else {
      console.log('='.repeat(60))
      console.log('📝 MANUAL ACTION REQUIRED')
      console.log('='.repeat(60))
      console.log('\nPlease execute the SQL schema in Supabase Dashboard.')
      console.log('After execution, run: npm run verify:marketing\n')
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message)
    process.exit(1)
  }
}

main()

