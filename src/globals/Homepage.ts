import type { GlobalConfig } from 'payload'
import { isContent } from '@/access'
import { revalidateGlobalAfterChange } from '@/hooks/cms'
import { mediaUpload } from '@/fields/mediaUpload'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'Homepage',
  access: {
    read: () => true,
    update: isContent,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [
            { name: 'heroBadge', type: 'text' },
            { name: 'heroHeadline', type: 'text' },
            { name: 'heroText', type: 'textarea' },
            mediaUpload('heroImage', { label: 'Hero image', description: 'Large photo on the home page. Stored in Media.' }),
            { name: 'primaryCtaLabel', type: 'text' },
            { name: 'primaryCtaHref', type: 'text' },
            { name: 'secondaryCtaLabel', type: 'text' },
            { name: 'secondaryCtaHref', type: 'text' },
          ],
        },
        {
          label: 'Sections',
          fields: [
            { name: 'servicesTitle', type: 'text' },
            { name: 'howItWorksTitle', type: 'text' },
            {
              name: 'howItWorks',
              type: 'array',
              labels: { singular: 'Step', plural: 'Steps' },
              fields: [{ name: 'title', type: 'text', required: true }],
            },
            { name: 'whyTitle', type: 'text' },
            {
              name: 'whyItems',
              type: 'array',
              labels: { singular: 'Reason', plural: 'Reasons' },
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'body', type: 'textarea' },
              ],
            },
            { name: 'beforeAfterTitle', type: 'text' },
            { name: 'beauticiansTitle', type: 'text' },
            { name: 'reelsTitle', type: 'text' },
            { name: 'reviewsTitle', type: 'text' },
            { name: 'offersTitle', type: 'text' },
            { name: 'faqTitle', type: 'text' },
          ],
        },
        {
          label: 'Final CTA',
          fields: [
            { name: 'finalCtaHeadline', type: 'text' },
            { name: 'finalCtaText', type: 'textarea' },
            { name: 'finalCtaLabel', type: 'text' },
            { name: 'finalCtaHref', type: 'text' },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateGlobalAfterChange],
  },
}
