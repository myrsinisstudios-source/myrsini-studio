export default function HeritageSlider() {
  const photos = [
    { label: 'Χόρτο, 1960' },
    { label: 'Παραλία Πηλίου, 1970' },
    { label: 'Παραδοσιακό σπίτι, 1955' },
    { label: 'Ψαράδες, 1965' },
    { label: 'Χόρτο, 1975' },
  ]

  return (
    <section className="bg-[#2C1B0E] py-12 overflow-hidden">
      <p className="text-center text-white/40 text-xs tracking-widest uppercase mb-8">
        Παλιές Αναμνήσεις
      </p>
      <div className="flex gap-6 animate-scroll">
        {[...photos, ...photos].map((p, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-64 h-40 bg-[#4a5d45]/20 border border-white/10 flex items-end p-4"
          >
            <span className="text-white/50 text-xs">{p.label}</span>
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
          width: max-content;
        }
      `}</style>
    </section>
  )
}
