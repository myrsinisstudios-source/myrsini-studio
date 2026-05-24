'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const TrailMap = dynamic(() => import('@/components/ui/TrailMap'), { ssr: false })

type Trail = {
  id: string; name_el: string; name_en?: string; name_de?: string; name_fr?: string
  difficulty: string; distance: string; duration: string; elevation: string
  start_point: string; start_point_en?: string; start_point_de?: string; start_point_fr?: string
  description_el: string; description_en?: string; description_de?: string; description_fr?: string
  tags: string[]; icon?: string; slug?: string; end_point?: string
  sort_order?: number; is_active?: boolean
  gpx_url?: string; wikiloc_url?: string
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


const STAT = 'flex flex-col items-center p-3 bg-cream/70 border border-deep-wood/8 rounded-sm'

export default function HikingMode() {
  const { t, lang } = useLanguage()
  const h = t.hiking
  const d = t.difficulty
  const [trails, setTrails] = useState<Trail[]>([])
  const [openMapId, setOpenMapId] = useState<string | null>(null)

  function trailField(trail: Trail, base: 'name' | 'description' | 'start_point'): string {
    const elKey = base === 'name' ? 'name_el' : base === 'description' ? 'description_el' : 'start_point'
    if (lang === 'el') return (trail[elKey as keyof Trail] as string) ?? ''
    const key = `${base}_${lang}` as keyof Trail
    const v = trail[key] as string | null | undefined
    return v || (trail[`${base}_en` as keyof Trail] as string) || (trail[elKey as keyof Trail] as string) || ''
  }

  useEffect(() => {
    import('@/lib/supabase/client').then(({ createClient }) => {
      createClient()
        .from('hiking_trails')
        .select('*')
        .eq('is_active', true)
        .order('sort_order')
        .then(({ data }) => {
          if (data) setTrails(data as Trail[])
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
                      {(trail.gpx_url || (trail.start_lat && trail.start_lng)) && (
                        <button
                          onClick={() => setOpenMapId(openMapId === trail.id ? null : trail.id)}
                          className={`inline-flex items-center gap-2 text-xs border px-4 py-2 transition-colors ${
                            openMapId === trail.id
                              ? 'bg-olive text-white border-olive'
                              : 'text-olive border-olive/40 hover:bg-olive hover:text-white'
                          }`}
                        >
                          <span>🗺️</span>
                          <span>Δες χάρτη</span>
                        </button>
                      )}
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
                      {trail.wikiloc_url && (
                        <a
                          href={trail.wikiloc_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-xs text-deep-wood/60 border border-deep-wood/20 px-4 py-2 hover:bg-deep-wood hover:text-white transition-colors"
                        >
                          <span>🌐</span>
                          <span>Wikiloc</span>
                        </a>
                      )}
                    </div>

                    {openMapId === trail.id && (
                      <div className="mt-4">
                        <TrailMap
                          gpxUrl={trail.gpx_url}
                          startLat={trail.start_lat}
                          startLng={trail.start_lng}
                          endLat={trail.end_lat}
                          endLng={trail.end_lng}
                        />
                      </div>
                    )}
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
