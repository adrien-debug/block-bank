'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Force light mode always
    setTheme('light')
    applyTheme('light')
    // Remove any dark theme from localStorage
    localStorage.removeItem('theme')
    
    // Continuously monitor and remove dark class if it appears
    const observer = new MutationObserver(() => {
      if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark')
      }
    })
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
    
    return () => observer.disconnect()
  }, [])

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement
    // Always force light mode - never add dark class
    root.classList.remove('dark')
  }

  const toggleTheme = () => {
    // Disabled - always stay in light mode
    // Do nothing
  }

  // Toujours retourner le Provider, même avant le montage
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

