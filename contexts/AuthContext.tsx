'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

export interface User {
  id: string
  email: string | null
  first_name: string | null
  last_name: string | null
  address: string | null
  wallet_address: string | null
  role: string | null
  created_at: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (email: string, password: string, firstName: string, lastName: string, address: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  connectWallet: (address: string) => Promise<{ success: boolean; error?: string }>
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth')
      if (response.ok) {
        const data = await response.json()
        if (data.user) {
          setUser(data.user)
        } else {
          setUser(null)
        }
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Erreur vérification session:', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok && data.user) {
        setUser(data.user)
        
        // Redirection automatique selon le rôle
        if (data.user.role === 'admin') {
          router.push('/admin/dashboard')
        } else {
          router.push('/dashboard')
        }
        
        return { success: true }
      } else {
        return { success: false, error: data.error || 'Erreur de connexion' }
      }
    } catch (error) {
      console.error('Erreur login:', error)
      return { success: false, error: 'Erreur de connexion' }
    }
  }

  const register = async (email: string, password: string, firstName: string, lastName: string, address: string) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, firstName, lastName, address }),
      })

      const data = await response.json()

      if (response.ok && data.user) {
        setUser(data.user)
        return { success: true }
      } else {
        return { success: false, error: data.error || "Erreur d'inscription" }
      }
    } catch (error) {
      console.error('Erreur register:', error)
      return { success: false, error: "Erreur d'inscription" }
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
    } catch (error) {
      console.error('Erreur logout:', error)
      setUser(null)
    }
  }

  const connectWallet = async (address: string) => {
    try {
      const response = await fetch('/api/auth/connect-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: address }),
      })

      const data = await response.json()

      if (response.ok && data.user) {
        setUser(data.user)
        
        // Redirection automatique selon le rôle
        if (data.user.role === 'admin') {
          router.push('/admin/dashboard')
        } else {
          router.push('/dashboard')
        }
        
        return { success: true }
      } else {
        return { success: false, error: data.error || 'Erreur de connexion wallet' }
      }
    } catch (error) {
      console.error('Erreur connectWallet:', error)
      return { success: false, error: 'Erreur de connexion wallet' }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        connectWallet,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

