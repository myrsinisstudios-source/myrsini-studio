export default function WeatherWidget() {
  return (
    <section className="bg-[#4a5d45] py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 text-white text-center">
          <div>
            <p className="text-4xl font-light mb-2">24°C</p>
            <p className="text-white/70 text-sm">Θερμοκρασία</p>
          </div>
          <div>
            <p className="text-4xl font-light mb-2">22°C</p>
            <p className="text-white/70 text-sm">Θάλασσα</p>
          </div>
          <div>
            <p className="text-4xl font-light mb-2">12 km/h</p>
            <p className="text-white/70 text-sm">Άνεμος</p>
          </div>
        </div>
        <p className="text-center text-white/50 text-xs mt-6">
          Χόρτο Πηλίου · Σήμερα
        </p>
      </div>
    </section>
  )
}
