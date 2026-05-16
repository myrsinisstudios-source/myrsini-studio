'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export type Activity = {
  id: string | number
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

const FALLBACK: Activity[] = [
  { id: 1, slug: 'beaches',           icon: '🏖️', name_el: 'Παραλίες',                description_el: 'Αμμώδεις παραλίες με κρυστάλλινα νερά του Παγασητικού κόλπου. Από γαλαζοπράσινα αβαθή έως εντυπωσιακές βαθυγάλαζες εκτάσεις.' },
  { id: 2, slug: 'hiking-trails',     icon: '🥾', name_el: 'Πεζοπορία',               description_el: 'Ιστορικά καλντερίμια του Πηλίου μέσα από πυκνά δάση καστανιάς, πλατάνια και ελαιώνες με πανοραμική θέα στο Αιγαίο.' },
  { id: 3, slug: 'marine-activities', icon: '🐟', name_el: 'Θαλάσσιες Δρ.',           description_el: 'Εξερευνήστε υποβρύχιο κόσμο, ψαρέψτε με τους ντόπιους ψαράδες ή απολαύστε κολύμπι σε απομονωμένες παραλίες.' },
  { id: 4, slug: 'gastronomy',        icon: '🍷', name_el: 'Γαστρονομία',             description_el: 'Φρέσκα ψάρια και θαλασσινά, παραδοσιακές χορτόπιτες, ελαιόλαδο Πηλίου και τσίπουρο σε αυθεντικές ταβέρνες.' },
  { id: 5, slug: 'boat-trips',        icon: '⛵', name_el: 'Βαρκάδες',               description_el: 'Νοικιάστε βάρκα και εξερευνήστε κρυφές παραλίες και σπηλιές του Νότιου Πηλίου που δεν είναι προσβάσιμες από ξηρά.' },
  { id: 6, slug: 'culture-history',   icon: '🏛️', name_el: 'Πολιτισμός & Ιστορία',   description_el: 'Επισκεφθείτε γραφικά χωριά — Τρίκερι, Μηλίνα, Αργαλαστή — με αρχοντικά, βυζαντινές εκκλησίες και μουσεία.' },
]

const SPRING = { type: 'spring' as const, damping: 24, stiffness: 200, mass: 0.8 }
const RADIUS = 155
const ANGLE = 34 * (Math.PI / 180)
const MAX_VISIBLE = 2
const ITEM_HALF = 28 // half of w-14 (56px) icon

function getPos(offsetRaw: number, n: number) {
  let off = ((offsetRaw % n) + n) % n
  if (off > n / 2) off -= n
  const angle = off * ANGLE
  return {
    x: RADIUS * Math.sin(angle),
    y: -RADIUS * (1 - Math.cos(angle)),
    scale: off === 0 ? 1.3 : Math.max(0.6, 1 - Math.abs(off) * 0.22),
    opacity: Math.max(0, 1 - Math.abs(off) * 0.42),
    z: MAX_VISIBLE + 1 - Math.abs(off),
    visible: Math.abs(off) <= MAX_VISIBLE,
    isActive: off === 0,
  }
}

export default function CircularCarousel({ activities }: { activities?: Activity[] }) {
  const items = activities && activities.length > 0 ? activities : FALLBACK
  const N = items.length
  const [active, setActive] = useState(0)
  const { t, lang } = useLanguage()
  const getName = (item: Activity) => (lang !== 'el' && item.name_en) ? item.name_en : item.name_el
  const getDesc = (item: Activity) => (lang !== 'el' && item.description_en) ? item.description_en : item.description_el
  const dragStart = useRef<number | null>(null)
  const isDragging = useRef(false)

  const goTo = (idx: number) => setActive(((idx % N) + N) % N)

  const handlePointerDown = (e: React.PointerEvent) => {
    dragStart.current = e.clientX
    isDragging.current = false
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragStart.current !== null && Math.abs(e.clientX - dragStart.current) > 8) {
      isDragging.current = true
    }
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragStart.current === null) return
    const diff = e.clientX - dragStart.current
    if (isDragging.current) {
      if (diff < -55) goTo(active + 1)
      else if (diff > 55) goTo(active - 1)
    }
    dragStart.current = null
    isDragging.current = false
  }

  const current = items[active]

  return (
    <section id="activities" className="py-24 bg-white" style={{ overflowX: 'hidden' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-2">
          <p className="text-xs tracking-widest uppercase text-olive mb-3">{t.acts.eyebrow}</p>
          <h2 className="font-serif text-4xl sm:text-5xl text-deep-wood">{t.acts.title}</h2>
        </div>

        {/* Arc container */}
        <div
          className="relative h-52 mt-10 cursor-grab active:cursor-grabbing select-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={() => { dragStart.current = null; isDragging.current = false }}
          onPointerCancel={() => { dragStart.current = null; isDragging.current = false }}
        >
          {items.map((item, idx) => {
            const pos = getPos(idx - active, N)
            if (!pos.visible) return null

            return (
              <div
                key={item.id}
                className="absolute bottom-0"
                style={{ left: '50%', marginLeft: -ITEM_HALF, zIndex: pos.z }}
              >
                <motion.div
                  animate={{ x: pos.x, y: pos.y, scale: pos.scale, opacity: pos.opacity }}
                  initial={false}
                  transition={SPRING}
                  className="flex flex-col items-center gap-2"
                >
                  <button
                    className="flex flex-col items-center gap-2 focus:outline-none"
                    onClick={() => { if (!isDragging.current && !pos.isActive) goTo(idx) }}
                    tabIndex={pos.isActive ? 0 : -1}
                  >
                    <div
                      className={`w-14 h-14 flex items-center justify-center text-3xl rounded-full transition-colors duration-300 ${
                        pos.isActive
                          ? 'bg-olive text-white shadow-xl shadow-olive/40 ring-4 ring-olive/20'
                          : 'bg-cream border border-deep-wood/12 hover:border-olive/30'
                      }`}
                    >
                      {item.icon}
                    </div>
                    <p
                      className={`text-[11px] text-center leading-tight w-16 ${
                        pos.isActive ? 'text-olive font-semibold' : 'text-deep-wood/40'
                      }`}
                    >
                      {getName(item)}
                    </p>
                  </button>
                </motion.div>
              </div>
            )
          })}
        </div>

        {/* Content panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.32, ease: 'easeOut' }}
            className="max-w-xl mx-auto text-center mt-10"
          >
            <h3 className="font-serif text-2xl sm:text-3xl text-deep-wood mb-3">{getName(current)}</h3>
            <p className="text-deep-wood/55 text-sm sm:text-base leading-relaxed mb-7">{getDesc(current)}</p>
            <Link
              href={`/activities/${current.slug}`}
              className="inline-block bg-deep-wood text-white text-xs tracking-widest uppercase px-8 py-3.5 hover:bg-olive transition-colors duration-200"
            >
              {t.acts.viewMore} →
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* Dot navigation */}
        <div className="flex justify-center gap-2 mt-10">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Item ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === active ? 'bg-olive w-5 h-1.5' : 'bg-deep-wood/20 w-1.5 h-1.5'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
