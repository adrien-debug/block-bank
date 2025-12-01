'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { formatAddress } from '@/lib/utils'
import WalletIcon from './icons/WalletIcon'

declare global {
  interface Window {
    ethereum?: any
  }
}

interface WalletConnectProps {
  onConnect?: (address: string) => void
  onDisconnect?: () => void
}

export default function WalletConnect({ onConnect, onDisconnect }: WalletConnectProps) {
  const [address, setAddress] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const onConnectRef = useRef(onConnect)
  const onDisconnectRef = useRef(onDisconnect)

  // Mettre à jour les refs quand les callbacks changent
  useEffect(() => {
    onConnectRef.current = onConnect
    onDisconnectRef.current = onDisconnect
  }, [onConnect, onDisconnect])

  useEffect(() => {
    // Vérifier si le wallet est déjà connecté
    if (typeof window !== 'undefined' && window.ethereum) {
      const checkConnection = async () => {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' })
          if (accounts.length > 0) {
            const account = accounts[0]
            setAddress(account)
            if (onConnectRef.current) {
              onConnectRef.current(account)
            }
          } else {
            setAddress(null)
            if (onDisconnectRef.current) {
              onDisconnectRef.current()
            }
          }
        } catch (error) {
          console.error('Erreur vérification connexion:', error)
        }
      }

      checkConnection()

      // Écouter les changements de compte (déconnexion depuis MetaMask)
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          setAddress(null)
          if (onDisconnectRef.current) {
            onDisconnectRef.current()
          }
        } else {
          const newAddress = accounts[0]
          setAddress((prevAddress) => {
            if (newAddress !== prevAddress) {
              if (onConnectRef.current) {
                onConnectRef.current(newAddress)
              }
              return newAddress
            }
            return prevAddress
          })
        }
      }

      window.ethereum.on('accountsChanged', handleAccountsChanged)

      return () => {
        if (window.ethereum && window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
        }
      }
    }
  }, [])

  const connectWallet = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      alert('Veuillez installer MetaMask ou un autre wallet Web3')
      return
    }

    setIsConnecting(true)
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      if (accounts.length > 0) {
        setAddress(accounts[0])
        if (onConnect) {
          onConnect(accounts[0])
        }
      }
    } catch (error) {
      console.error('Erreur de connexion:', error)
      alert('Erreur lors de la connexion au wallet')
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = useCallback(async () => {
    // Réinitialiser l'état local immédiatement
    setAddress(null)
    
    // Notifier le parent immédiatement pour mettre à jour l'UI
    if (onDisconnectRef.current) {
      onDisconnectRef.current()
    }
    
    // Vérifier l'état de MetaMask (pour debug)
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        // Note: MetaMask ne permet pas de déconnecter programmatiquement
        // mais notre état local est déjà mis à jour
        console.log('État MetaMask après déconnexion:', accounts.length > 0 ? 'Toujours connecté' : 'Déconnecté')
      } catch (error) {
        console.error('Erreur lors de la vérification:', error)
      }
    }
  }, [])

  if (address) {
    return (
      <div className="wallet-connected">
        <div className="wallet-address">
          <WalletIcon />
          <span>{formatAddress(address)}</span>
        </div>
        <button onClick={disconnect} className="btn-disconnect">
          Déconnecter
        </button>
      </div>
    )
  }

  return (
    <div className="wallet-connect">
      <button
        onClick={connectWallet}
        disabled={isConnecting}
        className="btn-connect-wallet"
      >
        {isConnecting ? 'Connexion...' : 'Connecter Wallet'}
      </button>
    </div>
  )
}
