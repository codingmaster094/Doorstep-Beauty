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
    revalidatePath('/services')
    revalidatePath('/beauticians')
    revalidatePath('/offers')
    revalidatePath('/reels')
    revalidatePath('/before-after')
    revalidatePath('/faq')
  } catch {
    // Seed and other CLI scripts are not inside a Next request.
  }
}

export const revalidateAfterChange: CollectionAfterChangeHook = async () => {
  await refreshPublicPages()
}

export const revalidateGlobalAfterChange: GlobalAfterChangeHook = async () => {
  await refreshPublicPages()
}
