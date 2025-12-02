export function formatAddress(address: string): string {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function formatBalance(balance: bigint, decimals: number = 18): string {
  const divisor = BigInt(10 ** decimals)
  const whole = balance / divisor
  const fraction = balance % divisor
  return `${whole.toString()}.${fraction.toString().padStart(decimals, '0').slice(0, 2)}`
}

/**
 * Formate un nombre avec une locale fixe (en-US) pour éviter les erreurs d'hydratation
 * Le serveur et le client utiliseront toujours le même formatage
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

/**
 * Formate une date avec une locale fixe pour éviter les erreurs d'hydratation
 * Utilise 'fr-FR' pour un formatage cohérent entre serveur et client
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  }
  return new Intl.DateTimeFormat('fr-FR', defaultOptions).format(dateObj)
}

/**
 * Formate une date courte (JJ/MM/AAAA) avec une locale fixe
 */
export function formatDateShort(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(dateObj)
}

/**
 * Formate une date longue en anglais pour l'affichage dans le header
 */
export function formatDateLong(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}







