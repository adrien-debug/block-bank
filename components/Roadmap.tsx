'use client'

import { useState } from 'react'
import DashboardIcon from './icons/DashboardIcon'
import StarIcon from './icons/StarIcon'
import MoneyIcon from './icons/MoneyIcon'
import NFTIcon from './icons/NFTIcon'
import ShieldIcon from './icons/ShieldIcon'
import UserIcon from './icons/UserIcon'

type StorySection = 'vision' | 'nft-rwa' | 'insurance' | 'credit-score' | 'journey' | 'roadmap'

export default function Roadmap() {
  const [activeSection, setActiveSection] = useState<StorySection>('roadmap')

  const storySections = [
    { id: 'vision' as StorySection, label: 'Vision', icon: DashboardIcon, href: '#vision' },
    { id: 'nft-rwa' as StorySection, label: 'NFT RWA', icon: NFTIcon, href: '#nft-rwa' },
    { id: 'insurance' as StorySection, label: 'Insurance', icon: ShieldIcon, href: '#insurance' },
    { id: 'credit-score' as StorySection, label: 'Credit Score', icon: StarIcon, href: '#credit-score' },
    { id: 'journey' as StorySection, label: 'Journey', icon: MoneyIcon, href: '#journey-client' },
    { id: 'roadmap' as StorySection, label: 'Roadmap', icon: UserIcon, href: '#roadmap' },
  ]

  const handleSectionClick = (section: StorySection, href: string) => {
    setActiveSection(section)
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="section" id="roadmap">
      <div className="section-header">
        <div>
          <div className="section-kicker">5. Roadmap</div>
          <h2>Roadmap de déploiement</h2>
        </div>
        <div className="section-badge">
          <span className="section-badge-dot"></span>
          <span>De MVP à déploiement institutionnel</span>
        </div>
      </div>
      <div className="grid-3">
        <div className="card">
          <h4>Phase 1 — Prototype</h4>
          <ul>
            <li>Choix de la chaîne (L2 EVM, stable & peu coûteuse).</li>
            <li>Intégration d&apos;un provider KYC + identité on-chain.</li>
            <li>Premier modèle de score (règles + sous-scores de base).</li>
            <li>Smart contracts de prêt & NFT RWA rudimentaires.</li>
            <li>Pilote interne avec quelques deals miniers.</li>
          </ul>
        </div>
        <div className="card">
          <h4>Phase 2 — Pilote Qatar</h4>
          <ul>
            <li>Structuration légale détaillée avec un cabinet local.</li>
            <li>Deals pilotes (5–10) sur actifs bien maîtrisés.</li>
            <li>Monitoring intensif des performances & défauts.</li>
            <li>Amélioration du moteur de scoring et du pricing assurance.</li>
          </ul>
        </div>
        <div className="card">
          <h4>Phase 3 — Scale & multi-actifs</h4>
          <ul>
            <li>Extension à d&apos;autres types d&apos;actifs (immobilier, infra).</li>
            <li>Ouverture à co-investisseurs institutionnels.</li>
            <li>Tranching complet (senior / mezz / junior).</li>
            <li>API & dashboards pour Qatar et partenaires bancaires.</li>
          </ul>
        </div>
      </div>

      {/* Navigation Menu with Dashboard Style at the end */}
      <div className="story-nav-menu">
        <div className="story-nav-header">
          <h3>Explore the Story</h3>
          <p>Navigate through all sections of BlockBank</p>
        </div>
        <nav className="sidebar-nav">
          {storySections.map((section) => {
            const IconComponent = section.icon
            return (
              <button
                key={section.id}
                onClick={() => handleSectionClick(section.id, section.href)}
                className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
              >
                <span className="nav-icon">
                  <IconComponent />
                </span>
                <span className="nav-label">{section.label}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </section>
  )
}


