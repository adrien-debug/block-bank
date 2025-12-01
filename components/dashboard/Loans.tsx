'use client'

import { useState } from 'react'

export default function Loans() {
  const [showNewLoan, setShowNewLoan] = useState(false)

  const activeLoans = [
    {
      id: 1,
      amount: '100,000',
      currency: 'USDC',
      asset: 'Villa Paris - NFT #1234',
      ltv: '65%',
      rate: '8.5%',
      term: '36 months',
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
      term: '24 months',
      status: 'active',
      nextPayment: '7,500 USDC',
      dueDate: '2024-02-20',
    },
  ]

  return (
    <div className="loans-page">
      <div className="page-header">
        <h1>My Loans</h1>
        <button 
          onClick={() => setShowNewLoan(true)} 
          className="btn-primary"
        >
          + New loan
        </button>
      </div>

      {showNewLoan && (
        <div className="new-loan-modal">
          <div className="modal-content">
            <h2>Request a new loan</h2>
            <form className="loan-form">
              <div className="form-group">
                <label>Requested amount</label>
                <input type="number" placeholder="100,000" />
                <select>
                  <option>USDC</option>
                  <option>USDT</option>
                  <option>DAI</option>
                </select>
              </div>
              <div className="form-group">
                <label>Collateral asset (NFT RWA)</label>
                <select>
                  <option>Select an NFT RWA</option>
                  <option>Villa Paris - NFT #1234</option>
                  <option>Mining Farm - NFT #5678</option>
                </select>
              </div>
              <div className="form-group">
                <label>Duration</label>
                <select>
                  <option>12 months</option>
                  <option>24 months</option>
                  <option>36 months</option>
                  <option>48 months</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowNewLoan(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Submit request
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
                <span className="detail-label">Rate</span>
                <span className="detail-value">{loan.rate}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Term</span>
                <span className="detail-value">{loan.term}</span>
              </div>
            </div>
            <div className="loan-payment">
              <div className="payment-info">
                <span>Next payment: {loan.nextPayment}</span>
                <span className="payment-date">Due date: {loan.dueDate}</span>
              </div>
              <button className="btn-pay">Pay now</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

