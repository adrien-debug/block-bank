'use client'

import { useState, useEffect } from 'react'
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

  useEffect(() => {
    loadSubmissions()
  }, [filterStatus, filterAssetType])

  const loadSubmissions = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (filterStatus) params.append('status', filterStatus)
      if (filterAssetType) params.append('assetType', filterAssetType)

      // Utiliser cache pour éviter les requêtes répétées
      const cacheKey = `submissions-${params.toString()}`
      const cached = sessionStorage.getItem(cacheKey)
      
      if (cached) {
        const cachedData = JSON.parse(cached)
        // Utiliser le cache si moins de 1 minute
        if (Date.now() - cachedData.timestamp < 60 * 1000) {
          setSubmissions(cachedData.submissions)
          setIsLoading(false)
          return
        }
      }

      const response = await fetch(`/api/admin/submissions?${params.toString()}`, {
        cache: 'default',
        headers: {
          'Cache-Control': 'max-age=60' // 1 minute
        }
      })
      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/admin/login')
          return
        }
        throw new Error(data.error || 'Error loading data')
      }

      const submissions = data.submissions || []
      setSubmissions(submissions)
      
      // Mettre en cache
      sessionStorage.setItem(cacheKey, JSON.stringify({
        submissions,
        timestamp: Date.now()
      }))
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
          </p>
        </div>
        <Button variant="secondary" onClick={handleLogout}>
          Logout
        </Button>
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

