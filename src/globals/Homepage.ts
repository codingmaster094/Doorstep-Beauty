import type { GlobalConfig } from 'payload'
import { isContent } from '@/access'
import { revalidateGlobalAfterChange } from '@/hooks/cms'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  access: {
    read: () => true,
    update: isContent,
  },
  fields: [
    { name: 'heroHeadline', type: 'text', defaultValue: 'Professional Beauty Services, At Your Doorstep.' },
    {
      name: 'heroText',
      type: 'textarea',
      defaultValue:
        'Book verified women beauticians for facials, waxing, makeup, bridal, and more — in the comfort of your home across Surat.',
    },
    { name: 'heroImage', type: 'upload', relationTo: 'media', admin: { description: 'Large photo on the home page.' } },
    { name: 'finalCtaHeadline', type: 'text', defaultValue: 'Your Beauty. Your Home. Your Time.' },
    { name: 'finalCtaText', type: 'textarea', defaultValue: 'Choose a service, pick a time, and a professional beautician will come to you.' },
  ],
  hooks: {
    afterChange: [revalidateGlobalAfterChange],
  },
}
