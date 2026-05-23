import { NextResponse } from 'next/server'

export const revalidate = 3600

// Horto, South Pelion — no global bbox, around: is sufficient
const LAT = 39.1003
const LON = 23.3731
const RADIUS = 15000

const QUERY = `
[out:json][timeout:20];
(
  node[amenity=restaurant](around:${RADIUS},${LAT},${LON});
  node[amenity=cafe](around:${RADIUS},${LAT},${LON});
  node[natural=beach](around:${RADIUS},${LAT},${LON});
  way[natural=beach](around:${RADIUS},${LAT},${LON});
  node[tourism=viewpoint](around:${RADIUS},${LAT},${LON});
  node[tourism=museum](around:${RADIUS},${LAT},${LON});
  node[amenity=bar](around:${RADIUS},${LAT},${LON});
  node[amenity=pub](around:${RADIUS},${LAT},${LON});
  node[shop=supermarket](around:${RADIUS},${LAT},${LON});
  node[shop=convenience](around:${RADIUS},${LAT},${LON});
);
out center 80;
`

const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
]

type OSMElement = {
  id: number
  type: string
  lat?: number
  lon?: number
  center?: { lat: number; lon: number }
  tags?: Record<string, string>
}

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

function getCategory(tags: Record<string, string>): POI['category'] | null {
  if (tags.amenity === 'restaurant') return 'restaurant'
  if (tags.amenity === 'cafe') return 'cafe'
  if (tags.natural === 'beach') return 'beach'
  if (tags.tourism === 'viewpoint') return 'viewpoint'
  if (tags.tourism === 'museum') return 'museum'
  if (tags.amenity === 'bar' || tags.amenity === 'pub') return 'bar'
  if (tags.shop === 'supermarket' || tags.shop === 'convenience') return 'supermarket'
  return null
}

async function fetchOverpass(): Promise<Response | null> {
  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `data=${encodeURIComponent(QUERY)}`,
        cache: 'no-store',
      })
      if (res.ok) return res
    } catch {}
  }
  return null
}

export async function GET() {
  try {
    const res = await fetchOverpass()
    if (!res) return NextResponse.json({ pois: [] })

    const data = await res.json()
    const elements: OSMElement[] = data.elements ?? []

    const pois: POI[] = elements
      .filter(el => el.tags?.name)
      .map(el => {
        const lat = el.lat ?? el.center?.lat ?? 0
        const lon = el.lon ?? el.center?.lon ?? 0
        const tags = el.tags ?? {}
        const category = getCategory(tags)
        if (!category) return null
        return {
          id: `${el.type}-${el.id}`,
          name: tags['name:el'] || tags.name || 'Άγνωστο',
          category,
          lat,
          lon,
          address: tags['addr:street'] ? `${tags['addr:street']} ${tags['addr:housenumber'] ?? ''}`.trim() : undefined,
          phone: tags.phone || tags['contact:phone'],
          website: tags.website || tags['contact:website'],
          opening_hours: tags.opening_hours,
        } as POI
      })
      .filter(Boolean) as POI[]

    return NextResponse.json({ pois })
  } catch {
    return NextResponse.json({ pois: [] })
  }
}
