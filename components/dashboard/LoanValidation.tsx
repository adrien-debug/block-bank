'use client'

import { useState, useEffect } from 'react'
import { NFTRWA, LoanProfileOption } from '@/types'

interface LoanValidationProps {
  nft: NFTRWA
  profile: LoanProfileOption
  creditScore: number
  creditTier: 'A' | 'B' | 'C' | 'D'
  walletBalance: number
  onConfirm: () => void
  onBack: () => void
}

export default function LoanValidation({ 
  nft, 
  profile, 
  creditScore, 
  creditTier,
  walletBalance,
  onConfirm,
  onBack 
}: LoanValidationProps) {
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [risksAccepted, setRisksAccepted] = useState(false)
  const [canProceed, setCanProceed] = useState(false)

  const totalRequired = profile.downPayment + (profile.insurancePremium || 0)
  const hasSufficientBalance = walletBalance >= totalRequired

  useEffect(() => {
    setCanProceed(termsAccepted && risksAccepted && hasSufficientBalance)
  }, [termsAccepted, risksAccepted, hasSufficientBalance])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="loan-validation-page">
      <div className="page-header">
        <div>
          <h1>Confirmer votre prêt</h1>
          <p className="page-subtitle">Étape 4/4 - Vérification finale</p>
        </div>
      </div>

      {/* Récapitulatif */}
      <div className="validation-summary">
        <div className="summary-section">
          <h2>NFT RWA</h2>
          <div className="summary-card">
            <div className="summary-item">
              <span className="summary-label">Nom</span>
              <span className="summary-value">{nft.name}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Type</span>
              <span className="summary-value">{nft.assetType}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Valeur</span>
              <span className="summary-value">{formatCurrency(nft.value)} {nft.valueCurrency}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Token ID</span>
              <span className="summary-value">#{nft.tokenId}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Contract</span>
              <span className="summary-value address">{nft.contractAddress.slice(0, 10)}...{nft.contractAddress.slice(-8)}</span>
            </div>
          </div>
        </div>

        <div className="summary-section">
          <h2>Profil Sélectionné</h2>
          <div className="summary-card">
            <div className="summary-item">
              <span className="summary-label">Profil</span>
              <span className="summary-value profile-badge">{profile.profile}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Apport</span>
              <span className="summary-value">{formatCurrency(profile.downPayment)} {nft.valueCurrency}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Montant prêt</span>
              <span className="summary-value">{formatCurrency(profile.loanAmount)} {nft.valueCurrency}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">LTV</span>
              <span className="summary-value">{profile.ltv.toFixed(1)}%</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Taux APY</span>
              <span className="summary-value">{profile.interestRate.toFixed(2)}%</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Durée</span>
              <span className="summary-value">{profile.duration} mois</span>
            </div>
            <div className="summary-item highlight">
              <span className="summary-label">Mensualité</span>
              <span className="summary-value-large">{formatCurrency(profile.monthlyPayment)} {nft.valueCurrency}</span>
            </div>
          </div>
        </div>

        {profile.insurancePremium && (
          <div className="summary-section">
            <h2>Assurance</h2>
            <div className="summary-card">
              <div className="summary-item">
                <span className="summary-label">Statut</span>
                <span className="summary-value">{profile.insuranceRequired ? 'Obligatoire' : 'Optionnelle'}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Prime annuelle</span>
                <span className="summary-value">{formatCurrency(profile.insurancePremium)} {nft.valueCurrency}</span>
              </div>
            </div>
          </div>
        )}

        <div className="summary-section">
          <h2>Coûts</h2>
          <div className="summary-card">
            <div className="summary-item">
              <span className="summary-label">Apport requis</span>
              <span className="summary-value">{formatCurrency(profile.downPayment)} {nft.valueCurrency}</span>
            </div>
            {profile.insurancePremium && (
              <div className="summary-item">
                <span className="summary-label">Prime assurance</span>
                <span className="summary-value">{formatCurrency(profile.insurancePremium)} {nft.valueCurrency}</span>
              </div>
            )}
            <div className="summary-item total">
              <span className="summary-label">Total à payer maintenant</span>
              <span className="summary-value-large">{formatCurrency(totalRequired)} {nft.valueCurrency}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Coût total prêt</span>
              <span className="summary-value">{formatCurrency(profile.totalCost)} {nft.valueCurrency}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Vérification Solvabilité */}
      <div className={`solvency-check ${hasSufficientBalance ? 'sufficient' : 'insufficient'}`}>
        <div className="solvency-header">
          <h3>Vérification Solvabilité</h3>
          {hasSufficientBalance ? (
            <span className="solvency-status success">✓ Suffisant</span>
          ) : (
            <span className="solvency-status error">✗ Insuffisant</span>
          )}
        </div>
        <div className="solvency-details">
          <div className="solvency-item">
            <span>Solde wallet actuel</span>
            <span>{formatCurrency(walletBalance)} {nft.valueCurrency}</span>
          </div>
          <div className="solvency-item">
            <span>Montant requis</span>
            <span>{formatCurrency(totalRequired)} {nft.valueCurrency}</span>
          </div>
          {!hasSufficientBalance && (
            <div className="solvency-warning">
              <p>Votre solde est insuffisant. Veuillez approvisionner votre wallet avant de continuer.</p>
            </div>
          )}
        </div>
      </div>

      {/* Conditions Légales */}
      <div className="legal-conditions">
        <h3>Conditions Légales</h3>
        <div className="conditions-checkboxes">
          <label className="checkbox-label">
            <input 
              type="checkbox" 
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
            <span>J'accepte les <a href="#" target="_blank">termes et conditions</a> de BlockBank</span>
          </label>
          <label className="checkbox-label">
            <input 
              type="checkbox" 
              checked={risksAccepted}
              onChange={(e) => setRisksAccepted(e.target.checked)}
            />
            <span>J'ai lu et compris les <a href="#" target="_blank">risques</a> associés à ce prêt</span>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="validation-actions">
        <button className="btn-secondary" onClick={onBack}>
          Retour
        </button>
        <button 
          className="btn-primary btn-large"
          onClick={onConfirm}
          disabled={!canProceed}
        >
          Confirmer et Payer
        </button>
      </div>
    </div>
  )
}

