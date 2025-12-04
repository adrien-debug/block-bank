'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useModal } from '@/contexts/ModalContext'
import Button from './Button'

interface RegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function RegistrationModal({ isOpen, onClose, onSuccess }: RegistrationModalProps) {
  const { register } = useAuth()
  const { openLoginModal } = useModal()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Empêcher le scroll du body quand la modal est ouverte
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.address || !formData.password) {
      setError('Tous les champs sont requis')
      return
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    setIsLoading(true)

    const result = await register(
      formData.email,
      formData.password,
      formData.firstName,
      formData.lastName,
      formData.address
    )

    setIsLoading(false)

    if (result.success) {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        password: '',
        confirmPassword: '',
      })
      onClose()
      if (onSuccess) {
        onSuccess()
      }
    } else {
      setError(result.error || "Erreur lors de l'inscription")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="new-loan-modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Créer un compte</h2>
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
        <form className="loan-form" onSubmit={handleSubmit}>
          {error && (
            <div style={{
              padding: 'var(--space-2)',
              marginBottom: 'var(--space-2)',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--radius-md)',
              color: '#ef4444',
              fontSize: 'var(--text-xs)',
            }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label>Prénom</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Jean"
              required
            />
          </div>

          <div className="form-group">
            <label>Nom</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Dupont"
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="jean.dupont@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Adresse</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="123 Rue de la Paix, 75001 Paris"
              required
            />
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 6 caractères"
              required
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label>Confirmer le mot de passe</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Répétez le mot de passe"
              required
              minLength={6}
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
              {isLoading ? 'Inscription...' : "S'inscrire"}
            </button>
          </div>

          <div style={{
            marginTop: 'var(--space-2)',
            paddingTop: 'var(--space-2)',
            borderTop: '1px solid var(--color-border-default)',
            textAlign: 'center',
          }}>
            <p style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--color-text-secondary)',
              margin: 0,
              marginBottom: 'var(--space-1)',
            }}>
              Déjà un compte ?
            </p>
            <button
              type="button"
              onClick={() => {
                onClose()
                openLoginModal()
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-primary-500)',
                cursor: 'pointer',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-semibold)',
                textDecoration: 'underline',
                padding: 0,
              }}
            >
              Se connecter
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

