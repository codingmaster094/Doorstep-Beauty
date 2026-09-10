import { getPayloadClient } from '@/lib/payload'
import { ServiceCard } from '@/components/cards/ServiceCard'
import { BeauticianCard } from '@/components/cards/BeauticianCard'
import { ReviewCard } from '@/components/cards/ReviewCard'
import { Accordion } from '@/components/ui/Accordion'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Card'
import { BeforeAfterSlider } from '@/components/ui/BeforeAfterSlider'
import { ReelCard } from '@/components/ui/ReelCard'
import { pageMeta, jsonLd, absUrl } from '@/lib/seo'
import { serviceSellPrice } from '@/lib/pricing/money'
import { mediaUrl, rel } from '@/lib/utils'
import { whatsappLink, DEFAULT_WHATSAPP_MESSAGE } from '@/lib/whatsapp'
import Link from 'next/link'
import { DemoNotice } from '@/components/ui/DemoNotice'
import {
  demoBeauticians,
  demoBeforeAfter,
  demoFaqs,
  demoHeroImage,
  demoImageForBeautician,
  demoImageForService,
  demoOffers,
  demoReels,
  demoReviews,
  demoServices,
} from '@/content/demo'

export async function generateMetadata() {
  return pageMeta({
    title: 'Professional Beauty Services, At Your Doorstep',
    description:
      'Book verified women beauticians for at-home facials, waxing, makeup, bridal and salon services in Surat, Gujarat.',
    path: '/',
  })
}

