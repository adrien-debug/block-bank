'use client'

import { useState } from 'react'
import { formatNumber } from '@/lib/utils'
import { NFTRWA, LoanConditions, LoanProfileOption } from '@/types'
import { calculateLoanProfiles } from '@/lib/services/riskEngine'
import { calculateInsurancePremium } from '@/lib/services/insuranceCalculator'

interface LoanProfilesProps {
  nft: NFTRWA
  conditions: LoanConditions
  creditTier: 'A' | 'B' | 'C' | 'D'
  onSelectProfile: (profile: LoanProfileOption) => void
  onContinue?: () => void
  onBack?: () => void
}

export default function LoanProfiles({ nft, conditions, creditTier, onSelectProfile, onContinue, onBack }: LoanProfilesProps) {
  const [selectedProfile, setSelectedProfile] = useState<LoanProfileOption | null>(null)
  
  // Calculer les 3 profils
  const insurancePremium = calculateInsurancePremium(
    nft.value * 0.7,
    creditTier,
    conditions.nftRiskClass
  )
  
  const profiles = calculateLoanProfiles(nft.value, conditions, insurancePremium)
  
  // Marquer le profil BALANCED comme recommandé
  const profilesWithRecommendation = profiles.map((profile, index) => ({
    ...profile,
    recommended: index === 1, // BALANCED
  }))

  const handleSelectProfile = (profile: LoanProfileOption) => {
    setSelectedProfile(profile)
    onSelectProfile(profile)
  }

  const handleConfirm = () => {
    if (selectedProfile) {
      if (onContinue) {
        onContinue()
      } else {
      onSelectProfile(selectedProfile)
      }
    }
  }


  return (
    <div className="loan-profiles-page-premium">
      {/* Header Premium */}
      <div className="page-header">
        <div>
          <h1>Choisissez votre profil</h1>
          <p className="page-subtitle">3 options disponibles</p>
        </div>
      </div>

      {/* NFT Rappel Premium */}
      <div className="profiles-nft-reminder-card">
        <div className="nft-reminder-content">
          <div className="nft-reminder-icon">
            {nft.assetType === 'REAL_ESTATE' && '🏢'}
            {nft.assetType === 'MINING' && '⛏️'}
            {nft.assetType === 'INFRASTRUCTURE' && '🏗️'}
            {nft.assetType === 'COMMODITIES' && '💎'}
            {nft.assetType === 'OTHER' && '📦'}
          </div>
          <div className="nft-reminder-info">
            <span className="nft-reminder-label">NFT sélectionné</span>
            <span className="nft-reminder-name">{nft.name}</span>
          </div>
          <div className="nft-reminder-value">
            <span className="value-amount">{formatNumber(nft.value)}</span>
            <span className="value-currency">{nft.valueCurrency}</span>
          </div>
        </div>
      </div>

      {/* 3 Profils Premium */}
      <div className="profiles-grid-premium">
        {profilesWithRecommendation.map((profile) => (
          <div 
            key={profile.profile}
            className={`profile-card-premium ${selectedProfile?.profile === profile.profile ? 'selected' : ''} ${profile.recommended ? 'recommended' : ''}`}
            onClick={() => handleSelectProfile(profile)}
          >
            {profile.recommended && (
              <div className="profile-recommended-badge-premium">
                <span className="badge-icon">⭐</span>
                <span>Recommandé</span>
              </div>
            )}
            
            {selectedProfile?.profile === profile.profile && (
              <div className="profile-selected-indicator">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="var(--color-primary-500)" />
                  <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
            
            <div className="profile-card-header-premium">
              <div className={`profile-badge-premium profile-${profile.profile.toLowerCase()}`}>
                {profile.profile === 'SAFE' && 'Safe'}
                {profile.profile === 'BALANCED' && 'Balanced'}
                {profile.profile === 'MAX_LEVERAGE' && 'Max Leverage'}
              </div>
            </div>

            <div className="profile-card-body-premium">
              {/* Down Payment Main */}
              <div className="profile-main-metric-premium">
                <div className="metric-label-premium">Apport requis</div>
                <div className="metric-value-premium-large">
                  {formatNumber(profile.downPayment)}
                </div>
                <div className="metric-currency">{nft.valueCurrency}</div>
                <div className="metric-percent-badge">{profile.downPaymentPercent}%</div>
              </div>

              {/* Details */}
              <div className="profile-details-premium">
                <div className="profile-detail-item">
                  <span className="detail-label-premium">Montant du prêt</span>
                  <span className="detail-value-premium">{formatNumber(profile.loanAmount)} {nft.valueCurrency}</span>
                </div>
                <div className="profile-detail-item">
                  <span className="detail-label-premium">LTV</span>
                  <span className="detail-value-premium">{profile.ltv.toFixed(1)}%</span>
                </div>
                <div className="profile-detail-item">
                  <span className="detail-label-premium">Taux APY</span>
                  <span className="detail-value-premium">{profile.interestRate.toFixed(2)}%</span>
                </div>
                <div className="profile-detail-item">
                  <span className="detail-label-premium">Durée</span>
                  <span className="detail-value-premium">{profile.duration} mois</span>
                </div>
                
                <div className="profile-detail-divider"></div>
                
                <div className="profile-detail-item highlight-premium">
                  <span className="detail-label-premium">Mensualité</span>
                  <span className="detail-value-premium-large">{formatNumber(profile.monthlyPayment)} {nft.valueCurrency}</span>
                </div>
                
                {profile.insurancePremium && (
                  <div className="profile-detail-item">
                    <span className="detail-label-premium">Insurance</span>
                    <span className="detail-value-premium">
                      <span className={`insurance-badge ${profile.insuranceRequired ? 'required' : 'optional'}`}>
                        {profile.insuranceRequired ? 'Requis' : 'Optionnel'}
                      </span>
                      <span className="insurance-premium"> {formatNumber(profile.insurancePremium)} {nft.valueCurrency}/year</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Total Cost */}
              <div className="profile-total-cost-premium">
                <div className="total-cost-label-premium">Coût total</div>
                <div className="total-cost-value-premium">{formatNumber(profile.totalCost)} {nft.valueCurrency}</div>
              </div>
            </div>

            <div className="profile-card-footer-premium">
              <button 
                className={`btn-profile-select-premium ${selectedProfile?.profile === profile.profile ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  handleSelectProfile(profile)
                }}
              >
                {selectedProfile?.profile === profile.profile ? (
                  <>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="10" r="9" fill="currentColor" />
                      <path d="M7 10L9 12L13 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Sélectionné</span>
                  </>
                ) : (
                  <span>Sélectionner</span>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Recommendation Premium */}
      <div className="profile-recommendation-premium">
        <div className="recommendation-card-premium">
          <div className="recommendation-icon">💡</div>
          <div className="recommendation-content-premium">
            <h3 className="recommendation-title">Conseil</h3>
            <p className="recommendation-text">
              {selectedProfile?.profile === 'SAFE' && 
                'Sécurité maximale avec apport élevé. Idéal pour la stabilité.'}
              {selectedProfile?.profile === 'BALANCED' && 
                'Équilibre optimal entre apport et levier. Recommandé.'}
              {selectedProfile?.profile === 'MAX_LEVERAGE' && 
                'Capacité d\'emprunt maximale. Assurance obligatoire requise.'}
              {!selectedProfile && 
                'Sélectionnez un profil pour voir les recommandations.'}
            </p>
          </div>
        </div>
      </div>

      {/* Actions Premium */}
      <div className="profile-actions-premium">
        {onBack && (
          <button 
            className="btn-secondary btn-large-premium"
            onClick={onBack}
          >
            Retour
          </button>
        )}
        <button 
          className="btn-primary btn-large-premium"
          onClick={handleConfirm}
          disabled={!selectedProfile}
        >
          {selectedProfile ? 'Confirmer et continuer' : 'Sélectionnez un profil'}
        </button>
      </div>
    </div>
  )
}

