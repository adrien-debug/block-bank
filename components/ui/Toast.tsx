'use client'

import { ToastType } from './ToastProvider'

interface ToastProps {
  type: ToastType
  title: string
  message?: string
  onClose: () => void
}

export default function Toast({ type, title, message, onClose }: ToastProps) {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓'
      case 'error':
        return '✕'
      case 'warning':
        return '⚠'
      case 'info':
        return 'ℹ'
      default:
        return 'ℹ'
    }
  }

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-icon">{getIcon()}</div>
      <div className="toast-content">
        <div className="toast-title">{title}</div>
        {message && <div className="toast-message">{message}</div>}
      </div>
      <button className="toast-close" onClick={onClose} aria-label="Fermer">
        ✕
      </button>
    </div>
  )
}
