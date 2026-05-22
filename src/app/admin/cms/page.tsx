'use client'

import { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { createClient } from '@/lib/supabase/client'

const CLOUD_NAME = 'dusy3drw7'
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
        resolve((data.secure_url as string).replace('/upload/', '/upload/f_auto,q_auto,w_2000/'))
      } else {
        reject(new Error(data.error?.message || 'Upload failed'))
      }
    }
    xhr.onerror = () => reject(new Error('Network error'))
    xhr.send(fd)
  })
}

const ALL_AMENITIES = [
  { key: 'AC',           icon: '❄️', label: 'Κλιματισμός' },
  { key: 'WiFi',         icon: '📶', label: 'WiFi' },
  { key: 'Κουζίνα',     icon: '🍳', label: 'Κουζίνα' },
  { key: 'Kitchenette',  icon: '☕', label: 'Kitchenette' },
  { key: 'Parking',      icon: '🅿️', label: 'Parking' },
  { key: 'Βεράντα',     icon: '🌿', label: 'Βεράντα' },
  { key: 'Θέα θάλασσα', icon: '🌊', label: 'Θέα θάλασσα' },
  { key: 'BBQ',          icon: '🔥', label: 'BBQ' },
  { key: 'Πλυντήριο',   icon: '🫧', label: 'Πλυντήριο' },
  { key: 'Τηλεόραση',   icon: '📺', label: 'Τηλεόραση' },
  { key: 'Πετσέτες',    icon: '🛁', label: 'Πετσέτες/Σεντόνια' },
  { key: 'Pet Friendly', icon: '🐾', label: 'Pet Friendly' },
]

type AptRow = {
  id: string
  slug?: string | null
  name_el: string
  name_en?: string
  description_el: string
  description_en?: string
  price_per_night: number
  max_guests: number
  area_sqm: number
  bedrooms: number
  bathrooms: number
  amenities: string[]
  is_active: boolean
  image_url?: string
  gallery?: string[]
}

type SettingsRow = {
  id: number
  quote_el: string; quote_en: string; quote_de: string; quote_fr: string
  airport_minutes: number; airport_km: number
  port_minutes: number; port_km: number
  phone: string; email: string; address: string
  checkin_time: string; checkout_time: string
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

// ── Markdown description editor with preview ───────────────────────────────
function DescriptionEditor({ label, value, onChange }: {
  label: string; value: string; onChange: (v: string) => void
}) {
  const [preview, setPreview] = useState(false)
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs uppercase tracking-wider text-gray-400">{label}</label>
        <button
          type="button"
          onClick={() => setPreview(v => !v)}
          className="text-xs px-3 py-2 min-h-[44px] border border-gray-200 text-gray-400 hover:border-olive hover:text-olive transition-colors"
        >
          {preview ? 'Edit' : 'Preview'}
        </button>
      </div>
      {preview ? (
        <div className="w-full min-h-[16rem] border border-gray-200 px-4 py-3 text-sm prose prose-sm max-w-none space-y-3
          [&_h2]:font-serif [&_h2]:text-lg [&_h2]:text-olive [&_h2]:mt-4 [&_h2]:mb-1 [&_h2]:first:mt-0
          [&_h3]:font-serif [&_h3]:text-base [&_h3]:text-deep-wood [&_h3]:mt-3 [&_h3]:mb-0.5
          [&_p]:text-deep-wood/80 [&_p]:leading-relaxed
          [&_ul]:list-disc [&_ul]:list-inside [&_ul]:text-deep-wood/80
          [&_strong]:font-semibold [&_strong]:text-deep-wood">
          {value ? (
            <ReactMarkdown>{value}</ReactMarkdown>
          ) : (
            <span className="text-gray-300 italic">Κενό περιεχόμενο</span>
          )}
        </div>
      ) : (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          rows={12}
          className="w-full border border-gray-200 px-4 py-2.5 text-base focus:outline-none focus:border-olive resize-y font-mono"
        />
      )}
      <p className="text-xs text-gray-300 mt-1">
        Markdown: <code>## Κεφαλίδα</code> · <code>**bold**</code> · <code>- bullet</code> · κενή γραμμή για νέα παράγραφο
      </p>
    </div>
  )
}

