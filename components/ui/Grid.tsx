import React from 'react'

interface GridProps {
  children: React.ReactNode
  cols?: 2 | 3
  className?: string
}

export default function Grid({ children, cols = 2, className = '' }: GridProps) {
  const gridClass = cols === 2 ? 'grid-cols-2' : 'grid-cols-3'
  return (
    <div className={`grid ${gridClass} ${className}`}>
      {children}
    </div>
  )
}

