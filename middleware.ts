import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/utils/adminAuth'

/**
 * Vérifie si l'utilisateur est authentifié (session user)
 */
function isUserAuthenticated(request: NextRequest): boolean {
  const userId = request.cookies.get('user_id')?.value
  const sessionToken = request.cookies.get('auth_session')?.value
  return !!(userId && sessionToken)
}

/**
 * Récupère le rôle de l'utilisateur depuis les cookies
 */
function getUserRole(request: NextRequest): string | null {
  return request.cookies.get('user_role')?.value || null
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protection des routes /admin/* (sauf /admin/login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    // Vérifier l'authentification admin (système admin séparé)
    if (!isAuthenticated(request)) {
      // Si pas d'auth admin, vérifier si c'est un user avec role admin
      if (!isUserAuthenticated(request)) {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
      }
      
      const userRole = getUserRole(request)
      if (userRole !== 'admin') {
        // Rediriger vers le dashboard user si ce n'est pas un admin
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
      }
    }
  }

  // Protection des routes /dashboard/*
  if (pathname.startsWith('/dashboard')) {
    if (!isUserAuthenticated(request)) {
      // Non authentifié, rediriger vers la page d'accueil
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }

    // Si l'utilisateur est admin, rediriger vers le dashboard admin
    const userRole = getUserRole(request)
    if (userRole === 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/dashboard'
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
}





