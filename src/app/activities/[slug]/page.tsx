export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import ActivityContent, { type ActivityData } from '@/components/sections/ActivityContent'

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const FALLBACK: Record<string, ActivityData> = {
  'beaches': {
    id: '1', slug: 'beaches', icon: '🏖️', name_el: 'Παραλίες', name_en: 'Beaches',
    category: 'Θάλασσα', duration: '5 λεπτά', distance: '0.3 km',
    description_el: 'Το Χόρτο βρέχεται από τα γαλάζια νερά του Παγασητικού κόλπου. Αμμώδεις παραλίες με κρυστάλλινα νερά, ιδανικές για κολύμπι και χαλάρωση. Σε απόσταση μόλις 5 λεπτών με τα πόδια από τα Myrsini Studios θα βρείτε την κεντρική παραλία του χωριού, ενώ με μικρή βόλτα στην ακτογραμμή ανακαλύπτετε πιο απομονωμένες παραλίες στη Μηλίνα και τη Μαραθιά.',
    description_en: 'Horto is bathed by the blue waters of the Pagasetic Gulf. Sandy beaches with crystal-clear waters, ideal for swimming and relaxation.',
  },
  'hiking-trails': {
    id: '2', slug: 'hiking-trails', icon: '🥾', name_el: 'Πεζοπορία', name_en: 'Hiking',
    category: 'Φύση', duration: '2–4 ώρες', distance: '5–12 km',
    description_el: 'Τα ιστορικά καλντερίμια του Πηλίου σας καλούν σε αξέχαστες πεζοπορίες μέσα από πυκνά δάση καστανιάς, πλατάνια και ελαιώνες.',
    description_en: 'Historic cobblestone paths of Pelion invite you on unforgettable hikes through dense chestnut forests, plane trees and olive groves.',
  },
  'marine-activities': {
    id: '3', slug: 'marine-activities', icon: '🐟', name_el: 'Θαλάσσιες Δραστηριότητες', name_en: 'Marine Activities',
    category: 'Θάλασσα', duration: 'Κατόπιν ρύθμισης',
    description_el: 'Εξερευνήστε τον υποβρύχιο κόσμο του Παγασητικού με κατάδυση ή snorkeling.',
    description_en: 'Explore the underwater world of the Pagasetic with diving or snorkeling.',
  },
  'gastronomy': {
    id: '4', slug: 'gastronomy', icon: '🍷', name_el: 'Γαστρονομία', name_en: 'Gastronomy',
    category: 'Φαγητό',
    description_el: 'Η γαστρονομία του Πηλίου είναι αναπόσπαστο κομμάτι της εμπειρίας σας.',
    description_en: 'The gastronomy of Pelion is an inseparable part of your experience.',
  },
  'boat-trips': {
    id: '5', slug: 'boat-trips', icon: '⛵', name_el: 'Βαρκάδες', name_en: 'Boat Trips',
    category: 'Θάλασσα', duration: 'Κατόπιν κράτησης',
    description_el: 'Νοικιάστε βάρκα και εξερευνήστε κρυφές παραλίες και σπηλιές του Νότιου Πηλίου.',
    description_en: 'Rent a boat and explore hidden beaches and caves of Southern Pelion.',
  },
  'culture-history': {
    id: '6', slug: 'culture-history', icon: '🏛️', name_el: 'Πολιτισμός & Ιστορία', name_en: 'Culture & History',
    category: 'Πολιτισμός',
    description_el: 'Το Πήλιο έχει πλούσια ιστορία και παράδοση.',
    description_en: 'Pelion has a rich history and tradition.',
  },
}

export default async function ActivityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  let activity: ActivityData | null = null

  if (SB_URL && SB_KEY) {
    try {
      const res = await fetch(
        `${SB_URL}/rest/v1/activities?select=id,slug,name_el,name_en,name_de,name_fr,icon,image_url,images,description_el,description_en,description_de,description_fr,elevation,difficulty,category,duration,distance,duration_min,distance_km,map_url,gpx_url,wikiloc_url,start_lat,start_lng,end_lat,end_lng&slug=eq.${encodeURIComponent(slug)}&limit=1`,
        { headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` }, cache: 'no-store' }
      )
      if (res.ok) {
        const rows: ActivityData[] = await res.json()
        activity = rows[0] ?? null
      }
    } catch {}
  }

  if (!activity) activity = FALLBACK[slug] ?? null
  if (!activity) notFound()

  return <ActivityContent activity={activity} />
}
