'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
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
      // Utiliser cache pour éviter les requêtes répétées
      const cacheKey = `files-${submissionId}`
      const cached = sessionStorage.getItem(cacheKey)
      
      if (cached) {
        const cachedData = JSON.parse(cached)
        // Utiliser le cache si moins de 5 minutes
        if (Date.now() - cachedData.timestamp < 5 * 60 * 1000) {
          setFiles(cachedData.files)
          setIsLoading(false)
          return
        }
      }

      const response = await fetch(`/api/admin/submissions/${submissionId}/files`, {
        // Ajouter cache HTTP
        cache: 'default',
        headers: {
          'Cache-Control': 'max-age=300' // 5 minutes
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
    return <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>Loading documents...</p>
  }

  if (files.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
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
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: 0 }}>
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
              <p style={{ fontWeight: '500', marginBottom: '4px', fontSize: '14px' }}>{file.name}</p>
              <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
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
      // Utiliser cache pour éviter les requêtes répétées
      const cacheKey = `submission-${params.id}`
      const cached = sessionStorage.getItem(cacheKey)
      
      if (cached) {
        const cachedData = JSON.parse(cached)
        // Utiliser le cache si moins de 2 minutes
        if (Date.now() - cachedData.timestamp < 2 * 60 * 1000) {
          setSubmission(cachedData.submission)
          setIsLoading(false)
          return
        }
      }

      const response = await fetch(`/api/admin/submissions/${params.id}`, {
        cache: 'default',
        headers: {
          'Cache-Control': 'max-age=120' // 2 minutes
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
      <div className="dashboard-overview">
        <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (error || !submission) {
    return (
      <div className="dashboard-overview">
        <Card variant="elevated" style={{ padding: 'var(--space-4)', background: 'rgba(239, 68, 68, 0.1)' }}>
          <p style={{ color: '#DC2626' }}>{error || 'Submission not found'}</p>
          <Button variant="secondary" onClick={() => router.push('/admin')} style={{ marginTop: 'var(--space-4)' }}>
            Back to List
          </Button>
        </Card>
      </div>
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
          <Button variant="secondary" onClick={() => router.push('/admin')} style={{ marginBottom: 'var(--space-4)' }}>
            ← Back
          </Button>
          <h1>Submission Details</h1>
          <p style={{ marginTop: '8px', color: 'var(--color-text-secondary)', fontSize: '16px' }}>
            ID: {submission.id}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {/* Informations générales */}
        <Card variant="elevated" style={{ padding: 'var(--space-6)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: 'var(--space-4)' }}>
            General Information
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div>
              <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Submission Date</p>
              <p style={{ fontWeight: '500' }}>{formatDate(submission.submittedAt)}</p>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Status</p>
              <p style={{ fontWeight: '500' }}>{submission.status}</p>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>User Type</p>
              <p style={{ fontWeight: '500' }}>{submission.userType === 'individual' ? 'Individual' : 'Company'}</p>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Asset Type</p>
              <p style={{ fontWeight: '500' }}>{submission.assetType} {submission.customAssetType && `(${submission.customAssetType})`}</p>
            </div>
          </div>
        </Card>

        {/* Informations utilisateur */}
        <Card variant="elevated" style={{ padding: 'var(--space-6)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: 'var(--space-4)' }}>
            {submission.userType === 'individual' ? 'Personal Information' : 'Company Information'}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            {submission.userType === 'individual' ? (
              <>
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Name</p>
                  <p style={{ fontWeight: '500' }}>{submission.ownerName}</p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Email</p>
                  <p style={{ fontWeight: '500' }}>{submission.ownerEmail}</p>
                </div>
                {submission.ownerPhone && (
                  <div>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Phone</p>
                    <p style={{ fontWeight: '500' }}>{submission.ownerPhone}</p>
                  </div>
                )}
              </>
            ) : (
              <>
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Company Name</p>
                  <p style={{ fontWeight: '500' }}>{submission.companyName}</p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Email</p>
                  <p style={{ fontWeight: '500' }}>{submission.companyEmail}</p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Contact Person</p>
                  <p style={{ fontWeight: '500' }}>{submission.contactPersonName}</p>
                </div>
                {submission.companyPhone && (
                  <div>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Phone</p>
                    <p style={{ fontWeight: '500' }}>{submission.companyPhone}</p>
                  </div>
                )}
                {submission.companyRegistration && (
                  <div>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Registration (SIRET / RCS)</p>
                    <p style={{ fontWeight: '500' }}>{submission.companyRegistration}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </Card>

        {/* Informations actif */}
        <Card variant="elevated" style={{ padding: 'var(--space-6)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: 'var(--space-4)' }}>
            Asset Information
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div>
              <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Estimated Value</p>
              <p style={{ fontWeight: '500', fontSize: '18px' }}>{submission.estimatedValue} USDC</p>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Location</p>
              <p style={{ fontWeight: '500' }}>{submission.location}</p>
            </div>
            {submission.assetLink && (
              <div>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Asset Link</p>
                <a href={submission.assetLink} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary-500)', textDecoration: 'underline' }}>
                  {submission.assetLink}
                </a>
              </div>
            )}
            <div>
              <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Description</p>
              <p style={{ fontWeight: '500', whiteSpace: 'pre-wrap' }}>{submission.assetDescription}</p>
            </div>
            {submission.additionalInfo && (
              <div>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Additional Information</p>
                <p style={{ fontWeight: '500', whiteSpace: 'pre-wrap' }}>{submission.additionalInfo}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Documents */}
        <Card variant="elevated" style={{ padding: 'var(--space-6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600' }}>
              Documents
            </h2>
          </div>
          <SubmissionDocuments submissionId={submission.id} documents={submission.documents} />
        </Card>
      </div>
    </div>
  )
}

