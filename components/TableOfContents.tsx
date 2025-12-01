'use client'

import { useEffect, useState } from 'react'

export default function TableOfContents() {
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]')
      const scrollPosition = window.scrollY + 100

      sections.forEach((section) => {
        const sectionElement = section as HTMLElement
        const sectionTop = sectionElement.offsetTop
        const sectionHeight = sectionElement.offsetHeight
        const sectionId = section.getAttribute('id')

        if (
          scrollPosition >= sectionTop &&
          scrollPosition < sectionTop + sectionHeight
        ) {
          setActiveSection(sectionId || '')
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <section className="toc" id="sommaire">
      <div className="toc-title">Sommaire cliquable</div>
      <ul>
        <li>
          <a 
            href="#vision" 
            onClick={(e) => handleClick(e, '#vision')}
            className={activeSection === 'vision' ? 'active' : ''}
          >
            0. Vision & principes directeurs
          </a>
        </li>
        <li>
          <a 
            href="#module-credit-score" 
            onClick={(e) => handleClick(e, '#module-credit-score')}
            className={activeSection === 'module-credit-score' ? 'active' : ''}
          >
            1. Moteur de credit score hybride
          </a>
          <ul className="toc-sub">
            <li><a href="#cs-architecture" onClick={(e) => handleClick(e, '#cs-architecture')}>1.1 Architecture générale</a></li>
            <li><a href="#cs-onchain" onClick={(e) => handleClick(e, '#cs-onchain')}>1.2 On-chain Behavioral Analytics</a></li>
            <li><a href="#cs-offchain" onClick={(e) => handleClick(e, '#cs-offchain')}>1.3 Off-chain Financial & Corporate Metrics</a></li>
            <li><a href="#cs-assets" onClick={(e) => handleClick(e, '#cs-assets')}>1.4 Asset-Based Metrics</a></li>
            <li><a href="#cs-reputation" onClick={(e) => handleClick(e, '#cs-reputation')}>1.5 Reputation & Trust Layer</a></li>
            <li><a href="#cs-score-final" onClick={(e) => handleClick(e, '#cs-score-final')}>1.6 Score final & mapping conditions</a></li>
            <li><a href="#cs-tokenisation" onClick={(e) => handleClick(e, '#cs-tokenisation')}>1.7 Tokenisation & NFT de score</a></li>
            <li><a href="#cs-kpi" onClick={(e) => handleClick(e, '#cs-kpi')}>1.8 KPIs, gouvernance & auditabilité</a></li>
          </ul>
        </li>
        <li>
          <a 
            href="#module-nft-rwa" 
            onClick={(e) => handleClick(e, '#module-nft-rwa')}
            className={activeSection === 'module-nft-rwa' ? 'active' : ''}
          >
            2. Système de nantissement via NFT RWA
          </a>
          <ul className="toc-sub">
            <li><a href="#rwa-legal" onClick={(e) => handleClick(e, '#rwa-legal')}>2.1 Architecture légale & SPV</a></li>
            <li><a href="#rwa-nft-structure" onClick={(e) => handleClick(e, '#rwa-nft-structure')}>2.2 Structure du NFT RWA</a></li>
            <li><a href="#rwa-flow" onClick={(e) => handleClick(e, '#rwa-flow')}>2.3 Flow complet de nantissement</a></li>
            <li><a href="#rwa-enforcement" onClick={(e) => handleClick(e, '#rwa-enforcement')}>2.4 Enforcement & exécution</a></li>
            <li><a href="#rwa-cas-usage" onClick={(e) => handleClick(e, '#rwa-cas-usage')}>2.5 Cas d&apos;usage : immobilier, mining, infra</a></li>
            <li><a href="#rwa-qatar" onClick={(e) => handleClick(e, '#rwa-qatar')}>2.6 Spécificités pour Qatar & fonds souverains</a></li>
          </ul>
        </li>
        <li>
          <a 
            href="#module-assurance" 
            onClick={(e) => handleClick(e, '#module-assurance')}
            className={activeSection === 'module-assurance' ? 'active' : ''}
          >
            3. Protocole d&apos;assurance défaut
          </a>
          <ul className="toc-sub">
            <li><a href="#assurance-risques" onClick={(e) => handleClick(e, '#assurance-risques')}>3.1 Typologie des risques couverts</a></li>
            <li><a href="#assurance-architecture" onClick={(e) => handleClick(e, '#assurance-architecture')}>3.2 Architecture pools & tranches</a></li>
            <li><a href="#assurance-parametric" onClick={(e) => handleClick(e, '#assurance-parametric')}>3.3 Déclencheurs paramétriques</a></li>
            <li><a href="#assurance-pricing" onClick={(e) => handleClick(e, '#assurance-pricing')}>3.4 Modèle de pricing & actuariat</a></li>
            <li><a href="#assurance-dyn" onClick={(e) => handleClick(e, '#assurance-dyn')}>3.5 Dynamiques de pools & scénarios</a></li>
            <li><a href="#assurance-qatar" onClick={(e) => handleClick(e, '#assurance-qatar')}>3.6 Offre typée pour Qatar</a></li>
          </ul>
        </li>
        <li>
          <a 
            href="#journey-client" 
            onClick={(e) => handleClick(e, '#journey-client')}
            className={activeSection === 'journey-client' ? 'active' : ''}
          >
            4. Journey complet d&apos;un client
          </a>
        </li>
        <li>
          <a 
            href="#roadmap" 
            onClick={(e) => handleClick(e, '#roadmap')}
            className={activeSection === 'roadmap' ? 'active' : ''}
          >
            5. Roadmap de déploiement
          </a>
        </li>
        <li>
          <a 
            href="#annexes" 
            onClick={(e) => handleClick(e, '#annexes')}
            className={activeSection === 'annexes' ? 'active' : ''}
          >
            6. Annexes & variantes
          </a>
        </li>
      </ul>
    </section>
  )
}

