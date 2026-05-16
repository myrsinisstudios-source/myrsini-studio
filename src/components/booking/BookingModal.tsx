'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import type { Lang } from '@/lib/i18n/translations'

const LOCALE_MAP: Record<Lang, string> = { el: 'el-GR', en: 'en-GB', de: 'de-DE', fr: 'fr-FR' }

const APARTMENTS = [
  { id: 'archontiko', name: 'Αρχοντικό', price: 85, guests: 4 },
  { id: 'thalassino', name: 'Θαλασσινό', price: 65, guests: 2 },
]

function formatDay(dateStr: string) {
  if (!dateStr) return null
  return new Date(dateStr + 'T12:00:00').getDate()
}

function formatMonthYear(dateStr: string, lang: Lang) {
  if (!dateStr) return null
  return new Date(dateStr + 'T12:00:00').toLocaleDateString(LOCALE_MAP[lang], {
    month: 'long', year: 'numeric',
  })
}

function DateBox({ label, value, onChange, placeholder, lang }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string; lang: Lang
}) {
  return (
    <label className="relative block bg-white border border-gray-200 p-4 text-center cursor-pointer hover:border-[#C9A96E] transition-colors">
      <p className="text-[10px] text-gray-400 tracking-widest uppercase mb-1">{label}</p>
      <p className="font-serif text-4xl font-light text-[#C9A96E] leading-none mb-1">
        {formatDay(value) ?? '—'}
      </p>
      <p className="text-xs text-gray-500 truncate">
        {formatMonthYear(value, lang) ?? placeholder}
      </p>
      <input type="date" value={value} onChange={e => onChange(e.target.value)}
        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
    </label>
  )
}

const PRICE_ROWS = [
  { key: 'members',    price: 115, style: 'gold' },
  { key: 'direct',     price: 125, style: 'highlight' },
  { key: 'bookingCom', price: 140, style: 'strike' },
  { key: 'airbnb',     price: 145, style: 'strike' },
] as const

