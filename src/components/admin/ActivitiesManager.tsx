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

type ActivityForm = {
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

const EMPTY: ActivityForm = {
  slug: '', name_el: '', name_en: '', icon: '🏖️', image_url: '',
  description_el: '', description_en: '', duration: '', distance: '', category: '', sort_order: 0,
}

const slugify = (s: string) =>
  s.toLowerCase()
    .replace(/[αάΑΆ]/g, 'a').replace(/[εέΕΈ]/g, 'e').replace(/[ηήΗΉ]/g, 'i')
    .replace(/[ιίΙΊ]/g, 'i').replace(/[οόΟΌ]/g, 'o').replace(/[υύΥΎ]/g, 'u').replace(/[ωώΩΏ]/g, 'o')
    .replace(/[θΘ]/g, 'th').replace(/[χΧ]/g, 'ch').replace(/[ψΨ]/g, 'ps').replace(/[ξΞ]/g, 'x')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const ANGLE = 34 * (Math.PI / 180)
const RADIUS = 110

function CarouselPreview({ activities, activeIdx }: { activities: Activity[]; activeIdx: number }) {
  const visible = activities.slice(0, 7)
  return (
    <div className="relative w-full" style={{ height: 200 }}>
      {visible.map((a, i) => {
        const offset = i - activeIdx
        const x = RADIUS * Math.sin(offset * ANGLE)
        const y = -RADIUS * (1 - Math.cos(offset * ANGLE))
        const dist = Math.abs(offset)
        const scale = dist === 0 ? 1.25 : dist === 1 ? 0.9 : dist === 2 ? 0.7 : 0.55
        const opacity = dist === 0 ? 1 : dist === 1 ? 0.75 : dist === 2 ? 0.45 : 0.2
        const zIndex = 20 - dist
        const isActive = offset === 0
        return (
          <div
            key={a.id}
            className="absolute flex items-center justify-center rounded-full transition-all duration-300"
            style={{
              width: 44,
              height: 44,
              left: '50%',
              top: 90,
              marginLeft: -22,
              transform: `translate(${x}px, ${y}px) scale(${scale})`,
              opacity,
              zIndex,
              background: isActive ? '#4a7c59' : '#F5F0E8',
              border: isActive ? '2px solid #4a7c59' : '1px solid #E3DBD0',
              boxShadow: isActive ? '0 4px 16px rgba(74,124,89,0.25)' : '0 1px 4px rgba(0,0,0,0.08)',
              fontSize: 18,
            }}
          >
            {a.image_url ? (
              <img src={a.image_url} alt={a.name_el} className="w-full h-full rounded-full object-cover" />
            ) : a.icon}
          </div>
        )
      })}
      {visible[activeIdx] && (
        <div className="absolute bottom-0 left-0 right-0 text-center">
          <p className="text-xs font-semibold" style={{ color: '#2C1B0E' }}>{visible[activeIdx].name_el}</p>
          <p className="text-[10px]" style={{ color: '#8B7355' }}>{visible[activeIdx].category}</p>
        </div>
      )}
    </div>
  )
}

export default function ActivitiesManager() {
  const supabase = createClient()
  const [activities, setActivities] = useState<Activity[]>([])
  const [form, setForm] = useState<ActivityForm>(EMPTY)
  const [editId, setEditId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [previewIdx, setPreviewIdx] = useState(0)
  const [showForm, setShowForm] = useState(false)

  const load = async () => {
    const { data } = await supabase.from('activities').select('*').order('sort_order')
    setActivities((data as Activity[]) ?? [])
  }

  useEffect(() => { load() }, [])

  const setField = (key: keyof ActivityForm, val: string | number) =>
    setForm(p => ({ ...p, [key]: val }))

  const handleNameChange = (val: string) =>
    setForm(p => ({ ...p, name_el: val, slug: editId ? p.slug : slugify(val) }))

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
    setShowForm(false)
    setLoading(false)
    load()
  }

  const handleEdit = (a: Activity) => {
    setEditId(a.id)
    setForm({
      slug: a.slug, name_el: a.name_el, name_en: a.name_en ?? '', icon: a.icon,
      image_url: a.image_url ?? '', description_el: a.description_el ?? '',
      description_en: a.description_en ?? '', duration: a.duration ?? '',
      distance: a.distance ?? '', category: a.category ?? '', sort_order: a.sort_order ?? 0,
    })
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Διαγραφή δραστηριότητας;')) return
    setDeleting(id)
    await supabase.from('activities').delete().eq('id', id)
    setDeleting(null)
    load()
  }

  const handleCancel = () => {
    setEditId(null)
    setForm(EMPTY)
    setShowForm(false)
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-light" style={{ color: '#2C1B0E' }}>Δραστηριότητες CMS</h1>
          <p className="text-xs mt-0.5" style={{ color: '#8B7355' }}>Διαχείριση του περιστρεφόμενου τροχού δραστηριοτήτων</p>
        </div>
        {!showForm && (
          <button
            onClick={() => { setEditId(null); setForm(EMPTY); setShowForm(true) }}
            className="text-xs px-4 py-2 text-white rounded-lg transition-opacity hover:opacity-90"
            style={{ background: '#C9A96E' }}
          >
            + Νέα Δραστηριότητα
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* ── Left: Form ── */}
        {showForm && (
          <div className="col-span-1 rounded-xl bg-white p-5 space-y-4" style={{ border: '1px solid #E8E0D0' }}>
            <h2 className="text-sm font-semibold" style={{ color: '#2C1B0E' }}>
              {editId ? 'Επεξεργασία' : 'Νέα Δραστηριότητα'}
            </h2>

            <div>
              <label className="block text-[10px] uppercase tracking-wider mb-1.5 font-medium" style={{ color: '#8B7355' }}>Όνομα (Ελληνικά) *</label>
              <input
                value={form.name_el}
                onChange={e => handleNameChange(e.target.value)}
                placeholder="π.χ. Παραλίες"
                className="w-full px-3 py-2 text-sm focus:outline-none rounded-lg"
                style={{ border: '1px solid #D5CCBB', background: '#FAFAF8', color: '#2C1B0E' }}
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider mb-1.5 font-medium" style={{ color: '#8B7355' }}>Slug (URL) *</label>
              <input
                value={form.slug}
                onChange={e => setField('slug', e.target.value)}
                placeholder="beaches"
                className="w-full px-3 py-2 text-sm font-mono focus:outline-none rounded-lg"
                style={{ border: '1px solid #D5CCBB', background: '#FAFAF8', color: '#6B5A45' }}
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider mb-1.5 font-medium" style={{ color: '#8B7355' }}>Όνομα (English)</label>
              <input
                value={form.name_en}
                onChange={e => setField('name_en', e.target.value)}
                placeholder="Beaches"
                className="w-full px-3 py-2 text-sm focus:outline-none rounded-lg"
                style={{ border: '1px solid #D5CCBB', background: '#FAFAF8', color: '#2C1B0E' }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase tracking-wider mb-1.5 font-medium" style={{ color: '#8B7355' }}>Εικονίδιο</label>
                <input
                  value={form.icon}
                  onChange={e => setField('icon', e.target.value)}
                  className="w-full px-3 py-2 text-sm text-center focus:outline-none rounded-lg"
                  style={{ border: '1px solid #D5CCBB', background: '#FAFAF8', color: '#2C1B0E' }}
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider mb-1.5 font-medium" style={{ color: '#8B7355' }}>Σειρά</label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={e => setField('sort_order', Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm focus:outline-none rounded-lg"
                  style={{ border: '1px solid #D5CCBB', background: '#FAFAF8', color: '#2C1B0E' }}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider mb-1.5 font-medium" style={{ color: '#8B7355' }}>URL Εικόνας</label>
              <input
                value={form.image_url}
                onChange={e => setField('image_url', e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 text-sm focus:outline-none rounded-lg"
                style={{ border: '1px solid #D5CCBB', background: '#FAFAF8', color: '#2C1B0E' }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase tracking-wider mb-1.5 font-medium" style={{ color: '#8B7355' }}>Διάρκεια</label>
                <input
                  value={form.duration}
                  onChange={e => setField('duration', e.target.value)}
                  placeholder="5 λεπτά"
                  className="w-full px-3 py-2 text-sm focus:outline-none rounded-lg"
                  style={{ border: '1px solid #D5CCBB', background: '#FAFAF8', color: '#2C1B0E' }}
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider mb-1.5 font-medium" style={{ color: '#8B7355' }}>Απόσταση</label>
                <input
                  value={form.distance}
                  onChange={e => setField('distance', e.target.value)}
                  placeholder="2 km"
                  className="w-full px-3 py-2 text-sm focus:outline-none rounded-lg"
                  style={{ border: '1px solid #D5CCBB', background: '#FAFAF8', color: '#2C1B0E' }}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider mb-1.5 font-medium" style={{ color: '#8B7355' }}>Κατηγορία</label>
              <input
                value={form.category}
                onChange={e => setField('category', e.target.value)}
                placeholder="π.χ. Παραλίες"
                className="w-full px-3 py-2 text-sm focus:outline-none rounded-lg"
                style={{ border: '1px solid #D5CCBB', background: '#FAFAF8', color: '#2C1B0E' }}
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider mb-1.5 font-medium" style={{ color: '#8B7355' }}>Περιγραφή (Ελληνικά)</label>
              <textarea
                value={form.description_el}
                onChange={e => setField('description_el', e.target.value)}
                rows={3}
                placeholder="Περιγραφή δραστηριότητας..."
                className="w-full px-3 py-2 text-sm focus:outline-none rounded-lg resize-none"
                style={{ border: '1px solid #D5CCBB', background: '#FAFAF8', color: '#2C1B0E' }}
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider mb-1.5 font-medium" style={{ color: '#8B7355' }}>Περιγραφή (English)</label>
              <textarea
                value={form.description_en}
                onChange={e => setField('description_en', e.target.value)}
                rows={3}
                placeholder="Activity description..."
                className="w-full px-3 py-2 text-sm focus:outline-none rounded-lg resize-none"
                style={{ border: '1px solid #D5CCBB', background: '#FAFAF8', color: '#2C1B0E' }}
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={handleSubmit}
                disabled={loading || !form.name_el || !form.slug}
                className="flex-1 py-2.5 text-xs tracking-widest uppercase text-white rounded-lg transition-opacity hover:opacity-90 disabled:opacity-40"
                style={{ background: '#C9A96E' }}
              >
                {loading ? '...' : editId ? 'Ενημέρωση' : 'Αποθήκευση'}
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2.5 text-xs rounded-lg transition-colors"
                style={{ border: '1px solid #D5CCBB', color: '#8B7355' }}
              >
                Ακύρωση
              </button>
            </div>
          </div>
        )}

        {/* ── Right/Main: List + Preview ── */}
        <div className={showForm ? 'col-span-2 space-y-4' : 'col-span-3 space-y-4'}>
          {/* Carousel preview */}
          {activities.length > 0 && (
            <div className="rounded-xl bg-white p-5" style={{ border: '1px solid #E8E0D0' }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#8B7355' }}>Προεπισκόπηση Τροχού</p>
                <div className="flex items-center gap-1.5">
                  {activities.slice(0, 7).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPreviewIdx(i)}
                      className="w-1.5 h-1.5 rounded-full transition-all"
                      style={{ background: previewIdx === i ? '#C9A96E' : '#D5CCBB' }}
                    />
                  ))}
                </div>
              </div>
              <CarouselPreview activities={activities} activeIdx={previewIdx} />
            </div>
          )}

          {/* Activities list */}
          <div className="rounded-xl bg-white" style={{ border: '1px solid #E8E0D0' }}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #F0EBE3' }}>
              <p className="text-sm font-semibold" style={{ color: '#2C1B0E' }}>
                {activities.length} δραστηριότητ{activities.length === 1 ? 'α' : 'ες'}
              </p>
            </div>
            <div className="divide-y" style={{ '--tw-divide-opacity': 1 } as React.CSSProperties}>
              {activities.map((a, i) => (
                <div key={a.id} className="flex items-center gap-4 px-5 py-3.5">
                  {/* Sort order handle */}
                  <span className="text-xs w-5 text-center shrink-0" style={{ color: '#C8C0B8' }}>{a.sort_order}</span>

                  {/* Icon / image */}
                  <div
                    className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center overflow-hidden text-xl"
                    style={{ background: '#F5F0E8', border: '1px solid #E3DBD0' }}
                  >
                    {a.image_url ? (
                      <img src={a.image_url} alt={a.name_el} className="w-full h-full object-cover" />
                    ) : a.icon}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium" style={{ color: '#2C1B0E' }}>{a.name_el}</p>
                      {a.name_en && <p className="text-xs" style={{ color: '#A09080' }}>/ {a.name_en}</p>}
                      {a.category && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: '#F0EBE3', color: '#8B7355' }}>
                          {a.category}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] font-mono mt-0.5" style={{ color: '#B0A090' }}>/activities/{a.slug}</p>
                    {a.description_el && (
                      <p className="text-xs mt-0.5 line-clamp-1" style={{ color: '#A09080' }}>{a.description_el}</p>
                    )}
                  </div>

                  {/* Meta */}
                  <div className="hidden md:flex flex-col text-right shrink-0">
                    {a.duration && <p className="text-[10px]" style={{ color: '#A09080' }}>⏱ {a.duration}</p>}
                    {a.distance && <p className="text-[10px]" style={{ color: '#A09080' }}>📍 {a.distance}</p>}
                  </div>

                  {/* Preview button */}
                  <button
                    onClick={() => setPreviewIdx(Math.min(i, 6))}
                    className="text-[10px] px-2.5 py-1.5 rounded-lg transition-colors shrink-0"
                    style={{ background: '#F5F0E8', color: '#8B7355', border: '1px solid #E3DBD0' }}
                  >
                    👁
                  </button>

                  {/* Live link */}
                  <a
                    href={`/activities/${a.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] px-2.5 py-1.5 rounded-lg transition-colors shrink-0"
                    style={{ background: '#F0FFF4', color: '#4a7c59', border: '1px solid #BBF7D0' }}
                  >
                    🔗 Live
                  </a>

                  {/* Actions */}
                  <button
                    onClick={() => handleEdit(a)}
                    className="text-[10px] px-2.5 py-1.5 rounded-lg transition-colors shrink-0"
                    style={{ background: '#F0F4FF', color: '#3B82F6', border: '1px solid #DBEAFE' }}
                  >
                    Επεξ.
                  </button>
                  <button
                    onClick={() => handleDelete(a.id)}
                    disabled={deleting === a.id}
                    className="text-[10px] px-2.5 py-1.5 rounded-lg transition-colors shrink-0 disabled:opacity-40"
                    style={{ background: '#FEF2F2', color: '#EF4444', border: '1px solid #FECACA' }}
                  >
                    {deleting === a.id ? '...' : 'Διαγρ.'}
                  </button>
                </div>
              ))}

              {activities.length === 0 && (
                <div className="px-5 py-12 text-center">
                  <p className="text-2xl mb-2">🌿</p>
                  <p className="text-sm" style={{ color: '#A09080' }}>Δεν υπάρχουν δραστηριότητες ακόμα.</p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="mt-3 text-xs px-4 py-2 rounded-lg text-white"
                    style={{ background: '#C9A96E' }}
                  >
                    Προσθήκη πρώτης δραστηριότητας
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
