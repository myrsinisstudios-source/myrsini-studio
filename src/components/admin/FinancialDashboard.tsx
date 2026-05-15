'use client'

import { useState, useMemo } from 'react'

type Booking = Record<string, unknown>
type Expense = Record<string, unknown>

const RESILIENCE_HIGH = 8   // Mar–Oct
const RESILIENCE_LOW  = 2   // Nov–Feb

function resilienceTaxForBooking(checkIn: string, nights: number): number {
  const month = new Date(checkIn).getMonth() + 1 // 1–12
  const rate = month >= 3 && month <= 10 ? RESILIENCE_HIGH : RESILIENCE_LOW
  return rate * nights
}

function platformCommission(channel: string, gross: number): number {
  if (channel === 'airbnb')      return gross * 0.155
  if (channel === 'booking_com') return gross * 0.161  // 15% + 1.1%
  return 0
}

function calcTax(annualGross: number): { t1: number; t2: number; t3: number; total: number } {
  const bracket1 = Math.min(annualGross, 12000)
  const bracket2 = Math.max(0, Math.min(annualGross - 12000, 23000))
  const bracket3 = Math.max(0, annualGross - 35000)
  const t1 = bracket1 * 0.15
  const t2 = bracket2 * 0.35
  const t3 = bracket3 * 0.45
  return { t1, t2, t3, total: t1 + t2 + t3 }
}

