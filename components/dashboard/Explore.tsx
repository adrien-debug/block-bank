'use client'

import { useState } from 'react'
import MarketplaceNFT from './MarketplaceNFT'
import LoanConditions from './LoanConditions'
import LoanProfiles from './LoanProfiles'
import LoanValidation from './LoanValidation'
import LoanProcess from './LoanProcess'
import { NFTRWA, LoanConditions as LoanConditionsType, LoanProfileOption } from '@/types'
import { calculateCreditTier } from '@/lib/services/riskEngine'

type ExploreStep = 'marketplace' | 'conditions' | 'profiles' | 'validation' | 'process' | null

export default function Explore() {
  const [step, setStep] = useState<ExploreStep>('marketplace')
  const [selectedNFT, setSelectedNFT] = useState<NFTRWA | null>(null)
  const [loanConditions, setLoanConditions] = useState<LoanConditionsType | null>(null)
  const [selectedProfile, setSelectedProfile] = useState<LoanProfileOption | null>(null)
  
  // User data (mock - en production depuis API/context)
  const creditScore = 750
  const creditTier = calculateCreditTier(creditScore)
  const walletBalance = 200000 // Mock balance

  const handleNFTSelected = (nft: NFTRWA) => {
    setSelectedNFT(nft)
    setStep('conditions')
  }

  const handleConditionsReady = (conditions: LoanConditionsType) => {
    setLoanConditions(conditions)
    setStep('profiles')
  }

  const handleProfileSelected = (profile: LoanProfileOption) => {
    setSelectedProfile(profile)
    setStep('validation')
  }

  const handleValidationConfirm = () => {
    setStep('process')
  }

  const handleValidationBack = () => {
    setStep('profiles')
  }

  const handleProcessComplete = () => {
    // Reset flow
    setStep('marketplace')
    setSelectedNFT(null)
    setLoanConditions(null)
    setSelectedProfile(null)
  }

  const handleBackToMarketplace = () => {
    setStep('marketplace')
    setSelectedNFT(null)
    setLoanConditions(null)
    setSelectedProfile(null)
  }

  return (
    <div className="explore-page">
      {/* Header avec breadcrumb */}
      <div className="explore-header">
        <div className="explore-breadcrumb">
          {step === 'marketplace' && <span className="breadcrumb-active">1. Sélection NFT</span>}
          {step !== 'marketplace' && (
            <button className="breadcrumb-link" onClick={handleBackToMarketplace}>
              1. Sélection NFT
            </button>
          )}
          
          {step === 'conditions' && <span className="breadcrumb-separator">→</span>}
          {step === 'conditions' && <span className="breadcrumb-active">2. Conditions</span>}
          {step === 'profiles' && <span className="breadcrumb-separator">→</span>}
          {step === 'profiles' && <span className="breadcrumb-active">2. Conditions</span>}
          {step === 'validation' && <span className="breadcrumb-separator">→</span>}
          {step === 'validation' && <span className="breadcrumb-completed">2. Conditions</span>}
          {step === 'process' && <span className="breadcrumb-separator">→</span>}
          {step === 'process' && <span className="breadcrumb-completed">2. Conditions</span>}
          
          {step === 'profiles' && <span className="breadcrumb-separator">→</span>}
          {step === 'profiles' && <span className="breadcrumb-active">3. Profils</span>}
          {step === 'validation' && <span className="breadcrumb-separator">→</span>}
          {step === 'validation' && <span className="breadcrumb-completed">3. Profils</span>}
          {step === 'process' && <span className="breadcrumb-separator">→</span>}
          {step === 'process' && <span className="breadcrumb-completed">3. Profils</span>}
          
          {step === 'validation' && <span className="breadcrumb-separator">→</span>}
          {step === 'validation' && <span className="breadcrumb-active">4. Validation</span>}
          {step === 'process' && <span className="breadcrumb-separator">→</span>}
          {step === 'process' && <span className="breadcrumb-completed">4. Validation</span>}
          
          {step === 'process' && <span className="breadcrumb-separator">→</span>}
          {step === 'process' && <span className="breadcrumb-active">5. Processus</span>}
        </div>
      </div>

      {/* Contenu selon l'étape */}
      {step === 'marketplace' && (
        <MarketplaceNFT onSelectNFT={handleNFTSelected} />
      )}

      {step === 'conditions' && selectedNFT && (
        <LoanConditions
          nft={selectedNFT}
          creditScore={creditScore}
          creditTier={creditTier}
          onConditionsReady={handleConditionsReady}
        />
      )}

      {step === 'profiles' && selectedNFT && loanConditions && (
        <LoanProfiles
          nft={selectedNFT}
          conditions={loanConditions}
          creditTier={creditTier}
          onSelectProfile={handleProfileSelected}
        />
      )}

      {step === 'validation' && selectedNFT && selectedProfile && (
        <LoanValidation
          nft={selectedNFT}
          profile={selectedProfile}
          creditScore={creditScore}
          creditTier={creditTier}
          walletBalance={walletBalance}
          onConfirm={handleValidationConfirm}
          onBack={handleValidationBack}
        />
      )}

      {step === 'process' && selectedNFT && selectedProfile && (
        <LoanProcess
          nft={selectedNFT}
          profile={selectedProfile}
          onComplete={handleProcessComplete}
        />
      )}
    </div>
  )
}

