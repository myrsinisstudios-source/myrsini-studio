'use client'

import Image from 'next/image'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function HeroSection() {
  const { t } = useLanguage()

  return (
    <div className="relative min-h-[100dvh] overflow-hidden">
      {/* Background photo */}
      <Image
        src="https://res.cloudinary.com/dusy3drw7/image/upload/v1779475268/remove-object_ibqbtd.avif"
        alt="Χόρτο Πηλίου"
        fill
        priority
        className="object-cover object-center"
      />

      {/* Dark overlay 40% */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Subtle grain */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[100dvh] px-4 text-center pb-48">
        <div className="animate-fade-in-up inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-5 py-2 text-white/70 text-xs tracking-widest uppercase mb-10">
          {t.hero.badge}
        </div>

        <h1 className="animate-fade-in-up animation-delay-200 font-serif text-white leading-tight mb-6">
          <span className="block text-5xl sm:text-7xl md:text-8xl font-normal tracking-tight">{t.hero.title1}</span>
          <span className="block text-4xl sm:text-6xl md:text-7xl font-light italic text-white/80 mt-1">{t.hero.title2}</span>
        </h1>

      </div>

      {/* Wave divider */}
      <svg className="absolute bottom-0 left-0 right-0 w-full" viewBox="0 0 1440 60" fill="none"
        xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <path d="M0 60H1440V30C1200 60 960 0 720 20C480 40 240 10 0 30V60Z" fill="#F9F7F2" />
      </svg>
    </div>
  )
}
