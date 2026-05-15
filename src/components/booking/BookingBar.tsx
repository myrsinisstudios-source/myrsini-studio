'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import type { Lang } from '@/lib/i18n/translations'

const MiniCalendar = dynamic(() => import('./MiniCalendar'), { ssr: false })

const LOCALE_MAP: Record<Lang, string> = { el: 'el-GR', en: 'en-GB', de: 'de-DE', fr: 'fr-FR' }

const APARTMENTS = [
  { id: 'archontiko', name: 'Το Αρχοντικό', price: 85, guests: 4 },
  { id: 'thalassino', name: 'Το Θαλασσινό', price: 65, guests: 2 },
]

export default function BookingBar() {
  const { t, lang } = useLanguage()
  const b = t.booking

  const today = new Date().toISOString().split('T')[0]
  const [aptId, setAptId] = useState(APARTMENTS[0].id)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [openCal, setOpenCal] = useState<'in' | 'out' | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const apt = APARTMENTS.find(a => a.id === aptId)!

  const nights =
    checkIn && checkOut
      ? Math.max(0, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000))
      : 0

  const directTotal = nights * apt.price
  const bookingTotal = Math.round(directTotal * 1.151)
  const saving = bookingTotal - directTotal

  const fmtDate = (s: string) =>
    s
      ? new Date(s).toLocaleDateString(LOCALE_MAP[lang], { day: 'numeric', month: 'short' })
      : b.selectDate

  const handleCheckIn = useCallback((d: string) => {
    setCheckIn(d)
    if (checkOut && d >= checkOut) setCheckOut('')
    setOpenCal(null)
  }, [checkOut])

  const handleCheckOut = useCallback((d: string) => {
    setCheckOut(d)
    setOpenCal(null)
  }, [])

  const handleBook = async () => {
    if (!checkIn || !checkOut || !name || !phone) return
    setLoading(true)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apartment_id: aptId, apartment_name: apt.name,
          guest_name: name, guest_phone: phone,
          check_in: checkIn, check_out: checkOut,
          num_guests: adults + children, language: lang,
          price_per_night: apt.price, total_amount: directTotal,
          channel: 'direct',
        }),
      })
      if (res.ok) {
        setSuccess(true)
        setShowForm(false)
        setCheckIn(''); setCheckOut(''); setName(''); setPhone('')
      }
    } catch {}
    setLoading(false)
  }

  const handleWhatsApp = () => {
    const msg = `Γεια σας! Θέλω να κάνω κράτηση:\n🏡 ${apt.name}\n📅 ${checkIn} → ${checkOut}\n👥 ${adults + children} ${b.guests}`
    window.open(`https://wa.me/306944571280?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <div id="booking" className="bg-white shadow-2xl rounded-sm overflow-visible">
      <div className="p-5 sm:p-6">

        {success && (
          <div className="mb-4 p-3 bg-olive/10 border border-olive/30 text-olive text-sm text-center">
            {b.success}
          </div>
        )}

        {/* Apartment selector */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          {APARTMENTS.map(a => (
            <button
              key={a.id}
              onClick={() => setAptId(a.id)}
              className={`p-3 border-2 text-left transition-all rounded-sm ${
                aptId === a.id ? 'border-olive bg-olive/5' : 'border-gray-200 hover:border-olive/50'
              }`}
            >
              <div className="font-serif text-sm text-deep-wood leading-tight">{a.name}</div>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-olive text-sm font-medium">€{a.price}<span className="text-xs font-normal">{b.perNight}</span></span>
                <span className="text-gray-400 text-xs line-through">€{Math.round(a.price * 1.151)}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Dates + Guests */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {/* Check-in */}
          <div className="relative">
            <label className="block text-xs text-deep-wood/40 tracking-widest uppercase mb-1.5">{b.arrival}</label>
            <button
              onClick={() => setOpenCal(openCal === 'in' ? null : 'in')}
              className={`w-full border px-3 py-2.5 text-sm text-left flex items-center gap-2 transition-colors rounded-sm ${
                openCal === 'in' ? 'border-olive' : 'border-gray-200 hover:border-olive/50'
              }`}
            >
              <span className="text-olive">📅</span>
              <span className={checkIn ? 'text-deep-wood' : 'text-gray-400'}>{fmtDate(checkIn)}</span>
            </button>
            {openCal === 'in' && (
              <div className="absolute top-full mt-1 z-50 left-0">
                <MiniCalendar selectedDate={checkIn} rangeStart={checkIn} rangeEnd={checkOut}
                  minDate={today} onSelect={handleCheckIn} onClose={() => setOpenCal(null)} />
              </div>
            )}
          </div>

          {/* Check-out */}
          <div className="relative">
            <label className="block text-xs text-deep-wood/40 tracking-widest uppercase mb-1.5">{b.departure}</label>
            <button
              onClick={() => setOpenCal(openCal === 'out' ? null : 'out')}
              className={`w-full border px-3 py-2.5 text-sm text-left flex items-center gap-2 transition-colors rounded-sm ${
                openCal === 'out' ? 'border-olive' : 'border-gray-200 hover:border-olive/50'
              }`}
            >
              <span className="text-olive">📅</span>
              <span className={checkOut ? 'text-deep-wood' : 'text-gray-400'}>{fmtDate(checkOut)}</span>
            </button>
            {openCal === 'out' && (
              <div className="absolute top-full mt-1 z-50 left-0">
                <MiniCalendar selectedDate={checkOut} rangeStart={checkIn} rangeEnd={checkOut}
                  minDate={checkIn || today} onSelect={handleCheckOut} onClose={() => setOpenCal(null)} />
              </div>
            )}
          </div>

          {/* Adults */}
          <div>
            <label className="block text-xs text-deep-wood/40 tracking-widest uppercase mb-1.5">{b.adults}</label>
            <div className="border border-gray-200 flex items-center justify-between px-3 py-2.5 rounded-sm">
              <button onClick={() => setAdults(Math.max(1, adults - 1))}
                className="w-6 h-6 flex items-center justify-center text-olive hover:bg-olive/10 rounded-full transition-colors font-medium">−</button>
              <span className="text-sm text-deep-wood font-medium w-5 text-center">{adults}</span>
              <button onClick={() => setAdults(Math.min(apt.guests, adults + 1))}
                className="w-6 h-6 flex items-center justify-center text-olive hover:bg-olive/10 rounded-full transition-colors font-medium">+</button>
            </div>
          </div>

          {/* Children */}
          <div>
            <label className="block text-xs text-deep-wood/40 tracking-widest uppercase mb-1.5">{b.children}</label>
            <div className="border border-gray-200 flex items-center justify-between px-3 py-2.5 rounded-sm">
              <button onClick={() => setChildren(Math.max(0, children - 1))}
                className="w-6 h-6 flex items-center justify-center text-olive hover:bg-olive/10 rounded-full transition-colors font-medium">−</button>
              <span className="text-sm text-deep-wood font-medium w-5 text-center">{children}</span>
              <button onClick={() => setChildren(Math.min(4, children + 1))}
                className="w-6 h-6 flex items-center justify-center text-olive hover:bg-olive/10 rounded-full transition-colors font-medium">+</button>
            </div>
          </div>
        </div>

        {/* Best Price Guarantee */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 p-3 bg-olive/5 border border-olive/20 rounded-sm">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏅</span>
            <div>
              <div className="text-xs font-semibold text-olive uppercase tracking-wider">{b.bestPrice}</div>
              <div className="text-xs text-deep-wood/50 mt-0.5">{b.noCommission}</div>
            </div>
          </div>
          {nights > 0 ? (
            <div className="text-right shrink-0">
              <div className="text-olive font-bold text-lg">€{directTotal}</div>
              <div className="flex items-center gap-2 justify-end">
                <span className="text-xs text-gray-400 line-through">€{bookingTotal} Booking.com</span>
                <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 font-medium">-€{saving}</span>
              </div>
            </div>
          ) : (
            <div className="text-right shrink-0">
              <div className="text-olive font-medium text-sm">€{apt.price}{b.perNight}</div>
              <div className="text-xs text-gray-400 line-through">€{Math.round(apt.price * 1.151)} Booking.com</div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => { if (checkIn && checkOut) setShowForm(!showForm) }}
            disabled={!checkIn || !checkOut}
            className="flex-1 bg-deep-wood text-white py-3 text-xs tracking-widest uppercase hover:bg-olive transition-colors disabled:opacity-40 disabled:cursor-not-allowed rounded-sm"
          >
            {b.directBook}
          </button>
          <button
            onClick={handleWhatsApp}
            disabled={!checkIn || !checkOut}
            className="flex-1 bg-[#25D366] text-white py-3 text-xs tracking-widest uppercase hover:bg-[#1ebe5d] transition-colors disabled:opacity-40 disabled:cursor-not-allowed rounded-sm"
          >
            📱 {b.whatsapp}
          </button>
        </div>
      </div>

      {/* Expanded contact form */}
      {showForm && (
        <div className="border-t border-gray-100 bg-cream/50 p-5 sm:p-6">
          <h3 className="font-serif text-base text-deep-wood mb-4">{b.fillDetails}</h3>
          <div className="grid sm:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-xs text-deep-wood/40 tracking-widest uppercase mb-1.5">{b.fullName}</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="π.χ. Μαρία Παπαδοπούλου"
                className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-olive bg-white rounded-sm" />
            </div>
            <div>
              <label className="block text-xs text-deep-wood/40 tracking-widest uppercase mb-1.5">{b.phone}</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                placeholder="+30 69..."
                className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-olive bg-white rounded-sm" />
            </div>
          </div>
          <div className="mb-3 text-xs text-deep-wood/40 bg-white border border-gray-100 p-3 rounded-sm">
            <strong className="text-deep-wood/60">{b.summary}:</strong>{' '}
            {apt.name} · {checkIn} → {checkOut} · {nights} {b.nights} · {adults + children} {b.guests} · <strong className="text-olive">€{directTotal}</strong>
          </div>
          <button
            onClick={handleBook}
            disabled={loading || !name || !phone}
            className="w-full bg-olive text-white py-3.5 text-xs tracking-widest uppercase hover:bg-deep-wood transition-colors disabled:opacity-40 rounded-sm"
          >
            {loading ? b.sending : b.confirm}
          </button>
        </div>
      )}
    </div>
  )
}
