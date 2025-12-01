'use client'

import { useState } from 'react'
import DocumentIcon from '../icons/DocumentIcon'
import MoneyIcon from '../icons/MoneyIcon'
import ShieldIcon from '../icons/ShieldIcon'
import PackageIcon from '../icons/PackageIcon'
import CheckIcon from '../icons/CheckIcon'

export type AssetTypeDetail = 'real-estate' | 'vehicles' | 'objects'

interface TermsDetailPageProps {
  assetType: AssetTypeDetail
  onClose: () => void
}

export default function TermsDetailPage({ assetType, onClose }: TermsDetailPageProps) {
  const getTitle = () => {
    switch (assetType) {
      case 'real-estate':
        return 'Real Estate - Complete Terms & Conditions'
      case 'vehicles':
        return 'Vehicles - Complete Terms & Conditions'
      case 'objects':
        return 'Objects & Movable Assets - Complete Terms & Conditions'
    }
  }

  const getIcon = () => {
    switch (assetType) {
      case 'real-estate':
        return <ShieldIcon />
      case 'vehicles':
        return <PackageIcon />
      case 'objects':
        return <PackageIcon />
    }
  }

  return (
    <div className="terms-detail-overlay" onClick={onClose}>
      <div className="terms-detail-page" onClick={(e) => e.stopPropagation()}>
        <div className="terms-detail-header">
          <div className="terms-detail-header-content">
            <div className="terms-detail-icon">
              {getIcon()}
            </div>
            <div>
              <h1>{getTitle()}</h1>
              <p className="terms-detail-subtitle">Complete legal framework and terms</p>
            </div>
          </div>
          <button className="terms-detail-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="terms-detail-body">
          {assetType === 'real-estate' && <RealEstateFullContent />}
          {assetType === 'vehicles' && <VehiclesFullContent />}
          {assetType === 'objects' && <ObjectsFullContent />}
        </div>
      </div>
    </div>
  )
}

