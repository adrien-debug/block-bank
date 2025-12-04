import { NextRequest, NextResponse } from 'next/server'
import { createUser } from '@/lib/supabase-auth'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, firstName, lastName, address } = body

    // Validation
    if (!email || !password || !firstName || !lastName || !address) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 6 caractères' },
        { status: 400 }
      )
    }

    // Créer l'utilisateur
    const result = await createUser({
      email,
      password,
      first_name: firstName,
      last_name: lastName,
      address,
    })

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    // Créer une session (simplifié avec un cookie)
    const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`
    cookies().set('auth_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 jours
    })

    // Stocker l'ID utilisateur dans un cookie séparé pour faciliter la récupération
    cookies().set('user_id', result.user!.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 jours
    })

    // Stocker le rôle dans un cookie
    if (result.user!.role) {
      cookies().set('user_role', result.user!.role, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 jours
      })
    }

    return NextResponse.json({ user: result.user }, { status: 201 })
  } catch (error: any) {
    console.error('Erreur register API:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'inscription' },
      { status: 500 }
    )
  }
}

