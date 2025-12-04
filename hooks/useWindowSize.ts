'use client'

import { useState, useEffect } from 'react'

export function useWindowSize() {
  const [isMobile, setIsMobile] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // Vérification de sécurité pour SSR
    if (typeof window === 'undefined') {
      return
    }

    const handleResize = () => {
      const mobile = window.innerWidth <= 768
      setIsMobile(mobile)
    }

    // Initialiser les valeurs au montage
    handleResize()
    setIsMounted(true)

    // Ajouter l'écouteur d'événement
    window.addEventListener('resize', handleResize)

    // Nettoyer l'écouteur au démontage
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return { isMobile, isMounted }
}



