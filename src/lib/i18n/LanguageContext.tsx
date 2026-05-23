'use client'

import { createContext, useContext, useState, useEffect, ReactNode, Suspense, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { translations, Lang, Translations } from './translations'

type LanguageContextType = {
  lang: Lang
  setLang: (l: Lang) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'el',
  setLang: () => {},
  t: translations.el,
})

// Reads ?lang=XX from URL and applies it (highest priority)
function LangFromURL({ setLang }: { setLang: (l: Lang) => void }) {
  const params = useSearchParams()
  useEffect(() => {
    const urlLang = params.get('lang') as Lang | null
    if (urlLang && translations[urlLang]) setLang(urlLang)
  }, [params, setLang])
  return null
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('el')

  useEffect(() => {
    const saved = localStorage.getItem('site_lang') as Lang | null
    if (saved && translations[saved]) setLangState(saved)
  }, [])

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    localStorage.setItem('site_lang', l)
  }, [])

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      <Suspense>
        <LangFromURL setLang={setLang} />
      </Suspense>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
