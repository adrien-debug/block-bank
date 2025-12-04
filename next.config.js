/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
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


