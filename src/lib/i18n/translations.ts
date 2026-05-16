export type Lang = 'el' | 'en' | 'de' | 'fr'

export interface Translations {
  nav: {
    apartments: string; activities: string; history: string; hiking: string; book: string
  }
  hero: {
    badge: string; title1: string; title2: string; tagline: string; bestPrice: string
  }
  booking: {
    arrival: string; departure: string; adults: string; children: string
    bestPrice: string; noCommission: string; directBook: string; whatsapp: string
    fillDetails: string; fullName: string; phone: string; perNight: string
    sending: string; confirm: string; nights: string; guests: string
    success: string; selectDate: string; summary: string
  }
  apts: {
    eyebrow: string; title: string; desc: string
    guests: string; sqm: string; bedrooms: string; bathrooms: string
    book: string; perNight: string; bookingLabel: string
  }
  acts: { eyebrow: string; title: string; viewMore: string }
  history: { eyebrow: string; title: string; para1: string; para2: string }
  hiking: {
    eyebrow: string; title: string; desc: string
    distance: string; time: string; elevation: string; start: string; footer: string
  }
  emergency: {
    eyebrow: string; title: string; desc: string; sosTitle: string; sosCall: string; sosDesc: string
  }
  difficulty: { easy: string; medium: string; hard: string }
  acts_page: {
    back: string; location: string; locationName: string; locationSub: string
    category: string; duration: string; distance: string; mapBtn: string
    help: string; helpDesc: string; contact: string
  }
  weather: {
    temp: string; sea: string; wind: string; today: string; howToArrive: string
  }
  footer: {
    tagline: string; contact: string; booking: string
    direct: string; apartments: string; hiking: string; activities: string; checkin: string
  }
  modal: {
    badge: string; title: string; members: string; direct: string
    bookingCom: string; airbnb: string; arrival: string; departure: string
    check: string; perNight: string; book: string; from: string; datePlaceholder: string
  }
}

