import type { CollectionConfig } from 'payload'
import { isContent } from '@/access'

export const ServiceAddons: CollectionConfig = {
  slug: 'service-addons',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'price', 'durationMinutes', 'active'],
    group: 'Catalog',
  },
  access: {
    create: isContent,
    read: () => true,
    update: isContent,
    delete: isContent,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'description', type: 'textarea' },
    { name: 'price', type: 'number', required: true, min: 0 },
    { name: 'durationMinutes', type: 'number', defaultValue: 15, min: 0 },
    { name: 'active', type: 'checkbox', defaultValue: true },
  ],
}
