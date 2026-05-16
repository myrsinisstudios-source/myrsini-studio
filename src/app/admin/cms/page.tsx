'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

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

function GalleryEditor({ gallery, onChange }: { gallery: string[]; onChange: (g: string[]) => void }) {
  const add = () => onChange([...gallery, ''])
  const remove = (i: number) => onChange(gallery.filter((_, idx) => idx !== i))
  const update = (i: number, val: string) => onChange(gallery.map((v, idx) => idx === i ? val : v))

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-xs uppercase tracking-wider text-gray-400">Gallery Εικόνες</label>
        <button
          type="button"
          onClick={add}
          className="text-xs px-2.5 py-1 border border-olive text-olive hover:bg-olive hover:text-white transition-colors"
        >
          + Προσθήκη
        </button>
      </div>
      <div className="space-y-2">
        {gallery.map((url, i) => (
          <div key={i} className="flex gap-2 items-start">
            <div className="flex-1">
              <input
                type="url"
                value={url}
                onChange={e => update(i, e.target.value)}
                placeholder="https://..."
                className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-olive"
              />
              {url && (
                <img
                  src={url}
                  alt={`Gallery ${i + 1}`}
                  className="mt-1 h-16 w-full object-cover border border-gray-100"
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              )}
            </div>
            <button
              type="button"
              onClick={() => remove(i)}
              className="text-red-400 hover:text-red-600 px-2 py-2 text-lg leading-none shrink-0"
            >
              ×
            </button>
          </div>
        ))}
        {gallery.length === 0 && (
          <p className="text-xs text-gray-400 italic">Δεν υπάρχουν φωτογραφίες gallery</p>
        )}
      </div>
    </div>
  )
}

export default function CmsPage() {
  const supabase = createClient()
  const [apartments, setApartments] = useState<AptRow[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase
      .from('apartments')
      .select('*')
      .then(({ data, error }) => {
        if (error) {
          setError('Δεν ήταν δυνατή η φόρτωση. Ελέγξτε τα Supabase credentials.')
        } else {
          setApartments((data ?? []) as AptRow[])
        }
        setLoading(false)
      })
  }, [])

  const updateField = (id: string, field: keyof AptRow, value: unknown) => {
    setApartments(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a))
  }

  const toggleAmenity = (id: string, key: string) => {
    const apt = apartments.find(a => a.id === id)
    if (!apt) return
    const current: string[] = apt.amenities ?? []
    const next = current.includes(key) ? current.filter(k => k !== key) : [...current, key]
    updateField(id, 'amenities', next)
  }

  const handleSave = async (apt: AptRow) => {
    setSaving(apt.id)
    const { error } = await supabase
      .from('apartments')
      .update({
        name_el: apt.name_el,
        name_en: apt.name_en,
        description_el: apt.description_el,
        description_en: apt.description_en,
        price_per_night: apt.price_per_night,
        max_guests: apt.max_guests,
        area_sqm: apt.area_sqm,
        bedrooms: apt.bedrooms,
        bathrooms: apt.bathrooms,
        amenities: apt.amenities,
        is_active: apt.is_active,
        image_url: apt.image_url,
        gallery: apt.gallery ?? [],
      })
      .eq('id', apt.id)

    setSaving(null)
    if (error) {
      setError(error.message)
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

      <div className="space-y-8">
        {apartments.map(apt => (
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
                    saved === apt.id
                      ? 'bg-green-500 text-white'
                      : 'bg-olive text-white hover:bg-deep-wood'
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
                      className="w-full border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-olive"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5">Name (EN)</label>
                    <input
                      type="text"
                      value={apt.name_en ?? ''}
                      onChange={e => updateField(apt.id, 'name_en', e.target.value)}
                      className="w-full border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-olive"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5">Περιγραφή (ΕΛ)</label>
                  <textarea
                    value={apt.description_el ?? ''}
                    onChange={e => updateField(apt.id, 'description_el', e.target.value)}
                    rows={3}
                    className="w-full border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-olive resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5">Description (EN)</label>
                  <textarea
                    value={apt.description_en ?? ''}
                    onChange={e => updateField(apt.id, 'description_en', e.target.value)}
                    rows={3}
                    className="w-full border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-olive resize-none"
                  />
                </div>

                {/* Main image */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5">Κεντρική Εικόνα (URL)</label>
                  <input
                    type="url"
                    value={apt.image_url ?? ''}
                    onChange={e => updateField(apt.id, 'image_url', e.target.value)}
                    placeholder="https://..."
                    className="w-full border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-olive"
                  />
                  {apt.image_url && (
                    <img
                      src={apt.image_url}
                      alt="Preview"
                      className="mt-2 h-32 w-full object-cover border border-gray-100"
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                  )}
                </div>

                {/* Gallery */}
                <GalleryEditor
                  gallery={apt.gallery ?? []}
                  onChange={g => updateField(apt.id, 'gallery', g)}
                />
              </div>

              {/* Right column */}
              <div className="space-y-4">
                {/* Numeric fields */}
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
                        className="w-full border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-olive"
                      />
                    </div>
                  ))}
                </div>

                {/* Amenities */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-3">Παροχές</label>
                  <div className="grid grid-cols-2 gap-2">
                    {ALL_AMENITIES.map(am => {
                      const checked = (apt.amenities ?? []).includes(am.key)
                      return (
                        <label
                          key={am.key}
                          className={`flex items-center gap-2 p-2.5 border cursor-pointer transition-colors rounded-sm ${
                            checked
                              ? 'border-olive bg-olive/8 text-olive'
                              : 'border-gray-200 text-gray-500 hover:border-olive/40'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleAmenity(apt.id, am.key)}
                            className="sr-only"
                          />
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
        ))}
      </div>
    </div>
  )
}
