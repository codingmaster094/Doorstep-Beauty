'use client'

import { useState } from 'react'

export function Accordion({ items }: { items: { question: string; answer: string }[] }) {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="overflow-hidden rounded-2xl border border-gold/20 bg-white">
      {items.map((item, index) => {
        const expanded = open === index
        return (
          <div key={item.question} className="border-b border-line last:border-b-0">
            <button
              type="button"
              className="flex min-h-12 w-full items-center justify-between gap-3 px-4 py-3 text-left"
              aria-expanded={expanded}
              onClick={() => setOpen(expanded ? null : index)}
            >
              <span className="font-medium">{item.question}</span>
              <span className="text-gold" aria-hidden>
                {expanded ? '–' : '+'}
              </span>
            </button>
            {expanded ? <p className="px-4 pb-4 text-sm leading-7 text-ink-soft">{item.answer}</p> : null}
          </div>
        )
      })}
    </div>
  )
}
