import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/utils/adminAuth'
import { supabaseAdmin } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { data, error } = await supabaseAdmin
      .from('marketing_content_sections')
      .select('*')
      .order('createdAt', { ascending: false })

    if (error) {
      console.error('Error fetching content sections:', error)
      return NextResponse.json({ error: 'Erreur lors de la récupération des sections' }, { status: 500 })
    }

    return NextResponse.json({ success: true, sections: data || [] })
  } catch (error) {
    console.error('Error in GET /api/admin/marketing/sections:', error)
    return NextResponse.json(
      { error: 'An error occurred', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      type,
      content,
      template,
      previewImage,
    } = body

    if (!name || !type || !content || !template) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('marketing_content_sections')
      .insert({
        name,
        type,
        content,
        template,
        previewImage: previewImage || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating content section:', error)
      return NextResponse.json({ error: 'Erreur lors de la création de la section' }, { status: 500 })
    }

    return NextResponse.json({ success: true, section: data }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/admin/marketing/sections:', error)
    return NextResponse.json(
      { error: 'An error occurred', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

