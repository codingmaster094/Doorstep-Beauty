import type { CollectionConfig } from 'payload'
import { isContent } from '@/access'
import { autoSlugFrom, revalidateAfterChange } from '@/hooks/cms'

export const ServiceCategories: CollectionConfig = {
  slug: 'service-categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'sortOrder', 'active'],
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
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'shortDescription', type: 'textarea' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'active', type: 'checkbox', defaultValue: true },
    { name: 'featured', type: 'checkbox', defaultValue: true },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
      ],
    },
  ],
  hooks: {
    beforeValidate: [autoSlugFrom('name')],
    afterChange: [revalidateAfterChange],
  },
}
