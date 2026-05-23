import { cookies } from 'next/headers'

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

type SliderPhoto = {
  id: string; image_url: string
  title: string; title_en?: string; title_de?: string; title_fr?: string
  sort_order: number
}

const FALLBACK: SliderPhoto[] = [
  { id: '1', image_url: '', title: 'Χόρτο, 1960', sort_order: 1 },
  { id: '2', image_url: '', title: 'Παραλία Πηλίου, 1970', sort_order: 2 },
  { id: '3', image_url: '', title: 'Παραδοσιακό σπίτι, 1955', sort_order: 3 },
  { id: '4', image_url: '', title: 'Ψαράδες, 1965', sort_order: 4 },
  { id: '5', image_url: '', title: 'Χόρτο, 1975', sort_order: 5 },
]

function getTitle(p: SliderPhoto, lang: string): string {
  if (lang === 'en' && p.title_en) return p.title_en
  if (lang === 'de' && p.title_de) return p.title_de
  if (lang === 'fr' && p.title_fr) return p.title_fr
  return p.title
}

export default async function HeritageSlider() {
  let photos: SliderPhoto[] = FALLBACK

  if (SB_URL && SB_KEY) {
    try {
      const res = await fetch(
        `${SB_URL}/rest/v1/slider_photos?select=id,image_url,title,title_en,title_de,title_fr,sort_order&order=sort_order`,
        { headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` }, cache: 'no-store' }
      )
      if (res.ok) {
        const data: SliderPhoto[] = await res.json()
        if (data.length > 0) photos = data
      }
    } catch {}
  }

  const cookieStore = await cookies()
  const lang = (cookieStore.get('site_lang')?.value as string) || 'el'
  const items = [...photos, ...photos]

  return (
    <section className="bg-[#2C1B0E] py-12 overflow-hidden">
      <p className="text-center text-white/40 text-xs tracking-widest mb-8">Παλιές Αναμνήσεις</p>
      <div
        className="flex gap-6"
        style={{ animation: 'scroll 20s linear infinite', width: 'max-content' }}
      >
        {items.map((p, i) => (
          <div key={i} className="flex-shrink-0 w-64 overflow-hidden border border-white/10">
            <div
              className="h-36"
              style={p.image_url
                ? { backgroundImage: `url('${p.image_url}')`, backgroundSize: 'cover', backgroundPosition: 'center' }
                : { background: '#4a5d4520' }
              }
            />
            <div className="px-3 py-2 bg-[#1e0f07]">
              <span className="text-white/50 text-xs">{getTitle(p, lang)}</span>
            </div>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  )
}
