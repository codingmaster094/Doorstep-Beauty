import type { CollectionConfig, Where } from 'payload'
import { isOps } from '@/access'
import { generateBookingId } from '@/lib/booking/bookingId'

const appointmentStatuses = [
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Assigned', value: 'assigned' },
  { label: 'Beautician On The Way', value: 'on-the-way' },
  { label: 'Arrived', value: 'arrived' },
  { label: 'Service Started', value: 'service-started' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'Rescheduled', value: 'rescheduled' },
  { label: 'No Show', value: 'no-show' },
] as const

const beauticianAllowedStatuses = ['on-the-way', 'arrived', 'service-started', 'completed']

export const Appointments: CollectionConfig = {
  slug: 'appointments',
  admin: {
    useAsTitle: 'bookingId',
    defaultColumns: ['bookingId', 'appointmentDate', 'status', 'finalAmount', 'customerName'],
    group: 'Operations',
  },
  access: {
    create: isOps,
    read: ({ req: { user } }) => {
      if (!user) return false
      if (['super-admin', 'manager'].includes(user.role as string)) return true
      if (user.role === 'beautician') return { beauticianUser: { equals: user.id } } as Where
      if (user.role === 'customer') return { customer: { equals: user.id } } as Where
      return false
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      if (['super-admin', 'manager'].includes(user.role as string)) return true
      if (user.role === 'beautician') return { beauticianUser: { equals: user.id } } as Where
      return false
    },
    delete: ({ req: { user } }) => user?.role === 'super-admin',
  },
  hooks: {
    beforeValidate: [
      async ({ data, operation, req }) => {
        if (!data) return data
        if (operation === 'create' && !data.bookingId) {
          data.bookingId = await generateBookingId(req.payload)
        }
        return data
      },
    ],
    beforeChange: [
      async ({ data, req, originalDoc, operation }) => {
        if (!req.user || !data) return data
        if (req.user.role === 'beautician' && operation === 'update') {
          const nextStatus = data.status
          if (nextStatus && !beauticianAllowedStatuses.includes(nextStatus)) {
            throw new Error('Beauticians can only update permitted appointment statuses.')
          }
          return {
            ...originalDoc,
            status: nextStatus,
            adminNotes: originalDoc?.adminNotes,
          }
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'bookingId', type: 'text', unique: true, index: true, admin: { readOnly: true } },
    { name: 'customer', type: 'relationship', relationTo: 'users' },
    { name: 'customerName', type: 'text', required: true },
    { name: 'customerPhone', type: 'text', required: true },
    { name: 'customerWhatsapp', type: 'text' },
    { name: 'customerEmail', type: 'email' },
    { name: 'beautician', type: 'relationship', relationTo: 'beauticians' },
    { name: 'beauticianUser', type: 'relationship', relationTo: 'users' },
    { name: 'assignmentMode', type: 'select', defaultValue: 'auto', options: [
      { label: 'Auto', value: 'auto' },
      { label: 'Manual', value: 'manual' },
    ] },
    { name: 'service', type: 'relationship', relationTo: 'services', required: true },
    { name: 'addons', type: 'relationship', relationTo: 'service-addons', hasMany: true },
    { name: 'appointmentDate', type: 'date', required: true, index: true },
    { name: 'timeSlot', type: 'relationship', relationTo: 'time-slots', required: true },
    { name: 'addressSnapshot', type: 'textarea', required: true },
    { name: 'serviceArea', type: 'relationship', relationTo: 'service-areas', required: true },
    { name: 'pincode', type: 'text' },
    { name: 'notes', type: 'textarea' },
    { name: 'serviceAmount', type: 'number', required: true, min: 0 },
    { name: 'homeVisitCharge', type: 'number', required: true, min: 0 },
    { name: 'addonAmount', type: 'number', required: true, min: 0 },
    { name: 'discount', type: 'number', required: true, min: 0, defaultValue: 0 },
    { name: 'finalAmount', type: 'number', required: true, min: 0 },
    { name: 'coupon', type: 'relationship', relationTo: 'coupons' },
    { name: 'couponCode', type: 'text' },
    {
      name: 'paymentMethod',
      type: 'select',
      defaultValue: 'pay-after-service',
      options: [
        { label: 'Cash / Pay After Service', value: 'pay-after-service' },
        { label: 'Online', value: 'online' },
        { label: 'UPI', value: 'upi' },
        { label: 'Card', value: 'card' },
        { label: 'Net Banking', value: 'net-banking' },
      ],
    },
    {
      name: 'paymentStatus',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Paid', value: 'paid' },
        { label: 'Failed', value: 'failed' },
        { label: 'Refunded', value: 'refunded' },
        { label: 'Partially Paid', value: 'partially-paid' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [...appointmentStatuses],
    },
    { name: 'cancellationReason', type: 'textarea' },
    { name: 'adminNotes', type: 'textarea' },
  ],
  timestamps: true,
}
