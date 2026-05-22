'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface Apartment {
  id: string
  slug?: string | null
  name_el: string
  name_en?: string | null
  name_de?: string | null
  name_fr?: string | null
  description_el?: string
  description_en?: string | null
  description_de?: string | null
  description_fr?: string | null
  price_per_night: number
  max_guests?: number
  sqm?: number
  area_sqm?: number
  bedrooms?: number
  bathrooms?: number
  amenities?: string[]
  is_active?: boolean
  image_url?: string | null
  images?: string[] | null
  gallery?: string[] | null
}

const AMENITY_ICONS: Record<string, string> = {
  AC: '❄️', WiFi: '📶', Κουζίνα: '🍳', Kitchenette: '☕',
  Parking: '🅿️', Βεράντα: '🌿', 'Θέα θάλασσα': '🌊',
  BBQ: '🔥', Πλυντήριο: '🫧', Τηλεόραση: '📺', Πετσέτες: '🛁', 'Pet Friendly': '🐾',
}

type AmenityLabels = { AC: string; WiFi: string; kitchen: string; kitchenette: string; parking: string; veranda: string; seaview: string; BBQ: string; washer: string; TV: string; towels: string; petFriendly: string }

function getAmenityLabel(key: string, am: AmenityLabels): string {
  const map: Record<string, string> = {
    'AC': am.AC, 'WiFi': am.WiFi, 'Κουζίνα': am.kitchen, 'Kitchenette': am.kitchenette,
    'Parking': am.parking, 'Βεράντα': am.veranda, 'Θέα θάλασσα': am.seaview,
    'BBQ': am.BBQ, 'Πλυντήριο': am.washer, 'Τηλεόραση': am.TV,
    'Πετσέτες': am.towels, 'Pet Friendly': am.petFriendly,
  }
  return map[key] ?? key
}

const GRADIENT_BG = [
  'from-[#2C1B0E] via-[#4a5d45] to-[#2C1B0E]',
  'from-[#1a3040] via-[#2a5060] to-[#1a3040]',
]

type Lightbox = { images: string[]; idx: number }

function getLocalizedField(apt: Apartment, base: 'name' | 'description', lang: string): string {
  if (lang === 'el') return (apt[`${base}_el` as keyof Apartment] as string) ?? ''
  const langVal = apt[`${base}_${lang}` as keyof Apartment] as string | null | undefined
  return langVal || (apt[`${base}_en` as keyof Apartment] as string) || (apt[`${base}_el` as keyof Apartment] as string) || ''
}

