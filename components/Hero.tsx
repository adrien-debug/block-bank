'use client'

import { useEffect, useState } from 'react'
import Button from './ui/Button'

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <header className={`hero ${isVisible ? 'fade-in' : ''}`}>
      <div className="hero-main">
        <div className="hero-kicker">
          <div className="hero-kicker-pill">∞</div>
          <span>On-Chain Credit Banking Protocol • Adrien × Qatar</span>
        </div>
        <h1>
          <span className="title-emphasis">On-chain credit</span> infrastructure
          <br />
          for real assets
        </h1>
        <p>
          Complete design of an under-collateralized on-chain credit bank,
          built around three pillars: a hybrid on-chain/off-chain credit score
          engine, an NFT collateralization system for real-world assets (RWA)
          and a parametric insurance protocol covering defaults.
          This architecture is designed for institutional deployment
          (sovereign funds, banks, Qatar) with compliance, transparency
          and global scalability requirements.
        </p>
        <div className="hero-tags">
          <div className="tag">
            <span className="tag-dot"></span>
            <span>Credit banking on-chain</span>
          </div>
          <div className="tag">
            <span className="tag-dot tag-dot-alt"></span>
            <span>NFT RWA collateralization</span>
          </div>
          <div className="tag">
            <span className="tag-dot"></span>
            <span>Bitcoin Mining • ~3 EH/s</span>
          </div>
          <div className="tag">
            <span className="tag-dot tag-dot-alt"></span>
            <span>Parametric default insurance</span>
          </div>
        </div>
        <div className="hero-cta-row">
          <Button href="#module-credit-score" variant="primary">
            1. Credit score engine
          </Button>
          <Button href="#module-nft-rwa" variant="ghost">
            2. NFT & RWA collateralization
          </Button>
          <Button href="#module-assurance" variant="ghost">
            3. Default insurance protocol
          </Button>
        </div>
        <div className="hero-metric-grid">
          <div className="metric-card">
            <div className="metric-label">Mining capacity (current)</div>
            <div className="metric-value">≈ 3 EH/s</div>
            <div className="metric-caption">
              Distributed global hashrate, predictable BTC flows → ideal base for
              modeling revenue and financing correlated infrastructure.
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Risk structure</div>
            <div className="metric-value">Under-collateralized, but insured</div>
            <div className="metric-caption">
              The protocol accepts credit risk by assuming that
              default is probabilizable and mutualizable through insurance
              and dynamic scoring.
            </div>
          </div>
        </div>
      </div>
      <aside className="hero-side">
        <div className="hero-side-box">
          <div className="hero-side-title">Strategic angle for Qatar</div>
          <div className="hero-pill-row">
            <div className="hero-pill">Structured access to tokenized RWAs</div>
            <div className="hero-pill">Controlled BTC mining exposure</div>
            <div className="hero-pill">Islamic-compatible credit infra*</div>
          </div>
          <p style={{fontSize:'0.82rem',marginBottom:'6px'}}>
            *The exact structuring (Murabaha, Ijara, etc.) remains separate legal
            work, but the technical layer is ready to support
            these logics (flows rather than explicit interest, profit sharing,
            etc.).
          </p>
          <ul className="hero-step-list">
            <li>
              <div className="hero-step-badge">1</div>
              <div>
                <strong>Certifiable score engine</strong><br />
                100% transparent and auditable score, combining identity,
                on-chain behavior, traditional financial metrics
                and asset quality.
              </div>
            </li>
            <li>
              <div className="hero-step-badge">2</div>
              <div>
                <strong>NFT collateralization of financed assets</strong><br />
                Properties and equipment are tokenized, locked
                in smart contracts, with automatic transfer in case of default.
              </div>
            </li>
            <li>
              <div className="hero-step-badge">3</div>
              <div>
                <strong>Default insurance layer</strong><br />
                Capital pools (Qatar + investors) that absorb mutualized risk,
                with parametric triggers.
              </div>
            </li>
          </ul>
        </div>
      </aside>
    </header>
  )
}

