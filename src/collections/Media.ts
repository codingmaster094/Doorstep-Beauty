import type { CollectionConfig } from 'payload'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { isContent } from '@/access'
import { safeUploadName } from '@/lib/safeUploadName'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Media file',
    plural: 'Media',
  },
  access: {
    create: ({ req: { user } }) => Boolean(user),
    read: () => true,
    update: isContent,
    delete: isContent,
  },
  admin: {
    group: 'Media',
    useAsTitle: 'alt',
    defaultColumns: ['filename', 'alt', 'folder', 'mimeType', 'updatedAt'],
    description: 'All website photos, videos and icons are stored here. Upload once, then select the file on Homepage, Services, Beauticians, Reels, Offers and other pages.',
  },
  upload: {
    staticDir: path.resolve(dirname, '../../media'),
    mimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/avif',
      'image/svg+xml',
      'image/x-icon',
      'image/vnd.microsoft.icon',
      'video/mp4',
      'video/webm',
      'video/quicktime',
    ],
    displayPreview: true,
    crop: false,
    focalPoint: false,
    filesRequiredOnCreate: true,
    bulkUpload: true,
  },
  hooks: {
    beforeOperation: [
      ({ req, operation }) => {
        if (operation !== 'create' && operation !== 'update') return
        const file = req.file as { name?: string } | undefined
        if (file?.name) file.name = safeUploadName(file.name)
      },
    ],
    beforeValidate: [
      ({ data }) => {
        if (!data) return data
        if (typeof data.filename === 'string') data.filename = safeUploadName(data.filename)
        if (!data.alt) data.alt = typeof data.filename === 'string' ? data.filename : 'Website media'
        return data
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Short text that describes this file on the website.',
      },
    },
    {
      name: 'folder',
      type: 'select',
      defaultValue: 'general',
      options: [
        { label: 'General', value: 'general' },
        { label: 'Logo & icons', value: 'brand' },
        { label: 'Homepage', value: 'homepage' },
        { label: 'Services', value: 'services' },
        { label: 'Beauticians', value: 'beauticians' },
        { label: 'Reels', value: 'reels' },
        { label: 'Before & after', value: 'before-after' },
        { label: 'Offers', value: 'offers' },
        { label: 'Reviews', value: 'reviews' },
      ],
      admin: {
        description: 'Optional folder so files are easier to find.',
      },
    },
  ],
}
