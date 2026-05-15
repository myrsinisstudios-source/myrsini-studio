import BookingWidget from '@/components/booking/BookingWidget'
import { createClient } from '@/lib/supabase/server'
import WeatherWidget from '@/components/home/WeatherWidget'

export default async function Home() {
  const supabase = await createClient()
  const { data: apartments } = await supabase
    .from('apartments')
    .select('*')
    .eq('is_active', true)

  return (
    <main className="min-h-screen bg-[#F9F7F2]">
      <section className="relative h-screen flex items-center justify-center bg-[#2C1B0E]">
        <div className="text-center text-white px-4">
          <h1 className="text-5xl font-light tracking-tight mb-4">
            Myrsini Studios
          </h1>
          <p className="text-xl text-white/70 mb-2">Χόρτο Πηλίου</p>
          <a href="#apartments" className="inline-block bg-[#4a5d45] text-white px-8 py-4 text-sm uppercase tracking-widest mt-6">
            Δείτε τα Καταλύματα
          </a>
        </div>
      </section>
      <WeatherWidget />
      <section id="apartments" className="max-w-6xl mx-auto px-4 py-24">
        <h2 className="text-3xl font-light text-[#2C1B0E] mb-12 text-center">Τα Καταλύματα</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {apartments?.map((apt) => (
            <div key={apt.id} className="bg-white shadow-sm p-6">
              <h3 className="text-xl font-light text-[#2C1B0E] mb-2">{apt.name_el}</h3>
              <p className="text-sm text-gray-600 mb-4">{apt.description_el}</p>
              <p className="text-[#4a5d45] font-medium">€{apt.price_per_night} / νύχτα</p>
            </div>
          ))}
        </div>
      </section>
      <BookingWidget />
    </main>
  )
}

