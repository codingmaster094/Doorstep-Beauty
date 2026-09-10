import { Button } from '@/components/ui/Button'
import { Rating } from '@/components/ui/Card'
import { mediaUrl } from '@/lib/utils'

export function BeauticianCard({
  name,
  slug,
  specialization,
  experienceYears,
  rating,
  area,
  image,
}: {
  name: string
  slug: string
  specialization?: string
  experienceYears: number
  rating: number
  area?: string
  image?: { url?: string | null } | string | null
}) {
  return (
    <article className="salon-card rounded-2xl border border-gold/20 bg-white p-4 shadow-[0_12px_28px_rgba(90,36,50,0.06)]">
      <div className="flex gap-4">
        {mediaUrl(image) ? (
          <img
            src={mediaUrl(image)}
            alt={name}
            className="h-24 w-20 rounded-xl object-cover ring-1 ring-gold/40 transition duration-500 hover:scale-105"
          />
        ) : (
          <div className="flex h-24 w-20 items-center justify-center rounded-xl bg-blush font-display text-3xl text-rose">
            {name.slice(0, 1)}
          </div>
        )}
        <div>
          <h3 className="font-display text-2xl leading-none">{name}</h3>
          <p className="mt-1 text-sm italic text-gold">{specialization}</p>
          <p className="mt-1 text-sm text-ink-soft">
            {experienceYears}+ years · {area || 'Surat'}
          </p>
          <Rating value={rating} />
        </div>
      </div>
      <Button href={`/beauticians/${slug}`} variant="secondary" className="mt-4 w-full">
        View profile
      </Button>
    </article>
  )
}
