'use client'

import { useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper'
import { FreeMode, Mousewheel, Navigation, Pagination } from 'swiper/modules'
import { ServiceCard } from '@/components/cards/ServiceCard'
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

export function ServiceSwiper({ services }: { services: ServiceSlide[] }) {
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

  return (
    <div className="service-swiper relative mt-5">
      <button ref={prevRef} type="button" className="service-swiper-prev" aria-label="Previous services">
        ‹
      </button>
      <button ref={nextRef} type="button" className="service-swiper-next" aria-label="Next services">
        ›
      </button>
      <Swiper
        modules={[FreeMode, Mousewheel, Navigation, Pagination]}
        slidesPerView={1.15}
        spaceBetween={16}
        grabCursor
        freeMode={{ enabled: true, sticky: false }}
        mousewheel={{ forceToAxis: true, releaseOnEdges: true }}
        navigation
        pagination={{ clickable: true }}
        onBeforeInit={bindNav}
        onSwiper={bindNav}
        breakpoints={{
          480: { slidesPerView: 1.5, spaceBetween: 16 },
          768: { slidesPerView: 2.25, spaceBetween: 16 },
          1024: { slidesPerView: 3.2, spaceBetween: 20 },
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
