'use client'

import React from 'react'
import ToastProvider from '@/components/ui/ToastProvider'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { HeaderProvider } from '@/contexts/HeaderContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <HeaderProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </HeaderProvider>
    </ThemeProvider>
  )
}
