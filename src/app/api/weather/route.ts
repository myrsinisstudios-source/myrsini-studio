import { NextResponse } from 'next/server'

const LAT = 39.1003
const LON = 23.3731

type ForecastItem = {
  dt_txt: string
  main: { temp: number; temp_min: number; temp_max: number; humidity: number }
  weather: { description: string; icon: string }[]
  wind: { speed: number }
}

type DayForecast = {
  date: string
  temp_min: number
  temp_max: number
  description: string
  icon: string
}

const FALLBACK = {
  temp: 24,
  humidity: 65,
  wind: 12,
  description: 'Αίθριος',
  icon: '01d',
  forecast: [] as DayForecast[],
}

export async function GET() {
  const key = process.env.OPENWEATHER_API_KEY
  if (!key) return NextResponse.json(FALLBACK)

  try {
    const base = `https://api.openweathermap.org/data/2.5`
    const params = `lat=${LAT}&lon=${LON}&appid=${key}&units=metric&lang=el`

    const [currentRes, forecastRes] = await Promise.all([
      fetch(`${base}/weather?${params}`,         { next: { revalidate: 1800 } }),
      fetch(`${base}/forecast?${params}&cnt=40`, { next: { revalidate: 1800 } }),
    ])

    if (!currentRes.ok || !forecastRes.ok) return NextResponse.json(FALLBACK)

    const current  = await currentRes.json()
    const forecast = await forecastRes.json()

    // Aggregate forecast by day
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
    const days = [...dayMap.values()].filter(d => d.date >= today).slice(0, 5)

    return NextResponse.json({
      temp: Math.round(current.main.temp),
      humidity: current.main.humidity as number,
      wind: Math.round((current.wind.speed as number) * 3.6),
      description: current.weather[0].description as string,
      icon: current.weather[0].icon as string,
      forecast: days,
    })
  } catch {
    return NextResponse.json(FALLBACK)
  }
}
