import type { CollectionConfig } from 'payload'
import { isContent } from '@/access'
import { revalidateAfterChange } from '@/hooks/cms'

export const Faqs: CollectionConfig = {
  slug: 'faqs',
  admin: {
    useAsTitle: 'question',
    group: 'Content',
  },
  access: {
    create: isContent,
    read: () => true,
    update: isContent,
    delete: isContent,
  },
  fields: [
    { name: 'question', type: 'text', required: true },
    { name: 'answer', type: 'textarea', required: true },
    { name: 'category', type: 'text' },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
    { name: 'published', type: 'checkbox', defaultValue: true, label: 'Show on website' },
  ],
  hooks: {
    afterChange: [revalidateAfterChange],
  },
}
