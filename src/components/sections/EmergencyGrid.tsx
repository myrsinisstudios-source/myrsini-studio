const CONTACTS = [
  { category: 'Εθνική Ανάγκη', items: [
    { icon: '🚔', label: 'Αστυνομία', number: '100', note: 'Πανελλαδικά' },
    { icon: '🚒', label: 'Πυροσβεστική', number: '199', note: 'Πανελλαδικά' },
    { icon: '🚑', label: 'ΕΚΑΒ', number: '166', note: 'Ασθενοφόρο' },
    { icon: '⚓', label: 'Ακτοφυλακή', number: '108', note: 'Θαλάσσιο SOS' },
  ]},
  { category: 'Τοπικά', items: [
    { icon: '🏥', label: 'Νοσοκομείο Βόλου', number: '+30 24210 94200', note: 'Γενικό Νοσοκομείο' },
    { icon: '👮', label: 'Αστυνομία Αλμυρού', number: '+30 24220 22100', note: 'Τοπικό Τμήμα' },
    { icon: '🩺', label: 'Ιατρείο Αργαλαστής', number: '+30 24230 54400', note: 'Αγροτικό Ιατρείο' },
    { icon: '⚡', label: 'ΔΕΔΔΗΕ (ΔΕΗ)', number: '10400', note: 'Βλάβες ρεύματος' },
  ]},
  { category: 'Χρήσιμα', items: [
    { icon: '🌿', label: 'Myrsini Studios', number: '+30 694 457 1280', note: 'WhatsApp & Κλήση' },
    { icon: '🚕', label: 'Ταξί Χόρτου', number: '+30 694 000 0001', note: 'Τοπικό Ταξί' },
    { icon: '⛽', label: 'Βενζινάδικο', number: '+30 24230 65000', note: 'Αργαλαστή' },
    { icon: '🏦', label: 'Τράπεζα Αλμυρού', number: '+30 24220 21000', note: 'Πλησιέστερη' },
  ]},
]

export default function EmergencyGrid() {
  return (
    <section className="py-24 bg-deep-wood">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Heading */}
        <div className="text-center mb-14">
          <p className="text-xs tracking-widest uppercase text-olive mb-3">Χρήσιμες Πληροφορίες</p>
          <h2 className="font-serif text-4xl sm:text-5xl text-white mb-3">Αριθμοί Έκτακτης Ανάγκης</h2>
          <p className="text-white/40 text-sm">Κρατήστε αυτούς τους αριθμούς εύκολα προσβάσιμους κατά τη διαμονή σας</p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {CONTACTS.map(group => (
            <div key={group.category}>
              <h3 className="text-xs tracking-widest uppercase text-white/30 mb-4 pb-2 border-b border-white/10">
                {group.category}
              </h3>
              <div className="space-y-3">
                {group.items.map(item => (
                  <a
                    key={item.label}
                    href={`tel:${item.number.replace(/\s/g, '')}`}
                    className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 border border-white/8 hover:border-white/20 transition-all group"
                  >
                    <span className="text-2xl shrink-0">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-white/80 text-sm font-medium group-hover:text-white transition-colors truncate">
                        {item.label}
                      </div>
                      <div className="text-white/40 text-xs mt-0.5">{item.note}</div>
                    </div>
                    <span className="text-olive font-mono text-sm shrink-0 group-hover:text-white transition-colors">
                      {item.number}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* SOS highlight */}
        <div className="mt-10 p-5 border border-red-500/30 bg-red-950/20 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <span className="text-4xl">🆘</span>
          <div>
            <p className="text-white font-medium mb-1">Ευρωπαϊκός Αριθμός Έκτακτης Ανάγκης</p>
            <p className="text-white/50 text-sm">Καλέστε <strong className="text-red-400 font-mono text-lg">112</strong> από οποιοδήποτε τηλέφωνο, ακόμα και χωρίς κάρτα SIM</p>
          </div>
        </div>
      </div>
    </section>
  )
}
