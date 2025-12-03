'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { AssetSubmission } from '@/types/submission.types'

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
      const response = await fetch(`/api/admin/submissions/${params.id}`)
      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/admin/login')
          return
        }
        throw new Error(data.error || 'Error loading data')
      }

      setSubmission(data.submission)
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
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: 'var(--space-4)' }}>
            Documents
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
              Documents are stored in Google Drive. Access them via the submission folder.
            </p>
            {/* Dans une version complète, on listerait tous les documents avec des liens de téléchargement */}
          </div>
        </Card>
      </div>
    </div>
  )
}

