'use client'
import 'leaflet/dist/leaflet.css'
import { useEffect, useRef, useState } from 'react'
import type L from 'leaflet'

type GpxPoint = { lat: number; lng: number; ele?: number }

async function parseGpx(url: string): Promise<GpxPoint[]> {
  try {
    const res = await fetch(url)
    const xml = await res.text()
    const doc = new DOMParser().parseFromString(xml, 'text/xml')
    const pts = Array.from(doc.querySelectorAll('trkpt'))
    return pts.map(p => ({
      lat: parseFloat(p.getAttribute('lat') ?? ''),
      lng: parseFloat(p.getAttribute('lon') ?? ''),
      ele: p.querySelector('ele') ? parseFloat(p.querySelector('ele')!.textContent ?? '') : undefined,
    })).filter(p => Number.isFinite(p.lat) && Number.isFinite(p.lng))
  } catch { return [] }
}

function ElevationChart({ points }: { points: GpxPoint[] }) {
  const withEle = points.filter(p => p.ele != null && Number.isFinite(p.ele))
  if (withEle.length < 10) return null
  const eles = withEle.map(p => p.ele!)
  const min = Math.min(...eles), max = Math.max(...eles)
  if (max - min < 10) return null
  const W = 500, H = 46
  const d = withEle.map((p, i) => {
    const x = (i / (withEle.length - 1)) * W
    const y = H - ((p.ele! - min) / (max - min)) * H
    return `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`
  }).join('')
  return (
    <div className="border-t border-deep-wood/8 bg-cream/40 px-4 py-2">
      <p className="text-[9px] uppercase tracking-widest text-deep-wood/35 mb-1">Υψομετρικό Προφίλ</p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 46 }} preserveAspectRatio="none">
        <defs>
          <linearGradient id="eleGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4a7c59" stopOpacity=".3" />
            <stop offset="100%" stopColor="#4a7c59" stopOpacity=".02" />
          </linearGradient>
        </defs>
        <path d={`${d}L${W},${H}L0,${H}Z`} fill="url(#eleGrad)" />
        <path d={d} fill="none" stroke="#4a7c59" strokeWidth="1.5" />
      </svg>
      <div className="flex justify-between text-[9px] text-deep-wood/35 mt-0.5">
        <span>↓ {Math.round(min)} m</span>
        <span>↑ {Math.round(max)} m</span>
      </div>
    </div>
  )
}

export type TrailMapProps = {
  gpxUrl?: string
  startLat?: number; startLng?: number
  endLat?: number; endLng?: number
  height?: number
}

export default function TrailMap({ gpxUrl, startLat, startLng, endLat, endLng, height = 260 }: TrailMapProps) {
  const divRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const [gpxPoints, setGpxPoints] = useState<GpxPoint[]>([])
  const [activated, setActivated] = useState(false)
  const [loadErr, setLoadErr] = useState('')
  const center: [number, number] = [startLat ?? 39.295, startLng ?? 23.124]

  useEffect(() => {
    if (!divRef.current || mapRef.current) return
    let cancelled = false

    // Touch-friendly zoom buttons
    if (!document.getElementById('trail-map-css')) {
      const s = document.createElement('style')
      s.id = 'trail-map-css'
      s.textContent = `.leaflet-control-zoom a{width:40px!important;height:40px!important;line-height:40px!important;font-size:20px!important}`
      document.head.appendChild(s)
    }

    import('leaflet').then(({ default: L }) => {
      if (cancelled || !divRef.current || mapRef.current) return

      const map = L.map(divRef.current, {
        center, zoom: 13,
        zoomControl: false,
        touchZoom: false,
        scrollWheelZoom: false,
        dragging: false,
        attributionControl: false,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map)
      L.control.zoom({ position: 'bottomright' }).addTo(map)
      L.control.attribution({ prefix: '© <a href="https://openstreetmap.org">OSM</a>' }).addTo(map)
      mapRef.current = map

      const mkCircle = (lat: number, lng: number, color: string, label: string) =>
        L.circleMarker([lat, lng], { radius: 7, fillColor: color, color: '#fff', weight: 2, fillOpacity: 1 })
          .bindTooltip(label, { permanent: false }).addTo(map)

      if (gpxUrl) {
        parseGpx(gpxUrl).then(pts => {
          if (cancelled) return
          if (pts.length < 2) { setLoadErr('GPX: δεν βρέθηκαν σημεία'); return }
          setGpxPoints(pts)
          const lls = pts.map(p => [p.lat, p.lng] as [number, number])
          const poly = L.polyline(lls, { color: '#4a7c59', weight: 4, opacity: 0.85 }).addTo(map)
          mkCircle(pts[0].lat, pts[0].lng, '#4a7c59', 'Εκκίνηση')
          mkCircle(pts[pts.length - 1].lat, pts[pts.length - 1].lng, '#C9A96E', 'Τέλος')
          map.fitBounds(poly.getBounds(), { padding: [24, 24] })
        }).catch(() => { if (!cancelled) setLoadErr('Σφάλμα φόρτωσης GPX') })
      } else {
        if (startLat && startLng) mkCircle(startLat, startLng, '#4a7c59', 'Εκκίνηση')
        if (endLat && endLng) {
          mkCircle(endLat, endLng, '#C9A96E', 'Τέλος')
          const poly = L.polyline(
            [[startLat ?? center[0], startLng ?? center[1]], [endLat, endLng]],
            { color: '#4a7c59', weight: 3, opacity: 0.6, dashArray: '6 5' }
          ).addTo(map)
          map.fitBounds(poly.getBounds(), { padding: [32, 32] })
        }
      }
    })

    return () => {
      cancelled = true
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const activate = () => {
    setActivated(true)
    const m = mapRef.current
    if (!m) return
    m.touchZoom.enable(); m.scrollWheelZoom.enable(); m.dragging.enable()
  }

  return (
    <div>
      <div className="relative border border-deep-wood/10 overflow-hidden" style={{ height }}>
        <div ref={divRef} className="w-full h-full" />
        {!activated && (
          <div
            className="absolute inset-0 z-[400] flex items-center justify-center cursor-pointer"
            style={{ background: 'rgba(0,0,0,0.07)' }}
            onClick={activate}
          >
            <span className="text-xs bg-white/90 text-deep-wood/60 px-3 py-1.5 border border-deep-wood/10">
              Tap για αλληλεπίδραση
            </span>
          </div>
        )}
        {loadErr && (
          <div className="absolute bottom-2 left-2 right-2 z-[400] text-xs bg-white/90 text-red-500 px-2 py-1">
            {loadErr}
          </div>
        )}
      </div>
      <ElevationChart points={gpxPoints} />
    </div>
  )
}
