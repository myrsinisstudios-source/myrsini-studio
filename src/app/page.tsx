import HeroSection from '@/components/sections/HeroSection'
import BookingBar from '@/components/booking/BookingBar'
import WeatherWidget from '@/components/home/WeatherWidget'
import ApartmentsSection from '@/components/sections/ApartmentsSection'
import CircularCarousel from '@/components/sections/CircularCarousel'
import HistoryMasonry from '@/components/sections/HistoryMasonry'
import HikingMode from '@/components/sections/HikingMode'
import EmergencyGrid from '@/components/sections/EmergencyGrid'
import HeritageSlider from '@/components/home/HeritageSlider'

async function getData() {
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const [aptsRes, actsRes] = await Promise.all([
      supabase.from('apartments').select('id, slug, name_el, name_en, description_el, description_en, price_per_night, max_guests, sqm, bedrooms, bathrooms, amenities, is_active, image_url, gallery').eq('is_active', true).order('sort_order'),
      supabase.from('activities').select('*').order('sort_order'),
    ])
    return { apartments: aptsRes.data || [], activities: actsRes.data || [] }
  } catch {
    return { apartments: [], activities: [] }
  }
}

export default async function Home() {
  const { apartments, activities } = await getData()

  return (
    <main>
      <HeroSection />
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 -mt-32">
        <BookingBar />
      </div>
      <WeatherWidget />
      <ApartmentsSection apartments={apartments} />
      <CircularCarousel activities={activities} />
      <HistoryMasonry />
      <HikingMode />
      <EmergencyGrid />
      <HeritageSlider />
    </main>
  )
}
