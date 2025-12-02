'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SidebarItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  href?: string
}

interface SidebarProps {
  items: SidebarItem[]
  activeItem: string
  onItemClick?: (id: string) => void
  isOpen: boolean
  onToggle: () => void
  walletAddress?: string | null
  className?: string
}

export default function Sidebar({
  items,
  activeItem,
  onItemClick,
  isOpen,
  onToggle,
  walletAddress,
  className = '',
}: SidebarProps) {
  // Détecter si on est sur mobile (initialisé à false pour éviter le rendu sur desktop)
  const [isMobile, setIsMobile] = React.useState(false)
  const [isMounted, setIsMounted] = React.useState(false)
  
  React.useEffect(() => {
    setIsMounted(true)
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  return (
    <>
      {/* Backdrop pour mobile seulement quand le menu est ouvert */}
      {/* Sur desktop, ne jamais afficher le backdrop */}
      {isMounted && isOpen && isMobile && (
        <div
          className="sidebar-backdrop mobile-only"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${isOpen ? 'open' : ''} ${className}`}>
        <nav className="sidebar-nav" aria-label="Navigation principale">
          {items.map((item) => {
            const IconComponent = item.icon
            const isActive = activeItem === item.id
            const href = item.href || `#${item.id}`

            // Si href est fourni, utiliser Link, sinon utiliser button
            if (item.href) {
              return (
                <Link
                  key={item.id}
                  href={href}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={item.label}
                  onClick={() => {
                    if (isMobile) {
                      onToggle()
                    }
                    if (onItemClick) {
                      onItemClick(item.id)
                    }
                  }}
                >
                  <span className="nav-icon">
                    <IconComponent />
                  </span>
                  <span className="nav-label">{item.label}</span>
                  {isActive && <span className="nav-indicator" aria-hidden="true" />}
                </Link>
              )
            }

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (onItemClick) {
                    onItemClick(item.id)
                  }
                }}
                className={`nav-item ${isActive ? 'active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
                aria-label={item.label}
              >
                <span className="nav-icon">
                  <IconComponent />
                </span>
                <span className="nav-label">{item.label}</span>
                {isActive && <span className="nav-indicator" aria-hidden="true" />}
              </button>
            )
          })}
        </nav>
      </aside>
    </>
  )
}

