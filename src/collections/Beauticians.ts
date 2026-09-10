import type { CollectionConfig } from 'payload'
import { isContent, isOps } from '@/access'
import { autoSlugFrom, revalidateAfterChange } from '@/hooks/cms'
import { mediaUpload } from '@/fields/mediaUpload'

export const Beauticians: CollectionConfig = {
  slug: 'beauticians',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'experienceYears', 'rating', 'active', 'featured'],
    group: 'People',
  },
  access: {
    create: isContent,
    read: () => true,
    update: ({ req: { user } }) => {
      if (!user) return false
      if (['super-admin', 'manager', 'content-manager'].includes(user.role as string)) return true
      if (user.role === 'beautician') return { user: { equals: user.id } }
      return false
    },
    delete: isOps,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'user', type: 'relationship', relationTo: 'users' },
    mediaUpload('profileImage', { label: 'Profile photo', description: 'Photo on the website. Stored in Media.' }),
    { name: 'bio', type: 'textarea' },
    { name: 'experienceYears', type: 'number', required: true, min: 0 },
    {
      name: 'specializations',
      type: 'relationship',
      relationTo: 'service-categories',
      hasMany: true,
    },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
    },
    {
      name: 'serviceAreas',
      type: 'relationship',
      relationTo: 'service-areas',
      hasMany: true,
    },
    {
      name: 'workingDays',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Sunday', value: '0' },
        { label: 'Monday', value: '1' },
        { label: 'Tuesday', value: '2' },
        { label: 'Wednesday', value: '3' },
        { label: 'Thursday', value: '4' },
        { label: 'Friday', value: '5' },
        { label: 'Saturday', value: '6' },
      ],
      defaultValue: ['1', '2', '3', '4', '5', '6'],
    },
    { name: 'workStart', type: 'text', defaultValue: '09:00' },
    { name: 'workEnd', type: 'text', defaultValue: '19:00' },
    { name: 'available', type: 'checkbox', defaultValue: true },
    { name: 'rating', type: 'number', defaultValue: 0, min: 0, max: 5 },
    { name: 'totalReviews', type: 'number', defaultValue: 0, min: 0 },
    mediaUpload('portfolio', { label: 'Work photos', hasMany: true, description: 'Work photos on the profile page. Stored in Media.' }),
    { name: 'phone', type: 'text' },
    { name: 'whatsapp', type: 'text' },
    { name: 'active', type: 'checkbox', defaultValue: true, label: 'Show on website' },
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
