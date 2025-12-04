'use client'

import { useState } from 'react'
import { ContentCategory, ContentTone, SocialNetwork, PostTemplateType, GeneratedContent, NetworkAdaptedContent } from '@/types/marketing.types'
import { generateAndAdaptMarketingContent } from '@/lib/services/marketingContentEngine'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import ContentPreview from './ContentPreview'

const CATEGORY_LABELS: Record<ContentCategory, string> = {
  'product-features': 'Fonctionnalités Produit',
  'educational': 'Éducatif',
  'institutional': 'Institutionnel',
  'use-cases': 'Cas d\'Usage',
  'partnerships': 'Partenariats',
  'industry-news': 'Actualités Industrie',
  'success-stories': 'Histoires de Succès',
  'credit-score': 'Credit Score',
  'nft-rwa': 'NFT RWA',
  'insurance': 'Assurance'
}

const TONE_LABELS: Record<ContentTone, string> = {
  'professional': 'Professionnel',
  'educational': 'Éducatif',
  'technical': 'Technique',
  'institutional': 'Institutionnel'
}

const NETWORK_LABELS: Record<SocialNetwork, string> = {
  facebook: 'Facebook',
  twitter: 'Twitter/X',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  tiktok: 'TikTok',
  youtube: 'YouTube',
}

const TEMPLATE_LABELS: Record<PostTemplateType, string> = {
  'product-announcement': 'Annonce Produit',
  'educational-thread': 'Thread Éducatif',
  'partnership-announcement': 'Annonce Partenariat',
  'use-case-story': 'Histoire de Cas d\'Usage',
  'industry-insight': 'Insight Industrie',
  'call-to-action': 'Appel à l\'Action',
  'success-story': 'Histoire de Succès'
}

export default function ContentGenerator() {
  const [category, setCategory] = useState<ContentCategory | ''>('')
  const [tone, setTone] = useState<ContentTone | ''>('')
  const [template, setTemplate] = useState<PostTemplateType | ''>('')
  const [networks, setNetworks] = useState<SocialNetwork[]>(['linkedin', 'twitter'])
  const [count, setCount] = useState(1)
  const [keywords, setKeywords] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedResults, setGeneratedResults] = useState<Array<{
    baseContent: GeneratedContent
    adaptedContent: NetworkAdaptedContent[]
  }>>([])
  const [selectedResult, setSelectedResult] = useState<number | null>(null)

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      const options: any = {
        networks,
        count
      }

      if (category) options.category = category
      if (tone) options.tone = tone
      if (template) options.template = template
      if (keywords) {
        options.keywords = keywords.split(',').map((k: string) => k.trim()).filter(Boolean)
      }

      const results = generateAndAdaptMarketingContent(options)
      setGeneratedResults(results)
      if (results.length > 0) {
        setSelectedResult(0)
      }
    } catch (error) {
      console.error('Error generating content:', error)
      alert('Erreur lors de la génération du contenu')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleNetworkToggle = (network: SocialNetwork) => {
    setNetworks(prev => 
      prev.includes(network)
        ? prev.filter(n => n !== network)
        : [...prev, network]
    )
  }

  const handleSavePost = async (result: { baseContent: GeneratedContent, adaptedContent: NetworkAdaptedContent[] }) => {
    // TODO: Implémenter la sauvegarde via API
    alert('Fonctionnalité de sauvegarde à implémenter')
  }

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: 'var(--space-2)' }}>
          Générateur de Contenu Marketing
        </h2>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Générez automatiquement du contenu adapté pour tous vos réseaux sociaux
        </p>
      </div>

      {/* Formulaire de génération */}
      <Card variant="elevated" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
          {/* Catégorie */}
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '14px', fontWeight: '500' }}>
              Catégorie
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ContentCategory | '')}
              style={{
                width: '100%',
                padding: 'var(--space-2) var(--space-3)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                background: 'var(--color-bg-primary)'
              }}
            >
              <option value="">Toutes les catégories</option>
              {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {/* Ton */}
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '14px', fontWeight: '500' }}>
              Ton
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as ContentTone | '')}
              style={{
                width: '100%',
                padding: 'var(--space-2) var(--space-3)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                background: 'var(--color-bg-primary)'
              }}
            >
              <option value="">Tous les tons</option>
              {Object.entries(TONE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {/* Template */}
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '14px', fontWeight: '500' }}>
              Template
            </label>
            <select
              value={template}
              onChange={(e) => setTemplate(e.target.value as PostTemplateType | '')}
              style={{
                width: '100%',
                padding: 'var(--space-2) var(--space-3)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                background: 'var(--color-bg-primary)'
              }}
            >
              <option value="">Aucun template spécifique</option>
              {Object.entries(TEMPLATE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {/* Nombre de posts */}
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '14px', fontWeight: '500' }}>
              Nombre de posts
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 1)}
              style={{
                width: '100%',
                padding: 'var(--space-2) var(--space-3)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                background: 'var(--color-bg-primary)'
              }}
            />
          </div>
        </div>

        {/* Mots-clés */}
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '14px', fontWeight: '500' }}>
            Mots-clés (séparés par des virgules)
          </label>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="Ex: Credit Score, RWA, Tokenisation"
            style={{
              width: '100%',
              padding: 'var(--space-2) var(--space-3)',
              border: '1px solid var(--color-border-default)',
              borderRadius: 'var(--radius-md)',
              fontSize: '14px',
              background: 'var(--color-bg-primary)'
            }}
          />
        </div>

        {/* Réseaux sociaux */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '14px', fontWeight: '500' }}>
            Réseaux sociaux
          </label>
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            {(Object.keys(NETWORK_LABELS) as SocialNetwork[]).map(network => (
              <button
                key={network}
                type="button"
                onClick={() => handleNetworkToggle(network)}
                style={{
                  padding: 'var(--space-2) var(--space-4)',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid var(--color-border-default)`,
                  background: networks.includes(network) ? 'var(--color-primary)' : 'transparent',
                  color: networks.includes(network) ? 'white' : 'var(--color-text-primary)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: networks.includes(network) ? '500' : '400'
                }}
              >
                {NETWORK_LABELS[network]}
              </button>
            ))}
          </div>
        </div>

        {/* Bouton générer */}
        <Button
          onClick={handleGenerate}
          variant="primary"
          disabled={isGenerating || networks.length === 0}
          style={{ width: '100%' }}
        >
          {isGenerating ? 'Génération en cours...' : 'Générer du contenu'}
        </Button>
      </Card>

      {/* Résultats générés */}
      {generatedResults.length > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600' }}>
              Résultats générés ({generatedResults.length})
            </h3>
            {generatedResults.length > 1 && (
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                {generatedResults.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedResult(index)}
                    style={{
                      padding: 'var(--space-2) var(--space-4)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border-default)',
                      background: selectedResult === index ? 'var(--color-primary)' : 'transparent',
                      color: selectedResult === index ? 'white' : 'var(--color-text-primary)',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Post {index + 1}
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedResult !== null && generatedResults[selectedResult] && (
            <div>
              <ContentPreview
                adaptedContent={generatedResults[selectedResult].adaptedContent}
                baseContent={generatedResults[selectedResult].baseContent.baseContent}
              />
              
              <div style={{ marginTop: 'var(--space-4)', display: 'flex', gap: 'var(--space-3)' }}>
                <Button
                  variant="primary"
                  onClick={() => handleSavePost(generatedResults[selectedResult])}
                >
                  Sauvegarder les posts
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setGeneratedResults([])}
                >
                  Générer à nouveau
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

