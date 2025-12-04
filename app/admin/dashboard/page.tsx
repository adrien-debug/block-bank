'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { formatDateLong } from '@/lib/utils'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import StatCard from '@/components/ui/StatCard'
import { SubmissionMetadata } from '@/types/submission.types'
import { SocialPost, Promotion, AdWordsCampaign } from '@/types/marketing.types'
import ChartIcon from '@/components/icons/ChartIcon'
import DocumentIcon from '@/components/icons/DocumentIcon'
import MoneyIcon from '@/components/icons/MoneyIcon'
import UsersIcon from '@/components/icons/UsersIcon'
import StarIcon from '@/components/icons/StarIcon'
import FireIcon from '@/components/icons/FireIcon'
import ShieldIcon from '@/components/icons/ShieldIcon'

interface DashboardStats {
  totalSubmissions: number
  submissionsByStatus: Record<string, number>
  submissionsByType: Record<string, number>
  submissionsByUserType: Record<string, number>
  totalValue: number
  recentSubmissions: SubmissionMetadata[]
  marketingStats: {
    totalPosts: number
    scheduledPosts: number
    publishedPosts: number
    totalPromotions: number
    activePromotions: number
    totalAdWordsCampaigns: number
    activeCampaigns: number
  }
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<'24h' | '7d' | '30d' | 'all'>('30d')

  useEffect(() => {
    loadDashboardData()
  }, [selectedPeriod])

  const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      // Charger les soumissions
      const submissionsResponse = await fetch('/api/admin/submissions')
      const submissionsData = await submissionsResponse.json()
      const submissions: SubmissionMetadata[] = submissionsData.submissions || []

      // Charger les stats marketing
      const [postsRes, promotionsRes, adwordsRes] = await Promise.all([
        fetch('/api/admin/marketing/posts').catch(() => ({ json: () => ({ posts: [] }) })),
        fetch('/api/admin/marketing/promotions').catch(() => ({ json: () => ({ promotions: [] }) })),
        fetch('/api/admin/marketing/adwords').catch(() => ({ json: () => ({ campaigns: [] }) })),
      ])

      const postsData = await postsRes.json()
      const promotionsData = await promotionsRes.json()
      const adwordsData = await adwordsRes.json()

      const posts: SocialPost[] = postsData.posts || []
      const promotions: Promotion[] = promotionsData.promotions || []
      const campaigns: AdWordsCampaign[] = adwordsData.campaigns || []

