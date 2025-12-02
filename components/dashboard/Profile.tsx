'use client'

import { useState, useEffect } from 'react'
import { formatAddress } from '@/lib/utils'
import WalletIcon from '../icons/WalletIcon'
import ShieldIcon from '../icons/ShieldIcon'
import LightBulbIcon from '../icons/LightBulbIcon'
import UserIcon from '../icons/UserIcon'

declare global {
  interface Window {
    ethereum?: any
  }
}

export default function Profile() {
  const [address, setAddress] = useState<string | null>(null)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)
  const [darkMode, setDarkMode] = useState(true)

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
  }, [])

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Mon Profil</h1>
          <p className="page-subtitle">Gérez vos informations personnelles et vos paramètres</p>
        </div>
      </div>

      <div className="profile-sections-grid">
        {/* Section Wallet Information */}
        <div className="profile-section-card">
          <div className="profile-section-header">
            <div className="profile-section-icon">
              <WalletIcon />
            </div>
            <h2 className="section-title">Informations Wallet</h2>
          </div>
          <div className="profile-card-content">
            <div className="profile-info-item">
              <span className="profile-info-label">Adresse</span>
              <span className="profile-info-value">
                {address ? formatAddress(address) : 'Non connecté'}
              </span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">Réseau</span>
              <span className="profile-info-value">Ethereum Mainnet</span>
            </div>
            {address && (
              <div className="profile-info-item">
                <span className="profile-info-label">Statut</span>
                <span className="profile-info-value status-connected">● Connecté</span>
              </div>
            )}
          </div>
        </div>

        {/* Section KYC Information */}
        <div className="profile-section-card">
          <div className="profile-section-header">
            <div className="profile-section-icon">
              <ShieldIcon />
            </div>
            <h2 className="section-title">Vérification KYC</h2>
          </div>
          <div className="profile-card-content">
            <div className="kyc-status-card">
              <div className="kyc-status-header">
                <span className="kyc-badge verified">
                  <ShieldIcon className="kyc-badge-icon" />
                  Vérifié
                </span>
                <span className="kyc-date">Vérifié le 15 Jan 2024</span>
              </div>
              <p className="kyc-description">
                Votre identité a été vérifiée et validée. Vous pouvez accéder à tous les services de la plateforme.
              </p>
              <button className="btn-secondary">Mettre à jour</button>
            </div>
          </div>
        </div>

        {/* Section Settings */}
        <div className="profile-section-card">
          <div className="profile-section-header">
            <div className="profile-section-icon">
              <LightBulbIcon />
            </div>
            <h2 className="section-title">Paramètres</h2>
          </div>
          <div className="profile-card-content">
            <div className="settings-list">
              <div className="setting-item">
                <div className="setting-item-content">
                  <span className="setting-label">Notifications email</span>
                  <span className="setting-description">Recevoir des notifications par email</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="setting-item">
                <div className="setting-item-content">
                  <span className="setting-label">Notifications push</span>
                  <span className="setting-description">Recevoir des notifications push</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={pushNotifications}
                    onChange={(e) => setPushNotifications(e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="setting-item">
                <div className="setting-item-content">
                  <span className="setting-label">Mode sombre</span>
                  <span className="setting-description">Activer le thème sombre</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={darkMode}
                    onChange={(e) => setDarkMode(e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Section Account Info */}
        <div className="profile-section-card">
          <div className="profile-section-header">
            <div className="profile-section-icon">
              <UserIcon />
            </div>
            <h2 className="section-title">Informations du compte</h2>
          </div>
          <div className="profile-card-content">
            <div className="profile-info-item">
              <span className="profile-info-label">Membre depuis</span>
              <span className="profile-info-value">Janvier 2024</span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">Niveau de vérification</span>
              <span className="profile-info-value">Niveau 2 (KYC complet)</span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">Limite de crédit</span>
              <span className="profile-info-value highlight">500,000 USDC</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
