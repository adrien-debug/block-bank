'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Sidebar from '@/components/ui/Sidebar'
import DashboardIcon from '@/components/icons/DashboardIcon'
import StarIcon from '@/components/icons/StarIcon'
import MoneyIcon from '@/components/icons/MoneyIcon'
import NFTIcon from '@/components/icons/NFTIcon'
import ShieldIcon from '@/components/icons/ShieldIcon'
import UserIcon from '@/components/icons/UserIcon'
import ExploreIcon from '@/components/icons/ExploreIcon'
import InvestorIcon from '@/components/icons/InvestorIcon'
import DocumentIcon from '@/components/icons/DocumentIcon'
import WalletConnect from '@/components/WalletConnect'
import Logo from '@/components/icons/Logo'

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
  const [address, setAddress] = useState<string | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(true)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(true)
      }
    }
    
    window.addEventListener('resize', handleResize)
    handleResize()
    
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const checkConnection = async () => {
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
    }
  }, [])

  const tabs: SidebarItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon, href: '/dashboard' },
    { id: 'explore', label: 'Explore', icon: ExploreIcon, href: '/dashboard/explore' },
    { id: 'credit-score', label: 'Credit Score', icon: StarIcon, href: '/dashboard/credit-score' },
    { id: 'loans', label: 'My Loans', icon: MoneyIcon, href: '/dashboard/loans' },
    { id: 'nft', label: 'NFT RWA', icon: NFTIcon, href: '/dashboard/nft' },
    { id: 'insurance', label: 'Insurance', icon: ShieldIcon, href: '/dashboard/insurance' },
    { id: 'investor', label: 'Investor', icon: InvestorIcon, href: '/dashboard/investor' },
    { id: 'profile', label: 'Profile', icon: UserIcon, href: '/dashboard/profile' },
    { id: 'terms', label: 'Terms & Conditions', icon: DocumentIcon, href: '/dashboard/terms' },
  ]

  // Déterminer l'onglet actif basé sur le pathname
  const getActiveTab = () => {
    if (pathname === '/dashboard') return 'dashboard'
    const tab = tabs.find(tab => pathname === tab.href || pathname.startsWith(tab.href + '/'))
    return tab?.id || 'dashboard'
  }

  const handleWalletConnect = (addr: string) => {
    setAddress(addr)
  }

  const handleWalletDisconnect = () => {
    setAddress(null)
    router.push('/')
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <Logo />
            <span className="logo-text">BLOCKBANK</span>
          </div>
          <WalletConnect 
            onConnect={handleWalletConnect}
            onDisconnect={handleWalletDisconnect}
          />
        </div>
      </header>

      <main className="app-main">
        <div className="dashboard">
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
          <div className="dashboard-content">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}

