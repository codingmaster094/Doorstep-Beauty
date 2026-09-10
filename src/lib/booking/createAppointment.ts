import { z } from 'zod'
import type { Payload } from 'payload'
import { calculateQuote } from '@/lib/pricing/calculateQuote'
import { countSlotBookings, isDateDisabled, recommendBeautician } from '@/lib/booking/availability'
import { generateBookingId } from '@/lib/booking/bookingId'
import { EMAIL, INDIAN_PHONE, PINCODE } from '@/lib/pricing/money'
import { notify } from '@/lib/notifications/notify'

export const bookingSchema = z.object({
  serviceId: z.string().min(1),
  addonIds: z.array(z.string()).default([]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  slotId: z.string().min(1),
  beauticianId: z.string().optional(),
  assignmentMode: z.enum(['auto', 'manual']).default('auto'),
  customerName: z.string().min(2),
  customerPhone: z.string().regex(INDIAN_PHONE, 'Enter a valid 10-digit Indian mobile number.'),
  customerWhatsapp: z.string().optional(),
  customerEmail: z.string().regex(EMAIL).optional().or(z.literal('')),
  areaId: z.string().min(1),
  addressLine: z.string().min(8),
  city: z.string().default('Surat'),
  state: z.string().default('Gujarat'),
  pincode: z.string().regex(PINCODE, 'Enter a valid 6-digit pincode.'),
  landmark: z.string().optional(),
  instructions: z.string().optional(),
  couponCode: z.string().optional(),
  paymentMethod: z
    .enum(['pay-after-service', 'online', 'upi', 'card', 'net-banking'])
    .default('pay-after-service'),
  notes: z.string().optional(),
  customerId: z.string().optional(),
})

export type BookingInput = z.infer<typeof bookingSchema>

export async function createAppointment(payload: Payload, raw: BookingInput) {
  const input = bookingSchema.parse(raw)

  const dateObj = new Date(`${input.date}T12:00:00`)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (dateObj < today) {
    throw new Error('Appointments cannot be booked in the past.')
  }

  if (await isDateDisabled(payload, input.date)) {
    throw new Error('Bookings are not available on this date.')
  }

  const service = await payload.findByID({
    collection: 'services',
    id: input.serviceId,
    overrideAccess: true,
  })
  if (!service?.available) throw new Error('This service is currently unavailable.')

  const slot = await payload.findByID({
    collection: 'time-slots',
    id: input.slotId,
    overrideAccess: true,
  })
  if (!slot?.active) throw new Error('This time slot is not available.')

  const used = await countSlotBookings(payload, { dateIso: input.date, slotId: input.slotId })
  if (used >= (slot.maxBookings ?? 1)) {
    throw new Error('This time slot is fully booked. Please choose another time.')
  }

  let beauticianId = input.beauticianId
  let assignmentMode = input.assignmentMode
  if (!beauticianId || assignmentMode === 'auto') {
    const recommended = await recommendBeautician(payload, {
      serviceId: input.serviceId,
      areaId: input.areaId,
      dateIso: input.date,
      slotId: input.slotId,
    })
    beauticianId = recommended ? String(recommended.id) : undefined
    assignmentMode = 'auto'
  } else {
    const booked = await countSlotBookings(payload, {
      dateIso: input.date,
      slotId: input.slotId,
      beauticianId,
    })
    if (booked > 0) {
      throw new Error('This beautician is already booked for the selected time.')
    }
  }

  const quote = await calculateQuote(payload, {
    serviceId: input.serviceId,
    addonIds: input.addonIds,
    areaId: input.areaId,
    couponCode: input.couponCode,
    customerId: input.customerId,
  })

  if (input.couponCode && quote.couponError) {
    throw new Error(quote.couponError)
  }

  let beauticianUser: string | undefined
  if (beauticianId) {
    const beautician = await payload.findByID({
      collection: 'beauticians',
      id: beauticianId,
      depth: 0,
      overrideAccess: true,
    })
    if (beautician?.user) {
      beauticianUser = typeof beautician.user === 'string' ? beautician.user : String((beautician.user as { id: string }).id)
    }
  }

  const bookingId = await generateBookingId(payload)
  const addressSnapshot = [
    input.addressLine,
    input.landmark ? `Landmark: ${input.landmark}` : '',
    `${input.city}, ${input.state} ${input.pincode}`,
    input.instructions ? `Notes: ${input.instructions}` : '',
  ]
    .filter(Boolean)
    .join('\n')

  const appointment = await payload.create({
    collection: 'appointments',
    overrideAccess: true,
    data: {
      bookingId,
      customer: input.customerId,
      customerName: input.customerName,
      customerPhone: input.customerPhone,
      customerWhatsapp: input.customerWhatsapp || input.customerPhone,
      customerEmail: input.customerEmail || undefined,
      beautician: beauticianId,
      beauticianUser,
      assignmentMode,
      service: input.serviceId,
      addons: input.addonIds,
      appointmentDate: dateObj.toISOString(),
      timeSlot: input.slotId,
      addressSnapshot,
      serviceArea: input.areaId,
      pincode: input.pincode,
      notes: input.notes,
      serviceAmount: quote.serviceAmount,
      homeVisitCharge: quote.homeVisitCharge,
      addonAmount: quote.addonAmount,
      discount: quote.discount,
      finalAmount: quote.finalAmount,
      coupon: quote.couponId,
      couponCode: quote.couponCode,
      paymentMethod: input.paymentMethod,
      paymentStatus: 'pending',
      status: beauticianId ? 'assigned' : 'pending',
    },
  })

  if (quote.couponId) {
    const coupon = await payload.findByID({ collection: 'coupons', id: quote.couponId, overrideAccess: true })
    await payload.update({
      collection: 'coupons',
      id: quote.couponId,
      overrideAccess: true,
      data: { usedCount: (coupon.usedCount ?? 0) + 1 },
    })
  }

  await notify(payload, {
    title: 'Booking received',
    body: `We received your appointment ${bookingId}.`,
    type: 'booking-received',
    audience: 'customer',
    user: input.customerId,
    appointment: String(appointment.id),
  })
  if (input.customerId) {
    try {
      await payload.create({
        collection: 'addresses',
        overrideAccess: true,
        data: {
          customer: input.customerId,
          label: 'home',
          addressLine: input.addressLine,
          area: input.areaId,
          city: input.city,
          state: input.state,
          pincode: input.pincode,
          landmark: input.landmark,
          instructions: input.instructions,
        },
      })
    } catch {
      // Booking still succeeds if address save fails.
    }
  }

  await notify(payload, {
    title: 'New booking',
    body: `${bookingId} · ${input.customerName} · ${service.name}`,
    type: 'admin-new-booking',
    audience: 'admin',
    appointment: String(appointment.id),
  })

  return appointment
}
