import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ActivityContent from '@/components/sections/ActivityContent'

type Activity = {
  id: string
  slug: string
  name_el: string
  name_en?: string | null
  icon: string
  image_url?: string | null
  description_el: string
  description_en?: string | null
  duration?: string | null
  distance?: string | null
  category?: string | null
}

const FALLBACK: Record<string, Activity> = {
  'beaches': {
    id: '1', slug: 'beaches', icon: '🏖️', name_el: 'Παραλίες', name_en: 'Beaches',
    category: 'Θάλασσα', duration: '5 λεπτά', distance: '0.3 km',
    description_el: 'Το Χόρτο βρέχεται από τα γαλάζια νερά του Παγασητικού κόλπου. Αμμώδεις παραλίες με κρυστάλλινα νερά, ιδανικές για κολύμπι και χαλάρωση. Σε απόσταση μόλις 5 λεπτών με τα πόδια από τα Myrsini Studios θα βρείτε την κεντρική παραλία του χωριού, ενώ με μικρή βόλτα στην ακτογραμμή ανακαλύπτετε πιο απομονωμένες παραλίες στη Μηλίνα και τη Μαραθιά.',
    description_en: 'Horto is bathed by the blue waters of the Pagasetic Gulf. Sandy beaches with crystal-clear waters, ideal for swimming and relaxation.',
  },
  'hiking-trails': {
    id: '2', slug: 'hiking-trails', icon: '🥾', name_el: 'Πεζοπορία', name_en: 'Hiking',
    category: 'Φύση', duration: '2–4 ώρες', distance: '5–12 km',
    description_el: 'Τα ιστορικά καλντερίμια του Πηλίου σας καλούν σε αξέχαστες πεζοπορίες μέσα από πυκνά δάση καστανιάς, πλατάνια και ελαιώνες. Το Νότιο Πήλιο διαθέτει δίκτυο μονοπατιών που ενώνουν τα παραδοσιακά χωριά και παρέχουν πανοραμική θέα στον Παγασητικό Κόλπο και το Αιγαίο πέλαγος.',
    description_en: 'Historic cobblestone paths of Pelion invite you on unforgettable hikes through dense chestnut forests, plane trees and olive groves.',
  },
  'marine-activities': {
    id: '3', slug: 'marine-activities', icon: '🐟', name_el: 'Θαλάσσιες Δραστηριότητες', name_en: 'Marine Activities',
    category: 'Θάλασσα', duration: 'Κατόπιν ρύθμισης',
    description_el: 'Εξερευνήστε τον υποβρύχιο κόσμο του Παγασητικού με κατάδυση ή snorkeling. Ψαρέψτε με τους ντόπιους ψαράδες τα χαράματα και απολαύστε τα αποτελέσματα στο τραπέζι.',
    description_en: 'Explore the underwater world of the Pagasetic with diving or snorkeling. Fish with local fishermen at dawn and enjoy the results at the table.',
  },
  'gastronomy': {
    id: '4', slug: 'gastronomy', icon: '🍷', name_el: 'Γαστρονομία', name_en: 'Gastronomy',
    category: 'Φαγητό',
    description_el: 'Η γαστρονομία του Πηλίου είναι αναπόσπαστο κομμάτι της εμπειρίας σας. Φρέσκα ψάρια και θαλασσινά αλιευμένα κάθε πρωί, παραδοσιακές χορτόπιτες με τοπικά χόρτα, ελαιόλαδο Πηλίου ΠΟΠ και το αποστακτήριο τσίπουρο σε αυθεντικές ταβέρνες με θέα τη θάλασσα.',
    description_en: 'The gastronomy of Pelion is an inseparable part of your experience. Fresh fish caught every morning, traditional vegetable pies, Pelion PDO olive oil and local tsipouro.',
  },
  'boat-trips': {
    id: '5', slug: 'boat-trips', icon: '⛵', name_el: 'Βαρκάδες', name_en: 'Boat Trips',
    category: 'Θάλασσα', duration: 'Κατόπιν κράτησης',
    description_el: 'Νοικιάστε βάρκα και εξερευνήστε κρυφές παραλίες και σπηλιές του Νότιου Πηλίου που δεν είναι προσβάσιμες από την ξηρά. Ο κόλπος της Μηλίνας, τα ακατοίκητα νησάκια και οι απομονωμένοι κολπίσκοι σας περιμένουν.',
    description_en: 'Rent a boat and explore hidden beaches and caves of Southern Pelion that are not accessible by land.',
  },
  'culture-history': {
    id: '6', slug: 'culture-history', icon: '🏛️', name_el: 'Πολιτισμός & Ιστορία', name_en: 'Culture & History',
    category: 'Πολιτισμός',
    description_el: 'Το Πήλιο έχει πλούσια ιστορία και παράδοση. Επισκεφθείτε τα γραφικά χωριά — Τρίκερι, Μηλίνα, Αργαλαστή — με αρχοντικά του 18ου και 19ου αιώνα, βυζαντινές εκκλησίες και μουσεία λαϊκής τέχνης.',
    description_en: 'Pelion has a rich history and tradition. Visit the picturesque villages with 18th and 19th century mansions, Byzantine churches and folk art museums.',
  },
}

export default async function ActivityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const supabase = await createClient()
  let activity: Activity | null = null

  try {
    const { data } = await supabase
      .from('activities')
      .select('*')
      .eq('slug', slug)
      .single()
    if (data) activity = data as Activity
  } catch {}

  if (!activity) {
    activity = FALLBACK[slug] ?? null
  }

  if (!activity) notFound()

  return <ActivityContent activity={activity} />
}
