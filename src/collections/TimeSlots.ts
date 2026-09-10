import type { CollectionConfig } from 'payload'
import { isOps } from '@/access'

export const TimeSlots: CollectionConfig = {
  slug: 'time-slots',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'startTime', 'maxBookings', 'active'],
    group: 'Operations',
  },
  access: {
    create: isOps,
    read: () => true,
    update: isOps,
    delete: isOps,
  },
  fields: [
    { name: 'label', type: 'text', required: true },
    { name: 'startTime', type: 'text', required: true, admin: { description: '24h format, e.g. 09:00' } },
    { name: 'maxBookings', type: 'number', required: true, defaultValue: 3, min: 1 },
    { name: 'active', type: 'checkbox', defaultValue: true },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
  ],
}
