import type { Payload } from 'payload'

export async function generateBookingId(payload: Payload): Promise<string> {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const prefix = `BS-${y}${m}${d}-`

  const existing = await payload.find({
    collection: 'appointments',
    where: { bookingId: { like: prefix } },
    limit: 1,
    sort: '-bookingId',
    overrideAccess: true,
  })

  const last = existing.docs[0]?.bookingId as string | undefined
  const lastSeq = last ? Number(last.split('-').at(-1)) : 0
  const next = Number.isFinite(lastSeq) ? lastSeq + 1 : 1
  return `${prefix}${String(next).padStart(4, '0')}`
}
