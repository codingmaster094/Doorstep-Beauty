import type { GlobalConfig } from 'payload'
import { isContent } from '@/access'
import { revalidateGlobalAfterChange } from '@/hooks/cms'
import { mediaUpload } from '@/fields/mediaUpload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
    update: isContent,
  },
  fields: [
    { name: 'businessName', type: 'text', required: true, defaultValue: 'Bloom At Home' },
    { name: 'tagline', type: 'text', defaultValue: 'Professional Beauty Services, At Your Doorstep.' },
    mediaUpload('logo', { label: 'Logo' }),
    mediaUpload('favicon', { label: 'Favicon' }),
    { name: 'phone', type: 'text', required: true, defaultValue: '+919876543210' },
    { name: 'whatsapp', type: 'text', required: true, defaultValue: '919876543210' },
    { name: 'email', type: 'email', required: true, defaultValue: 'hello@bloomathome.example' },
    { name: 'address', type: 'textarea', defaultValue: 'Surat, Gujarat, India' },
    { name: 'instagram', type: 'text' },
    { name: 'facebook', type: 'text' },
    { name: 'businessHours', type: 'text', defaultValue: '9:00 AM – 7:00 PM' },
    { name: 'defaultHomeVisitCharge', type: 'number', required: true, defaultValue: 150, min: 0 },
    { name: 'currency', type: 'text', defaultValue: 'INR' },
    { name: 'minAdvanceDays', type: 'number', defaultValue: 0 },
    { name: 'maxAdvanceDays', type: 'number', defaultValue: 30 },
    { name: 'cancellationHours', type: 'number', defaultValue: 4 },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'defaultTitle', type: 'text' },
        { name: 'defaultDescription', type: 'textarea' },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateGlobalAfterChange],
  },
}
