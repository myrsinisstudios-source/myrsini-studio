import { NextResponse } from 'next/server'

const APT_NAMES: Record<string, string> = {
  archontiko: 'Το Αρχοντικό',
  thalassino: 'Το Θαλασσινό',
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const {
      apartment_id,
      guest_name,
      guest_phone,
      check_in,
      check_out,
      num_guests,
      language = 'el',
      price_per_night,
      total_amount,
      channel = 'direct',
    } = body

    if (!apartment_id || !guest_name || !guest_phone || !check_in || !check_out) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const nights = Math.ceil(
      (new Date(check_out).getTime() - new Date(check_in).getTime()) / 86400000,
    )

    /* ── Save to Supabase ── */
    try {
      const { createClient } = await import('@/lib/supabase/server')
      const supabase = await createClient()
      await supabase.from('bookings').insert({
        apartment_id,
        guest_name,
        guest_phone,
        check_in,
        check_out,
        num_guests: num_guests ?? 2,
        nights,
        price_per_night: price_per_night ?? 0,
        total_amount: total_amount ?? price_per_night * nights,
        channel,
        status: 'confirmed',
        language,
      })
    } catch {
      /* Supabase not configured — continue anyway */
    }

    /* ── Send WhatsApp via Twilio ── */
    const apartmentName = APT_NAMES[apartment_id] ?? apartment_id

    await sendWhatsApp({
      type: 'confirmation',
      language,
      booking: {
        guest_name,
        guest_phone,
        apartment_name: apartmentName,
        check_in,
        check_out,
        num_guests: num_guests ?? 2,
        nights,
        total_amount: total_amount ?? 0,
        owner_phone: process.env.TWILIO_OWNER_PHONE ?? '',
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Booking error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/* ─────────────────────────────────────────────────── */

async function sendWhatsApp({ type, language, booking }: {
  type: 'confirmation' | 'reminder'
  language: string
  booking: Record<string, unknown>
}) {
  const SID   = process.env.TWILIO_ACCOUNT_SID
  const TOKEN = process.env.TWILIO_AUTH_TOKEN
  const FROM  = process.env.TWILIO_WHATSAPP_FROM
  const OWNER = process.env.TWILIO_OWNER_PHONE

  if (!SID || !TOKEN || !FROM || !OWNER || !SID.startsWith('AC')) return

  const msgs = buildMessages(language, booking)
  const auth = Buffer.from(`${SID}:${TOKEN}`).toString('base64')
  const url  = `https://api.twilio.com/2010-04-01/Accounts/${SID}/Messages.json`

  const send = (to: string, body: string) =>
    fetch(url, {
      method: 'POST',
      headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ From: FROM, To: `whatsapp:${to}`, Body: body }),
    })

  if (type === 'confirmation') {
    const guestPhone = String(booking.guest_phone ?? '')
    if (guestPhone) await send(guestPhone, msgs.confirmation)
    await send(OWNER, msgs.owner)
  } else if (type === 'reminder') {
    const guestPhone = String(booking.guest_phone ?? '')
    if (guestPhone) await send(guestPhone, msgs.reminder)
  }
}

function buildMessages(lang: string, b: Record<string, unknown>) {
  const name = String(b.guest_name ?? '')
  const apt  = String(b.apartment_name ?? '')
  const ci   = String(b.check_in ?? '')
  const co   = String(b.check_out ?? '')
  const ng   = String(b.num_guests ?? '')
  const tot  = String(b.total_amount ?? '')
  const own  = String(b.owner_phone ?? '')

  const templates: Record<string, { confirmation: string; reminder: string; owner: string }> = {
    el: {
      confirmation: `Γεια σας ${name}! ✅\n\nΗ κράτησή σας επιβεβαιώθηκε:\n🏡 ${apt}\n📅 ${ci} → ${co}\n👥 ${ng} άτομα\n💰 €${tot}\n\nΣας ευχαριστούμε που επιλέξατε τα Myrsini Studios!\nΓια οποιαδήποτε απορία: ${own} 🌿`,
      reminder: `Γεια σας ${name}! 👋\n\nΥπενθύμιση: Αύριο είναι η ημέρα άφιξής σας!\n\n🏡 ${apt}\n🕐 Check-in: 14:00\n📍 Χόρτο Πηλίου\n📞 ${own}\n\nΣας περιμένουμε! 🌊`,
      owner: `🔔 Νέα Κράτηση!\n👤 ${name}\n🏡 ${apt}\n📅 ${ci} → ${co}\n👥 ${ng} άτομα\n💰 €${tot}\n📞 ${b.guest_phone}`,
    },
    en: {
      confirmation: `Hello ${name}! ✅\n\nYour booking is confirmed:\n🏡 ${apt}\n📅 ${ci} → ${co}\n👥 ${ng} guests\n💰 €${tot}\n\nThank you for choosing Myrsini Studios!\nAny questions: ${own} 🌿`,
      reminder: `Hello ${name}! 👋\n\nReminder: Tomorrow is your arrival day!\n\n🏡 ${apt}\n🕐 Check-in: 14:00\n📍 Chorto, Pelion\n📞 ${own}\n\nLooking forward to welcoming you! 🌊`,
      owner: `🔔 New Booking!\n👤 ${name}\n🏡 ${apt}\n📅 ${ci} → ${co}\n👥 ${ng} guests\n💰 €${tot}\n📞 ${b.guest_phone}`,
    },
    de: {
      confirmation: `Hallo ${name}! ✅\n\nIhre Buchung wurde bestätigt:\n🏡 ${apt}\n📅 ${ci} → ${co}\n👥 ${ng} Personen\n💰 €${tot}\n\nVielen Dank, dass Sie Myrsini Studios gewählt haben!\nFragen: ${own} 🌿`,
      reminder: `Hallo ${name}! 👋\n\nErinnerung: Morgen ist Ihr Ankunftstag!\n\n🏡 ${apt}\n🕐 Check-in: 14:00\n📍 Chorto, Pelion\n📞 ${own}\n\nWir freuen uns auf Sie! 🌊`,
      owner: `🔔 Neue Buchung!\n👤 ${name}\n🏡 ${apt}\n📅 ${ci} → ${co}\n👥 ${ng} Pers.\n💰 €${tot}\n📞 ${b.guest_phone}`,
    },
    fr: {
      confirmation: `Bonjour ${name}! ✅\n\nVotre réservation est confirmée:\n🏡 ${apt}\n📅 ${ci} → ${co}\n👥 ${ng} personnes\n💰 €${tot}\n\nMerci d'avoir choisi Myrsini Studios!\nQuestions: ${own} 🌿`,
      reminder: `Bonjour ${name}! 👋\n\nRappel: Demain est votre jour d'arrivée!\n\n🏡 ${apt}\n🕐 Check-in: 14:00\n📍 Chorto, Pelion\n📞 ${own}\n\nNous avons hâte de vous accueillir! 🌊`,
      owner: `🔔 Nouvelle Réservation!\n👤 ${name}\n🏡 ${apt}\n📅 ${ci} → ${co}\n👥 ${ng} pers.\n💰 €${tot}\n📞 ${b.guest_phone}`,
    },
  }

  return templates[lang] ?? templates.el
}
