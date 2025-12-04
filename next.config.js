/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // output: 'standalone' - seulement pour la production Vercel
  // Désactivé en développement pour éviter les erreurs 500
  ...(process.env.NODE_ENV === 'production' && { output: 'standalone' }),
  images: {
    unoptimized: false,
  },
  // Optimizations for Vercel
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  
  // Augmenter la limite de taille pour les uploads de fichiers
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb'
    }
  }
}

module.exports = nextConfig


