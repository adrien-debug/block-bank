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
        // Ignore errors silently
      })
    }
  }, [])

  return (
    <div className="profile-page">
      <h1>My Profile</h1>
      
      <div className="profile-section">
        <h2>Wallet Information</h2>
        <div className="profile-card">
          <div className="profile-item">
            <span className="profile-label">Address</span>
            <span className="profile-value">{address ? formatAddress(address) : 'Not connected'}</span>
          </div>
          <div className="profile-item">
            <span className="profile-label">Network</span>
            <span className="profile-value">Ethereum Mainnet</span>
          </div>
        </div>
      </div>

      <div className="profile-section">
        <h2>KYC Information</h2>
        <div className="profile-card">
          <div className="kyc-status">
            <span className="kyc-badge verified">✓ Verified</span>
            <p>Your identity has been verified and validated</p>
          </div>
          <button className="btn-secondary">Update</button>
        </div>
      </div>

      <div className="profile-section">
        <h2>Settings</h2>
        <div className="profile-card">
          <div className="setting-item">
            <span>Email notifications</span>
            <input type="checkbox" defaultChecked />
          </div>
          <div className="setting-item">
            <span>Push notifications</span>
            <input type="checkbox" />
          </div>
          <div className="setting-item">
            <span>Dark mode</span>
            <input type="checkbox" defaultChecked />
          </div>
        </div>
      </div>
    </div>
  )
}
