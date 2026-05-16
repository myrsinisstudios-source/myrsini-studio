import { NextResponse } from 'next/server'

const ORIGINS = [
  '39.219,22.794',  // Nea Anchialos Airport
  '39.361,22.944',  // Volos Port
]
const DESTINATION = '39.0994,23.3694' // Χόρτο

const FALLBACK = {
  airport: { duration: '58 λεπτά', distance: '54 χλμ' },
  port:    { duration: '42 λεπτά', distance: '37 χλμ' },
}

export async function GET() {
  const key = process.env.GOOGLE_MAPS_API_KEY
  if (!key) return NextResponse.json(FALLBACK)

  try {
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${ORIGINS.join('|')}&destinations=${DESTINATION}&mode=driving&language=el&key=${key}`
    const res = await fetch(url, { next: { revalidate: 86400 } })
    const json = await res.json()

    if (json.status !== 'OK') return NextResponse.json(FALLBACK)

    const rows = json.rows as { elements: { status: string; duration: { text: string }; distance: { text: string } }[] }[]
    const airportEl = rows[0]?.elements[0]
    const portEl    = rows[1]?.elements[0]

    if (airportEl?.status !== 'OK' || portEl?.status !== 'OK') return NextResponse.json(FALLBACK)

    return NextResponse.json({
      airport: { duration: airportEl.duration.text, distance: airportEl.distance.text },
      port:    { duration: portEl.duration.text,    distance: portEl.distance.text },
    })
  } catch {
    return NextResponse.json(FALLBACK)
  }
}
