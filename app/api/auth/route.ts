import { NextRequest, NextResponse } from 'next/server'
import { getUserById } from '@/lib/supabase-auth'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const userId = cookies().get('user_id')?.value
    const sessionToken = cookies().get('auth_session')?.value

    if (!userId || !sessionToken) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    // Récupérer l'utilisateur
    const result = await getUserById(userId)

    if (result.error || !result.user) {
      // Session invalide, supprimer les cookies
      cookies().delete('auth_session')
      cookies().delete('user_id')
      cookies().delete('user_role')
      return NextResponse.json({ user: null }, { status: 200 })
    }

    return NextResponse.json({ user: result.user }, { status: 200 })
  } catch (error: any) {
    console.error('Erreur session API:', error)
    return NextResponse.json({ user: null }, { status: 200 })
  }
}

