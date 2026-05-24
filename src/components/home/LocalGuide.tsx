'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import type { POI } from '@/app/api/pois/route'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

type Category = 'all' | POI['category']

const CATEGORY_LABELS: Record<Category, string> = {
  all:         'Όλα',
  restaurant:  'Εστιατόρια',
  cafe:        'Καφέ',
  beach:       'Παραλίες',
  viewpoint:   'Θέα',
  museum:      'Μουσεία',
  bar:         'Μπαρ',
  supermarket: 'Super market',
  other:  'Αξιοθέατα',
}

const CATEGORY_ICONS: Record<Category, string> = {
  all:         '🗺️',
  restaurant:  '🍽️',
  cafe:        '☕',
  beach:       '🏖️',
  viewpoint:   '🔭',
  museum:      '🏛️',
  bar:         '🍹',
  supermarket: '🛒',
  other:  '🏰',
}

const CATEGORIES: Category[] = ['all','restaurant','cafe','beach','viewpoint','museum','bar','supermarket','other']

export default function LocalGuide() {
  const { lang } = useLanguage()
  const [pois, setPois] = useState<POI[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [activeCategory, setActiveCategory] = useState<Category>('all')

  useEffect(() => {
    fetch('/api/pois')
      .then(r => r.json())
      .then(d => { setPois(d.pois ?? []); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [])

  const getName = (poi: POI): string => {
    if (lang === 'el') return poi.name_el
    const v = poi[`name_${lang}` as keyof POI] as string | undefined
    return v || poi.name_en || poi.name_el
  }

  const getDesc = (poi: POI): string | undefined => {
    const field = lang === 'el' ? poi.description_el : (poi[`description_${lang}` as keyof POI] as string | undefined) || poi.description_en || poi.description_el
    return field || undefined
  }

  const filtered = activeCategory === 'all'
    ? pois
    : pois.filter(p => p.category === activeCategory)

  const usedCategories = new Set(pois.map(p => p.category))
  const visibleCategories = CATEGORIES.filter(c => c === 'all' || usedCategories.has(c))

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {visibleCategories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-full border transition-all ${
              activeCategory === cat
                ? 'bg-olive text-white border-olive'
                : 'bg-white text-deep-wood/70 border-deep-wood/15 hover:border-olive/40'
            }`}
          >
            <span>{CATEGORY_ICONS[cat]}</span>
            <span>{CATEGORY_LABELS[cat]}</span>
          </button>
        ))}
      </div>

      {/* Swiper Carousel */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-6 h-6 rounded-full border-2 border-olive/30 border-t-olive animate-spin" />
        </div>
      ) : error || pois.length === 0 ? (
        <div className="text-center py-12 text-deep-wood/40 text-sm">
          <p className="text-2xl mb-2">🗺️</p>
          <p>Δεν βρέθηκαν σημεία ενδιαφέροντος.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-8 text-deep-wood/40 text-sm">
          Δεν βρέθηκαν {CATEGORY_LABELS[activeCategory].toLowerCase()} στην περιοχή.
        </div>
      ) : (
        <Swiper
          modules={[Pagination]}
          slidesPerView={1.4}
          spaceBetween={16}
          pagination={{ clickable: true, dynamicBullets: true }}
          breakpoints={{
            480:  { slidesPerView: 2.2, spaceBetween: 16 },
            768:  { slidesPerView: 3.2, spaceBetween: 16 },
            1024: { slidesPerView: 4,   spaceBetween: 16 },
          }}
          style={{
            '--swiper-pagination-color': '#6b7c3a',
            '--swiper-pagination-bullet-inactive-color': '#2C1B0E',
            '--swiper-pagination-bullet-inactive-opacity': '0.2',
          } as React.CSSProperties}
          className="pb-10"
        >
          {filtered.map(poi => (
            <SwiperSlide key={poi.id} className="h-auto">
              <div className="bg-white border border-deep-wood/8 rounded-xl overflow-hidden hover:border-olive/40 hover:shadow-md transition-all group cursor-pointer h-full">
                {poi.image_url && (
                  <img src={poi.image_url} alt={getName(poi)} className="w-full h-28 object-cover block" />
                )}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-cream flex items-center justify-center text-lg shrink-0 group-hover:scale-110 transition-transform">
                      {CATEGORY_ICONS[poi.category]}
                    </div>
                    <p className="text-[10px] text-olive/80 uppercase tracking-wider">{CATEGORY_LABELS[poi.category]}</p>
                  </div>
                  <p className="text-sm font-medium text-deep-wood leading-tight mb-1 line-clamp-2">{getName(poi)}</p>
                  {getDesc(poi) && (
                    <p className="text-[10px] text-deep-wood/50 leading-relaxed line-clamp-2 mb-2">{getDesc(poi)}</p>
                  )}
                  {poi.google_maps_url ? (
                    <a
                      href={poi.google_maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="text-[10px] text-olive flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span>📍</span> Google Maps
                    </a>
                  ) : null}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      <p className="text-xs text-deep-wood/25 mt-3 text-right">Πηγή: OpenStreetMap</p>
    </div>
  )
}
