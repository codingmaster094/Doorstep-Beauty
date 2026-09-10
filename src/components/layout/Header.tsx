'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { CloseIcon, MenuIcon } from '@/components/ui/Icons'
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
    <header className="sticky top-0 z-30 border-b border-gold/25 bg-cream/90 backdrop-blur-md">
      <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <Link href="/" className="flex min-h-11 items-center gap-2 text-rose">
          {logoUrl ? (
            <img src={logoUrl} alt={businessName} className="h-11 w-auto max-w-32 object-contain sm:h-14 sm:max-w-40" />
          ) : (
            <span className="font-display text-2xl tracking-wide">{businessName}</span>
          )}
        </Link>
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Main">
          {links.map((l) => (
            <Link
              key={l.href + l.label}
              href={l.href}
              className="nav-link text-[13px] uppercase tracking-[0.14em] text-ink-soft transition hover:text-rose"
            >
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
            className="salon-nav-btn lg:hidden"
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open ? (
        <div className="border-t border-gold/20 bg-white/95 px-4 py-4 lg:hidden">
          {links.map((l) => (
            <Link
              key={l.href + l.label}
              href={l.href}
              className="block min-h-11 border-b border-line/70 py-3 text-sm tracking-wide"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/search" className="block min-h-11 border-b border-line/70 py-3" onClick={() => setOpen(false)}>
            Search
          </Link>
          <Link href="/account" className="block min-h-11 py-3" onClick={() => setOpen(false)}>
            Account
          </Link>
          <Button href={ctaHref} className="mt-3 w-full">
            {ctaLabel}
          </Button>
        </div>
      ) : null}
    </header>
  )
}
