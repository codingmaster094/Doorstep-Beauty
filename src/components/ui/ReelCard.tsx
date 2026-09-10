'use client'

import { useState } from 'react'

export function ReelCard({
  title,
  caption,
  thumbnail,
  videoUrl,
  externalUrl,
}: {
  title: string
  caption?: string
  thumbnail?: string
  videoUrl?: string
  externalUrl?: string
}) {
  const [play, setPlay] = useState(false)
  return (
    <article className="salon-card min-w-[220px] max-w-[240px] snap-start overflow-hidden rounded-2xl border border-gold/20 bg-white shadow-[0_12px_28px_rgba(90,36,50,0.06)]">
      <div className="relative aspect-[9/16] bg-blush">
        {play && videoUrl ? (
          <video src={videoUrl} controls className="h-full w-full object-cover" />
        ) : thumbnail ? (
          <img src={thumbnail} alt={title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-ink-soft">Reel</div>
        )}
        {!play && videoUrl ? (
          <button
            type="button"
            className="absolute inset-0 flex items-center justify-center bg-ink/20 text-white"
            onClick={() => setPlay(true)}
          >
            Play video
          </button>
        ) : null}
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium">{title}</h3>
        {caption ? <p className="mt-1 line-clamp-2 text-xs text-ink-soft">{caption}</p> : null}
        {externalUrl ? (
          <a className="mt-2 inline-block text-xs text-rose underline" href={externalUrl} target="_blank" rel="noreferrer">
            Watch on Instagram
          </a>
        ) : null}
      </div>
    </article>
  )
}
