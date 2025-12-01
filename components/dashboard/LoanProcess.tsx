'use client'

import { useState, useEffect } from 'react'
import { NFTRWA, LoanProfileOption } from '@/types'

interface LoanProcessProps {
  nft: NFTRWA
  profile: LoanProfileOption
  onComplete: () => void
}

type ProcessStep = 'DOWN_PAYMENT' | 'PURCHASE_NFT' | 'LOCK_NFT' | 'DISBURSEMENT' | 'COMPLETE'

interface ProcessStepState {
  step: ProcessStep
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED'
  txHash?: string
  error?: string
}

export default function LoanProcess({ nft, profile, onComplete }: LoanProcessProps) {
  const [steps, setSteps] = useState<ProcessStepState[]>([
    { step: 'DOWN_PAYMENT', status: 'PENDING' },
    { step: 'PURCHASE_NFT', status: 'PENDING' },
    { step: 'LOCK_NFT', status: 'PENDING' },
    { step: 'DISBURSEMENT', status: 'PENDING' },
  ])
  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  useEffect(() => {
    processSteps()
  }, [])

  const processSteps = async () => {
    for (let i = 0; i < steps.length; i++) {
      setCurrentStepIndex(i)
      
      // Marquer l'étape en cours
      setSteps(prev => prev.map((step, idx) => 
        idx === i ? { ...step, status: 'IN_PROGRESS' } : step
      ))

      // Simuler le processus
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Simuler une transaction
      const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`

      // Marquer l'étape comme complétée
      setSteps(prev => prev.map((step, idx) => 
        idx === i ? { ...step, status: 'COMPLETED', txHash: mockTxHash } : step
      ))

      // Attendre un peu avant la prochaine étape
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    // Processus terminé
    setTimeout(() => {
      onComplete()
    }, 2000)
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="loan-process-page">
      <div className="page-header">
        <div>
          <h1>Finalisation de votre prêt</h1>
          <p className="page-subtitle">Suivi en temps réel du processus</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="process-steps">
        {steps.map((stepState, index) => (
          <div key={stepState.step} className={`process-step ${stepState.status} ${index === currentStepIndex ? 'current' : ''}`}>
            <div className="step-indicator">
              <div className={`step-circle ${stepState.status}`}>
                {stepState.status === 'COMPLETED' && '✓'}
                {stepState.status === 'IN_PROGRESS' && (
                  <div className="spinner"></div>
                )}
                {stepState.status === 'PENDING' && index + 1}
              </div>
              {index < steps.length - 1 && (
                <div className={`step-line ${stepState.status === 'COMPLETED' ? 'completed' : ''}`} />
              )}
            </div>
            <div className="step-content">
              <h3>{getStepLabel(stepState.step)}</h3>
              <p>{getStepDescription(stepState.step)}</p>
              {stepState.txHash && (
                <div className="step-tx">
                  <span className="tx-label">Transaction:</span>
                  <a 
                    href={`https://etherscan.io/tx/${stepState.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tx-link"
                  >
                    {stepState.txHash.slice(0, 10)}...{stepState.txHash.slice(-8)}
                  </a>
                </div>
              )}
              {stepState.status === 'IN_PROGRESS' && (
                <div className="step-progress">
                  <div className="progress-bar">
                    <div className="progress-fill"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Détails Prêt */}
      <div className="process-summary">
        <div className="summary-card">
          <h3>Résumé du prêt</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">NFT</span>
              <span className="summary-value">{nft.name}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Valeur NFT</span>
              <span className="summary-value">{formatCurrency(nft.value)} {nft.valueCurrency}</span>
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
              <span className="summary-label">Mensualité</span>
              <span className="summary-value">{formatCurrency(profile.monthlyPayment)} {nft.valueCurrency}</span>
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
        {steps.every(s => s.status === 'COMPLETED') && (
          <div className="message-box success">
            <h4>✓ Prêt activé avec succès !</h4>
            <p>Votre prêt est maintenant actif. Les stablecoins ont été débloqués vers votre wallet.</p>
            <p className="message-note">Redirection vers votre dashboard...</p>
          </div>
        )}
      </div>
    </div>
  )
}

