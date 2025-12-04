'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { AdWordsCampaign, CampaignStatus } from '@/types/marketing.types'

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

export default function AdWordsManager() {
  const [campaigns, setCampaigns] = useState<AdWordsCampaign[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showEditor, setShowEditor] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState<AdWordsCampaign | null>(null)

  useEffect(() => {
    loadCampaigns()
  }, [])

  const loadCampaigns = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/marketing/adwords')
      const data = await response.json()

      if (data.success) {
        setCampaigns(data.campaigns || [])
      }
    } catch (error) {
      console.error('Error loading campaigns:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingCampaign(null)
    setShowEditor(true)
  }

  const handleEdit = (campaign: AdWordsCampaign) => {
    setEditingCampaign(campaign)
    setShowEditor(true)
  }

  const handleDelete = async (campaignId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette campagne ?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/marketing/adwords/${campaignId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        loadCampaigns()
      }
    } catch (error) {
      console.error('Error deleting campaign:', error)
      alert('Erreur lors de la suppression')
    }
  }

  const handleEditorClose = () => {
    setShowEditor(false)
    setEditingCampaign(null)
    loadCampaigns()
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Non défini'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatCurrency = (amount: number | null | undefined, currency: string) => {
    if (amount === null || amount === undefined) return 'Non défini'
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600' }}>Campagnes Google AdWords</h2>
        <Button onClick={handleCreate} variant="primary">
          + Nouvelle Campagne
        </Button>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
          <p>Chargement...</p>
        </div>
      ) : campaigns.length === 0 ? (
        <Card variant="elevated" style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-secondary)' }}>Aucune campagne trouvée</p>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {campaigns.map((campaign) => (
            <Card key={campaign.id} variant="elevated" style={{ padding: 'var(--space-4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: 'var(--space-2)' }}>{campaign.name}</h3>
                  {campaign.description && (
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)', fontSize: '14px' }}>
                      {campaign.description}
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', fontSize: '14px', color: 'var(--color-text-primary)' }}>
                    <div><strong>Budget journalier:</strong> {formatCurrency(campaign.dailyBudget, campaign.currency)}</div>
                    <div><strong>Budget total:</strong> {formatCurrency(campaign.totalBudget, campaign.currency)}</div>
                    <div><strong>Début:</strong> {formatDate(campaign.startDate)}</div>
                    {campaign.endDate && <div><strong>Fin:</strong> {formatDate(campaign.endDate)}</div>}
                  </div>
                  <div style={{ marginTop: 'var(--space-3)' }}>
                    <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: 'var(--space-2)' }}>Mots-clés:</div>
                    <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                      {campaign.keywords.map((keyword, index) => (
                        <span
                          key={index}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            background: 'rgba(59, 130, 246, 0.1)',
                            color: '#3B82F6',
                          }}
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', alignItems: 'flex-end' }}>
                  <span
                    style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      background: `${STATUS_COLORS[campaign.status]}20`,
                      color: STATUS_COLORS[campaign.status],
                    }}
                  >
                    {STATUS_LABELS[campaign.status]}
                  </span>
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <Button variant="secondary" size="small" onClick={() => handleEdit(campaign)}>
                      Modifier
                    </Button>
                    <Button variant="secondary" size="small" onClick={() => handleDelete(campaign.id)}>
                      Supprimer
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showEditor && (
        <AdWordsEditor
          campaign={editingCampaign}
          onClose={handleEditorClose}
        />
      )}
    </div>
  )
}

function AdWordsEditor({ campaign, onClose }: { campaign: AdWordsCampaign | null; onClose: () => void }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [dailyBudget, setDailyBudget] = useState('')
  const [totalBudget, setTotalBudget] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [keywords, setKeywords] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [status, setStatus] = useState<CampaignStatus>('planned')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (campaign) {
      setName(campaign.name)
      setDescription(campaign.description || '')
      setDailyBudget(campaign.dailyBudget?.toString() || '')
      setTotalBudget(campaign.totalBudget?.toString() || '')
      setCurrency(campaign.currency)
      setKeywords(campaign.keywords.join('\n'))
      setStartDate(new Date(campaign.startDate).toISOString().slice(0, 10))
      setEndDate(campaign.endDate ? new Date(campaign.endDate).toISOString().slice(0, 10) : '')
      setStatus(campaign.status)
    }
  }, [campaign])

  const handleSave = async () => {
    if (!name || !startDate || !keywords.trim()) {
      alert('Nom, date de début et mots-clés sont requis')
      return
    }

    setIsSaving(true)
    try {
      const payload = {
        name,
        description: description || null,
        dailyBudget: dailyBudget ? parseFloat(dailyBudget) : null,
        totalBudget: totalBudget ? parseFloat(totalBudget) : null,
        currency,
        keywords: keywords.split('\n').map(k => k.trim()).filter(k => k),
        startDate,
        endDate: endDate || null,
        status,
      }

      const url = campaign ? `/api/admin/marketing/adwords/${campaign.id}` : '/api/admin/marketing/adwords'
      const method = campaign ? 'PATCH' : 'POST'

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
      console.error('Error saving campaign:', error)
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
        maxWidth: '700px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        padding: 'var(--space-6)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600' }}>
            {campaign ? 'Modifier la campagne' : 'Nouvelle campagne'}
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
              rows={3}
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-4)' }}>
            <div>
              <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '14px', fontWeight: '500' }}>
                Budget journalier
              </label>
              <input
                type="number"
                value={dailyBudget}
                onChange={(e) => setDailyBudget(e.target.value)}
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
                Budget total
              </label>
              <input
                type="number"
                value={totalBudget}
                onChange={(e) => setTotalBudget(e.target.value)}
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
              Mots-clés * (un par ligne)
            </label>
            <textarea
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              rows={5}
              style={{
                width: '100%',
                padding: 'var(--space-3)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                fontFamily: 'inherit',
              }}
              placeholder="mot-clé 1&#10;mot-clé 2&#10;mot-clé 3"
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
                Date de fin
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

