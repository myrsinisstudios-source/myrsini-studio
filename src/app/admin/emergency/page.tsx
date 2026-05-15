'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

type Contact = {
  id: string
  icon: string
  label: string
  number: string
  description: string
  category: string
  sort_order: number
}

const EMPTY = { icon: '📞', label: '', number: '', description: '', category: 'Χρήσιμα', sort_order: 0 }
const EMOJIS = ['🚔','🚒','🚑','⚓','🏥','👮','🩺','⚡','🌿','🚕','⛽','🏦','📞','🔑','🌊','🏛️']
const CATEGORIES = ['Εθνική Ανάγκη', 'Τοπικά', 'Χρήσιμα']

export default function AdminEmergencyPage() {
  const supabase = createClient()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const load = () =>
    supabase.from('emergency_contacts').select('*').order('sort_order').then(({ data }) => setContacts((data as Contact[]) ?? []))

  useEffect(() => { load() }, [])

  const handleSubmit = async () => {
    if (!form.label || !form.number) return
    setLoading(true)
    if (editId) {
      await supabase.from('emergency_contacts').update(form).eq('id', editId)
      setEditId(null)
    } else {
      await supabase.from('emergency_contacts').insert(form)
    }
    setForm(EMPTY)
    setLoading(false)
    load()
  }

  const handleEdit = (c: Contact) => {
    setEditId(c.id)
    setForm({ icon: c.icon, label: c.label, number: c.number, description: c.description, category: c.category, sort_order: c.sort_order })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Διαγραφή;')) return
    setDeleting(id)
    await supabase.from('emergency_contacts').delete().eq('id', id)
    setDeleting(null)
    load()
  }

  const grouped = contacts.reduce<Record<string, Contact[]>>((acc, c) => {
    if (!acc[c.category]) acc[c.category] = []
    acc[c.category].push(c)
    return acc
  }, {})

  return (
    <div>
      <h1 className="text-2xl font-light text-deep-wood mb-8 font-serif">Αριθμοί Έκτακτης Ανάγκης</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Form */}
        <div className="bg-white shadow-sm p-6">
          <h2 className="font-medium text-deep-wood mb-6">{editId ? 'Επεξεργασία' : 'Νέα Επαφή'}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Εικονίδιο</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {EMOJIS.map(e => (
                  <button key={e} onClick={() => setForm(p => ({ ...p, icon: e }))}
                    className={`text-xl p-1.5 rounded transition-all ${form.icon === e ? 'bg-olive/15 ring-1 ring-olive' : 'hover:bg-gray-100'}`}>
                    {e}
                  </button>
                ))}
              </div>
              <input value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))}
                className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-olive" placeholder="ή πληκτρολόγησε emoji" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Κατηγορία</label>
              <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                className="w-full border border-gray-300 px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-olive">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            {[
              { key: 'label', label: 'Όνομα', placeholder: 'π.χ. Αστυνομία' },
              { key: 'number', label: 'Αριθμός', placeholder: 'π.χ. 100' },
              { key: 'description', label: 'Σημείωση', placeholder: 'π.χ. Πανελλαδικά' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">{f.label}</label>
                <input value={(form as Record<string, string | number>)[f.key] as string}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  className="w-full border border-gray-300 px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:border-olive" />
              </div>
            ))}
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Σειρά</label>
              <input type="number" value={form.sort_order}
                onChange={e => setForm(p => ({ ...p, sort_order: Number(e.target.value) }))}
                className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-olive" />
            </div>
            <div className="flex gap-3">
              <button onClick={handleSubmit} disabled={loading || !form.label || !form.number}
                className="flex-1 bg-deep-wood text-white py-2.5 text-xs tracking-widest uppercase hover:bg-olive transition-colors disabled:opacity-40">
                {loading ? '...' : editId ? 'Ενημέρωση' : 'Προσθήκη'}
              </button>
              {editId && (
                <button onClick={() => { setEditId(null); setForm(EMPTY) }}
                  className="px-4 border border-gray-300 text-xs text-gray-500 hover:border-gray-400 transition-colors">
                  Ακύρωση
                </button>
              )}
            </div>
          </div>
        </div>

        {/* List */}
        <div className="md:col-span-2 space-y-6">
          {Object.entries(grouped).map(([cat, items]) => (
            <div key={cat} className="bg-white shadow-sm p-6">
              <h3 className="text-xs uppercase tracking-wider text-gray-400 mb-4 pb-2 border-b border-gray-100">{cat}</h3>
              <div className="space-y-2">
                {items.map(c => (
                  <div key={c.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                    <span className="text-xl shrink-0">{c.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-deep-wood">{c.label}</p>
                      <p className="text-xs text-gray-400">{c.description}</p>
                    </div>
                    <span className="font-mono text-sm text-olive shrink-0">{c.number}</span>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => handleEdit(c)} className="text-xs text-blue-500 hover:text-blue-700 px-2 py-1 hover:bg-blue-50">✎</button>
                      <button onClick={() => handleDelete(c.id)} disabled={deleting === c.id}
                        className="text-xs text-red-400 hover:text-red-600 px-2 py-1 hover:bg-red-50 disabled:opacity-40">✕</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {contacts.length === 0 && (
            <div className="bg-white shadow-sm p-8 text-center text-gray-400 text-sm">
              Δεν υπάρχουν επαφές ακόμα. Προσθέστε την πρώτη.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
