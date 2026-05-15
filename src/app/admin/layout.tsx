'use client'

import { useState } from 'react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  const handleLogin = () => {
if (password === 'myrsini2026' || typeof window !== 'undefined' && sessionStorage.getItem('admin') === 'true') {
      setAuth(true)
      sessionStorage.setItem('admin', 'true')
    } else {
      setError(true)
    }
  }

  if (!auth) {
    return (
      <div className="min-h-screen bg-[#2C1B0E] flex items-center justify-center">
        <div className="bg-white p-8 w-full max-w-sm">
          <h1 className="text-xl font-light text-[#2C1B0E] mb-6 text-center">Admin Panel</h1>
         <input
  type="password"
  placeholder="Κωδικός"
  value={password}
  onChange={(e) => { setPassword(e.target.value); setError(false) }}
  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
  className="w-full border-2 border-gray-400 px-4 py-3 text-gray-900 placeholder-gray-600 text-sm mb-4 focus:outline-none focus:border-[#4a5d45]"
/>
          {error && <p className="text-red-500 text-xs mb-4">Λάθος κωδικός</p>}
          <button
            onClick={handleLogin}
            className="w-full bg-[#2C1B0E] text-white py-3 text-sm tracking-widest uppercase hover:bg-[#4a5d45] transition-colors"
          >
            Είσοδος
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-[#2C1B0E] text-white px-6 py-4 flex items-center justify-between">
        <span className="font-light tracking-[-0.02em]">Myrsini Admin</span>
        <div className="flex gap-6 text-sm">
          <a href="/admin" className="text-white/70 hover:text-white transition-colors">Dashboard</a>
          <a href="/admin/bookings" className="text-white/70 hover:text-white transition-colors">Κρατήσεις</a>
          <a href="/admin/finances" className="text-white/70 hover:text-white transition-colors">Οικονομικά</a>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}