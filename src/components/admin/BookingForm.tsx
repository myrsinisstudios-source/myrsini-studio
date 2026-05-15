'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function BookingForm({ apartments }: { apartments: any[] }) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    apartment_id: '',
    guest_name: '',
    guest_email: '',
    guest_phone: '',
    check_in: '',
    check_out: '',
    num_guests: 2,
    channel: 'direct',
    commission_pct: 0,
    notes: '',
  })

  const selectedApt = apartments.find(a => a.id === form.apartment_id)

  const handleSubmit = async () => {
    if (!form.apartment_id || !form.guest_name || !form.check_in || !form.check_out) return
    setLoading(true)
    await supabase.from('bookings').insert({
      ...form,
      price_per_night: selectedApt?.price_per_night || 0,
      status: 'confirmed',
    })
    setForm({
      apartment_id: '', guest_name: '', guest_email: '', guest_phone: '',
      check_in: '', check_out: '', num_guests: 2, channel: 'direct', commission_pct: 0, notes: '',
    })
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="bg-white shadow-sm p-6">
      <h2 className="font-medium text-[#2C1B0E] mb-6">Νέα Κράτηση</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-gray-800 uppercase tracking-wider mb-2">Κατάλυμα</label>
          <select
            value={form.apartment_id}
            onChange={(e) => setForm({...form, apartment_id: e.target.value})}
            className="w-full border border-gray-300 px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#4a5d45]"
          >
            <option value="">Επιλέξτε...</option>
            {apartments.map((a) => (
              <option key={a.id} value={a.id}>{a.name_el} — €{a.price_per_night}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-800 uppercase tracking-wider mb-2">Όνομα Επισκέπτη</label>
          <input
            type="text"
            value={form.guest_name}
            onChange={(e) => setForm({...form, guest_name: e.target.value})}
            placeholder="Ονοματεπώνυμο"
            className="w-full border border-gray-300 px-4 py-3 text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:border-[#4a5d45]"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-800 uppercase tracking-wider mb-2">Τηλέφωνο</label>
          <input
            type="text"
            value={form.guest_phone}
            onChange={(e) => setForm({...form, guest_phone: e.target.value})}
            placeholder="+30 69..."
            className="w-full border border-gray-300 px-4 py-3 text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:border-[#4a5d45]"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-800 uppercase tracking-wider mb-2">Άφιξη</label>
            <input
              type="date"
              value={form.check_in}
              onChange={(e) => setForm({...form, check_in: e.target.value})}
              className="w-full border border-gray-300 px-3 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#4a5d45]"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-800 uppercase tracking-wider mb-2">Αναχώρηση</label>
            <input
              type="date"
              value={form.check_out}
              onChange={(e) => setForm({...form, check_out: e.target.value})}
              className="w-full border border-gray-300 px-3 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#4a5d45]"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs text-gray-800 uppercase tracking-wider mb-2">Κανάλι</label>
          <select
            value={form.channel}
            onChange={(e) => setForm({...form, channel: e.target.value, commission_pct: e.target.value === 'booking_com' ? 15 : e.target.value === 'airbnb' ? 14 : 0})}
            className="w-full border border-gray-300 px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#4a5d45]"
          >
            <option value="direct">Απευθείας</option>
            <option value="booking_com">Booking.com (15%)</option>
            <option value="airbnb">Airbnb (14%)</option>
          </select>
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading || !form.apartment_id || !form.guest_name || !form.check_in || !form.check_out}
          className="w-full bg-[#2C1B0E] text-white py-3 text-sm tracking-widest uppercase hover:bg-[#4a5d45] transition-colors disabled:opacity-40"
        >
          {loading ? 'Αποθήκευση...' : 'Προσθήκη Κράτησης'}
        </button>
      </div>
    </div>
  )
}