function RealEstateFullContent() {
  return (
    <div className="terms-full-content">
      <Section title="1. Definitions" icon={<DocumentIcon />}>
        <p><strong>Real Estate Asset:</strong> Real estate property (apartment, villa, office, land) represented by an NFT RWA.</p>
        <p><strong>Title Deed:</strong> Legal document establishing ownership of the asset, registered with the competent land registry.</p>
        <p><strong>Real Estate SPV:</strong> Special Purpose Vehicle that is the legal owner of the real estate asset.</p>
        <p><strong>Occupant:</strong> Natural or legal person occupying the asset (owner, tenant, usufructuary).</p>
        <p><strong>Eviction:</strong> Legal procedure for removing the occupant in case of payment default.</p>
      </Section>

      <Section title="2. Title Acquisition Conditions" icon={<DocumentIcon />}>
        <SubSection title="2.1 Required Documents">
          <p><strong>Mandatory:</strong></p>
          <ul>
            <li>Notarized sale deed or equivalent</li>
            <li>Property certificate from land registry</li>
            <li>Cadastral plan or equivalent</li>
            <li>Urban planning certificate (if applicable)</li>
            <li>Verification of charges and debts (non-encumbrance certificate)</li>
          </ul>
          <p><strong>Optional by Jurisdiction:</strong></p>
          <ul>
            <li>Compliance certificate</li>
            <li>Energy certificate (if required)</li>
            <li>Building permit (if applicable)</li>
          </ul>
        </SubSection>

        <SubSection title="2.2 Verification Process">
          <p><strong>Steps:</strong></p>
          <ol>
            <li><strong>Title Verification:</strong> Authenticity and validity of the title</li>
            <li><strong>Charges Verification:</strong> Absence of debts, mortgages, seizures</li>
            <li><strong>Cadastral Verification:</strong> Correspondence with the registry</li>
            <li><strong>Legal Verification:</strong> Compliance with local legislation</li>
          </ol>
          <p><strong>Timeline:</strong> 30-90 days depending on jurisdiction</p>
        </SubSection>

        <SubSection title="2.3 Transfer to SPV">
          <p><strong>Process:</strong></p>
          <ol>
            <li>Signing of SPV → Seller sale deed</li>
            <li>Registration at land registry in SPV name</li>
            <li>Issuance of NFT RWA linked to the asset</li>
            <li>On-chain registration of the NFT</li>
          </ol>
          <p><strong>Costs:</strong></p>
          <ul>
            <li>Notary fees: 2-5% of value (depending on jurisdiction)</li>
            <li>Registration fees: 0.5-2% of value</li>
            <li>NFT issuance fees: 100-500 USD</li>
          </ul>
        </SubSection>
      </Section>

      <Section title="3. Loan Conditions" icon={<MoneyIcon />}>
        <SubSection title="3.1 Amount and LTV">
          <p><strong>Maximum LTV by Credit Score:</strong></p>
          <ul>
            <li>Tier A (800-1000): 60-70% LTV</li>
            <li>Tier B (600-799): 50-60% LTV</li>
            <li>Tier C (400-599): 40-50% LTV</li>
            <li>Tier D (0-399): 30-40% LTV</li>
          </ul>
          <p><strong>Adjustment by NFT Risk:</strong></p>
          <ul>
            <li>SAFE: +5% LTV</li>
            <li>MODERATE: Base LTV</li>
            <li>RISKY: -10% LTV</li>
          </ul>
          <p><strong>Adjustment with NFT Discount:</strong></p>
          <ul>
            <li>10% Discount: LTV - 10%</li>
            <li>15% Discount: LTV - 15%</li>
            <li>20% Discount: LTV - 20%</li>
          </ul>
          <div className="example-box">
            <p><strong>Example:</strong></p>
            <ul>
              <li>NFT Value: 300,000 USDC</li>
              <li>Credit Score: 750 (Tier A)</li>
              <li>Base LTV: 65%</li>
              <li>15% Discount: Effective LTV = 50%</li>
              <li>Loan Amount: 150,000 USDC</li>
              <li>Minimum Payment: 45,000 USDC (15%)</li>
            </ul>
          </div>
        </SubSection>

        <SubSection title="3.2 Interest Rates">
          <p><strong>Base Rates by Credit Score:</strong></p>
          <ul>
            <li>Tier A: 6-8% APY</li>
            <li>Tier B: 8-10% APY</li>
            <li>Tier C: 10-12% APY</li>
            <li>Tier D: 12-15% APY</li>
          </ul>
          <p><strong>Adjustments:</strong></p>
          <ul>
            <li>SAFE NFT Risk: -0.5% APY</li>
            <li>RISKY NFT Risk: +1.5% APY</li>
            <li>20% Discount: -0.5% APY</li>
            <li>Full Insurance: -0.5% APY</li>
          </ul>
        </SubSection>

        <SubSection title="3.3 Duration">
          <ul>
            <li>12 months (minimum)</li>
            <li>24 months</li>
            <li>36 months (recommended)</li>
            <li>48 months (maximum)</li>
          </ul>
        </SubSection>
      </Section>

      <Section title="4. Borrower Obligations" icon={<ShieldIcon />}>
        <SubSection title="4.1 Payments">
          <ul>
            <li>Fixed monthly payment according to schedule</li>
            <li>Grace period: 5 calendar days</li>
            <li>Late interest: 0.1% per day of delay</li>
          </ul>
        </SubSection>

        <SubSection title="4.2 Maintenance and Upkeep">
          <p><strong>Obligations:</strong></p>
          <ul>
            <li>Regular maintenance of the asset</li>
            <li>Necessary repairs (roofing, plumbing, electricity, etc.)</li>
            <li>Compliance with safety and habitability standards</li>
          </ul>
          <p><strong>Verifications:</strong></p>
          <ul>
            <li>Annual inspection by an expert (at borrower's expense)</li>
            <li>Quarterly maintenance report</li>
          </ul>
        </SubSection>

        <SubSection title="4.3 Occupation">
          <p><strong>Rules:</strong></p>
          <ul>
            <li>Personal occupation or rental authorized</li>
            <li>Subletting prohibited without authorization</li>
            <li>Illegal or harmful activities prohibited</li>
          </ul>
          <p><strong>Changes:</strong></p>
          <ul>
            <li>Mandatory notification of any change in occupation</li>
            <li>Authorization required for major works ({'>'} $10,000)</li>
          </ul>
        </SubSection>

        <SubSection title="4.4 Information">
          <p><strong>Mandatory Notifications:</strong></p>
          <ul>
            <li>Change of contact address</li>
            <li>Claim or damage</li>
            <li>Dispute with a third party</li>
            <li>Seizure or judicial procedure</li>
          </ul>
        </SubSection>

        <SubSection title="4.5 Home Insurance">
          <ul>
            <li>Mandatory in all jurisdictions</li>
            <li>Minimum coverage: Reconstruction value</li>
            <li>Notification to lender in case of claim</li>
            <li>Premium: 0.2% - 0.5% of value per year</li>
          </ul>
        </SubSection>

        <SubSection title="4.6 Early Repayment">
          <ul>
            <li>Authorized at any time</li>
            <li>Penalty: Maximum 1% of remaining capital</li>
            <li>Calculation: Remaining interest + penalty (if applicable)</li>
          </ul>
        </SubSection>
      </Section>

      <Section title="5. Lender Rights" icon={<ShieldIcon />}>
        <SubSection title="5.1 Verification">
          <p><strong>Right to Visit:</strong></p>
          <ul>
            <li>With 48 hours notice</li>
            <li>Maximum 2 times per year (except emergency)</li>
            <li>In presence of borrower or representative</li>
          </ul>
          <p><strong>Right to Inspection:</strong></p>
          <ul>
            <li>Technical inspection by expert</li>
            <li>Verification of asset condition</li>
            <li>Verification of insurance</li>
          </ul>
        </SubSection>

        <SubSection title="5.2 Seizure">
          <p><strong>Trigger Conditions:</strong></p>
          <ul>
            <li>Payment delay {'>'} 30 consecutive days</li>
            <li>Non-compliance with obligations (maintenance, insurance)</li>
            <li>Significant deterioration of the asset</li>
            <li>Illegal or harmful activity</li>
          </ul>
          <p><strong>Process:</strong></p>
          <ol>
            <li>Formal notification (15 days to regularize)</li>
            <li>Initiation of legal procedure</li>
            <li>Asset seizure</li>
            <li>Occupant eviction (if necessary)</li>
            <li>Sale or retention</li>
          </ol>
        </SubSection>
      </Section>

      <Section title="6. Default and Recovery Process" icon={<ShieldIcon />}>
        <SubSection title="6.1 Trigger">
          <p><strong>Automatic Default:</strong></p>
          <ul>
            <li>Payment delay {'>'} 30 days</li>
            <li>Non-payment of 2 consecutive installments</li>
          </ul>
          <p><strong>Contractual Default:</strong></p>
          <ul>
            <li>Non-compliance with obligations (maintenance, insurance)</li>
            <li>Significant deterioration</li>
            <li>Illegal activity</li>
          </ul>
        </SubSection>

        <SubSection title="6.2 Notification">
          <p><strong>Content:</strong></p>
          <ul>
            <li>Amount due (capital + interest + fees)</li>
            <li>Regularization period (15-30 days depending on jurisdiction)</li>
            <li>Consequences in case of non-payment</li>
          </ul>
          <p><strong>Modes:</strong></p>
          <ul>
            <li>On-chain notification (smart contract)</li>
            <li>Registered letter with acknowledgment of receipt</li>
            <li>Email (if accepted by borrower)</li>
          </ul>
        </SubSection>

        <SubSection title="6.3 Recovery Process by Jurisdiction">
          <div className="jurisdiction-box">
            <h4>Qatar</h4>
            <p><strong>Steps:</strong></p>
            <ol>
              <li>Notification: 15 days before action</li>
              <li>Court Request: Execution request</li>
              <li>Judgment: 15-30 days</li>
              <li>Eviction: 30 days after judgment</li>
              <li>Sale: Auction or private sale</li>
            </ol>
            <p><strong>Total Timeline:</strong> 60-90 days</p>
            <p><strong>Costs:</strong></p>
            <ul>
              <li>Legal fees: $1,000-$3,000</li>
              <li>Bailiff fees: $500-$1,500</li>
              <li>Securing fees: $500-$1,000</li>
            </ul>
          </div>

          <div className="jurisdiction-box">
            <h4>France</h4>
            <p><strong>Steps:</strong></p>
            <ol>
              <li>Command to Pay: 2 months before seizure</li>
              <li>Real Estate Seizure: Judicial procedure</li>
              <li>Publication: 2 months of advertising</li>
              <li>Adjudication: Auction sale</li>
              <li>Eviction: 1-3 months after adjudication</li>
            </ol>
            <p><strong>Total Timeline:</strong> 6-12 months</p>
            <p><strong>Costs:</strong></p>
            <ul>
              <li>Legal fees: $2,000-$5,000</li>
              <li>Bailiff fees: $1,000-$2,000</li>
              <li>Publication fees: $500-$1,000</li>
            </ul>
          </div>

          <div className="jurisdiction-box">
            <h4>United States</h4>
            <p><strong>Steps:</strong></p>
            <ol>
              <li>Notice of Default: 30-90 days (depending on state)</li>
              <li>Foreclosure: Judicial or non-judicial procedure</li>
              <li>Public Sale: Auction</li>
              <li>Eviction: 30-60 days after sale</li>
            </ol>
            <p><strong>Total Timeline:</strong> 90-180 days (non-judicial) or 6-12 months (judicial)</p>
            <p><strong>Costs:</strong></p>
            <ul>
              <li>Legal fees: $1,500-$4,000</li>
              <li>Sale fees: $1,000-$2,000</li>
              <li>Eviction fees: $500-$1,500</li>
            </ul>
          </div>
        </SubSection>

        <SubSection title="6.4 Occupant Eviction">
          <p><strong>Standard Procedure:</strong></p>
          <ol>
            <li><strong>Eviction Notification:</strong> Registered letter, posting on premises, 15-30 days depending on jurisdiction</li>
            <li><strong>Bailiff Intervention:</strong> Mandatory presence, inventory of goods, securing premises</li>
            <li><strong>Removal:</strong> Removal of occupants, lock change, key handover to new owner</li>
            <li><strong>Goods Management:</strong> Complete inventory, storage of personal belongings (30-90 days), disposal according to local legislation</li>
          </ol>
          <p><strong>Eviction Costs:</strong></p>
          <ul>
            <li>Bailiff fees: $500-$2,000</li>
            <li>Securing fees: $500-$1,500</li>
            <li>Storage fees: $200-$500/month</li>
          </ul>
          <p><strong>Occupant Protection:</strong></p>
          <ul>
            <li>Respect of legal deadlines</li>
            <li>Possibility of appeal (depending on jurisdiction)</li>
            <li>Relocation assistance (if provided by law)</li>
          </ul>
        </SubSection>
      </Section>

      <Section title="7. Asset Sale in Case of Default" icon={<MoneyIcon />}>
        <SubSection title="7.1 Sale Methods">
          <p><strong>Public Auction Sale:</strong></p>
          <ul>
            <li>Standard method</li>
            <li>Maximum transparency</li>
            <li>Timeline: 30-90 days after seizure</li>
          </ul>
          <p><strong>Private Sale:</strong></p>
          <ul>
            <li>If authorized by jurisdiction</li>
            <li>Expert evaluation</li>
            <li>Timeline: 60-120 days</li>
          </ul>
          <p><strong>Retention by Lender:</strong></p>
          <ul>
            <li>If authorized by contract</li>
            <li>Evaluation at market value</li>
            <li>Compensation with debt</li>
          </ul>
        </SubSection>

        <SubSection title="7.2 Sale Proceeds Distribution">
          <p><strong>Priority Order:</strong></p>
          <ol>
            <li>Procedure fees (legal, bailiff, etc.)</li>
            <li>Interest and penalties</li>
            <li>Remaining capital</li>
            <li>Balance to borrower (if positive)</li>
          </ol>
          <div className="example-box">
            <p><strong>Example:</strong></p>
            <ul>
              <li>Sale value: 250,000 USDC</li>
              <li>Procedure fees: 5,000 USDC</li>
              <li>Remaining capital: 200,000 USDC</li>
              <li>Interest/penalties: 10,000 USDC</li>
              <li><strong>Borrower balance:</strong> 35,000 USDC</li>
            </ul>
          </div>
        </SubSection>

        <SubSection title="7.3 Deficit">
          <p>In case of deficit:</p>
          <ul>
            <li>The borrower remains liable for the balance</li>
            <li>Recovery according to local legislation</li>
            <li>Impact on BlockBank Credit Score</li>
          </ul>
        </SubSection>
      </Section>

      <Section title="8. Fees and Costs" icon={<MoneyIcon />}>
        <SubSection title="8.1 Loan Fees">
          <p><strong>Initial Fees:</strong></p>
          <ul>
            <li>Application fees: 0.5-1% of loan amount (max $1,000)</li>
            <li>Valuation fees: $500-$2,000</li>
            <li>Registration fees: Variable by jurisdiction</li>
            <li>Notary fees: 2-5% of property value</li>
            <li>NFT issuance fees: $100-$500</li>
          </ul>
          <p><strong>Recurring Fees:</strong></p>
          <ul>
            <li>Management fees: 0.1% per year (payable monthly)</li>
            <li>Inspection fees: $200-$500/year</li>
          </ul>
        </SubSection>

        <SubSection title="8.2 Default Fees">
          <p><strong>Late Fees:</strong></p>
          <ul>
            <li>Late interest: 0.1% per day</li>
            <li>Reminder fees: $50-$200</li>
          </ul>
          <p><strong>Recovery Fees:</strong></p>
          <ul>
            <li>See section 6.3 (by jurisdiction)</li>
            <li>Legal fees: $1,000-$5,000</li>
            <li>Bailiff fees: $500-$2,000</li>
            <li>Publication fees: $500-$1,000 (France)</li>
          </ul>
        </SubSection>
      </Section>

      <Section title="9. Insurance" icon={<ShieldIcon />}>
        <SubSection title="9.1 Home Insurance">
          <p><strong>Mandatory:</strong></p>
          <ul>
            <li>Minimum coverage: Reconstruction value</li>
            <li>Risks covered: Fire, water damage, storm, theft</li>
            <li>Premium: 0.2% - 0.5% of value per year</li>
          </ul>
        </SubSection>

        <SubSection title="9.2 Loan Insurance">
          <p><strong>Optional but Recommended:</strong></p>
          <ul>
            <li>Borrower default coverage</li>
            <li>Premium: 0.5% - 5% depending on Credit Score</li>
            <li>Coverage options: 50%, 75%, 100%</li>
            <li>Market risk coverage: 0%, 50%, 75%</li>
            <li>Asset risk coverage: 0%, 50%, 75%</li>
          </ul>
        </SubSection>
      </Section>

      <Section title="10. General Provisions" icon={<DocumentIcon />}>
        <SubSection title="10.1 Applicable Law">
          <p><strong>Jurisdiction:</strong></p>
          <ul>
            <li>According to asset location</li>
            <li>Arbitration clause possible</li>
          </ul>
        </SubSection>

        <SubSection title="10. Dispute Resolution">
          <p><strong>Mediation:</strong></p>
          <ul>
            <li>Mediation attempt before judicial procedure</li>
            <li>Timeline: 30 days</li>
          </ul>
          <p><strong>Arbitration:</strong></p>
          <ul>
            <li>If provided in contract</li>
            <li>Competent arbitral tribunal</li>
          </ul>
          <p><strong>Jurisdiction:</strong></p>
          <ul>
            <li>Competent courts according to asset jurisdiction</li>
          </ul>
        </SubSection>

        <SubSection title="10.3 Modifications">
          <p><strong>Contract Modification:</strong></p>
          <ul>
            <li>30 days notice before</li>
            <li>Acceptance required for substantial modifications</li>
          </ul>
          <p><strong>Condition Modifications:</strong></p>
          <ul>
            <li>Variable rate: 30 days notice before change</li>
            <li>General conditions: Quarterly notification</li>
          </ul>
        </SubSection>
      </Section>

      <Section title="11. Acceptance" icon={<CheckIcon />}>
        <p>By accepting these terms and conditions, the borrower:</p>
        <ol>
          <li>Acknowledges having read and understood all terms</li>
          <li>Accepts loan conditions and obligations</li>
          <li>Accepts default and recovery processes</li>
          <li>Recognizes risks associated with the loan</li>
        </ol>
        <p><strong>Electronic Signature:</strong></p>
        <ul>
          <li>Acceptance via on-chain signature (smart contract)</li>
          <li>Legal value equivalent to handwritten signature</li>
        </ul>
      </Section>
    </div>
  )
}

function VehiclesFullContent() {
  return (
    <div className="terms-full-content">
      <Section title="1. Definitions" icon={<DocumentIcon />}>
        <p><strong>Vehicle:</strong> Any motor vehicle (car, truck, motorcycle, mobile equipment) represented by an NFT RWA.</p>
        <p><strong>Title Deed:</strong> Certificate of ownership or vehicle registration title.</p>
        <p><strong>Repossession:</strong> Seizure of the vehicle in case of payment default.</p>
        <p><strong>GPS Location:</strong> GPS tracking system installed on the vehicle (optional).</p>
      </Section>

      <Section title="2. Title Acquisition Conditions" icon={<DocumentIcon />}>
        <SubSection title="2.1 Required Documents">
          <p><strong>Mandatory:</strong></p>
          <ul>
            <li>Certificate of ownership (vehicle title)</li>
            <li>Registration certificate or equivalent</li>
            <li>Debt/liens verification (non-encumbrance certificate)</li>
            <li>Technical inspection (if required)</li>
          </ul>
        </SubSection>

        <SubSection title="2.2 Verification Process">
          <p><strong>Steps:</strong></p>
          <ol>
            <li>Title Verification: Authenticity and validity</li>
            <li>Debt Verification: Absence of loans, seizures, liens</li>
            <li>Technical Verification: Vehicle condition, mileage</li>
            <li>Legal Verification: Compliance with legislation</li>
          </ol>
          <p><strong>Timeline:</strong> 7-15 days</p>
        </SubSection>
      </Section>

      <Section title="3. Loan Conditions" icon={<MoneyIcon />}>
        <SubSection title="3.1 Amount and LTV">
          <p><strong>Maximum LTV:</strong></p>
          <ul>
            <li>Tier A: 60-70% LTV</li>
            <li>Tier B: 50-60% LTV</li>
            <li>Tier C: 40-50% LTV</li>
            <li>Tier D: 30-40% LTV</li>
          </ul>
        </SubSection>

        <SubSection title="3.2 Interest Rates">
          <ul>
            <li>Tier A: 7-9% APY</li>
            <li>Tier B: 9-11% APY</li>
            <li>Tier C: 11-13% APY</li>
            <li>Tier D: 13-16% APY</li>
          </ul>
        </SubSection>
      </Section>

      <Section title="4. Borrower Obligations" icon={<ShieldIcon />}>
        <SubSection title="4.1 Payments">
          <ul>
            <li>Fixed monthly payment</li>
            <li>Grace period: 5 days</li>
            <li>Late interest: 0.1% per day</li>
          </ul>
        </SubSection>

        <SubSection title="4.2 Usage">
          <p><strong>Rules:</strong></p>
          <ul>
            <li>Normal and legal use only</li>
            <li>Major modification prohibited without authorization</li>
            <li>Subletting prohibited</li>
          </ul>
          <p><strong>Mileage:</strong></p>
          <ul>
            <li>Annual limit: 20,000-30,000 km (depending on type)</li>
            <li>Excess: Penalty of $0.10-$0.20/km</li>
          </ul>
        </SubSection>

        <SubSection title="4.3 Maintenance">
          <p><strong>Obligations:</strong></p>
          <ul>
            <li>Regular maintenance according to manufacturer manual</li>
            <li>Periodic revisions</li>
            <li>Necessary repairs</li>
          </ul>
          <p><strong>Verifications:</strong></p>
          <ul>
            <li>Semi-annual inspection (at borrower's expense)</li>
            <li>Maintenance report</li>
          </ul>
        </SubSection>

        <SubSection title="4.4 GPS Location">
          <p><strong>If Installed:</strong></p>
          <ul>
            <li>Maintain system operational</li>
            <li>Deactivation prohibited</li>
            <li>Lender access to data (in case of default)</li>
          </ul>
        </SubSection>
      </Section>

      <Section title="5. Lender Rights" icon={<ShieldIcon />}>
        <SubSection title="5.1 Verification">
          <p><strong>Right to Inspection:</strong></p>
          <ul>
            <li>With 24 hours notice</li>
            <li>Maximum 2 times per year</li>
            <li>Verification of condition and mileage</li>
          </ul>
        </SubSection>

        <SubSection title="5.2 Repossession">
          <p><strong>Conditions:</strong></p>
          <ul>
            <li>Payment delay {'>'} 30 days</li>
            <li>Non-compliance with obligations</li>
            <li>Illegal use</li>
          </ul>
          <p><strong>Process:</strong></p>
          <ol>
            <li>Notification (8-15 days depending on jurisdiction)</li>
            <li>Repossession (with or without court order depending on jurisdiction)</li>
            <li>Vehicle storage</li>
            <li>Sale or retention</li>
          </ol>
        </SubSection>
      </Section>

      <Section title="6. Default and Recovery Process" icon={<ShieldIcon />}>
        <SubSection title="6.1 Trigger">
          <p><strong>Automatic Default:</strong></p>
          <ul>
            <li>Payment delay {'>'} 30 days</li>
            <li>Non-payment of 2 installments</li>
          </ul>
          <p><strong>Contractual Default:</strong></p>
          <ul>
            <li>Non-compliance with obligations</li>
            <li>Illegal use</li>
            <li>Significant deterioration</li>
          </ul>
        </SubSection>

        <SubSection title="6.2 Notification">
          <p><strong>Content:</strong></p>
          <ul>
            <li>Amount due</li>
            <li>Regularization period (8-15 days)</li>
            <li>Consequences</li>
          </ul>
          <p><strong>Modes:</strong></p>
          <ul>
            <li>On-chain notification</li>
            <li>Registered letter</li>
            <li>Email/SMS</li>
          </ul>
        </SubSection>

        <SubSection title="6.3 Repossession Process by Jurisdiction">
          <div className="jurisdiction-box">
            <h4>Qatar</h4>
            <ol>
              <li>Notification: 8 days</li>
              <li>Repossession: With court order (if necessary)</li>
              <li>Storage: 15 days minimum</li>
              <li>Sale: Auction (15 days after seizure)</li>
            </ol>
            <p><strong>Total Timeline:</strong> 15-30 days</p>
          </div>

          <div className="jurisdiction-box">
            <h4>France</h4>
            <ol>
              <li>Notification: 8 days</li>
              <li>Repossession: Possible without order if provided</li>
              <li>Storage: 30 days minimum</li>
              <li>Sale: Auction (30 days after seizure)</li>
            </ol>
            <p><strong>Total Timeline:</strong> 20-45 days</p>
          </div>

          <div className="jurisdiction-box">
            <h4>United States</h4>
            <ol>
              <li>Notification: 10 days</li>
              <li>Repossession: Possible without order if provided (by state)</li>
              <li>Storage: 10 days minimum</li>
              <li>Sale: Public sale (10 days after notification)</li>
            </ol>
            <p><strong>Total Timeline:</strong> 20-40 days</p>
          </div>
        </SubSection>

        <SubSection title="6.4 Physical Recovery">
          <p><strong>Methods:</strong></p>
          <ol>
            <li><strong>Voluntary Repossession:</strong> Key handover by borrower, minimal costs</li>
            <li><strong>On-Site Seizure:</strong> Agent intervention, GPS location (if installed), towing if necessary</li>
            <li><strong>Court Order:</strong> If voluntary repossession refused, law enforcement intervention</li>
          </ol>
          <p><strong>Costs:</strong></p>
          <ul>
            <li>Seizure fees: $200-$800</li>
            <li>Towing fees: $100-$300</li>
            <li>Storage fees: $50-$200/day</li>
          </ul>
        </SubSection>
      </Section>

      <Section title="7. Vehicle Sale in Case of Default" icon={<MoneyIcon />}>
        <SubSection title="7.1 Sale Methods">
          <p><strong>Auction Sale:</strong></p>
          <ul>
            <li>Standard method</li>
            <li>Maximum transparency</li>
            <li>Timeline: 15-30 days after seizure</li>
          </ul>
          <p><strong>Private Sale:</strong></p>
          <ul>
            <li>If authorized</li>
            <li>Expert evaluation</li>
            <li>Timeline: 30-60 days</li>
          </ul>
        </SubSection>

        <SubSection title="7.2 Proceeds Distribution">
          <p><strong>Priority Order:</strong></p>
          <ol>
            <li>Procedure fees</li>
            <li>Interest and penalties</li>
            <li>Remaining capital</li>
            <li>Balance to borrower (if positive)</li>
          </ol>
        </SubSection>
      </Section>

      <Section title="8. Fees and Costs" icon={<MoneyIcon />}>
        <SubSection title="8.1 Loan Fees">
          <p><strong>Initial Fees:</strong></p>
          <ul>
            <li>Application fees: 0.5-1% (max $500)</li>
            <li>Valuation fees: $100-$300</li>
            <li>Registration fees: $50-$200</li>
            <li>GPS installation: $200-$500 (if required)</li>
          </ul>
          <p><strong>Recurring Fees:</strong></p>
          <ul>
            <li>Management fees: 0.1% per year</li>
            <li>Inspection fees: $100-$200/year</li>
          </ul>
        </SubSection>

        <SubSection title="8.2 Default Fees">
          <p><strong>Late Fees:</strong></p>
          <ul>
            <li>Late interest: 0.1% per day</li>
            <li>Reminder fees: $25-$100</li>
          </ul>
          <p><strong>Repossession Fees:</strong></p>
          <ul>
            <li>See section 6.3</li>
            <li>Seizure fees: $200-$800</li>
            <li>Towing fees: $100-$300</li>
            <li>Storage fees: $50-$200/day</li>
            <li>Auction fees: 5-10% of sale price</li>
          </ul>
        </SubSection>
      </Section>

      <Section title="9. Insurance" icon={<ShieldIcon />}>
        <SubSection title="9.1 Vehicle Insurance">
          <p><strong>Mandatory:</strong></p>
          <ul>
            <li>Liability insurance (all jurisdictions)</li>
            <li>Comprehensive insurance (recommended)</li>
            <li>Premium: $500-$3,000/year</li>
          </ul>
        </SubSection>

        <SubSection title="9.2 Loan Insurance">
          <p><strong>Optional:</strong></p>
          <ul>
            <li>Borrower default coverage</li>
            <li>Premium: 0.5% - 5% depending on Credit Score</li>
          </ul>
        </SubSection>
      </Section>

      <Section title="10. General Provisions" icon={<DocumentIcon />}>
        <SubSection title="10.1 Applicable Law">
          <p><strong>Jurisdiction:</strong></p>
          <ul>
            <li>According to vehicle location</li>
            <li>Arbitration clause possible</li>
          </ul>
        </SubSection>

        <SubSection title="10.2 Dispute Resolution">
          <p><strong>Mediation:</strong></p>
          <ul>
            <li>Mediation attempt (30 days)</li>
          </ul>
          <p><strong>Arbitration/Jurisdiction:</strong></p>
          <ul>
            <li>According to contract</li>
          </ul>
        </SubSection>
      </Section>

      <Section title="11. Acceptance" icon={<CheckIcon />}>
        <p>By accepting these terms, the borrower:</p>
        <ol>
          <li>Acknowledges having read and understood all terms</li>
          <li>Accepts loan conditions</li>
          <li>Accepts default and repossession processes</li>
          <li>Recognizes risks</li>
        </ol>
        <p><strong>Electronic Signature:</strong></p>
        <ul>
          <li>Acceptance via on-chain signature</li>
        </ul>
      </Section>
    </div>
  )
}

function ObjectsFullContent() {
  return (
    <div className="terms-full-content">
      <Section title="1. Definitions" icon={<DocumentIcon />}>
        <p><strong>Movable Asset/Object:</strong> Any movable asset (equipment, machine, collectible, precious metal) represented by an NFT RWA.</p>
        <p><strong>Title Deed:</strong> Purchase invoice, authenticity certificate, or equivalent document establishing ownership.</p>
        <p><strong>Seizure:</strong> Taking possession of the object in case of payment default.</p>
      </Section>

      <Section title="2. Title Acquisition Conditions" icon={<DocumentIcon />}>
        <SubSection title="2.1 Required Documents">
          <p><strong>Mandatory:</strong></p>
          <ul>
            <li>Purchase invoice or ownership document</li>
            <li>Authenticity certificate (if applicable)</li>
            <li>Detailed inventory with photos</li>
            <li>Debt/liens verification</li>
          </ul>
        </SubSection>

        <SubSection title="2.2 Verification Process">
          <p><strong>Timeline:</strong> 1-7 days</p>
        </SubSection>
      </Section>

      <Section title="3. Loan Conditions" icon={<MoneyIcon />}>
        <SubSection title="3.1 Amount and LTV">
          <p><strong>Maximum LTV:</strong></p>
          <ul>
            <li>Tier A: 50-60% LTV (for rapidly depreciating objects)</li>
            <li>Tier B: 40-50% LTV</li>
            <li>Tier C: 30-40% LTV</li>
            <li>Tier D: 20-30% LTV</li>
          </ul>
        </SubSection>

        <SubSection title="3.2 Interest Rates">
          <ul>
            <li>Tier A: 8-10% APY</li>
            <li>Tier B: 10-12% APY</li>
            <li>Tier C: 12-14% APY</li>
            <li>Tier D: 14-17% APY</li>
          </ul>
        </SubSection>
      </Section>

      <Section title="4. Asset-Specific Terms" icon={<PackageIcon />}>
        <SubSection title="4.1 Mining Equipment">
          <ul>
            <li>Rapid depreciation (20-30% per year)</li>
            <li>Intensive maintenance required</li>
            <li>GPS location recommended</li>
            <li>Maximum LTV: 40-50% even for Tier A</li>
            <li>Maximum Duration: 24 months (recommended)</li>
          </ul>
        </SubSection>

        <SubSection title="4.2 Industrial Machines">
          <ul>
            <li>Regular maintenance required</li>
            <li>Annual technical verification</li>
            <li>Standard LTV by Credit Score</li>
            <li>Maximum Duration: 36 months</li>
          </ul>
        </SubSection>

        <SubSection title="4.3 Collectibles">
          <ul>
            <li>Stable or growing value</li>
            <li>Authenticity certificate required</li>
            <li>Secure storage mandatory</li>
            <li>LTV can reach 60-70% for stable objects</li>
            <li>Maximum Duration: 48 months</li>
          </ul>
        </SubSection>

        <SubSection title="4.4 Precious Metals">
          <ul>
            <li>Market-linked value</li>
            <li>Storage in secure vault</li>
            <li>Purity/weight verification</li>
            <li>LTV: 50-70% depending on market stability</li>
            <li>Maximum Duration: 36 months</li>
          </ul>
        </SubSection>
      </Section>

      <Section title="4. Borrower Obligations" icon={<ShieldIcon />}>
        <SubSection title="4.1 Payments">
          <ul>
            <li>Fixed monthly payment</li>
            <li>Grace period: 5 days</li>
            <li>Late interest: 0.1% per day</li>
          </ul>
        </SubSection>

        <SubSection title="4.2 Usage">
          <p><strong>Rules:</strong></p>
          <ul>
            <li>Normal and legal use only</li>
            <li>Major modification prohibited without authorization</li>
            <li>Subletting prohibited without authorization</li>
          </ul>
          <p><strong>Maintenance:</strong></p>
          <ul>
            <li>Regular maintenance according to specifications</li>
            <li>Necessary repairs</li>
            <li>Compliance with usage conditions</li>
          </ul>
        </SubSection>

        <SubSection title="4.3 Storage">
          <p><strong>Obligations:</strong></p>
          <ul>
            <li>Storage in a secure location</li>
            <li>Protection against theft, damage, deterioration</li>
            <li>Notification of location change</li>
          </ul>
          <p><strong>Verifications:</strong></p>
          <ul>
            <li>Semi-annual inspection (at borrower's expense)</li>
            <li>Maintenance report</li>
          </ul>
        </SubSection>
      </Section>

      <Section title="5. Lender Rights" icon={<ShieldIcon />}>
        <SubSection title="5.1 Verification">
          <p><strong>Right to Inspection:</strong></p>
          <ul>
            <li>With 24 hours notice</li>
            <li>Maximum 2 times per year</li>
            <li>Verification of condition and location</li>
          </ul>
        </SubSection>

        <SubSection title="5.2 Seizure">
          <p><strong>Conditions:</strong></p>
          <ul>
            <li>Payment delay {'>'} 30 days</li>
            <li>Non-compliance with obligations</li>
            <li>Significant deterioration</li>
          </ul>
          <p><strong>Process:</strong></p>
          <ol>
            <li>Notification (5-10 days depending on jurisdiction)</li>
            <li>Object seizure</li>
            <li>Storage</li>
            <li>Sale or retention</li>
          </ol>
        </SubSection>
      </Section>

      <Section title="6. Default and Recovery Process" icon={<ShieldIcon />}>
        <SubSection title="6.1 Trigger">
          <p><strong>Automatic Default:</strong></p>
          <ul>
            <li>Payment delay {'>'} 30 days</li>
            <li>Non-payment of 2 installments</li>
          </ul>
          <p><strong>Contractual Default:</strong></p>
          <ul>
            <li>Non-compliance with obligations</li>
            <li>Significant deterioration</li>
            <li>Illegal use</li>
          </ul>
        </SubSection>

        <SubSection title="6.2 Notification">
          <p><strong>Content:</strong></p>
          <ul>
            <li>Amount due</li>
            <li>Regularization period (5-10 days)</li>
            <li>Consequences</li>
          </ul>
          <p><strong>Modes:</strong></p>
          <ul>
            <li>On-chain notification</li>
            <li>Registered letter</li>
            <li>Email/SMS</li>
          </ul>
        </SubSection>

        <SubSection title="6.3 Seizure Process">
          <p><strong>Standard Process:</strong></p>
          <ol>
            <li><strong>Notification:</strong> 5-10 days before seizure</li>
            <li><strong>Seizure:</strong> Voluntary handover (preferred) or forced seizure with order if necessary, GPS location (if installed)</li>
            <li><strong>Storage:</strong> Secure storage, complete inventory, protection against deterioration</li>
            <li><strong>Sale:</strong> Auction (15-30 days) or private sale (if authorized) or retention (if authorized)</li>
          </ol>
          <p><strong>Total Timeline:</strong> 20-40 days</p>
          <p><strong>Costs:</strong></p>
          <ul>
            <li>Seizure fees: $100-$500</li>
            <li>Transport fees: Variable</li>
            <li>Storage fees: $20-$100/day</li>
          </ul>
        </SubSection>
      </Section>

      <Section title="7. Object Sale in Case of Default" icon={<MoneyIcon />}>
        <SubSection title="7.1 Sale Methods">
          <p><strong>Auction Sale:</strong></p>
          <ul>
            <li>Standard method</li>
            <li>Maximum transparency</li>
            <li>Timeline: 15-30 days after seizure</li>
          </ul>
          <p><strong>Private Sale:</strong></p>
          <ul>
            <li>If authorized</li>
            <li>Expert evaluation</li>
            <li>Timeline: 30-60 days</li>
          </ul>
          <p><strong>Direct Sale:</strong></p>
          <ul>
            <li>If authorized</li>
            <li>Evaluation at market value</li>
          </ul>
        </SubSection>

        <SubSection title="7.2 Proceeds Distribution">
          <p><strong>Priority Order:</strong></p>
          <ol>
            <li>Procedure fees</li>
            <li>Interest and penalties</li>
            <li>Remaining capital</li>
            <li>Balance to borrower (if positive)</li>
          </ol>
        </SubSection>

        <SubSection title="7.3 Deficit">
          <p>In case of deficit:</p>
          <ul>
            <li>The borrower remains liable</li>
            <li>Recovery according to legislation</li>
          </ul>
        </SubSection>
      </Section>

      <Section title="8. Fees and Costs" icon={<MoneyIcon />}>
        <SubSection title="8.1 Loan Fees">
          <p><strong>Initial Fees:</strong></p>
          <ul>
            <li>Application fees: 0.5-1% (max $300)</li>
            <li>Valuation fees: $50-$200</li>
            <li>Registration fees: $25-$100</li>
            <li>Expertise fees: $100-$500</li>
          </ul>
          <p><strong>Recurring Fees:</strong></p>
          <ul>
            <li>Management fees: 0.1% per year</li>
            <li>Inspection fees: $50-$150/year</li>
          </ul>
        </SubSection>

        <SubSection title="8.2 Default Fees">
          <p><strong>Late Fees:</strong></p>
          <ul>
            <li>Late interest: 0.1% per day</li>
            <li>Reminder fees: $25-$100</li>
          </ul>
          <p><strong>Seizure Fees:</strong></p>
          <ul>
            <li>See section 6.3</li>
            <li>Seizure fees: $100-$500</li>
            <li>Transport fees: Variable</li>
            <li>Storage fees: $20-$100/day</li>
          </ul>
        </SubSection>
      </Section>

      <Section title="9. Insurance" icon={<ShieldIcon />}>
        <SubSection title="9.1 Object Insurance">
          <p><strong>Mandatory for:</strong></p>
          <ul>
            <li>High-value objects ({'>'} $50,000)</li>
            <li>Fragile or high-risk objects</li>
          </ul>
          <p><strong>Optional for:</strong></p>
          <ul>
            <li>Moderate value objects</li>
            <li>Robust objects</li>
          </ul>
          <p><strong>Premium:</strong></p>
          <ul>
            <li>Variable according to type and value</li>
            <li>Range: 0.5% - 3% of value per year</li>
          </ul>
        </SubSection>

        <SubSection title="9.2 Loan Insurance">
          <p><strong>Optional:</strong></p>
          <ul>
            <li>Borrower default coverage</li>
            <li>Premium: 0.5% - 5% depending on Credit Score</li>
          </ul>
        </SubSection>
      </Section>

      <Section title="10. General Provisions" icon={<DocumentIcon />}>
        <SubSection title="10.1 Applicable Law">
          <p><strong>Jurisdiction:</strong></p>
          <ul>
            <li>According to object location</li>
            <li>Arbitration clause possible</li>
          </ul>
        </SubSection>

        <SubSection title="10.2 Dispute Resolution">
          <p><strong>Mediation:</strong></p>
          <ul>
            <li>Mediation attempt (30 days)</li>
          </ul>
          <p><strong>Arbitration/Jurisdiction:</strong></p>
          <ul>
            <li>According to contract</li>
          </ul>
        </SubSection>
      </Section>

      <Section title="11. Acceptance" icon={<CheckIcon />}>
        <p>By accepting these terms, the borrower:</p>
        <ol>
          <li>Acknowledges having read and understood all terms</li>
          <li>Accepts loan conditions</li>
          <li>Accepts default and seizure processes</li>
          <li>Recognizes risks</li>
        </ol>
        <p><strong>Electronic Signature:</strong></p>
        <ul>
          <li>Acceptance via on-chain signature</li>
        </ul>
      </Section>
    </div>
  )
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="terms-full-section">
      <div className="terms-full-section-header">
        <div className="terms-full-section-icon">{icon}</div>
        <h2>{title}</h2>
      </div>
      <div className="terms-full-section-content">
        {children}
      </div>
    </div>
  )
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="terms-full-subsection">
      <h3>{title}</h3>
      <div className="terms-full-subsection-content">
        {children}
      </div>
    </div>
  )
}

