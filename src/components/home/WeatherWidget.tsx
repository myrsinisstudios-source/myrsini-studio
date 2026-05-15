export default function WeatherWidget() {
  return (
    <section className="bg-[#4a5d45] py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-white text-center items-center">
          {/* Weather */}
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

          {/* Divider */}
          <div className="hidden md:block w-px h-12 bg-white/20 mx-auto col-span-0" />

          {/* Travel times */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-3">
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg">🚗</span>
              <div className="text-left">
                <p className="text-sm font-medium leading-tight">Λιμάνι Βόλου</p>
                <p className="text-white/60 text-xs">42 λεπτά · 37 χλμ</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg">🚗</span>
              <div className="text-left">
                <p className="text-sm font-medium leading-tight">Αερ. Νέας Αγχιάλου</p>
                <p className="text-white/60 text-xs">58 λεπτά · 54 χλμ</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-white/50 text-xs mt-6">
          Χόρτο Πηλίου · Σήμερα
        </p>
      </div>
    </section>
  )
}
