'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

type HistoryPhoto = { id: string; image_url: string; caption: string; sort_order: number }

const EMPTY = { image_url: '', caption: '', sort_order: 0 }

export default function AdminHistoryPage() {
  const supabase = createClient()
  const [photos, setPhotos] = useState<HistoryPhoto[]>([])
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const load = () =>
    supabase.from('history_photos').select('*').order('sort_order').then(({ data }) => setPhotos((data as HistoryPhoto[]) ?? []))

  useEffect(() => { load() }, [])

  const handleSubmit = async () => {
    setLoading(true)
    if (editId) {
      await supabase.from('history_photos').update(form).eq('id', editId)
      setEditId(null)
    } else {
      await supabase.from('history_photos').insert({ ...form, sort_order: form.sort_order || photos.length + 1 })
    }
    setForm(EMPTY)
    setLoading(false)
    load()
  }

  const handleEdit = (p: HistoryPhoto) => {
    setEditId(p.id)
    setForm({ image_url: p.image_url, caption: p.caption, sort_order: p.sort_order })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Διαγραφή φωτογραφίας;')) return
    setDeleting(id)
    await supabase.from('history_photos').delete().eq('id', id)
    setDeleting(null)
    load()
  }

  return (
    <div>
      <h1 className="text-2xl font-light text-deep-wood mb-8 font-serif">Masonry Grid — Ιστορία</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Form */}
        <div className="bg-white shadow-sm p-6">
          <h2 className="font-medium text-deep-wood mb-6">{editId ? 'Επεξεργασία' : 'Νέα Φωτογραφία'}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">URL Εικόνας</label>
              <input value={form.image_url} onChange={e => setForm(p => ({ ...p, image_url: e.target.value }))}
                placeholder="https://..."
                className="w-full border border-gray-300 px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:border-olive" />
              {form.image_url && (
                <div className="mt-2 h-32 overflow-hidden border border-gray-100">
                  <img src={form.image_url} alt="preview" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Λεζάντα</label>
              <input value={form.caption} onChange={e => setForm(p => ({ ...p, caption: e.target.value }))}
                placeholder="π.χ. Θέα Κόλπου"
                className="w-full border border-gray-300 px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:border-olive" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Σειρά</label>
              <input type="number" value={form.sort_order} onChange={e => setForm(p => ({ ...p, sort_order: Number(e.target.value) }))}
                className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-olive" />
            </div>
            <div className="flex gap-3">
              <button onClick={handleSubmit} disabled={loading || !form.image_url}
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

        {/* Grid */}
        <div className="md:col-span-2">
          <div className="grid grid-cols-3 gap-3">
            {photos.map(p => (
              <div key={p.id} className="relative group overflow-hidden rounded-sm border border-gray-100">
                <div className="h-32 bg-gray-100"
                  style={p.image_url ? { backgroundImage: `url('${p.image_url}')`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}>
                  {!p.image_url && <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">Χωρίς εικόνα</div>}
                </div>
                <div className="p-2 bg-white">
                  <p className="text-xs text-gray-600 truncate">{p.caption || '—'}</p>
                  <p className="text-xs text-gray-400">#{p.sort_order}</p>
                </div>
                <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(p)} className="text-xs bg-white/90 text-blue-500 px-1.5 py-0.5 shadow">✎</button>
                  <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id}
                    className="text-xs bg-white/90 text-red-500 px-1.5 py-0.5 shadow disabled:opacity-40">✕</button>
                </div>
              </div>
            ))}
            {photos.length === 0 && (
              <div className="col-span-3 py-12 text-center text-gray-400 text-sm bg-white shadow-sm">
                Δεν υπάρχουν φωτογραφίες ακόμα.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
