import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
import { ServiceCard } from '@/components/cards/ServiceCard'
import { ServiceFilters } from '@/components/catalog/ServiceFilters'
import { pageMeta } from '@/lib/seo'
import { serviceSellPrice } from '@/lib/pricing/money'
import { DemoNotice } from '@/components/ui/DemoNotice'
import { demoImageForService, demoServices } from '@/content/demo'
import { mediaUrl, rel } from '@/lib/utils'

export const metadata = pageMeta({
  title: 'Beauty services at home in Surat',
  description: 'Browse facials, waxing, makeup, bridal and salon-at-home services in Surat.',
  path: '/services',
})

export default async function ServicesPage() {
  const payload = await getPayloadClient()
  const [categories, services] = await Promise.all([
    payload.find({ collection: 'service-categories', where: { active: { equals: true } }, sort: 'sortOrder', limit: 50, overrideAccess: true }),
    payload.find({
      collection: 'services',
      where: { available: { equals: true } },
      sort: 'sortOrder',
      limit: 100,
      depth: 2,
      overrideAccess: true,
    }),
  ])

  const list = services.docs.length
    ? services.docs.map((s) => {
        const cat = rel(s.category)
        return {
          id: String(s.id),
          name: s.name,
          slug: s.slug,
          categorySlug: cat?.slug || 'all',
          price: serviceSellPrice(s),
          durationMinutes: s.durationMinutes,
          image: mediaUrl(rel(s.featuredImage)) || demoImageForService(s.slug),
        }
      })
    : demoServices
  const categoryLinks = categories.docs.length
    ? categories.docs
    : [...new Set(demoServices.map((s) => s.categorySlug))].map((slug) => ({
        id: slug,
        slug,
        name: slug.replace(/-/g, ' '),
      }))

  return (
    <div className="space-y-8">
      <DemoNotice />
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-5xl">Services</h1>
        <ServiceFilters categories={categoryLinks.map((c) => ({ slug: c.slug, name: c.name }))} />
      </div>
      <div className="flex flex-wrap gap-2">
        {categoryLinks.map((c) => (
          <Link key={c.id} href={`/services/${c.slug}`} className="min-h-11 border border-line bg-white px-4 py-2 text-sm">
            {c.name}
          </Link>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((s) => (
            <ServiceCard
              key={'id' in s ? s.id : s.slug}
              name={s.name}
              slug={s.slug}
              categorySlug={s.categorySlug}
              price={s.price}
              durationMinutes={s.durationMinutes}
              image={s.image}
            />
        ))}
      </div>
    </div>
  )
}
