'use client'

import React from 'react'

interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'ghost'
  href?: string
  onClick?: () => void
  className?: string
}

export default function Button({ 
  children, 
  variant = 'primary', 
  href, 
  onClick,
  className = '' 
}: ButtonProps) {
  const baseClasses = 'btn'
  const variantClasses = variant === 'primary' ? 'btn-primary' : 'btn-ghost'
  
  if (href) {
    return (
      <a 
        href={href} 
        className={`${baseClasses} ${variantClasses} ${className}`}
        onClick={(e) => {
          if (href.startsWith('#')) {
            e.preventDefault()
            const element = document.querySelector(href)
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
          }
          onClick?.()
        }}
      >
        {children}
      </a>
    )
  }
  
  return (
    <button 
      className={`${baseClasses} ${variantClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

