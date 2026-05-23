'use client'

import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import type { Lang } from '@/lib/i18n/translations'

type HistoryPhoto = {
  id: string
  image_url: string
  caption: string
  caption_en?: string
  caption_de?: string
  caption_fr?: string
  sort_order: number
  tall?: boolean
}

type SoulRow = {
  title_el: string; title_en: string; title_de: string; title_fr: string
  body_el: string;  body_en: string;  body_de: string;  body_fr: string
}

type Lightbox = { photos: HistoryPhoto[]; idx: number }

const FALLBACK: HistoryPhoto[] = [
  { id: '1', image_url: '', caption: 'Η Αυλή',          sort_order: 1, tall: true },
  { id: '2', image_url: '', caption: 'Θέα Κόλπου',      sort_order: 2 },
  { id: '3', image_url: '', caption: 'Ελαιώνας',        sort_order: 3 },
  { id: '4', image_url: '', caption: 'Πέτρινη Είσοδος', sort_order: 4, tall: true },
  { id: '5', image_url: '', caption: 'Ηλιοβασίλεμα',   sort_order: 5 },
  { id: '6', image_url: '', caption: 'Βεράντα',         sort_order: 6, tall: true },
  { id: '7', image_url: '', caption: 'Νυχτερινή Θέα',  sort_order: 7 },
  { id: '8', image_url: '', caption: 'Τοπική Κουζίνα',  sort_order: 8 },
  { id: '9', image_url: '', caption: 'Βότσαλα & Πεύκα', sort_order: 9 },
]

const FALLBACK_GRADIENTS = [
  'from-[#2C1B0E] via-[#5c3a1e] to-[#2C1B0E]',
  'from-[#1a3a5c] via-[#2a6080] to-[#1a3040]',
  'from-[#1c3d1e] via-[#2d5e20] to-[#1c3d1e]',
  'from-[#3d2a14] via-[#7a5a2e] to-[#3d2a14]',
  'from-[#0d2b40] via-[#1a5a7a] to-[#0d2b40]',
  'from-[#2c1b0e] via-[#4a5d45] to-[#2c1b0e]',
  'from-[#1a1a2e] via-[#2a2a4a] to-[#1a1a2e]',
  'from-[#4a1c0e] via-[#8b3a1a] to-[#4a1c0e]',
  'from-[#1c3d1e] via-[#3a6e2a] to-[#1c3d1e]',
]

function getCaption(photo: HistoryPhoto, lang: Lang): string {
  if (lang === 'el') return photo.caption || ''
  const v = photo[`caption_${lang}` as keyof HistoryPhoto] as string | undefined
  return v || photo.caption_en || photo.caption || ''
}

function soulField(soul: SoulRow, base: 'title' | 'body', lang: Lang): string {
  const v = soul[`${base}_${lang}` as keyof SoulRow] as string
  if (v) return v
  if (lang !== 'el') return (soul[`${base}_el` as keyof SoulRow] as string) || ''
  return ''
}

function SoulBody({ text }: { text: string }) {
  return (
    <ReactMarkdown
      components={{
        h2: ({ children }) => (
          <h2 className="font-serif text-2xl text-deep-wood mt-10 mb-3 first:mt-0">{children}</h2>
        ),
        p: ({ children }) => (
          <p className="text-deep-wood/65 text-base leading-[1.85] mb-4">{children}</p>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-deep-wood">{children}</strong>
        ),
      }}
    >
      {text}
    </ReactMarkdown>
  )
}

