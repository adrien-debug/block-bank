'use client'

import { useState, useEffect } from 'react'
import { formatAddress } from '@/lib/utils'

declare global {
  interface Window {
    ethereum?: any
  }
}

export default function Profile() {
  const [address, setAddress] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' }).then((accounts: string[]) => {
        if (accounts.length > 0) {
          setAddress(accounts[0])
        }
      }).catch(() => {
        // Ignorer les erreurs silencieusement
      })
    }
  }, [])

  return (
    <div className="profile-page">
      <h1>Mon Profil</h1>
      
      <div className="profile-section">
        <h2>Informations Wallet</h2>
        <div className="profile-card">
          <div className="profile-item">
            <span className="profile-label">Adresse</span>
            <span className="profile-value">{address ? formatAddress(address) : 'Non connecté'}</span>
          </div>
          <div className="profile-item">
            <span className="profile-label">Réseau</span>
            <span className="profile-value">Ethereum Mainnet</span>
          </div>
        </div>
      </div>

      <div className="profile-section">
        <h2>Informations KYC</h2>
        <div className="profile-card">
          <div className="kyc-status">
            <span className="kyc-badge verified">✓ Vérifié</span>
            <p>Votre identité a été vérifiée et validée</p>
          </div>
          <button className="btn-secondary">Mettre à jour</button>
        </div>
      </div>

      <div className="profile-section">
        <h2>Paramètres</h2>
        <div className="profile-card">
          <div className="setting-item">
            <span>Notifications par email</span>
            <input type="checkbox" defaultChecked />
          </div>
          <div className="setting-item">
            <span>Notifications push</span>
            <input type="checkbox" />
          </div>
          <div className="setting-item">
            <span>Mode sombre</span>
            <input type="checkbox" defaultChecked />
          </div>
        </div>
      </div>
    </div>
  )
}

