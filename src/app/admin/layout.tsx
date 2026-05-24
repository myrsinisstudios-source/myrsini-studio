'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const IcoDashboard = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
    <rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>
  </svg>
)
const IcoBookings = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
    <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>
  </svg>
)
const IcoFinance = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
    <path d="M14.5 8.5C14.5 7.12 13.38 6 12 6s-2.5 1.12-2.5 2.5c0 2.5 5 3 5 6 0 1.66-1.34 3-3 3s-3-1.34-3-3M12 6V4M12 18v2"/>
  </svg>
)
const IcoActivities = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
  </svg>
)
const IcoMaintenance = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
  </svg>
)
const IcoSettings = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
  </svg>
)
const IcoSoul = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10a8 8 0 00-16 0c0 6 8 10 8 10z"/>
    <path d="M12 8v4M12 16h.01"/>
  </svg>
)
const IcoHeritage = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>
)
const IcoMemories = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
)
const IcoPOI = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
)
const IcoHiking = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 17l4-8 4 4 3-6 4 10"/>
    <path d="M3 20h18"/>
  </svg>
)

const NAV = [
  { href: '/admin',            Icon: IcoDashboard,   label: 'Dashboard',      sub: 'Active',           exact: true },
  { href: '/admin/bookings',   Icon: IcoBookings,    label: 'Κρατήσεις',      sub: 'Bookings' },
  { href: '/admin/finances',   Icon: IcoFinance,     label: 'Οικονομικά',     sub: 'Finance' },
  { href: '/admin/activities', Icon: IcoActivities,  label: 'Δραστηριότητες', sub: 'Activities CMS' },
  { href: '/admin/hiking',     Icon: IcoHiking,      label: 'Μονοπάτια',      sub: 'Hiking Trails' },
  { href: '/admin/soul',       Icon: IcoSoul,        label: 'Ψυχή Πηλίου',   sub: 'Soul Section' },
  { href: '/admin/heritage',   Icon: IcoHeritage,    label: 'Κληρονομιά',          sub: 'Heritage Photos' },
  { href: '/admin/memories',   Icon: IcoMemories,    label: 'Παλιές Αναμνήσεις',  sub: 'Slider Photos' },
  { href: '/admin/pois',       Icon: IcoPOI,         label: 'Τοπικός Οδηγός',     sub: 'Local Guide' },
  { href: '/admin/cms',        Icon: IcoMaintenance, label: 'Συντήρηση',           sub: 'Maintenance Log' },
  { href: '/admin/settings',   Icon: IcoSettings,    label: 'Ρυθμίσεις',      sub: 'Settings' },
]

function SidebarContent({ pathname, onClose }: { pathname: string | null; onClose?: () => void }) {
  return (
    <>
      {/* Logo */}
      <div className="px-5 py-5 flex items-center justify-between" style={{ borderBottom: '1px solid #E3DBD0' }}>
        <div>
          <p className="text-[10px] tracking-widest uppercase mb-1" style={{ color: '#A08060' }}>Διαχειριστής</p>
          <p className="font-serif text-base leading-snug" style={{ color: '#2C1B0E' }}>Myrsini Studios</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-xl leading-none" style={{ color: '#A09080' }}>×</button>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-2.5 py-3 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, Icon, label, sub, exact }) => {
          const active = exact ? pathname === href : (pathname === href || pathname?.startsWith(href + '/'))
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className="flex items-start gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group"
              style={active ? { background: '#E5DDD0', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' } : { background: 'transparent' }}
            >
              <span className="mt-0.5 shrink-0" style={{ color: active ? '#8B6914' : '#B0A090' }}>
                <Icon />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium leading-tight" style={{ color: active ? '#3A2200' : '#5A4A35' }}>
                  {label}
                </p>
                <p className="text-[10px] mt-0.5 leading-snug line-clamp-2"
                  style={{ color: active ? '#8B6914' : '#A09080', fontStyle: active && href === '/admin' ? 'italic' : 'normal' }}>
                  {active && href === '/admin' ? 'Active' : sub}
                </p>
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-3" style={{ borderTop: '1px solid #E3DBD0' }}>
        <button
          onClick={() => { localStorage.removeItem('admin'); window.location.reload() }}
          className="w-full text-left text-xs px-2 py-2 rounded-lg transition-colors hover:bg-[#EDE7DA]"
          style={{ color: '#A09080' }}
        >
          ← Έξοδος
        </button>
      </div>
    </>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    if (localStorage.getItem('admin') === 'true') setAuth(true)
  }, [])

  const handleLogin = () => {
    if (localStorage.getItem('admin') === 'true' || password === 'myrsini2026') {
      setAuth(true)
      localStorage.setItem('admin', 'true')
    } else {
      setError(true)
    }
  }

  if (!auth) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center px-4" style={{ background: '#F5F0E8' }}>
        <div className="bg-white p-8 w-full max-w-xs shadow-xl" style={{ border: '1px solid #E8E0D0' }}>
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-serif text-xl" style={{ background: '#C9A96E' }}>M</div>
            <h1 className="font-serif text-xl" style={{ color: '#3A2A1A' }}>Myrsini Studios</h1>
            <p className="text-xs mt-1 tracking-wider uppercase" style={{ color: '#8B7355' }}>Admin Panel</p>
          </div>
          <input
            type="password"
            placeholder="Κωδικός πρόσβασης"
            value={password}
            onChange={e => { setPassword(e.target.value); setError(false) }}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            className="w-full px-4 py-3 text-base mb-3 focus:outline-none"
            style={{ border: '1px solid #D5CCBB', background: '#FAFAF8', color: '#3A2A1A' }}
          />
          {error && <p className="text-red-500 text-xs mb-3 text-center">Λάθος κωδικός</p>}
          <button
            onClick={handleLogin}
            className="w-full py-3 text-xs tracking-widest uppercase text-white transition-opacity hover:opacity-90"
            style={{ background: '#C9A96E' }}
          >
            Είσοδος
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] flex" style={{ background: '#F0EDE6' }}>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ─── Sidebar ─── */}
      <aside
        className={`fixed md:relative z-40 md:z-auto h-full md:h-auto w-64 md:w-52 shrink-0 flex flex-col transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        style={{ background: '#F5F0E8', borderRight: '1px solid #E3DBD0' }}
      >
        <SidebarContent pathname={pathname} onClose={() => setSidebarOpen(false)} />
      </aside>

      {/* ─── Main ─── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-12 flex items-center justify-between px-4 sm:px-6 shrink-0" style={{ background: '#FFFFFF', borderBottom: '1px solid #E8E0D0' }}>
          {/* Hamburger — mobile only */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-1.5 rounded"
            onClick={() => setSidebarOpen(s => !s)}
            aria-label="Μενού"
          >
            <span className="block w-5 h-0.5 bg-[#5A4A35]" />
            <span className="block w-5 h-0.5 bg-[#5A4A35]" />
            <span className="block w-5 h-0.5 bg-[#5A4A35]" />
          </button>

          <div className="hidden md:block" /> {/* spacer on desktop */}

          <div className="flex items-center gap-2.5">
            <div className="text-right leading-none">
              <p className="text-[10px]" style={{ color: '#A09080' }}>Myrsini</p>
              <p className="text-sm font-medium" style={{ color: '#2C1B0E' }}>Studios</p>
            </div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-serif"
              style={{ background: 'linear-gradient(135deg, #C9A96E, #a8793f)' }}>
              M
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-5 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
