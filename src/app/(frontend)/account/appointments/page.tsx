import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { getPayloadClient } from '@/lib/payload'
import { AppointmentStatus } from '@/components/ui/AppointmentStatus'
import { EmptyState } from '@/components/ui/States'
import { Button } from '@/components/ui/Button'
import { rel } from '@/lib/utils'
import { pageMeta } from '@/lib/seo'

export const metadata = pageMeta({
  title: 'My appointments',
  description: 'Your home beauty appointments.',
  path: '/account/appointments',
})

export default async function AppointmentsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  const payload = await getPayloadClient()
  const found = await payload.find({
    collection: 'appointments',
    where: { customer: { equals: user.id } },
    sort: '-appointmentDate',
    limit: 50,
    depth: 1,
    overrideAccess: true,
  })
  if (!found.docs.length) {
    return <EmptyState title="You don't have any appointments yet." action={<Button href="/book">Book now</Button>} />
  }
  return (
    <div className="space-y-4">
      <h1 className="font-display text-4xl">My appointments</h1>
      {found.docs.map((a) => (
        <a key={a.id} href={`/account/appointments/${a.bookingId}`} className="block border border-line bg-white p-4">
          <p className="font-medium">{a.bookingId}</p>
          <p className="text-sm">{rel(a.service)?.name}</p>
          <AppointmentStatus status={a.status} />
        </a>
      ))}
    </div>
  )
}
