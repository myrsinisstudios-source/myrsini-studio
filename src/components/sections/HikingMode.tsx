'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

type Trail = {
  id: string; name: string; name_en?: string; name_de?: string; name_fr?: string
  difficulty: string; distance: string; duration: string; elevation: string
  start_point: string; start_point_en?: string; start_point_de?: string; start_point_fr?: string
  description: string; description_en?: string; description_de?: string; description_fr?: string
  tags: string[]; icon?: string
  gpx_url?: string
  start_lat?: number; start_lng?: number
  end_lat?: number; end_lng?: number
  elevation_gain?: number
}

const DIFFICULTY_STYLE: Record<string, string> = {
  'Εύκολη':  'text-green-700 bg-green-50 border-green-200',
  'Μέτρια':  'text-amber-600 bg-amber-50 border-amber-200',
  'Δύσκολη': 'text-red-700 bg-red-50 border-red-200',
}

function getDifficultyLabel(raw: string, d: { easy: string; medium: string; hard: string }) {
  if (raw === 'Εύκολη') return d.easy
  if (raw === 'Μέτρια') return d.medium
  if (raw === 'Δύσκολη') return d.hard
  return raw
}

const FALLBACK: Trail[] = [
  {
    id: '1', name: 'Χόρτο – Λαμπινού', name_en: 'Horto – Lambinou', difficulty: 'Μέτρια',
    distance: '8.2 km', duration: '3ω 30λ', elevation: '+420 m',
    start_point: 'Χόρτο, παραλία', start_point_en: 'Horto, beach',
    description: 'Κλασικό πηλιορείτικο μονοπάτι που ανεβαίνει μέσα από ελαιώνες και δάση πουρναριών. Περνά από ερημικές εκκλησίτσες και αρχαία καλντερίμια προς τον ορεινό οικισμό Λαμπινού. Πανοραμική θέα προς Αιγαίο και Παγασητικό.',
    description_en: 'A classic Pelion trail climbing through olive groves and kermes oak forests, passing deserted chapels and ancient cobblestone paths towards the mountain village of Lambinou. Panoramic views over the Aegean and Pagasitikos Gulf.',
    tags: ['Ελαιώνες', 'Ιστορικά Μονοπάτια', 'Θέα'], icon: '⛰️',
  },
  {
    id: '2', name: 'Χόρτο – Παραλία Μηλίνας', name_en: 'Horto – Milina Beach', difficulty: 'Εύκολη',
    distance: '4.8 km', duration: '2ω 00λ', elevation: '+180 m',
    start_point: 'Χόρτο, λιμάνι', start_point_en: 'Horto, harbour',
    description: 'Εύκολη παράκτια διαδρομή κατάλληλη για όλες τις ηλικίες. Ακολουθεί την ακτογραμμή, περνά από μικρές κρυφές παραλίες και καταλήγει στο γραφικό λιμανάκι της Μηλίνας.',
    description_en: 'An easy coastal walk suitable for all ages. It follows the shoreline past hidden coves and small secluded beaches, ending at the charming little harbour of Milina.',
    tags: ['Παραλίες', 'Εύκολη', 'Κατάλληλο για παιδιά'], icon: '🌊',
  },
  {
    id: '3', name: 'Κορυφογραμμή Νότιου Πηλίου', name_en: 'South Pelion Ridge', difficulty: 'Δύσκολη',
    distance: '14.5 km', duration: '6ω 00λ', elevation: '+850 m',
    start_point: 'Αργαλαστή, πλατεία', start_point_en: 'Argalasti, main square',
    description: 'Απαιτητική ορεινή πεζοπορία για έμπειρους πεζοπόρους. Η κορυφογραμμή προσφέρει εκπληκτική θέα και στις δύο πλευρές — Παγασητικός και Αιγαίο — με φόντο τη Σκιάθο και τη Σκόπελο.',
    description_en: 'A demanding mountain hike for experienced walkers. The ridge offers breathtaking views on both sides — the Pagasitikos Gulf and the Aegean — with Skiathos and Skopelos on the horizon.',
    tags: ['Ορεινή', 'Πανοραμική Θέα', 'Έμπειροι'], icon: '🏔️',
  },
]

const STAT = 'flex flex-col items-center p-3 bg-cream/70 border border-deep-wood/8 rounded-sm'

