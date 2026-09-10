import { getPayload, type CollectionSlug, type Payload, type Where } from 'payload'
import config from '../payload.config'
import { demoFaqs, demoReviews, demoReels } from '../content/demo'

async function ensureAdmin(payload: Payload) {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@hbs.local'
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!'

  const users = await payload.find({
    collection: 'users',
    where: { email: { equals: adminEmail } },
    limit: 1,
    overrideAccess: true,
  })

  if (users.docs[0]) {
    await payload.update({
      collection: 'users',
      id: users.docs[0].id,
      overrideAccess: true,
      data: {
        role: 'super-admin',
        accountStatus: 'active',
        name: users.docs[0].name || 'Studio Admin',
      },
    })
    console.log('Admin access restored:', adminEmail)
    return
  }

  await payload.create({
    collection: 'users',
    overrideAccess: true,
    data: {
      name: 'Studio Admin',
      email: adminEmail,
      password: adminPassword,
      role: 'super-admin',
      phone: '9876500000',
      accountStatus: 'active',
    },
  })
  console.log('Admin user created:', adminEmail)
}

async function ensureDoc(payload: Payload, collection: CollectionSlug, where: Where, data: object) {
  const found = await payload.find({ collection, where, limit: 1, overrideAccess: true })
  if (found.docs[0]) {
    return payload.update({
      collection,
      id: found.docs[0].id,
      overrideAccess: true,
      data,
    }) as Promise<{ id: string; slug?: string }>
  }
  return payload.create({ collection, overrideAccess: true, data }) as Promise<{ id: string; slug?: string }>
}

