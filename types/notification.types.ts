/**
 * Types pour le système de notifications
 */

export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'loading'

export type ToastPosition = 
  | 'top-left' 
  | 'top-right' 
  | 'top-center' 
  | 'bottom-left' 
  | 'bottom-right' 
  | 'bottom-center'

/**
 * Configuration d'une notification toast
 */
export interface ToastConfig {
  id?: string
  type: NotificationType
  title: string
  message?: string
  duration?: number // En millisecondes, 0 = persistant
  position?: ToastPosition
  action?: {
    label: string
    onClick: () => void
  }
  onClose?: () => void
}

/**
 * Notification de transaction
 */
export interface TransactionToast extends ToastConfig {
  txHash?: string
  explorerUrl?: string
  status: 'pending' | 'confirmed' | 'failed'
  confirmations?: number
}

/**
 * Configuration d'une modal de confirmation
 */
export interface ConfirmationConfig {
  title: string
  message: string
  details?: Array<{ label: string; value: string | number }>
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'default' | 'danger' | 'warning'
  onConfirm: () => void | Promise<void>
  onCancel?: () => void
}

/**
 * État d'une transaction en cours
 */
export interface TransactionState {
  isProcessing: boolean
  isSuccess: boolean
  isError: boolean
  error?: Error | string
  txHash?: string
  progress?: number // 0-100
  message?: string
}

