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
    console.log('Connect wallet button clicked')
    
    if (typeof window === 'undefined' || !window.ethereum) {
      alert('Please install MetaMask or another Web3 wallet')
      return
    }

    console.log('MetaMask detected, requesting connection...')
    setIsConnecting(true)
    
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      console.log('Accounts received:', accounts)
      
      if (accounts.length > 0) {
        const connectedAddress = accounts[0]
        console.log('Setting address:', connectedAddress)
        setAddress(connectedAddress)
        if (onConnectRef.current) {
          onConnectRef.current(connectedAddress)
        }
        console.log('Wallet connected successfully:', connectedAddress)
      }
    } catch (error: any) {
      console.error('Connection error:', error)
      if (error.code === 4001) {
        alert('Connection request rejected. Please try again and approve the connection.')
      } else {
        alert('Error connecting to wallet. Please try again.')
      }
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = useCallback(async () => {
    try {
      console.log('Disconnecting wallet...')
      
      // Reset local state immediately
      setAddress(null)
      
      // Notify parent immediately to update UI
      if (onDisconnectRef.current) {
        onDisconnectRef.current()
      }
      
      console.log('Wallet disconnected successfully')
    } catch (error) {
      console.error('Disconnect error:', error)
      // Even if there's an error, reset local state
      setAddress(null)
      if (onDisconnectRef.current) {
        onDisconnectRef.current()
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
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          connectWallet()
        }}
        disabled={isConnecting}
        className="btn-connect-wallet"
        type="button"
        aria-label="Connect Wallet"
      >
        {isConnecting ? (
          <span>
            <span className="connecting-spinner"></span>
            Connecting...
          </span>
        ) : (
          'Connect Wallet'
        )}
      </button>
      {isConnecting && (
        <div className="metamask-overlay-hint">
          <p>Please approve the connection in the MetaMask popup</p>
        </div>
      )}
    </div>
  )
}