export default function BookingModal() {
  const [open, setOpen] = useState(false)
  const [arrival, setArrival] = useState('')
  const [departure, setDeparture] = useState('')
  const [aptId, setAptId] = useState(APARTMENTS[0].id)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { t, lang } = useLanguage()
  const m = t.modal
  const b = t.booking

  const apt = APARTMENTS.find(a => a.id === aptId)!
  const nights = arrival && departure
    ? Math.max(0, Math.ceil((new Date(departure).getTime() - new Date(arrival).getTime()) / 86400000))
    : 0
  const total = nights * apt.price

  const handleSubmit = async () => {
    if (!arrival || !departure || !name || !phone) return
    setLoading(true)
    try {
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apartment_id: aptId, apartment_name: apt.name,
          guest_name: name, guest_phone: phone,
          check_in: arrival, check_out: departure,
          num_guests: apt.guests, language: lang,
          price_per_night: apt.price, total_amount: total,
          channel: 'direct',
        }),
      })
      setSuccess(true)
      setName(''); setPhone(''); setArrival(''); setDeparture('')
    } catch {}
    setLoading(false)
  }

  const closeModal = () => { setOpen(false); setSuccess(false) }
  const canSubmit = arrival && departure && name.trim() && phone.trim()

  return (
    <>
      {/* Floating circular button */}
      <button
        onClick={() => setOpen(true)}
        aria-label={m.book}
        className="fixed bottom-6 right-6 z-40 w-20 h-20 rounded-full shadow-2xl flex flex-col items-center justify-center gap-0.5 text-white hover:scale-105 active:scale-95 transition-transform"
        style={{ background: 'linear-gradient(135deg, #C9A96E, #a8793f)' }}
      >
        <span className="text-[10px] font-bold tracking-widest leading-tight">{m.book}</span>
        <span className="text-[10px] text-white/70">{m.from} €{apt.price}</span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div key="bd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }} onClick={closeModal}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />

            {/* Modal */}
            <motion.div key="modal"
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 20 }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="pointer-events-auto relative w-full max-w-sm shadow-2xl max-h-[90vh] overflow-y-auto"
                style={{ background: '#F8F5EF' }}>

                <button onClick={closeModal}
                  className="sticky top-0 right-0 float-right mt-3 mr-4 text-2xl leading-none text-gray-400 hover:text-gray-700 transition-colors z-10"
                  aria-label="Close">×</button>

                {/* Header */}
                <div className="px-8 pt-8 pb-6 text-center" style={{ background: '#EDE8DF' }}>
                  <div className="inline-block text-white text-[10px] tracking-widest uppercase px-4 py-1.5 mb-4"
                    style={{ background: '#C9A96E' }}>
                    {m.badge}
                  </div>
                  <h2 className="font-serif text-2xl text-deep-wood">{m.title}</h2>
                </div>

                {/* Body */}
                <div className="px-6 py-5">
                  {success ? (
                    <div className="text-center py-6">
                      <p className="text-4xl mb-3">✅</p>
                      <p className="font-serif text-lg text-deep-wood mb-2">Ευχαριστούμε!</p>
                      <p className="text-sm text-deep-wood/60">{b.success}</p>
                      <button onClick={closeModal}
                        className="mt-5 px-6 py-2.5 text-xs tracking-widest uppercase text-white"
                        style={{ background: '#C9A96E' }}>OK</button>
                    </div>
                  ) : (
                    <>
                      {/* Price table */}
                      <div className="space-y-1.5 mb-5">
                        {PRICE_ROWS.map(row => {
                          const label = m[row.key]
                          const isGold = row.style === 'gold'
                          const isHighlight = row.style === 'highlight'
                          const isStrike = row.style === 'strike'
                          return (
                            <div key={row.key}
                              className={`flex items-center justify-between px-4 py-3 ${
                                isGold ? 'text-white' : isHighlight ? 'border border-[#C9A96E]/40' : 'bg-white border border-gray-100'
                              }`}
                              style={isGold ? { background: '#C9A96E' } : isHighlight ? { background: 'rgba(201,169,110,0.08)' } : undefined}
                            >
                              <span className={`text-sm ${isGold ? 'text-white font-semibold' : isHighlight ? 'text-deep-wood font-medium' : 'text-deep-wood/50'}`}>
                                {label}
                              </span>
                              <div className="text-right">
                                <span className={`font-serif text-xl ${isGold ? 'text-white font-semibold' : isHighlight ? 'text-[#C9A96E] font-semibold' : 'text-deep-wood/40 line-through text-base'}`}>
                                  €{row.price}
                                </span>
                                {!isStrike && (
                                  <span className={`text-xs ml-0.5 ${isGold ? 'text-white/70' : 'text-[#C9A96E]/70'}`}>{m.perNight}</span>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      {/* Date selectors */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <DateBox label={m.arrival} value={arrival} onChange={setArrival} placeholder={m.datePlaceholder} lang={lang} />
                        <DateBox label={m.departure} value={departure} onChange={setDeparture} placeholder={m.datePlaceholder} lang={lang} />
                      </div>

                      {/* Apartment selector */}
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">{b.summary}</p>
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {APARTMENTS.map(a => (
                          <button key={a.id} onClick={() => setAptId(a.id)}
                            className={`p-3 text-left text-sm border-2 transition-all rounded-sm ${
                              aptId === a.id ? 'border-[#C9A96E] bg-[#C9A96E]/5' : 'border-gray-200 hover:border-[#C9A96E]/50'
                            }`}>
                            <p className="font-medium text-deep-wood text-xs">{a.name}</p>
                            <p className="text-[#C9A96E] text-xs">€{a.price}{m.perNight}</p>
                          </button>
                        ))}
                      </div>

                      {/* Name + Phone */}
                      <div className="space-y-3 mb-4">
                        <input type="text" value={name} onChange={e => setName(e.target.value)}
                          placeholder={b.fullName}
                          className="w-full border border-gray-200 px-4 py-3 text-sm bg-white focus:outline-none focus:border-[#C9A96E]" />
                        <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                          placeholder={b.phone}
                          className="w-full border border-gray-200 px-4 py-3 text-sm bg-white focus:outline-none focus:border-[#C9A96E]" />
                      </div>

                      {/* Summary line */}
                      {nights > 0 && (
                        <div className="mb-4 px-3 py-2.5 bg-white border border-gray-100 text-xs text-deep-wood/60 rounded-sm">
                          {apt.name} · {nights} {b.nights} · <strong className="text-[#C9A96E]">€{total}</strong>
                        </div>
                      )}

                      {/* CTA */}
                      <button
                        onClick={handleSubmit}
                        disabled={loading || !canSubmit}
                        className="w-full py-4 text-white text-xs font-bold tracking-widest uppercase hover:opacity-90 active:opacity-80 transition-opacity disabled:opacity-40"
                        style={{ background: '#C9A96E' }}
                      >
                        {loading ? b.sending : m.check}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
