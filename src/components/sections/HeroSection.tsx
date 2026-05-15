export default function HeroSection() {
  return (
    <div className="relative min-h-screen bg-deep-wood overflow-hidden">
      {/* Layered background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, #1a1008 0%, #2C1B0E 40%, #3d4a30 70%, #2C1B0E 100%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 60% 50% at 20% 70%, rgba(74,93,69,0.6) 0%, transparent 60%),
            radial-gradient(ellipse 40% 60% at 80% 20%, rgba(74,93,69,0.3) 0%, transparent 50%)
          `,
        }}
      />
      {/* Subtle grain texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center pb-48">
        {/* Location badge */}
        <div className="animate-fade-in-up inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-5 py-2 text-white/70 text-xs tracking-widest uppercase mb-10">
          🌿 Χόρτο &nbsp;·&nbsp; Νότιο Πήλιο &nbsp;·&nbsp; Ελλάδα
        </div>

        {/* Main title */}
        <h1 className="animate-fade-in-up animation-delay-200 font-serif text-white leading-tight mb-6">
          <span className="block text-5xl sm:text-7xl md:text-8xl font-normal tracking-tight">Myrsini</span>
          <span className="block text-4xl sm:text-6xl md:text-7xl font-light italic text-white/80 mt-1">Studios</span>
        </h1>

        {/* Tagline */}
        <p className="animate-fade-in-up animation-delay-400 text-white/55 text-base sm:text-lg tracking-wider max-w-sm mb-6">
          Παραδοσιακά καταλύματα &nbsp;·&nbsp; Άμεση κράτηση
        </p>

        {/* Stars */}
        <div className="animate-fade-in-up animation-delay-600 flex items-center gap-3 text-sm">
          <span className="text-amber-400 tracking-widest">★★★★★</span>
          <span className="text-white/30">|</span>
          <span className="text-white/40 text-xs tracking-widest uppercase">Best Price Guarantee</span>
        </div>
      </div>

      {/* Wave divider */}
      <svg
        className="absolute bottom-0 left-0 right-0 w-full"
        viewBox="0 0 1440 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path d="M0 60H1440V30C1200 60 960 0 720 20C480 40 240 10 0 30V60Z" fill="#F9F7F2" />
      </svg>
    </div>
  )
}
