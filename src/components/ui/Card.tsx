import { cn } from '@/lib/utils'

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('border border-line bg-white p-4', className)}>{children}</div>
}

export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center border border-line bg-blush px-2 py-0.5 text-[11px] uppercase tracking-[0.14em] text-rose">
      {children}
    </span>
  )
}

export function Rating({ value }: { value: number }) {
  const stars = Math.round(value)
  return (
    <span className="text-sm text-gold" aria-label={`${value} out of 5`}>
      {'★'.repeat(stars)}
      <span className="text-line">{'★'.repeat(Math.max(0, 5 - stars))}</span>
    </span>
  )
}

export function Avatar({ name, src }: { name: string; src?: string }) {
  return src ? (
    <img src={src} alt={name} className="h-12 w-12 object-cover" />
  ) : (
    <div className="flex h-12 w-12 items-center justify-center bg-blush text-rose">{name.slice(0, 1)}</div>
  )
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse bg-blush', className)} />
}