export const translations: Record<Lang, Translations> = {
  el: {
    nav: {
      apartments: 'Καταλύματα', activities: 'Δραστηριότητες',
      history: 'Ιστορία', hiking: 'Πεζοπορία', book: 'Κράτηση',
    },
    hero: {
      badge: '🌿 Χόρτο · Νότιο Πήλιο · Ελλάδα', title1: 'Myrsini', title2: 'Studios',
      tagline: 'Παραδοσιακά καταλύματα · Άμεση κράτηση', bestPrice: 'Best Price Guarantee',
    },
    booking: {
      arrival: 'Άφιξη', departure: 'Αναχώρηση', adults: 'Ενήλικες', children: 'Παιδιά',
      bestPrice: 'Best Price Guarantee',
      noCommission: 'Κλείστε απευθείας · Χωρίς προμήθεια πλατφόρμας',
      directBook: 'Άμεση Κράτηση', whatsapp: 'WhatsApp',
      fillDetails: 'Συμπληρώστε τα στοιχεία σας',
      fullName: 'Ονοματεπώνυμο', phone: 'Τηλέφωνο / WhatsApp',
      perNight: '/νύχτα', sending: 'Αποστολή...', confirm: '✓ Επιβεβαίωση Κράτησης',
      nights: 'νύχτ.', guests: 'άτομα',
      success: '✅ Η κράτησή σας καταχωρήθηκε! Θα επικοινωνήσουμε σύντομα.',
      selectDate: 'Επιλέξτε', summary: 'Σύνοψη',
    },
    apts: {
      eyebrow: 'Τα Καταλύματα', title: 'Διαλέξτε το Δωμάτιό Σας',
      desc: 'Κλείστε απευθείας και εξοικονομήστε έως 15% σε σύγκριση με τις πλατφόρμες κράτησης',
      guests: 'Άτομα', sqm: 'Εμβαδόν', bedrooms: 'Υπνοδωμάτια', bathrooms: 'Μπάνια',
      book: 'Κράτηση', perNight: '/νύχτα', bookingLabel: 'Booking',
    },
    acts: { eyebrow: 'Ανακαλύψτε', title: 'Δραστηριότητες', viewMore: 'Δείτε Περισσότερα' },
    history: {
      eyebrow: 'Ιστορία & Ταυτότητα', title: 'Η Ψυχή του Πηλίου',
      para1: 'Τα Myrsini Studios γεννήθηκαν μέσα από την αγάπη για τη φύση και την παράδοση του Πηλίου. Ένα παλαιό αρχοντικό του 19ου αιώνα και ένα studio με θέα τη θάλασσα, σχολαστικά ανακαινισμένα για να προσφέρουν σύγχρονη άνεση χωρίς να χάσουν την αυθεντικότητά τους.',
      para2: 'Η μυρτιά — το φυτό που έδωσε το όνομα — αναπτύσσεται παντού στους ελαιώνες γύρω από τα καταλύματα. Είναι σύμβολο φιλοξενίας, φύσης και της Πηλιορείτικης ζωής όπως ήταν πάντα: ήρεμης, αυθεντικής, φιλόξενης.',
    },
    hiking: {
      eyebrow: 'Πεζοπορία', title: 'Μονοπάτια Νότιου Πηλίου',
      desc: 'Εξερευνήστε τα ιστορικά μονοπάτια της χερσονήσου, από παράκτιες διαδρομές έως κορυφογραμμές με θέα δύο θαλασσών',
      distance: 'Απόσταση', time: 'Χρόνος', elevation: 'Υψόμ.', start: 'Εκκίνηση',
      footer: 'Πάντα ρωτήστε στην υποδοχή για τελευταία ενημέρωση σχετικά με τις συνθήκες των μονοπατιών',
    },
    emergency: {
      eyebrow: 'Χρήσιμες Πληροφορίες', title: 'Αριθμοί Έκτακτης Ανάγκης',
      desc: 'Κρατήστε αυτούς τους αριθμούς εύκολα προσβάσιμους κατά τη διαμονή σας',
      sosTitle: 'Ευρωπαϊκός Αριθμός Έκτακτης Ανάγκης',
      sosCall: 'Καλέστε', sosDesc: 'από οποιοδήποτε τηλέφωνο, ακόμα και χωρίς κάρτα SIM',
    },
    weather: {
      temp: 'Θερμοκρασία', sea: 'Θάλασσα', wind: 'Άνεμος',
      today: 'Χόρτο Πηλίου · Σήμερα', howToArrive: 'Πώς να φτάσετε',
    },
    footer: {
      tagline: 'Παραδοσιακά καταλύματα στο Χόρτο Πηλίου. Πέτρα, ελαιώνες και κρυστάλλινα νερά του Αιγαίου σε αδιάσπαστη αρμονία.',
      contact: 'Επικοινωνία', booking: 'Κράτηση', direct: 'Άμεση Κράτηση',
      apartments: 'Τα Καταλύματα', hiking: 'Πεζοπορία', activities: 'Δραστηριότητες',
      checkin: 'Check-in: 14:00 · Check-out: 11:00',
    },
    difficulty: { easy: 'Εύκολη', medium: 'Μέτρια', hard: 'Δύσκολη' },
    acts_page: {
      back: '← Πίσω στις Δραστηριότητες', location: 'Τοποθεσία',
      locationName: 'Χόρτο, Πήλιο', locationSub: 'Νότιο Πήλιο · Μαγνησία · Ελλάδα',
      category: 'Κατηγορία', duration: 'Διάρκεια', distance: 'Απόσταση',
      mapBtn: 'Άνοιγμα στο Google Maps →',
      help: 'Myrsini Studios', helpDesc: 'Χρειάζεστε βοήθεια για να οργανώσετε τη δραστηριότητα;',
      contact: 'Επικοινωνήστε μαζί μας →',
    },
    modal: {
      badge: 'ΕΓΓΥΗΣΗ ΚΑΛΥΤΕΡΗΣ ΤΙΜΗΣ', title: 'Ελέγξτε Τιμές',
      members: 'Members Club', direct: 'Απευθείας Κράτηση',
      bookingCom: 'Booking.com', airbnb: 'Airbnb',
      arrival: 'ΑΦΙΞΗ', departure: 'ΑΝΑΧΩΡΗΣΗ',
      check: 'ΕΛΕΓΞΟΣ ΔΙΑΘΕΣΙΜΟΤΗΤΑΣ', perNight: '/νύχτα', book: 'ΚΡΑΤΗΣΗ',
      from: 'από', datePlaceholder: 'ΗΗ / ΜΜ / ΕΕΕΕ',
    },
  },

  en: {
    nav: {
      apartments: 'Rooms', activities: 'Activities',
      history: 'History', hiking: 'Hiking', book: 'Book Now',
    },
    hero: {
      badge: '🌿 Horto · South Pelion · Greece', title1: 'Myrsini', title2: 'Studios',
      tagline: 'Traditional accommodation · Direct booking', bestPrice: 'Best Price Guarantee',
    },
    booking: {
      arrival: 'Arrival', departure: 'Departure', adults: 'Adults', children: 'Children',
      bestPrice: 'Best Price Guarantee', noCommission: 'Book directly · No platform commission',
      directBook: 'Direct Booking', whatsapp: 'WhatsApp',
      fillDetails: 'Fill in your details', fullName: 'Full Name', phone: 'Phone / WhatsApp',
      perNight: '/night', sending: 'Sending...', confirm: '✓ Confirm Booking',
      nights: 'nights', guests: 'guests',
      success: '✅ Your booking has been submitted! We will contact you shortly.',
      selectDate: 'Select', summary: 'Summary',
    },
    apts: {
      eyebrow: 'Our Rooms', title: 'Choose Your Room',
      desc: 'Book directly and save up to 15% compared to booking platforms',
      guests: 'Guests', sqm: 'Area', bedrooms: 'Bedrooms', bathrooms: 'Bathrooms',
      book: 'Book', perNight: '/night', bookingLabel: 'Booking',
    },
    acts: { eyebrow: 'Discover', title: 'Activities', viewMore: 'See More' },
    history: {
      eyebrow: 'History & Identity', title: 'The Soul of Pelion',
      para1: 'Myrsini Studios were born from a love of nature and the tradition of Pelion. A 19th-century mansion and a sea-view studio, meticulously renovated to offer modern comfort without losing their authenticity.',
      para2: 'The myrtle — the plant that gave the name — grows everywhere in the olive groves around the accommodations. It is a symbol of hospitality, nature, and Pelion life as it has always been: calm, authentic, welcoming.',
    },
    hiking: {
      eyebrow: 'Hiking', title: 'Trails of South Pelion',
      desc: 'Explore the historic paths of the peninsula, from coastal routes to ridgelines with views of two seas',
      distance: 'Distance', time: 'Time', elevation: 'Elevation', start: 'Start',
      footer: 'Always ask at reception for the latest update on trail conditions',
    },
    emergency: {
      eyebrow: 'Useful Information', title: 'Emergency Numbers',
      desc: 'Keep these numbers easily accessible during your stay',
      sosTitle: 'European Emergency Number',
      sosCall: 'Call', sosDesc: 'from any phone, even without a SIM card',
    },
    weather: {
      temp: 'Temperature', sea: 'Sea', wind: 'Wind',
      today: 'Horto Pelion · Today', howToArrive: 'How to get here',
    },
    footer: {
      tagline: 'Traditional accommodation in Horto, Pelion. Stone, olive groves and crystal waters of the Aegean in perfect harmony.',
      contact: 'Contact', booking: 'Booking', direct: 'Direct Booking',
      apartments: 'Our Rooms', hiking: 'Hiking', activities: 'Activities',
      checkin: 'Check-in: 14:00 · Check-out: 11:00',
    },
    difficulty: { easy: 'Easy', medium: 'Moderate', hard: 'Hard' },
    acts_page: {
      back: '← Back to Activities', location: 'Location',
      locationName: 'Horto, Pelion', locationSub: 'South Pelion · Magnesia · Greece',
      category: 'Category', duration: 'Duration', distance: 'Distance',
      mapBtn: 'Open in Google Maps →',
      help: 'Myrsini Studios', helpDesc: 'Need help organising the activity?',
      contact: 'Contact us →',
    },
    modal: {
      badge: 'BEST PRICE GUARANTEE', title: 'Check Prices',
      members: 'Members Club', direct: 'Direct Booking',
      bookingCom: 'Booking.com', airbnb: 'Airbnb',
      arrival: 'ARRIVAL', departure: 'DEPARTURE',
      check: 'CHECK AVAILABILITY', perNight: '/night', book: 'BOOK NOW',
      from: 'from', datePlaceholder: 'DD / MM / YYYY',
    },
  },

  de: {
    nav: {
      apartments: 'Zimmer', activities: 'Aktivitäten',
      history: 'Geschichte', hiking: 'Wandern', book: 'Buchen',
    },
    hero: {
      badge: '🌿 Horto · Süd-Pelion · Griechenland', title1: 'Myrsini', title2: 'Studios',
      tagline: 'Traditionelle Unterkunft · Direktbuchung', bestPrice: 'Bestpreis-Garantie',
    },
    booking: {
      arrival: 'Ankunft', departure: 'Abreise', adults: 'Erwachsene', children: 'Kinder',
      bestPrice: 'Bestpreis-Garantie', noCommission: 'Direkt buchen · Keine Plattformprovision',
      directBook: 'Direktbuchung', whatsapp: 'WhatsApp',
      fillDetails: 'Füllen Sie Ihre Daten aus', fullName: 'Vollständiger Name', phone: 'Telefon / WhatsApp',
      perNight: '/Nacht', sending: 'Senden...', confirm: '✓ Buchung bestätigen',
      nights: 'Nächte', guests: 'Personen',
      success: '✅ Ihre Buchung wurde eingereicht! Wir werden uns bald bei Ihnen melden.',
      selectDate: 'Auswählen', summary: 'Zusammenfassung',
    },
    apts: {
      eyebrow: 'Unsere Zimmer', title: 'Wählen Sie Ihr Zimmer',
      desc: 'Direkt buchen und bis zu 15% gegenüber Buchungsplattformen sparen',
      guests: 'Gäste', sqm: 'Fläche', bedrooms: 'Schlafzimmer', bathrooms: 'Bäder',
      book: 'Buchen', perNight: '/Nacht', bookingLabel: 'Booking',
    },
    acts: { eyebrow: 'Entdecken', title: 'Aktivitäten', viewMore: 'Mehr anzeigen' },
    history: {
      eyebrow: 'Geschichte & Identität', title: 'Die Seele von Pelion',
      para1: 'Myrsini Studios entstanden aus der Liebe zur Natur und zur Tradition Pelions. Ein Herrenhaus aus dem 19. Jahrhundert und ein Studio mit Meerblick, sorgfältig renoviert, um modernen Komfort zu bieten ohne ihre Authentizität zu verlieren.',
      para2: 'Die Myrte — die Pflanze, die den Namen gab — wächst überall in den Olivenhainen rund um die Unterkünfte. Sie ist ein Symbol der Gastfreundschaft, der Natur und des Pelion-Lebens, wie es immer war: ruhig, authentisch, herzlich.',
    },
    hiking: {
      eyebrow: 'Wandern', title: 'Wanderwege in Süd-Pelion',
      desc: 'Erkunden Sie die historischen Wege der Halbinsel, von Küstenrouten bis zu Bergrücken mit Blick auf zwei Meere',
      distance: 'Distanz', time: 'Zeit', elevation: 'Höhe', start: 'Start',
      footer: 'Fragen Sie immer an der Rezeption nach den aktuellen Wegbedingungen',
    },
    emergency: {
      eyebrow: 'Nützliche Informationen', title: 'Notrufnummern',
      desc: 'Halten Sie diese Nummern während Ihres Aufenthalts leicht zugänglich',
      sosTitle: 'Europäische Notrufnummer',
      sosCall: 'Rufen Sie', sosDesc: 'von jedem Telefon, auch ohne SIM-Karte',
    },
    weather: {
      temp: 'Temperatur', sea: 'Meer', wind: 'Wind',
      today: 'Horto Pelion · Heute', howToArrive: 'Anreise',
    },
    footer: {
      tagline: 'Traditionelle Unterkunft in Horto, Pelion. Stein, Olivenhaine und kristallklares Ägäisches Meer in harmonischer Einheit.',
      contact: 'Kontakt', booking: 'Buchung', direct: 'Direktbuchung',
      apartments: 'Zimmer', hiking: 'Wandern', activities: 'Aktivitäten',
      checkin: 'Check-in: 14:00 · Check-out: 11:00',
    },
    difficulty: { easy: 'Leicht', medium: 'Mittel', hard: 'Schwer' },
    acts_page: {
      back: '← Zurück zu Aktivitäten', location: 'Lage',
      locationName: 'Horto, Pelion', locationSub: 'Süd-Pelion · Magnesia · Griechenland',
      category: 'Kategorie', duration: 'Dauer', distance: 'Distanz',
      mapBtn: 'In Google Maps öffnen →',
      help: 'Myrsini Studios', helpDesc: 'Benötigen Sie Hilfe bei der Organisation der Aktivität?',
      contact: 'Kontaktieren Sie uns →',
    },
    modal: {
      badge: 'BESTPREIS-GARANTIE', title: 'Preise prüfen',
      members: 'Members Club', direct: 'Direktbuchung',
      bookingCom: 'Booking.com', airbnb: 'Airbnb',
      arrival: 'ANKUNFT', departure: 'ABREISE',
      check: 'VERFÜGBARKEIT PRÜFEN', perNight: '/Nacht', book: 'BUCHEN',
      from: 'ab', datePlaceholder: 'TT / MM / JJJJ',
    },
  },

  fr: {
    nav: {
      apartments: 'Logements', activities: 'Activités',
      history: 'Histoire', hiking: 'Randonnée', book: 'Réserver',
    },
    hero: {
      badge: '🌿 Horto · Pélion Sud · Grèce', title1: 'Myrsini', title2: 'Studios',
      tagline: 'Hébergement traditionnel · Réservation directe', bestPrice: 'Meilleur prix garanti',
    },
    booking: {
      arrival: 'Arrivée', departure: 'Départ', adults: 'Adultes', children: 'Enfants',
      bestPrice: 'Meilleur prix garanti', noCommission: 'Réservez directement · Sans commission',
      directBook: 'Réservation directe', whatsapp: 'WhatsApp',
      fillDetails: 'Remplissez vos informations', fullName: 'Nom complet', phone: 'Téléphone / WhatsApp',
      perNight: '/nuit', sending: 'Envoi...', confirm: '✓ Confirmer la réservation',
      nights: 'nuits', guests: 'personnes',
      success: '✅ Votre réservation a été soumise ! Nous vous contacterons bientôt.',
      selectDate: 'Sélectionner', summary: 'Résumé',
    },
    apts: {
      eyebrow: 'Nos Logements', title: 'Choisissez Votre Chambre',
      desc: "Réservez directement et économisez jusqu'à 15% par rapport aux plateformes",
      guests: 'Personnes', sqm: 'Surface', bedrooms: 'Chambres', bathrooms: 'Salles de bain',
      book: 'Réserver', perNight: '/nuit', bookingLabel: 'Booking',
    },
    acts: { eyebrow: 'Découvrir', title: 'Activités', viewMore: 'Voir Plus' },
    history: {
      eyebrow: 'Histoire & Identité', title: "L'Âme du Pélion",
      para1: "Les Myrsini Studios sont nés de l'amour de la nature et de la tradition du Pélion. Un manoir du XIXe siècle et un studio avec vue sur la mer, méticuleusement rénovés pour offrir le confort moderne sans perdre leur authenticité.",
      para2: "Le myrte — la plante qui a donné le nom — pousse partout dans les oliveraies autour des hébergements. C'est un symbole d'hospitalité, de nature et de la vie au Pélion telle qu'elle a toujours été : calme, authentique, accueillante.",
    },
    hiking: {
      eyebrow: 'Randonnée', title: 'Sentiers du Pélion Sud',
      desc: 'Explorez les chemins historiques de la péninsule, des itinéraires côtiers aux crêtes avec vue sur deux mers',
      distance: 'Distance', time: 'Durée', elevation: 'Altitude', start: 'Départ',
      footer: 'Demandez toujours à la réception la dernière mise à jour sur les conditions des sentiers',
    },
    emergency: {
      eyebrow: 'Informations utiles', title: "Numéros d'urgence",
      desc: 'Gardez ces numéros facilement accessibles pendant votre séjour',
      sosTitle: "Numéro d'urgence européen",
      sosCall: 'Appelez le', sosDesc: "depuis n'importe quel téléphone, même sans carte SIM",
    },
    weather: {
      temp: 'Température', sea: 'Mer', wind: 'Vent',
      today: "Horto Pélion · Aujourd'hui", howToArrive: 'Comment venir',
    },
    footer: {
      tagline: "Hébergement traditionnel à Horto, Pélion. Pierre, oliveraies et eaux cristallines de la mer Égée en parfaite harmonie.",
      contact: 'Contact', booking: 'Réservation', direct: 'Réservation directe',
      apartments: 'Logements', hiking: 'Randonnée', activities: 'Activités',
      checkin: 'Arrivée: 14h00 · Départ: 11h00',
    },
    difficulty: { easy: 'Facile', medium: 'Modéré', hard: 'Difficile' },
    acts_page: {
      back: '← Retour aux Activités', location: 'Localisation',
      locationName: 'Horto, Pélion', locationSub: 'Pélion Sud · Magnésie · Grèce',
      category: 'Catégorie', duration: 'Durée', distance: 'Distance',
      mapBtn: 'Ouvrir dans Google Maps →',
      help: 'Myrsini Studios', helpDesc: "Besoin d'aide pour organiser l'activité ?",
      contact: 'Contactez-nous →',
    },
    modal: {
      badge: 'MEILLEUR PRIX GARANTI', title: 'Vérifier les prix',
      members: 'Club Members', direct: 'Réservation directe',
      bookingCom: 'Booking.com', airbnb: 'Airbnb',
      arrival: 'ARRIVÉE', departure: 'DÉPART',
      check: 'VÉRIFIER DISPONIBILITÉ', perNight: '/nuit', book: 'RÉSERVER',
      from: 'dès', datePlaceholder: 'JJ / MM / AAAA',
    },
  },
}
