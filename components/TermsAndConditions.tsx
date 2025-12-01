'use client'

import { useState } from 'react'
import { AssetType } from '@/types'

interface TermsAndConditionsProps {
  assetType: AssetType
  onAccept: () => void
  onReject: () => void
}

export default function TermsAndConditions({
  assetType,
  onAccept,
  onReject,
}: TermsAndConditionsProps) {
  const [accepted, setAccepted] = useState(false)
  const [scrolledToBottom, setScrolledToBottom] = useState(false)

  const getTermsDocument = () => {
    switch (assetType) {
      case 'REAL_ESTATE':
        return '/docs/TERMS_IMMOBILIER.md'
      case 'MINING':
      case 'INFRASTRUCTURE':
      case 'COMMODITIES':
      case 'OTHER':
        return '/docs/TERMS_OBJETS.md'
      default:
        return '/docs/LEGAL_FRAMEWORK.md'
    }
  }

  const getAssetTypeName = () => {
    switch (assetType) {
      case 'REAL_ESTATE':
        return 'Real Estate'
      case 'MINING':
        return 'Mining Equipment'
      case 'INFRASTRUCTURE':
        return 'Infrastructure'
      case 'COMMODITIES':
        return 'Precious Metals / Commodities'
      case 'OTHER':
        return 'Other Movable Assets'
      default:
        return 'Asset'
    }
  }

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    const isBottom =
      target.scrollHeight - target.scrollTop <= target.clientHeight + 50
    if (isBottom) {
      setScrolledToBottom(true)
    }
  }

  return (
    <div className="terms-modal">
      <div className="terms-content">
        <div className="terms-header">
          <h2>Terms and Conditions - NFT RWA Collateralized Loan</h2>
          <p className="terms-subtitle">Asset type: {getAssetTypeName()}</p>
        </div>

        <div className="terms-body" onScroll={handleScroll}>
          <div className="terms-section">
            <h3>1. Acceptance of Terms</h3>
            <p>
              By accepting these terms and conditions, you acknowledge that you have read,
              understood and accepted all loan conditions, including:
            </p>
            <ul>
              <li>Payment and interest conditions</li>
              <li>Maintenance and upkeep obligations</li>
              <li>Default and recovery processes</li>
              <li>Associated fees and costs</li>
              <li>Risks related to the loan</li>
            </ul>
          </div>

          <div className="terms-section">
            <h3>2. Loan Conditions</h3>
            <p>
              The loan is granted subject to:
            </p>
            <ul>
              <li>Minimum payment according to NFT RWA discount (10%, 15% or 20%)</li>
              <li>Respect of maximum LTV (Loan-to-Value) according to your Credit Score</li>
              <li>Variable interest rate according to risk profile</li>
              <li>Duration of 12 to 48 months according to selected profile</li>
            </ul>
          </div>

          <div className="terms-section">
            <h3>3. Borrower Obligations</h3>
            <p>You commit to:</p>
            <ul>
              <li>Make monthly payments on time</li>
              <li>Maintain the asset in good condition</li>
              <li>Subscribe to required insurance</li>
              <li>Notify any significant changes</li>
            </ul>
          </div>

          <div className="terms-section">
            <h3>4. Default and Recovery Process</h3>
            <p>
              In case of payment default exceeding 30 days:
            </p>
            <ul>
              <li>Formal notification with regularization period</li>
              <li>Recovery procedure initiation</li>
              <li>Asset seizure and sale according to jurisdiction</li>
              <li>Application of recovery fees</li>
            </ul>
            <p className="terms-warning">
              ⚠️ Delays and processes vary according to the asset&apos;s jurisdiction.
              Consult the complete document for specific details.
            </p>
          </div>

          <div className="terms-section">
            <h3>5. NFT RWA Discount System</h3>
            <p>
              Discounts of 10%, 15% or 20% are applicable according to:
            </p>
            <ul>
              <li>The NFT risk level (SAFE, MODERATE, RISKY)</li>
              <li>Your BlockBank Credit Score</li>
              <li>The asset type</li>
            </ul>
            <p>
              Discounts reduce the effective LTV and may reduce interest rates
              and insurance premiums.
            </p>
          </div>

          <div className="terms-section">
            <h3>6. Fees and Costs</h3>
            <ul>
              <li>Application fees: 0.5% - 1% of loan amount</li>
              <li>Valuation fees: Variable according to asset type</li>
              <li>Management fees: 0.1% per year</li>
              <li>Recovery fees: Variable according to jurisdiction</li>
            </ul>
          </div>

          <div className="terms-section">
            <h3>7. Limitation of Liability</h3>
            <p>
              The lender is not responsible for losses related to:
            </p>
            <ul>
              <li>Asset depreciation</li>
              <li>Market risks</li>
              <li>Damages not covered by insurance</li>
            </ul>
          </div>

          <div className="terms-section">
            <h3>8. Applicable Law and Jurisdiction</h3>
            <p>
              These terms are governed by the legislation of the jurisdiction where the
              asset is located. Any dispute will be resolved according to the procedures
              provided in the complete terms and conditions document.
            </p>
          </div>

          <div className="terms-section">
            <h3>9. Complete Documents</h3>
            <p>
              To consult the complete terms and conditions specific to your
              asset type, please consult:
            </p>
            <ul>
              <li>
                <a href="/docs/LEGAL_FRAMEWORK.md" target="_blank" rel="noopener noreferrer">
                  Complete Legal Framework
                </a>
              </li>
              {assetType === 'REAL_ESTATE' && (
                <li>
                  <a href="/docs/TERMS_IMMOBILIER.md" target="_blank" rel="noopener noreferrer">
                    Terms and Conditions - Real Estate
                  </a>
                </li>
              )}
              {(assetType === 'MINING' ||
                assetType === 'INFRASTRUCTURE' ||
                assetType === 'COMMODITIES' ||
                assetType === 'OTHER') && (
                <li>
                  <a href="/docs/TERMS_OBJETS.md" target="_blank" rel="noopener noreferrer">
                    Terms and Conditions - Objects and Movable Assets
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div className="terms-footer-note">
            <p>
              <strong>Important note:</strong> These terms and conditions are a
              summary. The complete document contains all legal details, recovery
              processes by jurisdiction, and specifics by asset type. It is strongly
              recommended to consult the complete document before accepting.
            </p>
          </div>
        </div>

        <div className="terms-actions">
          <div className="terms-checkbox">
            <input
              type="checkbox"
              id="accept-terms"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              disabled={!scrolledToBottom}
            />
            <label htmlFor="accept-terms">
              {scrolledToBottom
                ? "I have read and accept the terms and conditions"
                : 'Please scroll to the bottom to accept'}
            </label>
          </div>
          <div className="terms-buttons">
            <button
              type="button"
              onClick={onReject}
              className="btn-secondary"
            >
              Reject
            </button>
            <button
              type="button"
              onClick={onAccept}
              disabled={!accepted || !scrolledToBottom}
              className="btn-primary"
            >
              Accept and Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
