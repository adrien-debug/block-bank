'use client'

import { useEffect, useState } from 'react'
import Button from './ui/Button'

export default function Navigation() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 100)
      
      const sections = document.querySelectorAll('section[id]')
      const scrollPosition = window.scrollY + 150

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

  const handleClick = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  if (!isVisible) return null

  return (
    <nav className="sticky-nav">
      <div className="sticky-nav-content">
        <div className="sticky-nav-logo">∞ MyBank Protocol</div>
        <div className="sticky-nav-links">
          <button
            onClick={() => handleClick('#vision')}
            className={activeSection === 'vision' ? 'active' : ''}
          >
            Vision
          </button>
          <button
            onClick={() => handleClick('#module-credit-score')}
            className={activeSection === 'module-credit-score' ? 'active' : ''}
          >
            Credit Score
          </button>
          <button
            onClick={() => handleClick('#module-nft-rwa')}
            className={activeSection === 'module-nft-rwa' ? 'active' : ''}
          >
            NFT RWA
          </button>
          <button
            onClick={() => handleClick('#module-assurance')}
            className={activeSection === 'module-assurance' ? 'active' : ''}
          >
            Assurance
          </button>
        </div>
      </div>
    </nav>
  )
}


