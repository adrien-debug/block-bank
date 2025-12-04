'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { SocialPost, SocialNetwork, PostStatus } from '@/types/marketing.types'

const NETWORK_LABELS: Record<SocialNetwork, string> = {
  facebook: 'Facebook',
  twitter: 'Twitter/X',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  tiktok: 'TikTok',
  youtube: 'YouTube',
}

const NETWORK_CHAR_LIMITS: Record<SocialNetwork, number> = {
  facebook: 63206,
  twitter: 280,
  instagram: 2200,
  linkedin: 3000,
  tiktok: 2200,
  youtube: 5000,
}

interface PostEditorProps {
  post: SocialPost | null
  onClose: () => void
}

export default function PostEditor({ post, onClose }: PostEditorProps) {
  const [content, setContent] = useState('')
  const [networks, setNetworks] = useState<SocialNetwork[]>([])
  const [scheduledAt, setScheduledAt] = useState('')
  const [status, setStatus] = useState<PostStatus>('draft')
  const [mediaUrls, setMediaUrls] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (post) {
      setContent(post.content)
      setNetworks(post.networks)
      setScheduledAt(post.scheduledAt ? new Date(post.scheduledAt).toISOString().slice(0, 16) : '')
      setStatus(post.status)
      setMediaUrls(post.mediaUrls || [])
    }
  }, [post])

  const handleNetworkToggle = (network: SocialNetwork) => {
    setNetworks((prev) =>
      prev.includes(network) ? prev.filter((n) => n !== network) : [...prev, network]
    )
  }

  const handleSave = async () => {
    if (!content.trim() || networks.length === 0) {
      alert('Le contenu et au moins un réseau sont requis')
      return
    }

    setIsSaving(true)
    try {
      const payload = {
        content,
        networks,
        scheduledAt: scheduledAt || null,
        status,
        mediaUrls,
      }

      const url = post ? `/api/admin/marketing/posts/${post.id}` : '/api/admin/marketing/posts'
      const method = post ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (data.success) {
        onClose()
      } else {
        alert(data.error || 'Erreur lors de la sauvegarde')
      }
    } catch (error) {
      console.error('Error saving post:', error)
      alert('Erreur lors de la sauvegarde')
    } finally {
      setIsSaving(false)
    }
  }

  const getMaxChars = () => {
    if (networks.length === 0) return Infinity
    return Math.min(...networks.map((n) => NETWORK_CHAR_LIMITS[n]))
  }

  const maxChars = getMaxChars()
  const charCount = content.length

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: 'var(--space-4)',
    }}>
      <Card variant="elevated" style={{
        maxWidth: '800px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        padding: 'var(--space-6)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600' }}>
            {post ? 'Modifier le post' : 'Nouveau post'}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: 'var(--color-text-secondary)',
            }}
          >
            ×
          </button>
        </div>

        {/* Sélection des réseaux */}
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '14px', fontWeight: '500' }}>
            Réseaux sociaux *
          </label>
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            {(Object.keys(NETWORK_LABELS) as SocialNetwork[]).map((network) => (
              <button
                key={network}
                onClick={() => handleNetworkToggle(network)}
                style={{
                  padding: 'var(--space-2) var(--space-4)',
                  border: `2px solid ${networks.includes(network) ? '#3B82F6' : 'var(--color-border-default)'}`,
                  borderRadius: 'var(--radius-md)',
                  background: networks.includes(network) ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                  color: networks.includes(network) ? '#3B82F6' : 'var(--color-text-primary)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: networks.includes(network) ? '600' : '400',
                }}
              >
                {NETWORK_LABELS[network]}
              </button>
            ))}
          </div>
        </div>

        {/* Contenu */}
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '14px', fontWeight: '500' }}>
            Contenu *
            {networks.length > 0 && (
              <span style={{ marginLeft: 'var(--space-2)', color: 'var(--color-text-secondary)', fontWeight: '400' }}>
                (Max {maxChars} caractères)
              </span>
            )}
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            style={{
              width: '100%',
              padding: 'var(--space-3)',
              border: '1px solid var(--color-border-default)',
              borderRadius: 'var(--radius-md)',
              fontSize: '14px',
              fontFamily: 'inherit',
              resize: 'vertical',
              color: charCount > maxChars ? '#EF4444' : 'var(--color-text-primary)',
            }}
            placeholder="Écrivez votre post ici..."
          />
          <div style={{ marginTop: 'var(--space-2)', fontSize: '12px', color: charCount > maxChars ? '#EF4444' : 'var(--color-text-secondary)', textAlign: 'right' }}>
            {charCount} / {maxChars === Infinity ? '∞' : maxChars}
          </div>
        </div>

        {/* Date de planification */}
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '14px', fontWeight: '500' }}>
            Date de publication planifiée
          </label>
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            style={{
              width: '100%',
              padding: 'var(--space-3)',
              border: '1px solid var(--color-border-default)',
              borderRadius: 'var(--radius-md)',
              fontSize: '14px',
            }}
          />
        </div>

        {/* Statut */}
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '14px', fontWeight: '500' }}>
            Statut
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as PostStatus)}
            style={{
              width: '100%',
              padding: 'var(--space-3)',
              border: '1px solid var(--color-border-default)',
              borderRadius: 'var(--radius-md)',
              fontSize: '14px',
            }}
          >
            <option value="draft">Brouillon</option>
            <option value="scheduled">Planifié</option>
            <option value="published">Publié</option>
            <option value="archived">Archivé</option>
          </select>
        </div>

        {/* Médias (simplifié pour l'instant) */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '14px', fontWeight: '500' }}>
            URLs des médias (une par ligne)
          </label>
          <textarea
            value={mediaUrls.join('\n')}
            onChange={(e) => setMediaUrls(e.target.value.split('\n').filter((url) => url.trim()))}
            rows={3}
            style={{
              width: '100%',
              padding: 'var(--space-3)',
              border: '1px solid var(--color-border-default)',
              borderRadius: 'var(--radius-md)',
              fontSize: '14px',
              fontFamily: 'inherit',
            }}
            placeholder="https://example.com/image1.jpg&#10;https://example.com/video1.mp4"
          />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={onClose} disabled={isSaving}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={isSaving || charCount > maxChars}>
            {isSaving ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </Card>
    </div>
  )
}

