'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export type ActivityData = {
  id: string
  slug: string
  name_el: string
  name_en?: string | null
  name_de?: string | null
  name_fr?: string | null
  icon: string
  image_url?: string | null
  images?: string[] | null
  description_el: string
  description_en?: string | null
  description_de?: string | null
  description_fr?: string | null
  duration?: string | null
  distance?: string | null
  elevation?: string | null
  difficulty?: string | null
  category?: string | null
  map_url?: string | null
  duration_min?: number | null
  distance_km?: number | null
}

type Lightbox = { images: string[]; idx: number }

function getLocalized(act: ActivityData, base: 'name' | 'description', lang: string): string {
  if (lang === 'el') return (act[`${base}_el` as keyof ActivityData] as string) ?? ''
  const v = act[`${base}_${lang}` as keyof ActivityData] as string | null | undefined
  return v || (act[`${base}_en` as keyof ActivityData] as string) || (act[`${base}_el` as keyof ActivityData] as string) || ''
}

function DescriptionBlock({ text }: { text: string }) {
  const hasMarkdown = /#{1,3} |^\s*[-*] |\*\*|\n\n/m.test(text)
  if (!hasMarkdown) {
    return <p className="text-deep-wood/75 text-base leading-relaxed font-light">{text}</p>
  }
  return (
    <ReactMarkdown
      components={{
        h2: ({ children }) => <h2 className="font-serif text-xl text-olive mt-6 mb-2 first:mt-0">{children}</h2>,
        h3: ({ children }) => <h3 className="font-serif text-base text-deep-wood mt-4 mb-1">{children}</h3>,
        p: ({ children }) => <p className="text-deep-wood/75 text-base leading-relaxed font-light">{children}</p>,
        ul: ({ children }) => <ul className="list-disc list-inside space-y-1 text-deep-wood/75 text-base font-light">{children}</ul>,
        li: ({ children }) => <li>{children}</li>,
        strong: ({ children }) => <strong className="font-semibold text-deep-wood">{children}</strong>,
      }}
    >
      {text}
    </ReactMarkdown>
  )
}

const DIFFICULTY_COLOR: Record<string, string> = {
  easy:     'bg-green-50 text-green-700 border-green-200',
  medium:   'bg-amber-50 text-amber-700 border-amber-200',
  hard:     'bg-red-50 text-red-700 border-red-200',
  Εύκολη:  'bg-green-50 text-green-700 border-green-200',
  Μέτρια:  'bg-amber-50 text-amber-700 border-amber-200',
  Δύσκολη: 'bg-red-50 text-red-700 border-red-200',
}

