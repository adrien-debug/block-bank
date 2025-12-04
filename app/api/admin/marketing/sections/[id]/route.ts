import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/utils/adminAuth'
import { supabaseAdmin } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { data, error } = await supabaseAdmin
      .from('marketing_content_sections')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Section non trouvée' }, { status: 404 })
    }

    return NextResponse.json({ success: true, section: data })
  } catch (error) {
    console.error('Error in GET /api/admin/marketing/sections/[id]:', error)
    return NextResponse.json(
      { error: 'An error occurred', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await request.json()

    const { data, error } = await supabaseAdmin
      .from('marketing_content_sections')
      .update({
        ...body,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating section:', error)
      return NextResponse.json({ error: 'Erreur lors de la mise à jour de la section' }, { status: 500 })
    }

    return NextResponse.json({ success: true, section: data })
  } catch (error) {
    console.error('Error in PATCH /api/admin/marketing/sections/[id]:', error)
    return NextResponse.json(
      { error: 'An error occurred', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { error } = await supabaseAdmin
      .from('marketing_content_sections')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Error deleting section:', error)
      return NextResponse.json({ error: 'Erreur lors de la suppression de la section' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/admin/marketing/sections/[id]:', error)
    return NextResponse.json(
      { error: 'An error occurred', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

