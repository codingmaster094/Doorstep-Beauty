import type { CollectionConfig } from 'payload'
import { isContent } from '@/access'
import { autoSlugFrom, revalidateAfterChange } from '@/hooks/cms'
import { mediaUpload } from '@/fields/mediaUpload'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'basePrice', 'available', 'featured'],
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
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'Leave empty — it is created from the name.' },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'service-categories',
      required: true,
    },
    { name: 'shortDescription', type: 'textarea', required: true },
    { name: 'fullDescription', type: 'textarea' },
    mediaUpload('featuredImage', { label: 'Featured image', description: 'Main photo on the website. Stored in Media.' }),
    mediaUpload('gallery', { label: 'Gallery', hasMany: true, description: 'Extra photos. Stored in Media.' }),
    { name: 'basePrice', type: 'number', required: true, min: 0 },
    { name: 'salePrice', type: 'number', min: 0 },
    {
      name: 'visitChargeType',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: 'Use site default', value: 'default' },
        { label: 'Fixed service charge', value: 'fixed' },
        { label: 'Area-based charge', value: 'area' },
        { label: 'Distance-based (future)', value: 'distance' },
      ],
    },
    { name: 'homeVisitCharge', type: 'number', min: 0, admin: { condition: (_, s) => s.visitChargeType === 'fixed' } },
    { name: 'durationMinutes', type: 'number', required: true, min: 15 },
    {
      name: 'benefits',
      type: 'array',
      fields: [{ name: 'item', type: 'text', required: true }],
    },
    {
      name: 'included',
      type: 'array',
      fields: [{ name: 'item', type: 'text', required: true }],
    },
    {
      name: 'notIncluded',
      type: 'array',
      fields: [{ name: 'item', type: 'text', required: true }],
    },
    {
      name: 'addons',
      type: 'relationship',
      relationTo: 'service-addons',
      hasMany: true,
    },
    {
      name: 'recommendedServices',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
    },
    {
      name: 'relatedServices',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
    },
    { name: 'available', type: 'checkbox', defaultValue: true, label: 'Show on website' },
    { name: 'featured', type: 'checkbox', defaultValue: true, label: 'Show on homepage' },
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
