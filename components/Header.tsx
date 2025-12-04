'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import WalletConnect from '@/components/WalletConnect'
import Logo from '@/components/icons/Logo'
import { useHeader } from '@/contexts/HeaderContext'

declare global {
  interface Window {
    ethereum?: any
  }
}

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const { showHamburger, isMenuOpen, onMenuToggle } = useHeader()
  const [kClickCount, setKClickCount] = useState(0)
  const [showL, setShowL] = useState(false)
  const [audioError, setAudioError] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const manuallyDisconnectedRef = useRef(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (showL) {
      // Créer l'élément audio pour la samba brésilienne
      const audio = new Audio('/samba-music.mp3')
      audio.volume = 0.7
      audio.loop = false
      audioRef.current = audio

      // Gérer les événements audio
      const handleCanPlay = () => {
        console.log('🎵 Audio prêt à jouer!')
        const playPromise = audio.play()
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('🎵 Samba music playing!')
            })
            .catch(err => {
              console.error('Erreur de lecture audio (peut nécessiter une interaction utilisateur):', err)
            })
        }
      }

      const handleError = (e: Event) => {
        console.error('❌ Erreur de chargement audio. Assurez-vous que samba-music.mp3 existe dans public/', e)
        setAudioError(true)
      }

      audio.addEventListener('canplay', handleCanPlay)
      audio.addEventListener('error', handleError)
      
      // Charger l'audio
      audio.load()

      const timer = setTimeout(() => {
        setShowL(false)
        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current.currentTime = 0
        }
      }, 10000) // 10 secondes

      return () => {
        clearTimeout(timer)
        audio.removeEventListener('canplay', handleCanPlay)
        audio.removeEventListener('error', handleError)
        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current.currentTime = 0
          audioRef.current = null
        }
        setAudioError(false)
      }
    } else {
      setAudioError(false)
    }
  }, [showL])

  useEffect(() => {
    // Vérifier si on a déconnecté manuellement
    const wasManuallyDisconnected = localStorage.getItem('wallet_manually_disconnected') === 'true'
    manuallyDisconnectedRef.current = wasManuallyDisconnected

    // Vérifier la connexion au chargement seulement si pas déconnecté manuellement
    const checkInitialConnection = async () => {
      if (typeof window !== 'undefined' && window.ethereum && !wasManuallyDisconnected) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' })
          const connected = accounts.length > 0
          setIsConnected(connected)
        } catch (error) {
          console.error('Erreur vérification connexion initiale:', error)
          setIsConnected(false)
        }
      } else {
        setIsConnected(false)
      }
    }
    
    checkInitialConnection()

    // Écouter aussi les changements depuis MetaMask directement
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        // Ignorer si on a déconnecté manuellement
        if (manuallyDisconnectedRef.current) {
          return
        }
        
        const connected = accounts.length > 0
        setIsConnected(connected)
      }
      
      window.ethereum.on('accountsChanged', handleAccountsChanged)
      
      return () => {
        if (window.ethereum && window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
        }
      }
    }
  }, [])

  const handleWalletConnect = useCallback((address: string) => {
    console.log('Header: handleWalletConnect called with address:', address)
    manuallyDisconnectedRef.current = false
    localStorage.removeItem('wallet_manually_disconnected')
    setIsConnected(true)
    if (pathname === '/') {
      router.push('/dashboard')
    }
  }, [router, pathname])

  const handleWalletDisconnect = useCallback(() => {
    console.log('Header: handleWalletDisconnect called')
    manuallyDisconnectedRef.current = true
    localStorage.setItem('wallet_manually_disconnected', 'true')
    setIsConnected(false)
    if (pathname.startsWith('/dashboard')) {
      router.push('/')
    }
  }, [router, pathname])

  return (
    <header className="app-header" style={{ display: 'flex', visibility: 'visible', opacity: 1, zIndex: 9999 }}>
      {showL && (
        <>
          <div className="brazil-flag-animation">
            <div className="brazil-flag">
              <div className="flag-green"></div>
              <div className="flag-yellow"></div>
              <div className="flag-blue-circle"></div>
            </div>
          </div>
          <div className="pic1-header-animation">
            <div className="pic1-header-duplicate">
              <div className="header-content-duplicate">
                <div className="logo-duplicate">
                  <Logo />
                  <span className="logo-text">
                    <span className="letter-b letter-b-glow">B</span><span className="letter-white">LOCK</span><span className="letter-b letter-b-glow">B</span><span className="letter-white">AN</span>
                    <span className="letter-white letter-k">K</span>
                    <span className="letter-l">L</span>
                  </span>
                </div>
                <div className="pic1-image-wrapper">
                  <img src="/Pic1.jpg" alt="Pic1" className="pic1-image" />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Message d'erreur audio */}
      {showL && audioError && (
        <div className="audio-error-message">
          <div className="audio-error-content">
            <span className="audio-error-icon">🎵</span>
            <div className="audio-error-text">
              <strong>Musique non disponible</strong>
              <p>Placez <code>samba-music.mp3</code> dans <code>public/</code></p>
              <a 
                href="https://pixabay.com/music/search/samba/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="audio-error-link"
              >
                Télécharger une musique samba →
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="header-content" style={{ display: 'flex', visibility: 'visible', opacity: 1, width: '100%', zIndex: 10 }}>
        <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
          {showHamburger && onMenuToggle && (
            <button 
              className="hamburger-menu"
              onClick={onMenuToggle}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
              <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
              <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
            </button>
          )}
          <div 
            className="logo"
            onClick={() => {
              const newCount = kClickCount + 1
              console.log('Logo cliqué! Compteur:', newCount)
              setKClickCount(newCount)
              if (newCount >= 69) {
                console.log('🎉 SAMBA TIME ACTIVÉ!')
                setShowL(true)
                setKClickCount(0)
              }
            }}
            style={{ cursor: 'pointer', display: 'flex', visibility: 'visible', opacity: 1 }}
          >
            <Logo />
            <span className="logo-text" style={{ color: '#FFFFFF', visibility: 'visible', opacity: 1 }}>
              <span className={`letter-b ${showL ? 'letter-b-glow' : ''}`}>B</span><span className="letter-white">LOCK</span><span className={`letter-b ${showL ? 'letter-b-glow' : ''}`}>B</span><span className="letter-white">AN</span>
              <span className="letter-white letter-k">K</span>
              {showL && <span className="letter-l">L</span>}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', visibility: 'visible', opacity: 1 }}>
          <WalletConnect 
            onConnect={handleWalletConnect}
            onDisconnect={handleWalletDisconnect}
          />
        </div>
      </div>
    </header>
  )
}

