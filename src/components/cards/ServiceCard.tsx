import Link from 'next/link'
import { formatInr } from '@/lib/pricing/money'
import { Button } from '@/components/ui/Button'
import { mediaUrl } from '@/lib/utils'

export function ServiceCard({
  name,
  slug,
  categorySlug,
  price,
  durationMinutes,
  image,
}: {
  name: string
  slug: string
  categorySlug: string
  price: number
  durationMinutes: number
  image?: { url?: string | null } | string | null
}) {
  const href = `/services/${categorySlug}/${slug}`
  return (
    <article className="flex min-w-[220px] snap-start flex-col border border-line bg-white">
      <Link href={href} className="block aspect-[4/5] overflow-hidden bg-blush">
        {mediaUrl(image) ? (
          <img src={mediaUrl(image)} alt={name} className="h-full w-full object-cover" loading="lazy" />
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
