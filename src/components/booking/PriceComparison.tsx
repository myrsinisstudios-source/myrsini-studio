export default function PriceComparison({ nights, basePrice }: { nights: number, basePrice: number }) {
  const direct = nights * basePrice
  const booking = Math.round(direct * 1.15)
  const airbnb = Math.round(direct * 1.14)
  const saving = booking - direct

  return (
    <div className="mt-4 border-t border-gray-200 pt-4">
      <p className="text-xs text-gray-700 uppercase tracking-wider mb-3">Σύγκριση Τιμών</p>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-[#4a5d45]">✓ Απευθείας</span>
          <span className="text-sm font-bold text-[#4a5d45]">€{direct}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Booking.com</span>
          <span className="text-sm text-gray-600 line-through">€{booking}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Airbnb</span>
          <span className="text-sm text-gray-600 line-through">€{airbnb}</span>
        </div>
        <div className="bg-[#4a5d45]/10 p-3 mt-2">
          <p className="text-sm text-[#4a5d45] font-medium text-center">
            Εξοικονομείτε €{saving} κλείνοντας απευθείας!
          </p>
        </div>
      </div>
    </div>
  )
}