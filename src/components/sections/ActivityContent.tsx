'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/LanguageContext'

type Activity = {
  id: string
  slug: string
  name_el: string
  name_en?: string | null
  icon: string
  image_url?: string | null
  description_el: string
  description_en?: string | null
  duration?: string | null
  distance?: string | null
  category?: string | null
}

const STAT_ICONS: Record<string, string> = {
  duration: '⏱',
  distance: '📍',
  category: '🏷',
}

const mapUrl = `https://www.google.com/maps/search/${encodeURIComponent('Χόρτο Πήλιο')}`

export default function ActivityContent({ activity }: { activity: Activity }) {
  const { t, lang } = useLanguage()
  const p = t.acts_page

  const name = (lang !== 'el' && activity.name_en) ? activity.name_en : activity.name_el
  const desc = (lang !== 'el' && activity.description_en) ? activity.description_en : activity.description_el

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <div className="relative h-72 sm:h-96 overflow-hidden">
        {activity.image_url ? (
          <div
            className="absolute inset-0"
            style={{ backgroundImage: `url('${activity.image_url}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-deep-wood to-olive" />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 h-full flex flex-col justify-end px-6 pb-10 max-w-4xl mx-auto">
          <div className="text-5xl mb-4">{activity.icon}</div>
          <h1 className="font-serif text-4xl sm:text-5xl text-white mb-2">{name}</h1>
          {activity.name_en && lang === 'el' && (
            <p className="text-white/60 text-sm tracking-wider uppercase">{activity.name_en}</p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link href="/#activities" className="inline-flex items-center gap-2 text-olive text-xs tracking-widest uppercase mb-10 hover:text-deep-wood transition-colors">
          {p.back}
        </Link>

        <div className="grid md:grid-cols-3 gap-10">
          {/* Main description */}
          <div className="md:col-span-2">
            <p className="text-deep-wood/80 text-lg leading-relaxed font-light">{desc}</p>

            {/* Map link */}
            <div className="mt-10 p-5 bg-white border border-deep-wood/8 shadow-sm">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">{p.location}</p>
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
          </div>

          {/* Stats sidebar */}
          <div className="space-y-4">
            <div className="bg-white border border-deep-wood/8 shadow-sm p-5">
              <p className="text-xs text-olive uppercase tracking-widest mb-4">Info</p>
              <div className="space-y-3">
                {activity.category && (
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{STAT_ICONS.category}</span>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">{p.category}</p>
                      <p className="text-sm text-deep-wood font-medium">{activity.category}</p>
                    </div>
                  </div>
                )}
                {activity.duration && (
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{STAT_ICONS.duration}</span>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">{p.duration}</p>
                      <p className="text-sm text-deep-wood font-medium">{activity.duration}</p>
                    </div>
                  </div>
                )}
                {activity.distance && (
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{STAT_ICONS.distance}</span>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">{p.distance}</p>
                      <p className="text-sm text-deep-wood font-medium">{activity.distance}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

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
    </div>
  )
}
