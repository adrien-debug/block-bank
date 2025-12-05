'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useModal } from '@/contexts/ModalContext'
import Button from './Button'
import WalletIcon from '../icons/WalletIcon'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

declare global {
  interface Window {
    ethereum?: any
  }
}

export default function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const { login, connectWallet } = useAuth()
  const { openRegistrationModal } = useModal()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isConnectingWallet, setIsConnectingWallet] = useState(false)
  const [activeTab, setActiveTab] = useState<'email' | 'wallet'>('email')

  useEffect(() => {
    if (isOpen) {
      setError(null)
      setEmail('')
      setPassword('')
      // Empêcher le scroll du body quand la modal est ouverte
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError('Email et mot de passe requis')
      return
    }

    setIsLoading(true)

    const result = await login(email, password)

    setIsLoading(false)

    if (result.success) {
      setEmail('')
      setPassword('')
      onClose()
      if (onSuccess) {
        onSuccess()
      }
    } else {
      const errorMessage = result.error || 'Erreur de connexion'
      // Message plus clair si l'utilisateur n'existe pas
      if (errorMessage.includes('Email ou mot de passe incorrect')) {
        setError('Email ou mot de passe incorrect. Si vous n\'avez pas de compte, cliquez sur "S\'inscrire" ci-dessous.')
      } else {
        setError(errorMessage)
      }
    }
  }

  const handleWalletConnect = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      setError('Veuillez installer MetaMask ou un autre wallet Web3')
      return
    }

    setIsConnectingWallet(true)
    setError(null)

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })

      if (accounts && accounts.length > 0) {
        const walletAddress = accounts[0]
        const result = await connectWallet(walletAddress)

        if (result.success) {
          onClose()
          if (onSuccess) {
            onSuccess()
          }
        } else {
          setError(result.error || 'Erreur de connexion wallet')
        }
      } else {
        setError('Aucun compte trouvé')
      }
    } catch (error: any) {
      console.error('Erreur connexion wallet:', error)
      if (error.code === 4001) {
        setError('Connexion refusée')
      } else {
        setError('Erreur de connexion wallet')
      }
    } finally {
      setIsConnectingWallet(false)
    }
  }

  return (
    <div className="new-loan-modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Connexion</h2>
          <button 
            type="button" 
            className="modal-close-button" 
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onClose()
            }} 
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        {/* Onglets */}
        <div className="modal-tabs">
          <button
            type="button"
            onClick={() => {
              setActiveTab('email')
              setError(null)
            }}
            className={`modal-tab ${activeTab === 'email' ? 'active' : ''}`}
          >
            Email / Mot de passe
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('wallet')
              setError(null)
            }}
            className={`modal-tab ${activeTab === 'wallet' ? 'active' : ''}`}
          >
            Wallet
          </button>
        </div>

        {error && (
          <div style={{
            padding: 'var(--space-3)',
            marginBottom: 'var(--space-4)',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-md)',
            color: '#ef4444',
            fontSize: 'var(--text-sm)',
          }}>
            {error}
          </div>
        )}

        {activeTab === 'email' ? (
          <form className="loan-form" onSubmit={handleEmailLogin}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jean.dupont@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Votre mot de passe"
                required
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
                disabled={isLoading}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </button>
            </div>

            <div style={{
              marginTop: 'var(--space-4)',
              paddingTop: 'var(--space-4)',
              borderTop: '1px solid var(--color-border-default)',
              textAlign: 'center',
            }}>
              <p style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-secondary)',
                margin: 0,
                marginBottom: 'var(--space-2)',
              }}>
                Pas encore de compte ?
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose()
                  openRegistrationModal()
                }}
                style={{
                  background: 'var(--color-primary-500)',
                  border: 'none',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-semibold)',
                  padding: 'var(--space-2) var(--space-4)',
                  borderRadius: 'var(--radius-md)',
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--color-primary-600)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--color-primary-500)'
                }}
              >
                S'inscrire
              </button>
            </div>
          </form>
        ) : (
          <div className="loan-form">
            <div style={{
              padding: 'var(--space-6)',
              textAlign: 'center',
              background: 'rgba(37, 99, 235, 0.05)',
              borderRadius: 'var(--radius-lg)',
              marginBottom: 'var(--space-6)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
                <WalletIcon />
              </div>
              <h3 style={{ 
                marginTop: 0,
                marginBottom: 'var(--space-2)',
                fontSize: 'var(--text-lg)',
                fontWeight: 'var(--font-semibold)',
                color: 'var(--color-text-primary)'
              }}>
                Connecter votre wallet
              </h3>
              <p style={{ 
                color: 'var(--color-text-secondary)', 
                fontSize: 'var(--text-sm)',
                margin: 0
              }}>
                Connectez-vous avec MetaMask ou un autre wallet Web3
              </p>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
                disabled={isConnectingWallet}
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleWalletConnect}
                className="btn-primary"
                disabled={isConnectingWallet}
              >
                {isConnectingWallet ? 'Connexion...' : 'Connecter Wallet'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

