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
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' }).then((accounts: string[]) => {
        setIsConnected(accounts.length > 0)
      }).catch(() => {
        // Ignorer les erreurs silencieusement
      })

      // Écouter les changements de compte
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

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <Logo />
            <span className="logo-text">BLOCKBANK</span>
          </div>
          <WalletConnect />
        </div>
      </header>

      <main className="app-main">
        {isConnected ? <Dashboard /> : <Landing />}
      </main>
    </div>
  )
}