export default function ApartmentsSection({ apartments }: { apartments: Apartment[] }) {
  const { t, lang } = useLanguage()
  const am = t.amenities
  const isEl = lang === 'el'

  const [lightbox, setLightbox] = useState<Lightbox | null>(null)

  useEffect(() => {
    if (!lightbox) return
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null)
      if (e.key === 'ArrowLeft')  setLightbox(l => l && l.idx > 0                     ? { ...l, idx: l.idx - 1 } : l)
      if (e.key === 'ArrowRight') setLightbox(l => l && l.idx < l.images.length - 1   ? { ...l, idx: l.idx + 1 } : l)
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [lightbox])

  return (
    <section id="apartments" className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <p className="text-xs tracking-widest uppercase text-olive mb-3">{t.apts.eyebrow}</p>
          <h2 className="font-serif text-4xl sm:text-5xl text-deep-wood mb-4">{t.apts.title}</h2>
          <p className="text-deep-wood/50 text-sm max-w-md mx-auto">{t.apts.desc}</p>
        </div>

        {apartments.length === 0 && (
          <p className="text-center text-deep-wood/40 text-sm py-8">Καμία διαθεσιμότητα αυτή τη στιγμή.</p>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {apartments.map((apt, i) => {
            const name = getLocalizedField(apt, 'name', lang)
            const rawDesc = getLocalizedField(apt, 'description', lang)
            const firstPara = rawDesc.split('\n\n')[0].replace(/[#*_`]/g, '').trim()
            const desc = firstPara.length > 140 ? firstPara.slice(0, 140) + '…' : firstPara
            const bookingPrice = Math.round(apt.price_per_night * 1.151)
            const sqm = apt.sqm ?? apt.area_sqm ?? 45
            const mainImage = apt.image_url || apt.images?.[0] || apt.gallery?.[0]
            const gallery = (apt.gallery ?? []).filter(Boolean) as string[]
            const hasGallery = gallery.length > 0
            const features = [
              { icon: '👥', label: t.apts.guests,   value: `${apt.max_guests ?? 2}` },
              { icon: '📐', label: t.apts.sqm,       value: `${sqm}m²` },
              { icon: '🛏', label: t.apts.bedrooms,  value: `${apt.bedrooms ?? 1}` },
              { icon: '🚿', label: t.apts.bathrooms, value: `${apt.bathrooms ?? 1}` },
            ]

            return (
              <div key={apt.id} className="bg-white shadow-sm hover:shadow-lg transition-shadow duration-300 group">
                {/* Cover image */}
                <div className={`${hasGallery ? 'h-44' : 'h-56'} relative overflow-hidden${!mainImage ? ` bg-gradient-to-br ${GRADIENT_BG[i % GRADIENT_BG.length]}` : ''}`}>
                  {mainImage && (
                    <Image
                      src={mainImage}
                      alt={name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="absolute inset-0 flex items-end p-6">
                    <div>
                      <p className="text-white/60 text-xs tracking-widest mb-1">Myrsini&apos;s Studios</p>
                      {apt.slug ? (
                        <a href={`/apartments/${apt.slug}`} className="font-serif text-white text-2xl drop-shadow hover:text-white/80 transition-colors">
                          {name}
                        </a>
                      ) : (
                        <h3 className="font-serif text-white text-2xl drop-shadow">{name}</h3>
                      )}
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/95 px-3 py-2 text-right shadow-sm">
                    <div className="text-olive font-bold text-base">€{apt.price_per_night}<span className="text-xs font-normal">{t.apts.perNight}</span></div>
                    <div className="text-gray-400 text-xs line-through">€{bookingPrice} {t.apts.bookingLabel}</div>
                  </div>
                </div>

                {/* Gallery thumbnail strip */}
                {hasGallery && (
                  <div className="flex gap-1 px-2 py-2 bg-deep-wood/5 border-b border-deep-wood/8 overflow-x-auto">
                    {gallery.map((url, gi) => (
                      <button
                        key={gi}
                        type="button"
                        onClick={() => setLightbox({ images: gallery, idx: gi })}
                        className="shrink-0 w-16 h-11 overflow-hidden opacity-75 hover:opacity-100 transition-opacity border border-deep-wood/10 hover:border-olive/40"
                      >
                        <img src={url} alt="" className="w-full h-full object-cover" loading="lazy" />
                      </button>
                    ))}
                  </div>
                )}

                <div className="p-6">
                  {desc && (
                    <p className="text-deep-wood/60 text-sm leading-relaxed mb-5">{desc}</p>
                  )}

                  <div className="grid grid-cols-4 gap-2 mb-5 p-3 bg-cream/70 border border-deep-wood/5">
                    {features.map(f => (
                      <div key={f.label} className="text-center">
                        <div className="text-xl mb-1">{f.icon}</div>
                        <div className="text-xs font-semibold text-deep-wood">{f.value}</div>
                        <div className="text-xs text-deep-wood/40 mt-0.5 leading-tight">{f.label}</div>
                      </div>
                    ))}
                  </div>

                  {apt.amenities && apt.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-5">
                      {apt.amenities.map(a => (
                        <span key={a} className="inline-flex items-center gap-1 text-xs text-deep-wood/60 bg-cream border border-deep-wood/8 px-2.5 py-1 rounded-sm">
                          <span>{AMENITY_ICONS[a] ?? '✓'}</span>
                          <span>{getAmenityLabel(a, am)}</span>
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-3">
                    {apt.slug && (
                      <a href={`/apartments/${apt.slug}`}
                        className="flex-1 text-center border border-deep-wood text-deep-wood py-3 text-sm tracking-wide hover:bg-deep-wood hover:text-white transition-colors">
                        {t.apts.details}
                      </a>
                    )}
                    <a href="/#booking"
                      className={`${apt.slug ? 'flex-1' : 'w-full block'} text-center bg-deep-wood text-white py-3 text-sm tracking-wide hover:bg-olive transition-colors`}>
                      {t.apts.book} — €{apt.price_per_night}{t.apts.perNight}
                    </a>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-5 text-white/70 hover:text-white text-4xl leading-none z-10"
            onClick={() => setLightbox(null)}
          >×</button>

          {lightbox.idx > 0 && (
            <button
              className="absolute left-3 sm:left-6 text-white/70 hover:text-white text-5xl leading-none px-2 py-8 z-10"
              onClick={e => { e.stopPropagation(); setLightbox(l => l ? { ...l, idx: l.idx - 1 } : null) }}
            >‹</button>
          )}

          <img
            src={lightbox.images[lightbox.idx]}
            alt=""
            className="max-h-[85vh] max-w-[85vw] object-contain shadow-2xl"
            onClick={e => e.stopPropagation()}
          />

          {lightbox.idx < lightbox.images.length - 1 && (
            <button
              className="absolute right-3 sm:right-6 text-white/70 hover:text-white text-5xl leading-none px-2 py-8 z-10"
              onClick={e => { e.stopPropagation(); setLightbox(l => l ? { ...l, idx: l.idx + 1 } : null) }}
            >›</button>
          )}

          {lightbox.images.length > 1 && (
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/40 text-sm tabular-nums">
              {lightbox.idx + 1} / {lightbox.images.length}
            </p>
          )}
        </div>
      )}
    </section>
  )
}
