'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function ExpenseForm({ categories }: { categories: any[] }) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    category_id: '',
    amount: '',
    description: '',
    expense_date: new Date().toISOString().split('T')[0],
  })

  const handleSubmit = async () => {
    if (!form.category_id || !form.amount) return
    setLoading(true)
    await supabase.from('expenses').insert({
      category_id: form.category_id,
      amount: Number(form.amount),
      description: form.description,
      expense_date: form.expense_date,
    })
    setForm({ category_id: '', amount: '', description: '', expense_date: new Date().toISOString().split('T')[0] })
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="bg-white shadow-sm p-6">
      <h2 className="font-medium text-[#2C1B0E] mb-6">Νέο Έξοδο</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-gray-800 uppercase tracking-wider mb-2">Κατηγορία</label>
          <select
            value={form.category_id}
            onChange={(e) => setForm({...form, category_id: e.target.value})}
            className="w-full border border-gray-300 px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#4a5d45]"
          >
            <option value="">Επιλέξτε...</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.icon} {c.name_el}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-800 uppercase tracking-wider mb-2">Ποσό (€)</label>
          <input
            type="number"
            value={form.amount}
            onChange={(e) => setForm({...form, amount: e.target.value})}
            placeholder="0.00"
            className="w-full border border-gray-300 px-4 py-3 text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:border-[#4a5d45]"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-800 uppercase tracking-wider mb-2">Περιγραφή</label>
          <input
            type="text"
            value={form.description}
            onChange={(e) => setForm({...form, description: e.target.value})}
            placeholder="π.χ. Λογαριασμός ΔΕΗ Ιουνίου"
            className="w-full border border-gray-300 px-4 py-3 text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:border-[#4a5d45]"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-800 uppercase tracking-wider mb-2">Ημερομηνία</label>
          <input
            type="date"
            value={form.expense_date}
            onChange={(e) => setForm({...form, expense_date: e.target.value})}
            className="w-full border border-gray-300 px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#4a5d45]"
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading || !form.category_id || !form.amount}
          className="w-full bg-[#2C1B0E] text-white py-3 text-sm tracking-widest uppercase hover:bg-[#4a5d45] transition-colors disabled:opacity-40"
        >
          {loading ? 'Αποθήκευση...' : 'Προσθήκη Εξόδου'}
        </button>
      </div>
    </div>
  )
}