export const dynamic = 'force-dynamic'

import HeroSection from '@/components/sections/HeroSection'
import BookingBar from '@/components/booking/BookingBar'
import WeatherWidget from '@/components/home/WeatherWidget'
import ApartmentsSection from '@/components/sections/ApartmentsSection'
import CircularCarousel from '@/components/sections/CircularCarousel'
import HistoryMasonry from '@/components/sections/HistoryMasonry'
import HikingMode from '@/components/sections/HikingMode'
import EmergencyGrid from '@/components/sections/EmergencyGrid'
import HeritageSlider from '@/components/home/HeritageSlider'

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

async function sbFetch(path: string) {
  if (!SB_URL || !SB_KEY) return []
  const res = await fetch(`${SB_URL}/rest/v1/${path}`, {
    headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` },
    cache: 'no-store',
  })
  if (!res.ok) return []
  const data = await res.json()
  return Array.isArray(data) ? data : []
}

async function getData() {
  const [apartments, activities] = await Promise.allSettled([
    sbFetch('apartments?select=id,slug,name_el,name_en,description_el,description_en,price_per_night,max_guests,sqm,area_sqm,bedrooms,bathrooms,amenities,is_active,image_url,images,gallery&is_active=eq.true&order=created_at'),
    sbFetch('activities?select=*&order=sort_order'),
  ])
  return {
    apartments: apartments.status === 'fulfilled' ? apartments.value : [],
    activities: activities.status === 'fulfilled' ? activities.value : [],
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