const fmtEur = (n: number) =>
  new Intl.NumberFormat('el-GR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 }).format(n)

export default function FinancialDashboard({ bookings, expenses }: { bookings: Booking[]; expenses: Expense[] }) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [bankFeePct, setBankFeePct] = useState(1.5)
  const [bankFeeFixed, setBankFeeFixed] = useState(0.3)

  const years = useMemo(() => {
    const ys = new Set<number>()
    bookings.forEach(b => { if (b.check_in) ys.add(new Date(b.check_in as string).getFullYear()) })
    if (ys.size === 0) ys.add(new Date().getFullYear())
    return Array.from(ys).sort((a, b) => b - a)
  }, [bookings])

  const filtered = useMemo(
    () => bookings.filter(b => b.check_in && new Date(b.check_in as string).getFullYear() === selectedYear),
    [bookings, selectedYear],
  )

  const totals = useMemo(() => {
    let gross = 0, commission = 0, bankFees = 0, resilience = 0

    filtered.forEach(b => {
      const g     = Number(b.total_amount ?? 0)
      const n     = Number(b.nights ?? 0)
      const ci    = String(b.check_in ?? '')
      const ch    = String(b.channel ?? 'direct')

      gross      += g
      commission += platformCommission(ch, g)
      bankFees   += ch === 'direct' ? g * (bankFeePct / 100) + bankFeeFixed : 0
      resilience += ci ? resilienceTaxForBooking(ci, n) : 0
    })

    const opCosts   = expenses
      .filter(e => e.expense_date && new Date(e.expense_date as string).getFullYear() === selectedYear)
      .reduce((acc, e) => acc + Number(e.amount ?? 0), 0)

    const netIncome = gross - commission - bankFees - opCosts
    const tax       = calcTax(gross)

    return { gross, commission, bankFees, resilience, opCosts, netIncome, tax }
  }, [filtered, expenses, selectedYear, bankFeePct, bankFeeFixed])

  const SUMMARY_CARDS = [
    { label: 'Ακαθάριστο Ποσό', value: fmtEur(totals.gross), color: 'text-deep-wood', bg: 'bg-cream', icon: '💰' },
    { label: 'Προμήθεια Πλατφόρμας', value: fmtEur(totals.commission), color: 'text-red-600', bg: 'bg-red-50', icon: '🔄' },
    { label: 'Τραπεζικά Έξοδα', value: fmtEur(totals.bankFees), color: 'text-orange-600', bg: 'bg-orange-50', icon: '🏦' },
    { label: 'Λειτουργικά Έξοδα', value: fmtEur(totals.opCosts), color: 'text-amber-700', bg: 'bg-amber-50', icon: '🔧' },
    { label: 'Καθαρή Είσπραξη', value: fmtEur(totals.netIncome), color: 'text-olive', bg: 'bg-olive/10', icon: '✅' },
    { label: 'Πρόβλεψη Φόρου', value: fmtEur(totals.tax.total), color: 'text-purple-700', bg: 'bg-purple-50', icon: '📊' },
    { label: 'Τέλος Ανθεκτικότητας', value: fmtEur(totals.resilience), color: 'text-blue-700', bg: 'bg-blue-50', icon: '🏛️' },
    { label: 'Τελικό Καθαρό', value: fmtEur(totals.netIncome - totals.tax.total - totals.resilience), color: 'text-green-700', bg: 'bg-green-50', icon: '🎯' },
  ]

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="bg-white shadow-sm p-6 flex flex-wrap items-center gap-6">
        <div>
          <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Έτος</label>
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(Number(e.target.value))}
            className="border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-olive"
          >
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Τρ. Έξοδο %</label>
          <input
            type="number"
            step="0.1"
            value={bankFeePct}
            onChange={e => setBankFeePct(Number(e.target.value))}
            className="border border-gray-200 px-3 py-2 text-sm w-24 focus:outline-none focus:border-olive"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Τρ. Πάγιο (€)</label>
          <input
            type="number"
            step="0.1"
            value={bankFeeFixed}
            onChange={e => setBankFeeFixed(Number(e.target.value))}
            className="border border-gray-200 px-3 py-2 text-sm w-24 focus:outline-none focus:border-olive"
          />
        </div>
        <div className="text-xs text-gray-400 ml-auto">
          {filtered.length} κρατήσεις
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {SUMMARY_CARDS.map(c => (
          <div key={c.label} className={`${c.bg} p-5 border border-deep-wood/5`}>
            <div className="flex items-center gap-2 mb-2">
              <span>{c.icon}</span>
              <p className="text-xs text-gray-500 uppercase tracking-wider leading-tight">{c.label}</p>
            </div>
            <p className={`text-xl font-medium ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Tax breakdown */}
      <div className="bg-white shadow-sm p-6">
        <h3 className="font-medium text-deep-wood mb-4">Ανάλυση Φόρου (επί ακαθάριστου)</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">15% επί €0 – €12.000</span>
            <span className="font-medium text-deep-wood">{fmtEur(totals.tax.t1)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">35% επί €12.001 – €35.000</span>
            <span className="font-medium text-deep-wood">{fmtEur(totals.tax.t2)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">45% επί €35.001+</span>
            <span className="font-medium text-deep-wood">{fmtEur(totals.tax.t3)}</span>
          </div>
          <div className="flex justify-between py-2 bg-purple-50 px-3 font-medium">
            <span className="text-purple-700">Σύνολο Φόρου</span>
            <span className="text-purple-700">{fmtEur(totals.tax.total)}</span>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          * Τέλος Ανθεκτικότητας: €8/νύχτα Μάρ–Οκτ, €2/νύχτα Νοε–Φεβ
        </p>
      </div>

      {/* Per-booking table */}
      <div className="bg-white shadow-sm p-6">
        <h3 className="font-medium text-deep-wood mb-4">Ανά Κράτηση — {selectedYear}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs text-gray-400 uppercase tracking-wider">
                <th className="text-left py-3 pr-4">Επισκέπτης</th>
                <th className="text-left py-3 pr-4">Κατάλυμα</th>
                <th className="text-left py-3 pr-4">Ημερ.</th>
                <th className="text-right py-3 pr-4">Ακαθ.</th>
                <th className="text-right py-3 pr-4">Προμ.</th>
                <th className="text-right py-3 pr-4">Τέλος</th>
                <th className="text-right py-3">Καθαρό</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center text-gray-400 py-8">Δεν υπάρχουν κρατήσεις</td></tr>
              ) : (
                filtered.map(b => {
                  const g   = Number(b.total_amount ?? 0)
                  const n   = Number(b.nights ?? 0)
                  const ci  = String(b.check_in ?? '')
                  const ch  = String(b.channel ?? 'direct')
                  const com = platformCommission(ch, g)
                  const res = ci ? resilienceTaxForBooking(ci, n) : 0
                  const net = g - com - res

                  return (
                    <tr key={b.id as string} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="py-3 pr-4 font-medium text-deep-wood">{b.guest_name as string}</td>
                      <td className="py-3 pr-4 text-gray-500">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          ch === 'direct' ? 'bg-green-100 text-green-700' :
                          ch === 'booking_com' ? 'bg-blue-100 text-blue-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {ch === 'direct' ? 'Απ.' : ch === 'booking_com' ? 'Bkg' : 'Airbnb'}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-gray-500 text-xs">{ci} · {n}ν</td>
                      <td className="py-3 pr-4 text-right text-deep-wood">{fmtEur(g)}</td>
                      <td className="py-3 pr-4 text-right text-red-500">
                        {com > 0 ? `-${fmtEur(com)}` : '—'}
                      </td>
                      <td className="py-3 pr-4 text-right text-blue-600">-{fmtEur(res)}</td>
                      <td className="py-3 text-right font-medium text-olive">{fmtEur(net)}</td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
