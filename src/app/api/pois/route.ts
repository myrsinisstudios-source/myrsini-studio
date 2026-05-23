import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export type POI = {
  id: string
  name: string
  category: 'restaurant' | 'cafe' | 'beach' | 'viewpoint' | 'museum' | 'bar' | 'supermarket'
  lat: number
  lon: number
  address?: string
  phone?: string
  website?: string
  opening_hours?: string
}

export async function GET() {
  if (!SB_URL || !SB_KEY) return NextResponse.json({ pois: [] })

  try {
    const res = await fetch(
      `${SB_URL}/rest/v1/local_pois?select=id,name,category,lat,lon,address,phone,website,opening_hours&active=eq.true&order=sort_order`,
      { headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` }, cache: 'no-store' }
    )
    if (!res.ok) return NextResponse.json({ pois: [] })
    const data = await res.json()
    return NextResponse.json({ pois: Array.isArray(data) ? data : [] })
  } catch {
    return NextResponse.json({ pois: [] })
  }
}
