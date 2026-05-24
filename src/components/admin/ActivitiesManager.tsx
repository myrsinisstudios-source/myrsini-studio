'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

const CLOUD_NAME   = 'dusy3drw7'
const UPLOAD_PRESET = 'myrsini_unsigned'

function uploadToCloudinary(file: File, folder: string, onProgress?: (pct: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('upload_preset', UPLOAD_PRESET)
    fd.append('folder', folder)
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`)
    xhr.upload.onprogress = e => { if (e.lengthComputable && onProgress) onProgress(Math.round(e.loaded / e.total * 100)) }
    xhr.onload = () => {
      const data = JSON.parse(xhr.responseText)
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve((data.secure_url as string).replace('/upload/', '/upload/f_auto,q_auto,w_1600/'))
      } else {
        reject(new Error(data.error?.message || 'Upload failed'))
      }
    }
    xhr.onerror = () => reject(new Error('Network error'))
    xhr.send(fd)
  })
}

function uploadGpxFile(file: File, folder: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('upload_preset', UPLOAD_PRESET)
    fd.append('folder', folder)
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`)
    xhr.onload = () => {
      const data = JSON.parse(xhr.responseText)
      if (xhr.status >= 200 && xhr.status < 300) resolve(data.secure_url as string)
      else reject(new Error(data.error?.message || 'Upload failed'))
    }
    xhr.onerror = () => reject(new Error('Network error'))
    xhr.send(fd)
  })
}

type Activity = {
  id: string
  slug: string
  name_el: string
  name_en: string
  name_de: string
  name_fr: string
  icon: string
  image_url: string
  description_el: string
  description_en: string
  description_de: string
  description_fr: string
  duration: string
  distance: string
  elevation: string
  difficulty: string
  category: string
  sort_order: number
  gpx_url?: string
  wikiloc_url?: string
  start_lat?: number | null
  start_lng?: number | null
  end_lat?: number | null
  end_lng?: number | null
}

