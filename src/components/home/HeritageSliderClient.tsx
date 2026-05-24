'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'

type SliderPhoto = {
  id: string
  image_url: string
  title: string
}

export default function HeritageSliderClient({ photos }: { photos: SliderPhoto[] }) {
  return (
    <section className="bg-[#2C1B0E] py-12 overflow-hidden">
      <p className="text-center text-white/40 text-xs tracking-widest mb-8">Παλιές Αναμνήσεις</p>
      <Swiper
        modules={[Autoplay]}
        slidesPerView="auto"
        spaceBetween={24}
        loop={true}
        speed={5000}
        autoplay={{ delay: 0, disableOnInteraction: false, pauseOnMouseEnter: true }}
        allowTouchMove={true}
        className="w-full"
      >
        {photos.map((p, i) => (
          <SwiperSlide key={i} style={{ width: '224px' }}>
            <div className="overflow-hidden border border-white/10">
              {p.image_url ? (
                <img
                  src={p.image_url}
                  alt={p.title}
                  className="w-56 h-36 object-cover block"
                  loading="lazy"
                />
              ) : (
                <div className="w-56 h-36 bg-[#3a2a18]" />
              )}
              <div className="px-3 py-2 bg-[#1e0f07]">
                <span className="text-white/50 text-xs">{p.title}</span>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}
