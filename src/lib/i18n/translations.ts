export type Lang = 'el' | 'en' | 'de' | 'fr'

export interface Translations {
  nav: {
    apartments: string; activities: string; history: string; hiking: string; book: string; contact: string
  }
  contact: {
    title: string; subtitle: string; send: string; sending: string
    name: string; email: string; subject: string; message: string
    success: string; error: string
    infoTitle: string; phone: string; emailLabel: string; address: string
    miniTitle: string; miniPlaceholder: string; miniBtn: string
    inquiryTitle: string; inquiryBtn: string
  }
  hero: {
    badge: string; title1: string; title2: string
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
    apt1: string; apt2: string; back: string; details: string
  }
  amenities: {
    AC: string; WiFi: string; kitchen: string; kitchenette: string; parking: string
    veranda: string; seaview: string; BBQ: string; washer: string; TV: string
    towels: string; petFriendly: string
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
  emergencyLabels: {
    national: string; local: string; useful: string
    police: string; fire: string; ambulance: string; coastguard: string
    hospital: string; localPolice: string; clinic: string; power: string
    studios: string; taxi: string; petrol: string; bank: string
    nationwide: string; ambulanceNote: string; seaSOS: string
    generalHospital: string; localStation: string; ruralClinic: string
    powerFaults: string; whatsappCall: string; localTaxi: string
    argalasti: string; nearest: string
  }
  difficulty: { easy: string; medium: string; hard: string }
  hikingTags: {
    Ελαιώνες: string; 'Ιστορικά Μονοπάτια': string; Θέα: string
    Παραλίες: string; 'Κατάλληλο για παιδιά': string; Ορεινή: string
    'Πανοραμική Θέα': string; Έμπειροι: string; [key: string]: string
  }
  acts_page: {
    back: string; location: string; locationName: string; locationSub: string
    category: string; duration: string; distance: string; mapBtn: string
    elevation: string; difficulty: string
    help: string; helpDesc: string; contact: string
  }
  weather: {
    temp: string; sea: string; wind: string; today: string; howToArrive: string
    airport: string; port: string; quote: string; minutes: string; km: string
  }
  footer: {
    tagline: string; contact: string; booking: string
    direct: string; apartments: string; hiking: string; activities: string; checkin: string
    address: string
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
      history: 'Ιστορία', hiking: 'Πεζοπορία', book: 'Κράτηση', contact: 'Επικοινωνία',
    },
    contact: {
      title: 'Επικοινωνήστε μαζί μας', subtitle: 'Είμαστε εδώ για κάθε ερώτηση ή αίτημα',
      send: 'Αποστολή Μηνύματος', sending: 'Αποστολή...',
      name: 'Ονοματεπώνυμο', email: 'Email', subject: 'Θέμα', message: 'Μήνυμα',
      success: '✅ Το μήνυμά σας στάλθηκε! Θα επικοινωνήσουμε σύντομα.',
      error: '❌ Κάτι πήγε στραβά. Δοκιμάστε ξανά ή επικοινωνήστε τηλεφωνικά.',
      infoTitle: 'Στοιχεία Επικοινωνίας',
      phone: 'Τηλέφωνο', emailLabel: 'Email', address: 'Διεύθυνση',
      miniTitle: 'Γρήγορο Μήνυμα', miniPlaceholder: 'Γράψτε μήνυμα...', miniBtn: 'Αποστολή',
      inquiryTitle: 'Ερώτηση για αυτό το κατάλυμα', inquiryBtn: 'Στείλτε Ερώτηση',
    },
    hero: {
      badge: '🌿 Χόρτο · Νότιο Πήλιο · Ελλάδα', title1: "Myrsini's", title2: 'Studios',
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
      apt1: 'Αρχοντικό', apt2: 'Θαλασσινό', back: '← Πίσω στα Καταλύματα', details: 'Λεπτομέρειες →',
    },
    amenities: {
      AC: 'Κλιματισμός', WiFi: 'WiFi', kitchen: 'Κουζίνα', kitchenette: 'Μικρή Κουζίνα',
      parking: 'Parking', veranda: 'Βεράντα', seaview: 'Θέα Θάλασσα', BBQ: 'BBQ',
      washer: 'Πλυντήριο', TV: 'Τηλεόραση', towels: 'Πετσέτες/Σεντόνια', petFriendly: 'Pet Friendly',
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
      footer: 'Οι πληροφορίες παρέχονται για ενημερωτικούς σκοπούς. Η τελευταία ενημέρωση σχετικά με τις συνθήκες των μονοπατιών δεν είναι σε καμία περίπτωση αρμοδιότητά μας και δεν είμαστε σε θέση να πιστοποιήσουμε την εγκυρότητά τους. Οι πληροφορίες παρέχονται από τους «Φίλους των Μονοπατιών».',
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
      airport: 'Αεροδρόμιο Νέας Αγχιάλου', port: 'Λιμάνι Βόλου',
      quote: '«Είμαστε 35 λεπτά από τον Βόλο, αλλά αιώνες μακριά από τη βιασύνη του.»',
      minutes: 'λεπτά', km: 'χλμ',
    },
    footer: {
      tagline: 'Παραδοσιακά καταλύματα στο Χόρτο Πηλίου. Πέτρα, ελαιώνες και κρυστάλλινα νερά του Αιγαίου σε αδιάσπαστη αρμονία.',
      contact: 'Επικοινωνία', booking: 'Κράτηση', direct: 'Άμεση Κράτηση',
      apartments: 'Τα Καταλύματα', hiking: 'Πεζοπορία', activities: 'Δραστηριότητες',
      checkin: 'Check-in: 14:00 · Check-out: 11:00',
      address: 'Χόρτο, Πήλιο 37006',
    },
    emergencyLabels: {
      national: 'Εθνική Ανάγκη', local: 'Τοπικά', useful: 'Χρήσιμα',
      police: 'Αστυνομία', fire: 'Πυροσβεστική', ambulance: 'ΕΚΑΒ', coastguard: 'Ακτοφυλακή',
      hospital: 'Νοσοκομείο Βόλου', localPolice: 'Αστυνομία Αλμυρού', clinic: 'Ιατρείο Αργαλαστής', power: 'ΔΕΔΔΗΕ (ΔΕΗ)',
      studios: 'Myrsini Studios', taxi: 'Ταξί Χόρτου', petrol: 'Βενζινάδικο', bank: 'Τράπεζα Αλμυρού',
      nationwide: 'Πανελλαδικά', ambulanceNote: 'Ασθενοφόρο', seaSOS: 'Θαλάσσιο SOS',
      generalHospital: 'Γενικό Νοσοκομείο', localStation: 'Τοπικό Τμήμα', ruralClinic: 'Αγροτικό Ιατρείο',
      powerFaults: 'Βλάβες ρεύματος', whatsappCall: 'WhatsApp & Κλήση', localTaxi: 'Τοπικό Ταξί',
      argalasti: 'Αργαλαστή', nearest: 'Πλησιέστερη',
    },
    difficulty: { easy: 'Εύκολη', medium: 'Μέτρια', hard: 'Δύσκολη' },
    hikingTags: {
      'Ελαιώνες': 'Ελαιώνες', 'Ιστορικά Μονοπάτια': 'Ιστορικά Μονοπάτια', 'Θέα': 'Θέα',
      'Παραλίες': 'Παραλίες', 'Κατάλληλο για παιδιά': 'Κατάλληλο για παιδιά',
      'Ορεινή': 'Ορεινή', 'Πανοραμική Θέα': 'Πανοραμική Θέα', 'Έμπειροι': 'Έμπειροι',
    },
    acts_page: {
      back: '← Πίσω στις Δραστηριότητες', location: 'Τοποθεσία',
      locationName: 'Χόρτο, Πήλιο', locationSub: 'Νότιο Πήλιο · Μαγνησία · Ελλάδα',
      category: 'Κατηγορία', duration: 'Διάρκεια', distance: 'Απόσταση',
      mapBtn: 'Άνοιγμα στο Google Maps →',
      elevation: 'Υψόμετρο', difficulty: 'Δυσκολία',
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
      history: 'History', hiking: 'Hiking', book: 'Book Now', contact: 'Contact',
    },
    contact: {
      title: 'Get in Touch', subtitle: 'We are here for any question or request',
      send: 'Send Message', sending: 'Sending...',
      name: 'Full Name', email: 'Email', subject: 'Subject', message: 'Message',
      success: '✅ Your message has been sent! We will get back to you shortly.',
      error: '❌ Something went wrong. Please try again or contact us by phone.',
      infoTitle: 'Contact Information',
      phone: 'Phone', emailLabel: 'Email', address: 'Address',
      miniTitle: 'Quick Message', miniPlaceholder: 'Write a message...', miniBtn: 'Send',
      inquiryTitle: 'Enquire about this accommodation', inquiryBtn: 'Send Enquiry',
    },
    hero: {
      badge: '🌿 Horto · South Pelion · Greece', title1: "Myrsini's", title2: 'Studios',
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
      apt1: 'Archontiko', apt2: 'Thalassino', back: '← Back to Rooms', details: 'Details →',
    },
    amenities: {
      AC: 'Air Conditioning', WiFi: 'WiFi', kitchen: 'Kitchen', kitchenette: 'Kitchenette',
      parking: 'Parking', veranda: 'Veranda', seaview: 'Sea View', BBQ: 'BBQ',
      washer: 'Washing Machine', TV: 'TV', towels: 'Towels & Linen', petFriendly: 'Pet Friendly',
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
      footer: 'Information is provided for informational purposes. We are not responsible for trail conditions and cannot verify their accuracy. Information is provided by the "Friends of the Trails".',
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
      airport: 'Nea Anchialos Airport', port: 'Volos Port',
      quote: '«35 minutes from Volos, but centuries away from its rush.»',
      minutes: 'minutes', km: 'km',
    },
    footer: {
      tagline: 'Traditional accommodation in Horto, Pelion. Stone, olive groves and crystal waters of the Aegean in perfect harmony.',
      contact: 'Contact', booking: 'Booking', direct: 'Direct Booking',
      apartments: 'Our Rooms', hiking: 'Hiking', activities: 'Activities',
      checkin: 'Check-in: 14:00 · Check-out: 11:00',
      address: 'Horto, Pelion 37006',
    },
    emergencyLabels: {
      national: 'National Emergency', local: 'Local', useful: 'Useful',
      police: 'Police', fire: 'Fire Brigade', ambulance: 'Ambulance (EKAB)', coastguard: 'Coast Guard',
      hospital: 'Volos Hospital', localPolice: 'Almyros Police', clinic: 'Argalasti Clinic', power: 'Power Company (DEDDIE)',
      studios: 'Myrsini Studios', taxi: 'Horto Taxi', petrol: 'Petrol Station', bank: 'Almyros Bank',
      nationwide: 'Nationwide', ambulanceNote: 'Ambulance', seaSOS: 'Maritime SOS',
      generalHospital: 'General Hospital', localStation: 'Local Station', ruralClinic: 'Rural Clinic',
      powerFaults: 'Power Faults', whatsappCall: 'WhatsApp & Call', localTaxi: 'Local Taxi',
      argalasti: 'Argalasti', nearest: 'Nearest',
    },
    difficulty: { easy: 'Easy', medium: 'Moderate', hard: 'Hard' },
    hikingTags: {
      'Ελαιώνες': 'Olive Groves', 'Ιστορικά Μονοπάτια': 'Historic Paths', 'Θέα': 'View',
      'Παραλίες': 'Beaches', 'Κατάλληλο για παιδιά': 'Family Friendly',
      'Ορεινή': 'Mountain', 'Πανοραμική Θέα': 'Panoramic View', 'Έμπειροι': 'Experienced',
    },
    acts_page: {
      back: '← Back to Activities', location: 'Location',
      locationName: 'Horto, Pelion', locationSub: 'South Pelion · Magnesia · Greece',
      category: 'Category', duration: 'Duration', distance: 'Distance',
      mapBtn: 'Open in Google Maps →',
      elevation: 'Elevation', difficulty: 'Difficulty',
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
      history: 'Geschichte', hiking: 'Wandern', book: 'Buchen', contact: 'Kontakt',
    },
    contact: {
      title: 'Kontaktieren Sie uns', subtitle: 'Wir sind für jede Frage oder Anfrage da',
      send: 'Nachricht senden', sending: 'Senden...',
      name: 'Vollständiger Name', email: 'E-Mail', subject: 'Betreff', message: 'Nachricht',
      success: '✅ Ihre Nachricht wurde gesendet! Wir melden uns in Kürze.',
      error: '❌ Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.',
      infoTitle: 'Kontaktdaten',
      phone: 'Telefon', emailLabel: 'E-Mail', address: 'Adresse',
      miniTitle: 'Schnelle Nachricht', miniPlaceholder: 'Nachricht schreiben...', miniBtn: 'Senden',
      inquiryTitle: 'Anfrage zu dieser Unterkunft', inquiryBtn: 'Anfrage senden',
    },
    hero: {
      badge: '🌿 Chorto · Süd-Pelion · Griechenland', title1: "Myrsini's", title2: 'Studios',
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
      apt1: 'Archontiko', apt2: 'Thalassino', back: '← Zurück zu den Zimmern', details: 'Details →',
    },
    amenities: {
      AC: 'Klimaanlage', WiFi: 'WLAN', kitchen: 'Küche', kitchenette: 'Küchenzeile',
      parking: 'Parkplatz', veranda: 'Veranda', seaview: 'Meerblick', BBQ: 'Grill',
      washer: 'Waschmaschine', TV: 'Fernseher', towels: 'Handtücher & Bettwäsche', petFriendly: 'Haustierfreundlich',
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
      footer: 'Die Informationen dienen nur zu Informationszwecken. Für die Wegbedingungen sind wir nicht verantwortlich und können deren Richtigkeit nicht bestätigen. Die Informationen werden von den „Freunden der Wege" bereitgestellt.',
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
      airport: 'Flughafen Nea Anchialos', port: 'Hafen Volos',
      quote: '«35 Minuten von Volos entfernt, aber Jahrhunderte weit weg von seiner Hektik.»',
      minutes: 'Minuten', km: 'km',
    },
    footer: {
      tagline: 'Traditionelle Unterkunft in Horto, Pelion. Stein, Olivenhaine und kristallklares Ägäisches Meer in harmonischer Einheit.',
      contact: 'Kontakt', booking: 'Buchung', direct: 'Direktbuchung',
      apartments: 'Zimmer', hiking: 'Wandern', activities: 'Aktivitäten',
      checkin: 'Check-in: 14:00 · Check-out: 11:00',
      address: 'Horto, Pelion 37006',
    },
    emergencyLabels: {
      national: 'Nationale Notfälle', local: 'Lokal', useful: 'Nützlich',
      police: 'Polizei', fire: 'Feuerwehr', ambulance: 'Rettungsdienst', coastguard: 'Küstenwache',
      hospital: 'Krankenhaus Volos', localPolice: 'Polizei Almyros', clinic: 'Klinik Argalasti', power: 'Stromunternehmen',
      studios: 'Myrsini Studios', taxi: 'Taxi Horto', petrol: 'Tankstelle', bank: 'Bank Almyros',
      nationwide: 'Bundesweit', ambulanceNote: 'Krankenwagen', seaSOS: 'Meeres-SOS',
      generalHospital: 'Allgemeines Krankenhaus', localStation: 'Lokale Dienststelle', ruralClinic: 'Landambulanz',
      powerFaults: 'Stromausfälle', whatsappCall: 'WhatsApp & Anruf', localTaxi: 'Lokales Taxi',
      argalasti: 'Argalasti', nearest: 'Nächste',
    },
    difficulty: { easy: 'Leicht', medium: 'Mittel', hard: 'Schwer' },
    hikingTags: {
      'Ελαιώνες': 'Olivenhaine', 'Ιστορικά Μονοπάτια': 'Historische Pfade', 'Θέα': 'Aussicht',
      'Παραλίες': 'Strände', 'Κατάλληλο για παιδιά': 'Familienfreundlich',
      'Ορεινή': 'Berg', 'Πανοραμική Θέα': 'Panoramablick', 'Έμπειροι': 'Erfahrene',
    },
    acts_page: {
      back: '← Zurück zu Aktivitäten', location: 'Lage',
      locationName: 'Horto, Pelion', locationSub: 'Süd-Pelion · Magnesia · Griechenland',
      category: 'Kategorie', duration: 'Dauer', distance: 'Distanz',
      mapBtn: 'In Google Maps öffnen →',
      elevation: 'Höhenprofil', difficulty: 'Schwierigkeitsgrad',
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
      history: 'Histoire', hiking: 'Randonnée', book: 'Réserver', contact: 'Contact',
    },
    contact: {
      title: 'Contactez-nous', subtitle: 'Nous sommes disponibles pour toute question',
      send: 'Envoyer le message', sending: 'Envoi...',
      name: 'Nom complet', email: 'E-mail', subject: 'Sujet', message: 'Message',
      success: '✅ Votre message a été envoyé ! Nous vous répondrons bientôt.',
      error: '❌ Une erreur est survenue. Veuillez réessayer.',
      infoTitle: 'Coordonnées',
      phone: 'Téléphone', emailLabel: 'E-mail', address: 'Adresse',
      miniTitle: 'Message rapide', miniPlaceholder: 'Écrire un message...', miniBtn: 'Envoyer',
      inquiryTitle: 'Renseignements sur cet hébergement', inquiryBtn: 'Envoyer la demande',
    },
    hero: {
      badge: '🌿 Horto · Pelion Sud · Grèce', title1: "Myrsini's", title2: 'Studios',
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
      apt1: 'Archontiko', apt2: 'Thalassino', back: '← Retour aux Logements', details: 'Détails →',
    },
    amenities: {
      AC: 'Climatisation', WiFi: 'WiFi', kitchen: 'Cuisine', kitchenette: 'Kitchenette',
      parking: 'Parking', veranda: 'Véranda', seaview: 'Vue mer', BBQ: 'Barbecue',
      washer: 'Lave-linge', TV: 'Télévision', towels: 'Serviettes & Linge', petFriendly: 'Animaux acceptés',
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
      footer: "Les informations sont fournies à titre informatif. Nous ne sommes pas responsables des conditions des sentiers et ne pouvons en vérifier l'exactitude. Les informations sont fournies par les « Amis des Sentiers ».",
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
      airport: 'Aéroport Nea Anchialos', port: 'Port de Volos',
      quote: '«À 35 minutes de Volos, mais à des siècles de son agitation.»',
      minutes: 'minutes', km: 'km',
    },
    footer: {
      tagline: "Hébergement traditionnel à Horto, Pélion. Pierre, oliveraies et eaux cristallines de la mer Égée en parfaite harmonie.",
      contact: 'Contact', booking: 'Réservation', direct: 'Réservation directe',
      apartments: 'Logements', hiking: 'Randonnée', activities: 'Activités',
      checkin: 'Arrivée: 14h00 · Départ: 11h00',
      address: 'Horto, Pélion 37006',
    },
    emergencyLabels: {
      national: 'Urgence Nationale', local: 'Local', useful: 'Utile',
      police: 'Police', fire: 'Pompiers', ambulance: 'Ambulance (EKAB)', coastguard: 'Garde Côtière',
      hospital: 'Hôpital de Volos', localPolice: "Police d'Almyros", clinic: "Clinique d'Argalasti", power: 'Compagnie Électrique',
      studios: 'Myrsini Studios', taxi: 'Taxi Horto', petrol: 'Station-service', bank: 'Banque Almyros',
      nationwide: 'National', ambulanceNote: 'Ambulance', seaSOS: 'SOS Maritime',
      generalHospital: 'Hôpital Général', localStation: 'Commissariat Local', ruralClinic: 'Clinique Rurale',
      powerFaults: 'Pannes électriques', whatsappCall: 'WhatsApp & Appel', localTaxi: 'Taxi Local',
      argalasti: 'Argalasti', nearest: 'Le plus proche',
    },
    difficulty: { easy: 'Facile', medium: 'Modéré', hard: 'Difficile' },
    hikingTags: {
      'Ελαιώνες': 'Oliveraies', 'Ιστορικά Μονοπάτια': 'Chemins Historiques', 'Θέα': 'Vue',
      'Παραλίες': 'Plages', 'Κατάλληλο για παιδιά': 'Pour familles',
      'Ορεινή': 'Montagne', 'Πανοραμική Θέα': 'Vue Panoramique', 'Έμπειροι': 'Expérimentés',
    },
    acts_page: {
      back: '← Retour aux Activités', location: 'Localisation',
      locationName: 'Horto, Pélion', locationSub: 'Pélion Sud · Magnésie · Grèce',
      category: 'Catégorie', duration: 'Durée', distance: 'Distance',
      mapBtn: 'Ouvrir dans Google Maps →',
      elevation: 'Dénivelé', difficulty: 'Difficulté',
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
