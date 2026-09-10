import type { CollectionConfig } from 'payload'
import { isContent } from '@/access'
import { autoSlugFrom, revalidateAfterChange } from '@/hooks/cms'
import { mediaUpload } from '@/fields/mediaUpload'

export const Pages: CollectionConfig = {
  slug: 'pages',
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
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'excerpt', type: 'textarea' },
    mediaUpload('coverImage', { label: 'Cover image' }),
    { name: 'content', type: 'textarea', required: true },
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
    beforeValidate: [autoSlugFrom('title')],
    afterChange: [revalidateAfterChange],
  },
}
