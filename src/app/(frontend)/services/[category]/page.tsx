import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
import { ServiceCard } from '@/components/cards/ServiceCard'
import { EmptyState } from '@/components/ui/States'
import { pageMeta } from '@/lib/seo'
import { serviceSellPrice } from '@/lib/pricing/money'
import { demoImageForService } from '@/content/demo'
import { mediaUrl, rel } from '@/lib/utils'

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  const payload = await getPayloadClient()
  const found = await payload.find({ collection: 'service-categories', where: { slug: { equals: category } }, limit: 1, overrideAccess: true })
  const cat = found.docs[0]
  if (!cat) return {}
  return pageMeta({
    title: cat.seo?.title || `${cat.name} at home in Surat`,
    description: cat.seo?.description || cat.shortDescription || `${cat.name} home service in Surat.`,
    path: `/services/${category}`,
  })
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  const payload = await getPayloadClient()
  const found = await payload.find({ collection: 'service-categories', where: { slug: { equals: category } }, limit: 1, overrideAccess: true })
  const cat = found.docs[0]
  if (!cat) notFound()
  const services = await payload.find({
    collection: 'services',
    where: { and: [{ available: { equals: true } }, { category: { equals: cat.id } }] },
    depth: 2,
    limit: 50,
    overrideAccess: true,
  })
  if (!services.docs.length) return <EmptyState title="No services found." />
  return (
    <div className="space-y-6">
      <p className="text-sm text-ink-soft">
        <Link href="/services">Services</Link> / {cat.name}
      </p>
      <h1 className="font-display text-5xl">{cat.name}</h1>
      <p className="text-ink-soft">{cat.shortDescription}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {services.docs.map((s) => (
          <ServiceCard
            key={s.id}
            name={s.name}
            slug={s.slug}
            categorySlug={cat.slug}
            price={serviceSellPrice(s)}
            durationMinutes={s.durationMinutes}
            image={mediaUrl(rel(s.featuredImage)) || demoImageForService(s.slug)}
          />
        ))}
      </div>
    </div>
  )
}