async function seed() {
  const payload = await getPayload({ config })

  await ensureAdmin(payload)

  await payload.updateGlobal({
    slug: 'site-settings',
    overrideAccess: true,
    data: {
      businessName: 'Bloom At Home',
      tagline: 'Professional Beauty Services, At Your Doorstep.',
      phone: '+919876543210',
      whatsapp: '919876543210',
      email: 'hello@bloomathome.example',
      address: 'Surat, Gujarat, India',
      businessHours: '9:00 AM – 7:00 PM',
      defaultHomeVisitCharge: 150,
      headerCtaLabel: 'Book home service',
      headerCtaHref: '/book',
      footerTagline: 'Professional beauty services at home in Surat.',
      copyrightText: 'All rights reserved.',
      mobileBookLabel: 'Book now',
      headerLinks: [
        { label: 'Services', href: '/services' },
        { label: 'Beauticians', href: '/beauticians' },
        { label: 'Offers', href: '/offers' },
        { label: 'Results', href: '/before-after' },
        { label: 'Reels', href: '/reels' },
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' },
      ],
      footerExploreLinks: [
        { label: 'Services', href: '/services' },
        { label: 'Beauticians', href: '/beauticians' },
        { label: 'Offers', href: '/offers' },
        { label: 'FAQ', href: '/faq' },
      ],
      footerPolicyLinks: [
        { label: 'Privacy', href: '/privacy' },
        { label: 'Terms', href: '/terms' },
        { label: 'Cancellation', href: '/cancellation' },
        { label: 'Refund', href: '/refund' },
      ],
      seo: {
        defaultTitle: 'Bloom At Home | Beauty service at home in Surat',
        defaultDescription:
          'Book professional women beauticians for facials, waxing, makeup and bridal services at home in Surat, Gujarat.',
      },
    },
  })

  await payload.updateGlobal({
    slug: 'homepage',
    overrideAccess: true,
    data: {
      heroHeadline: 'Professional Beauty Services, At Your Doorstep.',
      heroText:
        'Verified women beauticians visit your home across Surat for facials, waxing, threading, makeup, bridal and more — with clear pricing and easy booking.',
      finalCtaHeadline: 'Your Beauty. Your Home. Your Time.',
      finalCtaText: 'Book a home visit in a few steps. See the full price before you confirm.',
    },
  })

  const areaData = [
    ['vesu', 'Vesu', 100],
    ['adajan', 'Adajan', 150],
    ['pal', 'Pal', 150],
    ['piplod', 'Piplod', 120],
    ['city-light', 'City Light', 120],
    ['athwa', 'Athwa', 130],
    ['althan', 'Althan', 140],
    ['varachha', 'Varachha', 120],
    ['katargam', 'Katargam', 130],
  ] as const

  const areas = []
  for (const [slug, name, charge] of areaData) {
    areas.push(
      await ensureDoc(payload, 'service-areas', { slug: { equals: slug } }, {
        name,
        slug,
        city: 'Surat',
        state: 'Gujarat',
        homeVisitCharge: charge,
        active: true,
      }),
    )
  }

  const slots = [
    ['09:00', '9:00 AM'],
    ['10:00', '10:00 AM'],
    ['11:00', '11:00 AM'],
    ['12:00', '12:00 PM'],
    ['14:00', '2:00 PM'],
    ['15:00', '3:00 PM'],
    ['16:00', '4:00 PM'],
    ['17:00', '5:00 PM'],
    ['18:00', '6:00 PM'],
    ['19:00', '7:00 PM'],
  ] as const
  for (const [startTime, label] of slots) {
    await ensureDoc(payload, 'time-slots', { startTime: { equals: startTime } }, {
      label,
      startTime,
      maxBookings: 3,
      active: true,
    })
  }

  const categoryNames = [
    ['facial', 'Facial'],
    ['cleanup', 'Cleanup'],
    ['waxing', 'Waxing'],
    ['threading', 'Threading'],
    ['manicure', 'Manicure'],
    ['pedicure', 'Pedicure'],
    ['hair-styling', 'Hair Styling'],
    ['makeup', 'Makeup'],
    ['mehendi', 'Mehendi'],
    ['bridal', 'Bridal Services'],
    ['skin-care', 'Skin Care'],
    ['hair-care', 'Hair Care'],
  ] as const
  const categories = []
  for (const [slug, name] of categoryNames) {
    categories.push(
      await ensureDoc(payload, 'service-categories', { slug: { equals: slug } }, {
        name,
        slug,
        shortDescription: `${name} at home in Surat.`,
        active: true,
        featured: true,
      }),
    )
  }

  const addons = {
    head: await ensureDoc(payload, 'service-addons', { slug: { equals: 'head-massage' } }, {
      name: 'Head Massage',
      slug: 'head-massage',
      price: 199,
      durationMinutes: 20,
      active: true,
    }),
    face: await ensureDoc(payload, 'service-addons', { slug: { equals: 'face-massage' } }, {
      name: 'Face Massage',
      slug: 'face-massage',
      price: 149,
      durationMinutes: 15,
      active: true,
    }),
    cleanup: await ensureDoc(payload, 'service-addons', { slug: { equals: 'addon-cleanup' } }, {
      name: 'Cleanup',
      slug: 'addon-cleanup',
      price: 299,
      durationMinutes: 30,
      active: true,
    }),
  }

  const cat = Object.fromEntries(categories.map((c) => [c.slug, String(c.id)])) as Record<string, string>
  const requireCat = (slug: string) => {
    const id = cat[slug]
    if (!id) throw new Error(`Missing category ${slug}`)
    return id
  }

  const serviceSeeds: Array<{
    name: string
    slug: string
    category: string
    basePrice: number
    duration: number
    visit: 'default' | 'fixed' | 'area'
    visitCharge?: number
  }> = [
    { name: 'Gold Facial', slug: 'gold-facial', category: requireCat('facial'), basePrice: 800, duration: 60, visit: 'fixed', visitCharge: 150 },
    { name: 'Cleanup Glow', slug: 'cleanup-glow', category: requireCat('cleanup'), basePrice: 499, duration: 45, visit: 'area' },
    { name: 'Full Arms Waxing', slug: 'full-arms-waxing', category: requireCat('waxing'), basePrice: 399, duration: 40, visit: 'default' },
    { name: 'Eyebrow Threading', slug: 'eyebrow-threading', category: requireCat('threading'), basePrice: 79, duration: 15, visit: 'default' },
    { name: 'Classic Manicure', slug: 'classic-manicure', category: requireCat('manicure'), basePrice: 349, duration: 40, visit: 'default' },
    { name: 'Classic Pedicure', slug: 'classic-pedicure', category: requireCat('pedicure'), basePrice: 449, duration: 50, visit: 'default' },
    { name: 'Blow Dry Styling', slug: 'blow-dry-styling', category: requireCat('hair-styling'), basePrice: 599, duration: 45, visit: 'default' },
    { name: 'Party Makeup', slug: 'party-makeup', category: requireCat('makeup'), basePrice: 2499, duration: 90, visit: 'fixed', visitCharge: 200 },
    { name: 'Arabic Mehendi', slug: 'arabic-mehendi', category: requireCat('mehendi'), basePrice: 799, duration: 60, visit: 'default' },
    { name: 'Bridal Makeup Trial', slug: 'bridal-makeup-trial', category: requireCat('bridal'), basePrice: 4999, duration: 120, visit: 'fixed', visitCharge: 250 },
    { name: 'Hydrating Skin Ritual', slug: 'hydrating-skin-ritual', category: requireCat('skin-care'), basePrice: 899, duration: 70, visit: 'area' },
    { name: 'Hair Spa', slug: 'hair-spa', category: requireCat('hair-care'), basePrice: 999, duration: 75, visit: 'default' },
  ]

  const createdServices = []
  for (const s of serviceSeeds) {
    createdServices.push(
      await ensureDoc(payload, 'services', { slug: { equals: s.slug } }, {
        name: s.name,
        slug: s.slug,
        category: s.category,
        shortDescription: `${s.name} at home in Surat with transparent pricing.`,
        fullDescription: `${s.name} is performed at your home by a professional beautician. Demo content so the website looks complete.`,
        basePrice: s.basePrice,
        visitChargeType: s.visit,
        homeVisitCharge: s.visitCharge,
        durationMinutes: s.duration,
        addons: [addons.head.id, addons.face.id, addons.cleanup.id],
        included: [{ item: 'Consultation' }, { item: 'Professional products for this service' }],
        notIncluded: [{ item: 'Products left behind after the visit' }],
        benefits: [{ item: 'Done in your own space' }, { item: 'No salon travel' }],
        available: true,
        featured: true,
      }),
    )
  }

  const meera = await ensureDoc(payload, 'beauticians', { slug: { equals: 'meera-patel' } }, {
    name: 'Meera Patel',
    slug: 'meera-patel',
    bio: 'Demo beautician specialising in facials and bridal makeup. Fictional profile so the website looks complete.',
    experienceYears: 8,
    specializations: [requireCat('facial'), requireCat('makeup'), requireCat('bridal')],
    services: createdServices.map((s) => s.id),
    serviceAreas: areas.map((a) => a.id),
    workingDays: ['1', '2', '3', '4', '5', '6'],
    workStart: '09:00',
    workEnd: '19:00',
    available: true,
    rating: 4.8,
    totalReviews: 24,
    active: true,
    featured: true,
  })

  await ensureDoc(payload, 'beauticians', { slug: { equals: 'anaya-shah' } }, {
    name: 'Anaya Shah',
    slug: 'anaya-shah',
    bio: 'Demo beautician for waxing, threading and skin rituals. Fictional profile.',
    experienceYears: 5,
    specializations: [requireCat('waxing'), requireCat('threading'), requireCat('skin-care')],
    services: createdServices.map((s) => s.id),
    serviceAreas: areas.slice(0, 5).map((a) => a.id),
    workingDays: ['1', '2', '3', '4', '5'],
    available: true,
    rating: 4.6,
    totalReviews: 18,
    active: true,
    featured: true,
  })

  await ensureDoc(payload, 'beauticians', { slug: { equals: 'kavya-desai' } }, {
    name: 'Kavya Desai',
    slug: 'kavya-desai',
    bio: 'Demo beautician for hair styling and party makeup. Fictional profile.',
    experienceYears: 6,
    specializations: [requireCat('hair-styling'), requireCat('makeup')],
    services: createdServices.map((s) => s.id),
    serviceAreas: areas.slice(4).map((a) => a.id),
    workingDays: ['1', '2', '3', '4', '5', '6'],
    available: true,
    rating: 4.7,
    totalReviews: 21,
    active: true,
    featured: true,
  })

  const coupon = await ensureDoc(payload, 'coupons', { code: { equals: 'HOME100' } }, {
    code: 'HOME100',
    type: 'fixed',
    fixedAmount: 100,
    minimumOrderValue: 500,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60).toISOString(),
    active: true,
  })

  await ensureDoc(payload, 'offers', { slug: { equals: 'weekday-home-facial' } }, {
    title: 'Weekday home facial',
    slug: 'weekday-home-facial',
    description: 'Demo offer: ₹100 off with code HOME100 on eligible services.',
    coupon: coupon.id,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45).toISOString(),
    active: true,
    featured: true,
    terms: 'Demo offer so the website looks complete. Not a live promotion.',
  })

  await ensureDoc(payload, 'offers', { slug: { equals: 'bridal-trial-weekday' } }, {
    title: 'Bridal trial weekday slot',
    slug: 'bridal-trial-weekday',
    description: 'Sample bridal makeup trial listing for Surat home service.',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45).toISOString(),
    active: true,
    featured: true,
    terms: 'Demo offer for development.',
  })

  const serviceIdBySlug = Object.fromEntries(createdServices.map((s) => [s.slug, s.id]))
  for (const review of demoReviews) {
    const serviceSlug = demoReviewsServiceSlug(review.service)
    await ensureDoc(payload, 'reviews', { customerName: { equals: review.name } }, {
      customerName: review.name,
      rating: review.rating,
      review: review.review,
      service: serviceIdBySlug[serviceSlug],
      beautician: meera.id,
      verifiedCustomer: review.verified,
      published: true,
      featured: true,
    })
  }

  for (const [index, faq] of demoFaqs.entries()) {
    await ensureDoc(payload, 'faqs', { question: { equals: faq.question } }, {
      question: faq.question,
      answer: faq.answer,
      published: true,
      sortOrder: index + 1,
    })
  }

  for (const [index, reel] of demoReels.entries()) {
    await ensureDoc(payload, 'reels', { title: { equals: reel.title } }, {
      title: reel.title,
      caption: reel.caption,
      externalUrl: reel.externalUrl,
      published: true,
      featured: true,
      sortOrder: index + 1,
    })
  }

  const pages = [
    ['about', 'About us', 'Bloom At Home is a demo premium women beauty home service platform for Surat. Beauticians visit your home by appointment.'],
    ['privacy', 'Privacy policy', 'We store booking details only to fulfil appointments. Demo content — replace before production.'],
    ['terms', 'Terms and conditions', 'Bookings are confirmed subject to beautician availability. Demo terms for development.'],
    ['cancellation', 'Cancellation policy', 'You may cancel before the configured notice window in Site Settings. Demo policy.'],
  ] as const
  for (const [slug, title, content] of pages) {
    await ensureDoc(payload, 'pages', { slug: { equals: slug } }, { title, slug, content })
  }

  console.log('Demo content is ready on the website.')
}

function demoReviewsServiceSlug(serviceName: string) {
  const map: Record<string, string> = {
    'Gold Facial': 'gold-facial',
    'Full Arms Waxing': 'full-arms-waxing',
    'Party Makeup': 'party-makeup',
    'Eyebrow Threading': 'eyebrow-threading',
  }
  return map[serviceName] || 'gold-facial'
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
