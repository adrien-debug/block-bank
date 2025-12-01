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
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="loan-profiles-page-premium">
      {/* Header Premium */}
      <div className="profiles-page-header">
        <div className="profiles-header-content">
          <div>
            <h1 className="profiles-title">Choose your loan profile</h1>
            <p className="profiles-subtitle">3 options adapted to your situation and risk profile</p>
          </div>
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
            <span className="nft-reminder-label">Selected NFT</span>
            <span className="nft-reminder-name">{nft.name}</span>
          </div>
          <div className="nft-reminder-value">
            <span className="value-amount">{formatCurrency(nft.value)}</span>
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
                <span>Recommended</span>
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
                <div className="metric-label-premium">Required down payment</div>
                <div className="metric-value-premium-large">
                  {formatCurrency(profile.downPayment)}
                </div>
                <div className="metric-currency">{nft.valueCurrency}</div>
                <div className="metric-percent-badge">{profile.downPaymentPercent}%</div>
              </div>

              {/* Details */}
              <div className="profile-details-premium">
                <div className="profile-detail-item">
                  <span className="detail-label-premium">Loan amount</span>
                  <span className="detail-value-premium">{formatCurrency(profile.loanAmount)} {nft.valueCurrency}</span>
                </div>
                <div className="profile-detail-item">
                  <span className="detail-label-premium">LTV</span>
                  <span className="detail-value-premium">{profile.ltv.toFixed(1)}%</span>
                </div>
                <div className="profile-detail-item">
                  <span className="detail-label-premium">APY Rate</span>
                  <span className="detail-value-premium">{profile.interestRate.toFixed(2)}%</span>
                </div>
                <div className="profile-detail-item">
                  <span className="detail-label-premium">Duration</span>
                  <span className="detail-value-premium">{profile.duration} months</span>
                </div>
                
                <div className="profile-detail-divider"></div>
                
                <div className="profile-detail-item highlight-premium">
                  <span className="detail-label-premium">Monthly payment</span>
                  <span className="detail-value-premium-large">{formatCurrency(profile.monthlyPayment)} {nft.valueCurrency}</span>
                </div>
                
                {profile.insurancePremium && (
                  <div className="profile-detail-item">
                    <span className="detail-label-premium">Insurance</span>
                    <span className="detail-value-premium">
                      <span className={`insurance-badge ${profile.insuranceRequired ? 'required' : 'optional'}`}>
                        {profile.insuranceRequired ? 'Required' : 'Optional'}
                      </span>
                      <span className="insurance-premium"> {formatCurrency(profile.insurancePremium)} {nft.valueCurrency}/year</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Total Cost */}
              <div className="profile-total-cost-premium">
                <div className="total-cost-label-premium">Total cost</div>
                <div className="total-cost-value-premium">{formatCurrency(profile.totalCost)} {nft.valueCurrency}</div>
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
                    <span>Selected</span>
                  </>
                ) : (
                  <span>Select</span>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Table Premium */}
      {selectedProfile && (
        <div className="profile-comparison-premium">
          <div className="comparison-card-premium">
            <h2 className="comparison-title">Profile comparison</h2>
            <div className="comparison-table-premium">
              <div className="comparison-header-premium">
                <div className="comparison-cell-premium header">Criterion</div>
                <div className="comparison-cell-premium header">SAFE</div>
                <div className="comparison-cell-premium header">BALANCED</div>
                <div className="comparison-cell-premium header">MAX LEVERAGE</div>
              </div>
              <div className="comparison-row-premium">
                <div className="comparison-cell-premium label">Down Payment</div>
                <div className="comparison-cell-premium">{formatCurrency(profiles[0].downPayment)} {nft.valueCurrency}</div>
                <div className="comparison-cell-premium">{formatCurrency(profiles[1].downPayment)} {nft.valueCurrency}</div>
                <div className="comparison-cell-premium">{formatCurrency(profiles[2].downPayment)} {nft.valueCurrency}</div>
              </div>
              <div className="comparison-row-premium">
                <div className="comparison-cell-premium label">Loan Amount</div>
                <div className="comparison-cell-premium">{formatCurrency(profiles[0].loanAmount)} {nft.valueCurrency}</div>
                <div className="comparison-cell-premium">{formatCurrency(profiles[1].loanAmount)} {nft.valueCurrency}</div>
                <div className="comparison-cell-premium">{formatCurrency(profiles[2].loanAmount)} {nft.valueCurrency}</div>
              </div>
              <div className="comparison-row-premium">
                <div className="comparison-cell-premium label">LTV</div>
                <div className="comparison-cell-premium">{profiles[0].ltv.toFixed(1)}%</div>
                <div className="comparison-cell-premium">{profiles[1].ltv.toFixed(1)}%</div>
                <div className="comparison-cell-premium">{profiles[2].ltv.toFixed(1)}%</div>
              </div>
              <div className="comparison-row-premium">
                <div className="comparison-cell-premium label">APY Rate</div>
                <div className="comparison-cell-premium">{profiles[0].interestRate.toFixed(2)}%</div>
                <div className="comparison-cell-premium">{profiles[1].interestRate.toFixed(2)}%</div>
                <div className="comparison-cell-premium">{profiles[2].interestRate.toFixed(2)}%</div>
              </div>
              <div className="comparison-row-premium">
                <div className="comparison-cell-premium label">Monthly Payment</div>
                <div className="comparison-cell-premium">{formatCurrency(profiles[0].monthlyPayment)} {nft.valueCurrency}</div>
                <div className="comparison-cell-premium">{formatCurrency(profiles[1].monthlyPayment)} {nft.valueCurrency}</div>
                <div className="comparison-cell-premium">{formatCurrency(profiles[2].monthlyPayment)} {nft.valueCurrency}</div>
              </div>
              <div className="comparison-row-premium">
                <div className="comparison-cell-premium label">Total Cost</div>
                <div className="comparison-cell-premium">{formatCurrency(profiles[0].totalCost)} {nft.valueCurrency}</div>
                <div className="comparison-cell-premium">{formatCurrency(profiles[1].totalCost)} {nft.valueCurrency}</div>
                <div className="comparison-cell-premium">{formatCurrency(profiles[2].totalCost)} {nft.valueCurrency}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recommendation Premium */}
      <div className="profile-recommendation-premium">
        <div className="recommendation-card-premium">
          <div className="recommendation-icon">💡</div>
          <div className="recommendation-content-premium">
            <h3 className="recommendation-title">Recommendation</h3>
            <p className="recommendation-text">
              {selectedProfile?.profile === 'SAFE' && 
                'The SAFE profile offers the best security with a high down payment and favorable conditions. Ideal if you prioritize stability and risk reduction.'}
              {selectedProfile?.profile === 'BALANCED' && 
                'The BALANCED profile offers the best balance between down payment and leverage. Recommended for most users seeking an optimal compromise.'}
              {selectedProfile?.profile === 'MAX_LEVERAGE' && 
                'The MAX LEVERAGE profile maximizes your borrowing capacity but requires mandatory insurance. Ideal if you are confident in your repayment capacity and want to optimize your capital.'}
              {!selectedProfile && 
                'Select a profile to see the personalized recommendation based on your selection.'}
            </p>
          </div>
        </div>
      </div>

      {/* Actions Premium */}
      <div className="profile-actions-premium">
        <button 
          className="btn-primary btn-large-premium"
          onClick={handleConfirm}
          disabled={!selectedProfile}
        >
          {selectedProfile ? 'Confirm and continue' : 'Select a profile'}
        </button>
      </div>
    </div>
  )
}

