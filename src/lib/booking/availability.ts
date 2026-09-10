import type { Payload, Where } from 'payload'
import { BLOCKING_STATUSES } from '@/lib/pricing/money'

function weekdayOf(dateIso: string): string {
  return String(new Date(`${dateIso}T12:00:00`).getDay())
}

function relId(value: unknown): string | undefined {
  if (!value) return undefined
  if (typeof value === 'string') return value
  if (typeof value === 'object' && value && 'id' in value) return String((value as { id: string }).id)
  return undefined
}

export async function isDateDisabled(payload: Payload, dateIso: string): Promise<boolean> {
  const start = new Date(`${dateIso}T00:00:00.000Z`)
  const end = new Date(`${dateIso}T23:59:59.999Z`)
  const found = await payload.find({
    collection: 'disabled-dates',
    where: {
      date: {
        greater_than_equal: start.toISOString(),
        less_than_equal: end.toISOString(),
      },
    },
    limit: 1,
    overrideAccess: true,
  })
  return found.totalDocs > 0
}

export async function countSlotBookings(
  payload: Payload,
  args: { dateIso: string; slotId: string; beauticianId?: string },
): Promise<number> {
  const start = new Date(`${args.dateIso}T00:00:00.000Z`)
  const end = new Date(`${args.dateIso}T23:59:59.999Z`)
  const and: Where[] = [
    { appointmentDate: { greater_than_equal: start.toISOString() } },
    { appointmentDate: { less_than_equal: end.toISOString() } },
    { timeSlot: { equals: args.slotId } },
    { status: { in: [...BLOCKING_STATUSES] } },
  ]
  if (args.beauticianId) {
    and.push({ beautician: { equals: args.beauticianId } })
  }
  const found = await payload.find({
    collection: 'appointments',
    where: { and },
    limit: 1,
    overrideAccess: true,
  })
  return found.totalDocs
}

export async function getAvailableSlots(
  payload: Payload,
  args: { dateIso: string; serviceId: string; areaId?: string; beauticianId?: string },
) {
  if (await isDateDisabled(payload, args.dateIso)) return []

  const slots = await payload.find({
    collection: 'time-slots',
    where: { active: { equals: true } },
    sort: 'sortOrder',
    limit: 50,
    overrideAccess: true,
  })

  const available = []
  for (const slot of slots.docs) {
    const used = await countSlotBookings(payload, {
      dateIso: args.dateIso,
      slotId: String(slot.id),
    })
    if (used >= (slot.maxBookings ?? 1)) continue

    if (args.beauticianId) {
      const beauticianUsed = await countSlotBookings(payload, {
        dateIso: args.dateIso,
        slotId: String(slot.id),
        beauticianId: args.beauticianId,
      })
      if (beauticianUsed > 0) continue
    }
    available.push(slot)
  }
  return available
}

export async function recommendBeautician(
  payload: Payload,
  args: { serviceId: string; areaId?: string; dateIso: string; slotId: string },
) {
  const weekday = weekdayOf(args.dateIso)
  const where: Where = {
    and: [{ active: { equals: true } }, { available: { equals: true } }, { services: { contains: args.serviceId } }],
  }
  if (args.areaId && Array.isArray(where.and)) {
    where.and.push({ serviceAreas: { contains: args.areaId } })
  }

  const found = await payload.find({
    collection: 'beauticians',
    where,
    limit: 50,
    overrideAccess: true,
  })

  for (const b of found.docs) {
    const days = (b.workingDays || []) as string[]
    if (days.length && !days.includes(weekday)) continue
    const booked = await countSlotBookings(payload, {
      dateIso: args.dateIso,
      slotId: args.slotId,
      beauticianId: String(b.id),
    })
    if (booked > 0) continue
    return b
  }
  return null
}

export { relId }
