'use client'

export default function Insurance() {
  const insurancePolicies = [
    {
      id: 1,
      loanId: 'Loan #1',
      coverage: '80%',
      premium: '2,400',
      currency: 'USDC',
      period: 'Annual',
      status: 'active',
      risks: ['Borrower default', 'Market risk'],
    },
    {
      id: 2,
      loanId: 'Loan #2',
      coverage: '75%',
      premium: '1,200',
      currency: 'USDC',
      period: 'Annual',
      status: 'active',
      risks: ['Borrower default'],
    },
  ]

  return (
    <div className="insurance-page">
      <h1>My Insurance</h1>
      
      <div className="insurance-summary">
        <div className="summary-card">
          <div className="summary-label">Total coverage</div>
          <div className="summary-value">155%</div>
          <div className="summary-subtitle">of loan value</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Annual premium</div>
          <div className="summary-value">3,600 USDC</div>
          <div className="summary-subtitle">Across 2 policies</div>
        </div>
      </div>

      <div className="insurance-policies">
        <h2>Active policies</h2>
        {insurancePolicies.map((policy) => (
          <div key={policy.id} className="policy-card">
            <div className="policy-header">
              <h3>{policy.loanId}</h3>
              <span className={`policy-status ${policy.status}`}>Active</span>
            </div>
            <div className="policy-details">
              <div className="detail-row">
                <span className="detail-label">Coverage</span>
                <span className="detail-value">{policy.coverage}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">{policy.period} premium</span>
                <span className="detail-value">{policy.premium} {policy.currency}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Covered risks</span>
                <div className="risks-list">
                  {policy.risks.map((risk, idx) => (
                    <span key={idx} className="risk-badge">{risk}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="policy-actions">
              <button className="btn-secondary">View details</button>
              <button className="btn-primary">Renew</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
