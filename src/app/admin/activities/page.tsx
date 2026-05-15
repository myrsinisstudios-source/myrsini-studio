'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

type Activity = {
  id: string
  slug: string
  name_el: string
  name_en: string
  icon: string
  image_url: string
  description_el: string
  description_en: string
  duration: string
  distance: string
  category: string
  sort_order: number
}

const EMPTY = {
  slug: '', name_el: '', name_en: '', icon: '🏖️', image_url: '',
  description_el: '', description_en: '', duration: '', distance: '', category: '', sort_order: 0,
}

const slugify = (s: string) =>
  s.toLowerCase().replace(/[αάΑΆ]/g,'a').replace(/[εέΕΈ]/g,'e').replace(/[ηήΗΉ]/g,'i')
   .replace(/[ιίΙΊ]/g,'i').replace(/[οόΟΌ]/g,'o').replace(/[υύΥΎ]/g,'u').replace(/[ωώΩΏ]/g,'o')
   .replace(/[θΘ]/g,'th').replace(/[χΧ]/g,'ch').replace(/[ψΨ]/g,'ps').replace(/[ξΞ]/g,'x')
   .replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')

export default function AdminActivitiesPage() {
  const supabase = createClient()
  const [activities, setActivities] = useState<Activity[]>([])
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const load = () =>
    supabase.from('activities').select('*').order('sort_order').then(({ data }) => setActivities((data as Activity[]) ?? []))

  useEffect(() => { load() }, [])

  const setField = (key: string, val: string | number) => setForm(p => ({ ...p, [key]: val }))

  const handleNameChange = (val: string) => {
    setForm(p => ({ ...p, name_el: val, slug: p.slug || slugify(val) }))
  }

  const handleSubmit = async () => {
    if (!form.name_el || !form.slug) return
    setLoading(true)
    if (editId) {
      await supabase.from('activities').update(form).eq('id', editId)
      setEditId(null)
    } else {
      await supabase.from('activities').insert(form)
    }
    setForm(EMPTY)
    setLoading(false)
    load()
  }

  const handleEdit = (a: Activity) => {
    setEditId(a.id)
    setForm({ slug: a.slug, name_el: a.name_el, name_en: a.name_en ?? '', icon: a.icon, image_url: a.image_url ?? '',
      description_el: a.description_el ?? '', description_en: a.description_en ?? '',
      duration: a.duration ?? '', distance: a.distance ?? '', category: a.category ?? '', sort_order: a.sort_order ?? 0 })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Διαγραφή δραστηριότητας;')) return
    setDeleting(id)
    await supabase.from('activities').delete().eq('id', id)
    setDeleting(null)
    load()
  }

  return (
    <div>
      <h1 className="text-2xl font-light text-deep-wood mb-8 font-serif">Δραστηριότητες</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Form */}
        <div className="bg-white shadow-sm p-6">
          <h2 className="font-medium text-deep-wood mb-6">{editId ? 'Επεξεργασία' : 'Νέα Δραστηριότητα'}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Όνομα (Ελληνικά)</label>
              <input value={form.name_el} onChange={e => handleNameChange(e.target.value)}
                placeholder="π.χ. Παραλίες"
                className="w-full border border-gray-300 px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:border-olive" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Slug (URL)</label>
              <input value={form.slug} onChange={e => setField('slug', e.target.value)}
                placeholder="beaches"
                className="w-full border border-gray-300 px-3 py-2.5 text-sm font-mono text-gray-600 focus:outline-none focus:border-olive" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Όνομα (English)</label>
              <input value={form.name_en} onChange={e => setField('name_en', e.target.value)}
                placeholder="Beaches"
                className="w-full border border-gray-300 px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:border-olive" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Εικονίδιο</label>
                <input value={form.icon} onChange={e => setField('icon', e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2.5 text-sm text-center focus:outline-none focus:border-olive" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Σειρά</label>
                <input type="number" value={form.sort_order} onChange={e => setField('sort_order', Number(e.target.value))}
                  className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-olive" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">URL Εικόνας</label>
              <input value={form.image_url} onChange={e => setField('image_url', e.target.value)}
                placeholder="https://..."
                className="w-full border border-gray-300 px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:border-olive" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Διάρκεια</label>
                <input value={form.duration} onChange={e => setField('duration', e.target.value)}
                  placeholder="π.χ. 5 λεπτά"
                  className="w-full border border-gray-300 px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:border-olive" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Απόσταση</label>
                <input value={form.distance} onChange={e => setField('distance', e.target.value)}
                  placeholder="π.χ. 2 km"
                  className="w-full border border-gray-300 px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:border-olive" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Κατηγορία</label>
              <input value={form.category} onChange={e => setField('category', e.target.value)}
                placeholder="π.χ. Παραλίες"
                className="w-full border border-gray-300 px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:border-olive" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Περιγραφή (Ελληνικά)</label>
              <textarea value={form.description_el} onChange={e => setField('description_el', e.target.value)}
                rows={3} placeholder="Περιγραφή δραστηριότητας..."
                className="w-full border border-gray-300 px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:border-olive resize-none" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Περιγραφή (English)</label>
              <textarea value={form.description_en} onChange={e => setField('description_en', e.target.value)}
                rows={3} placeholder="Activity description..."
                className="w-full border border-gray-300 px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:border-olive resize-none" />
            </div>
            <div className="flex gap-3">
              <button onClick={handleSubmit} disabled={loading || !form.name_el || !form.slug}
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
          {activities.map(a => (
            <div key={a.id} className="bg-white shadow-sm p-5 flex items-start gap-4">
              <div className="w-12 h-12 shrink-0 flex items-center justify-center text-3xl bg-cream border border-deep-wood/8 overflow-hidden">
                {a.image_url ? (
                  <img src={a.image_url} alt={a.name_el} className="w-full h-full object-cover" />
                ) : a.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-serif text-lg text-deep-wood">{a.name_el}</h3>
                  {a.category && <span className="text-xs text-olive border border-olive/30 px-2 py-0.5 rounded-sm">{a.category}</span>}
                </div>
                <p className="text-xs font-mono text-gray-400 mb-1">/activities/{a.slug}</p>
                <p className="text-sm text-gray-500 line-clamp-2">{a.description_el}</p>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button onClick={() => handleEdit(a)} className="text-xs text-blue-500 hover:text-blue-700 px-3 py-1.5 border border-blue-200 hover:border-blue-400">✎ Επεξ.</button>
                <button onClick={() => handleDelete(a.id)} disabled={deleting === a.id}
                  className="text-xs text-red-400 hover:text-red-600 px-3 py-1.5 border border-red-200 hover:border-red-400 disabled:opacity-40">✕ Διαγρ.</button>
              </div>
            </div>
          ))}
          {activities.length === 0 && (
            <div className="bg-white shadow-sm p-8 text-center text-gray-400 text-sm">
              Δεν υπάρχουν δραστηριότητες ακόμα.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
