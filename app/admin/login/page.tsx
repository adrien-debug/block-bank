'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'login',
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Connection error')
        setIsLoading(false)
        return
      }

      // Redirect to admin dashboard
      router.push('/admin')
    } catch (error) {
      console.error('Login error:', error)
      setError('An error occurred')
      setIsLoading(false)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'var(--color-bg-primary)'
    }}>
      <Card variant="elevated" style={{ maxWidth: '400px', width: '100%', padding: 'var(--space-8)' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '600', marginBottom: 'var(--space-2)' }}>
            Admin BlockBank
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
            Admin dashboard login
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label htmlFor="password" style={{ 
              display: 'block', 
              marginBottom: 'var(--space-2)',
              fontSize: '14px',
              fontWeight: '500',
              color: 'var(--color-text-primary)'
            }}>
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: 'var(--space-3) var(--space-4)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-base)',
                fontFamily: 'var(--font-ui)',
                color: 'var(--color-text-primary)',
                background: 'var(--color-bg-primary)',
              }}
            />
          </div>

          {error && (
            <div style={{
              padding: 'var(--space-3)',
              marginBottom: 'var(--space-4)',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--radius-md)',
              color: '#DC2626',
              fontSize: '14px',
            }}>
              {error}
            </div>
          )}

          <Button
            variant="primary"
            type="submit"
            disabled={isLoading}
            style={{ width: '100%' }}
          >
            {isLoading ? 'Connecting...' : 'Sign In'}
          </Button>
        </form>
      </Card>
    </div>
  )
}

