import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { getAvailableSlots } from '@/lib/booking/availability'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date')
  const serviceId = searchParams.get('serviceId')
  const areaId = searchParams.get('areaId') || undefined
  const beauticianId = searchParams.get('beauticianId') || undefined
  if (!date || !serviceId) {
    return NextResponse.json({ error: 'date and serviceId are required.' }, { status: 400 })
  }
  const payload = await getPayloadClient()
  const slots = await getAvailableSlots(payload, { dateIso: date, serviceId, areaId, beauticianId })
  return NextResponse.json(
    slots.map((s) => ({
      id: s.id,
      label: s.label,
      startTime: s.startTime,
    })),
  )
}
