'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import type { POI } from '@/app/api/pois/route'

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
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/pois')
      .then(r => r.json())
      .then(d => { setPois(d.pois ?? []); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [])

  const checkScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollLeft = 0
    const id = setTimeout(checkScroll, 50)
    return () => clearTimeout(id)
  }, [activeCategory, pois, checkScroll])

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'right' ? 300 : -300, behavior: 'smooth' })
  }

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

      {/* Carousel */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-6 h-6 rounded-full border-2 border-olive/30 border-t-olive animate-spin" />
        </div>
      ) : error || pois.length === 0 ? (
        <div className="text-center py-12 text-deep-wood/40 text-sm">
          <p className="text-2xl mb-2">🗺️</p>
          <p>Δεν βρέθηκαν σημεία ενδιαφέροντος.</p>
        </div>
      ) : (
        <div className="relative">
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white border border-deep-wood/12 shadow-md rounded-full text-deep-wood/60 hover:text-olive hover:border-olive/40 transition-colors"
              aria-label="Scroll left"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
          )}

          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide snap-x snap-mandatory"
          >
            {filtered.map(poi => (
              <div
                key={poi.id}
                className="shrink-0 w-48 sm:w-56 bg-white border border-deep-wood/8 rounded-xl overflow-hidden hover:border-olive/40 hover:shadow-md transition-all snap-start group cursor-pointer"
              >
                {/* Image if exists */}
                {poi.image_url && (
                  <img src={poi.image_url} alt={getName(poi)} className="w-full h-28 object-cover block" />
                )}

                <div className="p-4">
                  {/* Icon + category */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-8 h-8 rounded-full bg-cream flex items-center justify-center text-lg shrink-0 group-hover:scale-110 transition-transform ${poi.image_url ? '' : ''}`}>
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
            ))}

            {filtered.length === 0 && (
              <div className="w-full text-center py-8 text-deep-wood/40 text-sm">
                Δεν βρέθηκαν {CATEGORY_LABELS[activeCategory].toLowerCase()} στην περιοχή.
              </div>
            )}
          </div>

          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white border border-deep-wood/12 shadow-md rounded-full text-deep-wood/60 hover:text-olive hover:border-olive/40 transition-colors"
              aria-label="Scroll right"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          )}
        </div>
      )}

      <p className="text-xs text-deep-wood/25 mt-3 text-right">Πηγή: OpenStreetMap</p>
    </div>
  )
}
