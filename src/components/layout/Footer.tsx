'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import type { Lang } from '@/lib/i18n/translations'
import type { SiteSettings } from '@/components/home/WeatherWidget'

const MINI_VM = {
  name:    { el: 'Απαιτείται ονοματεπώνυμο (≥2 χαρακτήρες)', en: 'Full name required (min 2 chars)', de: 'Name erforderlich (mind. 2 Zeichen)', fr: 'Nom requis (min 2 caractères)' },
  email:   { el: 'Εισάγετε έγκυρη διεύθυνση email', en: 'Enter a valid email address', de: 'Gültige E-Mail-Adresse erforderlich', fr: 'Adresse e-mail valide requise' },
  message: { el: 'Παρακαλώ εισάγετε μήνυμα', en: 'Please enter a message', de: 'Bitte Nachricht eingeben', fr: 'Veuillez saisir un message' },
} as const

function MiniContactForm() {
  const { t, lang } = useLanguage()
  const c = t.contact
  const renderTimeRef = useRef(Date.now())
  const [name, setName]     = useState('')
  const [email, setEmail]   = useState('')
  const [msg, setMsg]       = useState('')
  const [hp, setHp]         = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errors, setErrors] = useState<Partial<Record<'name'|'email'|'message', string>>>({})

  const validate = () => {
    const errs: Partial<Record<'name'|'email'|'message', string>> = {}
    const l = (lang as Lang) in MINI_VM.name ? (lang as Lang) : 'el'
    if (name.trim().length < 2)                                   errs.name    = MINI_VM.name[l]
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))        errs.email   = MINI_VM.email[l]
    if (msg.trim().length === 0)                                  errs.message = MINI_VM.message[l]
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setStatus('sending')
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message: msg, _hp: hp, _t: renderTimeRef.current }),
      })
      setStatus(res.ok ? 'success' : 'error')
      if (res.ok) { setName(''); setEmail(''); setMsg(''); setErrors({}) }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <p className="text-sm text-white/70 py-2">{c.success}</p>
    )
  }

  return (
    <form onSubmit={send} className="space-y-2.5">
      <p className="text-white/50 text-xs tracking-widest uppercase mb-3">{c.miniTitle}</p>
      {/* Honeypot */}
      <input
        type="text"
        value={hp}
        onChange={e => setHp(e.target.value)}
        tabIndex={-1}
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}
        autoComplete="off"
      />
      <div>
        <input
          type="text"
          placeholder={c.name}
          value={name}
          onChange={e => { setName(e.target.value); setErrors(er => ({ ...er, name: undefined })) }}
          className={`w-full bg-white/8 border text-white/80 placeholder-white/30 text-xs px-3 py-2.5 focus:outline-none transition-colors ${errors.name ? 'border-red-400' : 'border-white/15 focus:border-white/40'}`}
        />
        {errors.name && <p className="text-red-400 text-[10px] mt-1">{errors.name}</p>}
      </div>
      <div>
        <input
          type="text"
          placeholder={c.email}
          value={email}
          onChange={e => { setEmail(e.target.value); setErrors(er => ({ ...er, email: undefined })) }}
          className={`w-full bg-white/8 border text-white/80 placeholder-white/30 text-xs px-3 py-2.5 focus:outline-none transition-colors ${errors.email ? 'border-red-400' : 'border-white/15 focus:border-white/40'}`}
        />
        {errors.email && <p className="text-red-400 text-[10px] mt-1">{errors.email}</p>}
      </div>
      <div>
        <textarea
          rows={3}
          placeholder={c.miniPlaceholder}
          value={msg}
          onChange={e => { setMsg(e.target.value); setErrors(er => ({ ...er, message: undefined })) }}
          className={`w-full bg-white/8 border text-white/80 placeholder-white/30 text-xs px-3 py-2.5 focus:outline-none transition-colors resize-none ${errors.message ? 'border-red-400' : 'border-white/15 focus:border-white/40'}`}
        />
        {errors.message && <p className="text-red-400 text-[10px] mt-1">{errors.message}</p>}
      </div>
      {status === 'error' && (
        <p className="text-red-400 text-xs">{c.error}</p>
      )}
      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full border border-white/25 text-white/70 text-xs px-4 py-2.5 tracking-wider hover:border-white/50 hover:text-white transition-colors disabled:opacity-50"
      >
        {status === 'sending' ? c.sending : c.miniBtn}
      </button>
    </form>
  )
}

export default function Footer() {
  const { t } = useLanguage()
  const [settings, setSettings] = useState<SiteSettings | null>(null)

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(d => { if (d) setSettings(d) })
      .catch(() => {})
  }, [])

  const phone   = settings?.phone         ?? '+30 694 457 1280'
  const email   = settings?.email         ?? 'myrsinisstudios@gmail.com'
  const address = settings?.address       ?? t.footer.address
  const ciTime  = settings?.checkin_time  ?? '14:00'
  const coTime  = settings?.checkout_time ?? '11:00'
  const waPhone = phone.replace(/\D/g, '')

  return (
    <footer className="bg-deep-wood text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid md:grid-cols-3 gap-12 mb-12">

          {/* Brand */}
          <div>
            <h3 className="font-serif text-2xl text-white mb-4">Myrsini&apos;s Studios</h3>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">{t.footer.tagline}</p>
            <div className="flex items-center gap-3 mt-6">
              <a href={`https://wa.me/${waPhone}`} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 text-xs tracking-wider hover:bg-[#1ebe5d] transition-colors min-h-[44px]">
                <span>WhatsApp</span>
              </a>
              <Link href="/contact"
                className="inline-flex items-center gap-2 border border-white/20 text-white/70 px-4 py-2 text-xs tracking-wider hover:border-white/50 hover:text-white transition-colors min-h-[44px]">
                {t.nav.contact}
              </Link>
            </div>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="text-white/50 text-xs tracking-widest uppercase mb-5">{t.footer.contact}</h4>
            <div className="space-y-3 text-sm text-white/60">
              <a href={`tel:${phone.replace(/\s/g, '')}`} className="inline-flex items-center gap-2 hover:text-white transition-colors">
                <span>📞</span> {phone}
              </a>
              <br />
              <a href={`mailto:${email}`} className="inline-flex items-center gap-2 hover:text-white transition-colors">
                <span>✉️</span> {email}
              </a>
              <p className="flex items-center gap-2">
                <span>📍</span> {address}
              </p>
              <p className="flex items-center gap-2 text-white/40 text-xs mt-1">
                <span>🕐</span> Check-in {ciTime} · Check-out {coTime}
              </p>
            </div>
          </div>

          {/* Mini form */}
          <div>
            <MiniContactForm />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 text-white/30 text-xs">
          <span>© {new Date().getFullYear()} Myrsini&apos;s Studios · {address}</span>
        </div>
      </div>
    </footer>
  )
}
