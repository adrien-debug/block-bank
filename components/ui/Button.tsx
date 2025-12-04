'use client'

import React from 'react'

interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'ghost' | 'secondary'
  href?: string
  onClick?: (e?: React.MouseEvent) => void
  className?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  style?: React.CSSProperties
  size?: 'small' | 'medium' | 'large'
}

function Button({ 
  children, 
  variant = 'primary', 
  href, 
  onClick,
  className = '',
  type = 'button',
  disabled = false,
  style,
  size = 'medium'
}: ButtonProps) {
  const baseClasses = 'btn'
  const variantClasses = variant === 'primary' ? 'btn-primary' : variant === 'secondary' ? 'btn-secondary' : 'btn-ghost'
  const sizeClasses = size === 'small' ? 'btn-small' : size === 'large' ? 'btn-large' : ''
  
  if (href) {
    return (
      <a 
        href={href} 
        className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`.trim()}
        style={style}
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
      type={type}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`.trim()}
      style={style}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button
export { Button }

