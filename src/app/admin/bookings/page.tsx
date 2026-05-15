import { createClient } from '@/lib/supabase/server'
import BookingForm from '@/components/admin/BookingForm'

export default async function BookingsPage() {
  const supabase = await createClient()

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, apartments(name_el)')
    .order('check_in', { ascending: false })

  const { data: apartments } = await supabase
    .from('apartments')
    .select('id, name_el, price_per_night')

  return (
    <div>
      <h1 className="text-2xl font-light text-[#2C1B0E] mb-8">Κρατήσεις</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white shadow-sm p-6">
            <h2 className="font-medium text-[#2C1B0E] mb-6">Όλες οι Κρατήσεις</h2>
            {bookings?.length === 0 && (
              <p className="text-sm text-gray-600">Δεν υπάρχουν κρατήσεις ακόμα</p>
            )}
            <div className="space-y-3">
              {bookings?.map((b) => (
                <div key={b.id} className="p-4 border border-gray-100 hover:border-gray-200 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-[#2C1B0E]">{b.guest_name}</p>
                      <p className="text-xs text-gray-700 mt-1">{b.apartments?.name_el}</p>
                      <p className="text-xs text-gray-700">{b.check_in} → {b.check_out} · {b.nights} νύχτες · {b.num_guests} άτομα</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-[#4a5d45]">€{b.total_amount}</p>
                      <span className={`text-xs px-2 py-1 mt-1 inline-block rounded-full ${
                        b.channel === 'direct' ? 'bg-green-100 text-green-700' :
                        b.channel === 'booking_com' ? 'bg-blue-100 text-blue-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {b.channel === 'direct' ? 'Απευθείας' :
                         b.channel === 'booking_com' ? 'Booking.com' : 'Airbnb'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <BookingForm apartments={apartments || []} />
        </div>
      </div>
    </div>
  )
}