/**
 * Validation par schéma (Zod-like)
 * Validation structurelle des données
 */

export interface SchemaValidationError {
  path: string
  message: string
  value?: unknown
}

export interface SchemaValidationResult {
  isValid: boolean
  errors: SchemaValidationError[]
}

/**
 * Valide qu'une valeur est requise
 */
export function required(value: unknown, fieldName: string): string | null {
  if (value === null || value === undefined || value === '') {
    return `${fieldName} est requis`
  }
  return null
}

/**
 * Valide qu'un nombre est positif
 */
export function positiveNumber(
  value: number,
  fieldName: string
): string | null {
  if (typeof value !== 'number' || value <= 0) {
    return `${fieldName} doit être un nombre positif`
  }
  return null
}

/**
 * Valide qu'un nombre est dans une plage
 */
export function numberRange(
  value: number,
  min: number,
  max: number,
  fieldName: string
): string | null {
  if (typeof value !== 'number' || value < min || value > max) {
    return `${fieldName} doit être entre ${min} et ${max}`
  }
  return null
}

/**
 * Valide qu'une chaîne a une longueur minimale
 */
export function minLength(
  value: string,
  min: number,
  fieldName: string
): string | null {
  if (typeof value !== 'string' || value.length < min) {
    return `${fieldName} doit contenir au moins ${min} caractères`
  }
  return null
}

/**
 * Valide qu'une chaîne a une longueur maximale
 */
export function maxLength(
  value: string,
  max: number,
  fieldName: string
): string | null {
  if (typeof value !== 'string' || value.length > max) {
    return `${fieldName} ne doit pas dépasser ${max} caractères`
  }
  return null
}

/**
 * Valide qu'une valeur est dans une liste d'options
 */
export function oneOf<T>(
  value: T,
  options: T[],
  fieldName: string
): string | null {
  if (!options.includes(value)) {
    return `${fieldName} doit être l'une des valeurs suivantes: ${options.join(', ')}`
  }
  return null
}

/**
 * Valide un email
 */
export function email(value: string, fieldName: string): string | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (typeof value !== 'string' || !emailRegex.test(value)) {
    return `${fieldName} doit être une adresse email valide`
  }
  return null
}

/**
 * Valide une adresse Ethereum
 */
export function ethereumAddress(
  value: string,
  fieldName: string
): string | null {
  const addressRegex = /^0x[a-fA-F0-9]{40}$/
  if (typeof value !== 'string' || !addressRegex.test(value)) {
    return `${fieldName} doit être une adresse Ethereum valide`
  }
  return null
}

/**
 * Valide un hash de transaction
 */
export function transactionHash(
  value: string,
  fieldName: string
): string | null {
  const hashRegex = /^0x[a-fA-F0-9]{64}$/
  if (typeof value !== 'string' || !hashRegex.test(value)) {
    return `${fieldName} doit être un hash de transaction valide`
  }
  return null
}

/**
 * Combine plusieurs validations
 */
export function validate(
  value: unknown,
  validators: Array<(val: unknown, field: string) => string | null>,
  fieldName: string
): string | null {
  for (const validator of validators) {
    const error = validator(value, fieldName)
    if (error) {
      return error
    }
  }
  return null
}




