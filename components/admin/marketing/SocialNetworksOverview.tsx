'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { SocialNetwork, SocialPost, Promotion } from '@/types/marketing.types'

interface SocialNetworkAccount {
  network: SocialNetwork
  name: string
  username: string
  url: string
  status: 'connected' | 'not-connected' | 'pending'
  postsDone: number
  postsToDo: number
  paidPromotions: {
    active: number
    total: number
    budget: number
  }
  lastPostDate?: string
  followers?: number
}

const NETWORK_LABELS: Record<SocialNetwork, string> = {
  facebook: 'Facebook',
  twitter: 'Twitter/X',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  tiktok: 'TikTok',
  youtube: 'YouTube',
}

const NETWORK_URLS: Record<SocialNetwork, string> = {
  facebook: 'https://www.facebook.com',
  twitter: 'https://twitter.com',
  instagram: 'https://www.instagram.com',
  linkedin: 'https://www.linkedin.com',
  tiktok: 'https://www.tiktok.com',
  youtube: 'https://www.youtube.com',
}

const NETWORK_COLORS: Record<SocialNetwork, string> = {
  facebook: '#1877F2',
  twitter: '#1DA1F2',
  instagram: '#E4405F',
  linkedin: '#0A66C2',
  tiktok: '#000000',
  youtube: '#FF0000',
}

const STATUS_COLORS = {
  'connected': '#10B981',
  'not-connected': '#EF4444',
  'pending': '#F59E0B',
}

const STATUS_LABELS = {
  'connected': 'Connected',
  'not-connected': 'Not Connected',
  'pending': 'Pending',
}

