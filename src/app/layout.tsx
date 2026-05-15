import type { Metadata } from 'next'
import { Playfair_Display, Lato } from 'next/font/google'
import './globals.css'
import { ConditionalNavbar, ConditionalFooter, ConditionalBookingModal } from '@/components/layout/ConditionalNav'
import { LanguageProvider } from '@/lib/i18n/LanguageContext'

const playfair = Playfair_Display({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-playfair',
  display: 'swap',
})

const lato = Lato({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '700'],
  variable: '--font-lato',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Myrsini's Studios | Χόρτο Πηλίου",
  description: 'Παραδοσιακά καταλύματα στο Χόρτο Πηλίου. Κλείστε απευθείας και εξοικονομήστε έως 15% vs Booking.com.',
  keywords: 'Χόρτο Πηλίου, καταλύματα, studios, Myrsini, Pelion, accommodation, vacation rental, Ελλάδα',
  metadataBase: new URL('https://myrsini-studios.gr'),
  openGraph: {
    type: 'website',
    locale: 'el_GR',
    url: 'https://myrsini-studios.gr',
    title: "Myrsini's Studios | Χόρτο Πηλίου",
    description: 'Παραδοσιακά καταλύματα στο Χόρτο Πηλίου. Best Price Guarantee.',
    siteName: "Myrsini's Studios",
  },
  twitter: {
    card: 'summary_large_image',
    title: "Myrsini's Studios",
    description: 'Παραδοσιακά καταλύματα στο Χόρτο Πηλίου',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LodgingBusiness',
  name: "Myrsini's Studios",
  description: 'Παραδοσιακά καταλύματα στο Χόρτο Πηλίου, Νότιο Πήλιο, Ελλάδα',
  url: 'https://myrsini-studios.gr',
  telephone: '+306944571280',
  email: 'myrsinisstudios@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Χόρτο',
    addressLocality: 'Χόρτο',
    addressRegion: 'Πήλιο',
    postalCode: '37010',
    addressCountry: 'GR',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 39.1511, longitude: 23.2678 },
  priceRange: '€€',
  checkinTime: '14:00',
  checkoutTime: '11:00',
  currenciesAccepted: 'EUR',
  paymentAccepted: 'Cash, Credit Card',
  amenityFeature: [
    { '@type': 'LocationFeatureSpecification', name: 'WiFi', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Free Parking', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Air Conditioning', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Kitchen', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Sea View', value: true },
  ],
  starRating: { '@type': 'Rating', ratingValue: '4', bestRating: '5' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="el" data-scroll-behavior="smooth" className={`${playfair.variable} ${lato.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="font-sans antialiased bg-cream">
        <LanguageProvider>
          <ConditionalNavbar />
          {children}
          <ConditionalFooter />
          <ConditionalBookingModal />
        </LanguageProvider>
      </body>
    </html>
  )
}
