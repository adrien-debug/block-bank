'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import WalletConnect from '@/components/WalletConnect'
import Landing from '@/components/Landing'
import Logo from '@/components/icons/Logo'

declare global {
  interface Window {
    ethereum?: any
  }
}

export default function Home() {
  const [isConnected, setIsConnected] = useState(false)
  const router = useRouter()
  const [kClickCount, setKClickCount] = useState(0)
  const [showL, setShowL] = useState(false)

  useEffect(() => {
    if (showL) {
      const timer = setTimeout(() => {
        setShowL(false)
      }, 10000) // 10 secondes

      return () => clearTimeout(timer)
    }
  }, [showL])

  useEffect(() => {
    // Vérifier la connexion au chargement
    const checkInitialConnection = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' })
          console.log('Initial accounts check:', accounts)
          const connected = accounts.length > 0
          setIsConnected(connected)
          if (connected) {
            router.push('/dashboard')
          }
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
        console.log('Accounts changed:', accounts)
        const connected = accounts.length > 0
        setIsConnected(connected)
        if (connected) {
          router.push('/dashboard')
        } else {
          router.push('/')
        }
      }
      
      window.ethereum.on('accountsChanged', handleAccountsChanged)
      
      return () => {
        if (window.ethereum && window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
        }
      }
    }
  }, [router])

  const handleWalletConnect = (address: string) => {
    console.log('handleWalletConnect called with address:', address)
    setIsConnected(true)
    router.push('/dashboard')
  }

  const handleWalletDisconnect = () => {
    console.log('handleWalletDisconnect called')
    setIsConnected(false)
    router.push('/')
  }

  return (
    <div className="app">
      <header className="app-header">
        {showL && (
          <div className="brazil-flag-animation">
            <div className="brazil-flag">
              <div className="flag-green"></div>
              <div className="flag-yellow"></div>
              <div className="flag-blue-circle"></div>
            </div>
          </div>
        )}
        <div className="header-content">
          <div className="logo">
            <Logo />
            <span className="logo-text">
              <span className={`letter-b ${showL ? 'letter-b-glow' : ''}`}>B</span><span className="letter-white">LOCK</span><span className={`letter-b ${showL ? 'letter-b-glow' : ''}`}>B</span><span className="letter-white">AN</span>
              <span 
                className="letter-white letter-k"
                onClick={() => {
                  const newCount = kClickCount + 1
                  setKClickCount(newCount)
                  if (newCount >= 5) {
                    setShowL(true)
                    setKClickCount(0)
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                K
              </span>
              {showL && <span className="letter-l">L</span>}
            </span>
          </div>
          <WalletConnect 
            onConnect={handleWalletConnect}
            onDisconnect={handleWalletDisconnect}
          />
        </div>
      </header>

      <main className="app-main">
        <Landing />
      </main>
    </div>
  )
}