export default function SocialNetworksOverview() {
  const [accounts, setAccounts] = useState<SocialNetworkAccount[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [posts, setPosts] = useState<SocialPost[]>([])
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [editingAccount, setEditingAccount] = useState<SocialNetworkAccount | null>(null)
  const [formData, setFormData] = useState({
    username: '',
    url: '',
    status: 'not-connected' as 'connected' | 'not-connected' | 'pending',
    followers: '',
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      // Load posts and promotions
      const [postsRes, promotionsRes, accountsRes] = await Promise.all([
        fetch('/api/admin/marketing/posts').catch(() => ({ ok: false, json: () => Promise.resolve({ posts: [] }) })),
        fetch('/api/admin/marketing/promotions').catch(() => ({ ok: false, json: () => Promise.resolve({ promotions: [] }) })),
        fetch('/api/admin/marketing/accounts').catch(() => ({ ok: false, json: () => Promise.resolve({ accounts: [] }) })),
      ])

      // Handle responses - if not ok, use empty arrays
      const postsData = postsRes.ok !== false ? await postsRes.json() : { posts: [] }
      const promotionsData = promotionsRes.ok !== false ? await promotionsRes.json() : { promotions: [] }
      const accountsData = accountsRes.ok !== false ? await accountsRes.json() : { accounts: [] }

      const loadedPosts: SocialPost[] = postsData.posts || []
      const loadedPromotions: Promotion[] = promotionsData.promotions || []
      const savedAccounts: SocialNetworkAccount[] = accountsData.accounts || []

      setPosts(loadedPosts)
      setPromotions(loadedPromotions)

      // Calculate stats for each network
      const networks: SocialNetwork[] = ['facebook', 'twitter', 'instagram', 'linkedin', 'tiktok', 'youtube']
      const accountsWithStats: SocialNetworkAccount[] = networks.map((network) => {
        // Find saved account data or create default
        const savedAccount = savedAccounts.find(a => a.network === network)
        
        // Count posts for this network
        const networkPosts = loadedPosts.filter(p => p.networks.includes(network))
        const publishedPosts = networkPosts.filter(p => p.status === 'published')
        const scheduledPosts = networkPosts.filter(p => p.status === 'scheduled')
        
        // Count promotions for this network
        const networkPromotions = loadedPromotions.filter(p => p.status === 'active')
        const activePromotions = networkPromotions.length
        const totalPromotions = loadedPromotions.length
        const totalBudget = loadedPromotions.reduce((sum, p) => sum + (p.budget || 0), 0)

        // Get last post date
        const lastPost = publishedPosts.sort((a, b) => 
          new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime()
        )[0]

        return {
          network,
          name: NETWORK_LABELS[network],
          username: savedAccount?.username || `@blockbank`,
          url: savedAccount?.url || `${NETWORK_URLS[network]}/${savedAccount?.username?.replace('@', '') || 'blockbank'}`,
          status: savedAccount?.status || 'not-connected',
          postsDone: publishedPosts.length,
          postsToDo: scheduledPosts.length,
          paidPromotions: {
            active: activePromotions,
            total: totalPromotions,
            budget: totalBudget,
          },
          lastPostDate: lastPost?.publishedAt || lastPost?.createdAt,
          followers: savedAccount?.followers,
        }
      })

      setAccounts(accountsWithStats)
    } catch (error) {
      console.error('Error loading social networks data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConnect = (account: SocialNetworkAccount) => {
    if (account.status === 'connected') {
      // Open the social network platform in a new tab
      window.open(account.url, '_blank')
    } else {
      // Open edit modal
      setEditingAccount(account)
      setFormData({
        username: account.username.replace('@', ''),
        url: account.url,
        status: account.status,
        followers: account.followers?.toString() || '',
      })
    }
  }

  const handleSaveAccount = async () => {
    if (!editingAccount) return

    try {
      const response = await fetch('/api/admin/marketing/accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          network: editingAccount.network,
          username: formData.username.startsWith('@') ? formData.username : `@${formData.username}`,
          url: formData.url || `${NETWORK_URLS[editingAccount.network]}/${formData.username}`,
          status: formData.status,
          followers: formData.followers ? parseInt(formData.followers) : null,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setEditingAccount(null)
        // Reload data
        loadData()
        if (data.warning) {
          alert('Account saved, but database table does not exist. Data will not persist until you create the table.')
        }
      } else {
        console.error('Error saving account:', data.error)
        const errorMsg = data.details?.includes('does not exist') || data.error?.includes('does not exist')
          ? 'Database table does not exist. Please run the schema migration (supabase-marketing-schema.sql) in your Supabase database.'
          : (data.error || 'Unknown error')
        alert('Error saving account: ' + errorMsg)
      }
    } catch (error) {
      console.error('Error saving account:', error)
      alert('Error saving account. Please check your database connection and ensure the marketing_social_accounts table exists.')
    }
  }

  const handleCloseModal = () => {
    setEditingAccount(null)
    setFormData({
      username: '',
      url: '',
      status: 'not-connected',
      followers: '',
    })
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
        <p>Loading social networks overview...</p>
      </div>
    )
  }

  return (
    <div className="social-networks-overview">
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: '600', 
          marginBottom: 'var(--space-2)',
          color: 'var(--color-text-primary)'
        }}>
          Social Networks Overview
        </h2>
        <p style={{ 
          color: 'var(--color-text-secondary)',
          fontSize: '0.9rem'
        }}>
          Manage and monitor all your social media accounts. Click on any network to connect or access it directly.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: 'var(--space-5)',
      }}>
        {accounts.map((account) => (
          <div
            key={account.network}
            style={{
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
              const card = e.currentTarget.querySelector('.network-card') as HTMLElement
              if (card) {
                card.style.borderColor = `${NETWORK_COLORS[account.network]}40`
                card.style.transform = 'translateY(-2px)'
                card.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
              }
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
              const card = e.currentTarget.querySelector('.network-card') as HTMLElement
              if (card) {
                card.style.borderColor = `${NETWORK_COLORS[account.network]}20`
                card.style.transform = 'translateY(0)'
                card.style.boxShadow = 'none'
              }
            }}
          >
            <Card
              className="network-card"
              style={{ 
                padding: 'var(--space-5)',
                border: `2px solid ${NETWORK_COLORS[account.network]}20`,
                transition: 'all 0.2s ease',
                cursor: 'pointer',
              }}
            >
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 'var(--space-4)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: `${NETWORK_COLORS[account.network]}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: NETWORK_COLORS[account.network],
                  fontSize: '1.5rem',
                  fontWeight: '600',
                }}>
                  {account.name.charAt(0)}
                </div>
                <div>
                  <h3 style={{
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    margin: 0,
                    color: 'var(--color-text-primary)',
                  }}>
                    {account.name}
                  </h3>
                  <p style={{
                    fontSize: '0.85rem',
                    color: 'var(--color-text-secondary)',
                    margin: 0,
                  }}>
                    {account.username}
                  </p>
                </div>
              </div>
              <div style={{
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: '500',
                background: `${STATUS_COLORS[account.status]}15`,
                color: STATUS_COLORS[account.status],
              }}>
                {STATUS_LABELS[account.status]}
              </div>
            </div>

            {/* Stats Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'var(--space-3)',
              marginBottom: 'var(--space-4)',
            }}>
              <div style={{
                padding: 'var(--space-3)',
                background: 'var(--color-bg-secondary)',
                borderRadius: '8px',
              }}>
                <div style={{
                  fontSize: '0.75rem',
                  color: 'var(--color-text-secondary)',
                  marginBottom: '4px',
                }}>
                  Posts Done
                </div>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: 'var(--color-text-primary)',
                }}>
                  {account.postsDone}
                </div>
              </div>
              <div style={{
                padding: 'var(--space-3)',
                background: 'var(--color-bg-secondary)',
                borderRadius: '8px',
              }}>
                <div style={{
                  fontSize: '0.75rem',
                  color: 'var(--color-text-secondary)',
                  marginBottom: '4px',
                }}>
                  Posts To Do
                </div>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: account.postsToDo > 0 ? '#F59E0B' : 'var(--color-text-primary)',
                }}>
                  {account.postsToDo}
                </div>
              </div>
            </div>

            {/* Paid Promotions */}
            <div style={{
              padding: 'var(--space-3)',
              background: 'var(--color-bg-secondary)',
              borderRadius: '8px',
              marginBottom: 'var(--space-4)',
            }}>
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--color-text-secondary)',
                marginBottom: '4px',
              }}>
                Paid Promotions
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 'var(--space-2)',
                flexWrap: 'wrap',
              }}>
                <span style={{
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: 'var(--color-text-primary)',
                }}>
                  {account.paidPromotions.active}/{account.paidPromotions.total}
                </span>
                <span style={{
                  fontSize: '0.85rem',
                  color: 'var(--color-text-secondary)',
                }}>
                  active
                </span>
                {account.paidPromotions.budget > 0 && (
                  <span style={{
                    fontSize: '0.85rem',
                    color: 'var(--color-text-secondary)',
                    marginLeft: 'auto',
                  }}>
                    {formatCurrency(account.paidPromotions.budget)} budget
                  </span>
                )}
              </div>
            </div>

            {/* Additional Info */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.8rem',
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--space-4)',
              paddingTop: 'var(--space-3)',
              borderTop: '1px solid var(--color-border)',
            }}>
              <div>
                <span style={{ marginRight: 'var(--space-2)' }}>Last post:</span>
                <span style={{ fontWeight: '500' }}>{formatDate(account.lastPostDate)}</span>
              </div>
              {account.followers && (
                <div>
                  <span style={{ fontWeight: '500' }}>{account.followers.toLocaleString()}</span>
                  <span style={{ marginLeft: '4px' }}>followers</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <Button
                onClick={() => handleConnect(account)}
                variant={account.status === 'connected' ? 'primary' : 'secondary'}
                style={{
                  flex: 1,
                  background: account.status === 'connected' 
                    ? NETWORK_COLORS[account.network] 
                    : undefined,
                }}
              >
                {account.status === 'connected' ? 'Open Platform' : 'Connect Account'}
              </Button>
              {account.status === 'connected' && (
                <Button
                  onClick={() => {
                    setEditingAccount(account)
                    setFormData({
                      username: account.username.replace('@', ''),
                      url: account.url,
                      status: account.status,
                      followers: account.followers?.toString() || '',
                    })
                  }}
                  variant="secondary"
                  style={{ padding: 'var(--space-2) var(--space-3)' }}
                >
                  Edit
                </Button>
              )}
            </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div style={{
        marginTop: 'var(--space-6)',
        padding: 'var(--space-5)',
        background: 'var(--color-bg-secondary)',
        borderRadius: '12px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 'var(--space-4)',
      }}>
        <div>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
            Total Posts Published
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--color-text-primary)' }}>
            {accounts.reduce((sum, a) => sum + a.postsDone, 0)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
            Total Posts Scheduled
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--color-text-primary)' }}>
            {accounts.reduce((sum, a) => sum + a.postsToDo, 0)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
            Connected Accounts
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--color-text-primary)' }}>
            {accounts.filter(a => a.status === 'connected').length}/{accounts.length}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
            Total Promotion Budget
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--color-text-primary)' }}>
            {formatCurrency(accounts.reduce((sum, a) => sum + a.paidPromotions.budget, 0))}
          </div>
        </div>
      </div>

      {/* Edit Account Modal */}
      {editingAccount && (
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
        }}
        onClick={handleCloseModal}
        >
          <div
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <Card
              style={{
                width: '90%',
                maxWidth: '500px',
                padding: 'var(--space-6)',
                background: 'var(--color-bg-primary)',
              }}
            >
            <div style={{ marginBottom: 'var(--space-5)' }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                marginBottom: 'var(--space-2)',
                color: 'var(--color-text-primary)',
              }}>
                {editingAccount.status === 'connected' ? 'Edit' : 'Connect'} {editingAccount.name} Account
              </h3>
              <p style={{
                fontSize: '0.9rem',
                color: 'var(--color-text-secondary)',
              }}>
                Enter your account information to connect {editingAccount.name}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: '500',
                  marginBottom: 'var(--space-2)',
                  color: 'var(--color-text-primary)',
                }}>
                  Username
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="@blockbank"
                  style={{
                    width: '100%',
                    padding: 'var(--space-3)',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-bg-secondary)',
                    color: 'var(--color-text-primary)',
                    fontSize: '0.9rem',
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: '500',
                  marginBottom: 'var(--space-2)',
                  color: 'var(--color-text-primary)',
                }}>
                  Profile URL
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder={`${NETWORK_URLS[editingAccount.network]}/blockbank`}
                  style={{
                    width: '100%',
                    padding: 'var(--space-3)',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-bg-secondary)',
                    color: 'var(--color-text-primary)',
                    fontSize: '0.9rem',
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: '500',
                  marginBottom: 'var(--space-2)',
                  color: 'var(--color-text-primary)',
                }}>
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  style={{
                    width: '100%',
                    padding: 'var(--space-3)',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-bg-secondary)',
                    color: 'var(--color-text-primary)',
                    fontSize: '0.9rem',
                  }}
                >
                  <option value="not-connected">Not Connected</option>
                  <option value="pending">Pending</option>
                  <option value="connected">Connected</option>
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: '500',
                  marginBottom: 'var(--space-2)',
                  color: 'var(--color-text-primary)',
                }}>
                  Followers (optional)
                </label>
                <input
                  type="number"
                  value={formData.followers}
                  onChange={(e) => setFormData({ ...formData, followers: e.target.value })}
                  placeholder="0"
                  style={{
                    width: '100%',
                    padding: 'var(--space-3)',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-bg-secondary)',
                    color: 'var(--color-text-primary)',
                    fontSize: '0.9rem',
                  }}
                />
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: 'var(--space-3)',
              marginTop: 'var(--space-5)',
              justifyContent: 'flex-end',
            }}>
              <Button
                onClick={handleCloseModal}
                variant="secondary"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveAccount}
                variant="primary"
                style={{
                  background: NETWORK_COLORS[editingAccount.network],
                }}
              >
                Save
              </Button>
            </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

