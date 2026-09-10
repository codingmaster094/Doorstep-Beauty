import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { getPayloadClient } from '@/lib/payload'
import { EmptyState } from '@/components/ui/States'
import { Button } from '@/components/ui/Button'
import { rel } from '@/lib/utils'
import { pageMeta } from '@/lib/seo'

export const metadata = pageMeta({
  title: 'Saved addresses',
  description: 'Your saved home service addresses.',
  path: '/account/addresses',
})

export default async function AddressesPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  const payload = await getPayloadClient()
  const found = await payload.find({
    collection: 'addresses',
    where: { customer: { equals: user.id } },
    limit: 20,
    depth: 1,
    overrideAccess: true,
  })
  return (
    <div className="space-y-4">
      <h1 className="font-display text-4xl">Saved addresses</h1>
      {!found.docs.length ? (
        <EmptyState title="No saved addresses yet." body="Addresses added during booking will appear here." />
      ) : (
        found.docs.map((a) => (
          <div key={a.id} className="border border-line bg-white p-4">
            <p className="text-xs uppercase tracking-wider">{a.label}</p>
            <p className="mt-1">{a.addressLine}</p>
            <p className="text-sm text-ink-soft">
              {rel(a.area)?.name}, {a.city} {a.pincode}
            </p>
          </div>
        ))
      )}
      <Button href="/book">Add via booking</Button>
    </div>
  )
}
