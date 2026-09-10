import { getPayloadClient } from '@/lib/payload'
import { BeauticianCard } from '@/components/cards/BeauticianCard'
import { DemoNotice } from '@/components/ui/DemoNotice'
import { demoBeauticians, demoImageForBeautician } from '@/content/demo'
import { pageMeta } from '@/lib/seo'
import { mediaUrl, rel } from '@/lib/utils'

export const metadata = pageMeta({
  title: 'Beauticians in Surat',
  description: 'Meet professional women beauticians offering at-home services in Surat.',
  path: '/beauticians',
})

export default async function BeauticiansPage() {
  const payload = await getPayloadClient()
  const found = await payload.find({
    collection: 'beauticians',
    where: { active: { equals: true } },
    sort: 'sortOrder',
    limit: 50,
    depth: 2,
    overrideAccess: true,
  })
  const list = found.docs.length
    ? found.docs.map((b) => ({
        id: String(b.id),
        name: b.name,
        slug: b.slug,
        experienceYears: b.experienceYears,
        rating: b.rating ?? 0,
        specialization: rel(b.specializations?.[0])?.name,
        area: rel(b.serviceAreas?.[0])?.name,
        image: mediaUrl(rel(b.profileImage)) || demoImageForBeautician(b.slug),
      }))
    : demoBeauticians
  return (
    <div className="space-y-6">
      <DemoNotice />
      <h1 className="font-display text-5xl">Beauticians</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {list.map((b) => (
          <BeauticianCard
            key={'id' in b ? b.id : b.slug}
            name={b.name}
            slug={b.slug}
            experienceYears={b.experienceYears}
            rating={b.rating}
            specialization={b.specialization}
            area={b.area}
            image={b.image}
          />
        ))}
      </div>
    </div>
  )
}
