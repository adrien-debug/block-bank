'use client'

import { useState, useEffect } from 'react'
import { formatNumber } from '@/lib/utils'
import { NFTRWA, LoanConditions as LoanConditionsType } from '@/types'
import { calculateLoanConditions } from '@/lib/services/riskEngine'
import { calculateInsuranceOptions, calculateInsurancePremium } from '@/lib/services/insuranceCalculator'
import { calculateDiscountSummary } from '@/lib/services/nftDiscountCalculator'

import { CreditTier } from '@/types'

interface LoanConditionsProps {
  nft: NFTRWA
  creditScore: number
  creditTier: CreditTier
  onConditionsReady: (conditions: LoanConditionsType) => void
  onBack?: () => void
}

export default function LoanConditions({ nft, creditScore, creditTier, onConditionsReady, onBack }: LoanConditionsProps) {
  const [conditions, setConditions] = useState<LoanConditionsType | null>(null)
  const [insuranceOptions, setInsuranceOptions] = useState<any[]>([])
  const [discountSummary, setDiscountSummary] = useState<any>(null)
  const [selectedInsuranceIndex, setSelectedInsuranceIndex] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    calculateConditions()
  }, [nft, creditScore])

  const calculateConditions = async () => {
    setLoading(true)
    
    // Simuler un délai de calcul
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const calculatedConditions = calculateLoanConditions(creditScore, nft)
    setConditions(calculatedConditions)
    
    // Calculer les options d'assurance
    const estimatedLoanAmount = nft.value * (calculatedConditions.finalLTV / 100)
    const insurance = calculateInsuranceOptions(
      estimatedLoanAmount,
      creditTier,
      calculatedConditions.nftRiskClass
    )
    setInsuranceOptions(insurance)
    
    // Calculer les remises NFT - utiliser la prime de base standard
    const baseInsurancePremium = calculateInsurancePremium(
      estimatedLoanAmount,
      creditTier,
      calculatedConditions.nftRiskClass
    )
    const discount = calculateDiscountSummary(
      nft,
      creditTier,
      calculatedConditions.baseLTV,
      calculatedConditions.baseRate,
      baseInsurancePremium
    )
    setDiscountSummary(discount)
    
    setLoading(false)
  }

  const handleContinue = () => {
    if (conditions) {
      onConditionsReady(conditions)
    }
  }

  if (loading) {
    return (
      <div className="loan-conditions-page">
        <div className="loading-state-large">
          <div className="loading-spinner-large"></div>
          <h2>Calcul en cours...</h2>
          <p>Analyse du risque et calcul des conditions</p>
        </div>
      </div>
    )
  }

  if (!conditions) return null

  return (
    <div className="loan-conditions-page">
      <div className="page-header">
        <div>
          <h1>Conditions de Prêt</h1>
          <p className="page-subtitle">{nft.name}</p>
        </div>
      </div>

      {/* NFT Sélectionné */}
      <div className="selected-nft-card">
        {nft.imageURI && (
          <div className="selected-nft-image">
            <img 
              src={nft.imageURI} 
              alt={nft.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: 'var(--radius-lg)',
              }}
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
        )}
        <div className="selected-nft-info">
          <h3>{nft.name}</h3>
          <p className="nft-type">{nft.assetType}</p>
          <div className="nft-value-display">
            <span className="value-large">{formatNumber(nft.value)}</span>
            <span className="currency">{nft.valueCurrency}</span>
          </div>
        </div>
        <div className="selected-nft-risk">
          <div className="risk-score-circle">
            <div className="risk-score-value">{conditions.nftRiskScore}</div>
            <div className="risk-score-label">/100</div>
          </div>
          <div className={`risk-class-badge risk-${conditions.nftRiskClass.toLowerCase()}`}>
            {conditions.nftRiskClass}
          </div>
        </div>
      </div>

      {/* Calcul Risque NFT */}
      <div className="conditions-section">
            <h2>Évaluation Risque</h2>
        <div className="risk-analysis-grid">
          <div className="risk-analysis-card">
            <div className="risk-analysis-header">
              <h4>Score Risque</h4>
              <div className="risk-score-display">
                <span className="score-value">{conditions.nftRiskScore}</span>
                <span className="score-max">/100</span>
              </div>
            </div>
            <div className="risk-bar">
              <div 
                className="risk-bar-fill"
                style={{ 
                  width: `${conditions.nftRiskScore}%`,
                  backgroundColor: conditions.nftRiskScore <= 30 ? 'var(--bb-blue)' : 
                                  conditions.nftRiskScore <= 60 ? 'var(--bb-blue-light)' : 'var(--bb-blue-dark)'
                }}
              />
            </div>
          </div>
          
          <div className="risk-analysis-card">
            <div className="risk-analysis-header">
              <h4>Classification</h4>
              <div className={`risk-class-large risk-${conditions.nftRiskClass.toLowerCase()}`}>
                {conditions.nftRiskClass}
              </div>
            </div>
            <p className="risk-description">
              {conditions.nftRiskClass === 'SAFE' && 'Risque faible, volatilité limitée'}
              {conditions.nftRiskClass === 'MODERATE' && 'Risque modéré, volatilité acceptable'}
              {conditions.nftRiskClass === 'RISKY' && 'Risque élevé, conditions ajustées'}
            </p>
          </div>
        </div>
      </div>

      {/* Conditions Base */}
      <div className="conditions-section">
            <h2>Conditions Calculées</h2>
        <div className="conditions-grid">
          <div className="condition-card">
            <div className="condition-label">LTV Maximum</div>
            <div className="condition-value-large">{conditions.finalLTV.toFixed(1)}%</div>
            <div className="condition-breakdown">
              <span>Base: {conditions.baseLTV}%</span>
              {conditions.adjustedLTV !== conditions.baseLTV && (
                <span className="adjustment">
                  {conditions.adjustedLTV > conditions.baseLTV ? '+' : ''}
                  {(conditions.adjustedLTV - conditions.baseLTV).toFixed(1)}%
                </span>
              )}
            </div>
          </div>
          
          <div className="condition-card">
            <div className="condition-label">Taux d'Intérêt (APY)</div>
            <div className="condition-value-large">{conditions.finalRate.toFixed(2)}%</div>
            <div className="condition-breakdown">
              <span>Base: {conditions.baseRate}%</span>
              {conditions.adjustedRate !== conditions.baseRate && (
                <span className="adjustment">
                  {conditions.adjustedRate > conditions.baseRate ? '+' : ''}
                  {(conditions.adjustedRate - conditions.baseRate).toFixed(2)}%
                </span>
              )}
            </div>
          </div>
          
          <div className="condition-card">
            <div className="condition-label">Credit Score</div>
            <div className="condition-value-large">{conditions.creditScore}</div>
            <div className="condition-breakdown">
              <span>Tranche {conditions.creditTier}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Économies NFT RWA */}
      <div className="conditions-section">
        <h2>Économies NFT RWA</h2>
        <div className="conditions-grid">
          <div className="condition-card">
            <div className="condition-label">Réduction taux d'intérêt</div>
            <div className="condition-value-large">-0.50% APY</div>
            <div className="condition-breakdown">
              <span>Économie sur le prêt</span>
            </div>
          </div>
          
          <div className="condition-card">
            <div className="condition-label">Réduction LTV Maximum</div>
            <div className="condition-value-large">-20%</div>
            <div className="condition-breakdown">
              <span>Réduction appliquée</span>
            </div>
          </div>
        </div>
      </div>


      {/* Options Assurance */}
      <div className="conditions-section">
          <h2>Assurance</h2>
        <div className="insurance-options-grid">
          {insuranceOptions.map((option, index) => (
            <div 
              key={index} 
              className={`insurance-option-card ${selectedInsuranceIndex === index ? 'selected' : ''}`}
              onClick={() => setSelectedInsuranceIndex(index)}
            >
              {selectedInsuranceIndex === index && (
                <div className="insurance-selected-indicator">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="var(--bb-blue-medium)" />
                    <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
              <div className="insurance-option-header">
                <h4>Option {index + 1}</h4>
                <div className="insurance-coverage-badge">{option.totalCoverage}%</div>
              </div>
              <div className="insurance-details">
                <div className="insurance-detail-row">
                  <span>Défaut emprunteur</span>
                  <span>{option.borrowerDefaultCoverage}%</span>
                </div>
                <div className="insurance-detail-row">
                  <span>Risque marché</span>
                  <span>{option.marketRiskCoverage}%</span>
                </div>
                <div className="insurance-detail-row">
                  <span>Risque actif</span>
                  <span>{option.assetRiskCoverage}%</span>
                </div>
                <div className="insurance-premium">
                  <span>Prime annuelle</span>
                  <span className="premium-value">{formatNumber(option.annualPremium)} USDC</span>
                </div>
                {option.impactOnLTV > 0 && (
                  <div className="insurance-benefit">
                    <span>Bonus: +{option.impactOnLTV}% LTV, {option.impactOnRate}% APY</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="conditions-actions">
        {onBack && (
          <button className="btn-secondary btn-large" onClick={onBack}>
            Retour
          </button>
        )}
        <button className="btn-primary btn-large" onClick={handleContinue}>
          Continuer
        </button>
      </div>
    </div>
  )
}
