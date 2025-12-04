'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import { SocialPost, SocialNetwork, PostStatus } from '@/types/marketing.types'
import PostEditor from './PostEditor'

const NETWORK_LABELS: Record<SocialNetwork, string> = {
  facebook: 'Facebook',
  twitter: 'Twitter/X',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  tiktok: 'TikTok',
  youtube: 'YouTube',
}

const STATUS_LABELS: Record<PostStatus, string> = {
  draft: 'Brouillon',
  scheduled: 'Planifié',
  published: 'Publié',
  archived: 'Archivé',
}

const STATUS_COLORS: Record<PostStatus, string> = {
  draft: '#6B7280',
  scheduled: '#F59E0B',
  published: '#10B981',
  archived: '#9CA3AF',
}

export default function SocialPostsManager() {
  const [posts, setPosts] = useState<SocialPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showEditor, setShowEditor] = useState(false)
  const [editingPost, setEditingPost] = useState<SocialPost | null>(null)
  const [filterNetwork, setFilterNetwork] = useState<string>('')
  const [filterStatus, setFilterStatus] = useState<string>('')

  useEffect(() => {
    loadPosts()
  }, [filterNetwork, filterStatus])

  const loadPosts = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (filterNetwork) params.append('network', filterNetwork)
      if (filterStatus) params.append('status', filterStatus)

      const response = await fetch(`/api/admin/marketing/posts?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setPosts(data.posts || [])
      }
    } catch (error) {
      console.error('Error loading posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingPost(null)
    setShowEditor(true)
  }

  const handleEdit = (post: SocialPost) => {
    setEditingPost(post)
    setShowEditor(true)
  }

  const handleDelete = async (postId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce post ?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/marketing/posts/${postId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        loadPosts()
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Erreur lors de la suppression')
    }
  }

  const handleEditorClose = () => {
    setShowEditor(false)
    setEditingPost(null)
    loadPosts()
  }

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Non planifié'
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600' }}>Posts Réseaux Sociaux</h2>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <Button onClick={handleCreate} variant="secondary">
            + Nouveau Post
          </Button>
          <Button 
            onClick={() => window.location.href = '/admin/marketing?tab=generator'} 
            variant="primary"
          >
            ✨ Générer automatiquement
          </Button>
        </div>
      </div>

      {/* Filtres */}
      <div className="chart-card-premium admin-card" style={{ marginBottom: 'var(--space-4)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '14px', fontWeight: '500' }}>
              Réseau
            </label>
            <select
              value={filterNetwork}
              onChange={(e) => setFilterNetwork(e.target.value)}
              style={{
                padding: 'var(--space-2) var(--space-3)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                minWidth: '150px',
              }}
            >
              <option value="">Tous</option>
              {Object.entries(NETWORK_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '14px', fontWeight: '500' }}>
              Statut
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                padding: 'var(--space-2) var(--space-3)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                minWidth: '150px',
              }}
            >
              <option value="">Tous</option>
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Liste des posts */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
          <p>Chargement...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="chart-card-premium admin-card" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
          <p className="admin-card-text">Aucun post trouvé</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {posts.map((post) => (
            <div key={post.id} className="chart-card-premium admin-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                    <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                      {post.networks.map((network) => (
                        <span
                          key={network}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '500',
                            background: 'rgba(59, 130, 246, 0.1)',
                            color: '#3B82F6',
                          }}
                        >
                          {NETWORK_LABELS[network]}
                        </span>
                      ))}
                    </div>
                    <span
                      style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        background: `${STATUS_COLORS[post.status]}20`,
                        color: STATUS_COLORS[post.status],
                      }}
                    >
                      {STATUS_LABELS[post.status]}
                    </span>
                  </div>
                  <p style={{ marginBottom: 'var(--space-2)', color: 'var(--color-text-primary)' }}>
                    {post.content.substring(0, 200)}{post.content.length > 200 ? '...' : ''}
                  </p>
                  <div style={{ display: 'flex', gap: 'var(--space-4)', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                    <span>Planifié: {formatDate(post.scheduledAt || null)}</span>
                    {post.publishedAt && <span>Publié: {formatDate(post.publishedAt || null)}</span>}
                    {post.mediaUrls.length > 0 && <span>{post.mediaUrls.length} média(s)</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <Button variant="secondary" size="small" onClick={() => handleEdit(post)}>
                    Modifier
                  </Button>
                  <Button variant="secondary" size="small" onClick={() => handleDelete(post.id)}>
                    Supprimer
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showEditor && (
        <PostEditor
          post={editingPost}
          onClose={handleEditorClose}
        />
      )}
    </div>
  )
}

