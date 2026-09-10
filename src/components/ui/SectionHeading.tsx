import Link from 'next/link'

export function SectionHeading({
  title,
  href,
  hrefLabel = 'View all',
  actions,
}: {
  title?: string | null
  href?: string
  hrefLabel?: string
  actions?: React.ReactNode
}) {
  if (!title && !href && !actions) return null
  return (
    <div className="mb-5 flex items-end justify-between gap-3">
      <div className="min-w-0">
        {title ? <h2 className="font-display text-[2rem] leading-none text-ink sm:text-4xl">{title}</h2> : null}
        <span className="ornament mt-3" />
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {actions}
        {href ? (
          <Link href={href} className="text-xs font-medium uppercase tracking-[0.16em] text-rose">
            {hrefLabel}
          </Link>
        ) : null}
      </div>
    </div>
  )
}
