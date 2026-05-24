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
  main: string
  forecast: DayForecast[]
  seaTemp: number | null
}

const INITIAL_WEATHER: WeatherData = {
  ok: false, temp: 0, humidity: 0, wind: 0, description: '', icon: '01d',
  main: '',
  forecast: [], seaTemp: null,
}

// OpenWeather `weather[0].main` values (always English) → multilingual labels
const CONDITION_MAP: Record<string, Record<string, string>> = {
  Clear:        { el: 'Αίθριος',          en: 'Clear Sky',        de: 'Klarer Himmel',      fr: 'Ciel dégagé'         },
  Clouds:       { el: 'Συννεφιά',         en: 'Cloudy',           de: 'Bewölkt',            fr: 'Nuageux'             },
  Rain:         { el: 'Βροχή',            en: 'Rain',             de: 'Regen',              fr: 'Pluie'               },
  Drizzle:      { el: 'Ψιλόβροχο',        en: 'Drizzle',          de: 'Nieselregen',        fr: 'Bruine'              },
  Thunderstorm: { el: 'Καταιγίδα',        en: 'Thunderstorm',     de: 'Gewitter',           fr: 'Orage'               },
  Snow:         { el: 'Χιονόπτωση',       en: 'Snow',             de: 'Schnee',             fr: 'Neige'               },
  Mist:         { el: 'Ομίχλη',           en: 'Mist',             de: 'Nebel',              fr: 'Brume'               },
  Fog:          { el: 'Πυκνή Ομίχλη',     en: 'Fog',              de: 'Dichter Nebel',      fr: 'Brouillard'          },
  Haze:         { el: 'Αχλύς',            en: 'Haze',             de: 'Dunst',              fr: 'Brume sèche'         },
  Smoke:        { el: 'Καπνός',           en: 'Smoke',            de: 'Rauch',              fr: 'Fumée'               },
  Dust:         { el: 'Σκόνη',            en: 'Dust',             de: 'Staub',              fr: 'Poussière'           },
  Sand:         { el: 'Άμμος',            en: 'Sand',             de: 'Sand',               fr: 'Sable'               },
  Ash:          { el: 'Τέφρα',            en: 'Volcanic Ash',     de: 'Vulkanasche',        fr: 'Cendres volcaniques' },
  Squall:       { el: 'Ανεμοθύελλα',      en: 'Squall',           de: 'Böe',                fr: 'Grain'               },
  Tornado:      { el: 'Ανεμοστρόβιλος',   en: 'Tornado',          de: 'Tornado',            fr: 'Tornade'             },
}

function getCondition(main: string, lang: string): string {
  return CONDITION_MAP[main]?.[lang] ?? CONDITION_MAP[main]?.['el'] ?? main
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
  ).toUpperCase().replace('.', '')
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

          {/* ── Today card: solid, 3-column ── */}
          <div className="max-w-sm mx-auto mb-6">
            <div className="bg-black/20 border border-white/10 rounded-xl overflow-hidden">
              <div className="grid grid-cols-3 divide-x divide-white/10">

                {/* Air temperature */}
                <div className="text-center px-4 py-5">
                  <p className="text-white text-3xl font-light leading-none mb-1">
                    {weather.ok ? `${weather.temp}°` : '—'}
                  </p>
                  <p className="text-white/50 text-xs mt-2">🌡️ {w.temp}</p>
                </div>

                {/* Sea temperature */}
                <div className="text-center px-4 py-5">
                  <p className="text-white text-3xl font-light leading-none mb-1">
                    {weather.seaTemp !== null ? `${weather.seaTemp}°` : '—'}
                  </p>
                  <p className="text-white/50 text-xs mt-2">🌊 {w.sea}</p>
                </div>

                {/* Wind speed */}
                <div className="text-center px-4 py-5">
                  <p className="text-white text-3xl font-light leading-none mb-1">
                    {weather.ok ? weather.wind : '—'}
                    {weather.ok && <span className="text-lg"> km/h</span>}
                  </p>
                  <p className="text-white/50 text-xs mt-2">💨 {w.wind}</p>
                </div>

              </div>

              {/* Weather description strip — translated via CONDITION_MAP */}
              {weather.ok && weather.main && (
                <div className="border-t border-white/10 px-4 py-2 text-center">
                  <p className="text-white/50 text-xs">
                    {weatherEmoji(weather.icon)} {getCondition(weather.main, lang)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ── Forecast strip: glassmorphism cards ── */}
          {weather.forecast.length > 0 && (
            <div className="flex justify-center gap-2 sm:gap-3 flex-wrap">
              {weather.forecast.map(day => (
                <div
                  key={day.date}
                  className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl px-3 py-3 text-center"
                  style={{ minWidth: 58 }}
                >
                  <p className="text-white/60 text-[10px] font-medium tracking-wide mb-2">
                    {shortDay(day.date, lang)}
                  </p>
                  <p className="text-xl mb-2">{weatherEmoji(day.icon)}</p>
                  <p className="text-white/95 text-xs font-semibold">{day.temp_max}°</p>
                  <p className="text-white/40 text-xs">{day.temp_min}°</p>
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
