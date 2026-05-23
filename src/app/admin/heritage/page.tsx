'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

type HistoryPhoto = {
  id: string
  image_url: string
  caption: string
  caption_en?: string
  caption_de?: string
  caption_fr?: string
  sort_order: number
  tall?: boolean
}

const EMPTY = { image_url: '', caption: '', caption_en: '', caption_de: '', caption_fr: '', sort_order: 0, tall: false }
type SaveState = 'idle' | 'saving' | 'saved' | 'error'

export default function AdminHeritagePage() {
  const supabase = createClient()
  const [photos, setPhotos] = useState<HistoryPhoto[]>([])
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState<string | null>(null)
  const [state, setState] = useState<SaveState>('idle')
  const [deleting, setDeleting] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)

  const load = () =>
    supabase.from('history_photos').select('*').order('sort_order')
      .then(({ data }) => { setPhotos((data as HistoryPhoto[]) ?? []); setLoaded(true) })

  useEffect(() => { load() }, [])

  const handleSubmit = async () => {
    setState('saving')
    const payload = {
      image_url: form.image_url,
      caption: form.caption,
      caption_en: form.caption_en,
      caption_de: form.caption_de,
      caption_fr: form.caption_fr,
      sort_order: form.sort_order || photos.length + 1,
      tall: form.tall,
    }
    let error
    if (editId) {
      ;({ error } = await supabase.from('history_photos').update(payload).eq('id', editId))
      if (!error) setEditId(null)
    } else {
      ;({ error } = await supabase.from('history_photos').insert(payload))
    }
    if (error) { setState('error') }
    else { setState('saved'); setTimeout(() => setState('idle'), 2000); setForm(EMPTY); load() }
  }

  const handleEdit = (p: HistoryPhoto) => {
    setEditId(p.id)
    setForm({ image_url: p.image_url, caption: p.caption, caption_en: p.caption_en ?? '', caption_de: p.caption_de ?? '', caption_fr: p.caption_fr ?? '', sort_order: p.sort_order, tall: p.tall ?? false })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Διαγραφή φωτογραφίας;')) return
    setDeleting(id)
    await supabase.from('history_photos').delete().eq('id', id)
    setDeleting(null)
    load()
  }

  if (!loaded) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-6 h-6 rounded-full border-2 border-olive/30 border-t-olive animate-spin" />
    </div>
  )

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-light" style={{ color: '#2C1B0E' }}>Heritage — Masonry Grid</h1>
        <p className="text-xs mt-1" style={{ color: '#8B7355' }}>Φωτογραφίες για το masonry grid της ενότητας Ιστορία / Κληρονομιά</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* ─── Form ─── */}
        <div className="bg-white rounded-xl p-5 space-y-4" style={{ border: '1px solid #E8E0D0' }}>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#8B7355' }}>
            {editId ? 'Επεξεργασία' : 'Νέα Φωτογραφία'}
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-[10px] uppercase tracking-wider mb-1.5 font-medium" style={{ color: '#8B7355' }}>URL Εικόνας</label>
              <input
                value={form.image_url}
                onChange={e => setForm(p => ({ ...p, image_url: e.target.value }))}
                placeholder="https://... (Cloudinary)"
                className="w-full px-3 py-2 text-sm focus:outline-none rounded-lg"
                style={{ border: '1px solid #D5CCBB', background: '#FAFAF8', color: '#2C1B0E' }}
              />
              {form.image_url && (
                <div className="mt-2 h-28 overflow-hidden rounded-lg border border-gray-100">
                  <img src={form.image_url} alt="" className="w-full h-full object-cover"
                    onError={e => (e.currentTarget.style.display = 'none')} />
                </div>
              )}
            </div>

            {(['caption:ΕΛ', 'caption_en:EN', 'caption_de:DE', 'caption_fr:FR'] as const).map(entry => {
              const [key, lang] = entry.split(':') as [keyof typeof form, string]
              return (
                <div key={key}>
                  <label className="block text-[10px] uppercase tracking-wider mb-1.5 font-medium" style={{ color: '#8B7355' }}>Λεζάντα ({lang})</label>
                  <input
                    value={form[key] as string}
                    onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    placeholder="π.χ. Η Αυλή"
                    className="w-full px-3 py-2 text-sm focus:outline-none rounded-lg"
                    style={{ border: '1px solid #D5CCBB', background: '#FAFAF8', color: '#2C1B0E' }}
                  />
                </div>
              )
            })}

            <div>
              <label className="block text-[10px] uppercase tracking-wider mb-1.5 font-medium" style={{ color: '#8B7355' }}>Σειρά</label>
              <input
                type="number"
                value={form.sort_order}
                onChange={e => setForm(p => ({ ...p, sort_order: Number(e.target.value) }))}
                className="w-full px-3 py-2 text-sm focus:outline-none rounded-lg"
                style={{ border: '1px solid #D5CCBB', background: '#FAFAF8', color: '#2C1B0E' }}
              />
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={form.tall}
                onChange={e => setForm(p => ({ ...p, tall: e.target.checked }))}
                className="w-4 h-4 accent-olive"
              />
              <span className="text-xs" style={{ color: '#5A4A35' }}>Ψηλή κάρτα (tall)</span>
            </label>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              onClick={handleSubmit}
              disabled={state === 'saving' || !form.image_url}
              className="flex-1 py-2.5 text-xs tracking-widest uppercase text-white rounded-lg transition-all hover:opacity-90 disabled:opacity-40"
              style={{ background: state === 'saved' ? '#22c55e' : state === 'error' ? '#ef4444' : '#C9A96E' }}
            >
              {state === 'saving' ? '...' : state === 'saved' ? '✓' : state === 'error' ? '✗' : editId ? 'Ενημέρωση' : 'Προσθήκη'}
            </button>
            {editId && (
              <button
                onClick={() => { setEditId(null); setForm(EMPTY); setState('idle') }}
                className="px-4 text-xs rounded-lg transition-colors"
                style={{ border: '1px solid #D5CCBB', color: '#8B7355' }}
              >
                Ακύρωση
              </button>
            )}
          </div>
        </div>

        {/* ─── Grid preview ─── */}
        <div className="md:col-span-2">
          {photos.length === 0 ? (
            <div className="bg-white rounded-xl p-10 text-center" style={{ border: '1px solid #E8E0D0', color: '#A09080' }}>
              <p className="text-sm">Δεν υπάρχουν φωτογραφίες ακόμα.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {photos.map((p, idx) => (
                <div
                  key={p.id}
                  className={`relative group overflow-hidden rounded-lg ${p.tall || idx % 3 === 0 ? 'row-span-2' : ''}`}
                  style={{ border: '1px solid #E8E0D0' }}
                >
                  <div
                    className={`${p.tall || idx % 3 === 0 ? 'h-56' : 'h-32'} bg-[#F5F0E8]`}
                    style={p.image_url
                      ? { backgroundImage: `url('${p.image_url}')`, backgroundSize: 'cover', backgroundPosition: 'center' }
                      : undefined
                    }
                  >
                    {!p.image_url && (
                      <div className="w-full h-full flex items-center justify-center text-xs" style={{ color: '#A09080' }}>Χωρίς εικόνα</div>
                    )}
                  </div>
                  <div className="p-2 bg-white">
                    <p className="text-xs font-medium truncate" style={{ color: '#5A4A35' }}>{p.caption || '—'}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: '#A09080' }}>#{p.sort_order}{p.tall ? ' · tall' : ''}</p>
                  </div>
                  <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(p)}
                      className="text-xs px-2 py-1 rounded shadow-sm"
                      style={{ background: 'rgba(255,255,255,0.92)', color: '#3B82F6' }}
                    >✎</button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={deleting === p.id}
                      className="text-xs px-2 py-1 rounded shadow-sm disabled:opacity-40"
                      style={{ background: 'rgba(255,255,255,0.92)', color: '#EF4444' }}
                    >✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
