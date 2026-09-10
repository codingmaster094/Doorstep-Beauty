import type { CollectionConfig } from 'payload'
import { isOps } from '@/access'

export const DisabledDates: CollectionConfig = {
  slug: 'disabled-dates',
  admin: {
    useAsTitle: 'date',
    group: 'Operations',
  },
  access: {
    create: isOps,
    read: () => true,
    update: isOps,
    delete: isOps,
  },
  fields: [
    { name: 'date', type: 'date', required: true, unique: true },
    { name: 'reason', type: 'text' },
  ],
}
