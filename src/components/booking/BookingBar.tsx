'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import type { Lang } from '@/lib/i18n/translations'
import type { SiteSettings } from '@/components/home/WeatherWidget'

const MiniCalendar = dynamic(() => import('./MiniCalendar'), { ssr: false })

const LOCALE_MAP: Record<Lang, string> = { el: 'el-GR', en: 'en-GB', de: 'de-DE', fr: 'fr-FR' }

const APARTMENTS = [
  { id: 'archontiko', name: 'Το Αρχοντικό', price: 85, guests: 4 },
  { id: 'thalassino', name: 'Το Θαλασσινό', price: 65, guests: 2 },
]

/* ── Validation messages (4 languages) ── */
type VK = 'name' | 'phone' | 'dates'
const VM: Record<VK, Record<Lang, string>> = {
  name:  { el: 'Απαιτείται ονοματεπώνυμο (≥2 χαρακτήρες)', en: 'Full name required (min 2 chars)', de: 'Name erforderlich (mind. 2 Zeichen)', fr: 'Nom requis (min 2 caractères)' },
  phone: { el: 'Εισάγετε έγκυρο αριθμό τηλεφώνου', en: 'Enter a valid phone number', de: 'Gültige Telefonnummer erforderlich', fr: 'Numéro de téléphone valide requis' },
  dates: { el: 'Επιλέξτε ημερομηνίες άφιξης και αναχώρησης', en: 'Please select arrival and departure dates', de: 'Bitte An- und Abreisedatum auswählen', fr: 'Veuillez sélectionner vos dates' },
}
const ERR_GENERIC: Record<Lang, string> = {
  el: 'Παρουσιάστηκε σφάλμα. Δοκιμάστε ξανά ή επικοινωνήστε μέσω WhatsApp.',
  en: 'Something went wrong. Please try again or contact us via WhatsApp.',
  de: 'Ein Fehler ist aufgetreten. Bitte erneut versuchen oder per WhatsApp kontaktieren.',
  fr: 'Une erreur s\'est produite. Réessayez ou contactez-nous par WhatsApp.',
}

/* Multilingual WhatsApp pre-fill */
const WA_MSG: Record<Lang, (a: string, ci: string, co: string, g: number) => string> = {
  el: (a,ci,co,g) => `Γεια σας, ενδιαφέρομαι για κράτηση στο ${a} από ${ci} έως ${co} για ${g} άτομα.`,
  en: (a,ci,co,g) => `Hello, I'm interested in booking ${a} from ${ci} to ${co} for ${g} guests.`,
  de: (a,ci,co,g) => `Hallo, ich interessiere mich für eine Buchung von ${a} vom ${ci} bis ${co} für ${g} Personen.`,
  fr: (a,ci,co,g) => `Bonjour, je suis intéressé(e) par la réservation de ${a} du ${ci} au ${co} pour ${g} personnes.`,
}

type FormErrors = { name?: string; phone?: string; dates?: string }

