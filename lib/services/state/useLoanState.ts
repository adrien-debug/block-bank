/**
 * Hook de gestion d'état pour les prêts
 * Gère l'état local des prêts et leurs opérations
 */

import { useState, useCallback } from 'react'
import { Loan } from '@/types'
import { LoanResult } from '@/types/transaction.types'
import { createLoan, getLoan } from '../blockchain/loanService'

export interface UseLoanStateReturn {
  // État
  loans: Loan[]
  isLoading: boolean
  error: Error | null

  // Actions
  createNewLoan: (request: Parameters<typeof createLoan>[0]) => Promise<LoanResult>
  fetchLoan: (loanId: string) => Promise<Loan | null>
  refreshLoans: () => Promise<void>
  clearError: () => void
}

/**
 * Hook pour gérer l'état des prêts
 */
export function useLoanState(): UseLoanStateReturn {
  const [loans, setLoans] = useState<Loan[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const createNewLoan = useCallback(
    async (request: Parameters<typeof createLoan>[0]) => {
      setIsLoading(true)
      setError(null)

      try {
        const result = await createLoan(request)

        if (result.success && result.loanId) {
          // Récupérer le prêt créé (simulation)
          // Dans une vraie implémentation, on ferait un appel API
          const newLoan = await getLoan(result.loanId)
          if (newLoan) {
            setLoans((prev) => [...prev, newLoan])
          }
        }

        return result
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Erreur inconnue')
        setError(error)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  const fetchLoan = useCallback(async (loanId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const loan = await getLoan(loanId)
      return loan
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erreur inconnue')
      setError(error)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const refreshLoans = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Dans une vraie implémentation, on ferait un appel API pour récupérer tous les prêts
      // Pour l'instant, on garde l'état local
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erreur inconnue')
      setError(error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    loans,
    isLoading,
    error,
    createNewLoan,
    fetchLoan,
    refreshLoans,
    clearError,
  }
}

