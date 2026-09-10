'use client'

import { useState } from 'react'

export function Toast({ message }: { message: string }) {
  const [open, setOpen] = useState(Boolean(message))
  if (!open) return null
  return (
    <div role="status" className="fixed bottom-20 left-4 right-4 z-50 border border-line bg-white px-4 py-3 md:bottom-6">
      <div className="flex items-center justify-between gap-3">
        <p>{message}</p>
        <button type="button" className="min-h-11 min-w-11" onClick={() => setOpen(false)}>
          Close
        </button>
      </div>
    </div>
  )
}
