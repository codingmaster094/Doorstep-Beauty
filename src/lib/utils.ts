import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function mediaUrl(
  file?: {
    url?: string | null
    filename?: string | null
    sizes?: {
      card?: { url?: string | null }
      hero?: { url?: string | null }
      thumb?: { url?: string | null }
    }
  } | string | null,
): string | undefined {
  if (!file) return undefined
  if (typeof file === 'string') {
    if (file.startsWith('http') || file.startsWith('/')) return file
    return undefined
  }
  const sized = file.sizes?.card?.url || file.sizes?.hero?.url || file.sizes?.thumb?.url
  if (sized) return sized
  if (file.url) return file.url
  if (file.filename) return `/api/media/file/${encodeURIComponent(file.filename)}`
  return undefined
}

export function rel<T>(value: T | string | null | undefined): T | undefined {
  if (!value || typeof value === 'string') return undefined
  return value
}
