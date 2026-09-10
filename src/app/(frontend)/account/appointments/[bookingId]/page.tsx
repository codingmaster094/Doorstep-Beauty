import { redirect, notFound } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { getPayloadClient } from '@/lib/payload'
import { AppointmentStatus } from '@/components/ui/AppointmentStatus'
import { PriceBreakdown } from '@/components/ui/PriceBreakdown'
import { Button } from '@/components/ui/Button'
import { rel } from '@/lib/utils'
import { pageMeta } from '@/lib/seo'
import { whatsappLink, bookingWhatsappMessage } from '@/lib/whatsapp'

export async function generateMetadata({ params }: { params: Promise<{ bookingId: string }> }) {
  const { bookingId } = await params
  return pageMeta({ title: `Appointment ${bookingId}`, description: 'Appointment details.', path: `/account/appointments/${bookingId}` })
}

export default async function AppointmentDetailPage({ params }: { params: Promise<{ bookingId: string }> }) {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  const { bookingId } = await params
  const payload = await getPayloadClient()
  const found = await payload.find({
    collection: 'appointments',
    where: { and: [{ bookingId: { equals: bookingId } }, { customer: { equals: user.id } }] },
    limit: 1,
    depth: 1,
    overrideAccess: true,
  })
  const a = found.docs[0]
  if (!a) notFound()
  const settings = await payload.findGlobal({ slug: 'site-settings', overrideAccess: true })
  const service = rel(a.service)
  return (
    <div className="space-y-5">
      <h1 className="font-display text-4xl">{a.bookingId}</h1>
      <AppointmentStatus status={a.status} />
      <p>{service?.name}</p>
      <p className="text-sm text-ink-soft">{a.addressSnapshot}</p>
      <PriceBreakdown
        serviceAmount={a.serviceAmount}
        homeVisitCharge={a.homeVisitCharge}
        addonAmount={a.addonAmount}
        discount={a.discount}
        finalAmount={a.finalAmount}
      />
      {a.status === 'completed' ? (
        <Button href={`/book?service=${service?.slug || ''}`}>Book again</Button>
      ) : (
        <Button href={whatsappLink(settings.whatsapp, bookingWhatsappMessage(bookingId))}>WhatsApp about this booking</Button>
      )}
    </div>
  )
}
