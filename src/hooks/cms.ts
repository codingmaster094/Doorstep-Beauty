import type { CollectionAfterChangeHook, CollectionBeforeValidateHook, GlobalAfterChangeHook } from 'payload'
import { slugify } from '@/lib/slug'

export function autoSlugFrom(field: string): CollectionBeforeValidateHook {
  return ({ data }) => {
    if (!data) return data
    const record = data as Record<string, unknown>
    if (!record.slug && typeof record[field] === 'string') {
      record.slug = slugify(record[field])
    }
    return data
  }
}

export const defaultOfferDates: CollectionBeforeValidateHook = ({ data }) => {
  if (!data) return data
  const record = data as Record<string, unknown>
  const now = new Date()
  if (!record.startDate) record.startDate = now.toISOString()
  if (!record.endDate) record.endDate = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 365).toISOString()
  return data
}

async function refreshPublicPages() {
  try {
    const { revalidatePath } = await import('next/cache')
    revalidatePath('/', 'layout')
  } catch {
    // Payload API routes and seed scripts are not always a Next render.
  }
}

export const revalidateAfterChange: CollectionAfterChangeHook = () => {
  void refreshPublicPages()
}

export const revalidateGlobalAfterChange: GlobalAfterChangeHook = () => {
  void refreshPublicPages()
}
