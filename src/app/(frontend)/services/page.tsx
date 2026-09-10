import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
import { ServiceCard } from '@/components/cards/ServiceCard'
import { ServiceFilters } from '@/components/catalog/ServiceFilters'
import { EmptyState } from '@/components/ui/States'
import { pageMeta } from '@/lib/seo'
import { serviceSellPrice } from '@/lib/pricing/money'
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

  const list = services.docs.map((s) => {
    const cat = rel(s.category)
    return {
      id: String(s.id),
      name: s.name,
      slug: s.slug,
      categorySlug: cat?.slug || 'all',
      price: serviceSellPrice(s),
      durationMinutes: s.durationMinutes,
      image: mediaUrl(rel(s.featuredImage)),
    }
  })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-5xl">Services</h1>
        {categories.docs.length ? (
          <ServiceFilters categories={categories.docs.map((c) => ({ slug: c.slug, name: c.name }))} />
        ) : null}
      </div>
      {categories.docs.length ? (
        <div className="flex flex-wrap gap-2">
          {categories.docs.map((c) => (
            <Link key={c.id} href={`/services/${c.slug}`} className="min-h-11 rounded-full border border-gold/30 bg-white px-4 py-2 text-sm hover:bg-blush">
              {c.name}
            </Link>
          ))}
        </div>
      ) : null}
      {list.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((s) => (
            <ServiceCard
              key={s.id}
              name={s.name}
              slug={s.slug}
              categorySlug={s.categorySlug}
              price={s.price}
              durationMinutes={s.durationMinutes}
              image={s.image}
            />
          ))}
        </div>
      ) : (
        <EmptyState title="No services yet" body="Add services in Admin and they will appear here." />
      )}
    </div>
  )
}
