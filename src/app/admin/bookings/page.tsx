import { createClient } from '@/lib/supabase/server'
import BookingForm from '@/components/admin/BookingForm'

function platformCommission(channel: string, gross: number) {
  if (channel === 'airbnb')      return gross * 0.155
  if (channel === 'booking_com') return gross * 0.161
  return 0
}

const fmtEur = (n: number) =>
  new Intl.NumberFormat('el-GR', { style: 'currency', currency: 'EUR' }).format(n)

const CHANNEL_META: Record<string, { label: string; color: string; bg: string; commLabel: string }> = {
  direct:      { label: 'Απευθείας',  color: 'text-green-700',  bg: 'bg-green-50',  commLabel: '0%' },
  booking_com: { label: 'Booking.com', color: 'text-blue-700',   bg: 'bg-blue-50',   commLabel: '16.1%' },
  airbnb:      { label: 'Airbnb',      color: 'text-orange-700', bg: 'bg-orange-50', commLabel: '15.5%' },
}

export default async function BookingsPage() {
  const supabase = await createClient()

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, apartments(name_el)')
    .order('check_in', { ascending: false })

  const { data: apartments } = await supabase
    .from('apartments')
    .select('id, name_el, price_per_night')

  // Revenue analysis per channel
  const channelStats = (bookings ?? []).reduce<
    Record<string, { count: number; gross: number; commission: number; nights: number }>
  >((acc, b) => {
    const ch = (b.channel as string) || 'direct'
    if (!acc[ch]) acc[ch] = { count: 0, gross: 0, commission: 0, nights: 0 }
    const gross = Number(b.total_amount ?? 0)
    acc[ch].count++
    acc[ch].gross += gross
    acc[ch].commission += platformCommission(ch, gross)
    acc[ch].nights += Number(b.nights ?? 0)
    return acc
  }, {})

  const totalGross = Object.values(channelStats).reduce((s, c) => s + c.gross, 0)

  return (
    <div>
      <h1 className="text-2xl font-light text-[#2C1B0E] mb-8 font-serif">Κρατήσεις</h1>

      {/* Revenue analysis per channel */}
      {Object.keys(channelStats).length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-medium text-[#2C1B0E] uppercase tracking-wider mb-4">
            Ανάλυση Εσόδων ανά Κανάλι
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(Object.entries(channelStats) as [string, { count: number; gross: number; commission: number; nights: number }][]).map(([ch, stats]) => {
              const meta = CHANNEL_META[ch] ?? { label: ch, color: 'text-gray-700', bg: 'bg-gray-50', commLabel: '—' }
              const net = stats.gross - stats.commission
              const pct = totalGross > 0 ? (stats.gross / totalGross) * 100 : 0
              return (
                <div key={ch} className={`${meta.bg} p-5 border border-deep-wood/5`}>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs font-semibold uppercase tracking-wider ${meta.color}`}>
                      {meta.label}
                    </span>
                    <span className="text-xs text-gray-400">{stats.count} κρατ. · {stats.nights} νύχτες</span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Ακαθάριστο</span>
                      <span className="font-medium text-[#2C1B0E]">{fmtEur(stats.gross)}</span>
                    </div>
                    {stats.commission > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Προμήθεια {meta.commLabel}</span>
                        <span className="text-red-500">−{fmtEur(stats.commission)}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-deep-wood/8 pt-2 mt-2">
                      <span className="font-medium text-[#2C1B0E]">Καθαρό</span>
                      <span className={`font-semibold ${meta.color}`}>{fmtEur(net)}</span>
                    </div>
                  </div>

                  {/* Share bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Μερίδιο εσόδων</span>
                      <span>{pct.toFixed(0)}%</span>
                    </div>
                    <div className="h-1 bg-deep-wood/8 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#4a5d45] rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Grand total */}
          <div className="mt-4 bg-white shadow-sm p-4 flex flex-wrap gap-6 text-sm">
            <div>
              <span className="text-gray-400 text-xs uppercase tracking-wider">Σύνολο Ακαθάριστο</span>
              <p className="font-medium text-[#2C1B0E] mt-0.5">{fmtEur(totalGross)}</p>
            </div>
            <div>
              <span className="text-gray-400 text-xs uppercase tracking-wider">Σύνολο Προμηθειών</span>
              <p className="font-medium text-red-500 mt-0.5">
                −{fmtEur(Object.values(channelStats).reduce((s, c) => s + c.commission, 0))}
              </p>
            </div>
            <div>
              <span className="text-gray-400 text-xs uppercase tracking-wider">Σύνολο Καθαρό</span>
              <p className="font-medium text-[#4a5d45] mt-0.5">
                {fmtEur(Object.values(channelStats).reduce((s, c) => s + c.gross - c.commission, 0))}
              </p>
            </div>
            <div>
              <span className="text-gray-400 text-xs uppercase tracking-wider">Σύνολο Κρατήσεων</span>
              <p className="font-medium text-[#2C1B0E] mt-0.5">
                {Object.values(channelStats).reduce((s, c) => s + c.count, 0)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bookings list + form */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white shadow-sm p-6">
            <h2 className="font-medium text-[#2C1B0E] mb-6">Όλες οι Κρατήσεις</h2>
            {(bookings ?? []).length === 0 && (
              <p className="text-sm text-gray-500 py-4">Δεν υπάρχουν κρατήσεις ακόμα</p>
            )}
            <div className="space-y-3">
              {(bookings ?? []).map(b => (
                <div key={b.id} className="p-4 border border-gray-100 hover:border-gray-200 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-[#2C1B0E]">{b.guest_name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{b.apartments?.name_el}</p>
                      <p className="text-xs text-gray-500">
                        {b.check_in} → {b.check_out}
                        {b.nights ? ` · ${b.nights} νύχτες` : ''}
                        {b.num_guests ? ` · ${b.num_guests} άτομα` : ''}
                      </p>
                      {b.notes && <p className="text-xs text-gray-400 mt-1 italic">{b.notes}</p>}
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <p className="font-medium text-[#4a5d45]">{fmtEur(Number(b.total_amount ?? 0))}</p>
                      {(() => {
                        const ch = (b.channel as string) || 'direct'
                        const meta = CHANNEL_META[ch]
                        return (
                          <span className={`text-xs px-2 py-0.5 mt-1 inline-block rounded-full ${meta?.bg} ${meta?.color}`}>
                            {meta?.label ?? ch}
                          </span>
                        )
                      })()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <BookingForm apartments={apartments ?? []} />
        </div>
      </div>
    </div>
  )
}
