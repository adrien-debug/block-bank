'use client'

import { useState } from 'react'
import { NetworkAdaptedContent, SocialNetwork } from '@/types/marketing.types'
import Card from '@/components/ui/Card'

const NETWORK_LABELS: Record<SocialNetwork, string> = {
  facebook: 'Facebook',
  twitter: 'Twitter/X',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  tiktok: 'TikTok',
  youtube: 'YouTube',
}

const NETWORK_COLORS: Record<SocialNetwork, string> = {
  linkedin: '#0077B5',
  twitter: '#1DA1F2',
  facebook: '#1877F2',
  instagram: '#E4405F',
  tiktok: '#000000',
  youtube: '#FF0000'
}

const NETWORK_ICONS: Record<SocialNetwork, string> = {
  linkedin: '💼',
  twitter: '🐦',
  facebook: '📘',
  instagram: '📷',
  tiktok: '🎵',
  youtube: '📺'
}

interface ContentPreviewProps {
  adaptedContent: NetworkAdaptedContent[]
  baseContent?: string
}

export default function ContentPreview({ adaptedContent, baseContent }: ContentPreviewProps) {
  const [selectedNetwork, setSelectedNetwork] = useState<SocialNetwork | 'all'>('all')
  
  const filteredContent = selectedNetwork === 'all' 
    ? adaptedContent 
    : adaptedContent.filter(item => item.network === selectedNetwork)

  return (
    <div>
      {/* Filtres par réseau */}
      <div style={{ 
        display: 'flex', 
        gap: 'var(--space-2)', 
        marginBottom: 'var(--space-4)',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setSelectedNetwork('all')}
          style={{
            padding: 'var(--space-2) var(--space-4)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border-default)',
            background: selectedNetwork === 'all' ? 'var(--color-primary)' : 'transparent',
            color: selectedNetwork === 'all' ? 'white' : 'var(--color-text-primary)',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Tous
        </button>
        {adaptedContent.map(item => (
          <button
            key={item.network}
            onClick={() => setSelectedNetwork(item.network)}
            style={{
              padding: 'var(--space-2) var(--space-4)',
              borderRadius: 'var(--radius-md)',
              border: `1px solid ${NETWORK_COLORS[item.network]}`,
              background: selectedNetwork === item.network ? NETWORK_COLORS[item.network] : 'transparent',
              color: selectedNetwork === item.network ? 'white' : NETWORK_COLORS[item.network],
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)'
            }}
          >
            <span>{NETWORK_ICONS[item.network]}</span>
            {NETWORK_LABELS[item.network]}
          </button>
        ))}
      </div>

      {/* Prévisualisation du contenu de base si fourni */}
      {baseContent && selectedNetwork === 'all' && (
        <Card variant="elevated" style={{ marginBottom: 'var(--space-4)', padding: 'var(--space-4)' }}>
          <h3 style={{ marginBottom: 'var(--space-2)', fontSize: '16px', fontWeight: '600' }}>
            Contenu de base
          </h3>
          <p style={{ color: 'var(--color-text-primary)', whiteSpace: 'pre-wrap' }}>
            {baseContent}
          </p>
        </Card>
      )}

      {/* Prévisualisations par réseau */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {filteredContent.map((item, index) => (
          <Card 
            key={`${item.network}-${index}`}
            variant="elevated" 
            style={{ 
              padding: 'var(--space-4)',
              borderLeft: `4px solid ${NETWORK_COLORS[item.network]}`
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <span style={{ fontSize: '20px' }}>{NETWORK_ICONS[item.network]}</span>
                <h3 style={{ fontSize: '18px', fontWeight: '600' }}>
                  {NETWORK_LABELS[item.network]}
                </h3>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                <span style={{ 
                  fontSize: '12px', 
                  color: 'var(--color-text-secondary)',
                  padding: '4px 8px',
                  background: 'var(--color-bg-secondary)',
                  borderRadius: 'var(--radius-sm)'
                }}>
                  {item.content.length} / {item.maxLength} caractères
                </span>
                {item.format !== 'text' && (
                  <span style={{
                    fontSize: '12px',
                    padding: '4px 8px',
                    background: NETWORK_COLORS[item.network] + '20',
                    color: NETWORK_COLORS[item.network],
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: '500'
                  }}>
                    {item.format}
                  </span>
                )}
              </div>
            </div>

            {/* Contenu */}
            <div style={{
              background: 'var(--color-bg-secondary)',
              padding: 'var(--space-4)',
              borderRadius: 'var(--radius-md)',
              marginBottom: 'var(--space-3)',
              whiteSpace: 'pre-wrap',
              fontSize: '14px',
              lineHeight: '1.6',
              color: 'var(--color-text-primary)'
            }}>
              {item.content}
            </div>

            {/* Hashtags */}
            {item.hashtags.length > 0 && (
              <div style={{ marginBottom: 'var(--space-3)' }}>
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 'var(--space-2)',
                  fontSize: '14px'
                }}>
                  {item.hashtags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      style={{
                        padding: '4px 8px',
                        background: NETWORK_COLORS[item.network] + '20',
                        color: NETWORK_COLORS[item.network],
                        borderRadius: 'var(--radius-sm)',
                        fontWeight: '500'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Informations supplémentaires */}
            <div style={{ 
              display: 'flex', 
              gap: 'var(--space-4)', 
              fontSize: '12px', 
              color: 'var(--color-text-secondary)',
              paddingTop: 'var(--space-3)',
              borderTop: '1px solid var(--color-border-default)'
            }}>
              {item.optimalPostTime && (
                <span>🕐 Meilleur moment: {item.optimalPostTime}</span>
              )}
              {item.mediaSuggestions.length > 0 && (
                <span>📎 {item.mediaSuggestions.length} média(s) suggéré(s)</span>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

