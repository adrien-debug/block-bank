'use client'

import { useState } from 'react'
import InfoIcon from '../icons/InfoIcon'

interface HelpButtonProps {
  email?: string
  className?: string
}

export default function HelpButton({ email = 'admin@block-bank.com', className = '' }: HelpButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Bouton d'aide flottant */}
      <button
        className={`help-button ${className}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Aide et support"
        title="Aide et support"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 50%, #3B82F6 100%)',
          border: 'none',
          color: '#FFFFFF',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4), 0 2px 4px rgba(0, 0, 0, 0.1)',
          zIndex: 9999,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          padding: 0,
        }}
      >
        <InfoIcon />
      </button>

      {/* Panel d'aide */}
      {isOpen && (
        <>
          <div 
            className="help-overlay"
            onClick={() => setIsOpen(false)}
          />
          <div className="help-panel">
            <div className="help-panel-header">
              <h3>Aide & Support</h3>
              <button 
                className="help-close-button"
                onClick={() => setIsOpen(false)}
                aria-label="Fermer"
              >
                ×
              </button>
            </div>
            <div className="help-panel-content">
              <div className="help-section">
                <h4>Besoin d'aide ?</h4>
                <p>Notre équipe est là pour vous aider.</p>
              </div>
              <div className="help-actions">
                <a 
                  href={`mailto:${email}`}
                  className="help-action-button"
                >
                  <span>📧</span>
                  <div>
                    <strong>Envoyer un email</strong>
                    <span>{email}</span>
                  </div>
                </a>
                <div className="help-info">
                  <p>Vous pouvez également consulter la documentation ou contacter le support.</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

