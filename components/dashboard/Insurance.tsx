'use client'

export default function Insurance() {
  const insurancePolicies = [
    {
      id: 1,
      loanId: 'Prêt #1',
      coverage: '80%',
      premium: '2,400',
      currency: 'USDC',
      period: 'Annuel',
      status: 'active',
      risks: ['Défaut emprunteur', 'Risque marché'],
    },
    {
      id: 2,
      loanId: 'Prêt #2',
      coverage: '75%',
      premium: '1,200',
      currency: 'USDC',
      period: 'Annuel',
      status: 'active',
      risks: ['Défaut emprunteur'],
    },
  ]

  return (
    <div className="insurance-page">
      <h1>Mes Assurances</h1>
      
      <div className="insurance-summary">
        <div className="summary-card">
          <div className="summary-label">Couverture totale</div>
          <div className="summary-value">155%</div>
          <div className="summary-subtitle">de la valeur des prêts</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Prime annuelle</div>
          <div className="summary-value">3,600 USDC</div>
          <div className="summary-subtitle">Répartie sur 2 polices</div>
        </div>
      </div>

      <div className="insurance-policies">
        <h2>Polices actives</h2>
        {insurancePolicies.map((policy) => (
          <div key={policy.id} className="policy-card">
            <div className="policy-header">
              <h3>{policy.loanId}</h3>
              <span className={`policy-status ${policy.status}`}>Actif</span>
            </div>
            <div className="policy-details">
              <div className="detail-row">
                <span className="detail-label">Couverture</span>
                <span className="detail-value">{policy.coverage}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Prime {policy.period.toLowerCase()}</span>
                <span className="detail-value">{policy.premium} {policy.currency}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Risques couverts</span>
                <div className="risks-list">
                  {policy.risks.map((risk, idx) => (
                    <span key={idx} className="risk-badge">{risk}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="policy-actions">
              <button className="btn-secondary">Voir les détails</button>
              <button className="btn-primary">Renouveler</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

