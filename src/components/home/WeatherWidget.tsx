'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export type SiteSettings = {
  id: number
  hero_quote_el: string; hero_quote_en: string; hero_quote_de: string; hero_quote_fr: string
  distance_airport_min: number; distance_airport_km: number
  distance_port_min: number; distance_port_km: number
  phone: string; email: string; address: string
  checkin_time: string; checkout_time: string
}

type Distances = {
  airport: { min: number; km: number }
  port:    { min: number; km: number }
}

type DayForecast = {
  date: string; temp_min: number; temp_max: number; description: string; icon: string
}

type WeatherData = {
  ok: boolean
  temp: number; humidity: number; wind: number; description: string; icon: string
  forecast: DayForecast[]
  seaTemp: number | null
}

const INITIAL_WEATHER: WeatherData = {
  ok: false, temp: 0, humidity: 0, wind: 0, description: '', icon: '01d',
  forecast: [], seaTemp: null,
}

const TRAVEL_BASE = [
  {
    id: 'airport',
    originImage: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&q=80',
    roadImage:   'https://images.unsplash.com/photo-1504707748692-419802cf939d?w=400&q=80',
  },
  {
    id: 'port',
    originImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
    roadImage:   'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&q=80',
  },
]

const WEATHER_ICONS: Record<string, string> = {
  '01d':'☀️','01n':'🌙','02d':'🌤️','02n':'🌤️','03d':'⛅','03n':'⛅',
  '04d':'☁️','04n':'☁️','09d':'🌧️','09n':'🌧️','10d':'🌦️','10n':'🌦️',
  '11d':'⛈️','11n':'⛈️','13d':'❄️','13n':'❄️','50d':'🌫️','50n':'🌫️',
}

function weatherEmoji(icon: string) { return WEATHER_ICONS[icon] ?? '🌡️' }

function shortDay(dateStr: string, lang: string): string {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString(
    lang === 'el' ? 'el-GR' : lang === 'de' ? 'de-DE' : lang === 'fr' ? 'fr-FR' : 'en-GB',
    { weekday: 'short' }
  )
}

function settingsToDistances(s: SiteSettings): Distances {
  return {
    airport: { min: s.distance_airport_min, km: s.distance_airport_km },
    port:    { min: s.distance_port_min,    km: s.distance_port_km },
  }
}

const DEFAULT_DISTANCES: Distances = {
  airport: { min: 58, km: 54 },
  port:    { min: 42, km: 37 },
}

