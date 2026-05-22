import { NextResponse } from 'next/server'

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const ORIGINS = [
  '39.219,22.794',  // Nea Anchialos Airport
  '39.361,22.944',  // Volos Port
]
const DESTINATION = '39.0994,23.3694' // Χόρτο

const FALLBACK = {
  airport: { min: 90, km: 90 },
  port:    { min: 60, km: 46 },
}

export async function GET() {
  // 1. Settings table (admin-managed, highest priority)
  if (SB_URL && SB_KEY) {
    try {
      const res = await fetch(
        `${SB_URL}/rest/v1/settings?id=eq.1&limit=1&select=distance_airport_min,distance_airport_km,distance_port_min,distance_port_km`,
        { headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` }, cache: 'no-store' }
      )
      if (res.ok) {
        const data = await res.json()
        const s = data[0]
        if (s?.distance_airport_min && s?.distance_airport_km && s?.distance_port_min && s?.distance_port_km) {
          return NextResponse.json({
            airport: { min: s.distance_airport_min, km: s.distance_airport_km },
            port:    { min: s.distance_port_min,    km: s.distance_port_km },
          })
        }
      }
    } catch {}
  }

  // 2. Google Maps live data (returns numeric values)
  const key = process.env.GOOGLE_MAPS_API_KEY
  if (!key) return NextResponse.json(FALLBACK)

  try {
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${ORIGINS.join('|')}&destinations=${DESTINATION}&mode=driving&key=${key}`
    const res = await fetch(url, { next: { revalidate: 86400 } })
    const json = await res.json()
    if (json.status !== 'OK') return NextResponse.json(FALLBACK)

    const rows = json.rows as { elements: { status: string; duration: { value: number }; distance: { value: number } }[] }[]
    const airportEl = rows[0]?.elements[0]
    const portEl    = rows[1]?.elements[0]
    if (airportEl?.status !== 'OK' || portEl?.status !== 'OK') return NextResponse.json(FALLBACK)

    return NextResponse.json({
      airport: { min: Math.round(airportEl.duration.value / 60), km: Math.round(airportEl.distance.value / 1000) },
      port:    { min: Math.round(portEl.duration.value / 60),    km: Math.round(portEl.distance.value / 1000) },
    })
  } catch {
    return NextResponse.json(FALLBACK)
  }
}
