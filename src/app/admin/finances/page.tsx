import { createClient } from '@/lib/supabase/server'
import FinancialDashboard from '@/components/admin/FinancialDashboard'
import ExpenseForm from '@/components/admin/ExpenseForm'
import CategoryManager from '@/components/admin/CategoryManager'

const fmtEur = (n: number) =>
  new Intl.NumberFormat('el-GR', { style: 'currency', currency: 'EUR' }).format(n)

async function getData() {
  try {
    const supabase = await createClient()
    const [bookingsRes, expensesRes, activeCatsRes, allCatsRes] = await Promise.all([
      supabase.from('bookings').select('*').order('check_in', { ascending: false }),
      supabase.from('expenses').select('*, expense_categories(name_el, icon, color)').order('expense_date', { ascending: false }),
      supabase.from('expense_categories').select('*').eq('is_active', true).order('sort_order'),
      supabase.from('expense_categories').select('*').order('sort_order'),
    ])
    return {
      bookings: bookingsRes.data ?? [],
      expenses: expensesRes.data ?? [],
      activeCategories: activeCatsRes.data ?? [],
      allCategories: allCatsRes.data ?? [],
    }
  } catch {
    return { bookings: [], expenses: [], activeCategories: [], allCategories: [] }
  }
}

export default async function FinancesPage() {
  const { bookings, expenses, activeCategories, allCategories } = await getData()

  return (
    <div>
      <h1 className="text-2xl font-light text-deep-wood mb-8 font-serif">Οικονομικά</h1>

      <FinancialDashboard bookings={bookings} expenses={expenses} />

      <div className="mt-12 grid md:grid-cols-3 gap-8">
        {/* Expense list */}
        <div className="md:col-span-2">
          <div className="bg-white shadow-sm p-6">
            <h2 className="font-medium text-deep-wood mb-6">Έξοδα</h2>
            {expenses.length === 0 && (
              <p className="text-sm text-gray-500 py-4">Δεν υπάρχουν έξοδα ακόμα</p>
            )}
            <div className="space-y-2">
              {expenses.map((e: Record<string, unknown>) => {
                const cat = e.expense_categories as Record<string, string> | null
                return (
                  <div
                    key={e.id as string}
                    className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{cat?.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-deep-wood">
                          {(e.description as string) || cat?.name_el}
                        </p>
                        <p className="text-xs text-gray-400">
                          {cat?.name_el} · {e.expense_date as string}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-red-500">
                      −{fmtEur(Number(e.amount))}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right column: add expense + category manager */}
        <div className="space-y-6">
          <ExpenseForm categories={activeCategories} />
          <CategoryManager categories={allCategories} />
        </div>
      </div>
    </div>
  )
}
