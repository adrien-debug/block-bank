'use client'

import { useState, useRef, useEffect } from 'react'

interface SeeMoreProps {
  children: React.ReactNode
  maxHeight?: number
  className?: string
  onSeeMore?: () => void
  showButton?: boolean
}

export default function SeeMore({ 
  children, 
  maxHeight = 200, 
  className = '',
  onSeeMore,
  showButton = true
}: SeeMoreProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [needsExpansion, setNeedsExpansion] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current) {
      const height = contentRef.current.scrollHeight
      setNeedsExpansion(height > maxHeight)
    }
  }, [maxHeight])

  const handleSeeMore = () => {
    if (onSeeMore) {
      onSeeMore()
    } else {
      setIsExpanded(!isExpanded)
    }
  }

  if (!needsExpansion && !onSeeMore) {
    return <div className={className} ref={contentRef}>{children}</div>
  }

  return (
    <div className={className}>
      <div 
        className={`see-more-content ${isExpanded ? 'expanded' : ''}`}
        ref={contentRef}
        style={{
          maxHeight: isExpanded || onSeeMore ? 'none' : `${maxHeight}px`,
          overflow: isExpanded || onSeeMore ? 'visible' : 'hidden',
          transition: onSeeMore ? 'none' : 'max-height 0.3s ease-out'
        }}
      >
        {children}
      </div>
      {showButton && (needsExpansion || onSeeMore) && (
        <button
          className="see-more-button"
          onClick={handleSeeMore}
        >
          {onSeeMore ? 'Voir plus' : (isExpanded ? 'Voir moins' : 'Voir plus')}
        </button>
      )}
    </div>
  )
}

