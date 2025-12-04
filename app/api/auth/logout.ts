import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    cookies().delete('auth_session')
    cookies().delete('user_id')
    cookies().delete('user_role')
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    console.error('Erreur logout API:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la déconnexion' },
      { status: 500 }
    )
  }
}

