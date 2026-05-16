'use client'

import { useState } from 'react'

type Section = 'general' | 'apartments' | 'channels' | 'notifications'

const NAV: { key: Section; label: string; sub: string }[] = [
  { key: 'general',       label: 'Γενικά',           sub: 'Βασικές πληροφορίες' },
  { key: 'apartments',    label: 'Διαμερίσματα',      sub: 'Studio A & B' },
  { key: 'channels',      label: 'Κανάλια',           sub: 'Airbnb, Booking.com' },
  { key: 'notifications', label: 'Ειδοποιήσεις',      sub: 'Email & SMS' },
]

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-wider mb-1.5 font-medium" style={{ color: '#8B7355' }}>{label}</label>
      {children}
    </div>
  )
}

function Input({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full px-3 py-2 text-sm focus:outline-none rounded-lg"
      style={{ border: '1px solid #D5CCBB', background: '#FAFAF8', color: '#2C1B0E' }}
    />
  )
}

function Toggle({ label, sub, checked, onChange }: { label: string; sub?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid #F0EBE3' }}>
      <div>
        <p className="text-sm font-medium" style={{ color: '#2C1B0E' }}>{label}</p>
        {sub && <p className="text-[10px] mt-0.5" style={{ color: '#A09080' }}>{sub}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className="relative w-10 h-5.5 rounded-full transition-colors"
        style={{ background: checked ? '#4a7c59' : '#D5CCBB', padding: 2 }}
      >
        <span
          className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform"
          style={{ left: checked ? 'calc(100% - 18px)' : 2, transitionDuration: '150ms' }}
        />
      </button>
    </div>
  )
}

function SaveBar({ onSave, saved }: { onSave: () => void; saved: boolean }) {
  return (
    <div className="flex items-center gap-3 pt-4 mt-2" style={{ borderTop: '1px solid #F0EBE3' }}>
      <button
        onClick={onSave}
        className="px-5 py-2 text-xs tracking-widest uppercase text-white rounded-lg transition-opacity hover:opacity-90"
        style={{ background: '#C9A96E' }}
      >
        Αποθήκευση
      </button>
      {saved && <p className="text-xs" style={{ color: '#4a7c59' }}>✓ Αποθηκεύτηκε</p>}
    </div>
  )
}

export default function AdminSettingsPage() {
  const [section, setSection] = useState<Section>('general')
  const [saved, setSaved] = useState(false)

  // General
  const [propertyName, setPropertyName] = useState('Myrsini Studios')
  const [location, setLocation] = useState('Χόρτο, Πήλιο, Ελλάδα')
  const [phone, setPhone] = useState('+30 24230 00000')
  const [email, setEmail] = useState('info@myrsini-studios.gr')
  const [checkInTime, setCheckInTime] = useState('15:00')
  const [checkOutTime, setCheckOutTime] = useState('11:00')

  // Apartments
  const [studioAName, setStudioAName] = useState('Studio A')
  const [studioACapacity, setStudioACapacity] = useState('4')
  const [studioAPrice, setStudioAPrice] = useState('80')
  const [studioBName, setStudioBName] = useState('Studio B')
  const [studioBCapacity, setStudioBCapacity] = useState('4')
  const [studioBPrice, setStudioBPrice] = useState('80')

  // Channels
  const [airbnbActive, setAirbnbActive] = useState(true)
  const [bookingActive, setBookingActive] = useState(true)
  const [websiteActive, setWebsiteActive] = useState(true)
  const [airbnbCommission, setAirbnbCommission] = useState('15.5')
  const [bookingCommission, setBookingCommission] = useState('16.1')

  // Notifications
  const [emailBooking, setEmailBooking] = useState(true)
  const [emailCheckIn, setEmailCheckIn] = useState(true)
  const [emailReminder, setEmailReminder] = useState(false)
  const [notifEmail, setNotifEmail] = useState('info@myrsini-studios.gr')

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-2xl font-light" style={{ color: '#2C1B0E' }}>Ρυθμίσεις</h1>
        <p className="text-xs mt-0.5" style={{ color: '#8B7355' }}>Διαχείριση γενικών παραμέτρων του συστήματος</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Sidebar nav — horizontal scroll on mobile */}
        <div className="md:col-span-1 rounded-xl bg-white p-3 md:space-y-0.5 flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible self-start" style={{ border: '1px solid #E8E0D0' }}>
          {NAV.map(n => (
            <button
              key={n.key}
              onClick={() => setSection(n.key)}
              className="shrink-0 md:w-full text-left px-3 py-2.5 rounded-lg transition-all whitespace-nowrap"
              style={section === n.key
                ? { background: '#E5DDD0', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }
                : { background: 'transparent' }}
            >
              <p className="text-sm font-medium leading-tight" style={{ color: section === n.key ? '#3A2200' : '#5A4A35' }}>{n.label}</p>
              <p className="text-[10px] mt-0.5" style={{ color: section === n.key ? '#8B6914' : '#A09080' }}>{n.sub}</p>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="md:col-span-3 rounded-xl bg-white p-4 sm:p-5" style={{ border: '1px solid #E8E0D0' }}>

          {section === 'general' && (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold mb-4" style={{ color: '#2C1B0E' }}>Γενικές Πληροφορίες</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Όνομα Καταλύματος">
                  <Input value={propertyName} onChange={e => setPropertyName(e.target.value)} />
                </Field>
                <Field label="Τοποθεσία">
                  <Input value={location} onChange={e => setLocation(e.target.value)} />
                </Field>
                <Field label="Τηλέφωνο">
                  <Input value={phone} onChange={e => setPhone(e.target.value)} />
                </Field>
                <Field label="Email">
                  <Input type="email" value={email} onChange={e => setEmail(e.target.value)} />
                </Field>
                <Field label="Check-in ώρα">
                  <Input type="time" value={checkInTime} onChange={e => setCheckInTime(e.target.value)} />
                </Field>
                <Field label="Check-out ώρα">
                  <Input type="time" value={checkOutTime} onChange={e => setCheckOutTime(e.target.value)} />
                </Field>
              </div>

              <div className="rounded-lg p-4 mt-2" style={{ background: '#F9F6F1' }}>
                <p className="text-xs font-semibold mb-2" style={{ color: '#2C1B0E' }}>Κωδικός Admin</p>
                <p className="text-[10px] mb-3" style={{ color: '#8B7355' }}>Ο κωδικός αποθηκεύεται τοπικά στον browser. Για αλλαγή, επεξεργαστείτε το αρχείο layout.tsx.</p>
                <div className="flex items-center gap-2">
                  <Input type="password" placeholder="Τρέχων κωδικός" />
                  <Input type="password" placeholder="Νέος κωδικός" />
                </div>
              </div>

              <SaveBar onSave={handleSave} saved={saved} />
            </div>
          )}

          {section === 'apartments' && (
            <div className="space-y-5">
              <h2 className="text-sm font-semibold" style={{ color: '#2C1B0E' }}>Διαμερίσματα</h2>

              {[
                { label: 'Studio A', name: studioAName, setName: setStudioAName, cap: studioACapacity, setCap: setStudioACapacity, price: studioAPrice, setPrice: setStudioAPrice },
                { label: 'Studio B', name: studioBName, setName: setStudioBName, cap: studioBCapacity, setCap: setStudioBCapacity, price: studioBPrice, setPrice: setStudioBPrice },
              ].map(apt => (
                <div key={apt.label} className="rounded-lg p-4" style={{ background: '#F9F6F1' }}>
                  <p className="text-xs font-semibold mb-3" style={{ color: '#2C1B0E' }}>{apt.label}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Field label="Όνομα">
                      <Input value={apt.name} onChange={e => apt.setName(e.target.value)} />
                    </Field>
                    <Field label="Χωρητικότητα (άτομα)">
                      <Input type="number" value={apt.cap} onChange={e => apt.setCap(e.target.value)} />
                    </Field>
                    <Field label="Τιμή/Διανυκτέρευση (€)">
                      <Input type="number" value={apt.price} onChange={e => apt.setPrice(e.target.value)} />
                    </Field>
                  </div>
                </div>
              ))}

              <SaveBar onSave={handleSave} saved={saved} />
            </div>
          )}

          {section === 'channels' && (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold" style={{ color: '#2C1B0E' }}>Κανάλια Κρατήσεων</h2>

              <Toggle label="Airbnb" sub="Ενεργοποίηση κρατήσεων μέσω Airbnb" checked={airbnbActive} onChange={setAirbnbActive} />
              <Toggle label="Booking.com" sub="Ενεργοποίηση κρατήσεων μέσω Booking.com" checked={bookingActive} onChange={setBookingActive} />
              <Toggle label="Website (Άμεση)" sub="Ενεργοποίηση άμεσων κρατήσεων μέσω ιστοσελίδας" checked={websiteActive} onChange={setWebsiteActive} />

              <div className="rounded-lg p-4 mt-2" style={{ background: '#F9F6F1' }}>
                <p className="text-xs font-semibold mb-3" style={{ color: '#2C1B0E' }}>Προμήθειες (% επί κράτησης)</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Airbnb (%)">
                    <Input type="number" step="0.1" value={airbnbCommission} onChange={e => setAirbnbCommission(e.target.value)} />
                  </Field>
                  <Field label="Booking.com (%)">
                    <Input type="number" step="0.1" value={bookingCommission} onChange={e => setBookingCommission(e.target.value)} />
                  </Field>
                </div>
              </div>

              <SaveBar onSave={handleSave} saved={saved} />
            </div>
          )}

          {section === 'notifications' && (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold" style={{ color: '#2C1B0E' }}>Ειδοποιήσεις</h2>

              <Field label="Email αποδέκτη">
                <Input type="email" value={notifEmail} onChange={e => setNotifEmail(e.target.value)} />
              </Field>

              <div className="mt-4">
                <p className="text-[10px] uppercase tracking-wider mb-3 font-medium" style={{ color: '#8B7355' }}>Email Ειδοποιήσεις</p>
                <Toggle label="Νέα κράτηση" sub="Ειδοποίηση όταν καταχωρείται νέα κράτηση" checked={emailBooking} onChange={setEmailBooking} />
                <Toggle label="Check-in υπενθύμιση" sub="24 ώρες πριν το check-in" checked={emailCheckIn} onChange={setEmailCheckIn} />
                <Toggle label="Εβδομαδιαία αναφορά" sub="Περίληψη κρατήσεων κάθε Δευτέρα" checked={emailReminder} onChange={setEmailReminder} />
              </div>

              <SaveBar onSave={handleSave} saved={saved} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
