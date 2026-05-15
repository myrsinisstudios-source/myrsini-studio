'use client'

import { useState } from 'react'

export type GanttBooking = {
  id: string
  guest_name: string
  apartment_name: string
  channel: string
  check_in: string
  check_out: string
  total_amount: number
}

const CHANNEL_STYLE: Record<string, { bg: string; label: string }> = {
  airbnb:      { bg: '#F97316', label: 'Airbnb' },
  booking_com: { bg: '#3B82F6', label: 'Booking.com' },
  website:     { bg: '#4a7c59', label: 'Website' },
  direct:      { bg: '#4a7c59', label: 'Άμεση' },
}

const MONTH_EL = ['Ιαν','Φεβ','Μαρ','Απρ','Μαϊ','Ιουν','Ιουλ','Αυγ','Σεπ','Οκτ','Νοε','Δεκ']

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function overlap(checkIn: string, checkOut: string, year: number, month: number) {
  const d1 = new Date(checkIn + 'T00:00:00')
  const d2 = new Date(checkOut + 'T00:00:00')
  const mStart = new Date(year, month, 1)
  const mEnd = new Date(year, month + 1, 0)
  if (d2 <= mStart || d1 > mEnd) return null
  const startDay = d1.getFullYear() === year && d1.getMonth() === month ? d1.getDate() : 1
  const endDay = d2.getFullYear() === year && d2.getMonth() === month ? d2.getDate() : daysInMonth(year, month) + 1
  return { startDay, endDay }
}

export default function GanttCalendar({ bookings, apartments }: {
  bookings: GanttBooking[]
  apartments: string[]
}) {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())

  const days = daysInMonth(year, month)
  const dayNums = Array.from({ length: days }, (_, i) => i + 1)

  const prev = () => { if (month === 0) { setYear(y => y - 1); setMonth(11) } else setMonth(m => m - 1) }
  const next = () => { if (month === 11) { setYear(y => y + 1); setMonth(0) } else setMonth(m => m + 1) }

  const rows = apartments.length > 0
    ? apartments
    : [...new Set(bookings.map(b => b.apartment_name))]

  const today = new Date()
  const todayDay = today.getFullYear() === year && today.getMonth() === month ? today.getDate() : null

  return (
    <div className="rounded-xl bg-white p-5" style={{ border: '1px solid #E8E0D0' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold" style={{ color: '#2C1B0E' }}>Live Calendar</h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium" style={{ background: '#F5F0E8', color: '#5A4A35' }}>
            {MONTH_EL[month]} {year}
          </div>
          <button onClick={prev} className="w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors hover:bg-[#F5F0E8]" style={{ border: '1px solid #E3DBD0', color: '#8B7355' }}>‹</button>
          <button onClick={next} className="w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors hover:bg-[#F5F0E8]" style={{ border: '1px solid #E3DBD0', color: '#8B7355' }}>›</button>
        </div>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <div style={{ minWidth: Math.max(600, days * 28 + 88) }}>
          {/* Day headers */}
          <div className="flex" style={{ paddingLeft: 88 }}>
            {dayNums.map(d => (
              <div
                key={d}
                className="shrink-0 text-center text-[10px] pb-2 font-medium"
                style={{
                  width: 28,
                  color: todayDay === d ? '#C9A96E' : '#A09080',
                  fontWeight: todayDay === d ? 700 : 500,
                }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Rows */}
          {rows.map(apt => {
            const aptBookings = bookings.filter(b => b.apartment_name === apt)
            return (
              <div key={apt} className="flex items-center mb-2" style={{ height: 40 }}>
                {/* Label */}
                <div className="shrink-0 text-xs font-medium pr-3 text-right" style={{ width: 88, color: '#5A4A35' }}>
                  {apt}
                </div>

                {/* Day cells + booking bars */}
                <div className="flex-1 relative" style={{ height: 32 }}>
                  {/* Day cells background */}
                  <div className="absolute inset-0 flex">
                    {dayNums.map(d => (
                      <div
                        key={d}
                        style={{
                          width: 28,
                          height: '100%',
                          background: todayDay === d ? '#FFF8EE' : d % 2 === 0 ? '#FAFAF8' : '#F5F4F0',
                          borderRight: '1px solid #EDE8E0',
                        }}
                      />
                    ))}
                  </div>

                  {/* Booking bars */}
                  {aptBookings.map(b => {
                    const span = overlap(b.check_in, b.check_out, year, month)
                    if (!span) return null
                    const { bg, label } = CHANNEL_STYLE[b.channel] ?? { bg: '#888', label: b.channel }
                    const left = (span.startDay - 1) * 28
                    const width = (span.endDay - span.startDay) * 28 - 2
                    return (
                      <div
                        key={b.id}
                        title={`${b.guest_name} · ${label} · ${b.check_in} → ${b.check_out}`}
                        className="absolute top-1 bottom-1 rounded-full flex items-center px-2 overflow-hidden cursor-default"
                        style={{ left, width, background: bg, opacity: 0.92 }}
                      >
                        <span className="text-white text-[10px] font-medium truncate leading-none">
                          {label} ({MONTH_EL[new Date(b.check_in + 'T00:00:00').getMonth()]} {new Date(b.check_in + 'T00:00:00').getDate()}–{new Date(b.check_out + 'T00:00:00').getDate()})
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}

          {rows.length === 0 && (
            <div className="text-center text-xs py-4" style={{ color: '#A09080' }}>
              Δεν υπάρχουν κρατήσεις για αυτόν τον μήνα
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-3 pt-3" style={{ borderTop: '1px solid #F0EBE3' }}>
        {Object.entries(CHANNEL_STYLE).filter(([k]) => ['airbnb','website','booking_com'].includes(k)).map(([k, v]) => (
          <div key={k} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: v.bg }} />
            <span className="text-[10px]" style={{ color: '#8B7355' }}>{v.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
