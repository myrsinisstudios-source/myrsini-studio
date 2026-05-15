export default function Footer() {
  return (
    <footer className="bg-deep-wood text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="font-serif text-2xl text-white mb-4">Myrsini Studios</h3>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              Παραδοσιακά καταλύματα στο Χόρτο Πηλίου. Πέτρα, ελαιώνες και κρυστάλλινα νερά
              του Αιγαίου σε αδιάσπαστη αρμονία.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a
                href="https://wa.me/306944571280"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 text-xs tracking-wider hover:bg-[#1ebe5d] transition-colors"
              >
                <span>WhatsApp</span>
              </a>
              <a
                href="mailto:myrsinisstudios@gmail.com"
                className="flex items-center gap-2 border border-white/20 text-white/70 px-4 py-2 text-xs tracking-wider hover:border-white/50 hover:text-white transition-colors"
              >
                Email
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white/50 text-xs tracking-widest uppercase mb-5">Επικοινωνία</h4>
            <div className="space-y-3 text-sm text-white/60">
              <a href="tel:+306944571280" className="flex items-center gap-2 hover:text-white transition-colors">
                <span>📞</span> +30 694 457 1280
              </a>
              <a href="mailto:myrsinisstudios@gmail.com" className="flex items-center gap-2 hover:text-white transition-colors">
                <span>✉️</span> myrsinisstudios@gmail.com
              </a>
              <p className="flex items-center gap-2">
                <span>📍</span> Χόρτο, Πήλιο 37010
              </p>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white/50 text-xs tracking-widest uppercase mb-5">Κράτηση</h4>
            <div className="space-y-3 text-sm text-white/60">
              <a href="#booking" className="block hover:text-white transition-colors">Άμεση Κράτηση</a>
              <a href="#apartments" className="block hover:text-white transition-colors">Τα Καταλύματα</a>
              <a href="#hiking" className="block hover:text-white transition-colors">Πεζοπορία</a>
              <a href="#activities" className="block hover:text-white transition-colors">Δραστηριότητες</a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-white/30 text-xs">
          <span>© {new Date().getFullYear()} Myrsini Studios · Χόρτο Πηλίου, Ελλάδα</span>
          <div className="flex gap-6">
            <a href="/admin" className="hover:text-white/60 transition-colors">Admin</a>
            <span>Check-in: 14:00 · Check-out: 11:00</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
