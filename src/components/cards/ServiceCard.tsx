import Link from 'next/link'
import { formatInr } from '@/lib/pricing/money'
import { Button } from '@/components/ui/Button'
import { cn, mediaUrl } from '@/lib/utils'

export function ServiceCard({
  name,
  slug,
  categorySlug,
  price,
  durationMinutes,
  image,
  className,
}: {
  name: string
  slug: string
  categorySlug: string
  price: number
  durationMinutes: number
  image?: { url?: string | null } | string | null
  className?: string
}) {
  const href = `/services/${categorySlug}/${slug}`
  return (
    <article
      className={cn(
        'flex min-w-0 flex-col overflow-hidden rounded-2xl border border-gold/20 bg-white shadow-[0_12px_28px_rgba(90,36,50,0.06)] salon-card',
        className,
      )}
    >
      <Link href={href} className="shine block aspect-[4/5] overflow-hidden bg-blush">
        {mediaUrl(image) ? (
          <img
            src={mediaUrl(image)}
            alt={name}
            className="h-full w-full object-cover transition duration-700 hover:scale-[1.08]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-end p-4 font-display text-3xl text-rose">{name}</div>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-display text-2xl leading-none">{name}</h3>
        <p className="text-sm text-ink-soft">
          From {formatInr(price)} · {durationMinutes} min
        </p>
        <Button href={href} className="mt-auto w-full">
          View & book
        </Button>
      </div>
    </article>
  )
}
