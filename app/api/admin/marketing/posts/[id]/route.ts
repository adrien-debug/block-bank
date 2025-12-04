import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/utils/adminAuth'
import { supabaseAdmin } from '@/lib/supabase/server'
import { SocialPost } from '@/types/marketing.types'
import { mapArrayToCamelCase, toSnakeCase } from '@/lib/utils/marketingMapper'

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
      .from('marketing_posts')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Post non trouvé' }, { status: 404 })
    }

    const post = mapArrayToCamelCase<SocialPost>([data])[0]
    return NextResponse.json({ success: true, post })
  } catch (error) {
    console.error('Error in GET /api/admin/marketing/posts/[id]:', error)
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
    
    // Convert camelCase to snake_case for database
    const updateData = toSnakeCase(body)
    // Remove updated_at as it's handled by trigger
    delete updateData.updated_at

    const { data, error } = await supabaseAdmin
      .from('marketing_posts')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating post:', error)
      return NextResponse.json({ error: 'Erreur lors de la mise à jour du post' }, { status: 500 })
    }

    const post = mapArrayToCamelCase<SocialPost>([data])[0]
    return NextResponse.json({ success: true, post })
  } catch (error) {
    console.error('Error in PATCH /api/admin/marketing/posts/[id]:', error)
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
      .from('marketing_posts')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Error deleting post:', error)
      return NextResponse.json({ error: 'Erreur lors de la suppression du post' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/admin/marketing/posts/[id]:', error)
    return NextResponse.json(
      { error: 'An error occurred', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

