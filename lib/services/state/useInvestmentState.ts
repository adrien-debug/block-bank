/**
 * Hook de gestion d'état pour les investissements
 * Gère l'état local des investissements et leurs opérations
 */

import { useState, useCallback } from 'react'
import {
  DepositRequest,
  DepositResult,
  WithdrawRequest,
  WithdrawResult,
  InvestmentStatus,
} from '@/types/transaction.types'
import {
  depositToPool,
  withdrawFromPool,
  getInvestmentStatus,
} from '../blockchain/investmentService'

export interface UseInvestmentStateReturn {
  // État
  investments: InvestmentStatus[]
  isLoading: boolean
  error: Error | null

  // Actions
  deposit: (request: DepositRequest) => Promise<DepositResult>
  withdraw: (request: WithdrawRequest) => Promise<WithdrawResult>
  fetchInvestment: (investmentId: string) => Promise<InvestmentStatus | null>
  refreshInvestments: () => Promise<void>
  clearError: () => void
}

/**
 * Hook pour gérer l'état des investissements
 */
export function useInvestmentState(): UseInvestmentStateReturn {
  const [investments, setInvestments] = useState<InvestmentStatus[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const deposit = useCallback(async (request: DepositRequest) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await depositToPool(request)

      if (result.success && result.investmentId) {
        // Récupérer l'investissement créé
        const investment = await getInvestmentStatus(result.investmentId)
        if (investment) {
          setInvestments((prev) => [...prev, investment])
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
  }, [])

  const withdraw = useCallback(async (request: WithdrawRequest) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await withdrawFromPool(request)

      if (result.success) {
        // Mettre à jour l'investissement
        setInvestments((prev) =>
          prev.map((inv) =>
            inv.investmentId === request.investmentId
              ? { ...inv, status: 'WITHDRAWN' as const }
              : inv
          )
        )
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

  const fetchInvestment = useCallback(
    async (investmentId: string) => {
      setIsLoading(true)
      setError(null)

      try {
        const investment = await getInvestmentStatus(investmentId)
        return investment
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Erreur inconnue')
        setError(error)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  const refreshInvestments = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Dans une vraie implémentation, on ferait un appel API
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
    investments,
    isLoading,
    error,
    deposit,
    withdraw,
    fetchInvestment,
    refreshInvestments,
    clearError,
  }
}