type ActivityForm = Omit<Activity, 'id' | 'start_lat' | 'start_lng' | 'end_lat' | 'end_lng'> & {
  start_lat: string
  start_lng: string
  end_lat: string
  end_lng: string
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

const EMPTY: ActivityForm = {
  slug: '', name_el: '', name_en: '', name_de: '', name_fr: '', icon: '🏖️', image_url: '',
  description_el: '', description_en: '', description_de: '', description_fr: '',
  duration: '', distance: '', elevation: '', difficulty: '', category: '', sort_order: 0,
  gpx_url: '', wikiloc_url: '',
  start_lat: '39.295', start_lng: '23.124', end_lat: '', end_lng: '',
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
              width: 44, height: 44, left: '50%', top: 90, marginLeft: -22,
              transform: `translate(${x}px, ${y}px) scale(${scale})`, opacity, zIndex,
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

function FieldStatus({ status, onRetry }: { status: SaveStatus; onRetry: () => void }) {
  if (status === 'saving') return <span className="text-[10px] text-gray-400 ml-1">saving...</span>
  if (status === 'saved')  return <span className="text-[10px] text-green-600 ml-1">✓</span>
  if (status === 'error')  return (
    <>
      <span className="text-[10px] text-red-500 ml-1">✗</span>
      <button type="button" onClick={onRetry} className="text-[10px] text-red-500 underline ml-1">retry</button>
    </>
  )
  return null
}

export default function ActivitiesManager() {
  const supabase = createClient()
  const [activities, setActivities] = useState<Activity[]>([])
  const [form, setForm] = useState<ActivityForm>(EMPTY)
  const [editId, setEditId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [saveError, setSaveError] = useState('')
  const [fieldStatus, setFieldStatus] = useState<Record<string, SaveStatus>>({})
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const fieldLastAttempt = useRef<Record<string, string>>({})
  const [deleting, setDeleting] = useState<string | null>(null)
  const [previewIdx, setPreviewIdx] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState('')
  const imgInputRef = useRef<HTMLInputElement>(null)
  const [gpxUploading, setGpxUploading] = useState(false)
  const [gpxError, setGpxError] = useState('')
  const gpxInputRef = useRef<HTMLInputElement>(null)

  const load = async () => {
    const { data } = await supabase.from('activities').select('*').order('sort_order')
    setActivities((data as Activity[]) ?? [])
  }

  useEffect(() => { load() }, [])

  const setField = (key: keyof ActivityForm, val: string | number) =>
    setForm(p => ({ ...p, [key]: val }))

  const handleNameChange = (val: string) =>
    setForm(p => ({ ...p, name_el: val, slug: editId ? p.slug : slugify(val) }))

  // Auto-save individual field on blur (only in edit mode, only known DB columns)
  const autoSaveField = async (key: string, value: string | number | null) => {
    if (!editId) return
    fieldLastAttempt.current[key] = value != null ? String(value) : ''
    setFieldStatus(prev => ({ ...prev, [key]: 'saving' }))
    setFieldErrors(prev => ({ ...prev, [key]: '' }))
    const { error: err } = await supabase.from('activities').update({ [key]: value }).eq('id', editId)
    if (err) {
      setFieldStatus(prev => ({ ...prev, [key]: 'error' }))
      setFieldErrors(prev => ({ ...prev, [key]: err.message }))
    } else {
      setFieldStatus(prev => ({ ...prev, [key]: 'saved' }))
      setTimeout(() => setFieldStatus(prev => ({ ...prev, [key]: 'idle' })), 2000)
      load()
    }
  }

  const DB_COLS = new Set(['slug','name_el','name_en','name_de','name_fr','icon','image_url','images',
    'description_el','description_en','description_de','description_fr',
    'duration','distance','elevation','difficulty','category','sort_order',
    'gpx_url','wikiloc_url','start_lat','start_lng','end_lat','end_lng'])

  const toDbPayload = (f: ActivityForm): Record<string, unknown> => {
    const payload: Record<string, unknown> = {}
    const coordKeys = new Set(['start_lat','start_lng','end_lat','end_lng'])
    for (const [k, v] of Object.entries(f)) {
      if (!DB_COLS.has(k)) continue
      if (coordKeys.has(k)) {
        payload[k] = v !== '' ? parseFloat(v as string) : null
      } else {
        payload[k] = v
      }
    }
    return payload
  }

  const handleSubmit = async () => {
    if (!form.name_el || !form.slug) return
    setLoading(true)
    setSaveStatus('idle')
    setSaveError('')
    const payload = toDbPayload(form)
    if (editId) {
      const { error: err } = await supabase.from('activities').update(payload).eq('id', editId)
      if (err) { setSaveStatus('error'); setSaveError(err.message) }
      else { setSaveStatus('saved'); setEditId(null); setForm(EMPTY); setShowForm(false); setTimeout(() => setSaveStatus('idle'), 2000) }
    } else {
      const { error: err } = await supabase.from('activities').insert(payload)
      if (err) { setSaveStatus('error'); setSaveError(err.message) }
      else { setSaveStatus('saved'); setForm(EMPTY); setShowForm(false); setTimeout(() => setSaveStatus('idle'), 2000) }
    }
    setLoading(false)
    load()
  }

  const handleEdit = (a: Activity) => {
    setEditId(a.id)
    setForm({
      slug: a.slug, name_el: a.name_el, name_en: a.name_en ?? '', name_de: a.name_de ?? '', name_fr: a.name_fr ?? '',
      icon: a.icon, image_url: a.image_url ?? '',
      description_el: a.description_el ?? '', description_en: a.description_en ?? '',
      description_de: a.description_de ?? '', description_fr: a.description_fr ?? '',
      duration: a.duration ?? '', distance: a.distance ?? '', elevation: a.elevation ?? '',
      difficulty: a.difficulty ?? '', category: a.category ?? '', sort_order: a.sort_order ?? 0,
      gpx_url: a.gpx_url ?? '', wikiloc_url: a.wikiloc_url ?? '',
      start_lat: a.start_lat != null ? String(a.start_lat) : '39.295',
      start_lng: a.start_lng != null ? String(a.start_lng) : '23.124',
      end_lat: a.end_lat != null ? String(a.end_lat) : '',
      end_lng: a.end_lng != null ? String(a.end_lng) : '',
    })
    setFieldStatus({}); setFieldErrors({}); setSaveStatus('idle'); setSaveError('')
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
    setEditId(null); setForm(EMPTY); setShowForm(false)
    setSaveStatus('idle'); setSaveError('')
    setFieldStatus({}); setFieldErrors({})
  }

  const handleImageFile = async (file: File) => {
    if (!file.type.startsWith('image/')) { setUploadError('Μόνο αρχεία εικόνας'); return }
    setUploadError(''); setUploading(true); setUploadProgress(0)
    try {
      const folder = `myrsini-studios/activities/${form.slug || 'activity'}`
      const url = await uploadToCloudinary(file, folder, pct => setUploadProgress(pct))
      setField('image_url', url)
      if (editId) await autoSaveField('image_url', url)
    } catch (e: unknown) {
      setUploadError(e instanceof Error ? e.message : 'Upload failed')
    } finally { setUploading(false) }
  }

  const handleGpxFile = async (file: File) => {
    if (!file.name.endsWith('.gpx') && !file.name.endsWith('.kml')) { setGpxError('Μόνο .gpx/.kml αρχεία'); return }
    setGpxError(''); setGpxUploading(true)
    try {
      const folder = `myrsini-studios/activities/${form.slug || 'activity'}/gpx`
      const url = await uploadGpxFile(file, folder)
      setField('gpx_url', url)
      if (editId) await autoSaveField('gpx_url', url)
    } catch (e: unknown) {
      setGpxError(e instanceof Error ? e.message : 'Upload failed')
    } finally { setGpxUploading(false) }
  }

  // Field input with auto-save on blur
  const Field = ({ fkey, label, placeholder, type = 'text' }: { fkey: keyof ActivityForm; label: string; placeholder?: string; type?: string }) => (
    <div>
      <label className="flex items-center text-[10px] uppercase tracking-wider mb-1.5 font-medium" style={{ color: '#8B7355' }}>
        {label}
        <FieldStatus status={fieldStatus[fkey] ?? 'idle'} onRetry={() => autoSaveField(fkey, fieldLastAttempt.current[fkey] ?? '')} />
      </label>
      <input
        type={type}
        value={String(form[fkey] ?? '')}
        onChange={e => setField(fkey, e.target.value)}
        onBlur={e => autoSaveField(fkey, e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-base focus:outline-none rounded-lg"
        style={{ border: '1px solid #D5CCBB', background: '#FAFAF8', color: '#2C1B0E' }}
      />
      {fieldErrors[fkey] && <p className="text-[10px] text-red-500 mt-0.5">{fieldErrors[fkey]}</p>}
    </div>
  )

  const TextArea = ({ fkey, label, placeholder, rows = 4 }: { fkey: keyof ActivityForm; label: string; placeholder?: string; rows?: number }) => (
    <div>
      <label className="flex items-center text-[10px] uppercase tracking-wider mb-1.5 font-medium" style={{ color: '#8B7355' }}>
        {label}
        <FieldStatus status={fieldStatus[fkey] ?? 'idle'} onRetry={() => autoSaveField(fkey, fieldLastAttempt.current[fkey] ?? '')} />
      </label>
      <textarea
        value={String(form[fkey] ?? '')}
        onChange={e => setField(fkey, e.target.value)}
        onBlur={e => autoSaveField(fkey, e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-base focus:outline-none rounded-lg resize-y font-mono"
        style={{ border: '1px solid #D5CCBB', background: '#FAFAF8', color: '#2C1B0E' }}
      />
      {fieldErrors[fkey] && <p className="text-[10px] text-red-500 mt-0.5">{fieldErrors[fkey]}</p>}
    </div>
  )

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-light" style={{ color: '#2C1B0E' }}>Δραστηριότητες CMS</h1>
          <p className="text-xs mt-0.5" style={{ color: '#8B7355' }}>Διαχείριση δραστηριοτήτων</p>
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

      <div className={`grid gap-4 ${showForm ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'}`}>
        {/* ── Form ── */}
        {showForm && (
          <div className="lg:col-span-1 rounded-xl bg-white p-5 space-y-4 h-fit" style={{ border: '1px solid #E8E0D0' }}>
            <h2 className="text-sm font-semibold" style={{ color: '#2C1B0E' }}>
              {editId ? 'Επεξεργασία' : 'Νέα Δραστηριότητα'}
            </h2>

            {/* Name EL + slug */}
            <div>
              <label className="flex items-center text-[10px] uppercase tracking-wider mb-1.5 font-medium" style={{ color: '#8B7355' }}>
                Όνομα (ΕΛ) *
                <FieldStatus status={fieldStatus['name_el'] ?? 'idle'} onRetry={() => autoSaveField('name_el', fieldLastAttempt.current['name_el'] ?? '')} />
              </label>
              <input
                value={form.name_el}
                onChange={e => handleNameChange(e.target.value)}
                onBlur={e => autoSaveField('name_el', e.target.value)}
                placeholder="π.χ. Παραλίες"
                className="w-full px-3 py-2 text-base focus:outline-none rounded-lg"
                style={{ border: '1px solid #D5CCBB', background: '#FAFAF8', color: '#2C1B0E' }}
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider mb-1.5 font-medium" style={{ color: '#8B7355' }}>Slug (URL) *</label>
              <input
                value={form.slug}
                onChange={e => setField('slug', e.target.value)}
                onBlur={e => autoSaveField('slug', e.target.value)}
                placeholder="beaches"
                className="w-full px-3 py-2 text-base font-mono focus:outline-none rounded-lg"
                style={{ border: '1px solid #D5CCBB', background: '#FAFAF8', color: '#6B5A45' }}
              />
            </div>

            <Field fkey="name_en" label="Name (EN)" placeholder="Beaches" />
            <Field fkey="name_de" label="Name (DE)" placeholder="Strände" />
            <Field fkey="name_fr" label="Nom (FR)" placeholder="Plages" />

            <div className="grid grid-cols-2 gap-3">
              <Field fkey="icon" label="Εικονίδιο" placeholder="🏖️" />
              <Field fkey="sort_order" label="Σειρά" type="number" />
            </div>

            {/* Image uploader */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider mb-1.5 font-medium" style={{ color: '#8B7355' }}>Εικόνα</label>
              {form.image_url ? (
                <div className="relative group mb-2">
                  <img src={form.image_url} alt="" className="w-full h-32 object-cover border border-gray-200" />
                  <button
                    type="button"
                    onClick={() => { setField('image_url', ''); if (editId) autoSaveField('image_url', '') }}
                    className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white w-6 h-6 flex items-center justify-center text-sm leading-none opacity-0 group-hover:opacity-100 transition-opacity"
                  >×</button>
                </div>
              ) : (
                <div
                  onClick={() => imgInputRef.current?.click()}
                  className="border-2 border-dashed cursor-pointer flex flex-col items-center justify-center h-24 gap-1 transition-colors border-gray-200 hover:border-olive/40"
                >
                  {uploading
                    ? <><div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-olive transition-all" style={{ width: `${uploadProgress}%` }} /></div><p className="text-xs text-gray-400">{uploadProgress}%</p></>
                    : <><span className="text-2xl">📸</span><p className="text-xs text-gray-400">Click για upload</p></>
                  }
                </div>
              )}
              <input
                ref={imgInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleImageFile(f); e.target.value = '' }}
              />
              {uploadError && <p className="text-xs text-red-500 mt-1">{uploadError}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field fkey="duration" label="Διάρκεια" placeholder="5 λεπτά" />
              <Field fkey="distance" label="Απόσταση" placeholder="2 km" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field fkey="elevation" label="Υψόμετρο" placeholder="+420 m" />
              <Field fkey="difficulty" label="Δυσκολία" placeholder="Εύκολη" />
            </div>
            <Field fkey="category" label="Κατηγορία" placeholder="Φύση" />

            <TextArea fkey="description_el" label="Περιγραφή (ΕΛ)" placeholder="Περιγραφή..." rows={3} />
            <TextArea fkey="description_en" label="Description (EN)" placeholder="Description..." rows={3} />
            <TextArea fkey="description_de" label="Beschreibung (DE)" placeholder="Beschreibung..." rows={3} />
            <TextArea fkey="description_fr" label="Description (FR)" placeholder="Description..." rows={3} />

            {/* ── Χάρτης & Διαδρομή — only for hiking ── */}
            {form.category === 'hiking' && (
              <div className="border-t pt-4 space-y-3" style={{ borderColor: '#E8E0D0' }}>
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#8B7355' }}>
                  🗺️ Χάρτης & Διαδρομή
                </p>

                {/* GPX upload */}
                <div>
                  <label className="block text-[10px] uppercase tracking-wider mb-1.5 font-medium" style={{ color: '#8B7355' }}>GPX / KML Αρχείο</label>
                  {form.gpx_url ? (
                    <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 text-xs text-green-700 rounded-lg">
                      <span>✓</span>
                      <span className="flex-1 truncate">{(form.gpx_url as string).split('/').pop()}</span>
                      <button type="button" onClick={() => { setField('gpx_url', ''); if (editId) autoSaveField('gpx_url', '') }} className="text-red-400 hover:text-red-600">✕</button>
                    </div>
                  ) : (
                    <div onClick={() => gpxInputRef.current?.click()}
                      className="border-2 border-dashed cursor-pointer flex flex-col items-center justify-center h-14 gap-1 border-gray-200 hover:border-olive/40 rounded-lg transition-colors">
                      {gpxUploading
                        ? <p className="text-xs text-gray-400">Uploading...</p>
                        : <><span className="text-lg">📍</span><p className="text-xs text-gray-400">Upload .gpx / .kml</p></>
                      }
                    </div>
                  )}
                  <input ref={gpxInputRef} type="file" accept=".gpx,.kml" className="hidden"
                    onChange={e => { const f = e.target.files?.[0]; if (f) handleGpxFile(f); e.target.value = '' }} />
                  <input value={form.gpx_url as string}
                    onChange={e => setField('gpx_url', e.target.value)}
                    onBlur={e => autoSaveField('gpx_url', e.target.value)}
                    placeholder="ή paste URL"
                    className="w-full mt-1 px-3 py-1.5 text-xs focus:outline-none rounded-lg"
                    style={{ border: '1px solid #D5CCBB', background: '#FAFAF8', color: '#2C1B0E' }} />
                  {gpxError && <p className="text-[10px] text-red-500 mt-0.5">{gpxError}</p>}
                </div>

                {/* Wikiloc */}
                <Field fkey="wikiloc_url" label="Wikiloc URL" placeholder="https://www.wikiloc.com/..." />

                {/* Start coords */}
                <div>
                  <p className="text-[10px] uppercase tracking-wider mb-1.5 font-medium" style={{ color: '#8B7355' }}>Συντεταγμένες Εκκίνησης</p>
                  <div className="grid grid-cols-2 gap-2">
                    {(['start_lat','start_lng'] as const).map((k, i) => (
                      <input key={k} type="number" step="any"
                        value={form[k] as string}
                        placeholder={i === 0 ? 'Lat 39.295' : 'Lng 23.124'}
                        onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))}
                        onBlur={e => autoSaveField(k, e.target.value ? parseFloat(e.target.value) : null)}
                        className="w-full px-3 py-2 text-sm focus:outline-none rounded-lg"
                        style={{ border: '1px solid #D5CCBB', background: '#FAFAF8', color: '#2C1B0E' }} />
                    ))}
                  </div>
                </div>

                {/* End coords */}
                <div>
                  <p className="text-[10px] uppercase tracking-wider mb-1.5 font-medium" style={{ color: '#8B7355' }}>Συντεταγμένες Τέλους</p>
                  <div className="grid grid-cols-2 gap-2">
                    {(['end_lat','end_lng'] as const).map((k, i) => (
                      <input key={k} type="number" step="any"
                        value={form[k] as string}
                        placeholder={i === 0 ? 'Lat' : 'Lng'}
                        onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))}
                        onBlur={e => autoSaveField(k, e.target.value ? parseFloat(e.target.value) : null)}
                        className="w-full px-3 py-2 text-sm focus:outline-none rounded-lg"
                        style={{ border: '1px solid #D5CCBB', background: '#FAFAF8', color: '#2C1B0E' }} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {saveError && (
              <div className="p-2 bg-red-50 border border-red-200 text-xs text-red-600">
                ✗ {saveError}
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <button
                onClick={handleSubmit}
                disabled={loading || !form.name_el || !form.slug}
                className="flex-1 py-2.5 text-xs tracking-widest uppercase text-white rounded-lg transition-opacity hover:opacity-90 disabled:opacity-40"
                style={{ background: saveStatus === 'saved' ? '#22c55e' : saveStatus === 'error' ? '#ef4444' : '#C9A96E' }}
              >
                {loading ? '...' : saveStatus === 'saved' ? '✓ Αποθηκεύτηκε' : saveStatus === 'error' ? '✗ Σφάλμα' : editId ? 'Ενημέρωση' : 'Αποθήκευση'}
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

        {/* ── List + Preview ── */}
        <div className={showForm ? 'lg:col-span-2 space-y-4' : 'space-y-4'}>
          {/* Carousel preview */}
          {activities.length > 0 && (
            <div className="rounded-xl bg-white p-5" style={{ border: '1px solid #E8E0D0' }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#8B7355' }}>Προεπισκόπηση Τροχού</p>
                <div className="flex items-center gap-1.5">
                  {activities.slice(0, 7).map((_, i) => (
                    <button key={i} onClick={() => setPreviewIdx(i)}
                      className="w-1.5 h-1.5 rounded-full transition-all"
                      style={{ background: previewIdx === i ? '#C9A96E' : '#D5CCBB' }} />
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
                  <span className="text-xs w-5 text-center shrink-0" style={{ color: '#C8C0B8' }}>{a.sort_order}</span>
                  <div className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center overflow-hidden text-xl"
                    style={{ background: '#F5F0E8', border: '1px solid #E3DBD0' }}>
                    {a.image_url ? <img src={a.image_url} alt={a.name_el} className="w-full h-full object-cover" /> : a.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium" style={{ color: '#2C1B0E' }}>{a.name_el}</p>
                      {a.name_en && <p className="text-xs" style={{ color: '#A09080' }}>/ {a.name_en}</p>}
                      {a.category && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: '#F0EBE3', color: '#8B7355' }}>{a.category}</span>
                      )}
                    </div>
                    <p className="text-[10px] font-mono mt-0.5" style={{ color: '#B0A090' }}>/activities/{a.slug}</p>
                  </div>
                  <div className="hidden md:flex flex-col text-right shrink-0">
                    {a.duration  && <p className="text-[10px]" style={{ color: '#A09080' }}>⏱ {a.duration}</p>}
                    {a.elevation && <p className="text-[10px]" style={{ color: '#A09080' }}>⛰ {a.elevation}</p>}
                  </div>
                  <button onClick={() => setPreviewIdx(Math.min(i, 6))}
                    className="text-[10px] px-2.5 py-1.5 rounded-lg shrink-0"
                    style={{ background: '#F5F0E8', color: '#8B7355', border: '1px solid #E3DBD0' }}>👁</button>
                  <a href={`/activities/${a.slug}`} target="_blank" rel="noopener noreferrer"
                    className="text-[10px] px-2.5 py-1.5 rounded-lg shrink-0"
                    style={{ background: '#F0FFF4', color: '#4a7c59', border: '1px solid #BBF7D0' }}>🔗</a>
                  <button onClick={() => handleEdit(a)}
                    className="text-[10px] px-2.5 py-1.5 rounded-lg shrink-0"
                    style={{ background: '#F0F4FF', color: '#3B82F6', border: '1px solid #DBEAFE' }}>Επεξ.</button>
                  <button onClick={() => handleDelete(a.id)} disabled={deleting === a.id}
                    className="text-[10px] px-2.5 py-1.5 rounded-lg shrink-0 disabled:opacity-40"
                    style={{ background: '#FEF2F2', color: '#EF4444', border: '1px solid #FECACA' }}>
                    {deleting === a.id ? '...' : 'Διαγρ.'}
                  </button>
                </div>
              ))}
              {activities.length === 0 && (
                <div className="px-5 py-12 text-center">
                  <p className="text-2xl mb-2">🌿</p>
                  <p className="text-sm" style={{ color: '#A09080' }}>Δεν υπάρχουν δραστηριότητες.</p>
                  <button onClick={() => setShowForm(true)}
                    className="mt-3 text-xs px-4 py-2 rounded-lg text-white" style={{ background: '#C9A96E' }}>
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
