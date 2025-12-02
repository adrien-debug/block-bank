'use client'

import { useState, useEffect } from 'react'
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
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Scroll vers le haut quand on arrive à l'étape profiles (étape 3) ou validation (étape 4)
  useEffect(() => {
    if (step === 'profiles') {
      // Scroll immédiat vers le haut
      window.scrollTo({ top: 0, behavior: 'auto' })
      // Scroll smooth après un court délai pour s'assurer que le contenu est rendu
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 200)
    }
    if (step === 'validation') {
      // Scroll immédiat vers le haut
      window.scrollTo({ top: 0, behavior: 'auto' })
      // Scroll smooth après un court délai pour s'assurer que le contenu est rendu
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 200)
    }
  }, [step])
  
  // User data (mock - en production depuis API/context)
  const creditScore = 750
  const creditTier = calculateCreditTier(creditScore)
  const walletBalance = 200000 // Mock balance

  const transitionToStep = (newStep: ExploreStep, delay: number = 300) => {
    setIsTransitioning(true)
    setTimeout(() => {
      setIsTransitioning(false)
    }, delay)
  }

  const handleNFTSelected = (nft: NFTRWA) => {
    transitionToStep('conditions')
    setTimeout(() => {
      setSelectedNFT(nft)
      setStep('conditions')
    }, 150)
  }

  const handleConditionsReady = (conditions: LoanConditionsType) => {
    // Scroll immédiat vers le haut avant la transition
    window.scrollTo({ top: 0, behavior: 'auto' })
    transitionToStep('profiles')
    setTimeout(() => {
      setLoanConditions(conditions)
      setStep('profiles')
      // Scroll vers le haut après le changement d'étape
      window.scrollTo({ top: 0, behavior: 'auto' })
      // Scroll smooth après un court délai pour s'assurer
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 50)
    }, 150)
  }

  const handleConditionsBack = () => {
    transitionToStep('marketplace')
    setTimeout(() => {
      setStep('marketplace')
      setSelectedNFT(null)
    }, 150)
  }

  const handleProfileSelected = (profile: LoanProfileOption) => {
    setSelectedProfile(profile)
  }

  const handleProfileContinue = () => {
    if (selectedProfile) {
      // Scroll immédiat vers le haut avant la transition
      window.scrollTo({ top: 0, behavior: 'auto' })
      transitionToStep('validation')
      setTimeout(() => {
        setStep('validation')
        // Scroll vers le haut après le changement d'étape
        window.scrollTo({ top: 0, behavior: 'auto' })
        // Scroll smooth après un court délai pour s'assurer
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }, 50)
      }, 150)
    }
  }

  const handleProfileBack = () => {
    transitionToStep('conditions')
    setTimeout(() => {
      setStep('conditions')
      setSelectedProfile(null)
    }, 150)
  }

  const handleValidationConfirm = () => {
    transitionToStep('process')
    setTimeout(() => {
      setStep('process')
    }, 150)
  }

  const handleValidationBack = () => {
    transitionToStep('profiles')
    setTimeout(() => {
      setStep('profiles')
    }, 150)
  }

  const handleProcessComplete = () => {
    // Reset flow
    transitionToStep('marketplace')
    setTimeout(() => {
      setStep('marketplace')
      setSelectedNFT(null)
      setLoanConditions(null)
      setSelectedProfile(null)
    }, 150)
  }

  const handleBackToMarketplace = () => {
    transitionToStep('marketplace')
    setTimeout(() => {
      setStep('marketplace')
      setSelectedNFT(null)
      setLoanConditions(null)
      setSelectedProfile(null)
    }, 150)
  }

  return (
    <div className={`page-container explore-page-with-transitions ${isTransitioning ? 'transitioning' : ''}`}>
      <div className="explore-content-wrapper">
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

      {/* Contenu selon l'étape avec transitions */}
      <div className={`explore-step-content ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
        {step === 'marketplace' && (
          <div className="explore-step-wrapper">
            <MarketplaceNFT onSelectNFT={handleNFTSelected} />
          </div>
        )}

        {step === 'conditions' && selectedNFT && (
          <div className="explore-step-wrapper">
            <LoanConditions
              nft={selectedNFT}
              creditScore={creditScore}
              creditTier={creditTier}
              onConditionsReady={handleConditionsReady}
              onBack={handleConditionsBack}
            />
          </div>
        )}

        {step === 'profiles' && selectedNFT && loanConditions && (
          <div className="explore-step-wrapper">
            <LoanProfiles
              nft={selectedNFT}
              conditions={loanConditions}
              creditTier={creditTier}
              onSelectProfile={handleProfileSelected}
              onContinue={handleProfileContinue}
              onBack={handleProfileBack}
            />
          </div>
        )}

        {step === 'validation' && selectedNFT && selectedProfile && (
          <div className="explore-step-wrapper">
            <LoanValidation
              nft={selectedNFT}
              profile={selectedProfile}
              creditScore={creditScore}
              creditTier={creditTier}
              walletBalance={walletBalance}
              onConfirm={handleValidationConfirm}
              onBack={handleValidationBack}
            />
          </div>
        )}

        {step === 'process' && selectedNFT && selectedProfile && (
          <div className="explore-step-wrapper">
            <LoanProcess
              nft={selectedNFT}
              profile={selectedProfile}
              onComplete={handleProcessComplete}
            />
          </div>
        )}
      </div>
      </div>
    </div>
  )
}

