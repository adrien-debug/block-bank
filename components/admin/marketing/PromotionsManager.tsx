'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Promotion, CampaignStatus } from '@/types/marketing.types'

const STATUS_LABELS: Record<CampaignStatus, string> = {
  planned: 'Planifié',
  active: 'Actif',
  paused: 'En pause',
  completed: 'Terminé',
}

const STATUS_COLORS: Record<CampaignStatus, string> = {
  planned: '#F59E0B',
  active: '#10B981',
  paused: '#EF4444',
  completed: '#6B7280',
}

export default function PromotionsManager() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showEditor, setShowEditor] = useState(false)
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null)

  useEffect(() => {
    loadPromotions()
  }, [])

  const loadPromotions = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/marketing/promotions')
      const data = await response.json()

      if (data.success) {
        setPromotions(data.promotions || [])
      }
    } catch (error) {
      console.error('Error loading promotions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingPromotion(null)
    setShowEditor(true)
  }

  const handleEdit = (promotion: Promotion) => {
    setEditingPromotion(promotion)
    setShowEditor(true)
  }

  const handleDelete = async (promotionId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette promotion ?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/marketing/promotions/${promotionId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        loadPromotions()
      }
    } catch (error) {
      console.error('Error deleting promotion:', error)
      alert('Erreur lors de la suppression')
    }
  }

  const handleEditorClose = () => {
    setShowEditor(false)
    setEditingPromotion(null)
    loadPromotions()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(amount)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600' }}>Promotions</h2>
        <Button onClick={handleCreate} variant="primary">
          + Nouvelle Promotion
        </Button>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
          <p>Chargement...</p>
        </div>
      ) : promotions.length === 0 ? (
        <Card variant="elevated" style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-secondary)' }}>Aucune promotion trouvée</p>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 'var(--space-4)' }}>
          {promotions.map((promotion) => (
            <Card key={promotion.id} variant="elevated" style={{ padding: 'var(--space-4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>{promotion.name}</h3>
                <span
                  style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500',
                    background: `${STATUS_COLORS[promotion.status]}20`,
                    color: STATUS_COLORS[promotion.status],
                  }}
                >
                  {STATUS_LABELS[promotion.status]}
                </span>
              </div>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)', fontSize: '14px' }}>
                {promotion.description}
              </p>
              <div style={{ marginBottom: 'var(--space-3)', fontSize: '14px', color: 'var(--color-text-primary)' }}>
                <div><strong>Budget:</strong> {formatCurrency(promotion.budget, promotion.currency)}</div>
                <div><strong>Période:</strong> {formatDate(promotion.startDate)} - {formatDate(promotion.endDate)}</div>
                {promotion.targetAudience && (
                  <div><strong>Cible:</strong> {promotion.targetAudience}</div>
                )}
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <Button variant="secondary" size="small" onClick={() => handleEdit(promotion)}>
                  Modifier
                </Button>
                <Button variant="secondary" size="small" onClick={() => handleDelete(promotion.id)}>
                  Supprimer
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showEditor && (
        <PromotionEditor
          promotion={editingPromotion}
          onClose={handleEditorClose}
        />
      )}
    </div>
  )
}

function PromotionEditor({ promotion, onClose }: { promotion: Promotion | null; onClose: () => void }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [budget, setBudget] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [targetAudience, setTargetAudience] = useState('')
  const [status, setStatus] = useState<CampaignStatus>('planned')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (promotion) {
      setName(promotion.name)
      setDescription(promotion.description)
      setStartDate(new Date(promotion.startDate).toISOString().slice(0, 10))
      setEndDate(new Date(promotion.endDate).toISOString().slice(0, 10))
      setBudget(promotion.budget.toString())
      setCurrency(promotion.currency)
      setTargetAudience(promotion.targetAudience || '')
      setStatus(promotion.status)
    }
  }, [promotion])

  const handleSave = async () => {
    if (!name || !startDate || !endDate || !budget) {
      alert('Tous les champs requis doivent être remplis')
      return
    }

    setIsSaving(true)
    try {
      const payload = {
        name,
        description,
        startDate,
        endDate,
        budget: parseFloat(budget),
        currency,
        targetAudience: targetAudience || null,
        status,
      }

      const url = promotion ? `/api/admin/marketing/promotions/${promotion.id}` : '/api/admin/marketing/promotions'
      const method = promotion ? 'PATCH' : 'POST'

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
      console.error('Error saving promotion:', error)
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
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        padding: 'var(--space-6)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600' }}>
            {promotion ? 'Modifier la promotion' : 'Nouvelle promotion'}
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
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              style={{
                width: '100%',
                padding: 'var(--space-3)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                fontFamily: 'inherit',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div>
              <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '14px', fontWeight: '500' }}>
                Date de début *
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
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
                Date de fin *
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: 'var(--space-3)',
                  border: '1px solid var(--color-border-default)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '14px',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-4)' }}>
            <div>
              <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '14px', fontWeight: '500' }}>
                Budget *
              </label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                min="0"
                step="0.01"
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
                Devise
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                style={{
                  width: '100%',
                  padding: 'var(--space-3)',
                  border: '1px solid var(--color-border-default)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '14px',
                }}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="CHF">CHF</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '14px', fontWeight: '500' }}>
              Public cible
            </label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
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
              Statut
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as CampaignStatus)}
              style={{
                width: '100%',
                padding: 'var(--space-3)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
              }}
            >
              <option value="planned">Planifié</option>
              <option value="active">Actif</option>
              <option value="paused">En pause</option>
              <option value="completed">Terminé</option>
            </select>
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

