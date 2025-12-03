import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/utils/adminAuth'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protéger toutes les routes /admin/* sauf /admin/login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!isAuthenticated(request)) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}

