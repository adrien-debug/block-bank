'use client'

import { useState } from 'react'
import { NFTRWA, LoanConditions, LoanProfileOption } from '@/types'
import { calculateLoanProfiles } from '@/lib/services/riskEngine'
import { calculateInsurancePremium } from '@/lib/services/insuranceCalculator'

interface LoanProfilesProps {
  nft: NFTRWA
  conditions: LoanConditions
  creditTier: 'A' | 'B' | 'C' | 'D'
  onSelectProfile: (profile: LoanProfileOption) => void
}

export default function LoanProfiles({ nft, conditions, creditTier, onSelectProfile }: LoanProfilesProps) {
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
  }

  const handleConfirm = () => {
    if (selectedProfile) {
      onSelectProfile(selectedProfile)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="loan-profiles-page">
      <div className="page-header">
        <div>
          <h1>Choisissez votre profil de prêt</h1>
          <p className="page-subtitle">3 options adaptées à votre situation</p>
        </div>
      </div>

      {/* NFT Rappel */}
      <div className="nft-reminder">
        <div className="nft-reminder-info">
          <span className="nft-reminder-label">NFT sélectionné</span>
          <span className="nft-reminder-name">{nft.name}</span>
        </div>
        <div className="nft-reminder-value">
          {formatCurrency(nft.value)} {nft.valueCurrency}
        </div>
      </div>

      {/* 3 Profils */}
      <div className="profiles-grid">
        {profilesWithRecommendation.map((profile) => (
          <div 
            key={profile.profile}
            className={`profile-card ${selectedProfile?.profile === profile.profile ? 'selected' : ''} ${profile.recommended ? 'recommended' : ''}`}
            onClick={() => handleSelectProfile(profile)}
          >
            {profile.recommended && (
              <div className="profile-recommended-badge">Recommandé</div>
            )}
            
            <div className="profile-header">
              <div className="profile-badge profile-badge-safe">
                {profile.profile === 'SAFE' && 'Sécurisé'}
                {profile.profile === 'BALANCED' && 'Équilibré'}
                {profile.profile === 'MAX_LEVERAGE' && 'Leverage Max'}
              </div>
            </div>

            <div className="profile-content">
              <div className="profile-main-metric">
                <div className="metric-label">Apport requis</div>
                <div className="metric-value-large">
                  {formatCurrency(profile.downPayment)} {nft.valueCurrency}
                </div>
                <div className="metric-percent">{profile.downPaymentPercent}%</div>
              </div>

              <div className="profile-details">
                <div className="profile-detail-row">
                  <span className="detail-label">Montant prêt</span>
                  <span className="detail-value">{formatCurrency(profile.loanAmount)} {nft.valueCurrency}</span>
                </div>
                <div className="profile-detail-row">
                  <span className="detail-label">LTV</span>
                  <span className="detail-value">{profile.ltv.toFixed(1)}%</span>
                </div>
                <div className="profile-detail-row">
                  <span className="detail-label">Taux APY</span>
                  <span className="detail-value">{profile.interestRate.toFixed(2)}%</span>
                </div>
                <div className="profile-detail-row">
                  <span className="detail-label">Durée</span>
                  <span className="detail-value">{profile.duration} mois</span>
                </div>
                <div className="profile-detail-row highlight">
                  <span className="detail-label">Mensualité</span>
                  <span className="detail-value-large">{formatCurrency(profile.monthlyPayment)} {nft.valueCurrency}</span>
                </div>
                {profile.insurancePremium && (
                  <div className="profile-detail-row">
                    <span className="detail-label">Assurance</span>
                    <span className="detail-value">
                      {profile.insuranceRequired ? 'Obligatoire' : 'Optionnelle'}
                      {' • '}
                      {formatCurrency(profile.insurancePremium)} {nft.valueCurrency}/an
                    </span>
                  </div>
                )}
              </div>

              <div className="profile-total-cost">
                <div className="total-cost-label">Coût total</div>
                <div className="total-cost-value">{formatCurrency(profile.totalCost)} {nft.valueCurrency}</div>
              </div>
            </div>

            <div className="profile-footer">
              <button 
                className={`btn-profile-select ${selectedProfile?.profile === profile.profile ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  handleSelectProfile(profile)
                }}
              >
                {selectedProfile?.profile === profile.profile ? '✓ Sélectionné' : 'Choisir'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Comparaison Tableau */}
      {selectedProfile && (
        <div className="profile-comparison">
          <h2>Comparaison des profils</h2>
          <div className="comparison-table">
            <div className="comparison-header">
              <div className="comparison-cell">Critère</div>
              <div className="comparison-cell">SAFE</div>
              <div className="comparison-cell">BALANCED</div>
              <div className="comparison-cell">MAX LEVERAGE</div>
            </div>
            {profiles.map((profile) => (
              <div key={profile.profile} className="comparison-row">
                <div className="comparison-cell label">Apport</div>
                <div className="comparison-cell">{formatCurrency(profile.downPayment)} {nft.valueCurrency}</div>
                <div className="comparison-cell">{formatCurrency(profiles[1].downPayment)} {nft.valueCurrency}</div>
                <div className="comparison-cell">{formatCurrency(profiles[2].downPayment)} {nft.valueCurrency}</div>
              </div>
            ))}
            <div className="comparison-row">
              <div className="comparison-cell label">Mensualité</div>
              <div className="comparison-cell">{formatCurrency(profiles[0].monthlyPayment)} {nft.valueCurrency}</div>
              <div className="comparison-cell">{formatCurrency(profiles[1].monthlyPayment)} {nft.valueCurrency}</div>
              <div className="comparison-cell">{formatCurrency(profiles[2].monthlyPayment)} {nft.valueCurrency}</div>
            </div>
            <div className="comparison-row">
              <div className="comparison-cell label">Coût total</div>
              <div className="comparison-cell">{formatCurrency(profiles[0].totalCost)} {nft.valueCurrency}</div>
              <div className="comparison-cell">{formatCurrency(profiles[1].totalCost)} {nft.valueCurrency}</div>
              <div className="comparison-cell">{formatCurrency(profiles[2].totalCost)} {nft.valueCurrency}</div>
            </div>
          </div>
        </div>
      )}

      {/* Recommandation */}
      <div className="profile-recommendation">
        <div className="recommendation-content">
          <h3>Recommandation</h3>
          <p>
            {selectedProfile?.profile === 'SAFE' && 
              'Le profil SAFE offre la meilleure sécurité avec un apport élevé et des conditions favorables. Idéal si vous privilégiez la stabilité.'}
            {selectedProfile?.profile === 'BALANCED' && 
              'Le profil BALANCED offre le meilleur équilibre entre apport et leverage. Recommandé pour la plupart des utilisateurs.'}
            {selectedProfile?.profile === 'MAX_LEVERAGE' && 
              'Le profil MAX LEVERAGE maximise votre capacité d\'emprunt mais nécessite une assurance obligatoire. Idéal si vous avez confiance en votre capacité de remboursement.'}
            {!selectedProfile && 
              'Sélectionnez un profil pour voir la recommandation personnalisée.'}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="profile-actions">
        <button 
          className="btn-primary btn-large"
          onClick={handleConfirm}
          disabled={!selectedProfile}
        >
          Confirmer et continuer
        </button>
      </div>
    </div>
  )
}

