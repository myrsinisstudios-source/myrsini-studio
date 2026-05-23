'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

type SoulContent = {
  id: number
  title_el: string; title_en: string; title_de: string; title_fr: string
  body_el: string;  body_en: string;  body_de: string;  body_fr: string
  image_url: string
}

const EMPTY: Omit<SoulContent, 'id'> = {
  title_el: '', title_en: '', title_de: '', title_fr: '',
  body_el: '', body_en: '', body_de: '', body_fr: '',
  image_url: '',
}

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

const TABS = [
  { key: 'el', label: 'ΕΛ', flag: '🇬🇷' },
  { key: 'en', label: 'EN', flag: '🇬🇧' },
  { key: 'de', label: 'DE', flag: '🇩🇪' },
  { key: 'fr', label: 'FR', flag: '🇫🇷' },
] as const

export default function AdminSoulPage() {
  const supabase = createClient()
  const [form, setForm]     = useState<Omit<SoulContent, 'id'>>(EMPTY)
  const [state, setState]   = useState<SaveState>('idle')
  const [errMsg, setErrMsg] = useState('')
  const [tab, setTab]       = useState<'el' | 'en' | 'de' | 'fr'>('el')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    supabase.from('soul_content').select('*').eq('id', 1).single()
      .then(({ data }) => {
        if (data) setForm({
          title_el: data.title_el ?? '', title_en: data.title_en ?? '',
          title_de: data.title_de ?? '', title_fr: data.title_fr ?? '',
          body_el:  data.body_el  ?? '', body_en:  data.body_en  ?? '',
          body_de:  data.body_de  ?? '', body_fr:  data.body_fr  ?? '',
          image_url: data.image_url ?? '',
        })
        setLoaded(true)
      })
  }, [])

  const handleSave = async () => {
    setState('saving')
    setErrMsg('')
    const { error } = await supabase.from('soul_content').upsert({ id: 1, ...form })
    if (error) { setState('error'); setErrMsg(error.message) }
    else { setState('saved'); setTimeout(() => setState('idle'), 2500) }
  }

  const setField = (key: keyof typeof EMPTY, val: string) => setForm(p => ({ ...p, [key]: val }))

  if (!loaded) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-6 h-6 rounded-full border-2 border-olive/30 border-t-olive animate-spin" />
    </div>
  )

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-light" style={{ color: '#2C1B0E' }}>Soul Section</h1>
        <p className="text-xs mt-1" style={{ color: '#8B7355' }}>Κείμενο για την ενότητα «Ψυχή του Πηλίου» — εμφανίζεται στην ιστορία</p>
      </div>

      {/* Image URL */}
      <div className="bg-white rounded-xl p-5 space-y-3" style={{ border: '1px solid #E8E0D0' }}>
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#8B7355' }}>Εικόνα Ενότητας</p>
        <input
          value={form.image_url}
          onChange={e => setField('image_url', e.target.value)}
          placeholder="https://... (Cloudinary URL)"
          className="w-full px-3 py-2 text-sm focus:outline-none rounded-lg"
          style={{ border: '1px solid #D5CCBB', background: '#FAFAF8', color: '#2C1B0E' }}
        />
        {form.image_url && (
          <div className="h-32 overflow-hidden rounded-lg border border-gray-100">
            <img src={form.image_url} alt="" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
          </div>
        )}
      </div>

      {/* Language tabs */}
      <div className="bg-white rounded-xl overflow-hidden" style={{ border: '1px solid #E8E0D0' }}>
        <div className="flex" style={{ borderBottom: '1px solid #E8E0D0' }}>
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="flex items-center gap-1.5 px-4 py-3 text-xs font-medium transition-colors"
              style={{
                background: tab === t.key ? '#F5F0E8' : 'transparent',
                color: tab === t.key ? '#3A2200' : '#8B7355',
                borderBottom: tab === t.key ? '2px solid #C9A96E' : '2px solid transparent',
              }}
            >
              {t.flag} {t.label}
            </button>
          ))}
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-wider mb-1.5 font-medium" style={{ color: '#8B7355' }}>
              Τίτλος ({tab.toUpperCase()})
            </label>
            <input
              value={form[`title_${tab}`]}
              onChange={e => setField(`title_${tab}`, e.target.value)}
              placeholder={tab === 'el' ? 'Η Ψυχή του Πηλίου' : tab === 'en' ? 'The Soul of Pelion' : tab === 'de' ? 'Die Seele von Pelion' : "L'Âme du Pélion"}
              className="w-full px-3 py-2 text-base focus:outline-none rounded-lg"
              style={{ border: '1px solid #D5CCBB', background: '#FAFAF8', color: '#2C1B0E' }}
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-wider mb-1.5 font-medium" style={{ color: '#8B7355' }}>
              Κείμενο ({tab.toUpperCase()}) — υποστηρίζει Markdown
            </label>
            <textarea
              value={form[`body_${tab}`]}
              onChange={e => setField(`body_${tab}`, e.target.value)}
              rows={8}
              placeholder="Γράψε το κείμενο εδώ..."
              className="w-full px-3 py-2 text-sm focus:outline-none rounded-lg resize-y font-mono"
              style={{ border: '1px solid #D5CCBB', background: '#FAFAF8', color: '#2C1B0E' }}
            />
          </div>
        </div>
      </div>

      {/* Save */}
      {errMsg && (
        <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-600 rounded-lg">✗ {errMsg}</div>
      )}
      <button
        onClick={handleSave}
        disabled={state === 'saving'}
        className="px-8 py-3 text-xs tracking-widest uppercase text-white rounded-lg transition-all hover:opacity-90 disabled:opacity-50"
        style={{
          background: state === 'saved' ? '#22c55e' : state === 'error' ? '#ef4444' : '#C9A96E',
        }}
      >
        {state === 'saving' ? '...' : state === 'saved' ? '✓ Αποθηκεύτηκε' : state === 'error' ? '✗ Σφάλμα' : 'Αποθήκευση'}
      </button>
    </div>
  )
}
