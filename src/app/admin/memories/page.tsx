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
    fd.append('folder', 'myrsini-studios/memories')
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`)
    xhr.upload.onprogress = e => { if (e.lengthComputable && onProgress) onProgress(Math.round(e.loaded / e.total * 100)) }
    xhr.onload = () => {
      const data = JSON.parse(xhr.responseText)
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve((data.secure_url as string).replace('/upload/', '/upload/f_auto,q_auto,w_1200/'))
      } else {
        reject(new Error(data.error?.message || 'Upload failed'))
      }
    }
    xhr.onerror = () => reject(new Error('Network error'))
    xhr.send(fd)
  })
}

type SliderPhoto = {
  id: string
  image_url: string
  title: string
  title_en?: string
  title_de?: string
  title_fr?: string
  sort_order: number
}

const EMPTY = { image_url: '', title: '', title_en: '', title_de: '', title_fr: '', sort_order: 0 }
type SaveState = 'idle' | 'saving' | 'saved' | 'error'

export default function AdminMemoriesPage() {
  const supabase = createClient()
  const [photos, setPhotos] = useState<SliderPhoto[]>([])
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState<string | null>(null)
  const [state, setState] = useState<SaveState>('idle')
  const [deleting, setDeleting] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState('')
  const [validationError, setValidationError] = useState('')
  const imgInputRef = useRef<HTMLInputElement>(null)

  const load = () =>
    supabase.from('slider_photos').select('*').order('sort_order')
      .then(({ data }) => { setPhotos((data as SliderPhoto[]) ?? []); setLoaded(true) })

  useEffect(() => { load() }, [])

  const handleImageFile = async (file: File) => {
    if (!file.type.startsWith('image/')) { setUploadError('Μόνο αρχεία εικόνας'); return }
    setUploadError(''); setUploading(true); setUploadProgress(0)
    try {
      const url = await uploadToCloudinary(file, pct => setUploadProgress(pct))
      setForm(p => ({ ...p, image_url: url }))
      if (editId) {
        await supabase.from('slider_photos').update({ image_url: url }).eq('id', editId)
        load()
      }
    } catch (e: unknown) {
      setUploadError(e instanceof Error ? e.message : 'Upload failed')
    } finally { setUploading(false) }
  }

  const autoSave = (key: string, value: string | number) => {
    if (!editId) return
    supabase.from('slider_photos').update({ [key]: value }).eq('id', editId).then(() => {})
  }

  const handleSubmit = async () => {
    console.log('[MEMORIES SAVE] start', { image_url: form.image_url, title: form.title, editId })

    if (!form.image_url || !form.title.trim()) {
      setValidationError('Παρακαλώ ανεβάστε εικόνα και βάλτε τουλάχιστον ελληνικό τίτλο')
      return
    }
    setValidationError('')
    setState('saving')

    const payload = {
      image_url: form.image_url,
      title: form.title.trim(),
      title_en: form.title_en.trim(),
      title_de: form.title_de.trim(),
      title_fr: form.title_fr.trim(),
      sort_order: form.sort_order || photos.length + 1,
    }
    console.log('[MEMORIES SAVE] payload', payload)

    try {
      let error
      if (editId) {
        ;({ error } = await supabase.from('slider_photos').update(payload).eq('id', editId))
        if (!error) setEditId(null)
      } else {
        ;({ error } = await supabase.from('slider_photos').insert(payload))
      }
      console.log('[MEMORIES SAVE] result', { error })
      if (error) { setState('error') }
      else { setState('saved'); setTimeout(() => setState('idle'), 2000); setForm(EMPTY); load() }
    } catch (err) {
      console.error('[MEMORIES SAVE] threw', err)
      setState('error')
    }
  }

  const handleEdit = (p: SliderPhoto) => {
    setEditId(p.id)
    setForm({ image_url: p.image_url, title: p.title, title_en: p.title_en ?? '', title_de: p.title_de ?? '', title_fr: p.title_fr ?? '', sort_order: p.sort_order })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Διαγραφή φωτογραφίας;')) return
    setDeleting(id)
    await supabase.from('slider_photos').delete().eq('id', id)
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
        <h1 className="font-serif text-2xl font-light" style={{ color: '#2C1B0E' }}>Παλιές Αναμνήσεις</h1>
        <p className="text-xs mt-1" style={{ color: '#8B7355' }}>Φωτογραφίες για τον infinite scroll slider</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* ─── Form ─── */}
        <div className="bg-white rounded-xl p-5 space-y-4" style={{ border: '1px solid #E8E0D0' }}>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#8B7355' }}>
            {editId ? 'Επεξεργασία' : 'Νέα Φωτογραφία'}
          </p>

          {/* Image */}
          <div>
            <label className="block text-[10px] uppercase tracking-wider mb-1.5 font-medium" style={{ color: '#8B7355' }}>Εικόνα</label>
            {form.image_url ? (
              <div className="mb-2">
                <div className="relative group">
                  <img src={form.image_url} alt="" className="w-full h-32 object-cover border border-gray-200 rounded-lg"
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
                  className="mt-1.5 w-full text-xs py-1.5 rounded-lg disabled:opacity-40"
                  style={{ border: '1px solid #D5CCBB', color: '#8B7355' }}>
                  📸 Αλλαγή εικόνας
                </button>
              </div>
            ) : (
              <div onClick={() => imgInputRef.current?.click()}
                className="border-2 border-dashed cursor-pointer flex flex-col items-center justify-center h-24 gap-1 border-gray-200 hover:border-olive/40 rounded-lg transition-colors">
                {uploading
                  ? <><div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-olive transition-all" style={{ width: `${uploadProgress}%` }} /></div><p className="text-xs text-gray-400">{uploadProgress}%</p></>
                  : <><span className="text-2xl">📸</span><p className="text-xs text-gray-400">Click για upload</p></>
                }
              </div>
            )}
            <input ref={imgInputRef} type="file" accept="image/*" className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleImageFile(f); e.target.value = '' }} />
            {uploadError && <p className="text-[10px] text-red-500 mt-1">{uploadError}</p>}
          </div>

          {/* Titles */}
          {([['title', 'ΕΛ', 'π.χ. Χόρτο, 1960'], ['title_en', 'EN', ''], ['title_de', 'DE', ''], ['title_fr', 'FR', '']] as [keyof typeof form, string, string][]).map(([key, lang, ph]) => (
            <div key={key}>
              <label className="block text-[10px] uppercase tracking-wider mb-1.5 font-medium" style={{ color: '#8B7355' }}>Τίτλος ({lang})</label>
              <input
                value={form[key] as string}
                onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                onBlur={e => autoSave(key as string, e.target.value)}
                placeholder={ph}
                className="w-full px-3 py-2 text-sm focus:outline-none rounded-lg"
                style={{ border: '1px solid #D5CCBB', background: '#FAFAF8', color: '#2C1B0E' }} />
            </div>
          ))}

          {/* Sort order */}
          <div>
            <label className="block text-[10px] uppercase tracking-wider mb-1.5 font-medium" style={{ color: '#8B7355' }}>Σειρά</label>
            <input type="number" value={form.sort_order}
              onChange={e => setForm(p => ({ ...p, sort_order: Number(e.target.value) }))}
              onBlur={e => autoSave('sort_order', Number(e.target.value))}
              className="w-full px-3 py-2 text-sm focus:outline-none rounded-lg"
              style={{ border: '1px solid #D5CCBB', background: '#FAFAF8', color: '#2C1B0E' }} />
          </div>

          {validationError && (
            <p className="text-xs text-red-500 -mt-1">{validationError}</p>
          )}

          <div className="flex gap-2 pt-1">
            <button onClick={handleSubmit} disabled={state === 'saving' || uploading}
              className="flex-1 py-2.5 text-xs tracking-widest uppercase text-white rounded-lg hover:opacity-90 disabled:opacity-40 transition-all"
              style={{ background: state === 'saved' ? '#22c55e' : state === 'error' ? '#ef4444' : '#C9A96E' }}>
              {state === 'saving' ? '...' : state === 'saved' ? '✓ Αποθηκεύτηκε' : state === 'error' ? '✗ Σφάλμα' : editId ? 'Ενημέρωση' : 'Προσθήκη'}
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

        {/* ─── Preview grid ─── */}
        <div className="md:col-span-2">
          {photos.length === 0 ? (
            <div className="bg-white rounded-xl p-10 text-center" style={{ border: '1px solid #E8E0D0', color: '#A09080' }}>
              <p className="text-sm">Δεν υπάρχουν φωτογραφίες ακόμα.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {photos.map(p => (
                <div key={p.id} className="relative group rounded-lg overflow-hidden" style={{ border: '1px solid #E8E0D0' }}>
                  {p.image_url
                    ? <img src={p.image_url} alt={p.title} className="w-full h-28 object-cover block" />
                    : <div className="w-full h-28 bg-[#F5F0E8] flex items-center justify-center text-xs" style={{ color: '#A09080' }}>Χωρίς εικόνα</div>
                  }
                  <div className="p-2 bg-white">
                    <p className="text-xs font-medium truncate" style={{ color: '#5A4A35' }}>{p.title || '—'}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: '#A09080' }}>#{p.sort_order}</p>
                  </div>
                  <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(p)}
                      className="text-xs px-2 py-1 rounded shadow-sm"
                      style={{ background: 'rgba(255,255,255,0.92)', color: '#3B82F6' }}>✎</button>
                    <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id}
                      className="text-xs px-2 py-1 rounded shadow-sm disabled:opacity-40"
                      style={{ background: 'rgba(255,255,255,0.92)', color: '#EF4444' }}>✕</button>
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
