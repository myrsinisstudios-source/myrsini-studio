'use client'

import { useState, useRef } from 'react'

const ACTIVITIES = [
  {
    id: 1,
    icon: '🏖️',
    title: 'Παραλίες',
    subtitle: 'Χόρτο · Μηλίνα · Μαραθιάς',
    description:
      'Αμμώδεις παραλίες με κρυστάλλινα νερά του Παγασητικού κόλπου. Από γαλαζοπράσινα αβαθή έως εντυπωσιακές βαθυγάλαζες εκτάσεις.',
    gradient: 'from-[#1a3a5c] to-[#2a7090]',
    tag: '5 λεπτά',
  },
  {
    id: 2,
    icon: '🥾',
    title: 'Πεζοπορία',
    subtitle: 'Μονοπάτια Ε4 · Παλιά Καλντερίμια',
    description:
      'Ιστορικά καλντερίμια του Πηλίου μέσα από πυκνά δάση καστανιάς, πλατάνια και ελαιώνες με πανοραμική θέα στο Αιγαίο.',
    gradient: 'from-[#1c3d1e] to-[#3a6e2a]',
    tag: '3 μονοπάτια',
  },
  {
    id: 3,
    icon: '🐟',
    title: 'Θαλάσσιες Δραστηριότητες',
    subtitle: 'Κολύμπι · Καταδύσεις · Ψάρεμα',
    description:
      'Εξερευνήστε υποβρύχιο κόσμο, ψαρέψτε με τους ντόπιους ψαράδες ή απλά απολαύστε το κολύμπι σε απομονωμένες παραλίες.',
    gradient: 'from-[#0d2b40] to-[#1a5a7a]',
    tag: 'Ιούν–Σεπτ',
  },
  {
    id: 4,
    icon: '🍷',
    title: 'Γαστρονομία',
    subtitle: 'Ταβέρνες · Τοπικά Προϊόντα',
    description:
      'Φρέσκα ψάρια και θαλασσινά, παραδοσιακές χορτόπιτες, ελαιόλαδο Πηλίου και τσίπουρο σε αυθεντικές ταβέρνες.',
    gradient: 'from-[#4a1c0e] to-[#8b3a1a]',
    tag: '8 εστιατόρια',
  },
  {
    id: 5,
    icon: '⛵',
    title: 'Βαρκάδες',
    subtitle: 'Εξερεύνηση Ακτογραμμής',
    description:
      'Νοικιάστε βάρκα και εξερευνήστε κρυφές παραλίες και σπηλιές του Νότιου Πηλίου που δεν είναι προσβάσιμες από την ξηρά.',
    gradient: 'from-[#1a2840] to-[#2a4a6a]',
    tag: 'Κατόπιν κράτησης',
  },
  {
    id: 6,
    icon: '🏛️',
    title: 'Πολιτισμός & Ιστορία',
    subtitle: 'Παραδοσιακοί Οικισμοί',
    description:
      'Επισκεφθείτε τα γραφικά χωριά του Πηλίου — Τρίκερι, Μηλίνα, Αργαλαστή — με αρχοντικά, εκκλησιές και μουσεία λαϊκής τέχνης.',
    gradient: 'from-[#2c1b0e] to-[#5c3a1e]',
    tag: '12 χωριά',
  },
]

export default function ActivitiesCarousel() {
  const [current, setCurrent] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)

  const prev = () => setCurrent(c => Math.max(0, c - 1))
  const next = () => setCurrent(c => Math.min(ACTIVITIES.length - 3, c + 1))

  return (
    <section id="activities" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Heading */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs tracking-widest uppercase text-olive mb-3">Ανακαλύψτε</p>
            <h2 className="font-serif text-4xl sm:text-5xl text-deep-wood">Δραστηριότητες</h2>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={prev}
              disabled={current === 0}
              className="w-10 h-10 border border-deep-wood/20 flex items-center justify-center hover:border-olive hover:text-olive transition-colors disabled:opacity-30 text-lg"
            >‹</button>
            <button
              onClick={next}
              disabled={current >= ACTIVITIES.length - 3}
              className="w-10 h-10 border border-deep-wood/20 flex items-center justify-center hover:border-olive hover:text-olive transition-colors disabled:opacity-30 text-lg"
            >›</button>
          </div>
        </div>

        {/* Carousel track */}
        <div className="overflow-hidden">
          <div
            ref={trackRef}
            className="flex gap-6 transition-transform duration-500 ease-out"
            style={{ transform: `translateX(calc(-${current} * (33.333% + 8px)))` }}
          >
            {ACTIVITIES.map(act => (
              <div
                key={act.id}
                className="carousel-item shrink-0 group"
              >
                {/* Image area */}
                <div className={`relative h-56 bg-gradient-to-br ${act.gradient} overflow-hidden`}>
                  <div className="absolute top-4 left-4 text-5xl">{act.icon}</div>
                  <span className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1">
                    {act.tag}
                  </span>
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white/60 text-xs tracking-wider">{act.subtitle}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 border border-t-0 border-deep-wood/8">
                  <h3 className="font-serif text-xl text-deep-wood mb-2">{act.title}</h3>
                  <p className="text-deep-wood/55 text-sm leading-relaxed mb-4">{act.description}</p>
                  <button className="text-olive text-xs tracking-widest uppercase border-b border-olive/30 hover:border-olive pb-0.5 transition-colors">
                    Δείτε Περισσότερα →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile dots */}
        <div className="flex justify-center gap-2 mt-6 md:hidden">
          {ACTIVITIES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                i === current ? 'bg-olive w-4' : 'bg-deep-wood/20'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
