'use client'

import { useState } from 'react'
import BookingCalendar from './BookingCalendar'
import PriceComparison from './PriceComparison'

export default function BookingWidget() {
  const [selectedApt, setSelectedApt] = useState('archontiko')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(2)
  const [showComparison, setShowComparison] = useState(false)

  const prices = {
    archontiko: 85,
    thalassino: 65,
  }

  const nights = checkIn && checkOut
    ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
    : 0

  const total = nights * prices[selectedApt as keyof typeof prices]

  const handleWhatsApp = () => {
    const msg = `Γεια σας! Θέλω να κάνω κράτηση για ${selectedApt === 'archontiko' ? 'Το Αρχοντικό' : 'Το Θαλασσινό'}, ${checkIn} έως ${checkOut}, ${guests} άτομα.`
    window.open(`https://wa.me/306944571280?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <section id="booking" className="bg-[#F9F7F2] py-24">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-light tracking-[-0.02em] text-[#2C1B0E] mb-2 text-center">
          Κράτηση
        </h2>
        <p className="text-center text-[#2C1B0E]/50 text-sm mb-12">
          Κλείστε απευθείας και εξοικονομήστε έως 15%
        </p>

        <div className="bg-white shadow-sm p-8">
          {/* Επιλογή καταλύματος */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {['archontiko', 'thalassino'].map((apt) => (
              <button
                key={apt}
                onClick={() => setSelectedApt(apt)}
                className={`p-4 border text-left transition-colors ${
                  selectedApt === apt
                    ? 'border-[#4a5d45] bg-[#4a5d45]/5'
                    : 'border-gray-200 hover:border-[#4a5d45]'
                }`}
              >
                <div className="font-medium text-[#2C1B0E] text-sm">
                  {apt === 'archontiko' ? 'Το Αρχοντικό' : 'Το Θαλασσινό'}
                </div>
                <div className="text-[#4a5d45] text-sm mt-1">
                  €{prices[apt as keyof typeof prices]} / νύχτα
                </div>
              </button>
            ))}
          </div>

          {/* Ημερομηνίες */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs text-[#2C1B0E]/50 tracking-wider uppercase mb-2">
                Άφιξη
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#4a5d45]"
              />
            </div>
            <div>
              <label className="block text-xs text-[#2C1B0E]/50 tracking-wider uppercase mb-2">
                Αναχώρηση
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                min={checkIn || new Date().toISOString().split('T')[0]}
                className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#4a5d45]"
              />
            </div>
          </div>

          {/* Άτομα */}
          <div className="mb-8">
            <label className="block text-xs text-[#2C1B0E]/50 tracking-wider uppercase mb-2">
              Άτομα
            </label>
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#4a5d45]"
            >
              {[1,2,3,4].map(n => (
                <option key={n} value={n}>{n} {n === 1 ? 'άτομο' : 'άτομα'}</option>
              ))}
            </select>
          </div>

          {/* Σύνολο */}
          {nights > 0 && (
            <div className="bg-[#F9F7F2] p-4 mb-6">
              <div className="flex justify-between text-sm text-[#2C1B0E]/70 mb-2">
                <span>€{prices[selectedApt as keyof typeof prices]} x {nights} νύχτες</span>
                <span>€{total}</span>
              </div>
              <div className="flex justify-between font-medium text-[#2C1B0E]">
                <span>Σύνολο</span>
                <span>€{total}</span>
              </div>
              <button
                onClick={() => setShowComparison(!showComparison)}
                className="text-xs text-[#4a5d45] underline mt-2"
              >
                Δείτε πόσο εξοικονομείτε vs Booking.com
              </button>
              {showComparison && <PriceComparison nights={nights} basePrice={prices[selectedApt as keyof typeof prices]} />}
            </div>
          )}

          {/* Κράτηση μέσω WhatsApp */}
          <button
            onClick={handleWhatsApp}
            disabled={!checkIn || !checkOut}
            className="w-full bg-[#2C1B0E] text-white py-4 text-sm tracking-widest uppercase hover:bg-[#4a5d45] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Κράτηση μέσω WhatsApp
          </button>
        </div>
      </div>
    </section>
  )
}
