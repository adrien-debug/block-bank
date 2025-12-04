import { NextRequest, NextResponse } from 'next/server'
import { findUserByWalletAddress, createUserFromWallet, updateWalletAddress, getUserById } from '@/lib/supabase-auth'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { walletAddress } = body

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Adresse wallet requise' },
        { status: 400 }
      )
    }

    // Normaliser l'adresse wallet (minuscules)
    const normalizedAddress = walletAddress.toLowerCase()

    // Rechercher un utilisateur existant avec cette adresse wallet
    const existingUser = await findUserByWalletAddress(normalizedAddress)

    let user
    let userId

    if (existingUser.error) {
      return NextResponse.json(
        { error: existingUser.error },
        { status: 500 }
      )
    }

    if (existingUser.user) {
      // Utilisateur trouvé, utiliser son compte
      user = existingUser.user
      userId = user.id
    } else {
      // Aucun utilisateur trouvé, vérifier si on a une session active
      const currentUserId = cookies().get('user_id')?.value
      const sessionToken = cookies().get('auth_session')?.value

      if (currentUserId && sessionToken) {
        // Utilisateur déjà authentifié, mettre à jour son wallet_address
        const userCheck = await getUserById(currentUserId)
        if (userCheck.error || !userCheck.user) {
          return NextResponse.json(
            { error: 'Utilisateur non trouvé' },
            { status: 404 }
          )
        }

        // Mettre à jour l'adresse wallet de l'utilisateur existant
        const updateResult = await updateWalletAddress(currentUserId, normalizedAddress)
        if (updateResult.error) {
          return NextResponse.json(
            { error: updateResult.error },
            { status: 400 }
          )
        }
        user = updateResult.user
        userId = user.id
      } else {
        // Créer un nouvel utilisateur avec cette adresse wallet
        const createResult = await createUserFromWallet(normalizedAddress)
        if (createResult.error) {
          return NextResponse.json(
            { error: createResult.error },
            { status: 400 }
          )
        }
        user = createResult.user!
        userId = user.id
      }
    }

    // Créer ou mettre à jour la session
    const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`
    cookies().set('auth_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 jours
    })

    cookies().set('user_id', userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 jours
    })

    // Stocker le rôle dans un cookie
    if (user.role) {
      cookies().set('user_role', user.role, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 jours
      })
    }

    return NextResponse.json({ user }, { status: 200 })
  } catch (error: any) {
    console.error('Erreur connect-wallet API:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la connexion du wallet' },
      { status: 500 }
    )
  }
}

