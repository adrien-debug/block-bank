'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import { AssetSubmission } from '@/types/submission.types'

function SubmissionDocuments({ submissionId, documents }: { submissionId: string; documents: AssetSubmission['documents'] }) {
  const [files, setFiles] = useState<Array<{ name: string; path: string; type: string; size: number; documentType: string; url: string | null }>>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadFiles()
  }, [submissionId])

  const loadFiles = async () => {
    setIsLoading(true)
    try {
      // Cache réduit pour les fichiers
      const cacheKey = `files-${submissionId}`
      const cached = sessionStorage.getItem(cacheKey)
      
      if (cached) {
        const cachedData = JSON.parse(cached)
        // Utiliser le cache si moins de 30 secondes
        if (Date.now() - cachedData.timestamp < 30 * 1000) {
          setFiles(cachedData.files)
          setIsLoading(false)
          return
        }
      }

      const response = await fetch(`/api/admin/submissions/${submissionId}/files`, {
        cache: 'no-store', // Pas de cache HTTP
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
      const data = await response.json()

      if (response.ok && data.files) {
        setFiles(data.files)
        // Mettre en cache
        sessionStorage.setItem(cacheKey, JSON.stringify({
          files: data.files,
          timestamp: Date.now()
        }))
      }
    } catch (error) {
      console.error('Error loading files:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getFileUrl = (file: { path: string; url: string | null }) => {
    // Si on a une URL directe depuis Supabase, l'utiliser
    if (file.url) {
      return file.url
    }
    // Sinon, utiliser l'API route
    const segments = file.path.split('/').map(seg => encodeURIComponent(seg))
    return `/api/admin/submissions/${submissionId}/files/${segments.join('/')}`
  }

  if (isLoading) {
    return <p className="admin-card-text">Loading documents...</p>
  }

  if (files.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <p className="admin-card-text">
          No documents found for this submission.
        </p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {files.length > 0 && (
        <div style={{ 
          padding: 'var(--space-3)', 
          background: 'var(--color-bg-secondary, rgba(59, 130, 246, 0.1))', 
          borderRadius: 'var(--radius-md)',
          marginBottom: 'var(--space-2)'
        }}>
          <p className="admin-card-text" style={{ margin: 0 }}>
            📄 {files.length} document{files.length > 1 ? 's' : ''} disponible{files.length > 1 ? 's' : ''}
          </p>
        </div>
      )}
      <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
        {files.map((file, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 'var(--space-3)',
              border: '1px solid var(--color-border-default)',
              borderRadius: 'var(--radius-md)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--color-bg-secondary, rgba(0, 0, 0, 0.02))'
              e.currentTarget.style.borderColor = 'var(--color-primary-500, #3B82F6)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderColor = 'var(--color-border-default)'
            }}
          >
            <div style={{ flex: 1 }}>
              <p className="admin-card-text" style={{ fontWeight: '500', marginBottom: '4px' }}>{file.name}</p>
              <p className="admin-card-text" style={{ fontSize: '12px' }}>
                {file.type.toUpperCase()} • {formatFileSize(file.size)}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <Button
                variant="secondary"
                onClick={() => {
                  window.open(getFileUrl(file), '_blank')
                }}
              >
                View
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  const link = document.createElement('a')
                  link.href = getFileUrl(file)
                  link.download = file.name
                  document.body.appendChild(link)
                  link.click()
                  document.body.removeChild(link)
                }}
              >
                Download
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function SubmissionDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [submission, setSubmission] = useState<AssetSubmission | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadSubmission()
  }, [params.id])

  const loadSubmission = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Cache réduit pour voir les mises à jour rapidement
      const cacheKey = `submission-${params.id}`
      const cached = sessionStorage.getItem(cacheKey)
      
      if (cached) {
        const cachedData = JSON.parse(cached)
        // Utiliser le cache si moins de 10 secondes
        if (Date.now() - cachedData.timestamp < 10 * 1000) {
          setSubmission(cachedData.submission)
          setIsLoading(false)
          return
        }
      }

      const response = await fetch(`/api/admin/submissions/${params.id}`, {
        cache: 'no-store', // Pas de cache HTTP
        headers: {
          'Cache-Control': 'no-cache'
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

      setSubmission(data.submission)
      // Mettre en cache
      sessionStorage.setItem(cacheKey, JSON.stringify({
        submission: data.submission,
        timestamp: Date.now()
      }))
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
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

  if (isLoading) {
    return (
      <div className="admin-page-container dashboard-overview">
        <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
          <p className="admin-card-text">Loading...</p>
        </div>
      </div>
    )
  }

  if (error || !submission) {
    return (
      <div className="admin-page-container dashboard-overview">
        <div className="chart-card-premium admin-card" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
          <p style={{ color: '#DC2626' }}>{error || 'Submission not found'}</p>
          <Button variant="secondary" onClick={() => router.push('/admin/submissions')} style={{ marginTop: 'var(--space-4)' }}>
            Back to List
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page-container dashboard-overview">
      <div className="admin-page-header dashboard-header admin-dashboard-header">
        <div>
          <Button variant="secondary" onClick={() => router.push('/admin/submissions')} style={{ marginBottom: 'var(--space-4)' }}>
            ← Back
          </Button>
          <h1 className="admin-page-title">Submission Details</h1>
          <p className="admin-page-description">
            ID: {submission.id}
          </p>
        </div>
        <div className="admin-header-controls">
          {/* Contrôles optionnels */}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {/* Informations générales */}
        <div className="chart-card-premium admin-card">
          <div className="chart-header-premium">
            <h3 className="admin-card-title">General Information</h3>
          </div>
          <div style={{ padding: 'var(--space-5)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div>
              <p className="admin-card-label" style={{ marginBottom: '4px', fontSize: '12px' }}>Submission Date</p>
              <p className="admin-card-text" style={{ fontWeight: '500' }}>{formatDate(submission.submittedAt)}</p>
            </div>
            <div>
              <p className="admin-card-label" style={{ marginBottom: '4px', fontSize: '12px' }}>Status</p>
              <p className="admin-card-text" style={{ fontWeight: '500' }}>{submission.status}</p>
            </div>
            <div>
              <p className="admin-card-label" style={{ marginBottom: '4px', fontSize: '12px' }}>User Type</p>
              <p className="admin-card-text" style={{ fontWeight: '500' }}>{submission.userType === 'individual' ? 'Individual' : 'Company'}</p>
            </div>
            <div>
              <p className="admin-card-label" style={{ marginBottom: '4px', fontSize: '12px' }}>Asset Type</p>
              <p className="admin-card-text" style={{ fontWeight: '500' }}>{submission.assetType} {submission.customAssetType && `(${submission.customAssetType})`}</p>
            </div>
          </div>
          </div>
        </div>

        {/* Informations utilisateur */}
        <div className="chart-card-premium admin-card">
          <div className="chart-header-premium">
            <h3 className="admin-card-title">
              {submission.userType === 'individual' ? 'Personal Information' : 'Company Information'}
            </h3>
          </div>
          <div style={{ padding: 'var(--space-5)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            {submission.userType === 'individual' ? (
              <>
                <div>
                  <p className="admin-card-label" style={{ marginBottom: '4px', fontSize: '12px' }}>Name</p>
                  <p className="admin-card-text" style={{ fontWeight: '500' }}>{submission.ownerName}</p>
                </div>
                <div>
                  <p className="admin-card-label" style={{ marginBottom: '4px', fontSize: '12px' }}>Email</p>
                  <p className="admin-card-text" style={{ fontWeight: '500' }}>{submission.ownerEmail}</p>
                </div>
                {submission.ownerPhone && (
                  <div>
                    <p className="admin-card-label" style={{ marginBottom: '4px', fontSize: '12px' }}>Phone</p>
                    <p className="admin-card-text" style={{ fontWeight: '500' }}>{submission.ownerPhone}</p>
                  </div>
                )}
              </>
            ) : (
              <>
                <div>
                  <p className="admin-card-label" style={{ marginBottom: '4px', fontSize: '12px' }}>Company Name</p>
                  <p className="admin-card-text" style={{ fontWeight: '500' }}>{submission.companyName}</p>
                </div>
                <div>
                  <p className="admin-card-label" style={{ marginBottom: '4px', fontSize: '12px' }}>Email</p>
                  <p className="admin-card-text" style={{ fontWeight: '500' }}>{submission.companyEmail}</p>
                </div>
                <div>
                  <p className="admin-card-label" style={{ marginBottom: '4px', fontSize: '12px' }}>Contact Person</p>
                  <p className="admin-card-text" style={{ fontWeight: '500' }}>{submission.contactPersonName}</p>
                </div>
                {submission.companyPhone && (
                  <div>
                    <p className="admin-card-label" style={{ marginBottom: '4px', fontSize: '12px' }}>Phone</p>
                    <p className="admin-card-text" style={{ fontWeight: '500' }}>{submission.companyPhone}</p>
                  </div>
                )}
                {submission.companyRegistration && (
                  <div>
                    <p className="admin-card-label" style={{ marginBottom: '4px', fontSize: '12px' }}>Registration (SIRET / RCS)</p>
                    <p className="admin-card-text" style={{ fontWeight: '500' }}>{submission.companyRegistration}</p>
                  </div>
                )}
              </>
            )}
          </div>
          </div>
        </div>

        {/* Informations actif */}
        <div className="chart-card-premium admin-card">
          <div className="chart-header-premium">
            <h3 className="admin-card-title">Asset Information</h3>
          </div>
          <div style={{ padding: 'var(--space-5)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div>
              <p className="admin-card-label" style={{ marginBottom: '4px', fontSize: '12px' }}>Estimated Value</p>
              <p className="admin-card-text" style={{ fontWeight: '500', fontSize: '18px' }}>{submission.estimatedValue} USDC</p>
            </div>
            <div>
              <p className="admin-card-label" style={{ marginBottom: '4px', fontSize: '12px' }}>Location</p>
              <p className="admin-card-text" style={{ fontWeight: '500' }}>{submission.location}</p>
            </div>
            {submission.assetLink && (
              <div>
                <p className="admin-card-label" style={{ marginBottom: '4px', fontSize: '12px' }}>Asset Link</p>
                <a href={submission.assetLink} target="_blank" rel="noopener noreferrer" className="admin-card-text" style={{ color: 'var(--color-primary-500)', textDecoration: 'underline' }}>
                  {submission.assetLink}
                </a>
              </div>
            )}
            <div>
              <p className="admin-card-label" style={{ marginBottom: '4px', fontSize: '12px' }}>Description</p>
              <p className="admin-card-text" style={{ fontWeight: '500', whiteSpace: 'pre-wrap' }}>{submission.assetDescription}</p>
            </div>
            {submission.additionalInfo && (
              <div>
                <p className="admin-card-label" style={{ marginBottom: '4px', fontSize: '12px' }}>Additional Information</p>
                <p className="admin-card-text" style={{ fontWeight: '500', whiteSpace: 'pre-wrap' }}>{submission.additionalInfo}</p>
              </div>
            )}
          </div>
          </div>
        </div>

        {/* Documents */}
        <div className="chart-card-premium admin-card">
          <div className="chart-header-premium">
            <h3 className="admin-card-title">Documents</h3>
          </div>
          <div style={{ padding: 'var(--space-5)' }}>
            <SubmissionDocuments submissionId={submission.id} documents={submission.documents} />
          </div>
        </div>
      </div>
    </div>
  )
}

