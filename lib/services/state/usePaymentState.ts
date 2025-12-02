/**
 * Hook de gestion d'état pour les paiements
 * Gère l'état local des paiements et leurs opérations
 */

import { useState, useCallback } from 'react'
import {
  PaymentRequest,
  PaymentResult,
} from '@/types/transaction.types'
import { processLoanPayment, getPaymentStatus } from '../blockchain/paymentService'

export interface UsePaymentStateReturn {
  // État
  payments: PaymentResult[]
  isLoading: boolean
  error: Error | null
  currentPayment: PaymentResult | null

  // Actions
  processPayment: (request: PaymentRequest) => Promise<PaymentResult>
  checkPaymentStatus: (txHash: string) => Promise<void>
  clearCurrentPayment: () => void
  clearError: () => void
}

/**
 * Hook pour gérer l'état des paiements
 */
export function usePaymentState(): UsePaymentStateReturn {
  const [payments, setPayments] = useState<PaymentResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [currentPayment, setCurrentPayment] = useState<PaymentResult | null>(null)

  const processPayment = useCallback(async (request: PaymentRequest) => {
    setIsLoading(true)
    setError(null)
    setCurrentPayment(null)

    try {
      const result = await processLoanPayment(request)
      setCurrentPayment(result)

      if (result.success) {
        setPayments((prev) => [...prev, result])
      }

      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erreur inconnue')
      setError(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const checkPaymentStatus = useCallback(async (txHash: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const status = await getPaymentStatus(txHash)

      if (status.success) {
        // Mettre à jour le paiement correspondant
        setPayments((prev) =>
          prev.map((payment) =>
            payment.txHash === txHash
              ? { ...payment, ...status }
              : payment
          )
        )
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erreur inconnue')
      setError(error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearCurrentPayment = useCallback(() => {
    setCurrentPayment(null)
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    payments,
    isLoading,
    error,
    currentPayment,
    processPayment,
    checkPaymentStatus,
    clearCurrentPayment,
    clearError,
  }
}

