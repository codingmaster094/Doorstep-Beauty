import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.1.24', 'localhost', '127.0.0.1'],
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        'localhost:3001',
        '127.0.0.1:3000',
        '127.0.0.1:3001',
        '192.168.1.24:3000',
        '192.168.1.24:3001',
      ],
      bodySizeLimit: '80mb',
    },
  },
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: 'localhost' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
}

export default withPayload(nextConfig)
