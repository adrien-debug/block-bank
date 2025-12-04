import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminPassword, createAdminSession, setAdminSessionCookie, clearAdminSessionCookie } from '@/lib/utils/adminAuth'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { action, password } = await request.json()

    if (action === 'login') {
      if (!password) {
        return NextResponse.json(
          { error: 'Password is required' },
          { status: 400 }
        )
      }

      const isValid = await verifyAdminPassword(password)
      if (!isValid) {
        return NextResponse.json(
          { error: 'Invalid password' },
          { status: 401 }
        )
      }

      const sessionId = createAdminSession()
      const response = NextResponse.json({ success: true })
      setAdminSessionCookie(response, sessionId)

      return response
    }

    if (action === 'logout') {
      const response = NextResponse.json({ success: true })
      clearAdminSessionCookie(response)
      return response
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Admin auth error:', error)
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    )
  }
}

