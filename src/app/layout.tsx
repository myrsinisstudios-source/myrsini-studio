import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const inter = Inter({
  subsets: ['latin', 'greek'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: "Myrsini's Studios | Χόρτο Πηλίου",
  description: 'Παραδοσιακά καταλύματα στο Χόρτο Πηλίου. Κλείστε απευθείας και εξοικονομήστε.',
  keywords: 'Χόρτο Πηλίου, καταλύματα, studios, Myrsini, Pelion, accommodation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="el">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}