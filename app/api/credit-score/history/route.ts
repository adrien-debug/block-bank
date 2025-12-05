import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const userId = cookies().get('user_id')?.value
    const sessionToken = cookies().get('auth_session')?.value

    if (!userId || !sessionToken) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Récupérer l'historique des scores
    const { data: history, error } = await supabaseAdmin
      .from('credit_scores')
      .select('score, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Erreur récupération historique:', error)
      return NextResponse.json(
        { error: 'Erreur lors de la récupération de l\'historique' },
        { status: 500 }
      )
    }

    return NextResponse.json({ history: history || [] }, { status: 200 })
  } catch (error: any) {
    console.error('Erreur API credit score history:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}


