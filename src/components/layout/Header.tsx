'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

const links = [
  { href: '/services', label: 'Services' },
  { href: '/beauticians', label: 'Beauticians' },
  { href: '/offers', label: 'Offers' },
  { href: '/before-after', label: 'Results' },
  { href: '/reels', label: 'Reels' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function Header({ businessName }: { businessName: string }) {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-cream/95 backdrop-blur">
      <div className="mx-auto flex min-h-14 max-w-6xl items-center justify-between gap-3 px-4">
        <Link href="/" className="font-display text-2xl tracking-wide text-rose">
          {businessName}
        </Link>
        <nav className="hidden items-center gap-5 lg:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm text-ink-soft hover:text-ink">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button href="/book" className="hidden sm:inline-flex">
            Book home service
          </Button>
          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center border border-line bg-white lg:hidden"
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
            <Link key={l.href} href={l.href} className="block min-h-11 py-3" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <Link href="/search" className="block min-h-11 py-3">
            Search
          </Link>
          <Link href="/account" className="block min-h-11 py-3">
            Account
          </Link>
        </div>
      ) : null}
    </header>
  )
}
