'use client'

import { useLanguage } from '@/lib/i18n/LanguageContext'

interface Apartment {
  id: string
  name_el: string
  name_en?: string | null
  description_el?: string
  description_en?: string | null
  price_per_night: number
  max_guests?: number
  area_sqm?: number
  bedrooms?: number
  bathrooms?: number
  amenities?: string[]
}

const FALLBACK: Apartment[] = [
  {
    id: 'archontiko', name_el: 'Το Αρχοντικό', name_en: 'The Archontiko',
    description_el: 'Παραδοσιακό πέτρινο κτίριο του 19ου αιώνα. Εκθαμβωτική θέα στον κόλπο, αυλή με ελαιώνα και πλήρως εξοπλισμένη κουζίνα.',
    description_en: 'Traditional 19th-century stone building. Stunning bay views, olive grove courtyard and a fully equipped kitchen.',
    price_per_night: 85, max_guests: 4, area_sqm: 65, bedrooms: 2, bathrooms: 1,
    amenities: ['AC', 'WiFi', 'Κουζίνα', 'Parking', 'Βεράντα', 'Θέα θάλασσα', 'BBQ', 'Πλυντήριο'],
  },
  {
    id: 'thalassino', name_el: 'Το Θαλασσινό', name_en: 'The Thalassino',
    description_el: 'Σύγχρονο studio με άμεση πρόσβαση στη θάλασσα. Μεγάλα παράθυρα, θέα ορίζοντα και private βεράντα πάνω στο κύμα.',
    description_en: 'Modern studio with direct sea access. Large windows, horizon views and a private veranda above the waves.',
    price_per_night: 65, max_guests: 2, area_sqm: 45, bedrooms: 1, bathrooms: 1,
    amenities: ['AC', 'WiFi', 'Kitchenette', 'Βεράντα', 'Θέα θάλασσα', 'Τηλεόραση', 'Πετσέτες'],
  },
]

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

const GRADIENT_BG = ['from-[#2C1B0E] via-[#4a5d45] to-[#2C1B0E]', 'from-[#1a3040] via-[#2a5060] to-[#1a3040]']

export default function ApartmentsSection({ apartments }: { apartments?: Apartment[] }) {
  const data = apartments && apartments.length > 0 ? apartments : FALLBACK
  const { t, lang } = useLanguage()
  const am = t.amenities
  const isEl = lang === 'el'

  return (
    <section id="apartments" className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <p className="text-xs tracking-widest uppercase text-olive mb-3">{t.apts.eyebrow}</p>
          <h2 className="font-serif text-4xl sm:text-5xl text-deep-wood mb-4">{t.apts.title}</h2>
          <p className="text-deep-wood/50 text-sm max-w-md mx-auto">{t.apts.desc}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {data.map((apt, i) => {
            const name = (!isEl && apt.name_en) ? apt.name_en : apt.name_el
            const desc = (!isEl && apt.description_en) ? apt.description_en : apt.description_el
            const bookingPrice = Math.round(apt.price_per_night * 1.151)
            const features = [
              { icon: '👥', label: t.apts.guests,   value: `${apt.max_guests ?? 2}` },
              { icon: '📐', label: t.apts.sqm,       value: `${apt.area_sqm ?? 45}m²` },
              { icon: '🛏', label: t.apts.bedrooms,  value: `${apt.bedrooms ?? 1}` },
              { icon: '🚿', label: t.apts.bathrooms, value: `${apt.bathrooms ?? 1}` },
            ]

            return (
              <div key={apt.id} className="bg-white shadow-sm hover:shadow-lg transition-shadow duration-300 group">
                <div className={`h-56 bg-gradient-to-br ${GRADIENT_BG[i % GRADIENT_BG.length]} relative overflow-hidden`}>
                  <div className="absolute inset-0 flex items-end p-6">
                    <div>
                      <p className="text-white/50 text-xs tracking-widest uppercase mb-1">Myrsini Studios</p>
                      <h3 className="font-serif text-white text-2xl">{name}</h3>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/95 px-3 py-2 text-right shadow-sm">
                    <div className="text-olive font-bold text-base">€{apt.price_per_night}<span className="text-xs font-normal">{t.apts.perNight}</span></div>
                    <div className="text-gray-400 text-xs line-through">€{bookingPrice} {t.apts.bookingLabel}</div>
                  </div>
                </div>

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

                  <a href="/#booking"
                    className="block w-full text-center bg-deep-wood text-white py-3 text-xs tracking-widest uppercase hover:bg-olive transition-colors">
                    {t.apts.book} — €{apt.price_per_night}{t.apts.perNight}
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
