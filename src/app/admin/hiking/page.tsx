'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

const CLOUD_NAME    = 'dusy3drw7'
const UPLOAD_PRESET = 'myrsini_unsigned'

async function uploadGpx(file: File): Promise<string> {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('upload_preset', UPLOAD_PRESET)
  fd.append('folder', 'myrsini-studios/gpx')
  fd.append('resource_type', 'raw')
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`, { method: 'POST', body: fd })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message || 'Upload failed')
  return data.secure_url as string
}

type Trail = {
  id: string
  name_el: string; name_en?: string; name_de?: string; name_fr?: string
  distance: string; duration: string; elevation: string; difficulty: string
  description_el: string; description_en?: string; description_de?: string; description_fr?: string
  start_point: string; start_point_en?: string
  slug?: string; end_point?: string; sort_order?: number; is_active?: boolean
  tags: string[] | string; icon: string
  gpx_url?: string; wikiloc_url?: string
  start_lat?: number; start_lng?: number
  end_lat?: number; end_lng?: number
  elevation_gain?: number
}

type TrailForm = {
  name_el: string; name_en: string; name_de: string; name_fr: string
  distance: string; duration: string; elevation: string; difficulty: string
  description_el: string; description_en: string; description_de: string; description_fr: string
  start_point: string; start_point_en: string; tags: string | string[]; icon: string
  slug: string; end_point: string; sort_order: string; is_active: boolean
  gpx_url: string; wikiloc_url: string
  start_lat: string; start_lng: string
  end_lat: string; end_lng: string
  elevation_gain: string
}

const EMPTY: TrailForm = {
  name_el: '', name_en: '', name_de: '', name_fr: '',
  distance: '', duration: '', elevation: '', difficulty: 'Εύκολη',
  description_el: '', description_en: '', description_de: '', description_fr: '',
  start_point: '', start_point_en: '', tags: '', icon: '🥾',
  slug: '', end_point: '', sort_order: '0', is_active: true,
  gpx_url: '', wikiloc_url: '',
  start_lat: '39.295', start_lng: '23.124', end_lat: '', end_lng: '', elevation_gain: '',
}

const DIFFICULTIES = ['Εύκολη', 'Μέτρια', 'Δύσκολη']
const DIFF_COLOR: Record<string, string> = { 'Εύκολη': 'bg-green-100 text-green-700', 'Μέτρια': 'bg-amber-100 text-amber-700', 'Δύσκολη': 'bg-red-100 text-red-700' }

export default function AdminHikingPage() {
  const supabase = createClient()
  const [trails, setTrails] = useState<Trail[]>([])
  const [form, setForm] = useState<TrailForm>(EMPTY)
  const [editId, setEditId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [gpxUploading, setGpxUploading] = useState(false)
  const [gpxError, setGpxError] = useState('')
  const gpxInputRef = useRef<HTMLInputElement>(null)

  const load = () =>
    supabase.from('hiking_trails').select('*').order('id').then(({ data }) => setTrails((data as Trail[]) ?? []))

  useEffect(() => { load() }, [])

  const handleGpxFile = async (file: File) => {
    if (!file.name.endsWith('.gpx') && !file.name.endsWith('.kml')) { setGpxError('Μόνο .gpx/.kml αρχεία'); return }
    setGpxError(''); setGpxUploading(true)
    try {
      const url = await uploadGpx(file)
      setForm(p => ({ ...p, gpx_url: url }))
    } catch (e: unknown) {
      setGpxError(e instanceof Error ? e.message : 'Upload failed')
    } finally { setGpxUploading(false) }
  }

  const handleSubmit = async () => {
    if (!form.name_el) return
    setLoading(true)
    const payload = {
      ...form,
      tags: typeof form.tags === 'string'
        ? form.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
        : form.tags,
      wikiloc_url: form.wikiloc_url || '',
      sort_order: form.sort_order ? parseInt(form.sort_order) : 0,
      start_lat: form.start_lat ? parseFloat(form.start_lat) : null,
      start_lng: form.start_lng ? parseFloat(form.start_lng) : null,
      end_lat: form.end_lat ? parseFloat(form.end_lat) : null,
      end_lng: form.end_lng ? parseFloat(form.end_lng) : null,
      elevation_gain: form.elevation_gain ? parseInt(form.elevation_gain) : null,
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
      name_el: t.name_el, name_en: t.name_en ?? '', name_de: t.name_de ?? '', name_fr: t.name_fr ?? '',
      distance: t.distance, duration: t.duration, elevation: t.elevation, difficulty: t.difficulty,
      description_el: t.description_el, description_en: t.description_en ?? '',
      description_de: t.description_de ?? '', description_fr: t.description_fr ?? '',
      start_point: t.start_point,
      start_point_en: t.start_point_en ?? '',
      tags: Array.isArray(t.tags) ? t.tags.join(', ') : t.tags ?? '',
      icon: t.icon ?? '🥾',
      slug: t.slug ?? '',
      end_point: t.end_point ?? '',
      sort_order: t.sort_order?.toString() ?? '0',
      is_active: t.is_active ?? true,
      gpx_url: t.gpx_url ?? '',
      wikiloc_url: t.wikiloc_url ?? '',
      start_lat: t.start_lat?.toString() ?? '39.295',
      start_lng: t.start_lng?.toString() ?? '',
      end_lat: t.end_lat?.toString() ?? '',
      end_lng: t.end_lng?.toString() ?? '',
      elevation_gain: t.elevation_gain?.toString() ?? '',
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

  const LabelInput = ({ fkey, label, placeholder, type = 'text' }: { fkey: keyof TrailForm; label: string; placeholder?: string; type?: string }) => (
    <div>
      <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
      <input
        type={type}
        value={(form as Record<string, string>)[fkey] ?? ''}
        onChange={e => setForm(p => ({ ...p, [fkey]: e.target.value }))}
        placeholder={placeholder}
        className="w-full border border-gray-300 px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:border-olive"
      />
    </div>
  )

  return (
    <div>
      <h1 className="text-2xl font-light text-deep-wood mb-8 font-serif">Μονοπάτια Πεζοπορίας</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Form */}
        <div className="bg-white shadow-sm p-6 space-y-4">
          <h2 className="font-medium text-deep-wood">{editId ? 'Επεξεργασία' : 'Νέο Μονοπάτι'}</h2>

          <LabelInput fkey="name_el"         label="Όνομα (EL)"             placeholder="π.χ. Χόρτο – Λαμπινού" />
          <LabelInput fkey="name_en"        label="Name (EN)"              placeholder="Horto – Lambinou" />
          <LabelInput fkey="name_de"        label="Name (DE)"              placeholder="Horto – Lambinou" />
          <LabelInput fkey="name_fr"        label="Nom (FR)"               placeholder="Horto – Lambinou" />
          <LabelInput fkey="start_point"    label="Εκκίνηση (EL)"         placeholder="π.χ. Χόρτο, παραλία" />
          <LabelInput fkey="start_point_en" label="Start Point (EN)"       placeholder="Horto, beach" />
          <LabelInput fkey="end_point"      label="Τέλος διαδρομής"        placeholder="π.χ. Λαμπινού, πλατεία" />
          <LabelInput fkey="slug"           label="Slug (URL)"             placeholder="horto-lambinou" />
          <div className="grid grid-cols-2 gap-3">
            <LabelInput fkey="sort_order"   label="Σειρά"                  placeholder="0" type="number" />
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">Ενεργό</label>
              <select value={form.is_active ? 'true' : 'false'} onChange={e => setForm(p => ({ ...p, is_active: e.target.value === 'true' }))}
                className="w-full border border-gray-300 px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-olive">
                <option value="true">Ναι</option>
                <option value="false">Όχι</option>
              </select>
            </div>
          </div>
          <LabelInput fkey="icon"           label="Εικονίδιο"              placeholder="🥾" />

          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">Δυσκολία</label>
            <select value={form.difficulty} onChange={e => setForm(p => ({ ...p, difficulty: e.target.value }))}
              className="w-full border border-gray-300 px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-olive">
              {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <LabelInput fkey="distance"      label="Απόσταση"  placeholder="8.2 km" />
            <LabelInput fkey="duration"      label="Διάρκεια"  placeholder="3ω 30λ" />
            <LabelInput fkey="elevation"     label="Υψόμετρο"  placeholder="+420 m" />
          </div>

          {/* Elevation gain */}
          <LabelInput fkey="elevation_gain" label="Υψομ. Κέρδος (m)" placeholder="420" type="number" />

          {/* Start/End lat-lng */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1.5">Συντεταγμένες Εκκίνησης</p>
            <div className="grid grid-cols-2 gap-2">
              <input value={form.start_lat} onChange={e => setForm(p => ({ ...p, start_lat: e.target.value }))} placeholder="Lat 39.xxx" type="number" step="0.0001"
                className="border border-gray-300 px-2 py-2 text-sm placeholder-gray-400 focus:outline-none focus:border-olive" />
              <input value={form.start_lng} onChange={e => setForm(p => ({ ...p, start_lng: e.target.value }))} placeholder="Lng 23.xxx" type="number" step="0.0001"
                className="border border-gray-300 px-2 py-2 text-sm placeholder-gray-400 focus:outline-none focus:border-olive" />
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1.5">Συντεταγμένες Τέλους</p>
            <div className="grid grid-cols-2 gap-2">
              <input value={form.end_lat} onChange={e => setForm(p => ({ ...p, end_lat: e.target.value }))} placeholder="Lat 39.xxx" type="number" step="0.0001"
                className="border border-gray-300 px-2 py-2 text-sm placeholder-gray-400 focus:outline-none focus:border-olive" />
              <input value={form.end_lng} onChange={e => setForm(p => ({ ...p, end_lng: e.target.value }))} placeholder="Lng 23.xxx" type="number" step="0.0001"
                className="border border-gray-300 px-2 py-2 text-sm placeholder-gray-400 focus:outline-none focus:border-olive" />
            </div>
          </div>

          {/* GPX upload */}
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">GPX / KML Αρχείο</label>
            {form.gpx_url ? (
              <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 text-xs text-green-700">
                <span>✓</span>
                <span className="flex-1 truncate">{form.gpx_url.split('/').pop()}</span>
                <button type="button" onClick={() => setForm(p => ({ ...p, gpx_url: '' }))} className="text-red-400 hover:text-red-600">✕</button>
              </div>
            ) : (
              <div
                onClick={() => gpxInputRef.current?.click()}
                className="border-2 border-dashed cursor-pointer flex flex-col items-center justify-center h-16 gap-1 transition-colors border-gray-200 hover:border-olive/40"
              >
                {gpxUploading
                  ? <p className="text-xs text-gray-400">Uploading...</p>
                  : <><span className="text-lg">📍</span><p className="text-xs text-gray-400">Click για upload .gpx/.kml</p></>
                }
              </div>
            )}
            <input ref={gpxInputRef} type="file" accept=".gpx,.kml" className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleGpxFile(f); e.target.value = '' }} />
            {gpxError && <p className="text-xs text-red-500 mt-1">{gpxError}</p>}
            <input value={form.gpx_url} onChange={e => setForm(p => ({ ...p, gpx_url: e.target.value }))}
              placeholder="ή paste URL" className="w-full border border-gray-300 px-3 py-1.5 text-xs placeholder-gray-400 focus:outline-none focus:border-olive mt-2" />
          </div>

          <LabelInput fkey="wikiloc_url" label="Wikiloc URL" placeholder="https://www.wikiloc.com/..." />

          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">Ετικέτες (κόμμα)</label>
            <input value={typeof form.tags === 'string' ? form.tags : form.tags.join(', ')}
              onChange={e => setForm(p => ({ ...p, tags: e.target.value }))}
              placeholder="Θέα, Ελαιώνες, Ιστορικά"
              className="w-full border border-gray-300 px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:border-olive" />
          </div>

          {[
            { key: 'description_el', label: 'Περιγραφή (EL)' },
            { key: 'description_en', label: 'Description (EN)' },
            { key: 'description_de', label: 'Beschreibung (DE)' },
            { key: 'description_fr', label: 'Description (FR)' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">{f.label}</label>
              <textarea value={(form as Record<string, string>)[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                rows={3} placeholder="Λεπτομερής περιγραφή..."
                className="w-full border border-gray-300 px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:border-olive resize-none" />
            </div>
          ))}

          <div className="flex gap-3">
            <button onClick={handleSubmit} disabled={loading || !form.name_el}
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

        {/* List */}
        <div className="md:col-span-2 space-y-4">
          {trails.map(t => (
            <div key={t.id} className="bg-white shadow-sm p-5 flex items-start gap-4">
              <div className="text-4xl w-12 h-12 flex items-center justify-center bg-cream border border-deep-wood/8 shrink-0">
                {t.icon || '🥾'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-serif text-lg text-deep-wood">{t.name_el}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${DIFF_COLOR[t.difficulty] ?? 'bg-gray-100 text-gray-600'}`}>{t.difficulty}</span>
                </div>
                <p className="text-xs text-gray-400 mb-2">
                  {t.distance} · {t.duration} · {t.elevation}
                  {t.elevation_gain ? ` · ↑${t.elevation_gain}m` : ''}
                  {' · '}📍 {t.start_point}
                  {t.gpx_url ? ' · 📎 GPX' : ''}
                </p>
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{t.description_el}</p>
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
