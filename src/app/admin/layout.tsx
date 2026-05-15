'use client'

import { useState } from 'react'

const NAV = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/bookings', label: 'Κρατήσεις' },
  { href: '/admin/finances', label: 'Οικονομικά' },
  { href: '/admin/cms', label: 'CMS' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  const handleLogin = () => {
    const stored = typeof window !== 'undefined' ? sessionStorage.getItem('admin') === 'true' : false
    if (stored || password === 'myrsini2026') {
      setAuth(true)
      sessionStorage.setItem('admin', 'true')
    } else {
      setError(true)
    }
  }

  if (!auth) {
    return (
      <div className="min-h-screen bg-deep-wood flex items-center justify-center px-4">
        <div className="bg-white p-8 w-full max-w-sm shadow-2xl">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🌿</div>
            <h1 className="font-serif text-2xl text-deep-wood">Admin Panel</h1>
            <p className="text-xs text-deep-wood/40 mt-1 tracking-wider">Myrsini Studios</p>
          </div>
          <input
            type="password"
            placeholder="Κωδικός πρόσβασης"
            value={password}
            onChange={e => { setPassword(e.target.value); setError(false) }}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            className="w-full border-2 border-gray-200 px-4 py-3 text-gray-900 text-sm mb-3 focus:outline-none focus:border-olive"
          />
          {error && <p className="text-red-500 text-xs mb-3">Λάθος κωδικός</p>}
          <button
            onClick={handleLogin}
            className="w-full bg-deep-wood text-white py-3 text-sm tracking-widest uppercase hover:bg-olive transition-colors"
          >
            Είσοδος
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-deep-wood text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="font-serif text-lg">Myrsini Admin</span>
          <div className="flex gap-1">
            {NAV.map(n => (
              <a
                key={n.href}
                href={n.href}
                className="text-white/60 hover:text-white hover:bg-white/10 px-3 py-1.5 text-sm rounded-sm transition-colors"
              >
                {n.label}
              </a>
            ))}
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
