import type { CollectionConfig } from 'payload'
import { isOps } from '@/access'

export const Notifications: CollectionConfig = {
  slug: 'notifications',
  admin: {
    useAsTitle: 'title',
    group: 'Operations',
    defaultColumns: ['title', 'audience', 'type', 'createdAt'],
  },
  access: {
    create: isOps,
    read: ({ req: { user } }) => {
      if (!user) return false
      if (['super-admin', 'manager'].includes(user.role as string)) return true
      return { user: { equals: user.id } }
    },
    update: isOps,
    delete: isOps,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'body', type: 'textarea', required: true },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Booking received', value: 'booking-received' },
        { label: 'Booking confirmed', value: 'booking-confirmed' },
        { label: 'Beautician assigned', value: 'beautician-assigned' },
        { label: 'Appointment reminder', value: 'appointment-reminder' },
        { label: 'Appointment completed', value: 'appointment-completed' },
        { label: 'Review request', value: 'review-request' },
        { label: 'New booking (admin)', value: 'admin-new-booking' },
        { label: 'Cancellation', value: 'cancellation' },
        { label: 'New review', value: 'new-review' },
        { label: 'New customer', value: 'new-customer' },
      ],
    },
    {
      name: 'audience',
      type: 'select',
      required: true,
      options: [
        { label: 'Customer', value: 'customer' },
        { label: 'Admin', value: 'admin' },
        { label: 'Beautician', value: 'beautician' },
      ],
    },
    { name: 'user', type: 'relationship', relationTo: 'users' },
    { name: 'appointment', type: 'relationship', relationTo: 'appointments' },
    { name: 'read', type: 'checkbox', defaultValue: false },
  ],
}
