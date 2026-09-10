'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import type { NavLink } from '@/lib/navigation'

export function Header({
  businessName,
  logoUrl,
  links,
  ctaLabel,
  ctaHref,
}: {
  businessName: string
  logoUrl?: string
  links: NavLink[]
  ctaLabel: string
  ctaHref: string
}) {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-cream/95 backdrop-blur">
      <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <Link href="/" className="flex min-h-11 items-center gap-2 text-rose">
          {logoUrl ? (
            <img src={logoUrl} alt={businessName} className="h-10 w-auto max-w-36 object-contain" />
          ) : (
            <span className="font-display text-2xl tracking-wide">{businessName}</span>
          )}
        </Link>
        <nav className="hidden items-center gap-5 lg:flex" aria-label="Main">
          {links.map((l) => (
            <Link key={l.href + l.label} href={l.href} className="text-sm text-ink-soft hover:text-ink">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button href={ctaHref} className="hidden sm:inline-flex">
            {ctaLabel}
          </Button>
          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center border border-line bg-white px-3 text-sm lg:hidden"
            aria-expanded={open}
            aria-label="Open menu"
            onClick={() => setOpen((v) => !v)}
          >
            Menu
          </button>
        </div>
      </div>
      {open ? (
        <div className="border-t border-line bg-white px-4 py-3 lg:hidden">
          {links.map((l) => (
            <Link key={l.href + l.label} href={l.href} className="block min-h-11 py-3" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <Link href="/search" className="block min-h-11 py-3" onClick={() => setOpen(false)}>
            Search
          </Link>
          <Link href="/account" className="block min-h-11 py-3" onClick={() => setOpen(false)}>
            Account
          </Link>
          <Button href={ctaHref} className="mt-2 w-full">
            {ctaLabel}
          </Button>
        </div>
      ) : null}
    </header>
  )
}
