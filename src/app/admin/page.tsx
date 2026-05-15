import GanttCalendar, { GanttBooking } from '@/components/admin/GanttCalendar'
import DonutChart from '@/components/admin/DonutChart'

// ─── Fallback mock data (matches mockup) ──────────────────────────────────────

const MOCK_BOOKINGS: GanttBooking[] = [
  { id: '1', guest_name: 'Narmas Kamen',    apartment_name: 'Studio A', channel: 'airbnb',      check_in: '2025-07-15', check_out: '2025-07-22', total_amount: 980 },
  { id: '2', guest_name: 'Acanaia Proka',   apartment_name: 'Studio A', channel: 'website',     check_in: '2025-07-25', check_out: '2025-07-30', total_amount: 625 },
  { id: '3', guest_name: 'Larvina Coshssa', apartment_name: 'Studio B', channel: 'airbnb',      check_in: '2025-07-22', check_out: '2025-07-30', total_amount: 680 },
  { id: '4', guest_name: 'Booking Guest',   apartment_name: 'Studio B', channel: 'booking_com', check_in: '2025-08-02', check_out: '2025-08-05', total_amount: 420 },
]

const CHANNEL_BADGE: Record<string, string> = {
  airbnb:      'bg-orange-100 text-orange-700',
  booking_com: 'bg-blue-100 text-blue-700',
  website:     'bg-green-100 text-green-700',
  direct:      'bg-green-100 text-green-700',
}
const CHANNEL_LABEL: Record<string, string> = {
  airbnb: 'Airbnb', booking_com: 'Booking.com', website: 'Website', direct: 'Άμεση'
}

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

const AVATAR_COLORS = ['#C9A96E','#4a7c59','#3B82F6','#F97316','#8B6914']

// ─── Server component ─────────────────────────────────────────────────────────

