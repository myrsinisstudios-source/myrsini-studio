'use client'

import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-deep-wood text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-2xl text-white mb-4">Myrsini&apos;s Studios</h3>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">{t.footer.tagline}</p>
            <div className="flex items-center gap-3 mt-6">
              <a href="https://wa.me/306944571280" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 text-xs tracking-wider hover:bg-[#1ebe5d] transition-colors">
                <span>WhatsApp</span>
              </a>
              <a href="mailto:myrsinisstudios@gmail.com"
                className="flex items-center gap-2 border border-white/20 text-white/70 px-4 py-2 text-xs tracking-wider hover:border-white/50 hover:text-white transition-colors">
                Email
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white/50 text-xs tracking-widest uppercase mb-5">{t.footer.contact}</h4>
            <div className="space-y-3 text-sm text-white/60">
              <a href="tel:+306944571280" className="flex items-center gap-2 hover:text-white transition-colors">
                <span>📞</span> +30 694 457 1280
              </a>
              <a href="mailto:myrsinisstudios@gmail.com" className="flex items-center gap-2 hover:text-white transition-colors">
                <span>✉️</span> myrsinisstudios@gmail.com
              </a>
              <p className="flex items-center gap-2">
                <span>📍</span> Χόρτο, Πήλιο 37006
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 text-white/30 text-xs">
          <span>© {new Date().getFullYear()} Myrsini&apos;s Studios · Χόρτο Πηλίου, Ελλάδα</span>
        </div>
      </div>
    </footer>
  )
}
