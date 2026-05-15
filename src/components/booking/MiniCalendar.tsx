'use client'

import { useState, useEffect, useRef } from 'react'

const MONTHS = [
  'Ιανουάριος','Φεβρουάριος','Μάρτιος','Απρίλιος','Μάιος','Ιούνιος',
  'Ιούλιος','Αύγουστος','Σεπτέμβριος','Οκτώβριος','Νοέμβριος','Δεκέμβριος',
]
const DAYS = ['Κυ','Δε','Τρ','Τε','Πε','Πα','Σα']

interface Props {
  selectedDate: string
  rangeStart?: string
  rangeEnd?: string
  minDate?: string
  onSelect: (date: string) => void
  onClose: () => void
}

function fmt(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

export default function MiniCalendar({ selectedDate, rangeStart, rangeEnd, minDate, onSelect, onClose }: Props) {
  const today = new Date().toISOString().split('T')[0]
  const base = selectedDate || minDate || today
  const [view, setView] = useState(() => {
    const d = new Date(base)
    return { year: d.getFullYear(), month: d.getMonth() }
  })
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  const { year, month } = view
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const prev = () => {
    setView(v => v.month === 0 ? { year: v.year - 1, month: 11 } : { year: v.year, month: v.month - 1 })
  }
  const next = () => {
    setView(v => v.month === 11 ? { year: v.year + 1, month: 0 } : { year: v.year, month: v.month + 1 })
  }

  const isDisabled = (d: number) => {
    const s = fmt(year, month, d)
    return minDate ? s < minDate : s < today
  }

  const isSelected = (d: number) => fmt(year, month, d) === selectedDate

  const isInRange = (d: number) => {
    if (!rangeStart || !rangeEnd) return false
    const s = fmt(year, month, d)
    return s > rangeStart && s < rangeEnd
  }

  const isRangeStart = (d: number) => rangeStart && fmt(year, month, d) === rangeStart
  const isRangeEnd = (d: number) => rangeEnd && fmt(year, month, d) === rangeEnd

  return (
    <div
      ref={ref}
      className="bg-white shadow-2xl border border-deep-wood/10 p-4 w-72 rounded-sm select-none"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={prev} className="w-7 h-7 flex items-center justify-center hover:bg-olive/10 rounded-sm text-lg text-olive transition-colors">‹</button>
        <span className="font-serif text-sm text-deep-wood font-medium">
          {MONTHS[month]} {year}
        </span>
        <button onClick={next} className="w-7 h-7 flex items-center justify-center hover:bg-olive/10 rounded-sm text-lg text-olive transition-colors">›</button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map(d => (
          <div key={d} className="text-center text-xs text-deep-wood/30 font-medium py-1">{d}</div>
        ))}
      </div>

      {/* Cells */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const d = i + 1
          const disabled = isDisabled(d)
          const selected = isSelected(d)
          const inRange = isInRange(d)
          const rStart = isRangeStart(d)
          const rEnd = isRangeEnd(d)

          return (
            <button
              key={d}
              disabled={disabled}
              onClick={() => { if (!disabled) { onSelect(fmt(year, month, d)); onClose() } }}
              className={`h-8 w-full text-xs rounded-sm transition-colors ${
                selected || rStart || rEnd
                  ? 'bg-olive text-white font-semibold'
                  : inRange
                    ? 'bg-olive/15 text-deep-wood'
                    : disabled
                      ? 'text-deep-wood/20 cursor-not-allowed'
                      : 'text-deep-wood hover:bg-olive/10 cursor-pointer'
              }`}
            >
              {d}
            </button>
          )
        })}
      </div>
    </div>
  )
}
