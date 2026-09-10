import { cn } from '@/lib/utils'

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('rounded-2xl border border-gold/20 bg-white p-4 shadow-[0_10px_30px_rgba(90,36,50,0.05)]', className)}>{children}</div>
}

export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-gold/40 bg-blush px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-rose">
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
    <img src={src} alt={name} className="h-12 w-12 rounded-full object-cover" />
  ) : (
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blush text-rose">{name.slice(0, 1)}</div>
  )
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-xl bg-blush', className)} />
}
