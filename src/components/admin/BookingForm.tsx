'use client'

import { useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const fmtEur = (n: number) =>
  new Intl.NumberFormat('el-GR', { style: 'currency', currency: 'EUR' }).format(n)

export default function BookingForm({ apartments }: { apartments: { id: string; name_el: string; price_per_night: number }[] }) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    apartment_id: '',
    guest_name: '',
    guest_email: '',
    guest_phone: '',
    check_in: '',
    check_out: '',
    num_guests: 2,
    channel: 'direct',
    notes: '',
  })

  const selectedApt = apartments.find(a => a.id === form.apartment_id)

  const calc = useMemo(() => {
    if (!form.check_in || !form.check_out || !selectedApt) return null
    const nights = Math.round(
      (new Date(form.check_out).getTime() - new Date(form.check_in).getTime()) / 86_400_000
    )
    if (nights <= 0) return null
    const gross = nights * selectedApt.price_per_night
    const commRate = form.channel === 'airbnb' ? 0.155 : form.channel === 'booking_com' ? 0.161 : 0
    const commission = gross * commRate
    const net = gross - commission
    return { nights, gross, commission, net }
  }, [form.check_in, form.check_out, form.channel, selectedApt])

  const handleSubmit = async () => {
    if (!form.apartment_id || !form.guest_name || !form.check_in || !form.check_out || !calc) return
    setLoading(true)
    await supabase.from('bookings').insert({
      apartment_id: form.apartment_id,
      guest_name: form.guest_name,
      guest_email: form.guest_email,
      guest_phone: form.guest_phone,
      check_in: form.check_in,
      check_out: form.check_out,
      nights: calc.nights,
      num_guests: form.num_guests,
      channel: form.channel,
      price_per_night: selectedApt?.price_per_night ?? 0,
      total_amount: calc.gross,
      notes: form.notes,
      status: 'confirmed',
    })
    setForm({
      apartment_id: '', guest_name: '', guest_email: '', guest_phone: '',
      check_in: '', check_out: '', num_guests: 2, channel: 'direct', notes: '',
    })
    setLoading(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 2500)
    router.refresh()
  }

  return (
    <div className="bg-white shadow-sm p-6">
      <h2 className="font-medium text-[#2C1B0E] mb-6">Νέα Κράτηση</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-gray-600 uppercase tracking-wider mb-2">Κατάλυμα</label>
          <select
            value={form.apartment_id}
            onChange={e => setForm({ ...form, apartment_id: e.target.value })}
            className="w-full border border-gray-300 px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#4a5d45] bg-white"
          >
            <option value="">Επιλέξτε...</option>
            {apartments.map(a => (
              <option key={a.id} value={a.id}>{a.name_el} — €{a.price_per_night}/νύχτα</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-600 uppercase tracking-wider mb-2">Όνομα Επισκέπτη</label>
          <input
            type="text"
            value={form.guest_name}
            onChange={e => setForm({ ...form, guest_name: e.target.value })}
            placeholder="Ονοματεπώνυμο"
            className="w-full border border-gray-300 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#4a5d45]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-600 uppercase tracking-wider mb-2">Τηλέφωνο</label>
            <input
              type="text"
              value={form.guest_phone}
              onChange={e => setForm({ ...form, guest_phone: e.target.value })}
              placeholder="+30 69..."
              className="w-full border border-gray-300 px-3 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#4a5d45]"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 uppercase tracking-wider mb-2">Άτομα</label>
            <input
              type="number"
              min={1}
              max={10}
              value={form.num_guests}
              onChange={e => setForm({ ...form, num_guests: Number(e.target.value) })}
              className="w-full border border-gray-300 px-3 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#4a5d45]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-600 uppercase tracking-wider mb-2">Άφιξη</label>
            <input
              type="date"
              value={form.check_in}
              onChange={e => setForm({ ...form, check_in: e.target.value })}
              className="w-full border border-gray-300 px-3 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#4a5d45]"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 uppercase tracking-wider mb-2">Αναχώρηση</label>
            <input
              type="date"
              value={form.check_out}
              onChange={e => setForm({ ...form, check_out: e.target.value })}
              className="w-full border border-gray-300 px-3 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#4a5d45]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-600 uppercase tracking-wider mb-2">Κανάλι</label>
          <select
            value={form.channel}
            onChange={e => setForm({ ...form, channel: e.target.value })}
            className="w-full border border-gray-300 px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#4a5d45] bg-white"
          >
            <option value="direct">Απευθείας (0%)</option>
            <option value="booking_com">Booking.com (16.1%)</option>
            <option value="airbnb">Airbnb (15.5%)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-600 uppercase tracking-wider mb-2">Σημειώσεις</label>
          <input
            type="text"
            value={form.notes}
            onChange={e => setForm({ ...form, notes: e.target.value })}
            placeholder="Προαιρετικά..."
            className="w-full border border-gray-300 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#4a5d45]"
          />
        </div>

        {/* Live preview */}
        {calc && (
          <div className="bg-[#4a5d45]/6 border border-[#4a5d45]/20 p-4 space-y-1.5">
            <div className="flex justify-between text-xs text-gray-600">
              <span>{calc.nights} νύχτες × €{selectedApt?.price_per_night}</span>
              <span className="font-medium text-[#2C1B0E]">{fmtEur(calc.gross)}</span>
            </div>
            {calc.commission > 0 && (
              <div className="flex justify-between text-xs text-gray-600">
                <span>Προμήθεια {form.channel === 'airbnb' ? 'Airbnb 15.5%' : 'Booking.com 16.1%'}</span>
                <span className="text-red-500">−{fmtEur(calc.commission)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-medium border-t border-[#4a5d45]/20 pt-1.5 mt-1.5">
              <span className="text-[#2C1B0E]">Καθαρό εισόδημα</span>
              <span className="text-[#4a5d45]">{fmtEur(calc.net)}</span>
            </div>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || !form.apartment_id || !form.guest_name || !form.check_in || !form.check_out || !calc}
          className={`w-full py-3 text-sm tracking-widest uppercase transition-colors disabled:opacity-40 ${
            success
              ? 'bg-green-600 text-white'
              : 'bg-[#2C1B0E] text-white hover:bg-[#4a5d45]'
          }`}
        >
          {loading ? 'Αποθήκευση...' : success ? '✓ Αποθηκεύτηκε' : 'Προσθήκη Κράτησης'}
        </button>
      </div>
    </div>
  )
}
