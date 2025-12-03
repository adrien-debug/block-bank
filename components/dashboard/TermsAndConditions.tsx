'use client'

import { useState } from 'react'
import DocumentIcon from '../icons/DocumentIcon'
import ShieldIcon from '../icons/ShieldIcon'
import MoneyIcon from '../icons/MoneyIcon'
import CheckIcon from '../icons/CheckIcon'
import InfoIcon from '../icons/InfoIcon'
import LockIcon from '../icons/LockIcon'

export default function TermsAndConditions() {
  return (
    <div className="terms-page-simple">
      <div className="terms-header-simple">
        <h1>Terms & Conditions</h1>
        <p className="terms-subtitle-simple">
          Protocol framework for asset tokenization and collateralized lending
        </p>
      </div>

      <div className="terms-content-simple">
        {/* Protocol Overview */}
        <section className="terms-section-simple">
          <div className="section-header-simple">
            <ShieldIcon className="section-icon" />
            <h2>Protocol Overview</h2>
          </div>
          <div className="section-content-simple">
            <p>
              The BlockBank protocol enables the tokenization of real-world assets (RWA) through 
              Special Purpose Vehicles (SPV) and provides collateralized lending services. Assets 
              are verified, transferred to an SPV, and represented as NFT tokens on-chain.
            </p>
            <div className="protocol-flow">
              <div className="flow-step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h4>Asset Submission</h4>
                  <p>Submit your asset with required documentation for verification</p>
                </div>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h4>Verification & Valuation</h4>
                  <p>Due diligence, authenticity check, and professional appraisal</p>
                </div>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h4>SPV Transfer</h4>
                  <p>Asset transferred to SPV, NFT RWA token issued on blockchain</p>
                </div>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h4>Loan Activation</h4>
                  <p>Smart contract deployment, collateral lock, funds disbursement</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Asset Types */}
        <section className="terms-section-simple">
          <div className="section-header-simple">
            <DocumentIcon className="section-icon" />
            <h2>Supported Asset Types</h2>
          </div>
          <div className="section-content-simple">
            <div className="assets-grid-simple">
              <div className="asset-card-simple">
                <h3>Real Estate</h3>
                <div className="asset-specs">
                  <div className="spec-item">
                    <span>LTV Range</span>
                    <span>30-70%</span>
                  </div>
                  <div className="spec-item">
                    <span>Rate Range</span>
                    <span>6-15% APY</span>
                  </div>
                </div>
              </div>
              <div className="asset-card-simple">
                <h3>Vehicles</h3>
                <div className="asset-specs">
                  <div className="spec-item">
                    <span>LTV Range</span>
                    <span>30-70%</span>
                  </div>
                  <div className="spec-item">
                    <span>Rate Range</span>
                    <span>7-16% APY</span>
                  </div>
                </div>
              </div>
              <div className="asset-card-simple">
                <h3>Luxury Items</h3>
                <div className="asset-specs">
                  <div className="spec-item">
                    <span>LTV Range</span>
                    <span>20-60%</span>
                  </div>
                  <div className="spec-item">
                    <span>Rate Range</span>
                    <span>8-17% APY</span>
                  </div>
                </div>
              </div>
              <div className="asset-card-simple">
                <h3>Collectibles</h3>
                <div className="asset-specs">
                  <div className="spec-item">
                    <span>LTV Range</span>
                    <span>20-60%</span>
                  </div>
                  <div className="spec-item">
                    <span>Rate Range</span>
                    <span>8-17% APY</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Credit Scoring */}
        <section className="terms-section-simple">
          <div className="section-header-simple">
            <CheckIcon className="section-icon" />
            <h2>Credit Scoring System</h2>
          </div>
          <div className="section-content-simple">
            <p>
              Loan terms are determined by a dynamic credit scoring system that evaluates borrower 
              risk profile, asset quality, and market conditions.
            </p>
            <div className="credit-tiers">
              <div className="tier-card">
                <div className="tier-badge tier-a">Tier A</div>
                <div className="tier-specs">
                  <div className="tier-spec">
                    <span>Credit Score</span>
                    <span>800-1000</span>
                  </div>
                  <div className="tier-spec">
                    <span>LTV</span>
                    <span>60-70%</span>
                  </div>
                  <div className="tier-spec">
                    <span>Rate</span>
                    <span>6-8% APY</span>
                  </div>
                </div>
              </div>
              <div className="tier-card">
                <div className="tier-badge tier-b">Tier B</div>
                <div className="tier-specs">
                  <div className="tier-spec">
                    <span>Credit Score</span>
                    <span>600-799</span>
                  </div>
                  <div className="tier-spec">
                    <span>LTV</span>
                    <span>50-60%</span>
                  </div>
                  <div className="tier-spec">
                    <span>Rate</span>
                    <span>8-10% APY</span>
                  </div>
                </div>
              </div>
              <div className="tier-card">
                <div className="tier-badge tier-c">Tier C</div>
                <div className="tier-specs">
                  <div className="tier-spec">
                    <span>Credit Score</span>
                    <span>400-599</span>
                  </div>
                  <div className="tier-spec">
                    <span>LTV</span>
                    <span>40-50%</span>
                  </div>
                  <div className="tier-spec">
                    <span>Rate</span>
                    <span>10-12% APY</span>
                  </div>
                </div>
              </div>
              <div className="tier-card">
                <div className="tier-badge tier-d">Tier D</div>
                <div className="tier-specs">
                  <div className="tier-spec">
                    <span>Credit Score</span>
                    <span>0-399</span>
                  </div>
                  <div className="tier-spec">
                    <span>LTV</span>
                    <span>30-40%</span>
                  </div>
                  <div className="tier-spec">
                    <span>Rate</span>
                    <span>12-15% APY</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* NFT RWA Discount */}
        <section className="terms-section-simple">
          <div className="section-header-simple">
            <MoneyIcon className="section-icon" />
            <h2>NFT RWA Discount System</h2>
          </div>
          <div className="section-content-simple">
            <p>
              NFT RWA tokens representing verified assets receive automatic discounts based on 
              risk assessment and credit quality.
            </p>
            <div className="discounts-grid-simple">
              <div className="discount-card-simple">
                <div className="discount-badge">10%</div>
                <h3>Standard</h3>
                <p>Moderate risk NFTs</p>
                <div className="discount-detail">
                  <span>LTV Adjustment</span>
                  <span>-10%</span>
                </div>
              </div>
              <div className="discount-card-simple">
                <div className="discount-badge">15%</div>
                <h3>Premium</h3>
                <p>Safe NFTs with good credit</p>
                <div className="discount-detail">
                  <span>LTV Adjustment</span>
                  <span>-15%</span>
                </div>
              </div>
              <div className="discount-card-simple">
                <div className="discount-badge">20%</div>
                <h3>Maximum</h3>
                <p>Safe NFTs with excellent credit</p>
                <div className="discount-detail">
                  <span>LTV Adjustment</span>
                  <span>-20%</span>
                </div>
                <div className="discount-detail">
                  <span>Rate Adjustment</span>
                  <span>-0.5% APY</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Default & Recovery */}
        <section className="terms-section-simple">
          <div className="section-header-simple">
            <LockIcon className="section-icon" />
            <h2>Default & Recovery Protocol</h2>
          </div>
          <div className="section-content-simple">
            <p>
              In case of payment default, the protocol initiates a recovery process to protect 
              lender interests while providing fair opportunities for borrowers to resolve issues.
            </p>
            <div className="recovery-process-simple">
              <div className="recovery-step">
                <div className="step-indicator">1</div>
                <div>
                  <h4>Default Trigger</h4>
                  <p>Payment delay exceeding 30 days</p>
                </div>
              </div>
              <div className="recovery-step">
                <div className="step-indicator">2</div>
                <div>
                  <h4>Grace Period</h4>
                  <p>15-30 days notification and resolution window</p>
                </div>
              </div>
              <div className="recovery-step">
                <div className="step-indicator">3</div>
                <div>
                  <h4>Recovery Action</h4>
                  <p>Asset recovery through legal channels</p>
                </div>
              </div>
              <div className="recovery-step">
                <div className="step-indicator">4</div>
                <div>
                  <h4>Liquidation</h4>
                  <p>Asset sale to recover outstanding balance</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Fees */}
        <section className="terms-section-simple">
          <div className="section-header-simple">
            <InfoIcon className="section-icon" />
            <h2>Fees & Costs</h2>
          </div>
          <div className="section-content-simple">
            <div className="fees-list-simple">
              <div className="fee-item-simple">
                <span>Initial Processing Fee</span>
                <span>0.5-1% of loan amount</span>
              </div>
              <div className="fee-item-simple">
                <span>Asset Verification</span>
                <span>Included in processing</span>
              </div>
              <div className="fee-item-simple">
                <span>SPV Setup & NFT Minting</span>
                <span>Included in processing</span>
              </div>
              <div className="fee-item-simple">
                <span>Recovery Costs</span>
                <span>Charged only in case of default</span>
              </div>
              <div className="fee-item-simple">
                <span>Asset Management</span>
                <span>0.1% per year (if applicable)</span>
              </div>
            </div>
          </div>
        </section>

        {/* Important Notes */}
        <section className="terms-section-simple terms-notice">
          <div className="section-content-simple">
            <h3>Important Notes</h3>
            <ul>
              <li>All assets undergo comprehensive verification before tokenization</li>
              <li>Loan terms are determined by automated credit scoring and risk assessment</li>
              <li>NFT RWA tokens represent legal ownership of the underlying asset</li>
              <li>Default recovery timelines vary based on asset type and circumstances</li>
              <li>All transactions are executed through smart contracts for transparency</li>
            </ul>
          </div>
        </section>
      </div>

      <style jsx>{`
        .terms-page-simple {
          max-width: 1000px;
          margin: 0 auto;
          padding: var(--space-8);
        }

        .terms-header-simple {
          text-align: center;
          margin-bottom: var(--space-8);
        }

        .terms-header-simple h1 {
          font-size: 32px;
          font-weight: 700;
          color: var(--color-text-primary);
          margin-bottom: var(--space-2);
        }

        .terms-subtitle-simple {
          font-size: 16px;
          color: var(--color-text-secondary);
        }

        .terms-content-simple {
          display: flex;
          flex-direction: column;
          gap: var(--space-8);
        }

        .terms-section-simple {
          background: var(--color-bg-secondary);
          border-radius: var(--radius-lg);
          padding: var(--space-6);
          border: 1px solid var(--color-border-default);
        }

        .section-header-simple {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          margin-bottom: var(--space-4);
        }

        .section-icon {
          width: 24px;
          height: 24px;
          color: var(--color-primary-500);
        }

        .section-header-simple h2 {
          font-size: 20px;
          font-weight: 600;
          color: var(--color-text-primary);
        }

        .section-content-simple {
          color: var(--color-text-secondary);
          line-height: 1.6;
        }

        .section-content-simple p {
          margin-bottom: var(--space-4);
        }

        .protocol-flow {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          margin-top: var(--space-4);
          flex-wrap: wrap;
        }

        .flow-step {
          flex: 1;
          min-width: 150px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-2);
          text-align: center;
        }

        .step-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--color-primary-500);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 18px;
        }

        .step-content h4 {
          font-size: 14px;
          font-weight: 600;
          color: var(--color-text-primary);
          margin-bottom: 4px;
        }

        .step-content p {
          font-size: 12px;
          color: var(--color-text-secondary);
          margin: 0;
        }

        .flow-arrow {
          color: var(--color-primary-500);
          font-size: 20px;
          font-weight: bold;
        }

        .assets-grid-simple {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--space-4);
          margin-top: var(--space-4);
        }

        .asset-card-simple {
          background: var(--color-bg-primary);
          border: 1px solid var(--color-border-default);
          border-radius: var(--radius-md);
          padding: var(--space-4);
        }

        .asset-card-simple h3 {
          font-size: 16px;
          font-weight: 600;
          color: var(--color-text-primary);
          margin-bottom: var(--space-3);
        }

        .asset-specs {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .spec-item {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
        }

        .spec-item span:first-child {
          color: var(--color-text-secondary);
        }

        .spec-item span:last-child {
          color: var(--color-text-primary);
          font-weight: 500;
        }

        .credit-tiers {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--space-4);
          margin-top: var(--space-4);
        }

        .tier-card {
          background: var(--color-bg-primary);
          border: 1px solid var(--color-border-default);
          border-radius: var(--radius-md);
          padding: var(--space-4);
        }

        .tier-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: var(--space-3);
        }

        .tier-a { background: rgba(16, 185, 129, 0.2); color: #10B981; }
        .tier-b { background: rgba(59, 130, 246, 0.2); color: #3B82F6; }
        .tier-c { background: rgba(245, 158, 11, 0.2); color: #F59E0B; }
        .tier-d { background: rgba(239, 68, 68, 0.2); color: #EF4444; }

        .tier-specs {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .tier-spec {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
        }

        .tier-spec span:first-child {
          color: var(--color-text-secondary);
        }

        .tier-spec span:last-child {
          color: var(--color-text-primary);
          font-weight: 500;
        }

        .discounts-grid-simple {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--space-4);
          margin-top: var(--space-4);
        }

        .discount-card-simple {
          background: var(--color-bg-primary);
          border: 1px solid var(--color-border-default);
          border-radius: var(--radius-md);
          padding: var(--space-4);
          text-align: center;
        }

        .discount-badge {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: var(--color-primary-500);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: 700;
          margin: 0 auto var(--space-3);
        }

        .discount-card-simple h3 {
          font-size: 16px;
          font-weight: 600;
          color: var(--color-text-primary);
          margin-bottom: var(--space-2);
        }

        .discount-card-simple > p {
          font-size: 12px;
          color: var(--color-text-secondary);
          margin-bottom: var(--space-3);
        }

        .discount-detail {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          margin-top: var(--space-2);
        }

        .discount-detail span:first-child {
          color: var(--color-text-secondary);
        }

        .discount-detail span:last-child {
          color: var(--color-text-primary);
          font-weight: 500;
        }

        .recovery-process-simple {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          margin-top: var(--space-4);
        }

        .recovery-step {
          display: flex;
          align-items: flex-start;
          gap: var(--space-4);
        }

        .step-indicator {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--color-primary-500);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          flex-shrink: 0;
        }

        .recovery-step h4 {
          font-size: 16px;
          font-weight: 600;
          color: var(--color-text-primary);
          margin-bottom: 4px;
        }

        .recovery-step p {
          font-size: 14px;
          color: var(--color-text-secondary);
          margin: 0;
        }

        .fees-list-simple {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          margin-top: var(--space-4);
        }

        .fee-item-simple {
          display: flex;
          justify-content: space-between;
          padding: var(--space-3);
          background: var(--color-bg-primary);
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border-default);
        }

        .fee-item-simple span:first-child {
          color: var(--color-text-primary);
          font-weight: 500;
        }

        .fee-item-simple span:last-child {
          color: var(--color-text-secondary);
        }

        .terms-notice {
          background: rgba(37, 99, 235, 0.05);
          border-color: var(--color-primary-500);
        }

        .terms-notice h3 {
          font-size: 18px;
          font-weight: 600;
          color: var(--color-text-primary);
          margin-bottom: var(--space-3);
        }

        .terms-notice ul {
          list-style: none;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .terms-notice li {
          padding-left: var(--space-6);
          position: relative;
          color: var(--color-text-secondary);
        }

        .terms-notice li::before {
          content: '•';
          position: absolute;
          left: 0;
          color: var(--color-primary-500);
          font-weight: bold;
        }

        @media (max-width: 768px) {
          .terms-page-simple {
            padding: var(--space-4);
          }

          .protocol-flow {
            flex-direction: column;
          }

          .flow-arrow {
            transform: rotate(90deg);
          }

          .assets-grid-simple,
          .credit-tiers,
          .discounts-grid-simple {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
