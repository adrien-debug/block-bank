'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { isAuthenticated } from '@/lib/utils/adminAuth'
import '../../styles/admin-marketing.css'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Vérifier l'authentification
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/auth', {
          method: 'GET',
          credentials: 'include',
        })
        if (response.ok) {
          setIsAuthenticatedState(true)
        } else {
          if (pathname !== '/admin/login') {
            router.push('/admin/login')
          }
        }
      } catch (error) {
        console.error('Auth check error:', error)
        if (pathname !== '/admin/login') {
          router.push('/admin/login')
        }
      } finally {
        setIsLoading(false)
      }
    }

    if (pathname !== '/admin/login') {
      checkAuth()
    } else {
      setIsLoading(false)
    }
  }, [pathname, router])

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'logout' }),
      })
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <p>Chargement...</p>
      </div>
    )
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/submissions', label: 'Submissions', icon: '📝' },
    { href: '/admin/marketing', label: 'Marketing', icon: '📱' },
  ]

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--color-bg-primary)',
    }}>
      {/* Header */}
      <header style={{
        borderBottom: '1px solid var(--color-border-default)',
        background: 'var(--color-bg-secondary)',
        padding: 'var(--space-4) var(--space-6)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1400px',
          margin: '0 auto',
          width: '100%',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <h1 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>
              BlockBank Admin
            </h1>
            <nav style={{ display: 'flex', gap: 'var(--space-2)' }}>
              {navItems.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== '/admin' && pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{
                      padding: 'var(--space-2) var(--space-4)',
                      borderRadius: 'var(--radius-md)',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: isActive ? '600' : '400',
                      color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                      background: isActive ? 'var(--color-bg-primary)' : 'transparent',
                      border: isActive ? '1px solid var(--color-border-default)' : '1px solid transparent',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span style={{ marginRight: 'var(--space-2)' }}>{item.icon}</span>
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>
          <Button variant="secondary" onClick={handleLogout} size="small">
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        flex: 1,
        padding: 'var(--space-6)',
        maxWidth: '1400px',
        margin: '0 auto',
        width: '100%',
      }}>
        {children}
      </main>
    </div>
  )
}

