import type { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/payload'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  const payload = await getPayloadClient()
  const [services, categories, beauticians] = await Promise.all([
    payload.find({ collection: 'services', where: { available: { equals: true } }, limit: 200, depth: 1, overrideAccess: true }),
    payload.find({ collection: 'service-categories', where: { active: { equals: true } }, limit: 50, overrideAccess: true }),
    payload.find({ collection: 'beauticians', where: { active: { equals: true } }, limit: 100, overrideAccess: true }),
  ])

  const staticPaths = ['', '/services', '/beauticians', '/before-after', '/reels', '/offers', '/about', '/contact', '/faq', '/privacy', '/terms', '/cancellation', '/refund', '/book']

  return [
    ...staticPaths.map((p) => ({ url: `${base}${p || '/'}`, changeFrequency: 'weekly' as const, priority: p === '' ? 1 : 0.7 })),
    ...categories.docs.map((c) => ({ url: `${base}/services/${c.slug}`, changeFrequency: 'weekly' as const, priority: 0.8 })),
    ...services.docs.map((s) => ({
      url: `${base}/services/${typeof s.category === 'object' ? s.category.slug : 'all'}/${s.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...beauticians.docs.map((b) => ({ url: `${base}/beauticians/${b.slug}`, changeFrequency: 'monthly' as const, priority: 0.6 })),
  ]
}
