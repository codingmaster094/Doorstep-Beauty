import type { CollectionConfig } from 'payload'
import { isContent } from '@/access'
import { autoSlugFrom, defaultOfferDates, revalidateAfterChange } from '@/hooks/cms'
import { mediaUpload } from '@/fields/mediaUpload'

export const Offers: CollectionConfig = {
  slug: 'offers',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'active', 'featured', 'endDate'],
    group: 'Marketing',
  },
  access: {
    create: isContent,
    read: () => true,
    update: isContent,
    delete: isContent,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'description', type: 'textarea' },
    mediaUpload('banner', { label: 'Banner' }),
    { name: 'discountLabel', type: 'text' },
    { name: 'coupon', type: 'relationship', relationTo: 'coupons' },
    { name: 'startDate', type: 'date' },
    { name: 'endDate', type: 'date' },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
    },
    { name: 'terms', type: 'textarea' },
    { name: 'active', type: 'checkbox', defaultValue: true, label: 'Show on website' },
    { name: 'featured', type: 'checkbox', defaultValue: true, label: 'Show on homepage' },
  ],
  hooks: {
    beforeValidate: [autoSlugFrom('title'), defaultOfferDates],
    afterChange: [revalidateAfterChange],
  },
}
