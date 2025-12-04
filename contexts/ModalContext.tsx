'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import LoginModal from '@/components/ui/LoginModal'
import RegistrationModal from '@/components/ui/RegistrationModal'

interface ModalContextType {
  isLoginModalOpen: boolean
  isRegistrationModalOpen: boolean
  openLoginModal: () => void
  openRegistrationModal: () => void
  closeAllModals: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false)

  const openLoginModal = () => {
    setIsRegistrationModalOpen(false) // Fermer l'autre modal si elle est ouverte
    setIsLoginModalOpen(true)
  }

  const openRegistrationModal = () => {
    setIsLoginModalOpen(false) // Fermer l'autre modal si elle est ouverte
    setIsRegistrationModalOpen(true)
  }

  const closeAllModals = () => {
    setIsLoginModalOpen(false)
    setIsRegistrationModalOpen(false)
  }

  return (
    <ModalContext.Provider
      value={{
        isLoginModalOpen,
        isRegistrationModalOpen,
        openLoginModal,
        openRegistrationModal,
        closeAllModals,
      }}
    >
      {children}
      {/* Rendre les modales directement dans le body via portal */}
      {typeof window !== 'undefined' && createPortal(
        <>
          <LoginModal
            isOpen={isLoginModalOpen}
            onClose={closeAllModals}
          />
          <RegistrationModal
            isOpen={isRegistrationModalOpen}
            onClose={closeAllModals}
          />
        </>,
        document.body
      )}
    </ModalContext.Provider>
  )
}

export function useModal() {
  const context = useContext(ModalContext)
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider')
  }
  return context
}

