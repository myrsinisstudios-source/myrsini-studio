'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import type { Lang } from '@/lib/i18n/translations'

const LANGS: Lang[] = ['el', 'en', 'de', 'fr']

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { t, lang, setLang } = useLanguage()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const NAV_LINKS = [
    { href: '/#apartments', label: t.nav.apartments },
    { href: '/#activities', label: t.nav.activities },
    { href: '/#history',    label: t.nav.history },
    { href: '/#hiking',     label: t.nav.hiking },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        scrolled ? 'bg-cream/95 backdrop-blur-md shadow-sm border-b border-deep-wood/8' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <Image src="/logo.png" alt="Myrsini's Studios" width={200} height={200} className="object-contain rounded-sm w-28 h-28 sm:w-44 sm:h-44 drop-shadow-lg" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(({ href, label }) => (
            <a key={href} href={href}
              className={`text-sm tracking-wide transition-colors duration-300 ${scrolled ? 'text-deep-wood/60 hover:text-deep-wood' : 'text-white/70 hover:text-white'}`}>
              {label}
            </a>
          ))}

          <a href="/#booking"
            className="bg-olive text-white px-5 py-2.5 text-sm tracking-wide hover:bg-olive-dark transition-colors duration-200">
            {t.nav.book}
          </a>

          {/* Language switcher */}
          <div className="flex items-center gap-1 border-l border-current/10 pl-4">
            {LANGS.map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`text-xs uppercase px-1 py-0.5 transition-colors duration-200 ${
                  lang === l
                    ? scrolled ? 'text-olive font-bold' : 'text-white font-bold'
                    : scrolled ? 'text-deep-wood/30 hover:text-deep-wood/60' : 'text-white/30 hover:text-white/60'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          <a href="/admin"
            className={`text-xs tracking-wide transition-colors duration-300 ${scrolled ? 'text-deep-wood/30 hover:text-deep-wood/60' : 'text-white/30 hover:text-white/60'}`}>
            Admin
          </a>
        </div>

        {/* Mobile burger */}
        <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)} aria-label="Μενού">
          <div className="w-5 flex flex-col gap-1.5">
            <span className={`h-0.5 w-full transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''} ${scrolled ? 'bg-deep-wood' : 'bg-white'}`} />
            <span className={`h-0.5 w-full transition-all duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''} ${scrolled ? 'bg-deep-wood' : 'bg-white'}`} />
            <span className={`h-0.5 w-full transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''} ${scrolled ? 'bg-deep-wood' : 'bg-white'}`} />
          </div>
        </button>
      </div>

      {/* Mobile drawer */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-[32rem]' : 'max-h-0'} bg-cream/98 backdrop-blur-md border-b border-deep-wood/10`}>
        <div className="px-6 py-4 space-y-1">
          {NAV_LINKS.map(({ href, label }) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)}
              className="block py-3 text-deep-wood/60 hover:text-deep-wood text-sm tracking-wide border-b border-deep-wood/8 last:border-0">
              {label}
            </a>
          ))}
          <div className="pt-2">
            <a href="/#booking" onClick={() => setMenuOpen(false)}
              className="block bg-olive text-white text-center px-4 py-3 text-sm tracking-wide">
              {t.nav.book}
            </a>
          </div>
          {/* Mobile language switcher */}
          <div className="flex gap-3 pt-3 border-t border-deep-wood/8">
            {LANGS.map(l => (
              <button key={l} onClick={() => { setLang(l); setMenuOpen(false) }}
                className={`text-xs uppercase py-1 ${lang === l ? 'text-olive font-bold' : 'text-deep-wood/40'}`}>
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
