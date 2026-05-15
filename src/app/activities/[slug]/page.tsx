import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'

type Activity = {
  id: string
  slug: string
  name_el: string
  name_en: string
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
    description_el: 'Τα ιστορικά καλντερίμια του Πηλίου σας καλούν σε αξέχαστες πεζοπορίες μέσα από πυκνά δάση καστανιάς, πλατάνια και ελαιώνες. Το Νότιο Πήλιο διαθέτει δίκτυο μονοπατιών που ενώνουν τα παραδοσιακά χωριά και παρέχουν πανοραμική θέα στον Παγασητικό Κόλπο και το Αιγαίο πέλαγος. Χαρακτηριστικό μονοπάτι: Χόρτο – Λαμπινού – Τρίκερι (ολική διάρκεια 3ω30λ).',
    description_en: 'Historic cobblestone paths of Pelion invite you on unforgettable hikes through dense chestnut forests, plane trees and olive groves.',
  },
  'marine-activities': {
    id: '3', slug: 'marine-activities', icon: '🐟', name_el: 'Θαλάσσιες Δραστηριότητες', name_en: 'Marine Activities',
    category: 'Θάλασσα', duration: 'Κατόπιν ρύθμισης',
    description_el: 'Εξερευνήστε τον υποβρύχιο κόσμο του Παγασητικού με κατάδυση ή snorkeling. Ψαρέψτε με τους ντόπιους ψαράδες τα χαράματα και απολαύστε τα αποτελέσματα στο τραπέζι. Διαθέσιμη ενοικίαση καγιάκ και paddleboard. Η καλύτερη περίοδος για θαλάσσιες δραστηριότητες είναι Ιούνιος–Σεπτέμβριος.',
    description_en: 'Explore the underwater world of the Pagasetic with diving or snorkeling. Fish with local fishermen at dawn and enjoy the results at the table.',
  },
  'gastronomy': {
    id: '4', slug: 'gastronomy', icon: '🍷', name_el: 'Γαστρονομία', name_en: 'Gastronomy',
    category: 'Φαγητό',
    description_el: 'Η γαστρονομία του Πηλίου είναι αναπόσπαστο κομμάτι της εμπειρίας σας. Φρέσκα ψάρια και θαλασσινά αλιευμένα κάθε πρωί, παραδοσιακές χορτόπιτες με τοπικά χόρτα, ελαιόλαδο Πηλίου ΠΟΠ και το αποστακτήριο τσίπουρο σε αυθεντικές ταβέρνες με θέα τη θάλασσα. Αξίζει επίσκεψη στην αγορά της Αργαλαστής για τοπικά προϊόντα.',
    description_en: 'The gastronomy of Pelion is an inseparable part of your experience. Fresh fish caught every morning, traditional vegetable pies, Pelion PDO olive oil and local tsipouro.',
  },
  'boat-trips': {
    id: '5', slug: 'boat-trips', icon: '⛵', name_el: 'Βαρκάδες', name_en: 'Boat Trips',
    category: 'Θάλασσα', duration: 'Κατόπιν κράτησης',
    description_el: 'Νοικιάστε βάρκα και εξερευνήστε κρυφές παραλίες και σπηλιές του Νότιου Πηλίου που δεν είναι προσβάσιμες από την ξηρά. Ο κόλπος της Μηλίνας, τα ακατοίκητα νησάκια και οι απομονωμένοι κολπίσκοι σας περιμένουν. Ρωτήστε μας για συνιστώμενες εταιρείες ενοικίασης σκαφών στην περιοχή.',
    description_en: 'Rent a boat and explore hidden beaches and caves of Southern Pelion that are not accessible by land.',
  },
  'culture-history': {
    id: '6', slug: 'culture-history', icon: '🏛️', name_el: 'Πολιτισμός & Ιστορία', name_en: 'Culture & History',
    category: 'Πολιτισμός',
    description_el: 'Το Πήλιο έχει πλούσια ιστορία και παράδοση. Επισκεφθείτε τα γραφικά χωριά — Τρίκερι, Μηλίνα, Αργαλαστή — με αρχοντικά του 18ου και 19ου αιώνα, βυζαντινές εκκλησίες και μουσεία λαϊκής τέχνης. Η περιοχή αναφέρεται στην αρχαία ελληνική μυθολογία ως κατοικία των Κενταύρων και ιδιαίτερα του σοφού Χείρωνα.',
    description_en: 'Pelion has a rich history and tradition. Visit the picturesque villages with 18th and 19th century mansions, Byzantine churches and folk art museums.',
  },
}

