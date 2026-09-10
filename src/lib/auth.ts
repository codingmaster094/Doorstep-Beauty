import { headers } from 'next/headers'
import { getPayloadClient } from '@/lib/payload'

export async function getCurrentUser() {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: await headers() })
  return user
}
