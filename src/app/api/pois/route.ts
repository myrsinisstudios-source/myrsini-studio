import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export type POI = {
  id: string
  name_el: string
  name_en?: string
  name_de?: string
  name_fr?: string
  description_el?: string
  description_en?: string
  description_de?: string
  description_fr?: string
  category: 'restaurant' | 'cafe' | 'beach' | 'viewpoint' | 'museum' | 'bar' | 'supermarket' | 'attraction'
  google_maps_url?: string
  image_url?: string
}

export async function GET() {
  if (!SB_URL || !SB_KEY) return NextResponse.json({ pois: [] })

  try {
    const res = await fetch(
      `${SB_URL}/rest/v1/local_pois` +
      `?select=id,name_el,name_en,name_de,name_fr,description_el,description_en,description_de,description_fr,category,google_maps_url,image_url` +
      `&is_active=eq.true&order=sort_order`,
      { headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` }, cache: 'no-store' }
    )
    if (!res.ok) return NextResponse.json({ pois: [] })
    const data = await res.json()
    return NextResponse.json({ pois: Array.isArray(data) ? data : [] })
  } catch {
    return NextResponse.json({ pois: [] })
  }
}
