import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/utils/adminAuth'
import { supabaseAdmin } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface SocialNetworkAccount {
  network: string
  username: string
  url: string
  status: 'connected' | 'not-connected' | 'pending'
  followers?: number
  created_at?: string
  updated_at?: string
}

export async function GET(request: NextRequest) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Try to fetch from database
    let query = supabaseAdmin
      .from('marketing_social_accounts')
      .select('*')
      .order('created_at', { ascending: false })

    const { data, error } = await query

    if (error) {
      console.error('Error fetching social accounts:', error)
      // If table doesn't exist or schema cache not ready, return empty array
      const errorMsg = error.message?.toLowerCase() || ''
      if (error.code === '42P01' || 
          error.code === 'PGRST205' ||
          errorMsg.includes('does not exist') || 
          errorMsg.includes('relation') ||
          errorMsg.includes('schema cache') ||
          errorMsg.includes('could not find the table')) {
        console.warn('Table marketing_social_accounts not accessible yet (schema cache may need refresh). Returning empty array.')
        return NextResponse.json({ success: true, accounts: [] })
      }
      return NextResponse.json(
        { error: 'Failed to fetch social accounts', details: error.message },
        { status: 500 }
      )
    }

    // Map database fields to camelCase
    const accounts = (data || []).map((account: any) => ({
      network: account.network,
      username: account.username,
      url: account.url,
      status: account.status || 'not-connected',
      followers: account.followers,
      createdAt: account.created_at,
      updatedAt: account.updated_at,
    }))

    return NextResponse.json({ success: true, accounts })
  } catch (error: any) {
    console.error('Unexpected error in GET /api/admin/marketing/accounts:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { network, username, url, status, followers } = body

    if (!network || !username) {
      return NextResponse.json(
        { error: 'Network and username are required' },
        { status: 400 }
      )
    }

    // Check if account already exists
    const { data: existing, error: checkError } = await supabaseAdmin
      .from('marketing_social_accounts')
      .select('*')
      .eq('network', network)
      .single()

    // If table doesn't exist, treat as no existing account
    const tableExists = !checkError || 
      (checkError.code !== '42P01' && 
       !checkError.message?.includes('does not exist') && 
       !checkError.message?.includes('relation'))

    const accountExists = tableExists && existing && !checkError

    const accountData = {
      network,
      username,
      url: url || null,
      status: status || 'not-connected',
      followers: followers || null,
      updated_at: new Date().toISOString(),
    }

    let result
    if (accountExists) {
      // Update existing account
      const { data, error } = await supabaseAdmin
        .from('marketing_social_accounts')
        .update(accountData)
        .eq('network', network)
        .select()
        .single()

      if (error) {
        console.error('Error updating social account:', error)
        // If table doesn't exist or schema cache not ready
        const errorMsg = error.message?.toLowerCase() || ''
        if (error.code === '42P01' || 
            error.code === 'PGRST205' ||
            errorMsg.includes('does not exist') || 
            errorMsg.includes('relation') ||
            errorMsg.includes('schema cache') ||
            errorMsg.includes('could not find the table')) {
          return NextResponse.json({ 
            success: true,
            account: accountData,
            warning: 'Schema cache not ready yet. Please wait a few minutes and try again.'
          })
        }
        return NextResponse.json(
          { error: 'Failed to update social account', details: error.message },
          { status: 500 }
        )
      }

      result = data
    } else {
      // Create new account
      const { data, error } = await supabaseAdmin
        .from('marketing_social_accounts')
        .insert({
          ...accountData,
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating social account:', error)
        // If table doesn't exist or schema cache not ready
        const errorMsg = error.message?.toLowerCase() || ''
        if (error.code === '42P01' || 
            error.code === 'PGRST205' ||
            errorMsg.includes('does not exist') || 
            errorMsg.includes('relation') ||
            errorMsg.includes('schema cache') ||
            errorMsg.includes('could not find the table')) {
          console.warn('Table marketing_social_accounts not accessible yet (schema cache may need refresh).')
          return NextResponse.json({ 
            success: true, 
            account: accountData,
            warning: 'Schema cache not ready yet. Please wait a few minutes and try again.'
          })
        }
        return NextResponse.json(
          { error: 'Failed to create social account', details: error.message },
          { status: 500 }
        )
      }

      result = data
    }

    // Map to camelCase
    const account = {
      network: result.network,
      username: result.username,
      url: result.url,
      status: result.status,
      followers: result.followers,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    }

    return NextResponse.json({ success: true, account })
  } catch (error: any) {
    console.error('Unexpected error in POST /api/admin/marketing/accounts:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

