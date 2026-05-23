'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

const CLOUD_NAME    = 'dusy3drw7'
const UPLOAD_PRESET = 'myrsini_unsigned'

function uploadToCloudinary(file: File, onProgress?: (pct: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('upload_preset', UPLOAD_PRESET)
    fd.append('folder', 'myrsini-studios/pois')
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`)
    xhr.upload.onprogress = e => { if (e.lengthComputable && onProgress) onProgress(Math.round(e.loaded / e.total * 100)) }
    xhr.onload = () => {
      const data = JSON.parse(xhr.responseText)
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve((data.secure_url as string).replace('/upload/', '/upload/f_auto,q_auto,w_800/'))
      } else {
        reject(new Error(data.error?.message || 'Upload failed'))
      }
    }
    xhr.onerror = () => reject(new Error('Network error'))
    xhr.send(fd)
  })
}

const CATEGORIES = ['restaurant', 'cafe', 'beach', 'viewpoint', 'museum', 'bar', 'supermarket', 'other'] as const
type Category = typeof CATEGORIES[number]

const CATEGORY_LABELS: Record<Category, string> = {
  restaurant: 'Εστιατόριο', cafe: 'Καφέ', beach: 'Παραλία',
  viewpoint: 'Θέα', museum: 'Μουσείο', bar: 'Μπαρ',
  supermarket: 'Super Market', other: 'Αξιοθέατο',
}
const CATEGORY_ICONS: Record<Category, string> = {
  restaurant: '🍽️', cafe: '☕', beach: '🏖️',
  viewpoint: '🔭', museum: '🏛️', bar: '🍹',
  supermarket: '🛒', other: '🏰',
}

type POI = {
  id: string
  name_el: string; name_en?: string; name_de?: string; name_fr?: string
  description_el?: string; description_en?: string; description_de?: string; description_fr?: string
  category: Category
  address?: string
  google_maps_url?: string
  image_url?: string
  sort_order: number
  is_active: boolean
}

const EMPTY: Omit<POI, 'id'> = {
  name_el: '', name_en: '', name_de: '', name_fr: '',
  description_el: '', description_en: '', description_de: '', description_fr: '',
  category: 'restaurant', address: '', google_maps_url: '', image_url: '',
  sort_order: 0, is_active: true,
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
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState('')
  const imgInputRef = useRef<HTMLInputElement>(null)

  const load = () =>
    supabase.from('local_pois').select('*').order('sort_order').then(({ data, error }) => {
      if (error) setDbError(error.message)
      else setDbError('')
      setPois((data as POI[]) ?? [])
      setLoaded(true)
    })

  useEffect(() => { load() }, [])

  const handleImageFile = async (file: File) => {
    if (!file.type.startsWith('image/')) { setUploadError('Μόνο αρχεία εικόνας'); return }
    setUploadError(''); setUploading(true); setUploadProgress(0)
    try {
      const url = await uploadToCloudinary(file, pct => setUploadProgress(pct))
      setForm(p => ({ ...p, image_url: url }))
      if (editId) {
        await supabase.from('local_pois').update({ image_url: url }).eq('id', editId)
        load()
      }
    } catch (e: unknown) {
      setUploadError(e instanceof Error ? e.message : 'Upload failed')
    } finally { setUploading(false) }
  }

  const autoSave = (key: string, value: string | number | boolean) => {
    if (!editId) return
    supabase.from('local_pois').update({ [key]: value }).eq('id', editId).then(() => {})
  }

  const handleSubmit = async () => {
    setState('saving')
    const payload = {
      name_el: form.name_el,
      name_en: form.name_en || null,
      name_de: form.name_de || null,
      name_fr: form.name_fr || null,
      description_el: form.description_el || null,
      description_en: form.description_en || null,
      description_de: form.description_de || null,
      description_fr: form.description_fr || null,
      category: form.category,
      address: form.address || '',
      google_maps_url: form.google_maps_url || null,
      image_url: form.image_url || null,
      sort_order: form.sort_order || pois.length + 1,
      is_active: form.is_active,
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
    setForm({
      name_el: p.name_el, name_en: p.name_en ?? '', name_de: p.name_de ?? '', name_fr: p.name_fr ?? '',
      description_el: p.description_el ?? '', description_en: p.description_en ?? '',
      description_de: p.description_de ?? '', description_fr: p.description_fr ?? '',
      category: p.category, address: p.address ?? '',
      google_maps_url: p.google_maps_url ?? '',
      image_url: p.image_url ?? '', sort_order: p.sort_order, is_active: p.is_active,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Διαγραφή POI;')) return
    setDeleting(id)
    await supabase.from('local_pois').delete().eq('id', id)
    setDeleting(null)
    load()
  }

  const inp = 'w-full px-3 py-2 text-sm focus:outline-none rounded-lg'
  const inpStyle = { border: '1px solid #D5CCBB', background: '#FAFAF8', color: '#2C1B0E' }
  const lbl = 'block text-[10px] uppercase tracking-wider mb-1 font-medium'
  const lblStyle = { color: '#8B7355' }

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-light" style={{ color: '#2C1B0E' }}>Τοπικός Οδηγός</h1>
        <p className="text-xs mt-1" style={{ color: '#8B7355' }}>Σημεία ενδιαφέροντος — εμφανίζονται στο tab «Τοπικός Οδηγός»</p>
        {dbError && (
          <div className="mt-2 text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
            Σφάλμα: {dbError}
            {dbError.includes('exist') && (
              <span className="block mt-1">Δημιουργήστε τον πίνακα <code className="bg-red-100 px-1 rounded">local_pois</code> στο Supabase πρώτα.</span>
            )}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* ─── Form ─── */}
        <div className="bg-white rounded-xl p-5 space-y-4" style={{ border: '1px solid #E8E0D0' }}>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#8B7355' }}>
            {editId ? 'Επεξεργασία POI' : 'Νέο POI'}
          </p>

          {/* Image */}
          <div>
            <label className={lbl} style={lblStyle}>Εικόνα</label>
            {form.image_url ? (
              <div className="mb-2">
                <div className="relative group">
                  <img src={form.image_url} alt="" className="w-full h-28 object-cover border border-gray-200 rounded-lg block"
                    onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
                  {uploading && (
                    <div className="absolute inset-0 bg-black/50 rounded-lg flex flex-col items-center justify-center gap-1">
                      <div className="w-24 h-1.5 bg-white/30 rounded-full overflow-hidden">
                        <div className="h-full bg-white transition-all" style={{ width: `${uploadProgress}%` }} />
                      </div>
                      <p className="text-xs text-white">{uploadProgress}%</p>
                    </div>
                  )}
                  <button type="button" onClick={() => setForm(p => ({ ...p, image_url: '' }))}
                    className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white w-6 h-6 flex items-center justify-center text-sm leading-none opacity-0 group-hover:opacity-100 transition-opacity rounded">×</button>
                </div>
                <button type="button" onClick={() => imgInputRef.current?.click()} disabled={uploading}
                  className="mt-1.5 w-full text-xs py-1.5 rounded-lg disabled:opacity-40 transition-colors"
                  style={{ border: '1px solid #D5CCBB', color: '#8B7355' }}>
                  📸 Αλλαγή εικόνας
                </button>
              </div>
            ) : (
              <div onClick={() => imgInputRef.current?.click()}
                className="border-2 border-dashed cursor-pointer flex flex-col items-center justify-center h-20 gap-1 border-gray-200 hover:border-olive/40 rounded-lg transition-colors">
                {uploading
                  ? <><div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-olive transition-all" style={{ width: `${uploadProgress}%` }} /></div><p className="text-xs text-gray-400">{uploadProgress}%</p></>
                  : <><span className="text-xl">📸</span><p className="text-xs text-gray-400">Optional — click για upload</p></>
                }
              </div>
            )}
            <input ref={imgInputRef} type="file" accept="image/*" className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleImageFile(f); e.target.value = '' }} />
            {uploadError && <p className="text-[10px] text-red-500 mt-1">{uploadError}</p>}
          </div>

          {/* Names — 4 languages */}
          <div className="space-y-2.5">
            <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: '#8B7355' }}>Όνομα (4 γλώσσες)</p>
            {([['name_el','ΕΛ *'], ['name_en','EN'], ['name_de','DE'], ['name_fr','FR']] as [keyof typeof form, string][]).map(([key, lang]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="text-[10px] font-bold w-8 shrink-0" style={{ color: '#8B7355' }}>{lang}</span>
                <input value={form[key] as string}
                  onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                  onBlur={e => autoSave(key as string, e.target.value)}
                  className={inp} style={inpStyle} />
              </div>
            ))}
          </div>

          {/* Category */}
          <div>
            <label className={lbl} style={lblStyle}>Κατηγορία</label>
            <select value={form.category}
              onChange={e => { const v = e.target.value as Category; setForm(p => ({ ...p, category: v })); autoSave('category', v) }}
              className={inp} style={inpStyle}>
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{CATEGORY_ICONS[c]} {CATEGORY_LABELS[c]}</option>
              ))}
            </select>
          </div>

          {/* Descriptions — 4 languages */}
          <div className="space-y-2.5">
            <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: '#8B7355' }}>Περιγραφή (4 γλώσσες)</p>
            {([['description_el','ΕΛ'], ['description_en','EN'], ['description_de','DE'], ['description_fr','FR']] as [keyof typeof form, string][]).map(([key, lang]) => (
              <div key={key} className="flex gap-2">
                <span className="text-[10px] font-bold w-8 shrink-0 mt-2" style={{ color: '#8B7355' }}>{lang}</span>
                <textarea value={form[key] as string}
                  onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                  onBlur={e => autoSave(key as string, e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 text-sm focus:outline-none rounded-lg resize-none"
                  style={inpStyle} />
              </div>
            ))}
          </div>

          {/* Address */}
          <div>
            <label className={lbl} style={lblStyle}>Διεύθυνση</label>
            <input value={form.address}
              onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
              onBlur={e => autoSave('address', e.target.value)}
              placeholder="π.χ. Χόρτο, Πήλιο"
              className={inp} style={inpStyle} />
          </div>

          {/* Google Maps URL */}
          <div>
            <label className={lbl} style={lblStyle}>Google Maps URL</label>
            <input value={form.google_maps_url}
              onChange={e => setForm(p => ({ ...p, google_maps_url: e.target.value }))}
              onBlur={e => autoSave('google_maps_url', e.target.value)}
              placeholder="https://maps.google.com/..."
              className={inp} style={inpStyle} />
          </div>

          {/* Sort order + is_active */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={lbl} style={lblStyle}>Σειρά</label>
              <input type="number" value={form.sort_order}
                onChange={e => setForm(p => ({ ...p, sort_order: Number(e.target.value) }))}
                onBlur={e => autoSave('sort_order', Number(e.target.value))}
                className={inp} style={inpStyle} />
            </div>
            <label className="flex items-center gap-2 mt-5 cursor-pointer">
              <input type="checkbox" checked={form.is_active}
                onChange={e => { const v = e.target.checked; setForm(p => ({ ...p, is_active: v })); autoSave('is_active', v) }}
                className="w-4 h-4 accent-olive" />
              <span className="text-xs" style={{ color: '#5A4A35' }}>Ενεργό</span>
            </label>
          </div>

          <div className="flex gap-2 pt-1">
            <button onClick={handleSubmit} disabled={state === 'saving' || !form.name_el}
              className="flex-1 py-2.5 text-xs tracking-widest uppercase text-white rounded-lg hover:opacity-90 disabled:opacity-40 transition-all"
              style={{ background: state === 'saved' ? '#22c55e' : state === 'error' ? '#ef4444' : '#C9A96E' }}>
              {state === 'saving' ? '...' : state === 'saved' ? '✓' : state === 'error' ? '✗ Σφάλμα' : editId ? 'Ενημέρωση' : 'Προσθήκη'}
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
              <p className="text-sm">Δεν υπάρχουν POIs. Προσθέστε το πρώτο!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {pois.map(p => (
                <div key={p.id} className="bg-white rounded-xl overflow-hidden group" style={{ border: '1px solid #E8E0D0' }}>
                  <div className="flex items-center gap-3 px-4 py-3">
                    {p.image_url
                      ? <img src={p.image_url} alt={p.name_el} className="w-12 h-12 object-cover rounded-lg shrink-0 block" />
                      : <div className="w-12 h-12 rounded-lg bg-cream flex items-center justify-center text-2xl shrink-0">{CATEGORY_ICONS[p.category]}</div>
                    }
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium" style={{ color: '#5A4A35' }}>{p.name_el}</p>
                        {!p.is_active && <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-400">ανενεργό</span>}
                      </div>
                      <p className="text-[10px] mt-0.5" style={{ color: '#A09080' }}>
                        {CATEGORY_ICONS[p.category]} {CATEGORY_LABELS[p.category]}
                        {p.name_en && <span className="ml-2 text-deep-wood/30">· {p.name_en}</span>}
                      </p>
                      {p.description_el && (
                        <p className="text-[10px] mt-0.5 line-clamp-1" style={{ color: '#B0A090' }}>{p.description_el}</p>
                      )}
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
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
