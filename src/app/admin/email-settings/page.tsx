'use client'

import { useState, useEffect, useCallback } from 'react'

type ContactMessage = {
  id: string
  created_at: string
  name: string
  email: string
  subject: string | null
  message: string
  apartment_slug: string | null
  is_read: boolean
}

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export default function EmailSettingsPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<ContactMessage | null>(null)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const loadMessages = useCallback(async () => {
    if (!SB_URL || !SB_KEY) {
      setError('Supabase not configured')
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const res = await fetch(
        `${SB_URL}/rest/v1/contact_messages?select=*&order=created_at.desc&limit=100`,
        { headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` } }
      )
      if (!res.ok) {
        const txt = await res.text()
        if (txt.includes('does not exist') || res.status === 404) {
          setError('table_missing')
        } else {
          setError('fetch_error')
        }
        setLoading(false)
        return
      }
      const data: ContactMessage[] = await res.json()
      setMessages(data)
      setError(null)
    } catch {
      setError('fetch_error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadMessages() }, [loadMessages])

  const markRead = async (id: string) => {
    if (!SB_URL || !SB_KEY) return
    await fetch(`${SB_URL}/rest/v1/contact_messages?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        apikey: SB_KEY,
        Authorization: `Bearer ${SB_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ is_read: true }),
    })
    setMessages(ms => ms.map(m => m.id === id ? { ...m, is_read: true } : m))
  }

  const deleteMsg = async (id: string) => {
    if (!SB_URL || !SB_KEY) return
    await fetch(`${SB_URL}/rest/v1/contact_messages?id=eq.${id}`, {
      method: 'DELETE',
      headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` },
    })
    setMessages(ms => ms.filter(m => m.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  const displayed = filter === 'unread' ? messages.filter(m => !m.is_read) : messages
  const unreadCount = messages.filter(m => !m.is_read).length

  const SQL_HINT = `CREATE TABLE contact_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  apartment_slug text,
  is_read boolean DEFAULT false
);`

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-2xl font-light" style={{ color: '#2C1B0E' }}>Μηνύματα Επικοινωνίας</h1>
          <p className="text-xs mt-0.5" style={{ color: '#8B7355' }}>
            Μηνύματα από φόρμα επικοινωνίας
            {unreadCount > 0 && <span className="ml-2 bg-olive text-white px-1.5 py-0.5 rounded text-[10px]">{unreadCount} νέα</span>}
          </p>
        </div>
        <button
          onClick={loadMessages}
          className="text-xs px-3 py-1.5 rounded-lg transition-colors"
          style={{ background: '#F0EBE3', color: '#5A4A35' }}
        >
          ↺ Ανανέωση
        </button>
      </div>

      {/* Table-missing hint */}
      {error === 'table_missing' && (
        <div className="rounded-xl p-5 space-y-3" style={{ background: '#FFF8F0', border: '1px solid #F0D8B0' }}>
          <p className="text-sm font-semibold" style={{ color: '#8B4513' }}>
            ⚠️ Η Supabase table <code>contact_messages</code> δεν υπάρχει ακόμα.
          </p>
          <p className="text-xs" style={{ color: '#6B4423' }}>
            Εκτελέστε το παρακάτω SQL στο Supabase SQL Editor:
          </p>
          <pre className="text-[11px] p-3 rounded overflow-x-auto" style={{ background: '#FFF0E0', color: '#5A3010' }}>
            {SQL_HINT}
          </pre>
        </div>
      )}

      {error && error !== 'table_missing' && (
        <div className="rounded-xl p-4" style={{ background: '#FFF0F0', border: '1px solid #FFD0D0' }}>
          <p className="text-sm text-red-700">Σφάλμα φόρτωσης: {error}</p>
        </div>
      )}

      {!error && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* List */}
          <div className="lg:col-span-2 rounded-xl bg-white overflow-hidden" style={{ border: '1px solid #E8E0D0' }}>
            {/* Filter bar */}
            <div className="flex gap-1 p-2" style={{ borderBottom: '1px solid #F0EBE3' }}>
              {(['all', 'unread'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="px-3 py-1.5 rounded-lg text-xs transition-all"
                  style={filter === f
                    ? { background: '#E5DDD0', color: '#3A2200', fontWeight: 600 }
                    : { color: '#8B7355' }
                  }
                >
                  {f === 'all' ? `Όλα (${messages.length})` : `Αδιάβαστα (${unreadCount})`}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="py-16 text-center text-xs" style={{ color: '#A09080' }}>Φόρτωση...</div>
            ) : displayed.length === 0 ? (
              <div className="py-16 text-center text-xs" style={{ color: '#A09080' }}>
                {filter === 'unread' ? 'Κανένα αδιάβαστο μήνυμα' : 'Κανένα μήνυμα ακόμα'}
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: '#F0EBE3' }}>
                {displayed.map(msg => (
                  <button
                    key={msg.id}
                    onClick={() => { setSelected(msg); if (!msg.is_read) markRead(msg.id) }}
                    className="w-full text-left px-4 py-3 transition-colors"
                    style={{
                      background: selected?.id === msg.id ? '#F5F0E8' : 'transparent',
                      borderLeft: selected?.id === msg.id ? '3px solid #C9A96E' : '3px solid transparent',
                    }}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-sm font-medium truncate" style={{ color: msg.is_read ? '#5A4A35' : '#2C1B0E' }}>
                        {!msg.is_read && <span className="inline-block w-1.5 h-1.5 rounded-full bg-olive mr-1.5 mb-0.5 align-middle" />}
                        {msg.name}
                      </p>
                      <p className="text-[10px] shrink-0 ml-2" style={{ color: '#A09080' }}>
                        {new Date(msg.created_at).toLocaleDateString('el-GR')}
                      </p>
                    </div>
                    <p className="text-xs truncate" style={{ color: '#8B7355' }}>{msg.email}</p>
                    {msg.subject && <p className="text-[11px] truncate mt-0.5" style={{ color: '#A09080' }}>{msg.subject}</p>}
                    {msg.apartment_slug && (
                      <p className="text-[10px] mt-0.5" style={{ color: '#C9A96E' }}>🏡 {msg.apartment_slug}</p>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Detail */}
          <div className="lg:col-span-3 rounded-xl bg-white p-5 min-h-[300px]" style={{ border: '1px solid #E8E0D0' }}>
            {!selected ? (
              <div className="h-full flex items-center justify-center text-xs" style={{ color: '#A09080' }}>
                Επιλέξτε μήνυμα για προβολή
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-semibold" style={{ color: '#2C1B0E' }}>{selected.name}</h3>
                    <a href={`mailto:${selected.email}`} className="text-xs hover:underline" style={{ color: '#C9A96E' }}>
                      {selected.email}
                    </a>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject ?? 'Myrsini Studios')}`}
                      className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                      style={{ background: '#E5DDD0', color: '#3A2200' }}
                    >
                      ↩ Reply
                    </a>
                    <button
                      onClick={() => deleteMsg(selected.id)}
                      className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                      style={{ background: '#FFE8E8', color: '#B02020' }}
                    >
                      🗑 Διαγραφή
                    </button>
                  </div>
                </div>

                <div className="text-[11px] space-y-1" style={{ color: '#8B7355' }}>
                  <p>📅 {new Date(selected.created_at).toLocaleString('el-GR')}</p>
                  {selected.subject && <p>📌 {selected.subject}</p>}
                  {selected.apartment_slug && <p>🏡 {selected.apartment_slug}</p>}
                </div>

                <div className="p-4 rounded-lg text-sm leading-relaxed whitespace-pre-wrap" style={{ background: '#F9F6F1', color: '#2C1B0E', border: '1px solid #EDE7DA' }}>
                  {selected.message}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
