'use client'

import { useState, useEffect } from 'react'
import WalletConnect from '@/components/WalletConnect'
import Dashboard from '@/components/Dashboard'
import Landing from '@/components/Landing'
import Logo from '@/components/icons/Logo'

declare global {
  interface Window {
    ethereum?: any
  }
}

export default function Home() {
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Vérifier la connexion au chargement
    const checkInitialConnection = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' })
          setIsConnected(accounts.length > 0)
        } catch (error) {
          console.error('Erreur vérification connexion initiale:', error)
          setIsConnected(false)
        }
      }
    }
    
    checkInitialConnection()

    // Écouter aussi les changements depuis MetaMask directement
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        setIsConnected(accounts.length > 0)
      }
      
      window.ethereum.on('accountsChanged', handleAccountsChanged)
      
      return () => {
        if (window.ethereum && window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
        }
      }
    }
  }, [])

  const handleWalletConnect = (address: string) => {
    setIsConnected(true)
  }

  const handleWalletDisconnect = () => {
    setIsConnected(false)
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <Logo />
            <span className="logo-text">BLOCKBANK</span>
          </div>
          <WalletConnect 
            onConnect={handleWalletConnect}
            onDisconnect={handleWalletDisconnect}
          />
        </div>
      </header>

      <main className="app-main">
        {isConnected ? <Dashboard /> : <Landing />}
      </main>
    </div>
  )
}
