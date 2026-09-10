import { getPayloadClient } from '@/lib/payload'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/States'
import { pageMeta } from '@/lib/seo'
import { mediaUrl, rel } from '@/lib/utils'

export const metadata = pageMeta({
  title: 'Offers in Surat',
  description: 'Current home beauty service offers and coupons in Surat.',
  path: '/offers',
})

export default async function OffersPage() {
  const payload = await getPayloadClient()
  const found = await payload.find({
    collection: 'offers',
    where: { active: { equals: true } },
    limit: 20,
    depth: 2,
    overrideAccess: true,
  })
  const nowMs = Date.now()
  const list = found.docs.filter((o) => {
    if (o.endDate && new Date(o.endDate).getTime() < nowMs) return false
    if (o.startDate && new Date(o.startDate).getTime() > nowMs) return false
    return true
  })
  return (
    <div className="space-y-6">
      <h1 className="font-display text-5xl">Offers</h1>
      {list.length ? (
        <div className="grid gap-4">
          {list.map((o) => {
            const coupon = rel(o.coupon)
            return (
              <article key={o.id} className="overflow-hidden rounded-2xl border border-gold/20 bg-white p-4 shadow-[0_12px_28px_rgba(90,36,50,0.06)]">
                {mediaUrl(rel(o.banner)) ? (
                  <img src={mediaUrl(rel(o.banner))} alt={o.title} className="mb-3 aspect-[16/7] w-full object-cover" />
                ) : null}
                <h2 className="font-display text-3xl">{o.title}</h2>
                <p className="mt-2 text-sm text-ink-soft">{o.description}</p>
                {coupon ? (
                  <p className="mt-3 text-sm">
                    Code{' '}
                    <a className="text-rose" href={`/coupon/${coupon.code}`}>
                      {coupon.code}
                    </a>
                  </p>
                ) : null}
                <Button href="/book" className="mt-4">
                  Book with offer
                </Button>
              </article>
            )
          })}
        </div>
      ) : (
        <EmptyState title="No offers yet" body="Add offers in Admin and they will appear here." />
      )}
    </div>
  )
}
