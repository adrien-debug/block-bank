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
      {/* Progress Bar - seulement affiché si pas sur marketplace */}
      {step !== 'marketplace' && (
        <div className="explore-progress-container">
          <div className="explore-progress-bar">
            <div className="progress-steps">
              <div className="progress-step completed">
                <div className="step-number">1</div>
                <div className="step-label">Sélection NFT</div>
              </div>
              <div className={`progress-connector ${['profiles', 'validation', 'process'].includes(step || '') ? 'completed' : ''}`}></div>
              
              <div className={`progress-step ${step === 'conditions' ? 'active' : ['profiles', 'validation', 'process'].includes(step || '') ? 'completed' : ''}`}>
                <div className="step-number">2</div>
                <div className="step-label">Conditions</div>
              </div>
              <div className={`progress-connector ${['validation', 'process'].includes(step || '') ? 'completed' : ''}`}></div>
              
              <div className={`progress-step ${step === 'profiles' ? 'active' : ['validation', 'process'].includes(step || '') ? 'completed' : ''}`}>
                <div className="step-number">3</div>
                <div className="step-label">Profils</div>
              </div>
              <div className={`progress-connector ${step === 'process' ? 'completed' : ''}`}></div>
              
              <div className={`progress-step ${step === 'validation' ? 'active' : step === 'process' ? 'completed' : ''}`}>
                <div className="step-number">4</div>
                <div className="step-label">Validation</div>
              </div>
              <div className={`progress-connector ${step === 'process' ? 'completed' : ''}`}></div>
              
              <div className={`progress-step ${step === 'process' ? 'active' : ''}`}>
                <div className="step-number">5</div>
                <div className="step-label">Traitement</div>
              </div>
            </div>
            
            {/* Progress Percentage */}
            <div className="progress-percentage">
              {step === 'conditions' && <span>20%</span>}
              {step === 'profiles' && <span>40%</span>}
              {step === 'validation' && <span>60%</span>}
              {step === 'process' && <span>80%</span>}
            </div>
          </div>
        </div>
      )}

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

