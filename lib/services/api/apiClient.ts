/**
 * Client API centralisé
 * Gère toutes les requêtes HTTP avec gestion d'erreurs
 */

import { handleApiError, ErrorCode, ApiError } from './errorHandler'

export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: unknown
  timeout?: number
}

/**
 * Effectue une requête HTTP avec gestion d'erreurs
 */
export async function apiRequest<T>(
  url: string,
  config: RequestConfig = {}
): Promise<T> {
  const {
    method = 'GET',
    headers = {},
    body,
    timeout = 30000,
  } = config

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      
      let errorCode = ErrorCode.SERVER_ERROR
      if (response.status === 401) errorCode = ErrorCode.UNAUTHORIZED
      else if (response.status === 403) errorCode = ErrorCode.FORBIDDEN
      else if (response.status === 404) errorCode = ErrorCode.NOT_FOUND
      else if (response.status === 400) errorCode = ErrorCode.VALIDATION_ERROR

      throw handleApiError({
        code: errorCode,
        message: errorData.message || `HTTP ${response.status}`,
        details: errorData,
      } as ApiError)
    }

    return await response.json()
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw handleApiError({
        code: ErrorCode.TIMEOUT,
        message: 'La requête a expiré',
      } as ApiError)
    }

    throw handleApiError(error)
  }
}

/**
 * GET request
 */
export async function get<T>(url: string, headers?: Record<string, string>): Promise<T> {
  return apiRequest<T>(url, { method: 'GET', headers })
}

/**
 * POST request
 */
export async function post<T>(
  url: string,
  body?: unknown,
  headers?: Record<string, string>
): Promise<T> {
  return apiRequest<T>(url, { method: 'POST', body, headers })
}

/**
 * PUT request
 */
export async function put<T>(
  url: string,
  body?: unknown,
  headers?: Record<string, string>
): Promise<T> {
  return apiRequest<T>(url, { method: 'PUT', body, headers })
}

/**
 * DELETE request
 */
export async function del<T>(url: string, headers?: Record<string, string>): Promise<T> {
  return apiRequest<T>(url, { method: 'DELETE', headers })
}




