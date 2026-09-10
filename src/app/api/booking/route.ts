import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { createAppointment } from '@/lib/booking/createAppointment'
import { getCurrentUser } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const payload = await getPayloadClient()
    const user = await getCurrentUser()
    const appointment = await createAppointment(payload, {
      ...body,
      customerId: user?.id ? String(user.id) : body.customerId,
    })
    return NextResponse.json({
      id: appointment.id,
      bookingId: appointment.bookingId,
      status: appointment.status,
      finalAmount: appointment.finalAmount,
    })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to create appointment.' }, { status: 400 })
  }
}
