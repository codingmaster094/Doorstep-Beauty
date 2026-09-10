import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { getPayloadClient } from '@/lib/payload'
import { Button } from '@/components/ui/Button'
import { AppointmentStatus } from '@/components/ui/AppointmentStatus'
import { EmptyState } from '@/components/ui/States'
import { rel } from '@/lib/utils'
import { pageMeta } from '@/lib/seo'

export const metadata = pageMeta({
  title: 'Your account',
  description: 'Manage appointments, addresses and reviews.',
  path: '/account',
})

export default async function AccountPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  const payload = await getPayloadClient()
  const upcoming = await payload.find({
    collection: 'appointments',
    where: {
      and: [
        { customer: { equals: user.id } },
        { status: { in: ['pending', 'confirmed', 'assigned', 'on-the-way', 'arrived', 'service-started'] } },
      ],
    },
    sort: 'appointmentDate',
    limit: 3,
    depth: 1,
    overrideAccess: true,
  })

  return (
    <div className="space-y-6">
      <h1 className="font-display text-5xl">Hello, {user.name}</h1>
      <nav className="grid grid-cols-2 gap-3">
        <Button href="/account/appointments" variant="secondary">Appointments</Button>
        <Button href="/account/addresses" variant="secondary">Addresses</Button>
        <Button href="/account/reviews" variant="secondary">Reviews</Button>
        <Button href="/book" variant="secondary">Book now</Button>
      </nav>
      <section>
        <h2 className="font-display text-3xl">Upcoming</h2>
        {!upcoming.docs.length ? (
          <EmptyState title="You don't have any appointments yet." action={<Button href="/book">Book now</Button>} />
        ) : (
          <div className="mt-3 space-y-3">
            {upcoming.docs.map((a) => (
              <a key={a.id} href={`/account/appointments/${a.bookingId}`} className="block border border-line bg-white p-4">
                <p className="font-medium">{rel(a.service)?.name}</p>
                <AppointmentStatus status={a.status} />
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
