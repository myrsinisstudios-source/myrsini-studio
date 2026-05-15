import HeroSection from '@/components/sections/HeroSection'
import BookingBar from '@/components/booking/BookingBar'
import ApartmentsSection from '@/components/sections/ApartmentsSection'
import ActivitiesCarousel from '@/components/sections/ActivitiesCarousel'
import HistoryMasonry from '@/components/sections/HistoryMasonry'
import HikingMode from '@/components/sections/HikingMode'
import EmergencyGrid from '@/components/sections/EmergencyGrid'

async function getApartments() {
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data } = await supabase
      .from('apartments')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
    return data || []
  } catch {
    return []
  }
}

export default async function Home() {
  const apartments = await getApartments()

  return (
    <main>
      {/* Hero — full screen */}
      <HeroSection />

      {/* Floating booking bar — pulled up into hero with negative margin */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 -mt-32">
        <BookingBar />
      </div>

      {/* Apartments — padding compensates for booking bar overlap */}
      <ApartmentsSection apartments={apartments} />

      {/* Activities */}
      <ActivitiesCarousel />

      {/* History */}
      <HistoryMasonry />

      {/* Hiking */}
      <HikingMode />

      {/* Emergency */}
      <EmergencyGrid />
    </main>
  )
}
