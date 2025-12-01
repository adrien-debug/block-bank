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
          Infrastructure de crédit on-chain
          <br />
          pour actifs réels & mining Bitcoin
        </h1>
        <p className="landing-description">
          Conception complète d&apos;une banque de crédit on-chain, sous-collatéralisée,
          construite autour de trois piliers : un moteur de crédit score hybride,
          un système de nantissement NFT pour actifs réels (RWA) et un protocole
          d&apos;assurance paramétrique.
        </p>
        <div className="landing-features">
          <div className="feature-card">
            <div className="feature-icon">
              <ChartIcon />
            </div>
            <h3>Credit Score</h3>
            <p>Score hybride on-chain/off-chain transparent et auditable</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <NFTAssetIcon />
            </div>
            <h3>NFT RWA</h3>
            <p>Nantissement via NFT pour actifs réels tokenisés</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <ShieldIcon />
            </div>
            <h3>Assurance</h3>
            <p>Protocole d&apos;assurance défaut paramétrique</p>
          </div>
        </div>
        <div className="landing-cta">
          <p className="cta-text">Connectez votre wallet pour commencer</p>
        </div>
      </div>
    </div>
  )
}

