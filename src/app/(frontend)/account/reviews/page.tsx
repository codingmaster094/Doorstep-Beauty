import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { getPayloadClient } from '@/lib/payload'
import { ReviewCard } from '@/components/cards/ReviewCard'
import { EmptyState } from '@/components/ui/States'
import { rel } from '@/lib/utils'
import { pageMeta } from '@/lib/seo'

export const metadata = pageMeta({
  title: 'My reviews',
  description: 'Reviews you have submitted.',
  path: '/account/reviews',
})

export default async function MyReviewsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  const payload = await getPayloadClient()
  const found = await payload.find({
    collection: 'reviews',
    where: { customer: { equals: user.id } },
    limit: 50,
    depth: 1,
    overrideAccess: true,
  })
  if (!found.docs.length) return <EmptyState title="You have not written any reviews yet." />
  return (
    <div className="space-y-4">
      <h1 className="font-display text-4xl">My reviews</h1>
      {found.docs.map((r) => (
        <ReviewCard
          key={r.id}
          name={r.customerName}
          rating={r.rating}
          review={r.review}
          service={rel(r.service)?.name}
          verified={Boolean(r.verifiedCustomer)}
        />
      ))}
    </div>
  )
}
