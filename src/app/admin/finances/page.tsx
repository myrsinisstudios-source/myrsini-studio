import { createClient } from '@/lib/supabase/server'
import ExpenseForm from '@/components/admin/ExpenseForm'

export default async function FinancesPage() {
  const supabase = await createClient()

  const { data: expenses } = await supabase
    .from('expenses')
    .select('*, expense_categories(name_el, icon, color)')
    .order('expense_date', { ascending: false })

  const { data: categories } = await supabase
    .from('expense_categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')

  const total = expenses?.reduce((acc, e) => acc + Number(e.amount), 0) || 0

  return (
    <div>
      <h1 className="text-2xl font-light text-[#2C1B0E] mb-8">Οικονομικά</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-medium text-[#2C1B0E]">Έξοδα</h2>
              <span className="text-red-500 font-medium">-€{total.toFixed(2)}</span>
            </div>
            {expenses?.length === 0 && (
              <p className="text-sm text-gray-600">Δεν υπάρχουν έξοδα ακόμα</p>
            )}
            <div className="space-y-3">
              {expenses?.map((e) => (
                <div key={e.id} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{e.expense_categories?.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-[#2C1B0E]">{e.description || e.expense_categories?.name_el}</p>
                      <p className="text-xs text-gray-600">{e.expense_categories?.name_el} · {e.expense_date}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-red-500">-€{Number(e.amount).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <ExpenseForm categories={categories || []} />
        </div>
      </div>
    </div>
  )
}