/**
 * Hook de gestion d'état pour les notifications
 * Gère l'affichage et la gestion des notifications
 */

import { useState, useCallback } from 'react'
import {
  ToastConfig,
  TransactionToast,
  ConfirmationConfig,
} from '@/types/notification.types'

export interface Notification {
  id: string
  type: ToastConfig['type']
  title: string
  message?: string
  timestamp: Date
}

export interface UseNotificationStateReturn {
  // État
  notifications: Notification[]
  activeToasts: ToastConfig[]
  confirmationConfig: ConfirmationConfig | null

  // Actions
  showToast: (config: ToastConfig) => void
  showTransactionToast: (config: TransactionToast) => void
  showConfirmation: (config: ConfirmationConfig) => Promise<boolean>
  dismissToast: (id: string) => void
  clearAllToasts: () => void
  closeConfirmation: () => void
}

/**
 * Hook pour gérer l'état des notifications
 */
export function useNotificationState(): UseNotificationStateReturn {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [activeToasts, setActiveToasts] = useState<ToastConfig[]>([])
  const [confirmationConfig, setConfirmationConfig] =
    useState<ConfirmationConfig | null>(null)

  const showToast = useCallback((config: ToastConfig) => {
    const id = config.id || `toast-${Date.now()}-${Math.random()}`
    const toast: ToastConfig = {
      ...config,
      id,
    }

    setActiveToasts((prev) => [...prev, toast])

    // Ajouter à l'historique
    setNotifications((prev) => [
      {
        id,
        type: config.type,
        title: config.title,
        message: config.message,
        timestamp: new Date(),
      },
      ...prev,
    ])

    // Auto-dismiss si durée spécifiée
    if (config.duration && config.duration > 0) {
      setTimeout(() => {
        dismissToast(id)
      }, config.duration)
    }
  }, [])

  const showTransactionToast = useCallback((config: TransactionToast) => {
    showToast(config)
  }, [showToast])

  const showConfirmation = useCallback(
    (config: ConfirmationConfig): Promise<boolean> => {
      return new Promise((resolve) => {
        const wrappedConfig: ConfirmationConfig = {
          ...config,
          onConfirm: async () => {
            await config.onConfirm()
            setConfirmationConfig(null)
            resolve(true)
          },
          onCancel: () => {
            config.onCancel?.()
            setConfirmationConfig(null)
            resolve(false)
          },
        }

        setConfirmationConfig(wrappedConfig)
      })
    },
    []
  )

  const dismissToast = useCallback((id: string) => {
    setActiveToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const clearAllToasts = useCallback(() => {
    setActiveToasts([])
  }, [])

  const closeConfirmation = useCallback(() => {
    setConfirmationConfig(null)
  }, [])

  return {
    notifications,
    activeToasts,
    confirmationConfig,
    showToast,
    showTransactionToast,
    showConfirmation,
    dismissToast,
    clearAllToasts,
    closeConfirmation,
  }
}







