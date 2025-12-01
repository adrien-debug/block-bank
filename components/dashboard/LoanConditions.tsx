'use client'

import { useState, useEffect } from 'react'
import { NFTRWA, LoanConditions as LoanConditionsType } from '@/types'
import { calculateLoanConditions } from '@/lib/services/riskEngine'
import { calculateInsuranceOptions } from '@/lib/services/insuranceCalculator'

interface LoanConditionsProps {
  nft: NFTRWA
  creditScore: number
  creditTier: 'A' | 'B' | 'C' | 'D'
  onConditionsReady: (conditions: LoanConditionsType) => void
}

export default function LoanConditions({ nft, creditScore, creditTier, onConditionsReady }: LoanConditionsProps) {
  const [conditions, setConditions] = useState<LoanConditionsType | null>(null)
  const [insuranceOptions, setInsuranceOptions] = useState<any[]>([])
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
    const insurance = calculateInsuranceOptions(
      nft.value * 0.7, // Estimation prêt à 70% LTV
      creditTier,
      calculatedConditions.nftRiskClass
    )
    setInsuranceOptions(insurance)
    
    onConditionsReady(calculatedConditions)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="loan-conditions-page">
        <div className="loading-state-large">
          <div className="loading-spinner-large"></div>
          <h2>Calcul des conditions optimales...</h2>
          <p>Analyse du risque NFT et calcul des conditions de prêt</p>
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
          <p className="page-subtitle">NFT sélectionné : {nft.name}</p>
        </div>
      </div>

      {/* NFT Sélectionné */}
      <div className="selected-nft-card">
        <div className="selected-nft-info">
          <h3>{nft.name}</h3>
          <p className="nft-type">{nft.assetType}</p>
          <div className="nft-value-display">
            <span className="value-large">{nft.value.toLocaleString()}</span>
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
        <h2>Évaluation Risque NFT RWA</h2>
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
                  backgroundColor: conditions.nftRiskScore <= 30 ? '#30D158' : 
                                  conditions.nftRiskScore <= 60 ? '#FFD60A' : '#FF3B30'
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
              {conditions.nftRiskClass === 'SAFE' && 'Actif très sûr avec faible volatilité et liquidité élevée'}
              {conditions.nftRiskClass === 'MODERATE' && 'Actif modérément risqué avec volatilité acceptable'}
              {conditions.nftRiskClass === 'RISKY' && 'Actif présentant un risque plus élevé, nécessitant des conditions ajustées'}
            </p>
          </div>
        </div>
      </div>

      {/* Conditions Base */}
      <div className="conditions-section">
        <h2>Conditions de Prêt Calculées</h2>
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

      {/* Options Assurance */}
      <div className="conditions-section">
        <h2>Options d'Assurance</h2>
        <div className="insurance-options-grid">
          {insuranceOptions.map((option, index) => (
            <div key={index} className="insurance-option-card">
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
                  <span className="premium-value">{option.annualPremium.toLocaleString()} USDC</span>
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
    </div>
  )
}


