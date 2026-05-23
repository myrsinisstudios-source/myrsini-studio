'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

const CATEGORIES = ['restaurant', 'cafe', 'beach', 'viewpoint', 'museum', 'bar', 'supermarket'] as const
type Category = typeof CATEGORIES[number]

const CATEGORY_LABELS: Record<Category, string> = {
  restaurant: 'Εστιατόριο', cafe: 'Καφέ', beach: 'Παραλία',
  viewpoint: 'Θέα', museum: 'Μουσείο', bar: 'Μπαρ', supermarket: 'Super Market',
}

const CATEGORY_ICONS: Record<Category, string> = {
  restaurant: '🍽️', cafe: '☕', beach: '🏖️',
  viewpoint: '🔭', museum: '🏛️', bar: '🍹', supermarket: '🛒',
}

type POI = {
  id: string
  name: string
  category: Category
  lat: number
  lon: number
  address?: string
  phone?: string
  website?: string
  opening_hours?: string
  sort_order: number
  active: boolean
}

const EMPTY: Omit<POI, 'id'> = {
  name: '', category: 'restaurant', lat: 39.1003, lon: 23.3731,
  address: '', phone: '', website: '', opening_hours: '', sort_order: 0, active: true,
}
type SaveState = 'idle' | 'saving' | 'saved' | 'error'

