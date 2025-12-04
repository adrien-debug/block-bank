'use client'

import { useRouter } from 'next/navigation'
import WalletConnect from './WalletConnect'
import ChartIcon from './icons/ChartIcon'
import NFTAssetIcon from './icons/NFTAssetIcon'
import ShieldIcon from './icons/ShieldIcon'
import ChartUpIcon from './icons/ChartUpIcon'
import Button from './ui/Button'

export default function Landing() {
  const router = useRouter()

  return (
    <div className="landing">
      <div className="landing-hero">
        <h1 className="landing-title">
          <span className="title-emphasis">On-chain credit</span> infrastructure
          <br />
          for real assets
        </h1>
        <p className="landing-description">
          Complete design of an under-collateralized on-chain credit bank,
          built around three pillars: a hybrid credit score engine,
          an RWA tokens collateralization system for real-world assets and a
          parametric insurance protocol.
        </p>
        <div className="landing-opportunity-cta">
          <Button
            variant="primary"
            onClick={() => router.push('/legalblock/opportunity')}
            className="opportunity-button"
          >
            <ChartUpIcon className="button-icon" />
            Submit a Request
          </Button>
        </div>
        <div className="landing-features">
          <div className="feature-card">
            <div className="feature-icon">
              <ChartIcon />
            </div>
            <h3>Credit Score</h3>
            <p>Transparent and auditable hybrid on-chain/off-chain score</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <NFTAssetIcon />
            </div>
            <h3>RWA Tokens</h3>
            <p>Collateralization via RWA tokens for tokenized real assets</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <ShieldIcon />
            </div>
            <h3>Insurance</h3>
            <p>Parametric default insurance protocol</p>
          </div>
        </div>
      </div>
    </div>
  )
}

