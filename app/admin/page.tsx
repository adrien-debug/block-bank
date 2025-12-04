'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { SubmissionMetadata } from '@/types/submission.types'

export default function AdminDashboardPage() {
  const router = useRouter()
  const [submissions, setSubmissions] = useState<SubmissionMetadata[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [filterAssetType, setFilterAssetType] = useState<string>('')
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    loadSubmissions()
    
    // Rafraîchissement automatique toutes les 30 secondes pour voir les nouvelles soumissions
    refreshIntervalRef.current = setInterval(() => {
      loadSubmissions(true) // Force le rafraîchissement
    }, 30000)

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }
    }
  }, [filterStatus, filterAssetType])

  const loadSubmissions = async (forceRefresh: boolean = false) => {
    setIsLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (filterStatus) params.append('status', filterStatus)
      if (filterAssetType) params.append('assetType', filterAssetType)
      
      // Ajouter un timestamp unique pour éviter tout cache HTTP
      params.append('_t', Date.now().toString())

      // En production, désactiver complètement le cache sessionStorage
      const cacheKey = `submissions-${params.toString()}`
      
      // Ne pas utiliser le cache si forceRefresh est activé
      // En production, on désactive toujours le cache pour voir les nouvelles soumissions immédiatement
      const isProduction = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
      
      if (!forceRefresh && !isProduction && typeof window !== 'undefined') {
        const cached = sessionStorage.getItem(cacheKey)
        if (cached) {
          const cachedData = JSON.parse(cached)
          // Cache réduit à 5 secondes seulement en développement
          if (Date.now() - cachedData.timestamp < 5 * 1000) {
            setSubmissions(cachedData.submissions)
            setIsLoading(false)
            return
          }
        }
      }

      // Supprimer le cache avant la requête pour forcer le rafraîchissement
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(cacheKey)
      }

      console.log('[Admin Page] Chargement des soumissions depuis:', `/api/admin/submissions?${params.toString()}`)
      const response = await fetch(`/api/admin/submissions?${params.toString()}`, {
        cache: 'no-store', // Pas de cache HTTP
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
      
      console.log('[Admin Page] Réponse reçue:', {
        status: response.status,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      })
      
      const data = await response.json()
      console.log('[Admin Page] Données reçues:', {
        success: data.success,
        total: data.total,
        submissionsCount: data.submissions?.length || 0,
        timestamp: data.timestamp,
        firstSubmission: data.submissions?.[0] ? {
          id: data.submissions[0].id,
          status: data.submissions[0].status,
          userType: data.submissions[0].userType
        } : null
      })

      if (!response.ok) {
        if (response.status === 401) {
          console.log('[Admin Page] ❌ Non autorisé, redirection vers login')
          router.push('/admin/login')
          return
        }
        throw new Error(data.error || 'Error loading data')
      }

      const submissions = data.submissions || []
      console.log(`[Admin Page] ✅ ${submissions.length} soumission(s) chargée(s)`)
      
      // Log détaillé pour debug
      if (submissions.length > 0) {
        console.log('[Admin Page] Détails des soumissions chargées:')
        submissions.slice(0, 5).forEach((sub, index) => {
          console.log(`  [${index + 1}] ID: ${sub.id}, Status: ${sub.status}, Type: ${sub.assetType}, Date: ${sub.submittedAt}`)
        })
        
        // Vérifier les statuts
        const statusCounts = submissions.reduce((acc: Record<string, number>, sub) => {
          acc[sub.status] = (acc[sub.status] || 0) + 1
          return acc
        }, {})
        console.log('[Admin Page] Répartition par statut:', statusCounts)
      } else {
        console.warn('[Admin Page] ⚠️ Aucune soumission chargée - vérifier les logs serveur')
      }
      
      setSubmissions(submissions)
      
      // Mettre en cache uniquement en développement (pas en production)
      if (typeof window !== 'undefined' && !isProduction) {
        sessionStorage.setItem(cacheKey, JSON.stringify({
          submissions,
          timestamp: Date.now()
        }))
      }
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'logout' }),
      })
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      new: '#3B82F6',
      'in-review': '#F59E0B',
      approved: '#10B981',
      rejected: '#EF4444',
      processed: '#6B7280',
    }

    const labels: Record<string, string> = {
      new: 'New',
      'in-review': 'In Review',
      approved: 'Approved',
      rejected: 'Rejected',
      processed: 'Processed',
    }

    return (
      <span style={{
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '500',
        background: `${colors[status]}20`,
        color: colors[status],
      }}>
        {labels[status] || status}
      </span>
    )
  }

  return (
    <div className="dashboard-overview">
      <div className="dashboard-header" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 'var(--space-6)'
      }}>
        <div>
          <h1>Admin Dashboard</h1>
          <p style={{ marginTop: '8px', color: 'var(--color-text-secondary)', fontSize: '16px' }}>
            Tokenization request management
            {submissions.length > 0 && (
              <span style={{ marginLeft: '12px', fontWeight: '600', color: 'var(--color-text-primary)' }}>
                ({submissions.length} {submissions.length === 1 ? 'request' : 'requests'})
              </span>
            )}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <Button 
            variant="secondary" 
            onClick={() => {
              // Invalider le cache et recharger
              if (typeof window !== 'undefined') {
                sessionStorage.clear()
              }
              loadSubmissions(true)
            }}
            style={{ minWidth: 'auto' }}
          >
            🔄 Refresh
          </Button>
          <Button variant="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      {/* Filtres */}
      <Card variant="elevated" style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-4)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '14px', fontWeight: '500' }}>
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                padding: 'var(--space-2) var(--space-3)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
              }}
            >
              <option value="">All</option>
              <option value="new">New</option>
              <option value="in-review">In Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="processed">Processed</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '14px', fontWeight: '500' }}>
              Asset Type
            </label>
            <select
              value={filterAssetType}
              onChange={(e) => setFilterAssetType(e.target.value)}
              style={{
                padding: 'var(--space-2) var(--space-3)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
              }}
            >
              <option value="">All</option>
              <option value="real-estate">Real Estate</option>
              <option value="vehicle">Vehicle</option>
              <option value="luxury">Luxury</option>
              <option value="collectible">Collectible</option>
              <option value="mining">Mining</option>
              <option value="infrastructure">Infrastructure</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Liste des soumissions */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
          <p>Loading...</p>
        </div>
      ) : error ? (
        <Card variant="elevated" style={{ padding: 'var(--space-4)', background: 'rgba(239, 68, 68, 0.1)' }}>
          <p style={{ color: '#DC2626' }}>{error}</p>
        </Card>
      ) : submissions.length === 0 ? (
        <Card variant="elevated" style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-secondary)' }}>No submissions found</p>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {submissions.map((submission) => (
            <Card
              key={submission.id}
              variant="elevated"
              style={{ padding: 'var(--space-4)', cursor: 'pointer' }}
              onClick={() => router.push(`/admin/submissions/${submission.id}`)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600' }}>
                      {submission.userType === 'individual' 
                        ? submission.ownerName || 'Individual'
                        : submission.companyName || 'Company'}
                    </h3>
                    {getStatusBadge(submission.status)}
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-4)', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                    <span>Type: {submission.assetType}</span>
                    <span>Value: {submission.estimatedValue} USDC</span>
                    <span>Location: {submission.location}</span>
                    <span>{formatDate(submission.submittedAt)}</span>
                  </div>
                </div>
                <Button variant="secondary" onClick={(e) => {
                  e?.stopPropagation()
                  router.push(`/admin/submissions/${submission.id}`)
                }}>
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

