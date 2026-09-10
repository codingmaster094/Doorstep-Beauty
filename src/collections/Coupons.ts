import type { CollectionConfig } from 'payload'
import { isOps } from '@/access'

export const Coupons: CollectionConfig = {
  slug: 'coupons',
  admin: {
    useAsTitle: 'code',
    defaultColumns: ['code', 'type', 'active', 'endDate'],
    group: 'Marketing',
  },
  access: {
    create: isOps,
    read: () => true,
    update: isOps,
    delete: isOps,
  },
  fields: [
    { name: 'code', type: 'text', required: true, unique: true, index: true },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Percentage', value: 'percentage' },
        { label: 'Fixed amount', value: 'fixed' },
      ],
    },
    { name: 'percentage', type: 'number', min: 0, max: 100 },
    { name: 'fixedAmount', type: 'number', min: 0 },
    { name: 'minimumOrderValue', type: 'number', min: 0, defaultValue: 0 },
    { name: 'maximumDiscount', type: 'number', min: 0 },
    { name: 'usageLimit', type: 'number', min: 0 },
    { name: 'perCustomerLimit', type: 'number', min: 0, defaultValue: 1 },
    { name: 'usedCount', type: 'number', defaultValue: 0, admin: { readOnly: true } },
    { name: 'startDate', type: 'date', required: true },
    { name: 'endDate', type: 'date', required: true },
    {
      name: 'applicableServices',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
    },
    { name: 'active', type: 'checkbox', defaultValue: true },
  ],
}
