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



