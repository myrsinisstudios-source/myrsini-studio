import Image from 'next/image'

const travelCards = [
  {
    id: 'airport',
    origin: 'Αεροδρόμιο Νέας Αγχιάλου',
    destination: 'Myrsini Studios',
    time: '58 λεπτά',
    distance: '54 χλμ',
    originImage: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&q=80',
    roadImage: 'https://images.unsplash.com/photo-1504707748692-419802cf939d?w=400&q=80',
  },
  {
    id: 'port',
    origin: 'Λιμάνι Βόλου',
    destination: 'Myrsini Studios',
    time: '42 λεπτά',
    distance: '37 χλμ',
    originImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
    roadImage: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&q=80',
  },
]

export default function WeatherWidget() {
  return (
    <>
      {/* Olive weather strip */}
      <section className="bg-[#4a5d45] py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-10 text-white text-center">
            <div>
              <p className="text-4xl font-light mb-1">24°C</p>
              <p className="text-white/70 text-sm">Θερμοκρασία</p>
            </div>
            <div>
              <p className="text-4xl font-light mb-1">22°C</p>
              <p className="text-white/70 text-sm">Θάλασσα</p>
            </div>
            <div>
              <p className="text-4xl font-light mb-1">12 km/h</p>
              <p className="text-white/70 text-sm">Άνεμος</p>
            </div>
          </div>
          <p className="text-center text-white/40 text-xs mt-5">Χόρτο Πηλίου · Σήμερα</p>
        </div>
      </section>

      {/* Premium travel cards */}
      <section className="bg-[#2C1B0E] py-16">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-center text-white/40 text-xs tracking-widest uppercase mb-12">
            Πώς να φτάσετε
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            {travelCards.map((card) => (
              <div
                key={card.id}
                className="border border-white/10 overflow-hidden group"
              >
                {/* Image row */}
                <div className="flex items-center h-36">
                  {/* Origin image */}
                  <div className="relative flex-1 h-full overflow-hidden">
                    <Image
                      src={card.originImage}
                      alt={card.origin}
                      fill
                      className="object-cover brightness-75 group-hover:scale-105 transition-transform duration-700"
                      sizes="200px"
                    />
                  </div>

                  {/* Animated arrows */}
                  <div className="flex-shrink-0 px-3 flex items-center justify-center bg-[#2C1B0E] h-full">
                    <span className="arrows text-[#c9a96e] text-xl tracking-widest select-none">›</span>
                  </div>

                  {/* Road image */}
                  <div className="relative flex-1 h-full overflow-hidden">
                    <Image
                      src={card.roadImage}
                      alt="Δρόμος"
                      fill
                      className="object-cover brightness-75 group-hover:scale-105 transition-transform duration-700"
                      sizes="200px"
                    />
                  </div>

                  {/* Animated arrows */}
                  <div className="flex-shrink-0 px-3 flex items-center justify-center bg-[#2C1B0E] h-full">
                    <span className="arrows text-[#c9a96e] text-xl tracking-widest select-none" style={{ animationDelay: '0.3s' }}>›</span>
                  </div>

                  {/* Logo destination */}
                  <div className="relative flex-1 h-full overflow-hidden bg-[#1a0f06] flex items-center justify-center">
                    <Image
                      src="/logo.png"
                      alt="Myrsini Studios"
                      width={80}
                      height={80}
                      className="object-contain opacity-90"
                    />
                  </div>
                </div>

                {/* Text row */}
                <div className="px-5 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-white/90 text-sm font-medium">{card.origin}</p>
                    <p className="text-white/40 text-xs mt-0.5">→ {card.destination}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#c9a96e] text-lg font-light">{card.time}</p>
                    <p className="text-white/40 text-xs">{card.distance}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes pulse-arrow {
          0%, 100% { opacity: 0.4; transform: translateX(0); }
          50% { opacity: 1; transform: translateX(4px); }
        }
        .arrows {
          animation: pulse-arrow 1.2s ease-in-out infinite;
          display: inline-block;
        }
      `}</style>
    </>
  )
}
