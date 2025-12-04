'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Sidebar from '@/components/ui/Sidebar'
import DashboardIcon from '@/components/icons/DashboardIcon'
import DocumentIcon from '@/components/icons/DocumentIcon'
import ChartIcon from '@/components/icons/ChartIcon'
import { useWindowSize } from '@/hooks/useWindowSize'
import '../../styles/admin-marketing.css'
import '../../styles/dashboard.css'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(true)
  const { isMobile, isMounted } = useWindowSize()

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

  // Sur desktop, le menu est toujours ouvert
  useEffect(() => {
    if (!isMobile) {
      setIsMenuOpen(true)
    }
  }, [isMobile])

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

  // Déterminer l'item actif basé sur le pathname
  const getActiveItem = () => {
    if (pathname === '/admin/dashboard' || pathname.startsWith('/admin/dashboard')) {
      return 'dashboard'
    }
    if (pathname === '/admin/submissions' || pathname.startsWith('/admin/submissions')) {
      return 'submissions'
    }
    if (pathname === '/admin/marketing' || pathname.startsWith('/admin/marketing')) {
      return 'marketing'
    }
    return 'dashboard'
  }

  const navItems = [
    { id: 'dashboard', href: '/admin/dashboard', label: 'Dashboard', icon: DashboardIcon },
    { id: 'submissions', href: '/admin/submissions', label: 'Submissions', icon: DocumentIcon },
    { id: 'marketing', href: '/admin/marketing', label: 'Marketing', icon: ChartIcon },
  ]

  return (
    <div className="dashboard admin-dashboard" style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'var(--color-bg-primary)',
    }}>
      {/* Sidebar */}
      <Sidebar
        items={navItems.map(item => ({
          id: item.id,
          label: item.label,
          icon: item.icon,
          href: item.href,
        }))}
        activeItem={getActiveItem()}
        isOpen={isMenuOpen}
        onToggle={() => setIsMenuOpen(!isMenuOpen)}
        className="admin-sidebar"
      />

      {/* Main Content Area */}
      <div className="dashboard-content" style={{
        flex: 1,
        marginLeft: isMounted && !isMobile && isMenuOpen ? 'var(--sidebar-width)' : '0',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        transition: 'margin-left 0.3s ease',
      }}>
        {/* Main Content */}
        <main style={{
          flex: 1,
          padding: 'var(--space-6)',
          maxWidth: '1400px',
          margin: '0 auto',
          width: '100%',
          background: 'var(--color-bg-primary)',
        }}>
          {children}
        </main>
      </div>
    </div>
  )
}

