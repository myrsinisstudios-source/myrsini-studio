import { NextResponse } from 'next/server'

async function getArrivalWeather(checkIn: string): Promise<string | null> {
  const key = process.env.OPENWEATHER_API_KEY
  if (!key) return null
  try {
    const today = new Date()
    const arrival = new Date(checkIn)
    const diffDays = Math.floor((arrival.getTime() - today.getTime()) / 86400000)
    if (diffDays < 0 || diffDays > 4) return null

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=39.1003&lon=23.3731&appid=${key}&units=metric&lang=el&cnt=40`,
      { cache: 'no-store' }
    )
    if (!res.ok) return null
    const data = await res.json()

    const entries = (data.list ?? []).filter((item: { dt_txt: string }) =>
      item.dt_txt.startsWith(checkIn)
    )
    if (!entries.length) return null

    const entry = entries.find((e: { dt_txt: string }) => e.dt_txt.includes('12:00:00')) ?? entries[0]
    const temp = Math.round(entry.main.temp)
    const desc: string = entry.weather[0].description
    const wind = Math.round(entry.wind.speed * 3.6)
    return `${temp}°C, ${desc}, 💨 ${wind} km/h`
  } catch {
    return null
  }
}

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

    const weatherText = type === 'confirmation' ? await getArrivalWeather(String(booking.check_in ?? '')) : null
    const msgs = buildMessages(language, booking, weatherText)
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

function buildMessages(lang: string, b: Record<string, string | number>, weatherText: string | null = null) {
  const name = String(b.guest_name ?? '')
  const apt  = String(b.apartment_name ?? '')
  const ci   = String(b.check_in ?? '')
  const co   = String(b.check_out ?? '')
  const ng   = String(b.num_guests ?? '')
  const tot  = String(b.total_amount ?? '')
  const own  = String(b.owner_phone ?? process.env.TWILIO_OWNER_PHONE ?? '')

  const wx: Record<string, string> = {
    el: weatherText ? `\n🌤 Καιρός άφιξης: ${weatherText}` : '',
    en: weatherText ? `\n🌤 Weather on arrival: ${weatherText}` : '',
    de: weatherText ? `\n🌤 Wetter bei Ankunft: ${weatherText}` : '',
    fr: weatherText ? `\n🌤 Météo à l'arrivée: ${weatherText}` : '',
  }
  const wLine = wx[lang] ?? wx.el

  const map: Record<string, { confirmation: string; reminder: string; owner: string }> = {
    el: {
      confirmation: `✅ Επιβεβαίωση κράτησης\n\nΑγαπητέ/ή ${name},\n🏡 ${apt}\n📅 ${ci} → ${co} · ${ng} άτομα\n💰 Σύνολο: €${tot}${wLine}\n\nCheck-in 14:00 · Check-out 11:00\nΓια πληροφορίες: ${own}\n\nΣας περιμένουμε! — Myrsini Studios 🌿`,
      reminder: `👋 Αύριο σας περιμένουμε!\n\nΑγαπητέ/ή ${name},\nΥπενθυμίζουμε ότι η άφιξή σας είναι αύριο.\n\n🏡 ${apt} · Χόρτο Πηλίου\n🕐 Check-in από τις 14:00\n📞 ${own}\n\nΚαλό ταξίδι! 🚗`,
      owner: `🔔 ΝΕΑ ΚΡΑΤΗΣΗ\n👤 ${name}\n🏡 ${apt}\n📅 ${ci} → ${co}\n👥 ${ng} άτομα\n💰 €${tot}\n📞 ${b.guest_phone}`,
    },
    en: {
      confirmation: `✅ Booking Confirmation\n\nDear ${name},\n🏡 ${apt}\n📅 ${ci} → ${co} · ${ng} guests\n💰 Total: €${tot}${wLine}\n\nCheck-in 14:00 · Check-out 11:00\nContact: ${own}\n\nSee you soon! — Myrsini Studios 🌿`,
      reminder: `👋 See you tomorrow!\n\nDear ${name},\nYour arrival is tomorrow.\n\n🏡 ${apt} · Chorto, Pelion\n🕐 Check-in from 14:00\n📞 ${own}\n\nSafe travels! 🚗`,
      owner: `🔔 NEW BOOKING\n👤 ${name}\n🏡 ${apt}\n📅 ${ci} → ${co}\n👥 ${ng} guests\n💰 €${tot}\n📞 ${b.guest_phone}`,
    },
    de: {
      confirmation: `✅ Buchungsbestätigung\n\nLiebe/r ${name},\n🏡 ${apt}\n📅 ${ci} → ${co} · ${ng} Personen\n💰 Gesamt: €${tot}${wLine}\n\nCheck-in 14:00 · Check-out 11:00\nKontakt: ${own}\n\nBis bald! — Myrsini Studios 🌿`,
      reminder: `👋 Wir sehen uns morgen!\n\nLiebe/r ${name},\nIhre Ankunft ist morgen.\n\n🏡 ${apt} · Chorto, Pelion\n🕐 Check-in ab 14:00\n📞 ${own}\n\nGute Reise! 🚗`,
      owner: `🔔 NEUE BUCHUNG\n👤 ${name}\n🏡 ${apt}\n📅 ${ci} → ${co}\n👥 ${ng} Pers.\n💰 €${tot}\n📞 ${b.guest_phone}`,
    },
    fr: {
      confirmation: `✅ Confirmation de réservation\n\nCher/Chère ${name},\n🏡 ${apt}\n📅 ${ci} → ${co} · ${ng} personnes\n💰 Total: €${tot}${wLine}\n\nCheck-in 14:00 · Check-out 11:00\nContact: ${own}\n\nÀ bientôt! — Myrsini Studios 🌿`,
      reminder: `👋 On vous attend demain!\n\nCher/Chère ${name},\nVotre arrivée est demain.\n\n🏡 ${apt} · Chorto, Pélion\n🕐 Check-in dès 14:00\n📞 ${own}\n\nBon voyage! 🚗`,
      owner: `🔔 NOUVELLE RÉSERVATION\n👤 ${name}\n🏡 ${apt}\n📅 ${ci} → ${co}\n👥 ${ng} pers.\n💰 €${tot}\n📞 ${b.guest_phone}`,
    },
  }

  return map[lang] ?? map.el
}
