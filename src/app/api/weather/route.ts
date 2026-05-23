import { NextResponse } from 'next/server'

const LAT = 39.1003
const LON = 23.3731
const MARINE_LAT = 39.295
const MARINE_LON = 23.124

type DayForecast = {
  date: string
  temp_min: number
  temp_max: number
  description: string
  icon: string
}

type ForecastItem = {
  dt_txt: string
  main: { temp: number; temp_min: number; temp_max: number; humidity: number }
  weather: { description: string; icon: string }[]
  wind: { speed: number }
}

const FALLBACK = {
  ok: false as const,
  temp: 0, humidity: 0, wind: 0, description: '', icon: '01d',
  forecast: [] as DayForecast[],
  seaTemp: null as number | null,
}

async function fetchSeaTemp(): Promise<number | null> {
  try {
    const res = await fetch(
      `https://marine-api.open-meteo.com/v1/marine?latitude=${MARINE_LAT}&longitude=${MARINE_LON}&hourly=sea_surface_temperature&timezone=Europe%2FAthens&forecast_days=1`,
      { next: { revalidate: 1800 } }
    )
    if (!res.ok) return null
    const data = await res.json()
    const temps: (number | null)[] = data.hourly?.sea_surface_temperature ?? []
    if (!temps.length) return null
    // Get current Athens hour
    const athensHour = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'Europe/Athens' })
    ).getHours()
    const val = temps[athensHour]
    return val != null ? Math.round(val) : null
  } catch {
    return null
  }
}

export async function GET() {
  const key = process.env.OPENWEATHER_API_KEY
  if (!key) {
    const seaTemp = await fetchSeaTemp()
    return NextResponse.json({ ...FALLBACK, seaTemp })
  }

  try {
    const base   = `https://api.openweathermap.org/data/2.5`
    const params = `lat=${LAT}&lon=${LON}&appid=${key}&units=metric&lang=el`

    const [currentRes, forecastRes, seaTemp] = await Promise.all([
      fetch(`${base}/weather?${params}`,         { next: { revalidate: 1800 } }),
      fetch(`${base}/forecast?${params}&cnt=40`, { next: { revalidate: 1800 } }),
      fetchSeaTemp(),
    ])

    if (!currentRes.ok || !forecastRes.ok) return NextResponse.json(FALLBACK)

    const current  = await currentRes.json()
    const forecast = await forecastRes.json()

    const dayMap = new Map<string, DayForecast>()
    for (const item of (forecast.list ?? []) as ForecastItem[]) {
      const date = item.dt_txt.split(' ')[0]
      const existing = dayMap.get(date)
      if (!existing) {
        dayMap.set(date, {
          date,
          temp_min: Math.round(item.main.temp_min),
          temp_max: Math.round(item.main.temp_max),
          description: item.weather[0].description,
          icon: item.weather[0].icon,
        })
      } else {
        dayMap.set(date, {
          ...existing,
          temp_min: Math.min(existing.temp_min, Math.round(item.main.temp_min)),
          temp_max: Math.max(existing.temp_max, Math.round(item.main.temp_max)),
        })
      }
    }

    const today = new Date().toISOString().split('T')[0]
    const days  = [...dayMap.values()].filter(d => d.date >= today).slice(0, 5)

    return NextResponse.json({
      ok: true,
      temp: Math.round(current.main.temp),
      humidity: current.main.humidity as number,
      wind: Math.round((current.wind.speed as number) * 3.6),
      description: current.weather[0].description as string,
      icon: current.weather[0].icon as string,
      forecast: days,
      seaTemp,
    })
  } catch {
    return NextResponse.json(FALLBACK)
  }
}