const STAT_ICONS: Record<string, string> = {
  duration: '⏱',
  distance: '📍',
  category: '🏷',
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

  const mapUrl = `https://www.google.com/maps/search/${encodeURIComponent('Χόρτο Πήλιο')}`

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <div className="relative h-72 sm:h-96 overflow-hidden">
        {activity.image_url ? (
          <div
            className="absolute inset-0"
            style={{ backgroundImage: `url('${activity.image_url}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-deep-wood to-olive" />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 h-full flex flex-col justify-end px-6 pb-10 max-w-4xl mx-auto">
          <div className="text-5xl mb-4">{activity.icon}</div>
          <h1 className="font-serif text-4xl sm:text-5xl text-white mb-2">{activity.name_el}</h1>
          {activity.name_en && <p className="text-white/60 text-sm tracking-wider uppercase">{activity.name_en}</p>}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link href="/#activities" className="inline-flex items-center gap-2 text-olive text-xs tracking-widest uppercase mb-10 hover:text-deep-wood transition-colors">
          ← Πίσω στις Δραστηριότητες
        </Link>

        <div className="grid md:grid-cols-3 gap-10">
          {/* Main description */}
          <div className="md:col-span-2">
            <p className="text-deep-wood/80 text-lg leading-relaxed font-light">{activity.description_el}</p>

            {activity.description_en && (
              <div className="mt-8 pt-8 border-t border-deep-wood/10">
                <p className="text-xs text-olive uppercase tracking-widest mb-3">English</p>
                <p className="text-deep-wood/60 leading-relaxed italic">{activity.description_en}</p>
              </div>
            )}

            {/* Map link */}
            <div className="mt-10 p-5 bg-white border border-deep-wood/8 shadow-sm">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Τοποθεσία</p>
              <p className="text-deep-wood font-medium mb-1">Χόρτο, Πήλιο</p>
              <p className="text-sm text-deep-wood/55 mb-4">Νότιο Πήλιο · Μαγνησία · Ελλάδα</p>
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-deep-wood text-white text-xs tracking-widest uppercase px-5 py-2.5 hover:bg-olive transition-colors"
              >
                Άνοιγμα στο Google Maps →
              </a>
            </div>
          </div>

          {/* Stats sidebar */}
          <div className="space-y-4">
            <div className="bg-white border border-deep-wood/8 shadow-sm p-5">
              <p className="text-xs text-olive uppercase tracking-widest mb-4">Στοιχεία</p>
              <div className="space-y-3">
                {activity.category && (
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{STAT_ICONS.category}</span>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">Κατηγορία</p>
                      <p className="text-sm text-deep-wood font-medium">{activity.category}</p>
                    </div>
                  </div>
                )}
                {activity.duration && (
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{STAT_ICONS.duration}</span>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">Διάρκεια</p>
                      <p className="text-sm text-deep-wood font-medium">{activity.duration}</p>
                    </div>
                  </div>
                )}
                {activity.distance && (
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{STAT_ICONS.distance}</span>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">Απόσταση</p>
                      <p className="text-sm text-deep-wood font-medium">{activity.distance}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-deep-wood text-white p-5">
              <p className="text-xs uppercase tracking-widest text-white/50 mb-2">Myrsini Studios</p>
              <p className="text-sm leading-relaxed text-white/80 mb-4">Χρειάζεστε βοήθεια για να οργανώσετε τη δραστηριότητα;</p>
              <Link href="/#contact" className="text-xs tracking-widest uppercase text-olive hover:text-white transition-colors">
                Επικοινωνήστε μαζί μας →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
