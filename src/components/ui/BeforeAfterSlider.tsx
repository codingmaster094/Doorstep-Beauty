'use client'

import { useState } from 'react'

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  title,
}: {
  beforeSrc: string
  afterSrc: string
  title: string
}) {
  const [pos, setPos] = useState(50)
  return (
    <figure className="overflow-hidden border border-line bg-white">
      <div className="relative aspect-[4/5] overflow-hidden">
        <img src={afterSrc} alt={`${title} after`} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
          <img src={beforeSrc} alt={`${title} before`} className="h-full w-full object-cover" />
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          aria-label="Compare before and after"
          className="absolute inset-x-0 bottom-4 mx-auto w-[80%]"
          onChange={(e) => setPos(Number(e.target.value))}
        />
      </div>
      <figcaption className="px-3 py-3 text-sm">{title}</figcaption>
    </figure>
  )
}
