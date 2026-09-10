import { getPayloadClient } from '@/lib/payload'
import { ServiceSwiper } from '@/components/catalog/ServiceSwiper'
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
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import Link from 'next/link'

export async function generateMetadata() {
  const payload = await getPayloadClient()
  const home = await payload.findGlobal({ slug: 'homepage', overrideAccess: true })
  return pageMeta({
    title: home.heroHeadline || 'Home',
    description: home.heroText || '',
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

  const featuredServices = services.docs.map((s) => ({
    id: String(s.id),
    name: s.name,
    slug: s.slug,
    categorySlug: rel(s.category)?.slug || 'all',
    price: serviceSellPrice(s),
    durationMinutes: s.durationMinutes,
    image: mediaUrl(rel(s.featuredImage)),
  }))

  const featuredBeauticians = beauticians.docs.map((b) => ({
    id: String(b.id),
    name: b.name,
    slug: b.slug,
    experienceYears: b.experienceYears,
    rating: b.rating ?? 0,
    specialization: rel(b.specializations?.[0])?.name,
    area: rel(b.serviceAreas?.[0])?.name,
    image: mediaUrl(rel(b.profileImage)),
  }))

  const featuredReviews = reviews.docs.map((r) => ({
    id: String(r.id),
    name: r.customerName,
    rating: r.rating,
    review: r.review,
    verified: Boolean(r.verifiedCustomer),
    service: rel(r.service)?.name,
  }))

  const featuredBeforeAfter = beforeAfter.docs.map((item) => ({
    id: String(item.id),
    title: item.title,
    beforeSrc: mediaUrl(rel(item.beforeImage)) || '',
    afterSrc: mediaUrl(rel(item.afterImage)) || '',
  }))

  const featuredReels = reels.docs.map((r) => ({
    id: String(r.id),
    title: r.title,
    caption: r.caption || undefined,
    thumbnail: mediaUrl(rel(r.thumbnail)),
    videoUrl: mediaUrl(rel(r.video)),
    externalUrl: r.externalUrl || undefined,
  }))

  const howItWorks = (home.howItWorks || []).filter((step) => step.title)
  const whyItems = (home.whyItems || []).filter((item) => item.title)
  const heroSrc = mediaUrl(rel(home.heroImage))
  const primaryHref = home.primaryCtaHref || settings.headerCtaHref || '/book'
  const primaryLabel = home.primaryCtaLabel || settings.headerCtaLabel
  const secondaryHref = home.secondaryCtaHref || '/services'
  const secondaryLabel = home.secondaryCtaLabel
  const finalHref = home.finalCtaHref || '/book'
  const finalLabel = home.finalCtaLabel

  return (
    <div className="space-y-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: localBusiness }} />
      {home.heroHeadline || home.heroText || heroSrc ? (
        <section className="grid items-center gap-8 overflow-hidden rounded-[1.75rem] border border-gold/25 bg-white/80 p-5 shadow-[0_18px_40px_rgba(90,36,50,0.06)] sm:p-8 lg:grid-cols-2">
          <div className="hero-enter">
            {home.heroBadge ? <Badge>{home.heroBadge}</Badge> : null}
            {home.heroHeadline ? (
              <h1 className="mt-4 font-display text-[2.6rem] leading-[0.95] text-ink sm:text-6xl">{home.heroHeadline}</h1>
            ) : null}
            {home.heroText ? <p className="mt-5 max-w-xl text-base leading-8 text-ink-soft">{home.heroText}</p> : null}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              {primaryLabel ? <Button href={primaryHref}>{primaryLabel}</Button> : null}
              {secondaryLabel ? (
                <Button href={secondaryHref} variant="secondary">
                  {secondaryLabel}
                </Button>
              ) : null}
              {settings.whatsapp ? (
                <Button href={whatsappLink(settings.whatsapp, DEFAULT_WHATSAPP_MESSAGE)} variant="ghost">
                  WhatsApp
                </Button>
              ) : null}
            </div>
          </div>
          {heroSrc ? (
            <div className="salon-frame overflow-hidden rounded-[1.4rem] bg-blush">
              <div className="aspect-[4/5] sm:aspect-[5/4]">
                <img src={heroSrc} alt="" className="ken-burns h-full w-full object-cover" />
              </div>
            </div>
          ) : null}
        </section>
      ) : null}

      {featuredServices.length ? (
        <Reveal>
          <section>
            <ServiceSwiper title={home.servicesTitle} services={featuredServices} />
          </section>
        </Reveal>
      ) : null}

      {howItWorks.length ? (
        <Reveal>
          <section>
            <SectionHeading title={home.howItWorksTitle} />
            <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {howItWorks.map((step, i) => (
                <li key={`${step.title}-${i}`} className="salon-card rounded-2xl border border-gold/20 bg-white p-4">
                  <span className="font-display text-3xl text-gold">{String(i + 1).padStart(2, '0')}</span>
                  <p className="mt-2 font-medium">{step.title}</p>
                </li>
              ))}
            </ol>
          </section>
        </Reveal>
      ) : null}

      {whyItems.length ? (
        <Reveal>
          <section>
            <SectionHeading title={home.whyTitle} />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {whyItems.map((item, i) => (
                <div key={`${item.title}-${i}`} className="salon-card rounded-2xl border border-gold/20 bg-white p-5">
                  <h3 className="font-display text-2xl">{item.title}</h3>
                  {item.body ? <p className="mt-2 text-sm leading-7 text-ink-soft">{item.body}</p> : null}
                </div>
              ))}
            </div>
          </section>
        </Reveal>
      ) : null}

      {featuredBeforeAfter.length ? (
        <Reveal>
          <section>
            <SectionHeading title={home.beforeAfterTitle} href="/before-after" />
            <div className="grid gap-4 sm:grid-cols-2">
              {featuredBeforeAfter.map((item) => (
                <BeforeAfterSlider
                  key={item.id}
                  title={item.title}
                  beforeSrc={item.beforeSrc}
                  afterSrc={item.afterSrc}
                />
              ))}
            </div>
          </section>
        </Reveal>
      ) : null}

      {featuredBeauticians.length ? (
        <Reveal>
          <section>
            <SectionHeading title={home.beauticiansTitle} href="/beauticians" />
            <div className="grid gap-4 sm:grid-cols-2">
              {featuredBeauticians.map((b) => (
                <BeauticianCard
                  key={b.id}
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
        </Reveal>
      ) : null}

      {featuredReels.length ? (
        <Reveal>
          <section>
            <SectionHeading title={home.reelsTitle} href="/reels" />
            <div className="flex snap-x gap-3 overflow-x-auto pb-2">
              {featuredReels.map((r) => (
                <ReelCard
                  key={r.id}
                  title={r.title}
                  caption={r.caption}
                  thumbnail={r.thumbnail}
                  videoUrl={r.videoUrl}
                  externalUrl={r.externalUrl}
                />
              ))}
            </div>
          </section>
        </Reveal>
      ) : null}

      {featuredReviews.length ? (
        <Reveal>
          <section>
            <SectionHeading title={home.reviewsTitle} />
            <div className="grid gap-4 md:grid-cols-2">
              {featuredReviews.map((r) => (
                <ReviewCard
                  key={r.id}
                  name={r.name}
                  rating={r.rating}
                  review={r.review}
                  verified={r.verified}
                  service={r.service}
                />
              ))}
            </div>
          </section>
        </Reveal>
      ) : null}

      {activeOffers.length ? (
        <Reveal>
          <section>
            <SectionHeading title={home.offersTitle} />
            <div className="grid gap-4">
              {activeOffers.map((o) => (
                <Link
                  key={o.id}
                  href="/offers"
                  className="salon-card block rounded-2xl border border-gold/20 bg-white p-5 shadow-[0_12px_28px_rgba(90,36,50,0.06)]"
                >
                  <h3 className="font-display text-3xl">{o.title}</h3>
                  <p className="mt-2 text-sm text-ink-soft">{o.description}</p>
                </Link>
              ))}
            </div>
          </section>
        </Reveal>
      ) : null}

      {faqs.docs.length ? (
        <Reveal>
          <section>
            <SectionHeading title={home.faqTitle} />
            <Accordion items={faqs.docs.map((f) => ({ question: f.question, answer: f.answer }))} />
          </section>
        </Reveal>
      ) : null}

      {home.finalCtaHeadline || home.finalCtaText || finalLabel ? (
        <Reveal>
          <section className="cta-glow rounded-[1.75rem] border border-gold/30 bg-rose px-5 py-12 text-center text-white">
            {home.finalCtaHeadline ? <h2 className="font-display text-5xl">{home.finalCtaHeadline}</h2> : null}
            {home.finalCtaText ? <p className="mt-3 text-white/80">{home.finalCtaText}</p> : null}
            {finalLabel ? (
              <Button href={finalHref} variant="gold" className="mt-6">
                {finalLabel}
              </Button>
            ) : null}
          </section>
        </Reveal>
      ) : null}
    </div>
  )
}
