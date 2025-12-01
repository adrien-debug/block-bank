'use client'

import { useState, useEffect } from 'react'
import { NFTRWA, LoanProfileOption } from '@/types'
import TermsAndConditions from '../TermsAndConditions'

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
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [canProceed, setCanProceed] = useState(false)

  const totalRequired = profile.downPayment + (profile.insurancePremium || 0)
  const hasSufficientBalance = walletBalance >= totalRequired

  useEffect(() => {
    setCanProceed(termsAccepted && risksAccepted && hasSufficientBalance)
  }, [termsAccepted, risksAccepted, hasSufficientBalance])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="loan-validation-page">
      <div className="page-header">
        <div>
          <h1>Confirm Your Loan</h1>
          <p className="page-subtitle">Step 4/5 - Final verification and payment</p>
        </div>
      </div>

      {/* Summary */}
      <div className="validation-summary">
        <div className="summary-section">
          <h2>NFT RWA</h2>
          <div className="summary-card">
            <div className="summary-item">
              <span className="summary-label">Name</span>
              <span className="summary-value">{nft.name}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Type</span>
              <span className="summary-value">{nft.assetType}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Value</span>
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
          <h2>Selected Profile</h2>
          <div className="summary-card">
            <div className="summary-item">
              <span className="summary-label">Profile</span>
              <span className="summary-value profile-badge">{profile.profile}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Down Payment</span>
              <span className="summary-value">{formatCurrency(profile.downPayment)} {nft.valueCurrency}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Loan Amount</span>
              <span className="summary-value">{formatCurrency(profile.loanAmount)} {nft.valueCurrency}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">LTV</span>
              <span className="summary-value">{profile.ltv.toFixed(1)}%</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">APY Rate</span>
              <span className="summary-value">{profile.interestRate.toFixed(2)}%</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Duration</span>
              <span className="summary-value">{profile.duration} months</span>
            </div>
            <div className="summary-item highlight">
              <span className="summary-label">Monthly Payment</span>
              <span className="summary-value-large">{formatCurrency(profile.monthlyPayment)} {nft.valueCurrency}</span>
            </div>
          </div>
        </div>

        {profile.insurancePremium && (
          <div className="summary-section">
            <h2>Insurance</h2>
            <div className="summary-card">
              <div className="summary-item">
                <span className="summary-label">Status</span>
                <span className="summary-value">{profile.insuranceRequired ? 'Required' : 'Optional'}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Annual Premium</span>
                <span className="summary-value">{formatCurrency(profile.insurancePremium)} {nft.valueCurrency}</span>
              </div>
            </div>
          </div>
        )}

        <div className="summary-section">
          <h2>Costs</h2>
          <div className="summary-card">
            <div className="summary-item">
              <span className="summary-label">Required Down Payment</span>
              <span className="summary-value">{formatCurrency(profile.downPayment)} {nft.valueCurrency}</span>
            </div>
            {profile.insurancePremium && (
              <div className="summary-item">
                <span className="summary-label">Insurance Premium</span>
                <span className="summary-value">{formatCurrency(profile.insurancePremium)} {nft.valueCurrency}</span>
              </div>
            )}
            <div className="summary-item total">
              <span className="summary-label">Total to pay now</span>
              <span className="summary-value-large">{formatCurrency(totalRequired)} {nft.valueCurrency}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Total loan cost</span>
              <span className="summary-value">{formatCurrency(profile.totalCost)} {nft.valueCurrency}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Solvency Verification */}
      <div className={`solvency-check ${hasSufficientBalance ? 'sufficient' : 'insufficient'}`}>
        <div className="solvency-header">
          <h3>Solvency Verification</h3>
          {hasSufficientBalance ? (
            <span className="solvency-status success">✓ Sufficient</span>
          ) : (
            <span className="solvency-status error">✗ Insufficient</span>
          )}
        </div>
        <div className="solvency-details">
          <div className="solvency-item">
            <span>Current wallet balance</span>
            <span>{formatCurrency(walletBalance)} {nft.valueCurrency}</span>
          </div>
          <div className="solvency-item">
            <span>Required amount</span>
            <span>{formatCurrency(totalRequired)} {nft.valueCurrency}</span>
          </div>
          {!hasSufficientBalance && (
            <div className="solvency-warning">
              <p>Your balance is insufficient. Please fund your wallet before continuing.</p>
            </div>
          )}
        </div>
      </div>

      {/* Legal Conditions */}
      <div className="legal-conditions">
        <h3>Legal Conditions</h3>
        <div className="conditions-checkboxes">
          <label className="checkbox-label">
            <input 
              type="checkbox" 
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
            <span>
              I accept the{' '}
              <button
                type="button"
                className="link-button"
                onClick={() => setShowTermsModal(true)}
              >
                terms and conditions
              </button>{' '}
              of BlockBank
            </span>
          </label>
          <label className="checkbox-label">
            <input 
              type="checkbox" 
              checked={risksAccepted}
              onChange={(e) => setRisksAccepted(e.target.checked)}
            />
            <span>I have read and understood the risks associated with this loan</span>
          </label>
        </div>
      </div>

      {/* Modal Terms and Conditions */}
      {showTermsModal && (
        <TermsAndConditions
          assetType={nft.assetType}
          onAccept={() => {
            setTermsAccepted(true)
            setShowTermsModal(false)
          }}
          onReject={() => {
            setShowTermsModal(false)
          }}
        />
      )}

      {/* Actions */}
      <div className="validation-actions">
        <button className="btn-secondary" onClick={onBack}>
          Back
        </button>
        <button 
          className="btn-primary btn-large"
          onClick={onConfirm}
          disabled={!canProceed}
        >
          Confirm and Pay
        </button>
      </div>
    </div>
  )
}

