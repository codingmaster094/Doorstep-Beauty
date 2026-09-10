import type { CollectionConfig, Where } from 'payload'
import { isContent } from '@/access'
import { revalidateAfterChange } from '@/hooks/cms'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: {
    useAsTitle: 'customerName',
    defaultColumns: ['customerName', 'rating', 'published', 'featured'],
    group: 'Content',
  },
  access: {
    create: ({ req: { user } }) => Boolean(user),
    read: ({ req: { user } }) => {
      if (user && ['super-admin', 'manager', 'content-manager'].includes(user.role as string)) return true
      if (user?.role === 'customer') {
        return {
          or: [{ published: { equals: true } }, { customer: { equals: user.id } }],
        } as Where
      }
      return { published: { equals: true } }
    },
    update: isContent,
    delete: isContent,
  },
  fields: [
    { name: 'customer', type: 'relationship', relationTo: 'users' },
    { name: 'customerName', type: 'text', required: true },
    { name: 'customerPhoto', type: 'upload', relationTo: 'media' },
    { name: 'service', type: 'relationship', relationTo: 'services' },
    { name: 'beautician', type: 'relationship', relationTo: 'beauticians' },
    { name: 'appointment', type: 'relationship', relationTo: 'appointments' },
    { name: 'rating', type: 'number', required: true, min: 1, max: 5 },
    { name: 'review', type: 'textarea', required: true },
    { name: 'verifiedCustomer', type: 'checkbox', defaultValue: false },
    { name: 'published', type: 'checkbox', defaultValue: true, label: 'Show on website' },
    { name: 'featured', type: 'checkbox', defaultValue: true, label: 'Show on homepage' },
    { name: 'adminResponse', type: 'textarea' },
  ],
  hooks: {
    afterChange: [revalidateAfterChange],
  },
}
