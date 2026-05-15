'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

type SliderPhoto = { id: string; image_url: string; title: string; sort_order: number }

const EMPTY = { image_url: '', title: '', sort_order: 0 }

export default function AdminSliderPage() {
  const supabase = createClient()
  const [photos, setPhotos] = useState<SliderPhoto[]>([])
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const load = () =>
    supabase.from('slider_photos').select('*').order('sort_order').then(({ data }) => setPhotos((data as SliderPhoto[]) ?? []))

  useEffect(() => { load() }, [])

  const handleSubmit = async () => {
    setLoading(true)
    if (editId) {
      await supabase.from('slider_photos').update(form).eq('id', editId)
      setEditId(null)
    } else {
      await supabase.from('slider_photos').insert({ ...form, sort_order: form.sort_order || photos.length + 1 })
    }
    setForm(EMPTY)
    setLoading(false)
    load()
  }

  const handleEdit = (p: SliderPhoto) => {
    setEditId(p.id)
    setForm({ image_url: p.image_url, title: p.title, sort_order: p.sort_order })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Διαγραφή φωτογραφίας;')) return
    setDeleting(id)
    await supabase.from('slider_photos').delete().eq('id', id)
    setDeleting(null)
    load()
  }

  return (
    <div>
      <h1 className="text-2xl font-light text-deep-wood mb-2 font-serif">Heritage Slider</h1>
      <p className="text-sm text-gray-400 mb-8">Φωτογραφίες που κυλούν στη λωρίδα «Παλιές Αναμνήσεις»</p>

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
                <div className="mt-2 h-28 overflow-hidden border border-gray-100">
                  <img src={form.image_url} alt="preview" className="w-full h-full object-cover"
                    onError={e => (e.currentTarget.style.display = 'none')} />
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Τίτλος / Λεζάντα</label>
              <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                placeholder="π.χ. Χόρτο, 1960"
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

        {/* List */}
        <div className="md:col-span-2 space-y-3">
          {/* Preview strip */}
          {photos.length > 0 && (
            <div className="bg-[#2C1B0E] p-4 overflow-hidden mb-6">
              <p className="text-white/40 text-xs mb-3 uppercase tracking-wider">Προεπισκόπηση Slider</p>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {photos.map(p => (
                  <div key={p.id} className="flex-shrink-0 w-40 h-28 border border-white/10 flex items-end p-2 overflow-hidden"
                    style={p.image_url ? { backgroundImage: `url('${p.image_url}')`, backgroundSize: 'cover', backgroundPosition: 'center' } : { background: '#4a5d4520' }}>
                    <span className="text-white/60 text-xs">{p.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Table */}
          {photos.map((p, idx) => (
            <div key={p.id} className="bg-white shadow-sm p-4 flex items-center gap-4">
              <span className="text-gray-400 text-sm w-6 text-center shrink-0">{idx + 1}</span>
              <div className="w-20 h-14 shrink-0 overflow-hidden border border-gray-100"
                style={p.image_url ? { backgroundImage: `url('${p.image_url}')`, backgroundSize: 'cover', backgroundPosition: 'center' } : { background: '#f5f5f5' }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-deep-wood">{p.title || '—'}</p>
                <p className="text-xs text-gray-400 truncate">{p.image_url}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => handleEdit(p)} className="text-xs text-blue-500 hover:text-blue-700 px-3 py-1.5 border border-blue-200 hover:border-blue-400">✎</button>
                <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id}
                  className="text-xs text-red-400 hover:text-red-600 px-3 py-1.5 border border-red-200 hover:border-red-400 disabled:opacity-40">✕</button>
              </div>
            </div>
          ))}
          {photos.length === 0 && (
            <div className="bg-white shadow-sm p-8 text-center text-gray-400 text-sm">
              Δεν υπάρχουν φωτογραφίες ακόμα.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