export default function AdminPoisPage() {
  const supabase = createClient()
  const [pois, setPois] = useState<POI[]>([])
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState<string | null>(null)
  const [state, setState] = useState<SaveState>('idle')
  const [deleting, setDeleting] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [dbError, setDbError] = useState('')

  const load = () =>
    supabase.from('local_pois').select('*').order('sort_order').then(({ data, error }) => {
      if (error) setDbError(error.message)
      else setDbError('')
      setPois((data as POI[]) ?? [])
      setLoaded(true)
    })

  useEffect(() => { load() }, [])

  const autoSave = (key: string, value: string | number | boolean) => {
    if (!editId) return
    supabase.from('local_pois').update({ [key]: value }).eq('id', editId).then(() => {})
  }

  const handleSubmit = async () => {
    setState('saving')
    const payload = {
      name: form.name,
      category: form.category,
      lat: Number(form.lat),
      lon: Number(form.lon),
      address: form.address || null,
      phone: form.phone || null,
      website: form.website || null,
      opening_hours: form.opening_hours || null,
      sort_order: form.sort_order || pois.length + 1,
      active: form.active,
    }
    let error
    if (editId) {
      ;({ error } = await supabase.from('local_pois').update(payload).eq('id', editId))
      if (!error) setEditId(null)
    } else {
      ;({ error } = await supabase.from('local_pois').insert(payload))
    }
    if (error) { setState('error'); setDbError(error.message) }
    else { setState('saved'); setTimeout(() => setState('idle'), 2000); setForm(EMPTY); load() }
  }

  const handleEdit = (p: POI) => {
    setEditId(p.id)
    setForm({ name: p.name, category: p.category, lat: p.lat, lon: p.lon, address: p.address ?? '', phone: p.phone ?? '', website: p.website ?? '', opening_hours: p.opening_hours ?? '', sort_order: p.sort_order, active: p.active })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Διαγραφή POI;')) return
    setDeleting(id)
    await supabase.from('local_pois').delete().eq('id', id)
    setDeleting(null)
    load()
  }

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-light" style={{ color: '#2C1B0E' }}>Τοπικός Οδηγός</h1>
        <p className="text-xs mt-1" style={{ color: '#8B7355' }}>Σημεία ενδιαφέροντος για το tab «Τοπικός Οδηγός»</p>
        {dbError && (
          <div className="mt-2 text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
            Σφάλμα DB: {dbError}
            {dbError.includes('does not exist') && (
              <span className="block mt-1 text-red-500">Δημιουργήστε τον πίνακα <code className="bg-red-100 px-1 rounded">local_pois</code> στο Supabase με τα πεδία: id, name, category, lat, lon, address, phone, website, opening_hours, sort_order, active.</span>
            )}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* ─── Form ─── */}
        <div className="bg-white rounded-xl p-5 space-y-3" style={{ border: '1px solid #E8E0D0' }}>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#8B7355' }}>
            {editId ? 'Επεξεργασία POI' : 'Νέο POI'}
          </p>

          <div>
            <label className="block text-[10px] uppercase tracking-wider mb-1 font-medium" style={{ color: '#8B7355' }}>Όνομα</label>
            <input value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              onBlur={e => autoSave('name', e.target.value)}
              placeholder="π.χ. Ταβέρνα Κύμα"
              className="w-full px-3 py-2 text-sm focus:outline-none rounded-lg"
              style={{ border: '1px solid #D5CCBB', background: '#FAFAF8', color: '#2C1B0E' }} />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider mb-1 font-medium" style={{ color: '#8B7355' }}>Κατηγορία</label>
            <select value={form.category}
              onChange={e => { const v = e.target.value as Category; setForm(p => ({ ...p, category: v })); autoSave('category', v) }}
              className="w-full px-3 py-2 text-sm focus:outline-none rounded-lg"
              style={{ border: '1px solid #D5CCBB', background: '#FAFAF8', color: '#2C1B0E' }}>
              {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_ICONS[c]} {CATEGORY_LABELS[c]}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {(['lat', 'lon'] as const).map(key => (
              <div key={key}>
                <label className="block text-[10px] uppercase tracking-wider mb-1 font-medium" style={{ color: '#8B7355' }}>{key === 'lat' ? 'Lat' : 'Lon'}</label>
                <input type="number" step="0.0001" value={form[key]}
                  onChange={e => setForm(p => ({ ...p, [key]: Number(e.target.value) }))}
                  onBlur={e => autoSave(key, Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm focus:outline-none rounded-lg"
                  style={{ border: '1px solid #D5CCBB', background: '#FAFAF8', color: '#2C1B0E' }} />
              </div>
            ))}
          </div>

          {([['opening_hours', 'Ώρες', 'Mo-Su 12:00-24:00'], ['phone', 'Τηλέφωνο', ''], ['address', 'Διεύθυνση', '']] as [keyof typeof form, string, string][]).map(([key, label, ph]) => (
            <div key={key}>
              <label className="block text-[10px] uppercase tracking-wider mb-1 font-medium" style={{ color: '#8B7355' }}>{label}</label>
              <input value={form[key] as string}
                onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                onBlur={e => autoSave(key as string, e.target.value)}
                placeholder={ph}
                className="w-full px-3 py-2 text-sm focus:outline-none rounded-lg"
                style={{ border: '1px solid #D5CCBB', background: '#FAFAF8', color: '#2C1B0E' }} />
            </div>
          ))}

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] uppercase tracking-wider mb-1 font-medium" style={{ color: '#8B7355' }}>Σειρά</label>
              <input type="number" value={form.sort_order}
                onChange={e => setForm(p => ({ ...p, sort_order: Number(e.target.value) }))}
                onBlur={e => autoSave('sort_order', Number(e.target.value))}
                className="w-full px-3 py-2 text-sm focus:outline-none rounded-lg"
                style={{ border: '1px solid #D5CCBB', background: '#FAFAF8', color: '#2C1B0E' }} />
            </div>
            <label className="flex items-center gap-2 mt-5 cursor-pointer">
              <input type="checkbox" checked={form.active}
                onChange={e => { const v = e.target.checked; setForm(p => ({ ...p, active: v })); autoSave('active', v) }}
                className="w-4 h-4 accent-olive" />
              <span className="text-xs" style={{ color: '#5A4A35' }}>Ενεργό</span>
            </label>
          </div>

          <div className="flex gap-2 pt-1">
            <button onClick={handleSubmit} disabled={state === 'saving' || !form.name}
              className="flex-1 py-2.5 text-xs tracking-widest uppercase text-white rounded-lg hover:opacity-90 disabled:opacity-40 transition-all"
              style={{ background: state === 'saved' ? '#22c55e' : state === 'error' ? '#ef4444' : '#C9A96E' }}>
              {state === 'saving' ? '...' : state === 'saved' ? '✓' : state === 'error' ? '✗' : editId ? 'Ενημέρωση' : 'Προσθήκη'}
            </button>
            {editId && (
              <button onClick={() => { setEditId(null); setForm(EMPTY); setState('idle') }}
                className="px-4 text-xs rounded-lg"
                style={{ border: '1px solid #D5CCBB', color: '#8B7355' }}>
                Ακύρωση
              </button>
            )}
          </div>
        </div>

        {/* ─── List ─── */}
        <div className="md:col-span-2">
          {!loaded ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-6 h-6 rounded-full border-2 border-olive/30 border-t-olive animate-spin" />
            </div>
          ) : pois.length === 0 ? (
            <div className="bg-white rounded-xl p-10 text-center" style={{ border: '1px solid #E8E0D0', color: '#A09080' }}>
              <p className="text-2xl mb-2">🗺️</p>
              <p className="text-sm">Δεν υπάρχουν POIs ακόμα. Προσθέστε το πρώτο!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {pois.map(p => (
                <div key={p.id} className="bg-white rounded-xl px-4 py-3 flex items-center gap-3 group" style={{ border: '1px solid #E8E0D0' }}>
                  <div className="w-8 h-8 rounded-full bg-cream flex items-center justify-center text-lg shrink-0">
                    {CATEGORY_ICONS[p.category]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate" style={{ color: '#5A4A35' }}>{p.name}</p>
                      {!p.active && <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-400">ανενεργό</span>}
                    </div>
                    <p className="text-[10px] mt-0.5 truncate" style={{ color: '#A09080' }}>
                      {CATEGORY_LABELS[p.category]} · {p.lat.toFixed(4)}, {p.lon.toFixed(4)}
                      {p.opening_hours && ` · ${p.opening_hours}`}
                    </p>
                  </div>
                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button onClick={() => handleEdit(p)}
                      className="text-xs px-2.5 py-1.5 rounded-lg"
                      style={{ background: 'rgba(59,130,246,0.08)', color: '#3B82F6', border: '1px solid rgba(59,130,246,0.2)' }}>✎</button>
                    <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id}
                      className="text-xs px-2.5 py-1.5 rounded-lg disabled:opacity-40"
                      style={{ background: 'rgba(239,68,68,0.08)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)' }}>✕</button>
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
