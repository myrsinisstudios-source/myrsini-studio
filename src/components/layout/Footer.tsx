export default function Footer() {
  return (
    <footer className="bg-[#2C1B0E] text-white py-16">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-12">
        <div>
          <h3 className="font-light text-lg tracking-[-0.02em] mb-4">Myrsini Studios</h3>
          <p className="text-white/50 text-sm leading-relaxed">
            Παραδοσιακά καταλύματα στο Χόρτο Πηλίου. Πέτρα, θάλασσα και ησυχία.
          </p>
        </div>
        <div>
          <h4 className="text-white/70 text-xs tracking-widest uppercase mb-4">Επικοινωνία</h4>
          <div className="space-y-2 text-sm text-white/50">
            <p>+30 694 457 1280</p>
            <p>myrsinisstudios@gmail.com</p>
            <p>Χόρτο, Πήλιο 37010</p>
          </div>
        </div>
        <div>
          <h4 className="text-white/70 text-xs tracking-widest uppercase mb-4">Κράτηση</h4>
          <div className="space-y-2 text-sm text-white/50">
            <a href="#apartments" className="block hover:text-white transition-colors">Άμεση Κράτηση</a>
            <a href="https://www.booking.com" className="block hover:text-white transition-colors">Booking.com</a>
            <a href="https://www.airbnb.com" className="block hover:text-white transition-colors">Airbnb</a>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 mt-12 pt-8 border-t border-white/10 text-center text-white/30 text-xs">
        © 2026 Myrsini Studios · Χόρτο Πηλίου
      </div>
    </footer>
  )
}