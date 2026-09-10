import { getPayloadClient } from '@/lib/payload'
import { PriceBreakdown } from '@/components/ui/PriceBreakdown'
import { AppointmentStatus } from '@/components/ui/AppointmentStatus'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/States'
import { pageMeta } from '@/lib/seo'
import { whatsappLink, bookingWhatsappMessage } from '@/lib/whatsapp'
import { rel } from '@/lib/utils'

export async function generateMetadata({ params }: { params: Promise<{ bookingId: string }> }) {
  const { bookingId } = await params
  return pageMeta({
    title: `Booking ${bookingId}`,
    description: 'Your home beauty appointment confirmation.',
    path: `/book/confirmation/${bookingId}`,
  })
}

export default async function ConfirmationPage({ params }: { params: Promise<{ bookingId: string }> }) {
  const { bookingId } = await params
  const payload = await getPayloadClient()
  const found = await payload.find({
    collection: 'appointments',
    where: { bookingId: { equals: bookingId } },
    limit: 1,
    depth: 1,
    overrideAccess: true,
  })
  const appointment = found.docs[0]
  const settings = await payload.findGlobal({ slug: 'site-settings', overrideAccess: true })
  if (!appointment) {
    return <EmptyState title="Booking not found" body="Check the booking ID or contact support." />
  }
  const service = rel(appointment.service)
  const slot = rel(appointment.timeSlot)
  const beautician = rel(appointment.beautician)

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <p className="text-xs uppercase tracking-[0.16em] text-gold">Booking confirmed request</p>
      <h1 className="font-display text-4xl">{appointment.bookingId}</h1>
      <AppointmentStatus status={appointment.status} />
      <p className="text-ink-soft">
        {service?.name} · {slot?.label} · {new Date(appointment.appointmentDate).toLocaleDateString('en-IN')}
      </p>
      <p>{beautician ? `Beautician: ${beautician.name}` : 'A beautician will be assigned shortly.'}</p>
      <PriceBreakdown
        serviceAmount={appointment.serviceAmount}
        homeVisitCharge={appointment.homeVisitCharge}
        addonAmount={appointment.addonAmount}
        discount={appointment.discount}
        finalAmount={appointment.finalAmount}
      />
      <div className="flex flex-col gap-3">
        <Button href={whatsappLink(settings.whatsapp, bookingWhatsappMessage(bookingId))}>WhatsApp support</Button>
        <Button href={`/book?service=${service?.slug || ''}`} variant="secondary">
          Book again
        </Button>
      </div>
    </div>
  )
}
