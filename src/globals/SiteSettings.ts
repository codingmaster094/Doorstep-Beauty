import type { GlobalConfig } from 'payload'
import { isContent } from '@/access'
import { revalidateGlobalAfterChange } from '@/hooks/cms'
import { mediaUpload } from '@/fields/mediaUpload'

const linkFields = [
  { name: 'label', type: 'text' as const, required: true },
  { name: 'href', type: 'text' as const, required: true, admin: { description: 'Page path, e.g. /services' } },
]

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Header & Footer',
  access: {
    read: () => true,
    update: isContent,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Brand',
          fields: [
            { name: 'businessName', type: 'text', required: true, defaultValue: 'Bloom At Home' },
            { name: 'tagline', type: 'text', defaultValue: 'Professional Beauty Services, At Your Doorstep.' },
            mediaUpload('logo', { label: 'Header / footer logo' }),
            mediaUpload('favicon', { label: 'Browser icon' }),
          ],
        },
        {
          label: 'Header',
          fields: [
            {
              name: 'headerLinks',
              type: 'array',
              labels: { singular: 'Link', plural: 'Header menu' },
              fields: linkFields,
              defaultValue: [
                { label: 'Services', href: '/services' },
                { label: 'Beauticians', href: '/beauticians' },
                { label: 'Offers', href: '/offers' },
                { label: 'Results', href: '/before-after' },
                { label: 'Reels', href: '/reels' },
                { label: 'About', href: '/about' },
                { label: 'Contact', href: '/contact' },
              ],
            },
            { name: 'headerCtaLabel', type: 'text', defaultValue: 'Book home service' },
            { name: 'headerCtaHref', type: 'text', defaultValue: '/book' },
          ],
        },
        {
          label: 'Footer',
          fields: [
            { name: 'footerTagline', type: 'textarea', defaultValue: 'Professional beauty services at home in Surat.' },
            {
              name: 'footerExploreLinks',
              type: 'array',
              labels: { singular: 'Link', plural: 'Explore links' },
              fields: linkFields,
              defaultValue: [
                { label: 'Services', href: '/services' },
                { label: 'Beauticians', href: '/beauticians' },
                { label: 'Offers', href: '/offers' },
                { label: 'FAQ', href: '/faq' },
              ],
            },
            {
              name: 'footerPolicyLinks',
              type: 'array',
              labels: { singular: 'Link', plural: 'Policy links' },
              fields: linkFields,
              defaultValue: [
                { label: 'Privacy', href: '/privacy' },
                { label: 'Terms', href: '/terms' },
                { label: 'Cancellation', href: '/cancellation' },
                { label: 'Refund', href: '/refund' },
              ],
            },
            { name: 'copyrightText', type: 'text', defaultValue: 'All rights reserved.' },
          ],
        },
        {
          label: 'Contact',
          fields: [
            { name: 'phone', type: 'text', required: true, defaultValue: '+919876543210' },
            { name: 'whatsapp', type: 'text', required: true, defaultValue: '919876543210' },
            { name: 'email', type: 'email', required: true, defaultValue: 'hello@bloomathome.example' },
            { name: 'address', type: 'textarea', defaultValue: 'Surat, Gujarat, India' },
            { name: 'instagram', type: 'text' },
            { name: 'facebook', type: 'text' },
            { name: 'businessHours', type: 'text', defaultValue: '9:00 AM – 7:00 PM' },
          ],
        },
        {
          label: 'Booking',
          fields: [
            { name: 'defaultHomeVisitCharge', type: 'number', required: true, defaultValue: 150, min: 0 },
            { name: 'currency', type: 'text', defaultValue: 'INR' },
            { name: 'minAdvanceDays', type: 'number', defaultValue: 0 },
            { name: 'maxAdvanceDays', type: 'number', defaultValue: 30 },
            { name: 'cancellationHours', type: 'number', defaultValue: 4 },
            { name: 'mobileBookLabel', type: 'text', defaultValue: 'Book now' },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'seo',
              type: 'group',
              fields: [
                { name: 'defaultTitle', type: 'text' },
                { name: 'defaultDescription', type: 'textarea' },
              ],
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateGlobalAfterChange],
  },
}