export default function ActivityContent({ activity }: { activity: ActivityData }) {
  const { t, lang } = useLanguage()
  const p = t.acts_page

  const name = getLocalized(activity, 'name', lang)
  const desc = getLocalized(activity, 'description', lang)

  // Hero image: prefer image_url, fallback to images[0]
  const heroImage = activity.image_url || activity.images?.[0] || null
  const gallery = (activity.images ?? []).filter(Boolean) as string[]

  // Duration / distance: prefer text fields, fall back to numeric DB columns
  const durationDisplay = activity.duration || (activity.duration_min ? `${activity.duration_min} min` : null)
  const distanceDisplay  = activity.distance  || (activity.distance_km  ? `${activity.distance_km} km`   : null)

  const [lightbox, setLightbox] = useState<Lightbox | null>(null)

  useEffect(() => {
    if (!lightbox) return
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Escape')     setLightbox(null)
      if (e.key === 'ArrowLeft')  setLightbox(l => l && l.idx > 0                   ? { ...l, idx: l.idx - 1 } : l)
      if (e.key === 'ArrowRight') setLightbox(l => l && l.idx < l.images.length - 1 ? { ...l, idx: l.idx + 1 } : l)
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [lightbox])

  const mapUrl = activity.map_url || `https://www.google.com/maps/search/${encodeURIComponent(`${p.locationName} ${name}`)}`

  const diffColor = activity.difficulty ? (DIFFICULTY_COLOR[activity.difficulty] ?? 'bg-cream text-deep-wood/60 border-deep-wood/15') : ''

  return (
    <div className="min-h-screen bg-cream">

      {/* ─── Hero ─── */}
      <div className="relative h-72 sm:h-[460px] overflow-hidden">
        {heroImage ? (
          <Image
            src={heroImage}
            alt={name}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-deep-wood via-[#4a5d45] to-[#2C1B0E]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10" />

        {/* Back link */}
        <div className="absolute top-6 left-4 sm:left-8 z-10">
          <Link
            href="/#activities"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-xs tracking-widest uppercase transition-colors bg-black/20 backdrop-blur-sm px-3 py-1.5 border border-white/15"
          >
            ← {p.back.replace('← ', '')}
          </Link>
        </div>

        <div className="absolute inset-x-0 bottom-0 pb-8 px-6 max-w-5xl mx-auto">
          {activity.category && (
            <p className="text-white/50 text-xs tracking-widest uppercase mb-2">{activity.category}</p>
          )}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-white drop-shadow-lg mb-4 leading-tight">
            {activity.icon} {name}
          </h1>
          {/* Stat pills */}
          <div className="flex flex-wrap gap-2">
            {activity.difficulty && (
              <span className={`text-xs font-medium px-3 py-1.5 border ${diffColor}`}>
                🎯 {activity.difficulty}
              </span>
            )}
            {durationDisplay && (
              <span className="text-xs text-white/80 bg-white/15 backdrop-blur-sm border border-white/20 px-3 py-1.5">
                ⏱ {durationDisplay}
              </span>
            )}
            {distanceDisplay && (
              <span className="text-xs text-white/80 bg-white/15 backdrop-blur-sm border border-white/20 px-3 py-1.5">
                📍 {distanceDisplay}
              </span>
            )}
            {activity.elevation && (
              <span className="text-xs text-white/80 bg-white/15 backdrop-blur-sm border border-white/20 px-3 py-1.5">
                ⛰ {activity.elevation}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ─── Body ─── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-12">

          {/* ── Left: content ── */}
          <div className="lg:col-span-2 space-y-10">

            {/* Description */}
            {desc && (
              <div>
                <p className="text-xs text-olive uppercase tracking-widest mb-4 pb-3 border-b border-deep-wood/10">
                  {lang === 'el' ? 'Περιγραφή' : lang === 'de' ? 'Beschreibung' : lang === 'fr' ? 'Description' : 'Description'}
                </p>
                <DescriptionBlock text={desc} />
              </div>
            )}

            {/* Gallery */}
            {gallery.length > 0 && (
              <div>
                <p className="text-xs text-deep-wood/40 uppercase tracking-widest mb-4 pb-3 border-b border-deep-wood/10">
                  Gallery
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {gallery.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setLightbox({ images: gallery, idx: i })}
                      className="relative overflow-hidden h-32 sm:h-40 border border-deep-wood/10 hover:border-olive/50 hover:opacity-90 transition-all group"
                    >
                      <img src={url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            <div className="bg-white border border-deep-wood/8 shadow-sm p-6">
              <p className="text-xs text-deep-wood/40 uppercase tracking-widest mb-4">{p.location}</p>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-olive/10 border border-olive/20 shrink-0">
                  <span className="text-olive text-xl">📍</span>
                </div>
                <div>
                  <p className="text-deep-wood font-serif text-lg mb-0.5">{p.locationName}</p>
                  <p className="text-sm text-deep-wood/55 mb-4">{p.locationSub}</p>
                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-deep-wood text-white text-xs tracking-widest uppercase px-5 py-2.5 hover:bg-olive transition-colors"
                  >
                    {p.mapBtn}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: sidebar ── */}
          <div className="space-y-5">

            {/* Info card */}
            {(durationDisplay || distanceDisplay || activity.elevation || activity.difficulty || activity.category) && (
              <div className="bg-white border border-deep-wood/8 shadow-sm p-5">
                <p className="text-xs text-olive uppercase tracking-widest mb-5">
                  {lang === 'el' ? 'Πληροφορίες' : lang === 'de' ? 'Info' : 'Info'}
                </p>
                <div className="space-y-4">
                  {activity.difficulty && (
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🎯</span>
                      <div>
                        <p className="text-[10px] text-deep-wood/40 uppercase tracking-wider">{p.difficulty}</p>
                        <span className={`inline-block text-xs font-medium px-2 py-0.5 mt-0.5 border ${diffColor}`}>{activity.difficulty}</span>
                      </div>
                    </div>
                  )}
                  {durationDisplay && (
                    <div className="flex items-center gap-3">
                      <span className="text-xl">⏱</span>
                      <div>
                        <p className="text-[10px] text-deep-wood/40 uppercase tracking-wider">{p.duration}</p>
                        <p className="text-sm text-deep-wood font-medium mt-0.5">{durationDisplay}</p>
                      </div>
                    </div>
                  )}
                  {distanceDisplay && (
                    <div className="flex items-center gap-3">
                      <span className="text-xl">📏</span>
                      <div>
                        <p className="text-[10px] text-deep-wood/40 uppercase tracking-wider">{p.distance}</p>
                        <p className="text-sm text-deep-wood font-medium mt-0.5">{distanceDisplay}</p>
                      </div>
                    </div>
                  )}
                  {activity.elevation && (
                    <div className="flex items-center gap-3">
                      <span className="text-xl">⛰</span>
                      <div>
                        <p className="text-[10px] text-deep-wood/40 uppercase tracking-wider">{p.elevation}</p>
                        <p className="text-sm text-deep-wood font-medium mt-0.5">{activity.elevation}</p>
                      </div>
                    </div>
                  )}
                  {activity.category && (
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🏷</span>
                      <div>
                        <p className="text-[10px] text-deep-wood/40 uppercase tracking-wider">{p.category}</p>
                        <p className="text-sm text-deep-wood font-medium mt-0.5">{activity.category}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Contact card */}
            <div className="bg-deep-wood text-white p-5">
              <p className="text-xs uppercase tracking-widest text-white/40 mb-3">
                {lang === 'el' ? 'Οργάνωση' : lang === 'de' ? 'Organisation' : lang === 'fr' ? 'Organisation' : 'Organise'}
              </p>
              <p className="font-serif text-lg mb-2">{p.help}</p>
              <p className="text-sm leading-relaxed text-white/70 mb-5">{p.helpDesc}</p>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-olive hover:text-white transition-colors border border-olive/30 hover:border-olive/70 px-4 py-2.5"
              >
                {p.contact}
              </Link>
            </div>

            {/* Back link */}
            <Link
              href="/#activities"
              className="flex items-center justify-center gap-2 text-xs text-deep-wood/50 hover:text-deep-wood tracking-wide transition-colors py-3 border border-deep-wood/15 hover:border-deep-wood/30"
            >
              {p.back}
            </Link>
          </div>
        </div>
      </div>

      {/* ─── Lightbox ─── */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
          onClick={() => setLightbox(null)}
        >
          <button className="absolute top-4 right-5 text-white/70 hover:text-white text-4xl leading-none z-10" onClick={() => setLightbox(null)}>×</button>
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
    </div>
  )
}
