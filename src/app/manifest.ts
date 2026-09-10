import type { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/payload'

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  let name = 'Bloom At Home'
  let description = 'Professional beauty services at home in Surat.'
  try {
    const payload = await getPayloadClient()
    const settings = await payload.findGlobal({ slug: 'site-settings', overrideAccess: true })
    name = settings.businessName || name
    description = settings.seo?.defaultDescription || settings.tagline || description
  } catch {
    // Build/preview without a database still gets a valid install manifest.
  }

  return {
    name,
    short_name: name.length > 12 ? name.slice(0, 12) : name,
    description,
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#f8f1ea',
    theme_color: '#7a3045',
    categories: ['lifestyle', 'health'],
    icons: [
      { src: '/icons/192', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/512', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/512', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
