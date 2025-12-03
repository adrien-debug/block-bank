'use client'

import React from 'react'

interface CardProps {
  children: React.ReactNode
  muted?: boolean
  variant?: 'default' | 'glass' | 'elevated' | 'flat'
  hover?: boolean
  className?: string
  style?: React.CSSProperties
  onClick?: () => void
}

export default function Card({
  children,
  muted = false,
  variant = 'default',
  hover = false,
  className = '',
  style,
  onClick,
}: CardProps) {
  const variantClasses = {
    default: 'card-default',
    glass: 'card-glass',
    elevated: 'card-elevated',
    flat: 'card-flat',
  }

  const baseClasses = `card ${variantClasses[variant]} ${muted ? 'card-muted' : ''} ${hover ? 'card-hover' : ''} ${onClick ? 'card-clickable' : ''} ${className}`.trim()

  return (
    <div className={baseClasses} style={style} onClick={onClick} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined}>
      {children}
    </div>
  )
}


