export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ApartmentContent from '@/components/apartments/ApartmentContent'

export type ApartmentData = {
  id: string
  slug: string
  name_el: string
  name_en?: string | null
  description_el?: string | null
  description_en?: string | null
  price_per_night: number
  max_guests?: number | null
  sqm?: number | null
  area_sqm?: number | null
  bedrooms?: number | null
  bathrooms?: number | null
  amenities?: string[] | null
  image_url?: string | null
  gallery?: string[] | null
}

const FALLBACK: Record<string, ApartmentData> = {
  archontiko: {
    id: 'archontiko', slug: 'archontiko',
    name_el: 'Το Αρχοντικό', name_en: 'The Archontiko',
    description_el: 'Παραδοσιακό πέτρινο κτίριο του 19ου αιώνα. Εκθαμβωτική θέα στον κόλπο, αυλή με ελαιώνα και πλήρως εξοπλισμένη κουζίνα. Χώρος 65m², 2 υπνοδωμάτια, ιδανικό για οικογένειες ή ζευγάρια που επιθυμούν περισσότερο χώρο.',
    description_en: 'Traditional 19th-century stone building. Stunning bay views, olive grove courtyard and a fully equipped kitchen. 65m², 2 bedrooms, ideal for families or couples wanting more space.',
    price_per_night: 85, max_guests: 4, sqm: 65, bedrooms: 2, bathrooms: 1,
    amenities: ['AC', 'WiFi', 'Κουζίνα', 'Parking', 'Βεράντα', 'Θέα θάλασσα', 'BBQ', 'Πλυντήριο'],
  },
  thalassino: {
    id: 'thalassino', slug: 'thalassino',
    name_el: 'Το Θαλασσινό', name_en: 'The Thalassino',
    description_el: 'Σύγχρονο studio με άμεση πρόσβαση στη θάλασσα. Μεγάλα παράθυρα, θέα ορίζοντα και private βεράντα πάνω στο κύμα. 45m², ιδανικό για ζευγάρια.',
    description_en: 'Modern studio with direct sea access. Large windows, horizon views and a private veranda above the waves. 45m², ideal for couples.',
    price_per_night: 65, max_guests: 2, sqm: 45, bedrooms: 1, bathrooms: 1,
    amenities: ['AC', 'WiFi', 'Kitchenette', 'Βεράντα', 'Θέα θάλασσα', 'Τηλεόραση', 'Πετσέτες'],
  },
}

export default async function ApartmentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  let apartment: ApartmentData | null = null

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('apartments')
      .select('id, slug, name_el, name_en, description_el, description_en, price_per_night, max_guests, sqm, bedrooms, bathrooms, amenities, is_active, image_url, gallery')
      .eq('slug', slug)
      .single()
    if (data) apartment = data as ApartmentData
  } catch {}

  if (!apartment) apartment = FALLBACK[slug] ?? null
  if (!apartment) notFound()

  return <ApartmentContent apartment={apartment} />
}
