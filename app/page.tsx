'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Landing from '@/components/Landing'

declare global {
  interface Window {
    ethereum?: any
  }
}

export default function Home() {
  const router = useRouter()
  const [showL, setShowL] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Vérifier la connexion au chargement
    const checkInitialConnection = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' })
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

    // Écouter les changements depuis MetaMask
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
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

  // Générer les positions aléatoires une seule fois quand showL devient true
  const starsData = useMemo(() => {
    if (!showL) return []
    return Array.from({ length: 20 }).map(() => ({
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2
    }))
  }, [showL])

  const popupsData = useMemo(() => {
    if (!showL) return []
    return Array.from({ length: 15 }).map(() => ({
      left: 10 + Math.random() * 80,
      top: 10 + Math.random() * 80,
      delay: Math.random() * 2,
      duration: 1.5 + Math.random() * 1.5,
      scale: 0.3 + Math.random() * 0.4,
      rotate: Math.random() * 360
    }))
  }, [showL])

  return (
    <div className={`app ${showL ? 'brazil-party-mode' : ''}`}>
      {/* Étoiles qui tombent */}
      {showL && (
        <div className="falling-stars">
          {starsData.map((star, i) => (
            <div key={i} className="falling-star" style={{
              left: `${star.left}%`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`
            }}>⭐</div>
          ))}
        </div>
      )}
      {/* Popups Pic1 partout */}
      {showL && (
        <div className="pic1-popups">
          {popupsData.map((popup, i) => (
            <div 
              key={i} 
              className="pic1-popup" 
              style={{
                left: `${popup.left}%`,
                top: `${popup.top}%`,
                animationDelay: `${popup.delay}s`,
                animationDuration: `${popup.duration}s`,
                transform: `scale(${popup.scale}) rotate(${popup.rotate}deg)`
              }}
            >
              <img src="/Pic1.jpg" alt="Pic1" className="pic1-popup-image" />
            </div>
          ))}
        </div>
      )}
      <main className="app-main">
        <Landing />
      </main>
    </div>
  )
}
