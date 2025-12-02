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
  const manuallyDisconnectedRef = useRef(false)
  const isInitialMountRef = useRef(true)

  // Mettre à jour les refs quand les callbacks changent
  useEffect(() => {
    onConnectRef.current = onConnect
    onDisconnectRef.current = onDisconnect
  }, [onConnect, onDisconnect])

  useEffect(() => {
    // Vérifier si on a déconnecté manuellement depuis localStorage
    const wasManuallyDisconnected = localStorage.getItem('wallet_manually_disconnected') === 'true'
    manuallyDisconnectedRef.current = wasManuallyDisconnected

    // Vérifier si le wallet est déjà connecté (seulement au montage initial)
    if (typeof window !== 'undefined' && window.ethereum && isInitialMountRef.current) {
      const checkConnection = async () => {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' })
          console.log('WalletConnect: Initial accounts check:', accounts, 'Manually disconnected:', wasManuallyDisconnected)
          if (accounts.length > 0 && !wasManuallyDisconnected) {
            const account = accounts[0]
            console.log('WalletConnect: Setting address and calling onConnect:', account)
            setAddress(account)
            if (onConnectRef.current) {
              onConnectRef.current(account)
            }
          } else {
            console.log('WalletConnect: No accounts found or manually disconnected, setting address to null')
            setAddress(null)
          }
        } catch (error) {
          console.error('Connection verification error:', error)
          setAddress(null)
        }
      }

      checkConnection()
      isInitialMountRef.current = false
    }
  }, [])

  useEffect(() => {
    // Écouter les changements de compte (déconnexion depuis MetaMask)
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        console.log('Accounts changed event:', accounts, 'Manually disconnected:', manuallyDisconnectedRef.current)
        
        // Si on a déconnecté manuellement, ignorer les événements jusqu'à ce qu'on reconnecte manuellement
        if (manuallyDisconnectedRef.current) {
          console.log('Ignoring accountsChanged because of manual disconnect')
          return
        }
        
        if (accounts.length === 0) {
          console.log('No accounts, disconnecting...')
          setAddress(null)
          setTimeout(() => {
            if (onDisconnectRef.current) {
              onDisconnectRef.current()
            }
          }, 100)
        } else {
          const newAddress = accounts[0]
          console.log('New account:', newAddress)
          setAddress((prevAddress) => {
            if (newAddress !== prevAddress) {
              console.log('Account changed from', prevAddress, 'to', newAddress)
              setTimeout(() => {
                if (onConnectRef.current) {
                  onConnectRef.current(newAddress)
                }
              }, 100)
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
    
    // Réinitialiser le flag de déconnexion manuelle
    manuallyDisconnectedRef.current = false
    localStorage.removeItem('wallet_manually_disconnected')
    
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      console.log('Accounts received:', accounts)
      
      if (accounts && accounts.length > 0) {
        const connectedAddress = accounts[0]
        console.log('Setting address:', connectedAddress)
        
        // Mettre à jour l'état local
        setAddress(connectedAddress)
        
        // Appeler le callback avec un petit délai pour s'assurer que l'état est mis à jour
        setTimeout(() => {
          if (onConnectRef.current) {
            console.log('Executing onConnect callback with:', connectedAddress)
            try {
              onConnectRef.current(connectedAddress)
              console.log('onConnect callback executed successfully')
            } catch (error) {
              console.error('Error executing onConnect callback:', error)
            }
          }
        }, 100)
        
        console.log('Wallet connected successfully:', connectedAddress)
      } else {
        console.warn('No accounts returned from eth_requestAccounts')
        setAddress(null)
      }
    } catch (error: any) {
      console.error('Connection error:', error)
      setAddress(null)
      if (error.code === 4001) {
        alert('Connection request rejected. Please try again and approve the connection.')
      } else if (error.code === -32002) {
        alert('A connection request is already pending. Please check MetaMask.')
      } else {
        alert('Error connecting to wallet. Please try again.')
      }
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = useCallback(async () => {
    try {
      console.log('Disconnecting wallet from MetaMask...')
      
      // Révoquer les permissions dans MetaMask
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          // Révoquer les permissions pour eth_accounts
          await window.ethereum.request({
            method: 'wallet_revokePermissions',
            params: [
              {
                eth_accounts: {}
              }
            ]
          })
          console.log('MetaMask permissions revoked successfully')
        } catch (revokeError: any) {
          // Si la méthode n'est pas supportée ou échoue, continuer quand même
          console.warn('Could not revoke permissions (may not be supported):', revokeError)
          // Certaines versions de MetaMask peuvent ne pas supporter cette méthode
          // On continue quand même avec la déconnexion locale
        }
      }
      
      // Marquer comme déconnecté manuellement pour éviter la reconnexion automatique
      manuallyDisconnectedRef.current = true
      localStorage.setItem('wallet_manually_disconnected', 'true')
      
      // Reset local state immediately
      setAddress(null)
      
      // Notify parent with a small delay to ensure state is updated
      setTimeout(() => {
        if (onDisconnectRef.current) {
          console.log('Executing onDisconnect callback')
          try {
            onDisconnectRef.current()
            console.log('onDisconnect callback executed successfully')
          } catch (error) {
            console.error('Error executing onDisconnect callback:', error)
          }
        }
      }, 100)
      
      console.log('Wallet disconnected successfully')
    } catch (error) {
      console.error('Disconnect error:', error)
      // Even if there's an error, reset local state and mark as manually disconnected
      manuallyDisconnectedRef.current = true
      localStorage.setItem('wallet_manually_disconnected', 'true')
      setAddress(null)
      setTimeout(() => {
        if (onDisconnectRef.current) {
          onDisconnectRef.current()
        }
      }, 100)
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
    <div className="wallet-connect" style={{ position: 'relative', zIndex: 1000 }}>
      <button
        onClick={(e) => {
          console.log('Button clicked!', e)
          e.preventDefault()
          e.stopPropagation()
          connectWallet()
        }}
        onMouseDown={(e) => {
          console.log('Button mouse down!', e)
        }}
        disabled={isConnecting}
        className="btn-connect-wallet"
        type="button"
        aria-label="Connect Wallet"
        style={{ 
          position: 'relative',
          zIndex: 1001,
          pointerEvents: isConnecting ? 'none' : 'auto',
          cursor: isConnecting ? 'not-allowed' : 'pointer'
        }}
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
