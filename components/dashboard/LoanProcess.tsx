'use client'

import { useState, useEffect, useRef } from 'react'
import { formatNumber, formatAddress } from '@/lib/utils'
import { NFTRWA, LoanProfileOption } from '@/types'

interface LoanProcessProps {
  nft: NFTRWA
  profile: LoanProfileOption
  onComplete: () => void
}

type ProcessStep = 'DOWN_PAYMENT' | 'PURCHASE_NFT' | 'LOCK_NFT' | 'DISBURSEMENT' | 'COMPLETE'

interface TransactionDetails {
  fromWallet: string
  toWallet: string
  nftReference: string
  amount?: number
  currency?: string
}

interface ProcessStepState {
  step: ProcessStep
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED'
  txHash?: string
  error?: string
  progress?: number
  transactionDetails?: TransactionDetails
  blockNumber?: number
  confirmations?: number
  timestamp?: Date
}

export default function LoanProcess({ nft, profile, onComplete }: LoanProcessProps) {
  // Mock wallet addresses
  const userWallet = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb5'
  const blockbankWallet = '0x8ba1f109551bD432803012645Hac136c22C177'
  const marketplaceWallet = nft.ownerAddress || '0x1234567890123456789012345678901234567890'
  const smartContractWallet = '0xBlockBankSmartContract12345678901234567890'

  const getTransactionDetails = (step: ProcessStep): TransactionDetails => {
    switch (step) {
      case 'DOWN_PAYMENT':
        return {
          fromWallet: userWallet,
          toWallet: blockbankWallet,
          nftReference: `NFT #${nft.tokenId}`,
          amount: profile.downPayment,
          currency: nft.valueCurrency
        }
      case 'PURCHASE_NFT':
        return {
          fromWallet: blockbankWallet,
          toWallet: marketplaceWallet,
          nftReference: `NFT #${nft.tokenId} (${nft.contractAddress.slice(0, 10)}...)`,
          amount: nft.value,
          currency: nft.valueCurrency
        }
      case 'LOCK_NFT':
        return {
          fromWallet: marketplaceWallet,
          toWallet: smartContractWallet,
          nftReference: `NFT #${nft.tokenId} - ${nft.name}`,
        }
      case 'DISBURSEMENT':
        return {
          fromWallet: smartContractWallet,
          toWallet: userWallet,
          nftReference: `NFT #${nft.tokenId}`,
          amount: profile.loanAmount,
          currency: nft.valueCurrency
        }
      default:
        return {
          fromWallet: '',
          toWallet: '',
          nftReference: ''
        }
    }
  }

  const [steps, setSteps] = useState<ProcessStepState[]>([
    { 
      step: 'DOWN_PAYMENT', 
      status: 'PENDING',
      transactionDetails: getTransactionDetails('DOWN_PAYMENT')
    },
    { 
      step: 'PURCHASE_NFT', 
      status: 'PENDING',
      transactionDetails: getTransactionDetails('PURCHASE_NFT')
    },
    { 
      step: 'LOCK_NFT', 
      status: 'PENDING',
      transactionDetails: getTransactionDetails('LOCK_NFT')
    },
    { 
      step: 'DISBURSEMENT', 
      status: 'PENDING',
      transactionDetails: getTransactionDetails('DISBURSEMENT')
    },
  ])
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [showValidationPopup, setShowValidationPopup] = useState(false)
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])

  // Scroll automatique vers la boîte active au centre de l'écran
  useEffect(() => {
    if (stepRefs.current[currentStepIndex]) {
      // Petit délai pour s'assurer que le DOM est mis à jour
      setTimeout(() => {
        stepRefs.current[currentStepIndex]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        })
      }, 100)
    }
  }, [currentStepIndex])

  // Scroll quand une transaction est validée pour montrer les détails
  useEffect(() => {
    const justCompletedStep = steps.findIndex((s, idx) => 
      s.status === 'COMPLETED' && 
      s.txHash && 
      idx === currentStepIndex
    )
    
    if (justCompletedStep !== -1 && stepRefs.current[justCompletedStep]) {
      // Scroll avec un délai pour laisser le temps aux détails de validation de s'afficher
      setTimeout(() => {
        stepRefs.current[justCompletedStep]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        })
      }, 500)
    }
  }, [steps, currentStepIndex])

  useEffect(() => {
    processSteps()
  }, [])

  const processSteps = async () => {
    for (let i = 0; i < steps.length; i++) {
      setCurrentStepIndex(i)
      
      // Marquer l'étape en cours avec progression initiale
      setSteps(prev => prev.map((step, idx) => 
        idx === i ? { ...step, status: 'IN_PROGRESS', progress: 0 } : step
      ))

      // Simuler la progression lente avec étapes visuelles
      const progressSteps = [10, 25, 40, 55, 70, 85, 95, 100]
      for (const progressValue of progressSteps) {
        await new Promise(resolve => setTimeout(resolve, 800)) // Plus lent : 800ms par étape
        
        setSteps(prev => prev.map((step, idx) => 
          idx === i ? { ...step, progress: progressValue } : step
        ))
      }

      // Simuler une transaction avec détails
      const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`
      const mockBlockNumber = Math.floor(Math.random() * 18000000) + 15000000
      const mockConfirmations = 12

      // Marquer l'étape comme complétée avec tous les détails
      setSteps(prev => prev.map((step, idx) => 
        idx === i ? { 
          ...step, 
          status: 'COMPLETED', 
          txHash: mockTxHash,
          progress: 100,
          blockNumber: mockBlockNumber,
          confirmations: mockConfirmations,
          timestamp: new Date()
        } : step
      ))

      // Attendre un peu avant la prochaine étape
      await new Promise(resolve => setTimeout(resolve, 1500))
    }

    // Toutes les transactions sont complétées - afficher le pop-up de validation
    setShowValidationPopup(true)
  }

  const handleValidateTransactions = () => {
    setShowValidationPopup(false)
    // Petit délai avant de compléter le processus
    setTimeout(() => {
      onComplete()
    }, 300)
  }

  const getStepLabel = (step: ProcessStep): string => {
    const labels: Record<ProcessStep, string> = {
      DOWN_PAYMENT: 'Paiement Apport',
      PURCHASE_NFT: 'Achat NFT',
      LOCK_NFT: 'Verrouillage NFT',
      DISBURSEMENT: 'Déblocage Prêt',
      COMPLETE: 'Terminé',
    }
    return labels[step]
  }

  const getStepDescription = (step: ProcessStep): string => {
    const descriptions: Record<ProcessStep, string> = {
      DOWN_PAYMENT: 'Votre apport a été reçu et confirmé',
      PURCHASE_NFT: 'Le NFT RWA est en cours d\'achat',
      LOCK_NFT: 'Le NFT est verrouillé dans le smart contract BlockBank',
      DISBURSEMENT: 'Les stablecoins sont débloqués vers votre wallet',
      COMPLETE: 'Votre prêt est actif',
    }
    return descriptions[step]
  }

  return (
    <div className="loan-process-page">
      <div className="page-header">
        <div>
          <h1>Finalisation</h1>
          <p className="page-subtitle">Suivi en cours</p>
        </div>
      </div>

      {/* Progress Steps - Boîtes pleine largeur */}
      <div className="process-steps-full-width">
        {steps.map((stepState, index) => (
          <div 
            key={stepState.step}
            ref={(el) => {
              stepRefs.current[index] = el
            }}
            className={`process-step-box-full ${stepState.status} ${index === currentStepIndex ? 'current' : ''}`}
          >
            <div className="process-step-box-header">
              <div className="step-indicator-full">
                <div className={`step-circle-full ${stepState.status}`}>
                  {stepState.status === 'COMPLETED' && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" fill="var(--color-primary-500)" />
                      <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  {stepState.status === 'IN_PROGRESS' && (
                    <div className="spinner-full"></div>
                  )}
                  {stepState.status === 'PENDING' && (
                    <span className="step-number-full">{index + 1}</span>
                  )}
                </div>
              </div>
              <div className="step-header-content">
                <h3 className="step-title-full">{getStepLabel(stepState.step)}</h3>
                <p className="step-description-full">{getStepDescription(stepState.step)}</p>
              </div>
            </div>

            {/* Jauge de progression visuelle et lente */}
            {stepState.status === 'IN_PROGRESS' && (
              <div className="step-progress-container-full">
                <div className="progress-bar-full">
                  <div 
                    className="progress-fill-full"
                    style={{ width: `${stepState.progress || 0}%` }}
                  >
                    <div className="progress-glow"></div>
                  </div>
                </div>
                <div className="progress-percentage-full">
                  <span>{stepState.progress || 0}%</span>
                </div>
              </div>
            )}

            {/* Détails de transaction - Wallet from/to et référence NFT */}
            {stepState.status === 'IN_PROGRESS' || stepState.status === 'COMPLETED' ? (
              <div className="transaction-details-full">
                <div className="transaction-details-grid">
                  <div className="transaction-detail-item">
                    <span className="transaction-detail-label">De (Wallet):</span>
                    <span className="transaction-detail-value wallet-address">
                      {formatAddress(stepState.transactionDetails?.fromWallet || '')}
                    </span>
                  </div>
                  <div className="transaction-detail-item">
                    <span className="transaction-detail-label">Vers (Wallet):</span>
                    <span className="transaction-detail-value wallet-address">
                      {formatAddress(stepState.transactionDetails?.toWallet || '')}
                    </span>
                  </div>
                  <div className="transaction-detail-item full-width">
                    <span className="transaction-detail-label">Référence NFT:</span>
                    <span className="transaction-detail-value nft-reference">
                      {stepState.transactionDetails?.nftReference || ''}
                    </span>
                  </div>
                  {stepState.transactionDetails?.amount && (
                    <div className="transaction-detail-item">
                      <span className="transaction-detail-label">Montant:</span>
                      <span className="transaction-detail-value amount">
                        {formatNumber(stepState.transactionDetails.amount)} {stepState.transactionDetails.currency}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            {/* Détails après validation */}
            {stepState.status === 'COMPLETED' && stepState.txHash && (
              <div className="transaction-confirmed-details">
                <div className="confirmed-badge">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="var(--color-success-500)" />
                    <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Transaction validée</span>
                </div>
                <div className="transaction-confirmed-grid">
                  <div className="confirmed-detail-item">
                    <span className="confirmed-label">Hash de transaction:</span>
                    <a 
                      href={`https://etherscan.io/tx/${stepState.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tx-link-full"
                    >
                      {stepState.txHash.slice(0, 16)}...{stepState.txHash.slice(-12)}
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="external-link-icon">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke="currentColor" strokeWidth="2"/>
                        <path d="M15 3h6v6" stroke="currentColor" strokeWidth="2"/>
                        <path d="M10 14L21 3" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    </a>
                  </div>
                  {stepState.blockNumber && (
                    <div className="confirmed-detail-item">
                      <span className="confirmed-label">Block:</span>
                      <span className="confirmed-value">#{stepState.blockNumber.toLocaleString()}</span>
                    </div>
                  )}
                  {stepState.confirmations !== undefined && (
                    <div className="confirmed-detail-item">
                      <span className="confirmed-label">Confirmations:</span>
                      <span className="confirmed-value">{stepState.confirmations}/12</span>
                    </div>
                  )}
                  {stepState.timestamp && (
                    <div className="confirmed-detail-item">
                      <span className="confirmed-label">Horodatage:</span>
                      <span className="confirmed-value">
                        {stepState.timestamp.toLocaleTimeString('fr-FR', { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          second: '2-digit'
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Détails Prêt */}
      <div className="process-summary">
        <div className="summary-card">
          <h3>Résumé</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">NFT</span>
              <span className="summary-value">{nft.name}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Valeur NFT</span>
              <span className="summary-value">{formatNumber(nft.value)} {nft.valueCurrency}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Apport</span>
              <span className="summary-value">{formatNumber(profile.downPayment)} {nft.valueCurrency}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Montant prêt</span>
              <span className="summary-value">{formatNumber(profile.loanAmount)} {nft.valueCurrency}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Mensualité</span>
              <span className="summary-value">{formatNumber(profile.monthlyPayment)} {nft.valueCurrency}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Message État */}
      <div className="process-message">
        {steps[currentStepIndex]?.status === 'IN_PROGRESS' && (
          <div className="message-box info">
            <h4>En cours...</h4>
            <p>{getStepDescription(steps[currentStepIndex].step)}</p>
            <p className="message-note">Veuillez ne pas fermer cette page</p>
          </div>
        )}
        {steps.every(s => s.status === 'COMPLETED') && !showValidationPopup && (
          <div className="message-box success">
            <h4>✓ Prêt activé</h4>
            <p>Votre prêt est actif. Les fonds ont été débloqués.</p>
            <p className="message-note">Redirection en cours...</p>
          </div>
        )}
      </div>

      {/* Pop-up de validation en bas de l'écran */}
      {showValidationPopup && (
        <div className="validation-popup-bottom">
          <div className="validation-popup-content">
            <div className="validation-popup-header">
              <div className="validation-popup-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="var(--color-success-500)" />
                  <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="validation-popup-text">
                <h3 className="validation-popup-title">Toutes les transactions sont validées !</h3>
                <p className="validation-popup-thanks">
                  Merci d'avoir choisi BlockBank pour votre prêt NFT RWA.
                </p>
                <p className="validation-popup-thanks">
                  Votre prêt a été activé avec succès. Nous vous remercions pour votre confiance.
                </p>
              </div>
            </div>
            <button 
              className="btn-validate-transactions"
              onClick={handleValidateTransactions}
            >
              Validate Transactions
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
