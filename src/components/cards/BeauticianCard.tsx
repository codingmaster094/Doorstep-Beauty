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
    <article className="border border-line bg-white p-4">
      <div className="flex gap-3">
        {mediaUrl(image) ? (
          <img src={mediaUrl(image)} alt={name} className="h-20 w-16 object-cover" />
        ) : (
          <div className="flex h-20 w-16 items-center justify-center bg-blush text-rose">{name.slice(0, 1)}</div>
        )}
        <div>
          <h3 className="font-display text-2xl leading-none">{name}</h3>
          <p className="mt-1 text-sm text-ink-soft">{specialization}</p>
          <p className="text-sm">{experienceYears}+ years · {area || 'Surat'}</p>
          <Rating value={rating} />
        </div>
      </div>
      <Button href={`/beauticians/${slug}`} variant="secondary" className="mt-4 w-full">
        View profile
      </Button>
    </article>
  )
}
