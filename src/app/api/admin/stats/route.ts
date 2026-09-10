import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  const user = await getCurrentUser()
  if (!user || !['super-admin', 'manager'].includes(user.role as string)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const payload = await getPayloadClient()
  const now = new Date()
  const startOfDay = new Date(now)
  startOfDay.setHours(0, 0, 0, 0)

  const [all, today, upcoming, completed, cancelled, customers, beauticians] = await Promise.all([
    payload.find({ collection: 'appointments', limit: 0, overrideAccess: true }),
    payload.find({
      collection: 'appointments',
      where: { appointmentDate: { greater_than_equal: startOfDay.toISOString() } },
      limit: 0,
      overrideAccess: true,
    }),
    payload.find({
      collection: 'appointments',
      where: {
        and: [
          { appointmentDate: { greater_than_equal: now.toISOString() } },
          { status: { in: ['pending', 'confirmed', 'assigned', 'on-the-way'] } },
        ],
      },
      limit: 0,
      overrideAccess: true,
    }),
    payload.find({ collection: 'appointments', where: { status: { equals: 'completed' } }, limit: 0, overrideAccess: true }),
    payload.find({ collection: 'appointments', where: { status: { equals: 'cancelled' } }, limit: 0, overrideAccess: true }),
    payload.find({ collection: 'users', where: { role: { equals: 'customer' } }, limit: 0, overrideAccess: true }),
    payload.find({ collection: 'beauticians', where: { active: { equals: true } }, limit: 0, overrideAccess: true }),
  ])

  const completedDocs = await payload.find({
    collection: 'appointments',
    where: { status: { equals: 'completed' } },
    limit: 200,
    overrideAccess: true,
  })
  const revenue = completedDocs.docs.reduce((sum, a) => sum + (a.finalAmount ?? 0), 0)
  const aov = completedDocs.totalDocs ? Math.round(revenue / completedDocs.totalDocs) : 0

  return NextResponse.json({
    totalBookings: all.totalDocs,
    todayBookings: today.totalDocs,
    upcomingBookings: upcoming.totalDocs,
    completedBookings: completed.totalDocs,
    cancelledBookings: cancelled.totalDocs,
    totalCustomers: customers.totalDocs,
    activeBeauticians: beauticians.totalDocs,
    revenue,
    averageOrderValue: aov,
  })
}
