import React from 'react'

interface CardProps {
  children: React.ReactNode
  muted?: boolean
  className?: string
}

export default function Card({ children, muted = false, className = '' }: CardProps) {
  return (
    <div className={`card ${muted ? 'card-muted' : ''} ${className}`}>
      {children}
    </div>
  )
}