      // Calculer les statistiques
      const submissionsByStatus = submissions.reduce((acc, sub) => {
        acc[sub.status] = (acc[sub.status] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const submissionsByType = submissions.reduce((acc, sub) => {
        acc[sub.assetType] = (acc[sub.assetType] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const submissionsByUserType = submissions.reduce((acc, sub) => {
        acc[sub.userType] = (acc[sub.userType] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const totalValue = submissions.reduce((sum, sub) => {
        const value = parseFloat(sub.estimatedValue) || 0
        return sum + value
      }, 0)

      const recentSubmissions = submissions
        .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
        .slice(0, 5)

      setStats({
        totalSubmissions: submissions.length,
        submissionsByStatus,
        submissionsByType,
        submissionsByUserType,
        totalValue,
        recentSubmissions,
        marketingStats: {
          totalPosts: posts.length,
          scheduledPosts: posts.filter(p => p.status === 'scheduled').length,
          publishedPosts: posts.filter(p => p.status === 'published').length,
          totalPromotions: promotions.length,
          activePromotions: promotions.filter(p => p.status === 'active').length,
          totalAdWordsCampaigns: campaigns.length,
          activeCampaigns: campaigns.filter(c => c.status === 'active').length,
        },
      })
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: '#3B82F6',
      'in-review': '#F59E0B',
      approved: '#10B981',
      rejected: '#EF4444',
      processed: '#6B7280',
    }
    return colors[status] || '#6B7280'
  }

  const getAssetTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'real-estate': 'Immobilier',
      vehicle: 'Véhicule',
      luxury: 'Luxe',
      collectible: 'Collection',
      mining: 'Mining',
      infrastructure: 'Infrastructure',
      commercial: 'Commercial',
      other: 'Autre',
    }
    return labels[type] || type
  }

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
        <p>Chargement du dashboard...</p>
      </div>
    )
  }

  if (!stats) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
        <p>Erreur lors du chargement des données</p>
      </div>
    )
  }

  return (
    <div className="admin-page-container dashboard-overview">
      {/* Header - Style cockpit */}
      <div className="admin-page-header dashboard-header admin-dashboard-header">
        <div>
          <h1 className="admin-page-title">Dashboard Admin</h1>
        </div>
        <div className="admin-header-controls">
          <div className="dashboard-date">
            {formatDateLong(new Date())}
          </div>
          <div className="admin-period-buttons">
            {(['24h', '7d', '30d', 'all'] as const).map((period) => (
              <Button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                variant={selectedPeriod === period ? 'primary' : 'secondary'}
                size="small"
              >
                {period === '24h' ? '24h' : period === '7d' ? '7 jours' : period === '30d' ? '30 jours' : 'Tout'}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats principales - Style cockpit avec StatCard */}
      <div className="stats-grid admin-main-stats">
        <StatCard
          icon={<DocumentIcon />}
          label="Total Submissions"
          value={stats.totalSubmissions}
          subtitle="All submissions"
          variant="primary"
        />
        
        <StatCard
          icon={<MoneyIcon />}
          label="Total Value"
          value={formatCurrency(stats.totalValue)}
          subtitle="Estimated total value"
          variant="success"
        />
        
        <StatCard
          icon={<FireIcon />}
          label="Pending Review"
          value={stats.submissionsByStatus['new'] || 0}
          subtitle="Require action"
          badge={{ text: 'Action Required', variant: 'warning' }}
          variant="warning"
        />
        
        <StatCard
          icon={<StarIcon />}
          label="Approved"
          value={stats.submissionsByStatus['approved'] || 0}
          subtitle="Validated requests"
          badge={{ text: 'Validated', variant: 'success' }}
          variant="success"
        />
      </div>

      {/* Graphiques et détails - Style cockpit */}
      <div className="dashboard-charts-premium admin-charts-grid" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="admin-charts-container">
        {/* Répartition par statut */}
        <div className="chart-card-premium">
          <div className="chart-header-premium">
            <h3>Status Distribution</h3>
          </div>
          <div style={{ padding: 'var(--space-5)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {Object.entries(stats.submissionsByStatus).map(([status, count]) => {
              const total = stats.totalSubmissions
              const percentage = total > 0 ? (count / total) * 100 : 0
              return (
                <div key={status}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <div
                        style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          background: getStatusColor(status),
                        }}
                      />
                      <span className="admin-card-text" style={{ fontWeight: '500', textTransform: 'capitalize' }}>
                        {status === 'in-review' ? 'En Révision' : status === 'new' ? 'Nouveau' : status}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      <span className="admin-card-text" style={{ fontWeight: '600' }}>{count}</span>
                      <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', minWidth: '45px', textAlign: 'right' }}>
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      height: '8px',
                      borderRadius: '4px',
                      background: 'var(--color-bg-secondary)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${percentage}%`,
                        background: getStatusColor(status),
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
          </div>
        </div>

        {/* Répartition par type d'actif */}
        <div className="chart-card-premium">
          <div className="chart-header-premium">
            <h3>Asset Types</h3>
          </div>
          <div style={{ padding: 'var(--space-5)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {Object.entries(stats.submissionsByType)
              .sort((a, b) => b[1] - a[1])
              .map(([type, count]) => (
                <div key={type} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="admin-card-text">{getAssetTypeLabel(type)}</span>
                  <span className="admin-card-text" style={{ fontWeight: '600' }}>{count}</span>
                </div>
              ))}
          </div>
          </div>
        </div>
        </div>
      </div>

      {/* Marketing Stats - Style cockpit avec StatCard */}
      <div className="stats-grid admin-marketing-stats" style={{ marginBottom: 'var(--space-6)' }}>
        <StatCard
          icon={<ChartIcon />}
          label="Total Posts"
          value={stats.marketingStats.totalPosts}
          subtitle="All social posts"
          variant="info"
        />
        
        <StatCard
          icon={<DocumentIcon />}
          label="Scheduled Posts"
          value={stats.marketingStats.scheduledPosts}
          subtitle="Waiting to publish"
          variant="primary"
        />
        
        <StatCard
          icon={<StarIcon />}
          label="Published Posts"
          value={stats.marketingStats.publishedPosts}
          subtitle="Live posts"
          variant="success"
        />
        
        <StatCard
          icon={<FireIcon />}
          label="Active Promotions"
          value={`${stats.marketingStats.activePromotions}/${stats.marketingStats.totalPromotions}`}
          subtitle="Running promotions"
          variant="warning"
        />
        
        <StatCard
          icon={<ShieldIcon />}
          label="AdWords Campaigns"
          value={`${stats.marketingStats.activeCampaigns}/${stats.marketingStats.totalAdWordsCampaigns}`}
          subtitle="Active campaigns"
          variant="info"
        />
      </div>

      {/* Activité récente - Style cockpit */}
      <div className="chart-card-premium">
        <div className="chart-header-premium">
          <h3>Recent Activity</h3>
          <Button
            onClick={() => router.push('/admin/submissions')}
            variant="secondary"
            size="small"
          >
            View All →
          </Button>
        </div>
        <div style={{ padding: 'var(--space-5)' }}>
        {stats.recentSubmissions.length === 0 ? (
          <p className="admin-card-text" style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
            Aucune soumission récente
          </p>
        ) : (
          <div className="admin-recent-submissions">
            {stats.recentSubmissions.map((submission) => (
              <div
                key={submission.id}
                className="admin-submission-card"
                onClick={() => router.push(`/admin/submissions/${submission.id}`)}
              >
                <div className="admin-submission-header">
                  <h4>
                    {submission.userType === 'individual' ? submission.ownerName || 'Individuel' : submission.companyName || 'Entreprise'}
                  </h4>
                  <span
                    className="admin-submission-status"
                    style={{
                      background: `${getStatusColor(submission.status)}20`,
                      color: getStatusColor(submission.status),
                    }}
                  >
                    {submission.status === 'in-review' ? 'En Révision' : submission.status === 'new' ? 'Nouveau' : submission.status}
                  </span>
                </div>
                <div className="admin-submission-details">
                  <span>{getAssetTypeLabel(submission.assetType)}</span>
                  <span>{formatCurrency(parseFloat(submission.estimatedValue) || 0)}</span>
                  <span>{submission.location}</span>
                  <span>{formatDate(submission.submittedAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
  )
}

