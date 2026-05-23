'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import type { Lang } from '@/lib/i18n/translations'

type HistoryPhoto = { id: string; image_url: string; caption: string; sort_order: number; tall?: boolean }

type SoulRow = {
  title_el: string; title_en: string; title_de: string; title_fr: string
  body_el: string;  body_en: string;  body_de: string;  body_fr: string
}

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

function soulField(soul: SoulRow, base: 'title' | 'body', lang: Lang): string {
  const key = `${base}_${lang}` as keyof SoulRow
  const v = soul[key]
  if (v) return v
  return soul[`${base}_en` as keyof SoulRow] || soul[`${base}_el` as keyof SoulRow] || ''
}

export default function HistoryMasonry() {
  const { t, lang } = useLanguage()
  const h = t.history
  const [photos, setPhotos] = useState<HistoryPhoto[]>(FALLBACK)
  const [soul, setSoul] = useState<SoulRow | null>(null)

  useEffect(() => {
    import('@/lib/supabase/client').then(({ createClient }) => {
      const client = createClient()
      client.from('history_photos').select('*').order('sort_order')
        .then(({ data }) => { if (data && data.length > 0) setPhotos(data as HistoryPhoto[]) })
      client.from('soul_content').select('title_el,title_en,title_de,title_fr,body_el,body_en,body_de,body_fr').eq('id', 1).single()
        .then(({ data }) => { if (data) setSoul(data as SoulRow) })
    })
  }, [])

  const title = soul ? soulField(soul, 'title', lang) || h.title : h.title
  const body  = soul ? soulField(soul, 'body',  lang) || '' : ''

  return (
    <section id="history" className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-16">
          <p className="text-xs tracking-widest uppercase text-olive mb-3">{h.eyebrow}</p>
          <h2 className="font-serif text-4xl sm:text-5xl text-deep-wood mb-6">{title}</h2>
          {body ? (
            <p className="text-deep-wood/60 text-base leading-relaxed">{body}</p>
          ) : (
            <>
              <p className="text-deep-wood/60 text-base leading-relaxed mb-4">{h.para1}</p>
              <p className="text-deep-wood/60 text-base leading-relaxed">{h.para2}</p>
            </>
          )}
        </div>

        <div className="masonry-grid">
          {photos.map((photo, idx) => (
            <div
              key={photo.id}
              className={`relative overflow-hidden rounded-sm ${
                photo.tall || idx % 3 === 0 ? 'h-72' : 'h-44'
              } cursor-pointer group`}
              style={
                photo.image_url
                  ? { backgroundImage: `url('${photo.image_url}')`, backgroundSize: 'cover', backgroundPosition: 'center' }
                  : undefined
              }
            >
              {!photo.image_url && (
                <div className={`absolute inset-0 bg-gradient-to-br ${FALLBACK_GRADIENTS[idx % FALLBACK_GRADIENTS.length]}`} />
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-xs tracking-wider">{photo.caption}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
