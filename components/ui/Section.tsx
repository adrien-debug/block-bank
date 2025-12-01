import React from 'react'

interface SectionProps {
  id: string
  kicker?: string
  title: string
  badge?: string
  children: React.ReactNode
  className?: string
}

export default function Section({ 
  id, 
  kicker, 
  title, 
  badge, 
  children,
  className = '' 
}: SectionProps) {
  return (
    <section className={className} id={id}>
      {kicker && <div className="section-kicker">{kicker}</div>}
      <h2 className="section-title">{title}</h2>
      {badge && <div className="section-badge">{badge}</div>}
      {children}
    </section>
  )
}

