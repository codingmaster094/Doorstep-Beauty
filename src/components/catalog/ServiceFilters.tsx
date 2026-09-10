'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BottomSheet } from '@/components/ui/Overlay'
import { Button } from '@/components/ui/Button'

export function ServiceFilters({
  categories,
  current,
}: {
  categories: { slug: string; name: string }[]
  current?: string
}) {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Filters
      </Button>
      <BottomSheet open={open} title="Filter services" onClose={() => setOpen(false)}>
        <div className="flex flex-col gap-2">
          <Link className="min-h-11 py-3" href="/services">
            All
          </Link>
          {categories.map((c) => (
            <Link key={c.slug} className="min-h-11 py-3" href={`/services/${c.slug}`}>
              {c.name}
              {current === c.slug ? ' · selected' : ''}
            </Link>
          ))}
        </div>
      </BottomSheet>
    </div>
  )
}
