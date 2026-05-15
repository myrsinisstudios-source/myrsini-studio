import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { type, language = 'el', booking } = await request.json()

    const SID   = process.env.TWILIO_ACCOUNT_SID
    const TOKEN = process.env.TWILIO_AUTH_TOKEN
    const FROM  = process.env.TWILIO_WHATSAPP_FROM
    const OWNER = process.env.TWILIO_OWNER_PHONE

    if (!SID || !TOKEN || !FROM || !OWNER || !SID.startsWith('AC')) {
      return NextResponse.json({ error: 'Twilio not configured' }, { status: 503 })
    }

    const auth = Buffer.from(`${SID}:${TOKEN}`).toString('base64')
    const url  = `https://api.twilio.com/2010-04-01/Accounts/${SID}/Messages.json`

    const send = async (to: string, body: string) => {
      const r = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ From: FROM, To: `whatsapp:${to}`, Body: body }),
      })
      return r.json()
    }

    const msgs = buildMessages(language, booking)
    const results = []

    if (type === 'confirmation') {
      if (booking.guest_phone) results.push(await send(booking.guest_phone, msgs.confirmation))
      results.push(await send(OWNER, msgs.owner))
    } else if (type === 'reminder') {
      if (booking.guest_phone) results.push(await send(booking.guest_phone, msgs.reminder))
    } else if (type === 'owner') {
      results.push(await send(OWNER, msgs.owner))
    }

    return NextResponse.json({ success: true, sent: results.length })
  } catch (error) {
    console.error('WhatsApp error:', error)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}

function buildMessages(lang: string, b: Record<string, string | number>) {
  const name = String(b.guest_name ?? '')
  const apt  = String(b.apartment_name ?? '')
  const ci   = String(b.check_in ?? '')
  const co   = String(b.check_out ?? '')
  const ng   = String(b.num_guests ?? '')
  const tot  = String(b.total_amount ?? '')
  const own  = String(b.owner_phone ?? process.env.TWILIO_OWNER_PHONE ?? '')

  const map: Record<string, { confirmation: string; reminder: string; owner: string }> = {
    el: {
      confirmation: `✅ Επιβεβαίωση κράτησης\n\nΑγαπητέ/ή ${name},\n🏡 ${apt}\n📅 ${ci} → ${co} · ${ng} άτομα\n💰 Σύνολο: €${tot}\n\nCheck-in 14:00 · Check-out 11:00\nΓια πληροφορίες: ${own}\n\nΣας περιμένουμε! — Myrsini Studios 🌿`,
      reminder: `👋 Αύριο σας περιμένουμε!\n\nΑγαπητέ/ή ${name},\nΥπενθυμίζουμε ότι η άφιξή σας είναι αύριο.\n\n🏡 ${apt} · Χόρτο Πηλίου\n🕐 Check-in από τις 14:00\n📞 ${own}\n\nΚαλό ταξίδι! 🚗`,
      owner: `🔔 ΝΕΑ ΚΡΑΤΗΣΗ\n👤 ${name}\n🏡 ${apt}\n📅 ${ci} → ${co}\n👥 ${ng} άτομα\n💰 €${tot}\n📞 ${b.guest_phone}`,
    },
    en: {
      confirmation: `✅ Booking Confirmation\n\nDear ${name},\n🏡 ${apt}\n📅 ${ci} → ${co} · ${ng} guests\n💰 Total: €${tot}\n\nCheck-in 14:00 · Check-out 11:00\nContact: ${own}\n\nSee you soon! — Myrsini Studios 🌿`,
      reminder: `👋 See you tomorrow!\n\nDear ${name},\nYour arrival is tomorrow.\n\n🏡 ${apt} · Chorto, Pelion\n🕐 Check-in from 14:00\n📞 ${own}\n\nSafe travels! 🚗`,
      owner: `🔔 NEW BOOKING\n👤 ${name}\n🏡 ${apt}\n📅 ${ci} → ${co}\n👥 ${ng} guests\n💰 €${tot}\n📞 ${b.guest_phone}`,
    },
    de: {
      confirmation: `✅ Buchungsbestätigung\n\nLiebe/r ${name},\n🏡 ${apt}\n📅 ${ci} → ${co} · ${ng} Personen\n💰 Gesamt: €${tot}\n\nCheck-in 14:00 · Check-out 11:00\nKontakt: ${own}\n\nBis bald! — Myrsini Studios 🌿`,
      reminder: `👋 Wir sehen uns morgen!\n\nLiebe/r ${name},\nIhre Ankunft ist morgen.\n\n🏡 ${apt} · Chorto, Pelion\n🕐 Check-in ab 14:00\n📞 ${own}\n\nGute Reise! 🚗`,
      owner: `🔔 NEUE BUCHUNG\n👤 ${name}\n🏡 ${apt}\n📅 ${ci} → ${co}\n👥 ${ng} Pers.\n💰 €${tot}\n📞 ${b.guest_phone}`,
    },
    fr: {
      confirmation: `✅ Confirmation de réservation\n\nCher/Chère ${name},\n🏡 ${apt}\n📅 ${ci} → ${co} · ${ng} personnes\n💰 Total: €${tot}\n\nCheck-in 14:00 · Check-out 11:00\nContact: ${own}\n\nÀ bientôt! — Myrsini Studios 🌿`,
      reminder: `👋 On vous attend demain!\n\nCher/Chère ${name},\nVotre arrivée est demain.\n\n🏡 ${apt} · Chorto, Pélion\n🕐 Check-in dès 14:00\n📞 ${own}\n\nBon voyage! 🚗`,
      owner: `🔔 NOUVELLE RÉSERVATION\n👤 ${name}\n🏡 ${apt}\n📅 ${ci} → ${co}\n👥 ${ng} pers.\n💰 €${tot}\n📞 ${b.guest_phone}`,
    },
  }

  return map[lang] ?? map.el
}
