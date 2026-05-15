export default function StatsCards({ summary }: { summary: any[] | null }) {
  const totalRevenue = summary?.reduce((acc, s) => acc + (s.net_revenue || 0), 0) || 0
  const totalExpenses = summary?.reduce((acc, s) => acc + (s.total_expenses || 0), 0) || 0
  const totalProfit = summary?.reduce((acc, s) => acc + (s.net_profit || 0), 0) || 0
  const totalBookings = summary?.reduce((acc, s) => acc + (s.bookings_count || 0), 0) || 0

  const cards = [
    { label: 'Έσοδα', value: `€${totalRevenue.toFixed(0)}`, color: 'text-[#4a5d45]', bg: 'bg-[#4a5d45]/10' },
    { label: 'Έξοδα', value: `€${totalExpenses.toFixed(0)}`, color: 'text-red-500', bg: 'bg-red-50' },
    { label: 'Καθαρό Κέρδος', value: `€${totalProfit.toFixed(0)}`, color: 'text-[#2C1B0E]', bg: 'bg-[#2C1B0E]/5' },
    { label: 'Κρατήσεις', value: totalBookings.toString(), color: 'text-blue-600', bg: 'bg-blue-50' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.label} className={`${card.bg} p-6 rounded-sm`}>
          <p className="text-xs text-gray-700 uppercase tracking-wider mb-2">{card.label}</p>
          <p className={`text-2xl font-light ${card.color}`}>{card.value}</p>
        </div>
      ))}
    </div>
  )
}