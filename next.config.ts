import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
  async headers() {
    return [
      {
        source: '/',
        headers: [
          { key: 'Cache-Control', value: 'no-store' },
          { key: 'Netlify-CDN-Cache-Control', value: 'no-store' },
          { key: 'CDN-Cache-Control', value: 'no-store' },
        ],
      },
    ]
  },
}

export default nextConfig
