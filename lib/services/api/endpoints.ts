/**
 * Configuration des endpoints API
 * Centralise toutes les URLs des endpoints
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.blockbank.com'

export const endpoints = {
  // Prêts
  loans: {
    list: `${API_BASE_URL}/loans`,
    get: (id: string) => `${API_BASE_URL}/loans/${id}`,
    create: `${API_BASE_URL}/loans`,
    pay: (id: string) => `${API_BASE_URL}/loans/${id}/pay`,
    repay: (id: string) => `${API_BASE_URL}/loans/${id}/repay`,
    renewInsurance: (id: string) => `${API_BASE_URL}/loans/${id}/insurance/renew`,
  },

  // Paiements
  payments: {
    create: `${API_BASE_URL}/payments`,
    get: (id: string) => `${API_BASE_URL}/payments/${id}`,
    status: (txHash: string) => `${API_BASE_URL}/payments/status/${txHash}`,
  },

  // Investissements
  investments: {
    pools: `${API_BASE_URL}/investment/pools`,
    pool: (id: string) => `${API_BASE_URL}/investment/pools/${id}`,
    deposit: `${API_BASE_URL}/investment/deposit`,
    withdraw: `${API_BASE_URL}/investment/withdraw`,
    myInvestments: `${API_BASE_URL}/investment/my-investments`,
    investment: (id: string) => `${API_BASE_URL}/investment/${id}`,
  },

  // NFT & Tokenisation
  nft: {
    list: `${API_BASE_URL}/nft`,
    get: (id: string) => `${API_BASE_URL}/nft/${id}`,
    tokenize: `${API_BASE_URL}/nft/tokenize`,
    lock: (id: string) => `${API_BASE_URL}/nft/${id}/lock`,
    unlock: (id: string) => `${API_BASE_URL}/nft/${id}/unlock`,
  },

  // Assurance
  insurance: {
    create: `${API_BASE_URL}/insurance`,
    get: (id: string) => `${API_BASE_URL}/insurance/${id}`,
    renew: (id: string) => `${API_BASE_URL}/insurance/${id}/renew`,
    update: (id: string) => `${API_BASE_URL}/insurance/${id}`,
    claim: (id: string) => `${API_BASE_URL}/insurance/${id}/claim`,
  },

  // Transactions
  transactions: {
    get: (txHash: string) => `${API_BASE_URL}/transactions/${txHash}`,
    status: (txHash: string) => `${API_BASE_URL}/transactions/${txHash}/status`,
    history: `${API_BASE_URL}/transactions/history`,
  },

  // Credit Score
  creditScore: {
    get: `${API_BASE_URL}/credit-score`,
    history: `${API_BASE_URL}/credit-score/history`,
    update: `${API_BASE_URL}/credit-score/update`,
    export: (format: string) => `${API_BASE_URL}/credit-score/export/${format}`,
  },
} as const

/**
 * Génère une URL d'explorateur blockchain
 */
export function getExplorerUrl(
  txHash: string,
  network: 'mainnet' | 'testnet' = 'mainnet'
): string {
  const baseUrls = {
    mainnet: 'https://etherscan.io',
    testnet: 'https://sepolia.etherscan.io',
  }

  return `${baseUrls[network]}/tx/${txHash}`
}

/**
 * Génère une URL d'explorateur pour une adresse
 */
export function getAddressExplorerUrl(
  address: string,
  network: 'mainnet' | 'testnet' = 'mainnet'
): string {
  const baseUrls = {
    mainnet: 'https://etherscan.io',
    testnet: 'https://sepolia.etherscan.io',
  }

  return `${baseUrls[network]}/address/${address}`
}

