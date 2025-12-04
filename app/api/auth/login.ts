import { NextRequest, NextResponse } from 'next/server'
import { verifyUser } from '@/lib/supabase-auth'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      )
    }

    // Vérifier les identifiants
    const result = await verifyUser({ email, password })

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      )
    }

    // Créer une session
    const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`
    cookies().set('auth_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 jours
    })

    cookies().set('user_id', result.user!.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 jours
    })

    // Stocker le rôle dans un cookie pour faciliter les vérifications
    if (result.user!.role) {
      cookies().set('user_role', result.user!.role, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 jours
      })
    }

    return NextResponse.json({ user: result.user }, { status: 200 })
  } catch (error: any) {
    console.error('Erreur login API:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la connexion' },
      { status: 500 }
    )
  }
}

