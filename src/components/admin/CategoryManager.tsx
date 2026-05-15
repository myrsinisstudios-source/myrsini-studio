'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const EMOJI_OPTIONS = [
  '🏠','💡','💧','🛁','🔧','🚗','🍽️','📦',
  '👨‍🔧','🌿','📊','💰','🏦','🔑','🛡️','🖥️',
  '🧹','❄️','☀️','📱','🔌','🚿','🪴','🎯',
]

const COLOR_OPTIONS = [
  '#ef4444','#f97316','#eab308','#22c55e',
  '#3b82f6','#8b5cf6','#ec4899','#6b7280',
  '#14b8a6','#f43f5e','#a855f7','#0ea5e9',
]

type Category = {
  id: string
  name_el: string
  icon: string
  color: string
  is_active: boolean
  sort_order: number
}

export default function CategoryManager({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const supabase = createClient()
  const [form, setForm] = useState({ name_el: '', icon: '🏠', color: '#ef4444' })
  const [loading, setLoading] = useState(false)
  const [toggling, setToggling] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleAdd = async () => {
    if (!form.name_el.trim()) return
    setLoading(true)
    await supabase.from('expense_categories').insert({
      name_el: form.name_el.trim(),
      icon: form.icon,
      color: form.color,
      is_active: true,
      sort_order: categories.length + 1,
    })
    setForm({ name_el: '', icon: '🏠', color: '#ef4444' })
    setLoading(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 2000)
    router.refresh()
  }

  const handleToggle = async (cat: Category) => {
    setToggling(cat.id)
    await supabase
      .from('expense_categories')
      .update({ is_active: !cat.is_active })
      .eq('id', cat.id)
    setToggling(null)
    router.refresh()
  }

  const active = categories.filter(c => c.is_active)
  const inactive = categories.filter(c => !c.is_active)

  return (
    <div className="bg-white shadow-sm p-6">
      <h2 className="font-medium text-[#2C1B0E] mb-6">Κατηγορίες Εξόδων</h2>

      {/* Active categories */}
      {active.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Ενεργές</p>
          <div className="space-y-1">
            {active.map(c => (
              <div key={c.id} className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 group">
                <div className="flex items-center gap-3">
                  <span className="text-base">{c.icon}</span>
                  <span className="text-sm text-[#2C1B0E]">{c.name_el}</span>
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: c.color }}
                  />
                </div>
                <button
                  onClick={() => handleToggle(c)}
                  disabled={toggling === c.id}
                  className="text-xs text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                >
                  {toggling === c.id ? '...' : 'Απενεργοποίηση'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inactive categories */}
      {inactive.length > 0 && (
        <div className="mb-6">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Ανενεργές</p>
          <div className="space-y-1">
            {inactive.map(c => (
              <div key={c.id} className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 group">
                <div className="flex items-center gap-3">
                  <span className="text-base opacity-40">{c.icon}</span>
                  <span className="text-sm text-gray-400 line-through">{c.name_el}</span>
                </div>
                <button
                  onClick={() => handleToggle(c)}
                  disabled={toggling === c.id}
                  className="text-xs text-green-600 hover:text-green-800 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                >
                  {toggling === c.id ? '...' : 'Ενεργοποίηση'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {categories.length > 0 && <div className="border-t border-gray-100 my-5" />}

      {/* Add new */}
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-4">Νέα Κατηγορία</p>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Όνομα (π.χ. ΔΕΗ, Νερό, ΕΝΦΙΑ)"
            value={form.name_el}
            onChange={e => setForm(p => ({ ...p, name_el: e.target.value }))}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            className="w-full border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#4a5d45]"
          />

          <div>
            <p className="text-xs text-gray-500 mb-2">Εικονίδιο</p>
            <div className="flex flex-wrap gap-1.5">
              {EMOJI_OPTIONS.map(e => (
                <button
                  key={e}
                  onClick={() => setForm(p => ({ ...p, icon: e }))}
                  className={`text-lg p-1.5 rounded transition-all ${
                    form.icon === e
                      ? 'bg-[#4a5d45]/15 ring-1 ring-[#4a5d45] scale-110'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-2">Χρώμα</p>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map(c => (
                <button
                  key={c}
                  onClick={() => setForm(p => ({ ...p, color: c }))}
                  className={`w-6 h-6 rounded-full transition-transform ${
                    form.color === c ? 'scale-125 ring-2 ring-offset-1 ring-gray-400' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          {form.name_el.trim() && (
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 text-sm text-gray-700 rounded">
              <span>{form.icon}</span>
              <span>{form.name_el}</span>
              <span className="w-2 h-2 rounded-full ml-1" style={{ backgroundColor: form.color }} />
            </div>
          )}

          <button
            onClick={handleAdd}
            disabled={loading || !form.name_el.trim()}
            className={`w-full py-2.5 text-xs tracking-widest uppercase transition-colors disabled:opacity-40 ${
              success
                ? 'bg-green-600 text-white'
                : 'bg-[#2C1B0E] text-white hover:bg-[#4a5d45]'
            }`}
          >
            {loading ? 'Προσθήκη...' : success ? '✓ Αποθηκεύτηκε' : '+ Προσθήκη Κατηγορίας'}
          </button>
        </div>
      </div>
    </div>
  )
}
