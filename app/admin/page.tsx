'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminDashboardPage() {
  const router = useRouter()
  
  useEffect(() => {
    router.replace('/admin/dashboard')
  }, [router])

  return (
    <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
      <p>Redirection vers le dashboard...</p>
    </div>
  )
}
