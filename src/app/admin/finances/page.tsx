import { createClient } from '@/lib/supabase/server'
import FinancialDashboard from '@/components/admin/FinancialDashboard'
import ExpenseForm from '@/components/admin/ExpenseForm'

async function getData() {
  try {
    const supabase = await createClient()
    const [bookingsRes, expensesRes, categoriesRes] = await Promise.all([
      supabase.from('bookings').select('*').order('check_in', { ascending: false }),
      supabase.from('expenses').select('*, expense_categories(name_el, icon, color)').order('expense_date', { ascending: false }),
      supabase.from('expense_categories').select('*').eq('is_active', true).order('sort_order'),
    ])
    return {
      bookings: bookingsRes.data ?? [],
      expenses: expensesRes.data ?? [],
      categories: categoriesRes.data ?? [],
    }
  } catch {
    return { bookings: [], expenses: [], categories: [] }
  }
}

export default async function FinancesPage() {
  const { bookings, expenses, categories } = await getData()

  return (
    <div>
      <h1 className="text-2xl font-light text-deep-wood mb-8 font-serif">Οικονομικά</h1>
      <FinancialDashboard bookings={bookings} expenses={expenses} />

      <div className="mt-12 grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white shadow-sm p-6">
            <h2 className="font-medium text-deep-wood mb-6">Έξοδα</h2>
            <div className="space-y-3">
              {expenses.length === 0 && (
                <p className="text-sm text-gray-500">Δεν υπάρχουν έξοδα ακόμα</p>
              )}
              {expenses.map((e: Record<string, unknown>) => (
                <div key={e.id as string} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{(e.expense_categories as Record<string, string> | null)?.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-deep-wood">
                        {(e.description as string) || (e.expense_categories as Record<string, string> | null)?.name_el}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(e.expense_categories as Record<string, string> | null)?.name_el} · {e.expense_date as string}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-red-500">-€{Number(e.amount).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <ExpenseForm categories={categories} />
        </div>
      </div>
    </div>
  )
}
