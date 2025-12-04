'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface HeaderContextType {
  showHamburger: boolean
  setShowHamburger: (show: boolean) => void
  isMenuOpen: boolean
  setIsMenuOpen: (open: boolean) => void
  onMenuToggle?: () => void
  setOnMenuToggle: (toggle: (() => void) | undefined) => void
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined)

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [showHamburger, setShowHamburger] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [onMenuToggle, setOnMenuToggle] = useState<(() => void) | undefined>(undefined)

  return (
    <HeaderContext.Provider value={{
      showHamburger,
      setShowHamburger,
      isMenuOpen,
      setIsMenuOpen,
      onMenuToggle,
      setOnMenuToggle,
    }}>
      {children}
    </HeaderContext.Provider>
  )
}

export function useHeader() {
  const context = useContext(HeaderContext)
  if (context === undefined) {
    throw new Error('useHeader must be used within a HeaderProvider')
  }
  return context
}

