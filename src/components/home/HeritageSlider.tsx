import { createClient } from '@/lib/supabase/server'

type SliderPhoto = { id: string; image_url: string; title: string; sort_order: number }

const FALLBACK = [
  { id: '1', image_url: '', title: 'Χόρτο, 1960', sort_order: 1 },
  { id: '2', image_url: '', title: 'Παραλία Πηλίου, 1970', sort_order: 2 },
  { id: '3', image_url: '', title: 'Παραδοσιακό σπίτι, 1955', sort_order: 3 },
  { id: '4', image_url: '', title: 'Ψαράδες, 1965', sort_order: 4 },
  { id: '5', image_url: '', title: 'Χόρτο, 1975', sort_order: 5 },
]

export default async function HeritageSlider() {
  let photos: SliderPhoto[] = FALLBACK

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('slider_photos')
      .select('*')
      .order('sort_order')
    if (data && data.length > 0) photos = data as SliderPhoto[]
  } catch {}

  const items = [...photos, ...photos]

  return (
    <section className="bg-[#2C1B0E] py-12 overflow-hidden">
      <p className="text-center text-white/40 text-xs tracking-widest uppercase mb-8">Παλιές Αναμνήσεις</p>
      <div
        className="flex gap-6"
        style={{ animation: 'scroll 20s linear infinite', width: 'max-content' }}
      >
        {items.map((p, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-64 h-40 border border-white/10 flex items-end p-4 overflow-hidden"
            style={{
              background: p.image_url
                ? `url('${p.image_url}') center/cover no-repeat`
                : '#4a5d4520',
            }}
          >
            <span className="text-white/50 text-xs drop-shadow">{p.title}</span>
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
