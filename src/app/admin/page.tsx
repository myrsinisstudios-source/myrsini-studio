import { createClient } from '@/lib/supabase/server'
import StatsCards from '@/components/admin/StatsCards'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  const { data: expenses } = await supabase
    .from('expenses')
    .select('*, expense_categories(name_el, icon, color)')
    .order('expense_date', { ascending: false })
    .limit(5)

  const { data: summary } = await supabase
    .from('v_monthly_summary')
    .select('*')

  return (
    <div>
      <h1 className="text-2xl font-light text-[#2C1B0E] mb-8">Dashboard</h1>
      <StatsCards summary={summary} />

      <div className="grid md:grid-cols-2 gap-8 mt-8">
        {/* Τελευταίες Κρατήσεις */}
        <div className="bg-white shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-medium text-[#2C1B0E]">Τελευταίες Κρατήσεις</h2>
            <a href="/admin/bookings" className="text-xs text-[#4a5d45] hover:underline">Όλες →</a>
          </div>
          {bookings?.length === 0 && (
            <p className="text-sm text-gray-600">Δεν υπάρχουν κρατήσεις ακόμα</p>
          )}
          <div className="space-y-3">
            {bookings?.map((b) => (
              <div key={b.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-[#2C1B0E]">{b.guest_name}</p>
                  <p className="text-xs text-gray-600">{b.check_in} → {b.check_out}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-[#4a5d45]">€{b.total_amount}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    b.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                    b.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Τελευταία Έξοδα */}
        <div className="bg-white shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-medium text-[#2C1B0E]">Τελευταία Έξοδα</h2>
            <a href="/admin/finances" className="text-xs text-[#4a5d45] hover:underline">Όλα →</a>
          </div>
          {expenses?.length === 0 && (
            <p className="text-sm text-gray-600">Δεν υπάρχουν έξοδα ακόμα</p>
          )}
          <div className="space-y-3">
            {expenses?.map((e) => (
              <div key={e.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-2">
                  <span>{e.expense_categories?.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-[#2C1B0E]">{e.expense_categories?.name_el}</p>
                    <p className="text-xs text-gray-600">{e.expense_date}</p>
                  </div>
                </div>
                <p className="text-sm font-medium text-red-500">-€{e.amount}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}