export default function HistoryMasonry() {
  const { t, lang } = useLanguage()
  const h = t.history
  const [photos, setPhotos] = useState<HistoryPhoto[]>(FALLBACK)
  const [soul, setSoul] = useState<SoulRow | null>(null)
  const [lightbox, setLightbox] = useState<Lightbox | null>(null)

  useEffect(() => {
    import('@/lib/supabase/client').then(({ createClient }) => {
      const client = createClient()
      client.from('history_photos').select('*').order('sort_order')
        .then(({ data }) => { if (data && data.length > 0) setPhotos(data as HistoryPhoto[]) })
      client.from('soul_content').select('title_el,title_en,title_de,title_fr,body_el,body_en,body_de,body_fr').eq('id', 1).single()
        .then(({ data }) => { if (data) setSoul(data as SoulRow) })
    })
  }, [])

  useEffect(() => {
    if (!lightbox) return
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null)
      if (e.key === 'ArrowLeft')  setLightbox(l => l && l.idx > 0                       ? { ...l, idx: l.idx - 1 } : l)
      if (e.key === 'ArrowRight') setLightbox(l => l && l.idx < l.photos.length - 1     ? { ...l, idx: l.idx + 1 } : l)
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [lightbox])

  const title = soul ? soulField(soul, 'title', lang) || h.title : h.title
  const body  = soul ? soulField(soul, 'body',  lang) || '' : ''

  const withImages = photos.filter(p => p.image_url)

  return (
    <section id="history" className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mb-16">
          <p className="text-xs tracking-widest uppercase text-olive mb-3">{h.eyebrow}</p>
          <h2 className="font-serif text-4xl sm:text-5xl text-deep-wood mb-8">{title}</h2>
          {body ? (
            <SoulBody text={body} />
          ) : (
            <>
              <p className="text-deep-wood/60 text-base leading-[1.85] mb-4">{h.para1}</p>
              <p className="text-deep-wood/60 text-base leading-[1.85]">{h.para2}</p>
            </>
          )}
        </div>

        <div className="masonry-grid">
          {photos.map((photo, idx) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => {
                if (!photo.image_url) return
                const imgIdx = withImages.findIndex(p => p.id === photo.id)
                if (imgIdx >= 0) setLightbox({ photos: withImages, idx: imgIdx })
              }}
              className={`relative overflow-hidden rounded-sm text-left w-full ${
                photo.tall || idx % 3 === 0 ? 'h-72' : 'h-44'
              } ${photo.image_url ? 'cursor-pointer group' : 'cursor-default'}`}
              style={
                photo.image_url
                  ? { backgroundImage: `url('${photo.image_url}')`, backgroundSize: 'cover', backgroundPosition: 'center' }
                  : undefined
              }
            >
              {!photo.image_url && (
                <div className={`absolute inset-0 bg-gradient-to-br ${FALLBACK_GRADIENTS[idx % FALLBACK_GRADIENTS.length]}`} />
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300" />
              {/* Hover zoom icon */}
              {photo.image_url && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-lg">
                    ⊕
                  </div>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-xs tracking-wider">{getCaption(photo, lang)}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ─── Lightbox ─── */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
            onClick={() => setLightbox(null)}
          >
            {/* Close */}
            <button
              className="absolute top-4 right-5 text-white/70 hover:text-white text-4xl leading-none z-10"
              onClick={() => setLightbox(null)}
            >×</button>

            {/* Prev */}
            {lightbox.idx > 0 && (
              <button
                className="absolute left-3 sm:left-6 text-white/70 hover:text-white text-5xl leading-none px-2 py-8 z-10"
                onClick={e => { e.stopPropagation(); setLightbox(l => l ? { ...l, idx: l.idx - 1 } : null) }}
              >‹</button>
            )}

            {/* Image */}
            <AnimatePresence mode="wait">
              <motion.img
                key={lightbox.idx}
                src={lightbox.photos[lightbox.idx].image_url}
                alt=""
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.22 }}
                className="max-h-[82vh] max-w-[85vw] object-contain shadow-2xl"
                onClick={e => e.stopPropagation()}
              />
            </AnimatePresence>

            {/* Caption */}
            {getCaption(lightbox.photos[lightbox.idx], lang) && (
              <p className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/70 text-sm text-center px-4 max-w-md">
                {getCaption(lightbox.photos[lightbox.idx], lang)}
              </p>
            )}

            {/* Counter */}
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/40 text-xs tabular-nums">
              {lightbox.idx + 1} / {lightbox.photos.length}
            </p>

            {/* Next */}
            {lightbox.idx < lightbox.photos.length - 1 && (
              <button
                className="absolute right-3 sm:right-6 text-white/70 hover:text-white text-5xl leading-none px-2 py-8 z-10"
                onClick={e => { e.stopPropagation(); setLightbox(l => l ? { ...l, idx: l.idx + 1 } : null) }}
              >›</button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
