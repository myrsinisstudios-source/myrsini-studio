'use client'

import { useState, useRef } from 'react'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import type { SiteSettings } from '@/components/home/WeatherWidget'
import { useEffect } from 'react'

export default function ContactPage() {
  const { t } = useLanguage()
  const c = t.contact
  const renderTimeRef = useRef(Date.now())

  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [hp, setHp]           = useState('')
  const [status, setStatus]   = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const [settings, setSettings] = useState<SiteSettings | null>(null)
  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(d => { if (d) setSettings(d) }).catch(() => {})
  }, [])

  const phone   = settings?.phone   ?? '+30 694 457 1280'
  const emailAddr = settings?.email ?? 'myrsinisstudios@gmail.com'
  const address = settings?.address ?? 'Χόρτο, Πήλιο 37006'
  const waPhone = phone.replace(/\D/g, '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message, _hp: hp, _t: renderTimeRef.current }),
      })
      if (res.ok) {
        setStatus('success')
        setName(''); setEmail(''); setSubject(''); setMessage('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-cream pt-24">

      {/* Hero */}
      <div className="bg-deep-wood text-white py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-white/40 text-xs tracking-widest uppercase mb-3">Myrsini&apos;s Studios</p>
          <h1 className="font-serif text-4xl sm:text-5xl">{c.title}</h1>
          <p className="text-white/60 mt-3 text-lg font-light">{c.subtitle}</p>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid lg:grid-cols-3 gap-12">

          {/* ── Contact info ── */}
          <div className="lg:col-span-1 space-y-8">
            <div>
              <h2 className="text-xs uppercase tracking-widest text-deep-wood/40 mb-5">{c.infoTitle}</h2>
              <div className="space-y-4 text-sm text-deep-wood/70">
                <a href={`tel:${phone.replace(/\s/g, '')}`}
                  className="flex items-start gap-3 hover:text-deep-wood transition-colors">
                  <span className="text-lg mt-0.5">📞</span>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-deep-wood/40 mb-0.5">{c.phone}</p>
                    <p>{phone}</p>
                  </div>
                </a>
                <a href={`mailto:${emailAddr}`}
                  className="flex items-start gap-3 hover:text-deep-wood transition-colors">
                  <span className="text-lg mt-0.5">✉️</span>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-deep-wood/40 mb-0.5">{c.emailLabel}</p>
                    <p>{emailAddr}</p>
                  </div>
                </a>
                <div className="flex items-start gap-3">
                  <span className="text-lg mt-0.5">📍</span>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-deep-wood/40 mb-0.5">{c.address}</p>
                    <p>{address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/${waPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white px-5 py-3 text-sm tracking-wide hover:bg-[#1ebe5d] transition-colors"
            >
              <span>💬</span> WhatsApp
            </a>

            {/* Map embed */}
            <div className="aspect-video bg-deep-wood/5 border border-deep-wood/10 overflow-hidden">
              <iframe
                title="Myrsini Studios location"
                src="https://www.google.com/maps?q=39.1908056,23.2164952&z=16&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <a
              href="https://maps.app.goo.gl/n1f28Dj7Gxjy4tdP9"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-deep-wood/60 hover:text-deep-wood transition-colors"
            >
              <span>🗺️</span> {c.mapBtn}
            </a>
          </div>

          {/* ── Form ── */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Honeypot — hidden from humans */}
              <input
                type="text"
                name="_hp"
                value={hp}
                onChange={e => setHp(e.target.value)}
                tabIndex={-1}
                aria-hidden="true"
                style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}
                autoComplete="off"
              />

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-deep-wood/50 mb-1.5">{c.name} *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-deep-wood/15 text-deep-wood text-sm focus:outline-none focus:border-olive transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-deep-wood/50 mb-1.5">{c.email} *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-deep-wood/15 text-deep-wood text-sm focus:outline-none focus:border-olive transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-deep-wood/50 mb-1.5">{c.subject}</label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-deep-wood/15 text-deep-wood text-sm focus:outline-none focus:border-olive transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-deep-wood/50 mb-1.5">{c.message} *</label>
                <textarea
                  required
                  rows={6}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-deep-wood/15 text-deep-wood text-sm focus:outline-none focus:border-olive transition-colors resize-none"
                />
              </div>

              {status === 'success' && (
                <p className="text-sm text-olive bg-olive/5 border border-olive/20 px-4 py-3">{c.success}</p>
              )}
              {status === 'error' && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-3">{c.error}</p>
              )}

              <button
                type="submit"
                disabled={status === 'sending' || status === 'success'}
                className="bg-deep-wood text-white px-8 py-3.5 text-sm tracking-wide hover:bg-olive transition-colors disabled:opacity-60"
              >
                {status === 'sending' ? c.sending : c.send}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
