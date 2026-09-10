import type { CollectionConfig } from 'payload'
import { isOps } from '@/access'

export const ServiceAreas: CollectionConfig = {
  slug: 'service-areas',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'city', 'pincode', 'homeVisitCharge', 'active'],
    group: 'Operations',
  },
  access: {
    create: isOps,
    read: () => true,
    update: isOps,
    delete: isOps,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'city', type: 'text', required: true, defaultValue: 'Surat' },
    { name: 'state', type: 'text', required: true, defaultValue: 'Gujarat' },
    { name: 'pincode', type: 'text' },
    { name: 'homeVisitCharge', type: 'number', required: true, min: 0 },
    { name: 'active', type: 'checkbox', defaultValue: true },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
  ],
}
