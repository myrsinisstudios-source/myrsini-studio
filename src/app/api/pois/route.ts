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

// Static fallback — known venues in Horto / South Pelion
const STATIC_POIS: POI[] = [
  { id: 's-1', name: 'Ταβέρνα Κύμα', category: 'restaurant', lat: 39.1010, lon: 23.3735, opening_hours: 'Mo-Su 12:00-24:00' },
  { id: 's-2', name: 'Καφενείο Χόρτου', category: 'cafe', lat: 39.1005, lon: 23.3728 },
  { id: 's-3', name: 'Ταβέρνα Η Αυλή', category: 'restaurant', lat: 39.0950, lon: 23.3620 },
  { id: 's-4', name: 'Café Μηλίνα', category: 'cafe', lat: 39.0905, lon: 23.3520 },
  { id: 's-5', name: 'Παραλία Χόρτου', category: 'beach', lat: 39.1015, lon: 23.3740 },
  { id: 's-6', name: 'Παραλία Μαραθιάς', category: 'beach', lat: 39.0870, lon: 23.3490 },
  { id: 's-7', name: 'Παραλία Μηλίνας', category: 'beach', lat: 39.0900, lon: 23.3510 },
  { id: 's-8', name: 'Σούπερ Μάρκετ Χόρτο', category: 'supermarket', lat: 39.1008, lon: 23.3722 },
  { id: 's-9', name: 'Θέα Παγασητικού', category: 'viewpoint', lat: 39.1050, lon: 23.3680 },
  { id: 's-10', name: 'Ταβέρνα Αργαλαστή', category: 'restaurant', lat: 39.1540, lon: 23.2150 },
  { id: 's-11', name: 'Bar Horto', category: 'bar', lat: 39.1012, lon: 23.3730 },
]

export async function GET() {
  try {
    const res = await fetchOverpass()
    if (!res) return NextResponse.json({ pois: STATIC_POIS })

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

    return NextResponse.json({ pois: pois.length > 0 ? pois : STATIC_POIS })
  } catch {
    return NextResponse.json({ pois: STATIC_POIS })
  }
}
