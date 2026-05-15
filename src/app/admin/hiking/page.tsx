'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

type Trail = {
  id: string
  name: string
  distance: string
  duration: string
  elevation: string
  difficulty: string
  description: string
  start_point: string
  tags: string[] | string
  icon: string
}

const EMPTY = { name: '', distance: '', duration: '', elevation: '', difficulty: 'Εύκολη', description: '', start_point: '', tags: '', icon: '🥾' }
const DIFFICULTIES = ['Εύκολη', 'Μέτρια', 'Δύσκολη']
const DIFF_COLOR: Record<string, string> = { 'Εύκολη': 'bg-green-100 text-green-700', 'Μέτρια': 'bg-amber-100 text-amber-700', 'Δύσκολη': 'bg-red-100 text-red-700' }

export default function AdminHikingPage() {
  const supabase = createClient()
  const [trails, setTrails] = useState<Trail[]>([])
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const load = () =>
    supabase.from('hiking_trails').select('*').order('id').then(({ data }) => setTrails((data as Trail[]) ?? []))

  useEffect(() => { load() }, [])

  const handleSubmit = async () => {
    if (!form.name) return
    setLoading(true)
    const payload = {
      ...form,
      tags: typeof form.tags === 'string'
        ? form.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
        : form.tags,
    }
    if (editId) {
      await supabase.from('hiking_trails').update(payload).eq('id', editId)
      setEditId(null)
    } else {
      await supabase.from('hiking_trails').insert(payload)
    }
    setForm(EMPTY)
    setLoading(false)
    load()
  }

  const handleEdit = (t: Trail) => {
    setEditId(t.id)
    setForm({
      name: t.name, distance: t.distance, duration: t.duration, elevation: t.elevation,
      difficulty: t.difficulty, description: t.description, start_point: t.start_point,
      tags: Array.isArray(t.tags) ? t.tags.join(', ') : t.tags ?? '',
      icon: t.icon ?? '🥾',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Διαγραφή μονοπατιού;')) return
    setDeleting(id)
    await supabase.from('hiking_trails').delete().eq('id', id)
    setDeleting(null)
    load()
  }

  return (
    <div>
      <h1 className="text-2xl font-light text-deep-wood mb-8 font-serif">Μονοπάτια Πεζοπορίας</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Form */}
        <div className="bg-white shadow-sm p-6">
          <h2 className="font-medium text-deep-wood mb-6">{editId ? 'Επεξεργασία' : 'Νέο Μονοπάτι'}</h2>
          <div className="space-y-4">
            {[
              { key: 'name', label: 'Όνομα', placeholder: 'π.χ. Χόρτο – Λαμπινού' },
              { key: 'start_point', label: 'Σημείο Εκκίνησης', placeholder: 'π.χ. Χόρτο, παραλία' },
              { key: 'icon', label: 'Εικονίδιο', placeholder: '🥾' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">{f.label}</label>
                <input value={(form as Record<string, string>)[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  className="w-full border border-gray-300 px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:border-olive" />
              </div>
            ))}

            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Δυσκολία</label>
              <select value={form.difficulty} onChange={e => setForm(p => ({ ...p, difficulty: e.target.value }))}
                className="w-full border border-gray-300 px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-olive">
                {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { key: 'distance', label: 'Απόσταση', placeholder: '8.2 km' },
                { key: 'duration', label: 'Διάρκεια', placeholder: '3ω 30λ' },
                { key: 'elevation', label: 'Υψόμετρο', placeholder: '+420 m' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">{f.label}</label>
                  <input value={(form as Record<string, string>)[f.key]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full border border-gray-300 px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:border-olive" />
                </div>
              ))}
            </div>

            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Ετικέτες (κόμμα)</label>
              <input value={typeof form.tags === 'string' ? form.tags : form.tags.join(', ')}
                onChange={e => setForm(p => ({ ...p, tags: e.target.value }))}
                placeholder="Θέα, Ελαιώνες, Ιστορικά"
                className="w-full border border-gray-300 px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:border-olive" />
            </div>

            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Περιγραφή</label>
              <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                rows={4} placeholder="Λεπτομερής περιγραφή μονοπατιού..."
                className="w-full border border-gray-300 px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:border-olive resize-none" />
            </div>

            <div className="flex gap-3">
              <button onClick={handleSubmit} disabled={loading || !form.name}
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
        <div className="md:col-span-2 space-y-4">
          {trails.map(t => (
            <div key={t.id} className="bg-white shadow-sm p-5 flex items-start gap-4">
              <div className="text-4xl w-12 h-12 flex items-center justify-center bg-cream border border-deep-wood/8 shrink-0">
                {t.icon || '🥾'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-serif text-lg text-deep-wood">{t.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${DIFF_COLOR[t.difficulty] ?? 'bg-gray-100 text-gray-600'}`}>{t.difficulty}</span>
                </div>
                <p className="text-xs text-gray-400 mb-2">{t.distance} · {t.duration} · {t.elevation} · 📍 {t.start_point}</p>
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{t.description}</p>
                {t.tags && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {(Array.isArray(t.tags) ? t.tags : (t.tags as string).split(',')).map((tag: string) => (
                      <span key={tag} className="text-xs text-olive border border-olive/30 px-2 py-0.5 rounded-sm">{tag.trim()}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button onClick={() => handleEdit(t)} className="text-xs text-blue-500 hover:text-blue-700 px-3 py-1.5 border border-blue-200 hover:border-blue-400">✎ Επεξ.</button>
                <button onClick={() => handleDelete(t.id)} disabled={deleting === t.id}
                  className="text-xs text-red-400 hover:text-red-600 px-3 py-1.5 border border-red-200 hover:border-red-400 disabled:opacity-40">✕ Διαγρ.</button>
              </div>
            </div>
          ))}
          {trails.length === 0 && (
            <div className="bg-white shadow-sm p-8 text-center text-gray-400 text-sm">
              Δεν υπάρχουν μονοπάτια ακόμα.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
