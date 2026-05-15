const PHOTOS = [
  { id: 1, gradient: 'from-[#2C1B0E] via-[#5c3a1e] to-[#2C1B0E]', label: 'Η Αυλή', tall: true },
  { id: 2, gradient: 'from-[#1a3a5c] via-[#2a6080] to-[#1a3040]', label: 'Θέα Κόλπου' },
  { id: 3, gradient: 'from-[#1c3d1e] via-[#2d5e20] to-[#1c3d1e]', label: 'Ελαιώνας' },
  { id: 4, gradient: 'from-[#3d2a14] via-[#7a5a2e] to-[#3d2a14]', label: 'Πέτρινη Είσοδος', tall: true },
  { id: 5, gradient: 'from-[#0d2b40] via-[#1a5a7a] to-[#0d2b40]', label: 'Ηλιοβασίλεμα' },
  { id: 6, gradient: 'from-[#2c1b0e] via-[#4a5d45] to-[#2c1b0e]', label: 'Βεράντα', tall: true },
  { id: 7, gradient: 'from-[#1a1a2e] via-[#2a2a4a] to-[#1a1a2e]', label: 'Νυχτερινή Θέα' },
  { id: 8, gradient: 'from-[#4a1c0e] via-[#8b3a1a] to-[#4a1c0e]', label: 'Τοπική Κουζίνα' },
  { id: 9, gradient: 'from-[#1c3d1e] via-[#3a6e2a] to-[#1c3d1e]', label: 'Βότσαλα & Πεύκα' },
]

export default function HistoryMasonry() {
  return (
    <section id="history" className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Heading */}
        <div className="max-w-2xl mb-16">
          <p className="text-xs tracking-widest uppercase text-olive mb-3">Ιστορία & Ταυτότητα</p>
          <h2 className="font-serif text-4xl sm:text-5xl text-deep-wood mb-6">
            Η Ψυχή του Πηλίου
          </h2>
          <p className="text-deep-wood/60 text-base leading-relaxed mb-4">
            Τα Myrsini Studios γεννήθηκαν μέσα από την αγάπη για τη φύση και την παράδοση του
            Πηλίου. Ένα παλαιό αρχοντικό του 19ου αιώνα και ένα studio με θέα τη θάλασσα,
            σχολαστικά ανακαινισμένα για να προσφέρουν σύγχρονη άνεση χωρίς να χάσουν την
            αυθεντικότητά τους.
          </p>
          <p className="text-deep-wood/60 text-base leading-relaxed">
            Η μυρτιά — το φυτό που έδωσε το όνομα — αναπτύσσεται παντού στους ελαιώνες γύρω από
            τα καταλύματα. Είναι σύμβολο φιλοξενίας, φύσης και της Πηλιορείτικης ζωής όπως ήταν
            πάντα: ήρεμης, αυθεντικής, φιλόξενης.
          </p>
        </div>

        {/* Masonry grid */}
        <div className="masonry-grid">
          {PHOTOS.map(photo => (
            <div
              key={photo.id}
              className={`relative overflow-hidden rounded-sm bg-gradient-to-br ${photo.gradient} ${
                photo.tall ? 'h-72' : 'h-44'
              } cursor-pointer group`}
            >
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-xs tracking-wider">{photo.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
