import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  dot?: boolean
  variant?: 'default' | 'risk-green' | 'risk-yellow' | 'risk-red'
  className?: string
}

export default function Badge({ 
  children, 
  dot = false, 
  variant = 'default',
  className = '' 
}: BadgeProps) {
  const variantClasses = {
    'default': '',
    'risk-green': 'badge-risk',
    'risk-yellow': 'badge-risk',
    'risk-red': 'badge-risk'
  }
  
  const dotClasses = {
    'default': '',
    'risk-green': 'dot-green',
    'risk-yellow': 'dot-yellow',
    'risk-red': 'dot-red'
  }
  
  return (
    <span className={`${variantClasses[variant]} ${className}`}>
      {dot && <span className={`${dotClasses[variant]}`} style={{width:'7px',height:'7px',borderRadius:'50%'}}></span>}
      {children}
    </span>
  )
}

