'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'
import BookingModal from '@/components/booking/BookingModal'
import WaveSection from '@/components/sections/WaveSection'

export function ConditionalNavbar() {
  const pathname = usePathname()
  if (pathname?.startsWith('/admin')) return null
  return <Navbar />
}

export function ConditionalFooter() {
  const pathname = usePathname()
  if (pathname?.startsWith('/admin')) return null
  return <Footer />
}

export function ConditionalWave() {
  const pathname = usePathname()
  if (pathname?.startsWith('/admin')) return null
  return <WaveSection />
}

export function ConditionalBookingModal() {
  const pathname = usePathname()
  if (pathname?.startsWith('/admin')) return null
  return <BookingModal />
}
