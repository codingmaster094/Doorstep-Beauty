import type { CollectionConfig } from 'payload'
import { ownCustomerData } from '@/access'

export const Addresses: CollectionConfig = {
  slug: 'addresses',
  admin: {
    useAsTitle: 'label',
    group: 'People',
  },
  access: {
    create: ({ req: { user } }) => Boolean(user),
    read: ownCustomerData,
    update: ownCustomerData,
    delete: ownCustomerData,
  },
  fields: [
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
    },
    {
      name: 'label',
      type: 'select',
      required: true,
      defaultValue: 'home',
      options: [
        { label: 'Home', value: 'home' },
        { label: 'Work', value: 'work' },
        { label: 'Other', value: 'other' },
      ],
    },
    { name: 'addressLine', type: 'text', required: true },
    {
      name: 'area',
      type: 'relationship',
      relationTo: 'service-areas',
      required: true,
    },
    { name: 'city', type: 'text', required: true, defaultValue: 'Surat' },
    { name: 'state', type: 'text', required: true, defaultValue: 'Gujarat' },
    { name: 'pincode', type: 'text', required: true },
    { name: 'landmark', type: 'text' },
    { name: 'instructions', type: 'textarea' },
    { name: 'isDefault', type: 'checkbox', defaultValue: false },
  ],
}
