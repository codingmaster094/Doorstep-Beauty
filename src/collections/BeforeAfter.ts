import type { CollectionConfig } from 'payload'
import { isContent } from '@/access'
import { revalidateAfterChange } from '@/hooks/cms'

export const BeforeAfter: CollectionConfig = {
  slug: 'before-after',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
  },
  access: {
    create: isContent,
    read: () => true,
    update: isContent,
    delete: isContent,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'service', type: 'relationship', relationTo: 'services' },
    { name: 'beautician', type: 'relationship', relationTo: 'beauticians' },
    { name: 'beforeImage', type: 'upload', relationTo: 'media', required: true },
    { name: 'afterImage', type: 'upload', relationTo: 'media', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'published', type: 'checkbox', defaultValue: true, label: 'Show on website' },
    { name: 'featured', type: 'checkbox', defaultValue: true, label: 'Show on homepage' },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
  ],
  hooks: {
    afterChange: [revalidateAfterChange],
  },
}