export default async function AdminDashboard() {
  let bookings: GanttBooking[] = MOCK_BOOKINGS
  let apartments: string[] = ['Studio A', 'Studio B']

  let kpiBookings = 8
  let kpiProfit = 48500
  let kpiOccupancy = 92

  let donutData = [
    { label: 'Airbnb',       value: 55, color: '#F97316' },
    { label: 'Website',      value: 25, color: '#4a7c59' },
    { label: 'Booking.com',  value: 20, color: '#3B82F6' },
  ]

  let grossRevenue = 8000
  let commission   = 800
  let expenses     = 200
  let netProfit    = 7000

  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    const now = new Date()
    const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`

    const [bRes, aRes] = await Promise.all([
      supabase.from('bookings').select('*, apartments(name_el)').order('check_in', { ascending: false }),
      supabase.from('apartments').select('id, name_el').eq('is_active', true).order('sort_order'),
    ])

    if (bRes.data && bRes.data.length > 0) {
      bookings = (bRes.data as any[]).map(b => ({
        id: b.id,
        guest_name: b.guest_name,
        apartment_name: b.apartments?.name_el ?? b.apartment_id ?? 'Studio A',
        channel: b.channel ?? 'direct',
        check_in: b.check_in,
        check_out: b.check_out,
        total_amount: b.total_amount ?? 0,
      }))

      // KPI: bookings this month
      kpiBookings = bookings.filter(b => b.check_in >= monthStart).length || kpiBookings

      // Revenue by channel
      const rev = { airbnb: 0, booking_com: 0, website: 0, direct: 0 }
      let total = 0
      bookings.forEach(b => {
        const ch = b.channel in rev ? b.channel as keyof typeof rev : 'direct'
        rev[ch] += b.total_amount
        total += b.total_amount
      })
      if (total > 0) {
        donutData = [
          { label: 'Airbnb',      value: Math.round((rev.airbnb / total) * 100),      color: '#F97316' },
          { label: 'Website',     value: Math.round(((rev.website + rev.direct) / total) * 100), color: '#4a7c59' },
          { label: 'Booking.com', value: Math.round((rev.booking_com / total) * 100), color: '#3B82F6' },
        ]
        grossRevenue = total
        commission = Math.round(rev.airbnb * 0.155 + rev.booking_com * 0.161)
        netProfit = grossRevenue - commission - expenses
        kpiProfit = netProfit
      }
    }

    if (aRes.data && aRes.data.length > 0) {
      apartments = aRes.data.map((a: any) => a.name_el)
    }
  } catch {
    // use fallback data
  }

  const recentBookings = bookings.slice(0, 6)

  return (
    <div className="space-y-5">
      {/* Title */}
      <div>
        <h1 className="font-serif text-2xl font-light" style={{ color: '#2C1B0E' }}>
          Κέντρο Ελέγχου Myrsini Studios
        </h1>
      </div>

      {/* ── Main grid: 3 columns ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">

        {/* ── Left (col 1-2) ──────────────────────────────────────────────────── */}
        <div className="col-span-2 space-y-4">

          {/* KPI Cards */}
          <div>
            <p className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: '#8B7355' }}>KPI Cards</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Κρατήσεις (Ιούλιος)', value: String(kpiBookings), sub: 'ενεργές κρατήσεις' },
                { label: 'Καθαρό Κέρδος (Έτος)', value: `€${kpiProfit.toLocaleString()}`, sub: 'net profit YTD' },
                { label: 'Πληρότητα (Χόρτο)', value: `${kpiOccupancy}%`, sub: 'occupancy rate' },
              ].map(card => (
                <div key={card.label} className="rounded-xl p-5 bg-white" style={{ border: '1px solid #E8E0D0' }}>
                  <p className="text-xs mb-3 leading-tight" style={{ color: '#8B7355' }}>{card.label}</p>
                  <p className="font-serif text-3xl font-light" style={{ color: '#2C1B0E' }}>{card.value}</p>
                  <p className="text-[10px] mt-1" style={{ color: '#B0A090' }}>{card.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Live Calendar */}
          <GanttCalendar bookings={bookings} apartments={apartments} />

          {/* Recent Bookings (bottom left) */}
          <div className="rounded-xl bg-white p-5" style={{ border: '1px solid #E8E0D0' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold" style={{ color: '#2C1B0E' }}>Recent Bookings</h3>
              <a href="/admin/bookings" className="text-xs hover:opacity-70 transition-opacity" style={{ color: '#C9A96E' }}>Όλες →</a>
            </div>
            <div className="space-y-3">
              {recentBookings.map((b, i) => (
                <div key={b.id} className="flex items-center gap-3 py-2.5 px-1" style={{ borderBottom: '1px solid #F5F0E8' }}>
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0"
                    style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                  >
                    {initials(b.guest_name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: '#2C1B0E' }}>{b.guest_name}</p>
                    <p className="text-xs" style={{ color: '#A09080' }}>{b.apartment_name}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${CHANNEL_BADGE[b.channel] ?? 'bg-gray-100 text-gray-600'}`}>
                      {CHANNEL_LABEL[b.channel] ?? b.channel}
                    </span>
                    <p className="text-[10px] mt-1" style={{ color: '#A09080' }}>
                      {b.check_in.slice(5).replace('-', '/')} → {b.check_out.slice(5).replace('-', '/')}
                    </p>
                  </div>
                </div>
              ))}
              {recentBookings.length === 0 && (
                <p className="text-sm text-center py-4" style={{ color: '#A09080' }}>Δεν υπάρχουν κρατήσεις</p>
              )}
            </div>
          </div>
        </div>

        {/* ── Right (col 3) ────────────────────────────────────────────────────── */}
        <div className="space-y-4">

          {/* Financial Overview */}
          <div className="rounded-xl bg-white p-5" style={{ border: '1px solid #E8E0D0' }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: '#2C1B0E' }}>Financial Overview</h3>

            {/* Donut */}
            <div className="mb-5">
              <p className="text-[10px] uppercase tracking-wider mb-3 font-medium" style={{ color: '#8B7355' }}>Έσοδα ανά Πηγή</p>
              <DonutChart segments={donutData} centerLabel={`€${Math.round(grossRevenue / 1000)}k`} />
            </div>

            {/* Net Profit Calculator */}
            <div className="rounded-lg p-4" style={{ background: '#F9F6F1' }}>
              <p className="text-xs font-semibold mb-3" style={{ color: '#2C1B0E' }}>Net Profit Calculator</p>
              <div className="space-y-2">
                {[
                  { label: 'Συνολικά Έσοδα', value: `€${grossRevenue.toLocaleString()}`, bold: false },
                  { label: 'Προμήθεια',       value: `-€${commission.toLocaleString()}`,  bold: false },
                  { label: 'Έξοδα',           value: `-€${expenses.toLocaleString()}`,    bold: false },
                ].map(row => (
                  <div key={row.label} className="flex justify-between text-xs">
                    <span style={{ color: '#8B7355' }}>{row.label}</span>
                    <span style={{ color: '#2C1B0E' }}>{row.value}</span>
                  </div>
                ))}
                <div className="pt-2 mt-1 flex justify-between text-sm font-semibold" style={{ borderTop: '1px solid #E8E0D0' }}>
                  <span style={{ color: '#2C1B0E' }}>Καθαρό Κέρδος</span>
                  <span style={{ color: '#4a7c59' }}>€{netProfit.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Έξυπνες Λειτουργίες */}
          <div className="rounded-xl bg-white p-5" style={{ border: '1px solid #E8E0D0' }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: '#2C1B0E' }}>Έξυπνες Λειτουργίες</h3>
            <div className="space-y-3">
              {/* Weather (static) */}
              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: '#FFFBF2' }}>
                <span className="text-2xl">☀️</span>
                <div>
                  <p className="text-xs font-medium" style={{ color: '#2C1B0E' }}>Sunny, 28°C</p>
                  <p className="text-[10px]" style={{ color: '#A09080' }}>κόρνο</p>
                </div>
              </div>
              {/* Travel time (static) */}
              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: '#F5F8FF' }}>
                <span className="text-xl">📍</span>
                <div>
                  <p className="text-xs font-medium leading-snug" style={{ color: '#2C1B0E' }}>Volos Port → Myrsini</p>
                  <p className="text-xs font-semibold" style={{ color: '#3B82F6' }}>1h 30m</p>
                  <p className="text-[10px]" style={{ color: '#A09080' }}>Traffic: Light</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Bookings compact (right) */}
          <div className="rounded-xl bg-white p-5" style={{ border: '1px solid #E8E0D0' }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold" style={{ color: '#2C1B0E' }}>Recent Bookings</h3>
              <button className="text-xs" style={{ color: '#A09080' }}>•••</button>
            </div>
            <div className="space-y-2.5">
              {recentBookings.slice(0, 3).map((b, i) => (
                <div key={b.id} className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-semibold shrink-0"
                    style={{ background: AVATAR_COLORS[(i + 2) % AVATAR_COLORS.length] }}
                  >
                    {initials(b.guest_name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate" style={{ color: '#2C1B0E' }}>{b.guest_name}</p>
                    <p className="text-[10px] truncate" style={{ color: '#A09080' }}>
                      {CHANNEL_LABEL[b.channel] ?? b.channel} {b.apartment_name}
                    </p>
                  </div>
                  <button className="text-xs" style={{ color: '#C8C0B8' }}>•••</button>
                </div>
              ))}
              {/* Pending notice */}
              <div className="flex items-center gap-2.5 pt-1" style={{ borderTop: '1px solid #F5F0E8' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: '#F5F0E8' }}>
                  <span className="text-sm">📋</span>
                </div>
                <p className="text-xs leading-tight" style={{ color: '#8B7355' }}>
                  <span className="font-medium">Guest Welcome Guides:</span><br />
                  3 pending delivery
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
