import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const SESSION_COOKIE_NAME = 'admin_session'
const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 heures

/**
 * Hash un mot de passe avec bcrypt (production-ready)
 */
export async function hashPassword(password: string): Promise<string> {
  // Try to use bcryptjs if available, otherwise fallback to SHA256
  try {
    const bcrypt = await import('bcryptjs')
    return await bcrypt.hash(password, 10)
  } catch {
    // Fallback for development if bcryptjs is not installed
    return crypto.createHash('sha256').update(password + (process.env.ADMIN_SESSION_SECRET || 'default-secret')).digest('hex')
  }
}

/**
 * Vérifie un mot de passe
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  // Try to use bcryptjs if available
  try {
    const bcrypt = await import('bcryptjs')
    return await bcrypt.compare(password, hash)
  } catch {
    // Fallback for development
    const passwordHash = crypto.createHash('sha256').update(password + (process.env.ADMIN_SESSION_SECRET || 'default-secret')).digest('hex')
    return crypto.timingSafeEqual(Buffer.from(passwordHash), Buffer.from(hash))
  }
}

/**
 * Crée une session admin
 */
export function createAdminSession(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Vérifie si l'utilisateur est authentifié
 */
export function isAuthenticated(request: NextRequest): boolean {
  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value
  if (!session) {
    return false
  }

  // Vérifier que la session est valide (dans une vraie app, vérifier en base de données)
  // Pour MVP, on vérifie juste que le cookie existe
  return true
}

/**
 * Définit le cookie de session
 */
export function setAdminSessionCookie(response: NextResponse, sessionId: string): void {
  response.cookies.set(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000,
    path: '/',
  })
}

/**
 * Supprime le cookie de session
 */
export function clearAdminSessionCookie(response: NextResponse): void {
  response.cookies.delete(SESSION_COOKIE_NAME)
}

/**
 * Vérifie le mot de passe admin depuis les variables d'environnement
 */
export async function verifyAdminPassword(password: string): Promise<boolean> {
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH
  if (!adminPasswordHash) {
    // Si pas de hash configuré, utiliser un mot de passe par défaut (à changer en production)
    const defaultHash = await hashPassword('admin')
    return await verifyPassword(password, defaultHash)
  }

  return await verifyPassword(password, adminPasswordHash)
}

