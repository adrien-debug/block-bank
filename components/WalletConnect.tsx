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
          console.error('Connection verification error:', error)
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
      alert('Please install MetaMask or another Web3 wallet')
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
      console.error('Connection error:', error)
      alert('Error connecting to wallet')
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = useCallback(async () => {
    // Reset local state immediately
    setAddress(null)
    
    // Notify parent immediately to update UI
    if (onDisconnectRef.current) {
      onDisconnectRef.current()
    }
    
    // Check MetaMask state (for debug)
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        // Note: MetaMask does not allow programmatic disconnection
        // but our local state is already updated
        console.log('MetaMask state after disconnect:', accounts.length > 0 ? 'Still connected' : 'Disconnected')
      } catch (error) {
        console.error('Error during verification:', error)
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
          Disconnect
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
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </button>
    </div>
  )
}