// ── Single image uploader ──────────────────────────────────────────────────
function ImageUploader({ value, onChange, folder, autoSave }: {
  value: string
  onChange: (url: string) => void
  folder: string
  autoSave?: (url: string) => Promise<void>
}) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState('')
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [showPaste, setShowPaste] = useState(false)
  const [over, setOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const lastUrl = useRef('')

  const runAutoSave = async (url: string) => {
    if (!autoSave) return
    lastUrl.current = url
    setSaveStatus('saving')
    try {
      await autoSave(url)
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2500)
    } catch {
      setSaveStatus('error')
    }
  }

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) { setUploadError('Μόνο αρχεία εικόνας'); return }
    setUploadError(''); setUploading(true); setUploadProgress(0); setSaveStatus('idle')
    try {
      const url = await uploadToCloudinary(file, folder, pct => setUploadProgress(pct))
      onChange(url)
      await runAutoSave(url)
    }
    catch (e: unknown) { setUploadError(e instanceof Error ? e.message : 'Upload failed') }
    finally { setUploading(false) }
  }

  return (
    <div>
      <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Κεντρική Εικόνα</label>

      {value ? (
        <div className="relative group">
          <img src={value} alt="" className="w-full h-44 object-cover border border-gray-200" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white w-7 h-7 flex items-center justify-center text-xl leading-none opacity-0 group-hover:opacity-100 transition-opacity"
          >×</button>
        </div>
      ) : (
        <div
          onDragOver={e => { e.preventDefault(); setOver(true) }}
          onDragLeave={() => setOver(false)}
          onDrop={e => { e.preventDefault(); setOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed cursor-pointer flex flex-col items-center justify-center h-36 gap-2 transition-colors select-none ${
            over ? 'border-olive bg-olive/5' : 'border-gray-200 hover:border-olive/40'
          }`}
        >
          {uploading
            ? <><div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-olive transition-all duration-200" style={{ width: `${uploadProgress}%` }} /></div><p className="text-xs text-gray-400 mt-1">{uploadProgress}%</p></>
            : <><span className="text-3xl">📸</span><p className="text-xs text-gray-400">Drag & drop ή click για upload</p></>
          }
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = '' }}
      />

      {uploadError && <p className="text-xs text-red-500 mt-1">{uploadError}</p>}

      {saveStatus === 'saving'          && <p className="text-xs text-gray-400 mt-1 animate-pulse">Αποθήκευση στη βάση...</p>}
      {saveStatus === 'saved'           && <p className="text-xs text-green-600 mt-1 font-medium">✓ Αποθηκεύτηκε στη βάση</p>}
      {saveStatus === 'error'           && (
        <div className="mt-1 p-2 bg-red-50 border border-red-200 text-xs text-red-600">
          ✗ DB save failed — RLS policy missing? Πήγαινε Supabase → SQL Editor και τρέξε:<br/>
          <code className="font-mono select-all">CREATE POLICY &quot;anon_update&quot; ON apartments FOR UPDATE TO anon USING (true) WITH CHECK (true);</code>
          <button type="button" onClick={() => runAutoSave(lastUrl.current)} className="ml-2 underline font-medium">retry</button>
        </div>
      )}

      <button
        type="button"
        onClick={() => setShowPaste(v => !v)}
        className="text-xs text-gray-400 hover:text-gray-600 mt-2 underline block"
      >
        {showPaste ? '↑ Κλείσιμο' : 'Advanced: paste URL'}
      </button>
      {showPaste && (
        <input
          type="url"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="https://..."
          className="w-full mt-1 border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-olive"
        />
      )}
    </div>
  )
}

// ── Gallery multi-upload with drag-to-reorder ──────────────────────────────
function GalleryUploader({ gallery, onChange, folder, autoSave }: {
  gallery: string[]
  onChange: (g: string[]) => void
  folder: string
  autoSave?: (g: string[]) => Promise<void>
}) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState('')
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [over, setOver] = useState(false)
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [overIdx, setOverIdx] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const lastGallery = useRef<string[]>([])

  const runAutoSave = async (g: string[]) => {
    if (!autoSave) return
    lastGallery.current = g
    setSaveStatus('saving')
    try {
      await autoSave(g)
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2500)
    } catch {
      setSaveStatus('error')
    }
  }

  const handleFiles = async (files: FileList) => {
    const imgs = Array.from(files).filter(f => f.type.startsWith('image/'))
    if (!imgs.length) return
    setUploadError(''); setUploading(true); setUploadProgress(0); setSaveStatus('idle')
    try {
      let done = 0
      const urls = await Promise.all(imgs.map(f => uploadToCloudinary(f, folder, () => {
        done++; setUploadProgress(Math.round(done / imgs.length * 100))
      })))
      const newGallery = [...gallery, ...urls]
      onChange(newGallery)
      await runAutoSave(newGallery)
    } catch (e: unknown) {
      setUploadError(e instanceof Error ? e.message : 'Upload failed')
    } finally { setUploading(false) }
  }

  const remove = (i: number) => onChange(gallery.filter((_, idx) => idx !== i))

  const handleItemDrop = (targetIdx: number) => {
    if (dragIdx === null || dragIdx === targetIdx) { setDragIdx(null); setOverIdx(null); return }
    const next = [...gallery]
    const [moved] = next.splice(dragIdx, 1)
    next.splice(targetIdx, 0, moved)
    onChange(next)
    setDragIdx(null); setOverIdx(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-xs uppercase tracking-wider text-gray-400">Gallery</label>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="text-xs px-3 py-2 min-h-[44px] border border-olive text-olive hover:bg-olive hover:text-white transition-colors disabled:opacity-50"
        >
          {uploading ? 'Ανέβασμα...' : '+ Προσθήκη'}
        </button>
      </div>

      {gallery.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          {gallery.map((url, i) => (
            <div
              key={url + i}
              draggable
              onDragStart={e => { setDragIdx(i); e.dataTransfer.effectAllowed = 'move' }}
              onDragOver={e => { e.preventDefault(); setOverIdx(i) }}
              onDrop={e => { e.preventDefault(); handleItemDrop(i) }}
              onDragEnd={() => { setDragIdx(null); setOverIdx(null) }}
              className={`relative group cursor-grab active:cursor-grabbing border-2 transition-all ${
                overIdx === i && dragIdx !== i ? 'border-olive scale-95 opacity-70' : 'border-transparent'
              }`}
            >
              <img src={url} alt="" className="w-full h-20 object-cover" />
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white w-6 h-6 flex items-center justify-center text-sm leading-none opacity-0 group-hover:opacity-100 transition-opacity"
              >×</button>
              {/* Mobile reorder arrows */}
              <div className="absolute bottom-0 inset-x-0 flex sm:hidden justify-between bg-black/50">
                <button type="button" disabled={i === 0}
                  onClick={e => { e.stopPropagation(); const n=[...gallery];[n[i-1],n[i]]=[n[i],n[i-1]];onChange(n) }}
                  className="text-white px-2 py-1 text-base disabled:opacity-30 min-w-[36px] flex items-center justify-center">‹</button>
                <button type="button" disabled={i === gallery.length - 1}
                  onClick={e => { e.stopPropagation(); const n=[...gallery];[n[i],n[i+1]]=[n[i+1],n[i]];onChange(n) }}
                  className="text-white px-2 py-1 text-base disabled:opacity-30 min-w-[36px] flex items-center justify-center">›</button>
              </div>
              {/* Desktop drag hint */}
              <div className="absolute bottom-0 inset-x-0 h-5 bg-black/30 hidden sm:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white/80 text-xs">⠿ drag</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div
        onDragOver={e => { e.preventDefault(); if (dragIdx === null) setOver(true) }}
        onDragLeave={() => setOver(false)}
        onDrop={e => {
          e.preventDefault(); setOver(false)
          if (dragIdx !== null) return
          handleFiles(e.dataTransfer.files)
        }}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed cursor-pointer flex items-center justify-center h-14 transition-colors ${
          over ? 'border-olive bg-olive/5' : 'border-gray-200 hover:border-olive/40'
        }`}
      >
        {uploading
          ? <><div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-olive transition-all duration-200" style={{ width: `${uploadProgress}%` }} /></div><p className="text-xs text-gray-400 mt-0.5">{uploadProgress}%</p></>
          : <p className="text-xs text-gray-400">Drag & drop εικόνες ή click για multi-upload</p>
        }
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={e => { if (e.target.files?.length) handleFiles(e.target.files); e.target.value = '' }}
      />

      {uploadError && <p className="text-xs text-red-500 mt-1">{uploadError}</p>}

      {saveStatus === 'saving'          && <p className="text-xs text-gray-400 mt-1 animate-pulse">Αποθήκευση στη βάση...</p>}
      {saveStatus === 'saved'           && <p className="text-xs text-green-600 mt-1 font-medium">✓ Αποθηκεύτηκε στη βάση ({gallery.length} εικόνες)</p>}
      {saveStatus === 'error'           && (
        <div className="mt-1 p-2 bg-red-50 border border-red-200 text-xs text-red-600">
          ✗ DB save failed — RLS policy missing? Πήγαινε Supabase → SQL Editor και τρέξε:<br/>
          <code className="font-mono select-all">CREATE POLICY &quot;anon_update&quot; ON apartments FOR UPDATE TO anon USING (true) WITH CHECK (true);</code>
          <button type="button" onClick={() => runAutoSave(lastGallery.current)} className="ml-2 underline font-medium">retry</button>
        </div>
      )}

      {gallery.length > 1 && saveStatus === 'idle' && (
        <p className="text-xs text-gray-300 mt-1">Drag τις εικόνες για αλλαγή σειράς</p>
      )}
    </div>
  )
}

// ── Main CMS page ──────────────────────────────────────────────────────────
export default function CmsPage() {
  const supabase = createClient()
  const [apartments, setApartments] = useState<AptRow[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [settings, setSettings] = useState<SettingsRow | null>(null)
  const [settingsStatus, setSettingsStatus] = useState<Record<string, SaveStatus>>({})

  useEffect(() => {
    supabase
      .from('apartments')
      .select('*')
      .then(({ data, error: err }) => {
        if (err) {
          setError('Δεν ήταν δυνατή η φόρτωση. Ελέγξτε τα Supabase credentials.')
        } else {
          setApartments((data ?? []).map(row => ({
            ...row,
            amenities: Array.isArray(row.amenities) ? row.amenities : [],
            gallery:   Array.isArray(row.gallery)   ? row.gallery   : [],
          })) as AptRow[])
        }
        setLoading(false)
      })

    supabase.from('settings').select('*').eq('id', 1).single()
      .then(({ data }) => { if (data) setSettings(data as SettingsRow) })
      .catch(() => {})
  }, [])

  const updateSettings = (field: keyof SettingsRow, value: string | number) =>
    setSettings(prev => prev ? { ...prev, [field]: value } : prev)

  const saveSettingsField = async (field: string, value: string | number) => {
    setSettingsStatus(prev => ({ ...prev, [field]: 'saving' }))
    const { error: err } = await supabase.from('settings').upsert({ id: 1, [field]: value })
    if (err) {
      setSettingsStatus(prev => ({ ...prev, [field]: 'error' }))
    } else {
      setSettingsStatus(prev => ({ ...prev, [field]: 'saved' }))
      setTimeout(() => setSettingsStatus(prev => ({ ...prev, [field]: 'idle' })), 2000)
    }
  }

  const updateField = (id: string, field: keyof AptRow, value: unknown) =>
    setApartments(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a))

  const toggleAmenity = (id: string, key: string) => {
    const apt = apartments.find(a => a.id === id)
    if (!apt) return
    const current = apt.amenities ?? []
    updateField(id, 'amenities', current.includes(key) ? current.filter(k => k !== key) : [...current, key])
  }

  const handleSave = async (apt: AptRow) => {
    setSaving(apt.id)

    // Build payload defensively: never overwrite array columns with null/undefined
    const payload: Record<string, unknown> = {
      name_el:         apt.name_el,
      name_en:         apt.name_en,
      description_el:  apt.description_el,
      description_en:  apt.description_en,
      price_per_night: apt.price_per_night,
      max_guests:      apt.max_guests,
      sqm:             apt.area_sqm,
      area_sqm:        apt.area_sqm,
      bedrooms:        apt.bedrooms,
      bathrooms:       apt.bathrooms,
      is_active:       apt.is_active,
      image_url:       apt.image_url ?? null,
    }
    if (apt.amenities != null) payload.amenities = apt.amenities
    if (apt.gallery   != null) { payload.gallery = apt.gallery; payload.images = apt.gallery }

    console.log('[SAVE] payload:', payload)

    const { error: err } = await supabase
      .from('apartments')
      .update(payload)
      .eq('id', apt.id)
    setSaving(null)
    if (err) {
      setError(err.message)
    } else {
      setSaved(apt.id)
      setTimeout(() => setSaved(null), 2000)
      fetch('/api/revalidate', { method: 'POST' }).catch(() => {})
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-bounce">🌿</div>
          <p className="text-gray-400 text-sm">Φόρτωση...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-light text-deep-wood mb-2 font-serif">CMS — Διαχείριση Περιεχομένου</h1>
      <p className="text-sm text-gray-400 mb-8">Επεξεργαστείτε τα καταλύματα, τιμές και παροχές</p>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
          ⚠️ {error}
        </div>
      )}

      {apartments.length === 0 && !error && (
        <div className="bg-white shadow-sm p-8 text-center text-gray-400">
          <p className="text-4xl mb-3">🏠</p>
          <p>Δεν βρέθηκαν καταλύματα στη βάση δεδομένων.</p>
          <p className="text-xs mt-2">Ελέγξτε ότι ο πίνακας <code>apartments</code> υπάρχει στο Supabase.</p>
        </div>
      )}

      {/* Settings Panel */}
      {settings && (
        <div className="bg-white shadow-sm mb-8">
          <div className="p-4 sm:p-5 bg-deep-wood/5 border-b border-deep-wood/8">
            <h2 className="font-serif text-lg text-deep-wood">Ρυθμίσεις Ιστοσελίδας</h2>
          </div>
          <div className="p-4 sm:p-6 space-y-6">

            {/* Quotes */}
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-400 mb-4 pb-2 border-b border-gray-100">
                Εισαγωγικό Απόσπασμα — εμφανίζεται στο Weather Widget
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(['el', 'en', 'de', 'fr'] as const).map(lng => {
                  const field = `quote_${lng}` as keyof SettingsRow
                  const label = lng === 'el' ? 'Απόσπασμα (ΕΛ)' : lng === 'en' ? 'Quote (EN)' : lng === 'de' ? 'Zitat (DE)' : 'Citation (FR)'
                  return (
                    <div key={lng}>
                      <label className="flex items-center gap-2 text-xs uppercase tracking-wider text-gray-400 mb-1.5">
                        {label}
                        {settingsStatus[field] === 'saving' && <span className="text-gray-300 font-normal normal-case not-italic">saving...</span>}
                        {settingsStatus[field] === 'saved'  && <span className="text-green-500 font-normal normal-case not-italic">✓</span>}
                        {settingsStatus[field] === 'error'  && <span className="text-red-500 font-normal normal-case not-italic">✗ failed</span>}
                      </label>
                      <textarea
                        value={String(settings[field] ?? '')}
                        onChange={e => updateSettings(field, e.target.value)}
                        onBlur={e => saveSettingsField(field, e.target.value)}
                        rows={3}
                        className="w-full border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-olive resize-none font-serif italic text-deep-wood/80"
                      />
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Distances */}
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-400 mb-4 pb-2 border-b border-gray-100">
                Αποστάσεις — εμφανίζονται στα Travel Cards
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {([
                  { field: 'airport_minutes', label: 'Αεροδρόμιο (λεπτά)' },
                  { field: 'airport_km',      label: 'Αεροδρόμιο (χλμ)' },
                  { field: 'port_minutes',    label: 'Λιμάνι (λεπτά)' },
                  { field: 'port_km',         label: 'Λιμάνι (χλμ)' },
                ] as const).map(({ field, label }) => (
                  <div key={field}>
                    <label className="flex items-center gap-2 text-xs uppercase tracking-wider text-gray-400 mb-1.5">
                      {label}
                      {settingsStatus[field] === 'saving' && <span className="text-gray-300 font-normal normal-case">...</span>}
                      {settingsStatus[field] === 'saved'  && <span className="text-green-500 font-normal normal-case">✓</span>}
                      {settingsStatus[field] === 'error'  && <span className="text-red-500 font-normal normal-case">✗</span>}
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={Number(settings[field as keyof SettingsRow] ?? 0)}
                      onChange={e => updateSettings(field as keyof SettingsRow, Number(e.target.value))}
                      onBlur={e => saveSettingsField(field, Number(e.target.value))}
                      className="w-full border border-gray-200 px-4 py-2.5 text-base focus:outline-none focus:border-olive"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Contact info */}
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-400 mb-4 pb-2 border-b border-gray-100">
                Στοιχεία Επικοινωνίας — Footer, EmergencyGrid, WhatsApp
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {([
                  { field: 'phone',    label: 'Τηλέφωνο (με +30)',     type: 'tel',   placeholder: '+30 694 457 1280' },
                  { field: 'email',    label: 'Email',                  type: 'email', placeholder: 'myrsinisstudios@gmail.com' },
                  { field: 'address',  label: 'Διεύθυνση',              type: 'text',  placeholder: 'Χόρτο, Πήλιο 37006' },
                ] as const).map(({ field, label, type, placeholder }) => (
                  <div key={field}>
                    <label className="flex items-center gap-2 text-xs uppercase tracking-wider text-gray-400 mb-1.5">
                      {label}
                      {settingsStatus[field] === 'saving' && <span className="text-gray-300 font-normal normal-case">...</span>}
                      {settingsStatus[field] === 'saved'  && <span className="text-green-500 font-normal normal-case">✓</span>}
                      {settingsStatus[field] === 'error'  && <span className="text-red-500 font-normal normal-case">✗</span>}
                    </label>
                    <input
                      type={type}
                      value={String(settings[field as keyof SettingsRow] ?? '')}
                      placeholder={placeholder}
                      onChange={e => updateSettings(field as keyof SettingsRow, e.target.value)}
                      onBlur={e => saveSettingsField(field, e.target.value)}
                      className="w-full border border-gray-200 px-4 py-2.5 text-base focus:outline-none focus:border-olive"
                    />
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-3">
                  {([
                    { field: 'checkin_time',  label: 'Check-in ώρα' },
                    { field: 'checkout_time', label: 'Check-out ώρα' },
                  ] as const).map(({ field, label }) => (
                    <div key={field}>
                      <label className="flex items-center gap-2 text-xs uppercase tracking-wider text-gray-400 mb-1.5">
                        {label}
                        {settingsStatus[field] === 'saving' && <span className="text-gray-300 font-normal normal-case">...</span>}
                        {settingsStatus[field] === 'saved'  && <span className="text-green-500 font-normal normal-case">✓</span>}
                        {settingsStatus[field] === 'error'  && <span className="text-red-500 font-normal normal-case">✗</span>}
                      </label>
                      <input
                        type="time"
                        value={String(settings[field as keyof SettingsRow] ?? '')}
                        onChange={e => updateSettings(field as keyof SettingsRow, e.target.value)}
                        onBlur={e => saveSettingsField(field, e.target.value)}
                        className="w-full border border-gray-200 px-4 py-2.5 text-base focus:outline-none focus:border-olive"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      <div className="space-y-8">
        {apartments.map(apt => {
          const folder = `myrsini-studios/apartments/${apt.slug || apt.id}`
          return (
            <div key={apt.id} className="bg-white shadow-sm">
              {/* Header */}
              <div className="p-4 sm:p-5 bg-deep-wood/5 border-b border-deep-wood/8 flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-serif text-lg text-deep-wood">{apt.name_el || 'Κατάλυμα'}</h2>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={apt.is_active}
                      onChange={e => updateField(apt.id, 'is_active', e.target.checked)}
                      className="accent-olive"
                    />
                    Ενεργό
                  </label>
                  <button
                    onClick={() => handleSave(apt)}
                    disabled={saving === apt.id}
                    className={`px-4 py-2 text-xs tracking-widest uppercase transition-colors ${
                      saved === apt.id ? 'bg-green-500 text-white' : 'bg-olive text-white hover:bg-deep-wood'
                    } disabled:opacity-50`}
                  >
                    {saving === apt.id ? 'Αποθήκευση...' : saved === apt.id ? '✓ Αποθηκεύτηκε' : 'Αποθήκευση'}
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left column */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5">Όνομα (ΕΛ)</label>
                      <input
                        type="text"
                        value={apt.name_el}
                        onChange={e => updateField(apt.id, 'name_el', e.target.value)}
                        className="w-full border border-gray-200 px-4 py-2.5 text-base focus:outline-none focus:border-olive"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5">Name (EN)</label>
                      <input
                        type="text"
                        value={apt.name_en ?? ''}
                        onChange={e => updateField(apt.id, 'name_en', e.target.value)}
                        className="w-full border border-gray-200 px-4 py-2.5 text-base focus:outline-none focus:border-olive"
                      />
                    </div>
                  </div>

                  <DescriptionEditor
                    label="Περιγραφή (ΕΛ)"
                    value={apt.description_el ?? ''}
                    onChange={v => updateField(apt.id, 'description_el', v)}
                  />

                  <DescriptionEditor
                    label="Description (EN)"
                    value={apt.description_en ?? ''}
                    onChange={v => updateField(apt.id, 'description_en', v)}
                  />

                  <ImageUploader
                    value={apt.image_url ?? ''}
                    onChange={url => updateField(apt.id, 'image_url', url)}
                    folder={folder}
                    autoSave={async url => {
                      const { error: err } = await supabase.from('apartments').update({ image_url: url }).eq('id', apt.id)
                      if (err) throw new Error(err.message)
                    }}
                  />

                  <GalleryUploader
                    gallery={apt.gallery ?? []}
                    onChange={g => updateField(apt.id, 'gallery', g)}
                    folder={folder}
                    autoSave={async g => {
                      const { error: err } = await supabase.from('apartments').update({ gallery: g, images: g }).eq('id', apt.id)
                      if (err) throw new Error(err.message)
                    }}
                  />
                </div>

                {/* Right column */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { key: 'price_per_night', label: 'Τιμή/νύχτα (€)', min: 1 },
                      { key: 'max_guests',      label: 'Μέγ. Άτομα',     min: 1 },
                      { key: 'area_sqm',        label: 'Εμβαδόν (m²)',    min: 1 },
                      { key: 'bedrooms',        label: 'Υπνοδωμάτια',    min: 0 },
                      { key: 'bathrooms',       label: 'Μπάνια',          min: 0 },
                    ].map(f => (
                      <div key={f.key}>
                        <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5">{f.label}</label>
                        <input
                          type="number"
                          min={f.min}
                          value={(apt[f.key as keyof AptRow] as number) ?? ''}
                          onChange={e => updateField(apt.id, f.key as keyof AptRow, Number(e.target.value))}
                          className="w-full border border-gray-200 px-4 py-2.5 text-base focus:outline-none focus:border-olive"
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-3">Παροχές</label>
                    <div className="grid grid-cols-2 gap-2">
                      {ALL_AMENITIES.map(am => {
                        const checked = (apt.amenities ?? []).includes(am.key)
                        return (
                          <label
                            key={am.key}
                            className={`flex items-center gap-2 p-2.5 border cursor-pointer transition-colors rounded-sm ${
                              checked ? 'border-olive bg-olive/8 text-olive' : 'border-gray-200 text-gray-500 hover:border-olive/40'
                            }`}
                          >
                            <input type="checkbox" checked={checked} onChange={() => toggleAmenity(apt.id, am.key)} className="sr-only" />
                            <span>{am.icon}</span>
                            <span className="text-xs">{am.label}</span>
                            {checked && <span className="ml-auto text-olive text-xs">✓</span>}
                          </label>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
