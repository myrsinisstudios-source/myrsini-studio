export type Lang = 'el' | 'en' | 'de' | 'fr'

export interface Translations {
  nav: { apartments: string; activities: string; history: string; hiking: string; book: string }
  hero: { badge: string; title1: string; title2: string; tagline: string; bestPrice: string }
  apts: {
    eyebrow: string; title: string; desc: string
    guests: string; sqm: string; bedrooms: string; bathrooms: string
    book: string; perNight: string; bookingLabel: string
  }
  acts: { eyebrow: string; title: string; viewMore: string }
  footer: {
    tagline: string; contact: string; booking: string
    direct: string; apartments: string; hiking: string; activities: string; checkin: string
  }
  modal: {
    badge: string; title: string; members: string; direct: string
    bookingCom: string; airbnb: string; arrival: string; departure: string
    check: string; perNight: string; book: string; from: string
    datePlaceholder: string
  }
}

export const translations: Record<Lang, Translations> = {
  el: {
    nav: { apartments: 'Καταλύματα', activities: 'Δραστηριότητες', history: 'Ιστορία', hiking: 'Πεζοπορία', book: 'Κράτηση' },
    hero: { badge: '🌿 Χόρτο · Νότιο Πήλιο · Ελλάδα', title1: 'Myrsini', title2: 'Studios', tagline: 'Παραδοσιακά καταλύματα · Άμεση κράτηση', bestPrice: 'Best Price Guarantee' },
    apts: { eyebrow: 'Τα Καταλύματα', title: 'Διαλέξτε το Δωμάτιό Σας', desc: 'Κλείστε απευθείας και εξοικονομήστε έως 15% σε σύγκριση με τις πλατφόρμες κράτησης', guests: 'Άτομα', sqm: 'Εμβαδόν', bedrooms: 'Υπνοδωμάτια', bathrooms: 'Μπάνια', book: 'Κράτηση', perNight: '/νύχτα', bookingLabel: 'Booking' },
    acts: { eyebrow: 'Ανακαλύψτε', title: 'Δραστηριότητες', viewMore: 'Δείτε Περισσότερα' },
    footer: { tagline: 'Παραδοσιακά καταλύματα στο Χόρτο Πηλίου. Πέτρα, ελαιώνες και κρυστάλλινα νερά του Αιγαίου σε αδιάσπαστη αρμονία.', contact: 'Επικοινωνία', booking: 'Κράτηση', direct: 'Άμεση Κράτηση', apartments: 'Τα Καταλύματα', hiking: 'Πεζοπορία', activities: 'Δραστηριότητες', checkin: 'Check-in: 14:00 · Check-out: 11:00' },
    modal: { badge: 'ΕΓΓΥΗΣΗ ΚΑΛΥΤΕΡΗΣ ΤΙΜΗΣ', title: 'Ελέγξτε Τιμές', members: 'Members Club', direct: 'Απευθείας Κράτηση', bookingCom: 'Booking.com', airbnb: 'Airbnb', arrival: 'ΑΦΙΞΗ', departure: 'ΑΝΑΧΩΡΗΣΗ', check: 'ΕΛΕΓΞΟΣ ΔΙΑΘΕΣΙΜΟΤΗΤΑΣ', perNight: '/νύχτα', book: 'ΚΡΑΤΗΣΗ', from: 'από', datePlaceholder: 'ΗΗ / ΜΜ / ΕΕΕΕ' },
  },
  en: {
    nav: { apartments: 'Rooms', activities: 'Activities', history: 'History', hiking: 'Hiking', book: 'Book Now' },
    hero: { badge: '🌿 Horto · South Pelion · Greece', title1: 'Myrsini', title2: 'Studios', tagline: 'Traditional accommodation · Direct booking', bestPrice: 'Best Price Guarantee' },
    apts: { eyebrow: 'Our Rooms', title: 'Choose Your Room', desc: 'Book directly and save up to 15% compared to booking platforms', guests: 'Guests', sqm: 'Area', bedrooms: 'Bedrooms', bathrooms: 'Bathrooms', book: 'Book', perNight: '/night', bookingLabel: 'Booking' },
    acts: { eyebrow: 'Discover', title: 'Activities', viewMore: 'See More' },
    footer: { tagline: 'Traditional accommodation in Horto, Pelion. Stone, olive groves and crystal waters of the Aegean in perfect harmony.', contact: 'Contact', booking: 'Booking', direct: 'Direct Booking', apartments: 'Our Rooms', hiking: 'Hiking', activities: 'Activities', checkin: 'Check-in: 14:00 · Check-out: 11:00' },
    modal: { badge: 'BEST PRICE GUARANTEE', title: 'Check Prices', members: 'Members Club', direct: 'Direct Booking', bookingCom: 'Booking.com', airbnb: 'Airbnb', arrival: 'ARRIVAL', departure: 'DEPARTURE', check: 'CHECK AVAILABILITY', perNight: '/night', book: 'BOOK NOW', from: 'from', datePlaceholder: 'DD / MM / YYYY' },
  },
  de: {
    nav: { apartments: 'Zimmer', activities: 'Aktivitäten', history: 'Geschichte', hiking: 'Wandern', book: 'Buchen' },
    hero: { badge: '🌿 Horto · Süd-Pelion · Griechenland', title1: 'Myrsini', title2: 'Studios', tagline: 'Traditionelle Unterkunft · Direktbuchung', bestPrice: 'Bestpreis-Garantie' },
    apts: { eyebrow: 'Unsere Zimmer', title: 'Wählen Sie Ihr Zimmer', desc: 'Direkt buchen und bis zu 15% gegenüber Buchungsplattformen sparen', guests: 'Gäste', sqm: 'Fläche', bedrooms: 'Schlafzimmer', bathrooms: 'Bäder', book: 'Buchen', perNight: '/Nacht', bookingLabel: 'Booking' },
    acts: { eyebrow: 'Entdecken', title: 'Aktivitäten', viewMore: 'Mehr anzeigen' },
    footer: { tagline: 'Traditionelle Unterkunft in Horto, Pelion. Stein, Olivenhaine und kristallklares Ägäisches Meer in harmonischer Einheit.', contact: 'Kontakt', booking: 'Buchung', direct: 'Direktbuchung', apartments: 'Zimmer', hiking: 'Wandern', activities: 'Aktivitäten', checkin: 'Check-in: 14:00 · Check-out: 11:00' },
    modal: { badge: 'BESTPREIS-GARANTIE', title: 'Preise prüfen', members: 'Members Club', direct: 'Direktbuchung', bookingCom: 'Booking.com', airbnb: 'Airbnb', arrival: 'ANKUNFT', departure: 'ABREISE', check: 'VERFÜGBARKEIT PRÜFEN', perNight: '/Nacht', book: 'BUCHEN', from: 'ab', datePlaceholder: 'TT / MM / JJJJ' },
  },
  fr: {
    nav: { apartments: 'Logements', activities: 'Activités', history: 'Histoire', hiking: 'Randonnée', book: 'Réserver' },
    hero: { badge: '🌿 Horto · Pélion Sud · Grèce', title1: 'Myrsini', title2: 'Studios', tagline: 'Hébergement traditionnel · Réservation directe', bestPrice: 'Meilleur prix garanti' },
    apts: { eyebrow: 'Nos Logements', title: 'Choisissez Votre Chambre', desc: "Réservez directement et économisez jusqu'à 15% par rapport aux plateformes", guests: 'Personnes', sqm: 'Surface', bedrooms: 'Chambres', bathrooms: 'Salles de bain', book: 'Réserver', perNight: '/nuit', bookingLabel: 'Booking' },
    acts: { eyebrow: 'Découvrir', title: 'Activités', viewMore: 'Voir Plus' },
    footer: { tagline: "Hébergement traditionnel à Horto, Pélion. Pierre, oliveraies et eaux cristallines de la mer Égée en parfaite harmonie.", contact: 'Contact', booking: 'Réservation', direct: 'Réservation directe', apartments: 'Logements', hiking: 'Randonnée', activities: 'Activités', checkin: 'Arrivée: 14h00 · Départ: 11h00' },
    modal: { badge: 'MEILLEUR PRIX GARANTI', title: 'Vérifier les prix', members: 'Club Members', direct: 'Réservation directe', bookingCom: 'Booking.com', airbnb: 'Airbnb', arrival: 'ARRIVÉE', departure: 'DÉPART', check: 'VÉRIFIER DISPONIBILITÉ', perNight: '/nuit', book: 'RÉSERVER', from: 'dès', datePlaceholder: 'JJ / MM / AAAA' },
  },
}
