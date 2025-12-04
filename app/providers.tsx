'use client'

import React from 'react'
import ToastProvider from '@/components/ui/ToastProvider'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { HeaderProvider } from '@/contexts/HeaderContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { ModalProvider } from '@/contexts/ModalContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <HeaderProvider>
        <AuthProvider>
          <ModalProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </ModalProvider>
        </AuthProvider>
      </HeaderProvider>
    </ThemeProvider>
  )
}