export default async function HomePage() {
  const payload = await getPayloadClient()
  const [home, settings, services, beauticians, reviews, beforeAfter, reels, offers, faqs] = await Promise.all([
    payload.findGlobal({ slug: 'homepage', depth: 2, overrideAccess: true }),
    payload.findGlobal({ slug: 'site-settings', overrideAccess: true }),
    payload.find({
      collection: 'services',
      where: { available: { equals: true } },
      sort: 'sortOrder',
      limit: 12,
      depth: 2,
      overrideAccess: true,
    }),
    payload.find({
      collection: 'beauticians',
      where: { active: { equals: true } },
      limit: 6,
      depth: 2,
      overrideAccess: true,
    }),
    payload.find({
      collection: 'reviews',
      where: { published: { equals: true } },
      limit: 6,
      depth: 1,
      overrideAccess: true,
    }),
    payload.find({
      collection: 'before-after',
      where: { published: { equals: true } },
      limit: 4,
      depth: 2,
      overrideAccess: true,
    }),
    payload.find({
      collection: 'reels',
      where: { published: { equals: true } },
      limit: 8,
      depth: 2,
      overrideAccess: true,
    }),
    payload.find({
      collection: 'offers',
      where: { active: { equals: true } },
      limit: 4,
      overrideAccess: true,
    }),
    payload.find({
      collection: 'faqs',
      where: { published: { equals: true } },
      sort: 'sortOrder',
      limit: 6,
      overrideAccess: true,
    }),
  ])

  const now = Date.now()
  const activeOffers = offers.docs.filter((o) => {
    if (o.endDate && new Date(o.endDate).getTime() < now) return false
    if (o.startDate && new Date(o.startDate).getTime() > now) return false
    return true
  })

  const localBusiness = jsonLd({
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    name: settings.businessName,
    description: home.heroText,
    url: absUrl('/'),
    telephone: settings.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Surat',
      addressRegion: 'Gujarat',
      addressCountry: 'IN',
    },
    areaServed: 'Surat',
  })

  const featuredServices = services.docs.length
    ? services.docs.map((s) => ({
        id: String(s.id),
        name: s.name,
        slug: s.slug,
        categorySlug: rel(s.category)?.slug || 'all',
        price: serviceSellPrice(s),
        durationMinutes: s.durationMinutes,
        image: mediaUrl(rel(s.featuredImage)) || demoImageForService(s.slug),
      }))
    : demoServices

  const featuredBeauticians = beauticians.docs.length
    ? beauticians.docs.map((b) => ({
        id: String(b.id),
        name: b.name,
        slug: b.slug,
        experienceYears: b.experienceYears,
        rating: b.rating ?? 0,
        specialization: rel(b.specializations?.[0])?.name,
        area: rel(b.serviceAreas?.[0])?.name,
        image: mediaUrl(rel(b.profileImage)) || demoImageForBeautician(b.slug),
      }))
    : demoBeauticians

  const featuredReviews = reviews.docs.length
    ? reviews.docs.map((r) => ({
        id: String(r.id),
        name: r.customerName,
        rating: r.rating,
        review: r.review,
        verified: Boolean(r.verifiedCustomer),
        service: rel(r.service)?.name,
      }))
    : demoReviews
  const featuredFaqs = faqs.docs.length ? faqs.docs : demoFaqs
  const featuredOffers = activeOffers.length
    ? activeOffers
    : demoOffers.map((o, i) => ({ id: String(i), title: o.title, description: o.description }))
  const featuredBeforeAfter = beforeAfter.docs.length
    ? beforeAfter.docs.map((item) => ({
        id: String(item.id),
        title: item.title,
        beforeSrc: mediaUrl(rel(item.beforeImage)) || '',
        afterSrc: mediaUrl(rel(item.afterImage)) || '',
      }))
    : demoBeforeAfter
  const featuredReels = reels.docs.length
    ? reels.docs.map((r) => ({
        id: String(r.id),
        title: r.title,
        caption: r.caption || undefined,
        thumbnail: mediaUrl(rel(r.thumbnail)) || demoReels.find((d) => d.title === r.title)?.thumbnail,
        videoUrl: mediaUrl(rel(r.video)),
        externalUrl: r.externalUrl || undefined,
      }))
    : demoReels

  return (
    <div className="space-y-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: localBusiness }} />
      <DemoNotice />
      <section className="grid gap-8 lg:grid-cols-2 lg:items-center">
        <div>
          <Badge>Surat home beauty service</Badge>
          <h1 className="mt-4 font-display text-5xl leading-[0.95] text-ink sm:text-6xl">{home.heroHeadline}</h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-ink-soft">{home.heroText}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button href="/book">Book home service</Button>
            <Button href="/services" variant="secondary">
              Explore services
            </Button>
            <Button href={whatsappLink(settings.whatsapp, DEFAULT_WHATSAPP_MESSAGE)} variant="ghost">
              WhatsApp
            </Button>
          </div>
        </div>
        <div className="aspect-[4/5] overflow-hidden bg-blush sm:aspect-[5/4]">
          {mediaUrl(rel(home.heroImage)) ? (
            <img src={mediaUrl(rel(home.heroImage))} alt="" className="h-full w-full object-cover" />
          ) : (
            <img src={demoHeroImage} alt="Beauty service at home in Surat" className="h-full w-full object-cover" />
          )}
        </div>
      </section>

      <section>
        <h2 className="font-display text-4xl">Popular services</h2>
        <div className="mt-5 flex snap-x gap-4 overflow-x-auto pb-2">
          {featuredServices.map((s) => (
              <ServiceCard
                key={'id' in s ? s.id : s.slug}
                name={s.name}
                slug={s.slug}
                categorySlug={s.categorySlug}
                price={s.price}
                durationMinutes={s.durationMinutes}
                image={s.image}
              />
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-4xl">How it works</h2>
        <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[
            'Choose a service',
            'Select date & time',
            'Enter your location',
            'Beautician visits your home',
            'Enjoy your service',
          ].map((step, i) => (
            <li key={step} className="border border-line bg-white p-4">
              <span className="text-xs uppercase tracking-[0.16em] text-gold">Step {i + 1}</span>
              <p className="mt-2 font-medium">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="font-display text-4xl">Why choose us</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ['Verified beauticians', 'Professionals you can review before you book.'],
            ['Home convenience', 'Salon-quality services without travel time.'],
            ['Transparent pricing', 'Service, visit charge, add-ons and discounts — shown clearly.'],
            ['Professional products', 'Treatments planned around the service you select.'],
            ['Easy booking', 'A mobile-first flow from service to confirmation.'],
            ['Trusted service', 'Published customer reviews and before/after results.'],
          ].map(([title, body]) => (
            <div key={title} className="border border-line bg-white p-4">
              <h3 className="font-medium">{title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
          <div className="flex items-end justify-between">
            <h2 className="font-display text-4xl">Before & after</h2>
            <Link href="/before-after" className="text-sm text-rose">
              View all
            </Link>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {featuredBeforeAfter.map((item) => (
              <BeforeAfterSlider
                key={item.title}
                title={item.title}
                beforeSrc={item.beforeSrc}
                afterSrc={item.afterSrc}
              />
            ))}
          </div>
        </section>

      <section>
        <div className="flex items-end justify-between">
          <h2 className="font-display text-4xl">Featured beauticians</h2>
            <Link href="/beauticians" className="text-sm text-rose">
              View all
            </Link>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {featuredBeauticians.map((b) => (
            <BeauticianCard
              key={'id' in b ? b.id : b.slug}
              name={b.name}
              slug={b.slug}
              experienceYears={b.experienceYears}
              rating={b.rating}
              specialization={b.specialization}
              area={b.area}
              image={b.image}
            />
          ))}
        </div>
      </section>

      <section>
          <div className="flex items-end justify-between">
            <h2 className="font-display text-4xl">Reels</h2>
            <Link href="/reels" className="text-sm text-rose">
              View all
            </Link>
          </div>
          <div className="mt-5 flex snap-x gap-3 overflow-x-auto pb-2">
            {featuredReels.map((r) => (
              <ReelCard
                key={'id' in r ? String(r.id) : r.title}
                title={r.title}
                caption={r.caption}
                thumbnail={r.thumbnail}
                videoUrl={'videoUrl' in r ? r.videoUrl : undefined}
                externalUrl={r.externalUrl}
              />
            ))}
          </div>
        </section>

      <section>
        <h2 className="font-display text-4xl">Customer reviews</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {featuredReviews.map((r) => (
            <ReviewCard
              key={'id' in r ? r.id : r.name}
              name={r.name}
              rating={r.rating}
              review={r.review}
              verified={r.verified}
              service={r.service}
            />
          ))}
        </div>
      </section>

      <section>
          <h2 className="font-display text-4xl">Offers</h2>
          <div className="mt-5 grid gap-4">
            {featuredOffers.map((o) => (
              <Link key={o.id} href="/offers" className="block border border-line bg-white p-4">
                <h3 className="font-display text-3xl">{o.title}</h3>
                <p className="mt-2 text-sm text-ink-soft">{o.description}</p>
              </Link>
            ))}
          </div>
        </section>

      <section>
        <h2 className="font-display text-4xl">FAQ</h2>
        <div className="mt-5">
          <Accordion items={featuredFaqs.map((f) => ({ question: f.question, answer: f.answer }))} />
        </div>
      </section>

      <section className="border border-line bg-white px-5 py-10 text-center">
        <h2 className="font-display text-5xl">{home.finalCtaHeadline}</h2>
        <p className="mt-3 text-ink-soft">{home.finalCtaText}</p>
        <Button href="/book" className="mt-6">
          Book your appointment
        </Button>
      </section>
    </div>
  )
}
