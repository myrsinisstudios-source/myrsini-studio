'use client'

import { useState } from 'react'
import Link from 'next/link'

export type Activity = {
  id: string | number
  slug: string
  name_el: string
  icon: string
  image_url?: string | null
  description_el: string
  duration?: string | null
  distance?: string | null
  category?: string | null
  gradient?: string
  subtitle?: string
  tag?: string
}

const FALLBACK: Activity[] = [
  { id: 1, slug: 'beaches',           icon: '🏖️', name_el: 'Παραλίες',               subtitle: 'Χόρτο · Μηλίνα · Μαραθιάς', description_el: 'Αμμώδεις παραλίες με κρυστάλλινα νερά του Παγασητικού κόλπου. Από γαλαζοπράσινα αβαθή έως εντυπωσιακές βαθυγάλαζες εκτάσεις.', gradient: 'from-[#1a3a5c] to-[#2a7090]', tag: '5 λεπτά' },
  { id: 2, slug: 'hiking-trails',     icon: '🥾', name_el: 'Πεζοπορία',               subtitle: 'Μονοπάτια Ε4 · Παλιά Καλντερίμια', description_el: 'Ιστορικά καλντερίμια του Πηλίου μέσα από πυκνά δάση καστανιάς, πλατάνια και ελαιώνες με πανοραμική θέα στο Αιγαίο.', gradient: 'from-[#1c3d1e] to-[#3a6e2a]', tag: '3 μονοπάτια' },
  { id: 3, slug: 'marine-activities', icon: '🐟', name_el: 'Θαλάσσιες Δραστηριότητες', subtitle: 'Κολύμπι · Καταδύσεις · Ψάρεμα', description_el: 'Εξερευνήστε υποβρύχιο κόσμο, ψαρέψτε με τους ντόπιους ψαράδες ή απλά απολαύστε το κολύμπι σε απομονωμένες παραλίες.', gradient: 'from-[#0d2b40] to-[#1a5a7a]', tag: 'Ιούν–Σεπτ' },
  { id: 4, slug: 'gastronomy',        icon: '🍷', name_el: 'Γαστρονομία',              subtitle: 'Ταβέρνες · Τοπικά Προϊόντα', description_el: 'Φρέσκα ψάρια και θαλασσινά, παραδοσιακές χορτόπιτες, ελαιόλαδο Πηλίου και τσίπουρο σε αυθεντικές ταβέρνες.', gradient: 'from-[#4a1c0e] to-[#8b3a1a]', tag: '8 εστιατόρια' },
  { id: 5, slug: 'boat-trips',        icon: '⛵', name_el: 'Βαρκάδες',                subtitle: 'Εξερεύνηση Ακτογραμμής', description_el: 'Νοικιάστε βάρκα και εξερευνήστε κρυφές παραλίες και σπηλιές του Νότιου Πηλίου που δεν είναι προσβάσιμες από την ξηρά.', gradient: 'from-[#1a2840] to-[#2a4a6a]', tag: 'Κατόπιν κράτησης' },
  { id: 6, slug: 'culture-history',   icon: '🏛️', name_el: 'Πολιτισμός & Ιστορία',   subtitle: 'Παραδοσιακοί Οικισμοί', description_el: 'Επισκεφθείτε τα γραφικά χωριά του Πηλίου — Τρίκερι, Μηλίνα, Αργαλαστή — με αρχοντικά, εκκλησιές και μουσεία λαϊκής τέχνης.', gradient: 'from-[#2c1b0e] to-[#5c3a1e]', tag: '12 χωριά' },
]

const GRADIENTS = [
  'from-[#1a3a5c] to-[#2a7090]', 'from-[#1c3d1e] to-[#3a6e2a]',
  'from-[#0d2b40] to-[#1a5a7a]', 'from-[#4a1c0e] to-[#8b3a1a]',
  'from-[#1a2840] to-[#2a4a6a]', 'from-[#2c1b0e] to-[#5c3a1e]',
]

export default function ActivitiesCarousel({ activities }: { activities?: Activity[] }) {
  const [current, setCurrent] = useState(0)
  const items = activities && activities.length > 0 ? activities : FALLBACK
  const max = Math.max(0, items.length - 3)

  return (
    <section id="activities" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs tracking-widest uppercase text-olive mb-3">Ανακαλύψτε</p>
            <h2 className="font-serif text-4xl sm:text-5xl text-deep-wood">Δραστηριότητες</h2>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <button onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0}
              className="w-10 h-10 border border-deep-wood/20 flex items-center justify-center hover:border-olive hover:text-olive transition-colors disabled:opacity-30 text-lg">‹</button>
            <button onClick={() => setCurrent(c => Math.min(max, c + 1))} disabled={current >= max}
              className="w-10 h-10 border border-deep-wood/20 flex items-center justify-center hover:border-olive hover:text-olive transition-colors disabled:opacity-30 text-lg">›</button>
          </div>
        </div>

        <div className="overflow-hidden">
          <div
            className="flex gap-6 transition-transform duration-500 ease-out"
            style={{ transform: `translateX(calc(-${current} * (33.333% + 8px)))` }}
          >
            {items.map((act, idx) => {
              const gradient = act.gradient ?? GRADIENTS[idx % GRADIENTS.length]
              const tag = act.tag ?? act.duration ?? act.distance ?? ''
              const subtitle = act.subtitle ?? act.category ?? ''
              return (
                <div key={act.id} className="carousel-item shrink-0 group">
                  <div
                    className={`relative h-56 overflow-hidden ${act.image_url ? '' : `bg-gradient-to-br ${gradient}`}`}
                    style={act.image_url ? { backgroundImage: `url('${act.image_url}')`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
                  >
                    {!act.image_url && <div className="absolute top-4 left-4 text-5xl">{act.icon}</div>}
                    {tag && (
                      <span className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1">{tag}</span>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />
                    {subtitle && (
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-white/60 text-xs tracking-wider">{subtitle}</p>
                      </div>
                    )}
                  </div>
                  <div className="p-5 border border-t-0 border-deep-wood/8">
                    <h3 className="font-serif text-xl text-deep-wood mb-2">{act.name_el}</h3>
                    <p className="text-deep-wood/55 text-sm leading-relaxed mb-4">{act.description_el}</p>
                    <Link
                      href={`/activities/${act.slug}`}
                      className="text-olive text-xs tracking-widest uppercase border-b border-olive/30 hover:border-olive pb-0.5 transition-colors"
                    >
                      Δείτε Περισσότερα →
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-6 md:hidden">
          {items.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${i === current ? 'bg-olive w-4' : 'bg-deep-wood/20'}`} />
          ))}
        </div>
      </div>
    </section>
  )
}
