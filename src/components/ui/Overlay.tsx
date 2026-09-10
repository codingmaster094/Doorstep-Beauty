'use client'

import { useEffect } from 'react'

export function Modal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean
  title: string
  children: React.ReactNode
  onClose: () => void
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
      <button className="absolute inset-0" aria-label="Close" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg border border-line bg-white p-5">
        <h2 id="dialog-title" className="font-display text-3xl">
          {title}
        </h2>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  )
}

export function BottomSheet({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean
  title: string
  children: React.ReactNode
  onClose: () => void
}) {
  return (
    <Modal open={open} title={title} onClose={onClose}>
      {children}
    </Modal>
  )
}

export function Drawer({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean
  title: string
  children: React.ReactNode
  onClose: () => void
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <button className="absolute inset-0 bg-ink/40" aria-label="Close" onClick={onClose} />
      <aside className="absolute inset-y-0 right-0 w-[min(100%,22rem)] overflow-y-auto bg-white p-5">
        <h2 className="font-display text-3xl">{title}</h2>
        <div className="mt-4">{children}</div>
      </aside>
    </div>
  )
}
