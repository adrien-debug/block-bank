'use client'

import { useEffect, useState, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Sidebar from '@/components/ui/Sidebar'
import DashboardIcon from '@/components/icons/DashboardIcon'
import StarIcon from '@/components/icons/StarIcon'
import MoneyIcon from '@/components/icons/MoneyIcon'
import NFTIcon from '@/components/icons/NFTIcon'
import UserIcon from '@/components/icons/UserIcon'
import ExploreIcon from '@/components/icons/ExploreIcon'
import InvestorIcon from '@/components/icons/InvestorIcon'
import DocumentIcon from '@/components/icons/DocumentIcon'
import ChartUpIcon from '@/components/icons/ChartUpIcon'
import HelpButton from '@/components/ui/HelpButton'
import { useHeader } from '@/contexts/HeaderContext'
import { useAuth } from '@/contexts/AuthContext'

declare global {
  interface Window {
    ethereum?: any
  }
}

interface SidebarItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  href: string
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { setShowHamburger, setIsMenuOpen, setOnMenuToggle, isMenuOpen } = useHeader()
  const { user, isLoading } = useAuth()
  const [address, setAddress] = useState<string | null>(null)
  const manuallyDisconnectedRef = useRef(false)

  // Vérifier le rôle et rediriger les admin vers /admin/dashboard
  useEffect(() => {
    if (!isLoading && user && user.role === 'admin') {
      router.push('/admin/dashboard')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    // Vérifier si on a déconnecté manuellement
    const wasManuallyDisconnected = localStorage.getItem('wallet_manually_disconnected') === 'true'
    manuallyDisconnectedRef.current = wasManuallyDisconnected

    if (typeof window !== 'undefined' && window.ethereum) {
      const checkConnection = async () => {
        // Ne pas vérifier si on a déconnecté manuellement
        if (wasManuallyDisconnected) {
          setAddress(null)
          return
        }
        
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' })
          if (accounts.length > 0) {
            setAddress(accounts[0])
          } else {
            setAddress(null)
          }
        } catch (error) {
          console.error('Error checking connection:', error)
          setAddress(null)
        }
      }
      
      checkConnection()

      const handleAccountsChanged = (accounts: string[]) => {
        // Ignorer si on a déconnecté manuellement
        if (manuallyDisconnectedRef.current) {
          console.log('Dashboard: Ignoring accountsChanged because of manual disconnect')
          return
        }
        
        if (accounts.length === 0) {
          setAddress(null)
        } else {
          setAddress(accounts[0])
        }
      }

      window.ethereum.on('accountsChanged', handleAccountsChanged)

      return () => {
        if (window.ethereum && window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
        }
      }
    } else {
      setAddress(null)
    }
  }, [])

  const tabs: SidebarItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon, href: '/dashboard' },
    { id: 'explore', label: 'Explore', icon: ExploreIcon, href: '/dashboard/explore' },
    { id: 'legalblock-opportunity', label: 'Submit a Request', icon: ChartUpIcon, href: '/legalblock/opportunity' },
    { id: 'credit-score', label: 'Credit Score', icon: StarIcon, href: '/dashboard/credit-score' },
    { id: 'loans', label: 'My Loans', icon: MoneyIcon, href: '/dashboard/loans' },
    { id: 'nft', label: 'RWA Tokens', icon: NFTIcon, href: '/dashboard/nft' },
    { id: 'investor', label: 'Investor', icon: InvestorIcon, href: '/dashboard/investor' },
    { id: 'profile', label: 'Profile', icon: UserIcon, href: '/dashboard/profile' },
    { id: 'terms', label: 'Terms & Conditions', icon: DocumentIcon, href: '/dashboard/terms' },
  ]

  // Déterminer l'onglet actif basé sur le pathname
  const getActiveTab = () => {
    // Si on est exactement sur /dashboard, retourner dashboard
    if (pathname === '/dashboard') return 'dashboard'
    
    // Chercher le tab qui correspond au pathname
    // On trie par longueur de href (du plus long au plus court) pour éviter les matches partiels
    const sortedTabs = [...tabs].sort((a, b) => b.href.length - a.href.length)
    
    // Chercher d'abord une correspondance exacte
    const exactMatch = sortedTabs.find(tab => pathname === tab.href)
    if (exactMatch) return exactMatch.id
    
    // Ensuite chercher si le pathname commence par le href du tab
    const prefixMatch = sortedTabs.find(tab => pathname.startsWith(tab.href + '/') || pathname.startsWith(tab.href))
    if (prefixMatch) return prefixMatch.id
    
    // Par défaut, retourner dashboard
    return 'dashboard'
  }


  // Cacher le sidebar sur la page des conditions générales
  const isTermsPage = pathname === '/dashboard/terms'
  const shouldShowSidebar = !isTermsPage

  useEffect(() => {
    setShowHamburger(shouldShowSidebar)
    setOnMenuToggle(() => () => setIsMenuOpen(!isMenuOpen))
  }, [shouldShowSidebar, isMenuOpen, setShowHamburger, setIsMenuOpen, setOnMenuToggle])

  return (
    <div className="app">
      <main className="app-main">
        <div className="dashboard">
          {shouldShowSidebar && (
          <Sidebar
            items={tabs.map(tab => ({
              id: tab.id,
              label: tab.label,
              icon: tab.icon,
              href: tab.href,
            }))}
            activeItem={getActiveTab()}
            isOpen={isMenuOpen}
            onToggle={() => setIsMenuOpen(!isMenuOpen)}
            walletAddress={address}
          />
          )}
          <div className={`dashboard-content ${isMenuOpen && shouldShowSidebar ? 'sidebar-open' : ''} ${isTermsPage ? 'terms-page-full-width' : ''}`}>
            {children}
          </div>
        </div>
      </main>
      
      {/* Help Button - Floating */}
      <HelpButton email="support@block-bank.com" />
    </div>
  )
}

