'use client'

import { useState } from 'react'

interface LoansProps {
  onNewLoan?: () => void
}

export default function Loans({ onNewLoan }: LoansProps) {
  const [showNewLoan, setShowNewLoan] = useState(false)

  const activeLoans = [
    {
      id: 1,
      amount: '100,000',
      currency: 'USDC',
      asset: 'Villa Paris - NFT #1234',
      ltv: '65%',
      rate: '8.5%',
      term: '36 mois',
      status: 'active',
      nextPayment: '15,000 USDC',
      dueDate: '2024-02-15',
    },
    {
      id: 2,
      amount: '50,000',
      currency: 'USDC',
      asset: 'Mining Farm - NFT #5678',
      ltv: '55%',
      rate: '9.2%',
      term: '24 mois',
      status: 'active',
      nextPayment: '7,500 USDC',
      dueDate: '2024-02-20',
    },
  ]

  return (
    <div className="loans-page">
      <div className="page-header">
        <h1>Mes Prêts</h1>
        <button 
          onClick={() => {
            if (onNewLoan) {
              onNewLoan()
            } else {
              setShowNewLoan(true)
            }
          }} 
          className="btn-primary"
        >
          + Nouveau prêt
        </button>
      </div>

      {showNewLoan && (
        <div className="new-loan-modal">
          <div className="modal-content">
            <h2>Demander un nouveau prêt</h2>
            <form className="loan-form">
              <div className="form-group">
                <label>Montant demandé</label>
                <input type="number" placeholder="100,000" />
                <select>
                  <option>USDC</option>
                  <option>USDT</option>
                  <option>DAI</option>
                </select>
              </div>
              <div className="form-group">
                <label>Actif à nantir (NFT RWA)</label>
                <select>
                  <option>Sélectionner un NFT RWA</option>
                  <option>Villa Paris - NFT #1234</option>
                  <option>Mining Farm - NFT #5678</option>
                </select>
              </div>
              <div className="form-group">
                <label>Durée</label>
                <select>
                  <option>12 mois</option>
                  <option>24 mois</option>
                  <option>36 mois</option>
                  <option>48 mois</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowNewLoan(false)} className="btn-secondary">
                  Annuler
                </button>
                <button type="submit" className="btn-primary">
                  Soumettre la demande
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="loans-list">
        {activeLoans.map((loan) => (
          <div key={loan.id} className="loan-card">
            <div className="loan-header">
              <div>
                <h3>{loan.amount} {loan.currency}</h3>
                <p className="loan-asset">{loan.asset}</p>
              </div>
              <span className={`loan-status ${loan.status}`}>{loan.status}</span>
            </div>
            <div className="loan-details">
              <div className="detail-item">
                <span className="detail-label">LTV</span>
                <span className="detail-value">{loan.ltv}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Taux</span>
                <span className="detail-value">{loan.rate}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Durée</span>
                <span className="detail-value">{loan.term}</span>
              </div>
            </div>
            <div className="loan-payment">
              <div className="payment-info">
                <span>Prochain paiement: {loan.nextPayment}</span>
                <span className="payment-date">Échéance: {loan.dueDate}</span>
              </div>
              <button className="btn-pay">Payer maintenant</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

