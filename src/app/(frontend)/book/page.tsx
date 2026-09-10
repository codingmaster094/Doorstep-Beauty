import { getPayloadClient } from '@/lib/payload'
import { BookingWizard } from '@/components/booking/BookingWizard'
import { pageMeta } from '@/lib/seo'
import { rel } from '@/lib/utils'

export const metadata = pageMeta({
  title: 'Book a home beauty appointment',
  description: 'Choose a service, date and time for a professional beautician to visit your home in Surat.',
  path: '/book',
})

export default async function BookPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const { service } = await searchParams
  const payload = await getPayloadClient()
  const [services, areas, beauticians] = await Promise.all([
    payload.find({
      collection: 'services',
      where: { available: { equals: true } },
      limit: 100,
      depth: 1,
      overrideAccess: true,
    }),
    payload.find({ collection: 'service-areas', where: { active: { equals: true } }, limit: 50, overrideAccess: true }),
    payload.find({ collection: 'beauticians', where: { active: { equals: true } }, limit: 50, overrideAccess: true }),
  ])

  const addonsByService: Record<string, { id: string; name: string; price: number }[]> = {}
  for (const s of services.docs) {
    addonsByService[String(s.id)] = (s.addons || [])
      .map((a) => rel(a))
      .filter(Boolean)
      .map((a) => ({ id: String(a!.id), name: a!.name, price: a!.price }))
  }

  const initial = services.docs.find((s) => s.slug === service)

  return (
    <BookingWizard
      initialServiceId={initial ? String(initial.id) : undefined}
      services={services.docs.map((s) => ({
        id: String(s.id),
        name: s.name,
        durationMinutes: s.durationMinutes,
        basePrice: s.basePrice,
        salePrice: s.salePrice,
      }))}
      addonsByService={addonsByService}
      areas={areas.docs.map((a) => ({ id: String(a.id), name: a.name, homeVisitCharge: a.homeVisitCharge }))}
      beauticians={beauticians.docs.map((b) => ({ id: String(b.id), name: b.name }))}
    />
  )
}
