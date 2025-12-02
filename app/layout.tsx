import type { Metadata } from 'next'
// Design tokens (variables CSS) - source unique
import '../styles/design-tokens.css'
// Reset CSS de base
import '../styles/utilities/reset.css'
// Animations globales
import '../styles/utilities/animations.css'
// Layout de base
import '../styles/layout/app-layout.css'
// Composants CSS
import '../styles/components/hero.css'
import '../styles/components/navigation.css'
import '../styles/components/sections.css'
import '../styles/components/wallet-connect.css'
// Pages CSS
import '../styles/pages/landing.css'
// Dashboard styles
import '../styles/dashboard.css'
// Skeleton styles
import '../styles/skeleton.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Block Bank - Credit Banking On-Chain',
  description: 'Infrastructure de crédit on-chain pour actifs réels & mining Bitcoin',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
