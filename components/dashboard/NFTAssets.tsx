'use client'

interface NFTAssetsProps {
  onUseForLoan?: () => void
}

export default function NFTAssets({ onUseForLoan }: NFTAssetsProps) {
  const nftAssets = [
    {
      id: 1,
      tokenId: '#1234',
      type: 'Immobilier',
      name: 'Villa Paris',
      value: '300,000',
      currency: 'USDC',
      status: 'locked',
      lockedIn: 'Prêt #1',
    },
    {
      id: 2,
      tokenId: '#5678',
      type: 'Mining',
      name: 'Mining Farm',
      value: '150,000',
      currency: 'USDC',
      status: 'locked',
      lockedIn: 'Prêt #2',
    },
    {
      id: 3,
      tokenId: '#9012',
      type: 'Infrastructure',
      name: 'Data Center',
      value: '500,000',
      currency: 'USDC',
      status: 'available',
    },
  ]

  return (
    <div className="nft-assets-page">
      <div className="page-header">
        <h1>Mes NFT RWA</h1>
        <button className="btn-primary">+ Tokeniser un actif</button>
      </div>

      <div className="nft-grid">
        {nftAssets.map((nft) => (
          <div key={nft.id} className={`nft-card ${nft.status}`}>
            <div className="nft-header">
              <span className="nft-type">{nft.type}</span>
              <span className={`nft-status ${nft.status}`}>
                {nft.status === 'locked' ? '🔒 Verrouillé' : '✅ Disponible'}
              </span>
            </div>
            <div className="nft-body">
              <h3>{nft.name}</h3>
              <p className="nft-token-id">Token ID: {nft.tokenId}</p>
              <div className="nft-value">
                <span className="value-amount">{nft.value}</span>
                <span className="value-currency">{nft.currency}</span>
              </div>
              {nft.status === 'locked' && (
                <p className="nft-locked-info">Utilisé dans: {nft.lockedIn}</p>
              )}
            </div>
            <div className="nft-actions">
              {nft.status === 'available' && (
                <>
                  <button className="btn-secondary">Voir détails</button>
                  <button 
                    className="btn-primary"
                    onClick={() => {
                      if (onUseForLoan) {
                        onUseForLoan()
                      }
                    }}
                  >
                    Utiliser pour prêt
                  </button>
                </>
              )}
              {nft.status === 'locked' && (
                <button className="btn-secondary" disabled>Détails</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

