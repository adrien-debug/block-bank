'use client'

import { useState, useEffect } from 'react'
import { formatAddress } from '@/lib/utils'
import WalletIcon from '../icons/WalletIcon'
import ShieldIcon from '../icons/ShieldIcon'
import LightBulbIcon from '../icons/LightBulbIcon'
import UserIcon from '../icons/UserIcon'
import CreditCardIcon from '../icons/CreditCardIcon'
import StarIcon from '../icons/StarIcon'
import ChartIcon from '../icons/ChartIcon'
import { useAuth } from '@/contexts/AuthContext'

declare global {
  interface Window {
    ethereum?: any
  }
}

interface UserDocument {
  id: string
  document_type: string
  file_name: string
  file_size: number
  mime_type: string
  created_at: string
  downloadUrl?: string | null
}

export default function Profile() {
  const { user, isAuthenticated, connectWallet, checkAuth } = useAuth()
  const [address, setAddress] = useState<string | null>(null)
  const [isConnectingWallet, setIsConnectingWallet] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)
  const [darkMode, setDarkMode] = useState(true)
  const [documents, setDocuments] = useState<UserDocument[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>('passport')

  // Charger les documents au montage
  useEffect(() => {
    const loadDocuments = async () => {
      if (!isAuthenticated) return
      try {
        const response = await fetch('/api/profile/documents')
        if (response.ok) {
          const data = await response.json()
          setDocuments(data.documents || [])
        }
      } catch (error) {
        console.error('Erreur chargement documents:', error)
      }
    }
    loadDocuments()
  }, [isAuthenticated])

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' }).then((accounts: string[]) => {
        if (accounts.length > 0) {
          setAddress(accounts[0])
        }
      }).catch(() => {
        // Ignore errors silently
      })
    }
    
    // Si l'utilisateur a déjà un wallet connecté dans son profil
    if (user?.wallet_address) {
      setAddress(user.wallet_address)
    }
  }, [user])
  
  const handleConnectWallet = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      alert('Veuillez installer MetaMask ou un autre wallet Web3')
      return
    }

    if (!isAuthenticated) {
      alert('Veuillez vous connecter d\'abord')
      return
    }

    setIsConnectingWallet(true)

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })

      if (accounts && accounts.length > 0) {
        const walletAddress = accounts[0]
        const result = await connectWallet(walletAddress)

        if (result.success) {
          setAddress(walletAddress)
          await checkAuth() // Rafraîchir les données utilisateur
        } else {
          alert(result.error || 'Erreur de connexion wallet')
        }
      }
    } catch (error: any) {
      console.error('Erreur connexion wallet:', error)
      if (error.code === 4001) {
        alert('Connexion refusée')
      } else {
        alert('Erreur de connexion wallet')
      }
    } finally {
      setIsConnectingWallet(false)
    }
  }

  const handleUploadDocument = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('documentType', selectedDocumentType)

      const response = await fetch('/api/profile/documents', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        // Recharger les documents
        const docsResponse = await fetch('/api/profile/documents')
        if (docsResponse.ok) {
          const docsData = await docsResponse.json()
          setDocuments(docsData.documents || [])
        }
        setShowUploadModal(false)
        alert('Document uploadé avec succès!')
      } else {
        const error = await response.json()
        alert(error.error || 'Erreur lors de l\'upload')
      }
    } catch (error) {
      console.error('Erreur upload document:', error)
      alert('Erreur lors de l\'upload du document')
    } finally {
      setIsUploading(false)
      // Réinitialiser l'input
      e.target.value = ''
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="profile-page-container">
      <div className="profile-two-boxes-grid">
        {/* Boîte 1 : Informations du compte */}
        <div className="profile-main-card">
          <div className="profile-card-header">
            <div className="profile-card-header-left">
              <div className="profile-card-icon">
                <UserIcon />
              </div>
              <div>
                <h2 className="profile-card-title">Informations du compte</h2>
                <p className="profile-card-subtitle">Détails de votre compte et wallet</p>
              </div>
            </div>
          </div>
          <div className="profile-card-body">
            {/* Wallet Information */}
            <div className="profile-section-group">
              <h3 className="profile-section-group-title">
                <WalletIcon />
                Informations Wallet
              </h3>
              <div className="profile-detail-row">
                <div className="profile-detail-item">
                  <span className="profile-detail-label">Adresse</span>
                  <span className="profile-detail-value address">
                    {address ? formatAddress(address) : 'Non connecté'}
                  </span>
                </div>
              </div>
              <div className="profile-detail-row">
                <div className="profile-detail-item">
                  <span className="profile-detail-label">Réseau</span>
                  <span className="profile-detail-value">Ethereum Mainnet</span>
                </div>
                <div className="profile-detail-item">
                  <span className="profile-detail-label">Statut</span>
                  <span className="profile-detail-value status-connected">
                    <span className="status-indicator"></span>
                    {address ? 'Connecté' : 'Non connecté'}
                  </span>
                </div>
              </div>
              
              {/* Bouton de connexion wallet si non connecté */}
              {!address && isAuthenticated && (
                <div style={{ marginTop: 'var(--space-4)' }}>
                  <button
                    onClick={handleConnectWallet}
                    className="btn-primary"
                    disabled={isConnectingWallet}
                    style={{ width: '100%' }}
                  >
                    {isConnectingWallet ? 'Connexion...' : 'Connecter Wallet'}
                  </button>
                </div>
              )}
              
              {/* Informations utilisateur si connecté par email */}
              {isAuthenticated && user && (
                <div style={{ 
                  marginTop: 'var(--space-4)', 
                  padding: 'var(--space-4)', 
                  background: 'rgba(37, 99, 235, 0.05)', 
                  borderRadius: 'var(--radius-md)',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word'
                }}>
                  <div className="profile-detail-row">
                    <div className="profile-detail-item" style={{ width: '100%' }}>
                      <span className="profile-detail-label">Email</span>
                      <span className="profile-detail-value" style={{ 
                        wordBreak: 'break-all',
                        overflowWrap: 'break-word'
                      }}>
                        {user.email}
                      </span>
                    </div>
                  </div>
                  {user.first_name && user.last_name && (
                    <div className="profile-detail-row">
                      <div className="profile-detail-item" style={{ width: '100%' }}>
                        <span className="profile-detail-label">Nom</span>
                        <span className="profile-detail-value">{user.first_name} {user.last_name}</span>
                      </div>
                    </div>
                  )}
                  {user.address && (
                    <div className="profile-detail-row">
                      <div className="profile-detail-item" style={{ width: '100%' }}>
                        <span className="profile-detail-label">Adresse</span>
                        <span className="profile-detail-value" style={{ 
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word'
                        }}>
                          {user.address}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* KYC Information */}
            <div className="profile-section-group">
              <h3 className="profile-section-group-title">
                <ShieldIcon />
                Vérification KYC
              </h3>
              <div className="profile-kyc-status">
                <div className="profile-kyc-badge-large">
                  <ShieldIcon />
                  <div>
                    <span className="profile-kyc-badge-title">Vérification Complète</span>
                    <span className="profile-kyc-badge-date">Vérifié le 15 Jan 2024</span>
                  </div>
                </div>
                <p className="profile-kyc-description">
                  {user?.kyc_verified 
                    ? 'Votre identité a été vérifiée et validée. Vous pouvez accéder à tous les services de la plateforme.'
                    : 'Téléchargez vos documents pour compléter votre vérification KYC.'}
                </p>
                <button 
                  className="profile-btn-secondary"
                  onClick={() => setShowUploadModal(true)}
                >
                  {user?.kyc_verified ? 'Mettre à jour les documents' : 'Télécharger des documents'}
                </button>
              </div>

              {/* Liste des documents */}
              {documents.length > 0 && (
                <div style={{ marginTop: 'var(--space-4)' }}>
                  <h4 style={{ 
                    fontSize: 'var(--text-sm)', 
                    fontWeight: 'var(--font-semibold)',
                    marginBottom: 'var(--space-2)'
                  }}>
                    Documents téléchargés ({documents.length})
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    {documents.map((doc) => (
                      <div key={doc.id} style={{
                        padding: 'var(--space-3)',
                        background: 'rgba(37, 99, 235, 0.05)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div>
                          <div style={{ fontWeight: 'var(--font-medium)' }}>
                            {doc.file_name}
                          </div>
                          <div style={{ 
                            fontSize: 'var(--text-xs)', 
                            color: 'var(--color-text-secondary)',
                            marginTop: 'var(--space-1)'
                          }}>
                            {doc.document_type} • {formatFileSize(doc.file_size)}
                          </div>
                        </div>
                        {doc.downloadUrl && (
                          <a
                            href={doc.downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-secondary btn-small"
                            style={{ textDecoration: 'none' }}
                          >
                            Télécharger
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Account Info */}
            <div className="profile-section-group">
              <h3 className="profile-section-group-title">
                <CreditCardIcon />
                Détails du compte
              </h3>
              <div className="profile-detail-row">
                <div className="profile-detail-item">
                  <span className="profile-detail-label">Membre depuis</span>
                  <span className="profile-detail-value">Janvier 2024</span>
                </div>
                <div className="profile-detail-item">
                  <span className="profile-detail-label">Type de compte</span>
                  <span className="profile-detail-value">Premium</span>
                </div>
              </div>
              <div className="profile-detail-row">
                <div className="profile-detail-item">
                  <span className="profile-detail-label">Niveau de vérification</span>
                  <span className="profile-detail-value">Niveau 2 (KYC complet)</span>
                </div>
                <div className="profile-detail-item">
                  <span className="profile-detail-label">Limite de crédit</span>
                  <span className="profile-detail-value highlight">500,000 USDC</span>
                </div>
              </div>
              <div className="profile-detail-row">
                <div className="profile-detail-item">
                  <span className="profile-detail-label">Score de crédit</span>
                  <span className="profile-detail-value">850</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Boîte 2 : Paramètres */}
        <div className="profile-main-card">
          <div className="profile-card-header">
            <div className="profile-card-header-left">
              <div className="profile-card-icon">
                <LightBulbIcon />
              </div>
              <div>
                <h2 className="profile-card-title">Paramètres</h2>
                <p className="profile-card-subtitle">Gérez vos préférences et notifications</p>
              </div>
            </div>
          </div>
          <div className="profile-card-body">
            <div className="profile-settings-list">
              <div className="profile-setting-item">
                <div className="profile-setting-content">
                  <span className="profile-setting-label">Notifications email</span>
                  <span className="profile-setting-description">Recevoir des notifications par email</span>
                </div>
                <label className="profile-toggle-switch">
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                  />
                  <span className="profile-toggle-slider"></span>
                </label>
              </div>
              <div className="profile-setting-item">
                <div className="profile-setting-content">
                  <span className="profile-setting-label">Notifications push</span>
                  <span className="profile-setting-description">Recevoir des notifications push</span>
                </div>
                <label className="profile-toggle-switch">
                  <input
                    type="checkbox"
                    checked={pushNotifications}
                    onChange={(e) => setPushNotifications(e.target.checked)}
                  />
                  <span className="profile-toggle-slider"></span>
                </label>
              </div>
              <div className="profile-setting-item">
                <div className="profile-setting-content">
                  <span className="profile-setting-label">Mode sombre</span>
                  <span className="profile-setting-description">Activer le thème sombre</span>
                </div>
                <label className="profile-toggle-switch">
                  <input
                    type="checkbox"
                    checked={darkMode}
                    onChange={(e) => setDarkMode(e.target.checked)}
                  />
                  <span className="profile-toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal d'upload de documents */}
      {showUploadModal && (
        <div className="new-loan-modal" onClick={() => setShowUploadModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Télécharger un document</h2>
              <button 
                type="button" 
                className="modal-close-button" 
                onClick={() => setShowUploadModal(false)}
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>

            <div className="loan-form">
              <div className="form-group">
                <label>Type de document</label>
                <select
                  value={selectedDocumentType}
                  onChange={(e) => setSelectedDocumentType(e.target.value)}
                  className="form-select"
                >
                  <option value="passport">Passeport</option>
                  <option value="identity">Carte d'identité</option>
                  <option value="proof_of_address">Justificatif de domicile</option>
                  <option value="bank_statement">Relevé bancaire</option>
                  <option value="tax_document">Document fiscal</option>
                  <option value="company_registration">Enregistrement entreprise</option>
                  <option value="other">Autre</option>
                </select>
              </div>

              <div className="form-group">
                <label>Fichier</label>
                <input
                  type="file"
                  onChange={handleUploadDocument}
                  disabled={isUploading}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  className="form-input"
                />
                <small style={{ 
                  display: 'block', 
                  marginTop: 'var(--space-2)',
                  color: 'var(--color-text-secondary)'
                }}>
                  Formats acceptés: PDF, JPG, PNG, DOC, DOCX (max 10MB)
                </small>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="btn-secondary"
                  disabled={isUploading}
                >
                  Annuler
                </button>
                <div style={{ 
                  padding: 'var(--space-3)',
                  background: 'rgba(37, 99, 235, 0.05)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-text-secondary)'
                }}>
                  {isUploading ? 'Upload en cours...' : 'Sélectionnez un fichier ci-dessus pour commencer'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
