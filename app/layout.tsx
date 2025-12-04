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
import '../styles/components/toast.css'
import '../styles/components/help-button.css'
import '../styles/components/modals.css'
// Pages CSS
import '../styles/pages/landing.css'
// Dashboard styles
import '../styles/dashboard.css'
// Skeleton styles
import '../styles/skeleton.css'
import { Providers } from './providers'
import HeaderWrapper from '@/components/HeaderWrapper'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://www.block-bank.com'),
  title: 'Block Bank - Credit Banking On-Chain',
  description: 'On-chain credit infrastructure for real assets',
  openGraph: {
    title: 'Block Bank - Credit Banking On-Chain',
    description: 'On-chain credit infrastructure for real assets',
    url: 'https://blockbank.app',
    siteName: 'Block Bank',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Block Bank - Credit Banking On-Chain',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Block Bank - Credit Banking On-Chain',
    description: 'On-chain credit infrastructure for real assets',
    images: ['/og-image.svg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/og-image.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Force light mode - remove any dark class
                  document.documentElement.classList.remove('dark');
                  // Remove dark theme from localStorage if present
                  localStorage.removeItem('theme');
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <Providers>
          <HeaderWrapper />
          {children}
        </Providers>
      </body>
    </html>
  )
}
