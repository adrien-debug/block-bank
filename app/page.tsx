'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
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
  const [audioError, setAudioError] = useState(false)
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
        console.log('💡 Pour télécharger une musique samba:')
        console.log('   1. Allez sur https://pixabay.com/music/search/samba/')
        console.log('   2. Téléchargez un fichier MP3')
        console.log('   3. Nommez-le samba-music.mp3')
        console.log('   4. Placez-le dans le dossier public/')
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
          console.log('Ignoring accountsChanged because of manual disconnect')
          return
        }
        
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

  const handleWalletConnect = useCallback((address: string) => {
    console.log('Home: handleWalletConnect called with address:', address)
    manuallyDisconnectedRef.current = false
    localStorage.removeItem('wallet_manually_disconnected')
    setIsConnected(true)
    router.push('/dashboard')
  }, [router])

  const handleWalletDisconnect = useCallback(() => {
    console.log('Home: handleWalletDisconnect called')
    manuallyDisconnectedRef.current = true
    localStorage.setItem('wallet_manually_disconnected', 'true')
    setIsConnected(false)
    // Ne pas rediriger automatiquement, laisser l'utilisateur sur la page
  }, [])

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
      <header className="app-header">
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

        <div className="header-content">
          <div 
            className="logo"
            onClick={() => {
              const newCount = kClickCount + 1
              console.log('Logo cliqué! Compteur:', newCount)
              setKClickCount(newCount)
              if (newCount >= 5) {
                console.log('🎉 SAMBA TIME ACTIVÉ!')
                setShowL(true)
                setKClickCount(0)
              }
            }}
            style={{ cursor: 'pointer' }}
          >
            <Logo />
            <span className="logo-text">
              <span className={`letter-b ${showL ? 'letter-b-glow' : ''}`}>B</span><span className="letter-white">LOCK</span><span className={`letter-b ${showL ? 'letter-b-glow' : ''}`}>B</span><span className="letter-white">AN</span>
              <span className="letter-white letter-k">K</span>
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
