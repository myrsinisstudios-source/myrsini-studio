export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#2C1B0E]/90 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="/" className="text-white font-light tracking-[-0.02em] text-lg">
          Myrsini Studios
        </a>
        <div className="hidden md:flex items-center gap-8">
          <a href="#apartments" className="text-white/70 hover:text-white text-sm tracking-wider transition-colors">Καταλύματα</a>
          <a href="#activities" className="text-white/70 hover:text-white text-sm tracking-wider transition-colors">Δραστηριότητες</a>
          <a href="#contact" className="text-white/70 hover:text-white text-sm tracking-wider transition-colors">Επικοινωνία</a>
          <a href="#apartments" className="bg-[#4a5d45] text-white px-5 py-2 text-sm tracking-wider hover:bg-[#3a4d35] transition-colors">
            Κράτηση
          </a>
        </div>
      </div>
    </nav>
  )
}