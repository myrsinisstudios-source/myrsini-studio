const TRAILS = [
  {
    id: 1,
    name: 'Χόρτο – Λαμπινού',
    difficulty: 'Μέτρια',
    difficultyColor: 'text-amber-600 bg-amber-50 border-amber-200',
    distance: '8.2 km',
    duration: '3ω 30λ',
    elevation: '+420 m',
    start: 'Χόρτο, παραλία',
    description:
      'Κλασικό πηλιορείτικο μονοπάτι που ανεβαίνει μέσα από ελαιώνες και δάση πουρναριών. Περνά από ερημικές εκκλησίτσες και αρχαία καλντερίμια προς τον ορεινό οικισμό Λαμπινού. Πανοραμική θέα προς Αιγαίο και Παγασητικό.',
    tags: ['Ελαιώνες', 'Ιστορικά Μονοπάτια', 'Θέα'],
    icon: '⛰️',
  },
  {
    id: 2,
    name: 'Χόρτο – Παραλία Μηλίνας',
    difficulty: 'Εύκολη',
    difficultyColor: 'text-green-700 bg-green-50 border-green-200',
    distance: '4.8 km',
    duration: '2ω 00λ',
    elevation: '+180 m',
    start: 'Χόρτο, λιμάνι',
    description:
      'Εύκολη παράκτια διαδρομή κατάλληλη για όλες τις ηλικίες. Ακολουθεί την ακτογραμμή, περνά από μικρές κρυφές παραλίες και καταλήγει στο γραφικό λιμανάκι της Μηλίνας. Ιδανική για το πρωί.',
    tags: ['Παραλίες', 'Εύκολη', 'Κατάλληλο για παιδιά'],
    icon: '🌊',
  },
  {
    id: 3,
    name: 'Κορυφογραμμή Νότιου Πηλίου',
    difficulty: 'Δύσκολη',
    difficultyColor: 'text-red-700 bg-red-50 border-red-200',
    distance: '14.5 km',
    duration: '6ω 00λ',
    elevation: '+850 m',
    start: 'Αργαλαστή, πλατεία',
    description:
      'Απαιτητική ορεινή πεζοπορία για έμπειρους πεζοπόρους. Η κορυφογραμμή του Νότιου Πηλίου προσφέρει εκπληκτική θέα και στις δύο πλευρές της χερσονήσου — Παγασητικός και Αιγαίο — με φόντο τη Σκιάθο και τη Σκόπελο.',
    tags: ['Ορεινή', 'Πανοραμική Θέα', 'Έμπειροι'],
    icon: '🏔️',
  },
]

const STAT_STYLE = 'flex flex-col items-center p-3 bg-cream/70 border border-deep-wood/8 rounded-sm'

export default function HikingMode() {
  return (
    <section id="hiking" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Heading */}
        <div className="text-center mb-16">
          <p className="text-xs tracking-widest uppercase text-olive mb-3">Πεζοπορία</p>
          <h2 className="font-serif text-4xl sm:text-5xl text-deep-wood mb-4">
            Μονοπάτια Νότιου Πηλίου
          </h2>
          <p className="text-deep-wood/50 text-sm max-w-lg mx-auto">
            Εξερευνήστε τα ιστορικά μονοπάτια της χερσονήσου, από παράκτιες διαδρομές
            έως κορυφογραμμές με θέα δύο θαλασσών
          </p>
        </div>

        {/* Trails */}
        <div className="space-y-6">
          {TRAILS.map(trail => (
            <div
              key={trail.id}
              className="border border-deep-wood/8 hover:border-olive/40 transition-colors group"
            >
              <div className="p-6 sm:p-8">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  {/* Icon + difficulty */}
                  <div className="shrink-0 flex md:flex-col items-center gap-4 md:gap-3">
                    <div className="w-16 h-16 bg-cream flex items-center justify-center text-4xl border border-deep-wood/8">
                      {trail.icon}
                    </div>
                    <span
                      className={`text-xs font-medium px-3 py-1 border rounded-full ${trail.difficultyColor}`}
                    >
                      {trail.difficulty}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="font-serif text-2xl text-deep-wood mb-2 group-hover:text-olive transition-colors">
                      {trail.name}
                    </h3>
                    <p className="text-deep-wood/55 text-sm leading-relaxed mb-5">{trail.description}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-5">
                      {trail.tags.map(t => (
                        <span key={t} className="text-xs text-olive border border-olive/30 px-2.5 py-1 rounded-sm">
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-2">
                      <div className={STAT_STYLE}>
                        <span className="text-lg mb-1">📏</span>
                        <span className="text-sm font-semibold text-deep-wood">{trail.distance}</span>
                        <span className="text-xs text-deep-wood/40 mt-0.5">Απόσταση</span>
                      </div>
                      <div className={STAT_STYLE}>
                        <span className="text-lg mb-1">⏱</span>
                        <span className="text-sm font-semibold text-deep-wood">{trail.duration}</span>
                        <span className="text-xs text-deep-wood/40 mt-0.5">Χρόνος</span>
                      </div>
                      <div className={STAT_STYLE}>
                        <span className="text-lg mb-1">🔺</span>
                        <span className="text-sm font-semibold text-deep-wood">{trail.elevation}</span>
                        <span className="text-xs text-deep-wood/40 mt-0.5">Υψόμ.</span>
                      </div>
                      <div className={STAT_STYLE}>
                        <span className="text-lg mb-1">📍</span>
                        <span className="text-xs font-semibold text-deep-wood text-center leading-tight">{trail.start}</span>
                        <span className="text-xs text-deep-wood/40 mt-0.5">Εκκίνηση</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-deep-wood/30 mt-8">
          Πάντα ρωτήστε στην υποδοχή για τελευταία ενημέρωση σχετικά με τις συνθήκες των μονοπατιών
        </p>
      </div>
    </section>
  )
}
