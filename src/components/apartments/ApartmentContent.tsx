'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import type { ApartmentData } from '@/app/apartments/[slug]/page'

function DescriptionBlock({ text }: { text: string }) {
  const hasMarkdown = /#{1,3} |^\s*[-*] |\*\*|\n\n/m.test(text)
  if (!hasMarkdown) {
    return <p className="text-deep-wood/80 text-lg leading-relaxed font-light">{text}</p>
  }
  return (
    <ReactMarkdown
      components={{
        h2: ({ children }) => (
          <h2 className="font-serif text-2xl text-olive mt-6 mb-2 first:mt-0">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="font-serif text-lg text-deep-wood mt-4 mb-1">{children}</h3>
        ),
        p: ({ children }) => (
          <p className="text-deep-wood/80 text-base leading-relaxed font-light">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="list-disc list-inside space-y-1 text-deep-wood/80 text-base font-light">{children}</ul>
        ),
        li: ({ children }) => <li>{children}</li>,
        strong: ({ children }) => <strong className="font-semibold text-deep-wood">{children}</strong>,
      }}
    >
      {text}
    </ReactMarkdown>
  )
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

type Lightbox = { images: string[]; idx: number }

function getLocalized(apt: ApartmentData, base: 'name' | 'description', lang: string): string {
  if (lang === 'el') return (apt[`${base}_el` as keyof ApartmentData] as string) ?? ''
  const v = apt[`${base}_${lang}` as keyof ApartmentData] as string | null | undefined
  return v || (apt[`${base}_en` as keyof ApartmentData] as string) || (apt[`${base}_el` as keyof ApartmentData] as string) || ''
}

export default function ApartmentContent({ apartment: apt }: { apartment: ApartmentData }) {
  const { t, lang } = useLanguage()
  const a  = t.apts
  const am = t.amenities

  const [lightbox, setLightbox] = useState<Lightbox | null>(null)

  const name = getLocalized(apt, 'name', lang)
  const desc = getLocalized(apt, 'description', lang) || undefined
  const bookingPrice = Math.round(apt.price_per_night * 1.151)
  const sqm       = apt.sqm ?? apt.area_sqm ?? 45
  const mainImage = apt.image_url || apt.images?.[0] || apt.gallery?.[0]
  const gallery   = [...new Set([...(apt.gallery ?? []), ...(apt.images ?? [])])].filter(Boolean) as string[]
  const allImages = [...new Set([mainImage, ...gallery])].filter(Boolean) as string[]

  const features = [
    { icon: '👥', label: a.guests,   value: `${apt.max_guests ?? 2}` },
    { icon: '📐', label: a.sqm,       value: `${sqm}m²` },
    { icon: '🛏', label: a.bedrooms,  value: `${apt.bedrooms ?? 1}` },
    { icon: '🚿', label: a.bathrooms, value: `${apt.bathrooms ?? 1}` },
  ]

  useEffect(() => {
    if (!lightbox) return
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Escape')      setLightbox(null)
      if (e.key === 'ArrowLeft')   setLightbox(l => l && l.idx > 0                   ? { ...l, idx: l.idx - 1 } : l)
      if (e.key === 'ArrowRight')  setLightbox(l => l && l.idx < l.images.length - 1 ? { ...l, idx: l.idx + 1 } : l)
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [lightbox])

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <div className="relative h-64 sm:h-[420px] overflow-hidden">
        {mainImage ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${mainImage}')` }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-deep-wood via-[#4a5d45] to-deep-wood" />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 h-full flex flex-col justify-end px-6 pb-10 max-w-5xl mx-auto">
          <p className="text-white/50 text-xs tracking-widest mb-2">Myrsini&apos;s Studios · Χόρτο Πηλίου</p>
          <h1 className="font-serif text-4xl sm:text-5xl text-white drop-shadow">{name}</h1>
          <p className="text-white/60 text-lg font-light mt-2">€{apt.price_per_night}<span className="text-sm">{a.perNight}</span></p>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <Link
          href="/#apartments"
          className="inline-flex items-center gap-2 text-olive text-sm mb-10 hover:text-deep-wood transition-colors"
        >
          {a.back}
        </Link>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-10">

            {/* Description */}
            {desc && (
              <div className="space-y-4">
                <DescriptionBlock text={desc} />
              </div>
            )}

            {/* Amenities */}
            {apt.amenities && apt.amenities.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-widest text-deep-wood/40 mb-4 pb-2 border-b border-deep-wood/10">
                  {isEl ? 'Παροχές' : lang === 'de' ? 'Ausstattung' : lang === 'fr' ? 'Équipements' : 'Amenities'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {apt.amenities.map(key => (
                    <span key={key} className="inline-flex items-center gap-2 text-sm text-deep-wood/70 bg-white border border-deep-wood/10 px-3 py-2 shadow-sm">
                      <span>{AMENITY_ICONS[key] ?? '✓'}</span>
                      <span>{getAmenityLabel(key, am)}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: price card */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow-sm p-6 sticky top-24 space-y-5">
              <div>
                <div className="text-3xl font-light text-olive">
                  €{apt.price_per_night}
                  <span className="text-sm text-olive/70">{a.perNight}</span>
                </div>
                <div className="text-xs text-gray-400 line-through mt-0.5">
                  €{bookingPrice} {a.bookingLabel}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 py-4 border-t border-b border-deep-wood/8">
                {features.map(f => (
                  <div key={f.label} className="text-center">
                    <div className="text-2xl mb-1">{f.icon}</div>
                    <div className="text-sm font-semibold text-deep-wood">{f.value}</div>
                    <div className="text-xs text-deep-wood/40 mt-0.5">{f.label}</div>
                  </div>
                ))}
              </div>

              <Link
                href="/#booking"
                className="block text-center bg-deep-wood text-white py-3.5 text-sm tracking-wide hover:bg-olive transition-colors"
              >
                {a.book}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery thumbnail strip + lightbox trigger */}
      {allImages.length > 0 && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
          <p className="text-xs uppercase tracking-widest text-deep-wood/40 mb-3 pb-2 border-b border-deep-wood/10">Gallery</p>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {allImages.map((url, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setLightbox({ images: allImages, idx: i })}
                className="shrink-0 w-28 h-20 sm:w-36 sm:h-24 overflow-hidden border border-deep-wood/10 hover:border-olive/50 hover:opacity-90 transition-all"
              >
                <img src={url} alt="" className="w-full h-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        </div>
      )}

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
              className="absolute left-3 sm:left-6 text-white/70 hover:text-white text-5xl leading-none px-2 py-10 z-10"
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
              className="absolute right-3 sm:right-6 text-white/70 hover:text-white text-5xl leading-none px-2 py-10 z-10"
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
    </div>
  )
}