export default function HikingMode() {
  const { t, lang } = useLanguage()
  const h = t.hiking
  const d = t.difficulty
  const [trails, setTrails] = useState<Trail[]>(FALLBACK)

  function trailField(trail: Trail, base: 'name' | 'description' | 'start_point'): string {
    if (lang === 'el') return (trail[base] as string) ?? ''
    const key = `${base}_${lang}` as keyof Trail
    const v = trail[key] as string | null | undefined
    return v || (trail[`${base}_en` as keyof Trail] as string) || (trail[base] as string) || ''
  }

  useEffect(() => {
    import('@/lib/supabase/client').then(({ createClient }) => {
      createClient()
        .from('hiking_trails')
        .select('*')
        .order('id')
        .then(({ data }) => {
          if (data && data.length > 0) setTrails(data as Trail[])
        })
    })
  }, [])

  return (
    <section id="hiking" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <p className="text-xs tracking-widest text-olive mb-3">{h.eyebrow}</p>
          <h2 className="font-serif text-4xl sm:text-5xl text-deep-wood mb-4">{h.title}</h2>
          <p className="text-deep-wood/50 text-sm max-w-lg mx-auto">{h.desc}</p>
        </div>

        <div className="space-y-6">
          {trails.map(trail => (
            <div key={trail.id} className="border border-deep-wood/8 hover:border-olive/40 transition-colors group">
              <div className="p-6 sm:p-8">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="shrink-0 flex md:flex-col items-center gap-4 md:gap-3">
                    <div className="w-16 h-16 bg-cream flex items-center justify-center text-4xl border border-deep-wood/8">
                      {trail.icon || '🥾'}
                    </div>
                    <span className={`text-xs font-medium px-3 py-1 border rounded-full ${DIFFICULTY_STYLE[trail.difficulty] ?? 'text-gray-600 bg-gray-50 border-gray-200'}`}>
                      {getDifficultyLabel(trail.difficulty, d)}
                    </span>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-serif text-2xl text-deep-wood mb-2 group-hover:text-olive transition-colors">
                      {trailField(trail, 'name')}
                    </h3>
                    <p className="text-deep-wood/55 text-sm leading-relaxed mb-5">
                      {trailField(trail, 'description')}
                    </p>

                    {trail.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-5">
                        {(Array.isArray(trail.tags) ? trail.tags : (trail.tags as unknown as string).split(','))
                          .map((tag: string) => (
                            <span key={tag} className="text-xs text-olive border border-olive/30 px-2.5 py-1 rounded-sm">
                              {t.hikingTags[tag.trim()] ?? tag.trim()}
                            </span>
                          ))}
                      </div>
                    )}

                    <div className={`grid gap-2 mb-4 ${trail.elevation_gain ? 'grid-cols-5' : 'grid-cols-4'}`}>
                      <div className={STAT}><span className="text-lg mb-1">📏</span><span className="text-sm font-semibold text-deep-wood">{trail.distance}</span><span className="text-xs text-deep-wood/40 mt-0.5">{h.distance}</span></div>
                      <div className={STAT}><span className="text-lg mb-1">⏱</span><span className="text-sm font-semibold text-deep-wood">{trail.duration}</span><span className="text-xs text-deep-wood/40 mt-0.5">{h.time}</span></div>
                      <div className={STAT}><span className="text-lg mb-1">🔺</span><span className="text-sm font-semibold text-deep-wood">{trail.elevation}</span><span className="text-xs text-deep-wood/40 mt-0.5">{h.elevation}</span></div>
                      {trail.elevation_gain && (
                        <div className={STAT}><span className="text-lg mb-1">⬆️</span><span className="text-sm font-semibold text-deep-wood">+{trail.elevation_gain}m</span><span className="text-xs text-deep-wood/40 mt-0.5">Κέρδος</span></div>
                      )}
                      <div className={STAT}><span className="text-lg mb-1">📍</span><span className="text-xs font-semibold text-deep-wood text-center leading-tight">{trailField(trail, 'start_point')}</span><span className="text-xs text-deep-wood/40 mt-0.5">{h.start}</span></div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trail.start_point + ', Πήλιο, Ελλάδα')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs text-olive border border-olive/40 px-4 py-2 hover:bg-olive hover:text-white transition-colors"
                      >
                        <span>📍</span>
                        <span>{h.start} — Google Maps</span>
                      </a>
                      {trail.gpx_url && (
                        <a
                          href={trail.gpx_url}
                          download
                          className="inline-flex items-center gap-2 text-xs text-deep-wood/60 border border-deep-wood/20 px-4 py-2 hover:bg-deep-wood hover:text-white transition-colors"
                        >
                          <span>📎</span>
                          <span>GPX</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-deep-wood/30 mt-8">{h.footer}</p>
      </div>
    </section>
  )
}
