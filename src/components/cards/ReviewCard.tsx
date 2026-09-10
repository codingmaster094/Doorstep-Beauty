import { Rating } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Card'

export function ReviewCard({
  name,
  rating,
  review,
  service,
  verified,
}: {
  name: string
  rating: number
  review: string
  service?: string
  verified?: boolean
}) {
  return (
    <article className="salon-card rounded-2xl border border-gold/20 bg-white p-5 shadow-[0_12px_28px_rgba(90,36,50,0.06)]">
      <div className="flex items-center justify-between gap-3">
        <p className="font-medium">{name}</p>
        {verified ? <Badge>Verified</Badge> : null}
      </div>
      <Rating value={rating} />
      {service ? <p className="mt-1 text-xs uppercase tracking-wider text-gold">{service}</p> : null}
      <p className="mt-3 font-display text-xl leading-7 text-ink-soft">“{review}”</p>
    </article>
  )
}
