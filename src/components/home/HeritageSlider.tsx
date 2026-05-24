import { cookies } from 'next/headers'
import HeritageSliderClient from './HeritageSliderClient'

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

  const clientPhotos = photos.map(p => ({
    id: p.id,
    image_url: p.image_url,
    title: getTitle(p, lang),
  }))

  return <HeritageSliderClient photos={clientPhotos} />
}
