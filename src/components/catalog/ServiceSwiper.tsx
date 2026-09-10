'use client'

import { useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper'
import { FreeMode, Navigation, Pagination, Autoplay } from 'swiper/modules'
import { ServiceCard } from '@/components/cards/ServiceCard'
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/ui/Icons'
import { SectionHeading } from '@/components/ui/SectionHeading'
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/pagination'

export type ServiceSlide = {
  id: string
  name: string
  slug: string
  categorySlug: string
  price: number
  durationMinutes: number
  image?: string | null
}

export function ServiceSwiper({ services, title }: { services: ServiceSlide[]; title?: string | null }) {
  const prevRef = useRef<HTMLButtonElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)

  const bindNav = (swiper: SwiperType) => {
    const nav = swiper.params.navigation
    if (!nav || typeof nav === 'boolean') return
    nav.prevEl = prevRef.current
    nav.nextEl = nextRef.current
    swiper.navigation.init()
    swiper.navigation.update()
  }

  const arrows = (
    <div className="flex items-center gap-2">
      <button ref={prevRef} type="button" className="salon-nav-btn" aria-label="Previous services">
        <ChevronLeftIcon className="h-5 w-5" />
      </button>
      <button ref={nextRef} type="button" className="salon-nav-btn" aria-label="Next services">
        <ChevronRightIcon className="h-5 w-5" />
      </button>
    </div>
  )

  return (
    <div className="service-swiper">
      <SectionHeading title={title} actions={arrows} />
      <Swiper
        modules={[FreeMode, Navigation, Pagination, Autoplay]}
        slidesPerView={1.12}
        spaceBetween={14}
        grabCursor
        speed={700}
        autoplay={{ delay: 2800, disableOnInteraction: false, pauseOnMouseEnter: true }}
        freeMode={{ enabled: true, sticky: false }}
        navigation
        pagination={{ clickable: true }}
        onBeforeInit={bindNav}
        onSwiper={bindNav}
        breakpoints={{
          480: { slidesPerView: 1.45, spaceBetween: 14 },
          768: { slidesPerView: 2.2, spaceBetween: 16 },
          1024: { slidesPerView: 3.15, spaceBetween: 20 },
        }}
      >
        {services.map((s) => (
          <SwiperSlide key={s.id}>
            <ServiceCard
              name={s.name}
              slug={s.slug}
              categorySlug={s.categorySlug}
              price={s.price}
              durationMinutes={s.durationMinutes}
              image={s.image}
              className="h-full min-w-0"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
