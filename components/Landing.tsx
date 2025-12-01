'use client'

import WalletConnect from './WalletConnect'
import ChartIcon from './icons/ChartIcon'
import NFTAssetIcon from './icons/NFTAssetIcon'
import ShieldIcon from './icons/ShieldIcon'

export default function Landing() {
  return (
    <div className="landing">
      <div className="landing-hero">
        <h1 className="landing-title">
          On-chain credit infrastructure
          <br />
          for real assets & Bitcoin mining
        </h1>
        <p className="landing-description">
          Complete design of an under-collateralized on-chain credit bank,
          built around three pillars: a hybrid credit score engine,
          an NFT collateralization system for real-world assets (RWA) and a
          parametric insurance protocol.
        </p>
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
            <h3>NFT RWA</h3>
            <p>Collateralization via NFT for tokenized real assets</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <ShieldIcon />
            </div>
            <h3>Insurance</h3>
            <p>Parametric default insurance protocol</p>
          </div>
        </div>
        <div className="landing-cta">
          <p className="cta-text">Connect your wallet to get started</p>
        </div>
      </div>
    </div>
  )
}

