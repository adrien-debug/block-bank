/**
 * Script de vérification complète - Vérifie que tout est ouvert et accessible
 */

require('dotenv').config({ path: '.env.local' })

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:1001'

console.log('\n🔍 Vérification Complète - Block Bank')
console.log('='.repeat(70))
console.log(`🌐 URL de base: ${BASE_URL}\n`)

// Routes à vérifier
const routes = [
  { path: '/', name: 'Page d\'accueil' },
  { path: '/admin/login', name: 'Admin Login' },
  { path: '/admin', name: 'Admin Dashboard' },
  { path: '/admin/marketing', name: 'Marketing' },
  { path: '/admin/submissions', name: 'Submissions' },
  { path: '/dashboard', name: 'Dashboard' },
]

async function checkRoute(path, name) {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'GET',
      headers: { 'Accept': 'text/html' }
    })
    const status = response.status
    const isOk = status >= 200 && status < 400
    
    return {
      name,
      path,
      status,
      ok: isOk,
      accessible: isOk
    }
  } catch (error) {
    return {
      name,
      path,
      status: 0,
      ok: false,
      accessible: false,
      error: error.message
    }
  }
}

async function checkAllRoutes() {
  console.log('📋 Vérification des Routes:\n')
  
  const results = []
  for (const route of routes) {
    const result = await checkRoute(route.path, route.name)
    results.push(result)
    
    const icon = result.ok ? '✅' : '❌'
    const statusText = result.status > 0 ? `HTTP ${result.status}` : 'Erreur'
    console.log(`   ${icon} ${result.name.padEnd(25)} ${statusText.padEnd(10)} ${result.path}`)
  }
  
  return results
}

async function checkDatabase() {
  console.log('\n📊 Vérification Base de Données:\n')
  
  const { createClient } = require('@supabase/supabase-js')
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    console.log('   ❌ Configuration Supabase manquante')
    return false
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })
  
  const tables = [
    'marketing_posts',
    'marketing_promotions',
    'marketing_adwords_campaigns',
    'marketing_content_sections',
    'marketing_calendar_events',
    'marketing_social_accounts'
  ]
  
  let allExist = true
  for (const table of tables) {
    try {
      const { error } = await supabase.from(table).select('*').limit(0)
      if (error && (error.code === '42P01' || error.message?.includes('does not exist'))) {
        console.log(`   ❌ ${table}`)
        allExist = false
      } else {
        console.log(`   ✅ ${table}`)
      }
    } catch (err) {
      console.log(`   ❌ ${table} - ${err.message}`)
      allExist = false
    }
  }
  
  return allExist
}

function checkEmailConfig() {
  console.log('\n📧 Vérification Email:\n')
  
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@block-bank.com'
  const resendKey = process.env.RESEND_API_KEY
  
  console.log(`   Admin Email: ${adminEmail}`)
  console.log(`   Resend API: ${resendKey ? '✅ Configuré' : '❌ Non configuré'}`)
  
  return !!resendKey
}

function checkEnvironment() {
  console.log('\n⚙️  Variables d\'Environnement:\n')
  
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'ADMIN_EMAIL',
    'DATABASE_URL'
  ]
  
  const optional = [
    'RESEND_API_KEY',
    'NEXT_PUBLIC_APP_URL'
  ]
  
  let allOk = true
  
  required.forEach(key => {
    const value = process.env[key]
    if (value) {
      console.log(`   ✅ ${key}`)
    } else {
      console.log(`   ❌ ${key} - MANQUANT`)
      allOk = false
    }
  })
  
  optional.forEach(key => {
    const value = process.env[key]
    console.log(`   ${value ? '✅' : '⚠️ '} ${key} ${value ? '' : '(optionnel)'}`)
  })
  
  return allOk
}

async function main() {
  // 1. Vérifier les routes
  const routeResults = await checkAllRoutes()
  const routesOk = routeResults.every(r => r.ok)
  
  // 2. Vérifier la base de données
  const dbOk = await checkDatabase()
  
  // 3. Vérifier l'email
  const emailOk = checkEmailConfig()
  
  // 4. Vérifier l'environnement
  const envOk = checkEnvironment()
  
  // Résumé final
  console.log('\n' + '='.repeat(70))
  console.log('📊 RÉSUMÉ FINAL')
  console.log('='.repeat(70))
  console.log(`   Routes: ${routesOk ? '✅ Toutes accessibles' : '❌ Certaines inaccessibles'}`)
  console.log(`   Base de données: ${dbOk ? '✅ Toutes les tables existent' : '❌ Tables manquantes'}`)
  console.log(`   Email: ${emailOk ? '✅ Configuré' : '⚠️  Non configuré'}`)
  console.log(`   Environnement: ${envOk ? '✅ Complet' : '❌ Variables manquantes'}`)
  console.log('='.repeat(70))
  
  if (routesOk && dbOk && envOk) {
    console.log('\n✅ TOUT EST OUVERT ET FONCTIONNEL!')
    console.log('\n📋 Accès rapide:')
    console.log(`   🏠 Application: ${BASE_URL}`)
    console.log(`   🔐 Admin Login: ${BASE_URL}/admin/login`)
    console.log(`   📊 Marketing: ${BASE_URL}/admin/marketing`)
    console.log(`   📧 Admin Email: ${process.env.ADMIN_EMAIL || 'admin@block-bank.com'}`)
  } else {
    console.log('\n⚠️  CERTAINS ÉLÉMENTS NÉCESSITENT UNE ATTENTION')
  }
  console.log('='.repeat(70) + '\n')
}

main().catch(error => {
  console.error('\n❌ Erreur:', error)
  process.exit(1)
})

