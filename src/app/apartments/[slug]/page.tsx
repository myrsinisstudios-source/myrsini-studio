export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import ApartmentContent from '@/components/apartments/ApartmentContent'

export type ApartmentData = {
  id: string
  slug: string
  name_el: string
  name_en?: string | null
  description_el?: string | null
  description_en?: string | null
  price_per_night: number
  max_guests?: number | null
  sqm?: number | null
  area_sqm?: number | null
  bedrooms?: number | null
  bathrooms?: number | null
  amenities?: string[] | null
  image_url?: string | null
  images?: string[] | null
  gallery?: string[] | null
}

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export default async function ApartmentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  if (!SB_URL || !SB_KEY) notFound()

  const res = await fetch(
    `${SB_URL}/rest/v1/apartments?select=id,slug,name_el,name_en,description_el,description_en,price_per_night,max_guests,sqm,area_sqm,bedrooms,bathrooms,amenities,image_url,images,gallery&slug=eq.${encodeURIComponent(slug)}&limit=1`,
    { headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` }, cache: 'no-store' }
  )

  const rows: ApartmentData[] = res.ok ? await res.json() : []
  const apartment = rows[0] ?? null

  if (!apartment) notFound()

  return <ApartmentContent apartment={apartment} />
}
