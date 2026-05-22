'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
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
    return <p className="text-deep-wood/80 text-lg leading-relaxed font-light">{text}</p>
  }
  return (
    <ReactMarkdown
      components={{
        h2: ({ children }) => <h2 className="font-serif text-2xl text-olive mt-6 mb-2 first:mt-0">{children}</h2>,
        h3: ({ children }) => <h3 className="font-serif text-lg text-deep-wood mt-4 mb-1">{children}</h3>,
        p: ({ children }) => <p className="text-deep-wood/80 text-base leading-relaxed font-light">{children}</p>,
        ul: ({ children }) => <ul className="list-disc list-inside space-y-1 text-deep-wood/80 text-base font-light">{children}</ul>,
        li: ({ children }) => <li>{children}</li>,
        strong: ({ children }) => <strong className="font-semibold text-deep-wood">{children}</strong>,
      }}
    >
      {text}
    </ReactMarkdown>
  )
}

export default function ActivityContent({ activity }: { activity: ActivityData }) {
  const { t, lang } = useLanguage()
  const p = t.acts_page

  const name = getLocalized(activity, 'name', lang)
  const desc = getLocalized(activity, 'description', lang)

  const gallery = (activity.images ?? []).filter(Boolean) as string[]
  const [lightbox, setLightbox] = useState<Lightbox | null>(null)

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

  const mapUrl = `https://www.google.com/maps/search/${encodeURIComponent(p.locationName + ' ' + name)}`

  const metaChips = [
    activity.difficulty && { icon: '🎯', label: p.difficulty,  value: activity.difficulty },
    activity.duration   && { icon: '⏱',  label: p.duration,    value: activity.duration },
    activity.distance   && { icon: '📍',  label: p.distance,    value: activity.distance },
    activity.elevation  && { icon: '⛰',  label: p.elevation,   value: activity.elevation },
    activity.category   && { icon: '🏷',  label: p.category,    value: activity.category },
  ].filter(Boolean) as { icon: string; label: string; value: string }[]

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <div className="relative h-72 sm:h-[420px] overflow-hidden">
        {activity.image_url ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${activity.image_url}')` }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-deep-wood via-[#4a5d45] to-deep-wood" />
        )}
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 h-full flex flex-col justify-end px-6 pb-8 max-w-5xl mx-auto">
          <p className="text-white/50 text-xs tracking-widest mb-2">Myrsini&apos;s Studios · Χόρτο Πηλίου</p>
          <h1 className="font-serif text-4xl sm:text-5xl text-white drop-shadow mb-4">{name}</h1>
          {metaChips.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {metaChips.map(chip => (
                <span key={chip.label} className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/20 px-3 py-1.5 text-white text-xs">
                  <span>{chip.icon}</span>
                  <span className="text-white/60">{chip.label}:</span>
                  <span className="font-medium">{chip.value}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <Link
          href="/#activities"
          className="inline-flex items-center gap-2 text-olive text-sm mb-10 hover:text-deep-wood transition-colors"
        >
          {p.back}
        </Link>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-10">
            {desc && <DescriptionBlock text={desc} />}

            {/* Map */}
            <div className="p-5 bg-white border border-deep-wood/8 shadow-sm">
              <p className="text-xs text-deep-wood/40 uppercase tracking-widest mb-3">{p.location}</p>
              <p className="text-deep-wood font-medium mb-1">{p.locationName}</p>
              <p className="text-sm text-deep-wood/55 mb-4">{p.locationSub}</p>
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-deep-wood text-white text-xs tracking-widest uppercase px-5 py-2.5 hover:bg-olive transition-colors"
              >
                {p.mapBtn}
              </a>
            </div>

            {/* Gallery */}
            {gallery.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-widest text-deep-wood/40 mb-3 pb-2 border-b border-deep-wood/10">Gallery</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {gallery.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setLightbox({ images: gallery, idx: i })}
                      className="relative overflow-hidden h-28 sm:h-36 border border-deep-wood/10 hover:border-olive/50 hover:opacity-90 transition-all"
                    >
                      <img src={url} alt="" className="w-full h-full object-cover" loading="lazy" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="space-y-4">
            {metaChips.length > 0 && (
              <div className="bg-white border border-deep-wood/8 shadow-sm p-5">
                <p className="text-xs text-olive uppercase tracking-widest mb-4">Info</p>
                <div className="space-y-3">
                  {metaChips.map(chip => (
                    <div key={chip.label} className="flex items-start gap-3">
                      <span className="text-lg mt-0.5">{chip.icon}</span>
                      <div>
                        <p className="text-xs text-deep-wood/40 uppercase tracking-wider">{chip.label}</p>
                        <p className="text-sm text-deep-wood font-medium">{chip.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-deep-wood text-white p-5">
              <p className="text-xs uppercase tracking-widest text-white/50 mb-2">{p.help}</p>
              <p className="text-sm leading-relaxed text-white/80 mb-4">{p.helpDesc}</p>
              <Link href="/#contact" className="text-xs tracking-widest uppercase text-olive hover:text-white transition-colors">
                {p.contact}
              </Link>
            </div>
          </div>
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
    </div>
  )
}
