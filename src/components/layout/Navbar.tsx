'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const NAV_LINKS = [
  { href: '#apartments', label: 'Καταλύματα' },
  { href: '#activities', label: 'Δραστηριότητες' },
  { href: '#history', label: 'Ιστορία' },
  { href: '#hiking', label: 'Πεζοπορία' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        scrolled
          ? 'bg-cream/95 backdrop-blur-md shadow-sm border-b border-deep-wood/8'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/logo.png"
            alt="Myrsini Studios"
            width={44}
            height={44}
            className="object-contain rounded-sm"
          />
          <span
            className={`font-serif text-lg tracking-wide transition-colors duration-300 ${
              scrolled ? 'text-deep-wood' : 'text-white'
            }`}
          >
            Myrsini Studios
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className={`text-sm tracking-widest uppercase transition-colors duration-300 ${
                scrolled
                  ? 'text-deep-wood/60 hover:text-deep-wood'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {label}
            </a>
          ))}
          <a
            href="#booking"
            className="bg-olive text-white px-6 py-2.5 text-xs tracking-widest uppercase hover:bg-olive-dark transition-colors duration-200"
          >
            Κράτηση
          </a>
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Μενού"
        >
          <div className="w-5 flex flex-col gap-1.5">
            <span
              className={`h-0.5 w-full transition-all duration-300 ${
                menuOpen ? 'rotate-45 translate-y-2' : ''
              } ${scrolled ? 'bg-deep-wood' : 'bg-white'}`}
            />
            <span
              className={`h-0.5 w-full transition-all duration-300 ${
                menuOpen ? 'opacity-0 scale-x-0' : ''
              } ${scrolled ? 'bg-deep-wood' : 'bg-white'}`}
            />
            <span
              className={`h-0.5 w-full transition-all duration-300 ${
                menuOpen ? '-rotate-45 -translate-y-2' : ''
              } ${scrolled ? 'bg-deep-wood' : 'bg-white'}`}
            />
          </div>
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? 'max-h-96' : 'max-h-0'
        } bg-cream/98 backdrop-blur-md border-b border-deep-wood/10`}
      >
        <div className="px-6 py-4 space-y-1">
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="block py-3 text-deep-wood/60 hover:text-deep-wood text-sm tracking-widest uppercase border-b border-deep-wood/8 last:border-0"
            >
              {label}
            </a>
          ))}
          <div className="pt-2">
            <a
              href="#booking"
              onClick={() => setMenuOpen(false)}
              className="block bg-olive text-white text-center px-4 py-3 text-xs tracking-widest uppercase"
            >
              Κράτηση
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
