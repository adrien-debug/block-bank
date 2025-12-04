'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { ContentSection } from '@/types/marketing.types'

const TYPE_LABELS: Record<ContentSection['type'], string> = {
  cta: 'Call-to-Action',
  promotion: 'Promotion',
  announcement: 'Annonce',
  custom: 'Personnalisé',
}

export default function ContentSections() {
  const [sections, setSections] = useState<ContentSection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showEditor, setShowEditor] = useState(false)
  const [editingSection, setEditingSection] = useState<ContentSection | null>(null)

  useEffect(() => {
    loadSections()
  }, [])

  const loadSections = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/marketing/sections')
      const data = await response.json()

      if (data.success) {
        setSections(data.sections || [])
      }
    } catch (error) {
      console.error('Error loading sections:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingSection(null)
    setShowEditor(true)
  }

  const handleEdit = (section: ContentSection) => {
    setEditingSection(section)
    setShowEditor(true)
  }

  const handleDelete = async (sectionId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette section ?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/marketing/sections/${sectionId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        loadSections()
      }
    } catch (error) {
      console.error('Error deleting section:', error)
      alert('Erreur lors de la suppression')
    }
  }

  const handleEditorClose = () => {
    setShowEditor(false)
    setEditingSection(null)
    loadSections()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600' }}>Sections de Contenu</h2>
        <Button onClick={handleCreate} variant="primary">
          + Nouvelle Section
        </Button>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
          <p>Chargement...</p>
        </div>
      ) : sections.length === 0 ? (
        <Card variant="elevated" style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-secondary)' }}>Aucune section trouvée</p>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
          {sections.map((section) => (
            <Card key={section.id} variant="elevated" style={{ padding: 'var(--space-4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>{section.name}</h3>
                <span
                  style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '500',
                    background: 'rgba(59, 130, 246, 0.1)',
                    color: '#3B82F6',
                  }}
                >
                  {TYPE_LABELS[section.type]}
                </span>
              </div>
              {section.previewImage && (
                <div style={{ marginBottom: 'var(--space-3)', borderRadius: '6px', overflow: 'hidden' }}>
                  <img
                    src={section.previewImage}
                    alt={section.name}
                    style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                  />
                </div>
              )}
              <div
                style={{
                  padding: 'var(--space-3)',
                  background: 'var(--color-bg-secondary)',
                  borderRadius: '6px',
                  marginBottom: 'var(--space-3)',
                  fontSize: '14px',
                  color: 'var(--color-text-secondary)',
                  maxHeight: '100px',
                  overflow: 'auto',
                }}
                dangerouslySetInnerHTML={{ __html: section.content.substring(0, 200) + '...' }}
              />
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <Button variant="secondary" size="small" onClick={() => handleEdit(section)}>
                  Modifier
                </Button>
                <Button variant="secondary" size="small" onClick={() => handleDelete(section.id)}>
                  Supprimer
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showEditor && (
        <SectionEditor
          section={editingSection}
          onClose={handleEditorClose}
        />
      )}
    </div>
  )
}

function SectionEditor({ section, onClose }: { section: ContentSection | null; onClose: () => void }) {
  const [name, setName] = useState('')
  const [type, setType] = useState<ContentSection['type']>('custom')
  const [content, setContent] = useState('')
  const [template, setTemplate] = useState('')
  const [previewImage, setPreviewImage] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (section) {
      setName(section.name)
      setType(section.type)
      setContent(section.content)
      setTemplate(section.template)
      setPreviewImage(section.previewImage || '')
    }
  }, [section])

  const handleSave = async () => {
    if (!name || !content || !template) {
      alert('Nom, contenu et template sont requis')
      return
    }

    setIsSaving(true)
    try {
      const payload = {
        name,
        type,
        content,
        template,
        previewImage: previewImage || null,
      }

      const url = section ? `/api/admin/marketing/sections/${section.id}` : '/api/admin/marketing/sections'
      const method = section ? 'PATCH' : 'POST'

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
      console.error('Error saving section:', error)
      alert('Erreur lors de la sauvegarde')
    } finally {
      setIsSaving(false)
    }
  }

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
            {section ? 'Modifier la section' : 'Nouvelle section'}
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '14px', fontWeight: '500' }}>
              Nom *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                padding: 'var(--space-3)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '14px', fontWeight: '500' }}>
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ContentSection['type'])}
              style={{
                width: '100%',
                padding: 'var(--space-3)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
              }}
            >
              <option value="cta">Call-to-Action</option>
              <option value="promotion">Promotion</option>
              <option value="announcement">Annonce</option>
              <option value="custom">Personnalisé</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '14px', fontWeight: '500' }}>
              Contenu HTML *
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
                fontFamily: 'monospace',
              }}
              placeholder="<div>Contenu HTML...</div>"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '14px', fontWeight: '500' }}>
              Template (code réutilisable) *
            </label>
            <textarea
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              rows={6}
              style={{
                width: '100%',
                padding: 'var(--space-3)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                fontFamily: 'monospace',
              }}
              placeholder="Template réutilisable..."
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '14px', fontWeight: '500' }}>
              URL de l'image de prévisualisation
            </label>
            <input
              type="url"
              value={previewImage}
              onChange={(e) => setPreviewImage(e.target.value)}
              style={{
                width: '100%',
                padding: 'var(--space-3)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
              }}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', marginTop: 'var(--space-6)' }}>
          <Button variant="secondary" onClick={onClose} disabled={isSaving}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </Card>
    </div>
  )
}

