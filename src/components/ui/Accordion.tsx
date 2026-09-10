'use client'

import { useState } from 'react'

export function Accordion({ items }: { items: { question: string; answer: string }[] }) {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="divide-y border border-line bg-white">
      {items.map((item, index) => {
        const expanded = open === index
        return (
          <div key={item.question}>
            <button
              type="button"
              className="flex min-h-12 w-full items-center justify-between gap-3 px-4 py-3 text-left"
              aria-expanded={expanded}
              onClick={() => setOpen(expanded ? null : index)}
            >
              <span className="font-medium">{item.question}</span>
              <span aria-hidden>{expanded ? '–' : '+'}</span>
            </button>
            {expanded ? <p className="px-4 pb-4 text-sm leading-6 text-ink-soft">{item.answer}</p> : null}
          </div>
        )
      })}
    </div>
  )
}
