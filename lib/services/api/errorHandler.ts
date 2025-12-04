/**
 * Gestionnaire d'erreurs centralisé pour les appels API
 */

export enum ErrorCode {
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  USER_REJECTED = 'USER_REJECTED',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface ApiError {
  code: ErrorCode
  message: string
  details?: Record<string, unknown>
  originalError?: Error
}

/**
 * Crée une erreur API standardisée
 */
export function createApiError(
  code: ErrorCode,
  message: string,
  details?: Record<string, unknown>,
  originalError?: Error
): ApiError {
  return {
    code,
    message,
    details,
    originalError,
  }
}

/**
 * Gère une erreur et retourne une ApiError standardisée
 */
export function handleApiError(error: unknown): ApiError {
  if (error instanceof Error) {
    // Erreur réseau
    if (error.message.includes('network') || error.message.includes('fetch')) {
      return createApiError(
        ErrorCode.NETWORK_ERROR,
        'Erreur de connexion réseau. Vérifiez votre connexion internet.',
        undefined,
        error
      )
    }

    // Timeout
    if (error.message.includes('timeout')) {
      return createApiError(
        ErrorCode.TIMEOUT,
        'La requête a expiré. Veuillez réessayer.',
        undefined,
        error
      )
    }

    // Erreur de transaction blockchain
    if (error.message.includes('user rejected') || error.message.includes('User denied')) {
      return createApiError(
        ErrorCode.USER_REJECTED,
        'Transaction annulée par l\'utilisateur.',
        undefined,
        error
      )
    }

    if (error.message.includes('insufficient funds') || error.message.includes('balance')) {
      return createApiError(
        ErrorCode.INSUFFICIENT_BALANCE,
        'Solde insuffisant pour effectuer cette transaction.',
        undefined,
        error
      )
    }

    // Erreur générique
    return createApiError(
      ErrorCode.UNKNOWN_ERROR,
      error.message || 'Une erreur inattendue s\'est produite.',
      undefined,
      error
    )
  }

  // Erreur inconnue
  return createApiError(
    ErrorCode.UNKNOWN_ERROR,
    'Une erreur inattendue s\'est produite.',
    { error }
  )
}

/**
 * Obtient un message utilisateur-friendly à partir d'une ApiError
 */
export function getUserFriendlyMessage(error: ApiError): string {
  const messages: Record<ErrorCode, string> = {
    [ErrorCode.NETWORK_ERROR]: 'Erreur de connexion. Vérifiez votre connexion internet.',
    [ErrorCode.TIMEOUT]: 'La requête a expiré. Veuillez réessayer.',
    [ErrorCode.UNAUTHORIZED]: 'Vous devez être connecté pour effectuer cette action.',
    [ErrorCode.FORBIDDEN]: 'Vous n\'avez pas les permissions nécessaires.',
    [ErrorCode.NOT_FOUND]: 'La ressource demandée n\'a pas été trouvée.',
    [ErrorCode.VALIDATION_ERROR]: 'Les données fournies sont invalides.',
    [ErrorCode.SERVER_ERROR]: 'Erreur serveur. Veuillez réessayer plus tard.',
    [ErrorCode.INSUFFICIENT_BALANCE]: 'Solde insuffisant pour effectuer cette transaction.',
    [ErrorCode.TRANSACTION_FAILED]: 'La transaction a échoué. Veuillez réessayer.',
    [ErrorCode.USER_REJECTED]: 'Transaction annulée.',
    [ErrorCode.UNKNOWN_ERROR]: 'Une erreur inattendue s\'est produite.',
  }

  return messages[error.code] || error.message
}






