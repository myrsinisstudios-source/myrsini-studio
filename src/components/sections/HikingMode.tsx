'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

type Trail = {
  id: string; name: string; name_en?: string; difficulty: string; distance: string; duration: string
  elevation: string; start_point: string; description: string; description_en?: string; tags: string[]; icon?: string
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
    id: '1', name: 'Χόρτο – Λαμπινού', difficulty: 'Μέτρια',
    distance: '8.2 km', duration: '3ω 30λ', elevation: '+420 m', start_point: 'Χόρτο, παραλία',
    description: 'Κλασικό πηλιορείτικο μονοπάτι που ανεβαίνει μέσα από ελαιώνες και δάση πουρναριών. Περνά από ερημικές εκκλησίτσες και αρχαία καλντερίμια προς τον ορεινό οικισμό Λαμπινού. Πανοραμική θέα προς Αιγαίο και Παγασητικό.',
    tags: ['Ελαιώνες', 'Ιστορικά Μονοπάτια', 'Θέα'], icon: '⛰️',
  },
  {
    id: '2', name: 'Χόρτο – Παραλία Μηλίνας', difficulty: 'Εύκολη',
    distance: '4.8 km', duration: '2ω 00λ', elevation: '+180 m', start_point: 'Χόρτο, λιμάνι',
    description: 'Εύκολη παράκτια διαδρομή κατάλληλη για όλες τις ηλικίες. Ακολουθεί την ακτογραμμή, περνά από μικρές κρυφές παραλίες και καταλήγει στο γραφικό λιμανάκι της Μηλίνας.',
    tags: ['Παραλίες', 'Εύκολη', 'Κατάλληλο για παιδιά'], icon: '🌊',
  },
  {
    id: '3', name: 'Κορυφογραμμή Νότιου Πηλίου', difficulty: 'Δύσκολη',
    distance: '14.5 km', duration: '6ω 00λ', elevation: '+850 m', start_point: 'Αργαλαστή, πλατεία',
    description: 'Απαιτητική ορεινή πεζοπορία για έμπειρους πεζοπόρους. Η κορυφογραμμή προσφέρει εκπληκτική θέα και στις δύο πλευρές — Παγασητικός και Αιγαίο — με φόντο τη Σκιάθο και τη Σκόπελο.',
    tags: ['Ορεινή', 'Πανοραμική Θέα', 'Έμπειροι'], icon: '🏔️',
  },
]

const STAT = 'flex flex-col items-center p-3 bg-cream/70 border border-deep-wood/8 rounded-sm'

export default function HikingMode() {
  const { t, lang } = useLanguage()
  const h = t.hiking
  const d = t.difficulty
  const isEl = lang === 'el'
  const [trails, setTrails] = useState<Trail[]>(FALLBACK)

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
          <p className="text-xs tracking-widest uppercase text-olive mb-3">{h.eyebrow}</p>
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
                      {(!isEl && trail.name_en) ? trail.name_en : trail.name}
                    </h3>
                    <p className="text-deep-wood/55 text-sm leading-relaxed mb-5">
                      {(!isEl && trail.description_en) ? trail.description_en : trail.description}
                    </p>

                    {trail.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-5">
                        {(Array.isArray(trail.tags) ? trail.tags : (trail.tags as unknown as string).split(','))
                          .map((tag: string) => (
                            <span key={tag} className="text-xs text-olive border border-olive/30 px-2.5 py-1 rounded-sm">{tag.trim()}</span>
                          ))}
                      </div>
                    )}

                    <div className="grid grid-cols-4 gap-2">
                      <div className={STAT}><span className="text-lg mb-1">📏</span><span className="text-sm font-semibold text-deep-wood">{trail.distance}</span><span className="text-xs text-deep-wood/40 mt-0.5">{h.distance}</span></div>
                      <div className={STAT}><span className="text-lg mb-1">⏱</span><span className="text-sm font-semibold text-deep-wood">{trail.duration}</span><span className="text-xs text-deep-wood/40 mt-0.5">{h.time}</span></div>
                      <div className={STAT}><span className="text-lg mb-1">🔺</span><span className="text-sm font-semibold text-deep-wood">{trail.elevation}</span><span className="text-xs text-deep-wood/40 mt-0.5">{h.elevation}</span></div>
                      <div className={STAT}><span className="text-lg mb-1">📍</span><span className="text-xs font-semibold text-deep-wood text-center leading-tight">{trail.start_point}</span><span className="text-xs text-deep-wood/40 mt-0.5">{h.start}</span></div>
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
