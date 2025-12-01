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
}

module.exports = nextConfig


