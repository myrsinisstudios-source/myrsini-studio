import { createClient } from '@/lib/supabase/server'

type HistoryPhoto = { id: string; image_url: string; caption: string; sort_order: number; tall?: boolean }

const FALLBACK: HistoryPhoto[] = [
  { id: '1', image_url: '', caption: 'Η Αυλή',          sort_order: 1, tall: true },
  { id: '2', image_url: '', caption: 'Θέα Κόλπου',      sort_order: 2 },
  { id: '3', image_url: '', caption: 'Ελαιώνας',        sort_order: 3 },
  { id: '4', image_url: '', caption: 'Πέτρινη Είσοδος', sort_order: 4, tall: true },
  { id: '5', image_url: '', caption: 'Ηλιοβασίλεμα',   sort_order: 5 },
  { id: '6', image_url: '', caption: 'Βεράντα',         sort_order: 6, tall: true },
  { id: '7', image_url: '', caption: 'Νυχτερινή Θέα',  sort_order: 7 },
  { id: '8', image_url: '', caption: 'Τοπική Κουζίνα',  sort_order: 8 },
  { id: '9', image_url: '', caption: 'Βότσαλα & Πεύκα', sort_order: 9 },
]

const FALLBACK_GRADIENTS = [
  'from-[#2C1B0E] via-[#5c3a1e] to-[#2C1B0E]',
  'from-[#1a3a5c] via-[#2a6080] to-[#1a3040]',
  'from-[#1c3d1e] via-[#2d5e20] to-[#1c3d1e]',
  'from-[#3d2a14] via-[#7a5a2e] to-[#3d2a14]',
  'from-[#0d2b40] via-[#1a5a7a] to-[#0d2b40]',
  'from-[#2c1b0e] via-[#4a5d45] to-[#2c1b0e]',
  'from-[#1a1a2e] via-[#2a2a4a] to-[#1a1a2e]',
  'from-[#4a1c0e] via-[#8b3a1a] to-[#4a1c0e]',
  'from-[#1c3d1e] via-[#3a6e2a] to-[#1c3d1e]',
]

export default async function HistoryMasonry() {
  let photos = FALLBACK

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('history_photos')
      .select('*')
      .order('sort_order')
    if (data && data.length > 0) photos = data as HistoryPhoto[]
  } catch {}

  return (
    <section id="history" className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-16">
          <p className="text-xs tracking-widest uppercase text-olive mb-3">Ιστορία & Ταυτότητα</p>
          <h2 className="font-serif text-4xl sm:text-5xl text-deep-wood mb-6">Η Ψυχή του Πηλίου</h2>
          <p className="text-deep-wood/60 text-base leading-relaxed mb-4">
            Τα Myrsini Studios γεννήθηκαν μέσα από την αγάπη για τη φύση και την παράδοση του Πηλίου.
            Ένα παλαιό αρχοντικό του 19ου αιώνα και ένα studio με θέα τη θάλασσα, σχολαστικά
            ανακαινισμένα για να προσφέρουν σύγχρονη άνεση χωρίς να χάσουν την αυθεντικότητά τους.
          </p>
          <p className="text-deep-wood/60 text-base leading-relaxed">
            Η μυρτιά — το φυτό που έδωσε το όνομα — αναπτύσσεται παντού στους ελαιώνες γύρω από τα
            καταλύματα. Είναι σύμβολο φιλοξενίας, φύσης και της Πηλιορείτικης ζωής όπως ήταν πάντα:
            ήρεμης, αυθεντικής, φιλόξενης.
          </p>
        </div>

        <div className="masonry-grid">
          {photos.map((photo, idx) => (
            <div
              key={photo.id}
              className={`relative overflow-hidden rounded-sm ${
                photo.tall || idx % 3 === 0 ? 'h-72' : 'h-44'
              } cursor-pointer group`}
              style={
                photo.image_url
                  ? { backgroundImage: `url('${photo.image_url}')`, backgroundSize: 'cover', backgroundPosition: 'center' }
                  : undefined
              }
            >
              {!photo.image_url && (
                <div className={`absolute inset-0 bg-gradient-to-br ${FALLBACK_GRADIENTS[idx % FALLBACK_GRADIENTS.length]}`} />
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-xs tracking-wider">{photo.caption}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
