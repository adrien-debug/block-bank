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
          <span>Protocole de Credit Banking On-Chain • Adrien × Qatar</span>
        </div>
        <h1>Infrastructure de crédit on-chain<br />pour actifs réels & mining Bitcoin</h1>
        <p>
          Conception complète d&apos;une banque de crédit on-chain, sous-collatéralisée,
          construite autour de trois piliers&nbsp;: un moteur de crédit score
          hybride on-chain/off-chain, un système de nantissement NFT pour actifs
          réels (RWA) et un protocole d&apos;assurance paramétrique couvrant les défauts.
          Cette architecture est pensée pour un déploiement institutionnel
          (fonds souverain, banques, Qatar) avec exigences de conformité, de
          transparence et de scalabilité globale.
        </p>
        <div className="hero-tags">
          <div className="tag">
            <span className="tag-dot"></span>
            <span>Credit banking on-chain</span>
          </div>
          <div className="tag">
            <span className="tag-dot tag-dot-alt"></span>
            <span>NFT de nantissement RWA</span>
          </div>
          <div className="tag">
            <span className="tag-dot"></span>
            <span>Mining Bitcoin • ~3 EH/s</span>
          </div>
          <div className="tag">
            <span className="tag-dot tag-dot-alt"></span>
            <span>Assurance paramétrique défaut</span>
          </div>
        </div>
        <div className="hero-cta-row">
          <Button href="#module-credit-score" variant="primary">
            1. Moteur de credit score
          </Button>
          <Button href="#module-nft-rwa" variant="ghost">
            2. NFT & nantissement RWA
          </Button>
          <Button href="#module-assurance" variant="ghost">
            3. Protocole d&apos;assurance défaut
          </Button>
        </div>
        <div className="hero-metric-grid">
          <div className="metric-card">
            <div className="metric-label">Capacité minière (actuelle)</div>
            <div className="metric-value">≈ 3 EH/s</div>
            <div className="metric-caption">
              Hashrate mondial réparti, flux BTC prévisibles → base idéale pour
              modéliser des revenus et financer des infrastructures corrélées.
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Structure de risque</div>
            <div className="metric-value">Sous-collatéralisée, mais assurée</div>
            <div className="metric-caption">
              Le protocole accepte le risque de crédit en assumant que
              le défaut est probabilisable et mutualisable via assurance
              et notation dynamique.
            </div>
          </div>
        </div>
      </div>
      <aside className="hero-side">
        <div className="hero-side-box">
          <div className="hero-side-title">Angle stratégique pour le Qatar</div>
          <div className="hero-pill-row">
            <div className="hero-pill">Accès structuré à des RWA tokenisés</div>
            <div className="hero-pill">Exposition minière BTC maîtrisée</div>
            <div className="hero-pill">Infra de crédit islamique-compatible*</div>
          </div>
          <p style={{fontSize:'0.82rem',marginBottom:'6px'}}>
            *La structuration exacte (Murabaha, Ijara, etc.) reste un travail
            juridique séparé, mais la couche technique est prête à supporter
            ces logiques (flux plutôt que intérêt explicite, partage de profit,
            etc.).
          </p>
          <ul className="hero-step-list">
            <li>
              <div className="hero-step-badge">1</div>
              <div>
                <strong>Moteur de score certifiable</strong><br />
                Score 100&nbsp;% transparent et auditable, combinant identité,
                comportement on-chain, métriques financières classiques
                et qualité des actifs.
              </div>
            </li>
            <li>
              <div className="hero-step-badge">2</div>
              <div>
                <strong>Nantissement NFT des actifs financés</strong><br />
                Les propriétés et équipements sont tokenisés, lockés
                dans des smart contracts, avec transfert automatique en cas de défaut.
              </div>
            </li>
            <li>
              <div className="hero-step-badge">3</div>
              <div>
                <strong>Couche assurance défaut</strong><br />
                Pools de capital (Qatar + investisseurs) qui absorbent le risque
                mutualisé, avec déclencheurs paramétriques.
              </div>
            </li>
          </ul>
        </div>
      </aside>
    </header>
  )
}