export default function BookingBar({ settings }: { settings?: SiteSettings | null }) {
  const { t, lang } = useLanguage()
  const b = t.booking

  const today = new Date().toISOString().split('T')[0]
  const [aptId, setAptId]         = useState(APARTMENTS[0].id)
  const [checkIn, setCheckIn]     = useState('')
  const [checkOut, setCheckOut]   = useState('')
  const [adults, setAdults]       = useState(2)
  const [children, setChildren]   = useState(0)
  const [openCal, setOpenCal]     = useState<'in' | 'out' | null>(null)

  /* Modal state */
  const [showModal, setShowModal] = useState(false)
  const [name, setName]           = useState('')
  const [phone, setPhone]         = useState('')
  const [loading, setLoading]     = useState(false)
  const [modalSuccess, setModalSuccess] = useState(false)
  const [errors, setErrors]       = useState<FormErrors>({})
  const [bookingError, setBookingError] = useState('')

  /* Main widget success (after modal closes) */
  const [success, setSuccess]     = useState(false)

  const apt = APARTMENTS.find(a => a.id === aptId)!
  const totalGuests = adults + children

  const nights =
    checkIn && checkOut
      ? Math.max(0, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000))
      : 0

  const directTotal  = nights * apt.price
  const bookingTotal = Math.round(directTotal * 1.151)
  const saving       = bookingTotal - directTotal

  const fmtDate = (s: string) =>
    s
      ? new Date(s).toLocaleDateString(LOCALE_MAP[lang], { day: 'numeric', month: 'short' })
      : b.selectDate

  const handleCheckIn = useCallback((d: string) => {
    setCheckIn(d)
    if (checkOut && d >= checkOut) setCheckOut('')
    setOpenCal(null)
    setErrors(e => ({ ...e, dates: undefined }))
    setSuccess(false)
  }, [checkOut])

  const handleCheckOut = useCallback((d: string) => {
    setCheckOut(d)
    setOpenCal(null)
    setErrors(e => ({ ...e, dates: undefined }))
  }, [])

  /* ── Validate + open booking modal ── */
  const handleOpenModal = () => {
    if (!checkIn || !checkOut) {
      setErrors({ dates: VM.dates[lang] })
      return
    }
    setErrors({})
    setBookingError('')
    setName('')
    setPhone('')
    setModalSuccess(false)
    setShowModal(true)
  }

  /* ── Submit booking ── */
  const handleBook = async () => {
    const errs: FormErrors = {}
    if (!checkIn || !checkOut) errs.dates = VM.dates[lang]
    if (name.trim().length < 2)  errs.name  = VM.name[lang]
    const digits = phone.replace(/\D/g, '')
    if (digits.length < 7)       errs.phone = VM.phone[lang]

    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})
    setBookingError('')
    setLoading(true)

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apartment_id: aptId,
          apartment_name: apt.name,
          guest_name: name.trim(),
          guest_phone: phone.trim(),
          check_in: checkIn,
          check_out: checkOut,
          num_guests: totalGuests,
          language: lang,
          price_per_night: apt.price,
          total_amount: directTotal,
          channel: 'direct',
        }),
      })

      if (res.ok) {
        setModalSuccess(true)
        // Reset after a moment
        setTimeout(() => {
          setShowModal(false)
          setSuccess(true)
          setCheckIn(''); setCheckOut('')
          setName(''); setPhone('')
          setAdults(2); setChildren(0)
        }, 2000)
      } else {
        setBookingError(ERR_GENERIC[lang])
      }
    } catch {
      setBookingError(ERR_GENERIC[lang])
    }
    setLoading(false)
  }

  /* ── WhatsApp ── */
  const handleWhatsApp = () => {
    if (!checkIn || !checkOut) {
      setErrors({ dates: VM.dates[lang] })
      return
    }
    setErrors(e => ({ ...e, dates: undefined }))
    const waPhone = (settings?.phone ?? '+30 694 457 1280').replace(/\D/g, '')
    const msg = WA_MSG[lang](apt.name, checkIn, checkOut, totalGuests)
    window.open(`https://wa.me/${waPhone}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  /* ── Guest count helpers (adults + children ≤ apt.guests) ── */
  const incAdults   = () => setAdults(a => Math.min(apt.guests - children, a + 1))
  const decAdults   = () => setAdults(a => Math.max(1, a - 1))
  const incChildren = () => setChildren(c => Math.min(apt.guests - adults, c + 1))
  const decChildren = () => setChildren(c => Math.max(0, c - 1))

  return (
    <>
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
                onClick={() => {
                  setAptId(a.id)
                  // Re-cap guests for new apartment
                  setAdults(prev => Math.min(prev, a.guests))
                  setChildren(prev => Math.min(prev, Math.max(0, a.guests - Math.min(adults, a.guests))))
                }}
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-1">
            {/* Check-in */}
            <div className="relative">
              <label className="block text-xs text-deep-wood/40 tracking-widest uppercase mb-1.5">{b.arrival}</label>
              <button
                onClick={() => setOpenCal(openCal === 'in' ? null : 'in')}
                className={`w-full border px-3 py-2.5 text-sm text-left flex items-center gap-2 transition-colors rounded-sm ${
                  errors.dates ? 'border-red-400' : openCal === 'in' ? 'border-olive' : 'border-gray-200 hover:border-olive/50'
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
                  errors.dates ? 'border-red-400' : openCal === 'out' ? 'border-olive' : 'border-gray-200 hover:border-olive/50'
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
                <button onClick={decAdults}
                  className="w-6 h-6 flex items-center justify-center text-olive hover:bg-olive/10 rounded-full transition-colors font-medium">−</button>
                <span className="text-sm text-deep-wood font-medium w-5 text-center">{adults}</span>
                <button onClick={incAdults}
                  disabled={adults + children >= apt.guests}
                  className="w-6 h-6 flex items-center justify-center text-olive hover:bg-olive/10 rounded-full transition-colors font-medium disabled:opacity-30 disabled:cursor-not-allowed">+</button>
              </div>
            </div>

            {/* Children */}
            <div>
              <label className="block text-xs text-deep-wood/40 tracking-widest uppercase mb-1.5">{b.children}</label>
              <div className="border border-gray-200 flex items-center justify-between px-3 py-2.5 rounded-sm">
                <button onClick={decChildren}
                  className="w-6 h-6 flex items-center justify-center text-olive hover:bg-olive/10 rounded-full transition-colors font-medium">−</button>
                <span className="text-sm text-deep-wood font-medium w-5 text-center">{children}</span>
                <button onClick={incChildren}
                  disabled={adults + children >= apt.guests}
                  className="w-6 h-6 flex items-center justify-center text-olive hover:bg-olive/10 rounded-full transition-colors font-medium disabled:opacity-30 disabled:cursor-not-allowed">+</button>
              </div>
            </div>
          </div>

          {/* Date error */}
          {errors.dates && (
            <p className="text-red-500 text-xs mb-3 mt-1">{errors.dates}</p>
          )}

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

          {/* CTA buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleOpenModal}
              className="flex-1 bg-deep-wood text-white py-3 text-xs tracking-widest uppercase hover:bg-olive transition-colors rounded-sm"
            >
              {b.directBook}
            </button>
            <button
              onClick={handleWhatsApp}
              className="flex-1 bg-[#25D366] text-white py-3 text-xs tracking-widest uppercase hover:bg-[#1ebe5d] transition-colors rounded-sm"
            >
              📱 {b.whatsapp}
            </button>
          </div>
        </div>
      </div>

      {/* ── Booking Modal (Option A) ── */}
      {showModal && (
        <div
          className="fixed inset-0 z-[9100] bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => { if (!loading) setShowModal(false) }}
        >
          <div
            className="bg-white w-full sm:max-w-md shadow-2xl max-h-[92vh] overflow-y-auto sm:rounded-sm"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="sticky top-0 bg-white flex items-start justify-between p-5 border-b border-gray-100 z-10">
              <div>
                <h3 className="font-serif text-lg text-deep-wood">{b.fillDetails}</h3>
                <p className="text-xs text-deep-wood/50 mt-0.5">
                  {apt.name} · {fmtDate(checkIn)} → {fmtDate(checkOut)}
                  {nights > 0 && ` · ${nights} ${b.nights}`}
                  {` · ${totalGuests} ${b.guests}`}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-2xl leading-none text-gray-400 hover:text-gray-700 transition-colors ml-4 mt-0.5"
                aria-label="Κλείσιμο"
              >×</button>
            </div>

            <div className="p-5">
              {modalSuccess ? (
                /* Success state inside modal */
                <div className="text-center py-8">
                  <p className="text-4xl mb-3">✅</p>
                  <p className="font-serif text-xl text-deep-wood mb-2">
                    {lang === 'el' ? 'Ευχαριστούμε!' : lang === 'de' ? 'Vielen Dank!' : lang === 'fr' ? 'Merci !' : 'Thank you!'}
                  </p>
                  <p className="text-sm text-deep-wood/60">{b.success}</p>
                </div>
              ) : (
                <>
                  {/* Summary */}
                  <div className="mb-5 p-3 bg-olive/5 border border-olive/15 rounded-sm text-xs text-deep-wood/60">
                    <strong className="text-deep-wood/80">{apt.name}</strong>
                    {' · '}{checkIn} → {checkOut}
                    {nights > 0 && ` · ${nights} ${b.nights}`}
                    {` · ${totalGuests} ${b.guests}`}
                    {directTotal > 0 && <> · <strong className="text-olive">€{directTotal}</strong></>}
                  </div>

                  {/* Name */}
                  <div className="mb-3">
                    <label className="block text-xs text-deep-wood/40 tracking-widest uppercase mb-1.5">
                      {b.fullName} *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => { setName(e.target.value); setErrors(er => ({ ...er, name: undefined })) }}
                      placeholder={lang === 'el' ? 'π.χ. Μαρία Παπαδοπούλου' : lang === 'de' ? 'z.B. Maria Müller' : lang === 'fr' ? 'ex: Marie Dupont' : 'e.g. Maria Papadopoulou'}
                      style={{ fontSize: 16 }}
                      className={`w-full border px-4 py-3 text-sm focus:outline-none bg-white rounded-sm transition-colors ${
                        errors.name ? 'border-red-400 bg-red-50/20' : 'border-gray-200 focus:border-olive'
                      }`}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>

                  {/* Phone */}
                  <div className="mb-5">
                    <label className="block text-xs text-deep-wood/40 tracking-widest uppercase mb-1.5">
                      {b.phone} *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => { setPhone(e.target.value); setErrors(er => ({ ...er, phone: undefined })) }}
                      placeholder="+30 69..."
                      style={{ fontSize: 16 }}
                      className={`w-full border px-4 py-3 text-sm focus:outline-none bg-white rounded-sm transition-colors ${
                        errors.phone ? 'border-red-400 bg-red-50/20' : 'border-gray-200 focus:border-olive'
                      }`}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>

                  {/* API error */}
                  {bookingError && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-sm mb-4">
                      {bookingError}
                    </p>
                  )}

                  {/* Submit */}
                  <button
                    onClick={handleBook}
                    disabled={loading}
                    className="w-full bg-olive text-white py-3.5 text-xs tracking-widest uppercase hover:bg-deep-wood transition-colors disabled:opacity-40 rounded-sm"
                  >
                    {loading ? b.sending : b.confirm}
                  </button>

                  {/* WhatsApp fallback */}
                  <button
                    onClick={() => {
                      setShowModal(false)
                      handleWhatsApp()
                    }}
                    className="w-full mt-2 bg-[#25D366] text-white py-2.5 text-xs tracking-widest uppercase hover:bg-[#1ebe5d] transition-colors rounded-sm"
                  >
                    📱 {b.whatsapp}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