export default function WeatherWidget({ settings }: { settings?: SiteSettings | null }) {
  const { t, lang } = useLanguage()
  const w = t.weather

  const initialDistances = settings ? settingsToDistances(settings) : DEFAULT_DISTANCES
  const [distances, setDistances] = useState<Distances>(initialDistances)
  const [weather, setWeather]     = useState<WeatherData>(INITIAL_WEATHER)

  const quote = settings
    ? (lang === 'el' ? settings.hero_quote_el : lang === 'de' ? settings.hero_quote_de : lang === 'fr' ? settings.hero_quote_fr : settings.hero_quote_en)
    : w.quote

  useEffect(() => {
    const loadAll = () => {
      fetch('/api/distances')
        .then(r => r.json())
        .then((d: Distances) => setDistances(d))
        .catch(() => {})

      fetch('/api/weather')
        .then(r => r.ok ? r.json() : Promise.reject())
        .then((d: WeatherData) => setWeather(d))
        .catch(() => setWeather(prev => ({ ...prev, ok: false })))
    }

    loadAll()
    const id = setInterval(loadAll, 30 * 60 * 1000)
    return () => clearInterval(id)
  }, [])

  const travelCards = [
    { ...TRAVEL_BASE[0], origin: w.airport, destination: "Myrsini's Studios", time: `${distances.airport.min} ${w.minutes}`, distance: `${distances.airport.km} ${w.km}` },
    { ...TRAVEL_BASE[1], origin: w.port,    destination: "Myrsini's Studios", time: `${distances.port.min} ${w.minutes}`,    distance: `${distances.port.km} ${w.km}` },
  ]

  return (
    <>
      {/* ─── Weather strip ─── */}
      <section className="bg-[#4a5d45] py-10">
        <div className="max-w-6xl mx-auto px-4">

          {/* Quote */}
          <p className="text-center font-serif italic text-white/90 mb-8" style={{ fontSize: '1.5rem' }}>
            {quote}
          </p>

          {/* Today card */}
          <div className="max-w-sm mx-auto backdrop-blur-sm bg-white/10 border border-white/20 rounded-2xl px-8 py-6 mb-6">
            <div className="flex justify-around text-center">

              {/* Air temp + sea temp inline */}
              <div>
                <div className="flex items-end justify-center gap-2 mb-1">
                  <p className="text-white/95 text-4xl font-light">
                    {weather.ok ? `${weather.temp}°C` : '—'}
                  </p>
                  {weather.seaTemp !== null && (
                    <p className="text-white/60 text-sm mb-1.5">🌊 {weather.seaTemp}°C</p>
                  )}
                </div>
                <p className="text-white/60 text-sm">{w.temp}</p>
              </div>

              {/* Divider */}
              <div className="w-px bg-white/15 self-stretch" />

              {/* Wind */}
              <div>
                <p className="text-white/95 text-4xl font-light mb-1">
                  {weather.ok ? `${weather.wind}` : '—'}
                  {weather.ok && <span className="text-white/60 text-lg"> km/h</span>}
                </p>
                <p className="text-white/60 text-sm">{w.wind}</p>
              </div>

            </div>
          </div>

          {/* Weather description */}
          {(weather.ok && weather.description) && (
            <p className="text-center text-white/60 text-sm mt-2 capitalize">
              {weatherEmoji(weather.icon)} {weather.description}
            </p>
          )}

          {/* 5-day forecast */}
          {weather.forecast.length > 0 && (
            <div className="flex justify-center gap-4 mt-6 flex-wrap">
              {weather.forecast.map(day => (
                <div key={day.date} className="text-center">
                  <p className="text-white/60 text-xs uppercase tracking-wide mb-1">{shortDay(day.date, lang)}</p>
                  <p className="text-xl mb-1">{weatherEmoji(day.icon)}</p>
                  <p className="text-white/95 text-xs font-medium">{day.temp_max}°</p>
                  <p className="text-white/60 text-xs">{day.temp_min}°</p>
                </div>
              ))}
            </div>
          )}

          <p className="text-center text-white/40 text-xs mt-5">{w.today}</p>
        </div>
      </section>

      {/* ─── Travel cards ─── */}
      <section className="bg-[#2C1B0E] py-16">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-center text-white/60 text-xs tracking-widest uppercase mb-12">
            {w.howToArrive}
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            {travelCards.map((card) => (
              <div key={card.id} className="border border-white/10 overflow-hidden group">
                <div className="flex items-center h-36">
                  <div className="relative flex-1 h-full overflow-hidden">
                    <Image src={card.originImage} alt={card.origin} fill
                      className="object-cover brightness-75 group-hover:scale-105 transition-transform duration-700"
                      sizes="200px" />
                  </div>
                  <div className="flex-shrink-0 px-3 flex items-center justify-center bg-[#2C1B0E] h-full">
                    <span className="arrows text-[#c9a96e] text-xl tracking-widest select-none">›</span>
                  </div>
                  <div className="relative flex-1 h-full overflow-hidden">
                    <Image src={card.roadImage} alt="Road" fill
                      className="object-cover brightness-75 group-hover:scale-105 transition-transform duration-700"
                      sizes="200px" />
                  </div>
                  <div className="flex-shrink-0 px-3 flex items-center justify-center bg-[#2C1B0E] h-full">
                    <span className="arrows text-[#c9a96e] text-xl tracking-widest select-none" style={{ animationDelay: '0.3s' }}>›</span>
                  </div>
                  <div className="relative flex-1 h-full overflow-hidden bg-[#1a0f06] flex items-center justify-center">
                    <Image src="/logo.png" alt="Myrsini's Studios" width={80} height={80}
                      className="object-contain opacity-90" />
                  </div>
                </div>

                <div className="px-5 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-white/95 text-sm font-medium">{card.origin}</p>
                    <p className="text-white/60 text-xs mt-0.5">→ {card.destination}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#c9a96e] text-lg font-light">{card.time}</p>
                    <p className="text-white/60 text-xs">{card.distance}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes pulse-arrow {
          0%, 100% { opacity: 0.4; transform: translateX(0); }
          50% { opacity: 1; transform: translateX(4px); }
        }
        .arrows { animation: pulse-arrow 1.2s ease-in-out infinite; display: inline-block; }
      `}</style>
    </>
  )
}
