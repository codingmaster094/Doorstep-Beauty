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
    <article className="border border-line bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="font-medium">{name}</p>
        {verified ? <Badge>Verified</Badge> : null}
      </div>
      <Rating value={rating} />
      {service ? <p className="mt-1 text-xs uppercase tracking-wider text-ink-soft">{service}</p> : null}
      <p className="mt-3 text-sm leading-6 text-ink-soft">{review}</p>
    </article>
  )
}
