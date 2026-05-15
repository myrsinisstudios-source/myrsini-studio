import HeroSection from '@/components/sections/HeroSection'
import BookingBar from '@/components/booking/BookingBar'
import WeatherWidget from '@/components/home/WeatherWidget'
import ApartmentsSection from '@/components/sections/ApartmentsSection'
import ActivitiesCarousel from '@/components/sections/ActivitiesCarousel'
import HistoryMasonry from '@/components/sections/HistoryMasonry'
import HikingMode from '@/components/sections/HikingMode'
import EmergencyGrid from '@/components/sections/EmergencyGrid'
import HeritageSlider from '@/components/home/HeritageSlider'

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
      {/* 1. Hero — full screen */}
      <HeroSection />

      {/* 2. Floating booking bar — pulled up into hero */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 -mt-32">
        <BookingBar />
      </div>

      {/* 3. Weather strip */}
      <WeatherWidget />

      {/* 4. Apartments with Room Features Grid */}
      <ApartmentsSection apartments={apartments} />

      {/* 5. Activities Carousel */}
      <ActivitiesCarousel />

      {/* 6. History Masonry */}
      <HistoryMasonry />

      {/* 7. Hiking Mode */}
      <HikingMode />

      {/* 8. Emergency Info */}
      <EmergencyGrid />

      {/* 9. Heritage photo strip */}
      <HeritageSlider />
    </main>
  )
}
