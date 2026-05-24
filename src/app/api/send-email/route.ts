import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, message, subject, apartment, _hp, _t } = body as Record<string, unknown>

    // ── 1. Honeypot ──────────────────────────────────────────
    if (typeof _hp === 'string' && _hp.trim().length > 0) {
      return NextResponse.json({ error: 'spam' }, { status: 400 })
    }

    // ── 2. Timing (< 3 s since page render) ──────────────────
    const renderTime = Number(_t)
    if (!renderTime || Date.now() - renderTime < 3000) {
      return NextResponse.json({ error: 'too_fast' }, { status: 400 })
    }

    // ── 3. Required fields ────────────────────────────────────
    if (
      typeof name !== 'string' || !name.trim() ||
      typeof email !== 'string' || !email.trim() ||
      typeof message !== 'string' || !message.trim()
    ) {
      return NextResponse.json({ error: 'missing_fields' }, { status: 400 })
    }

    // ── 4. Persist to Supabase ────────────────────────────────
    const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
    const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (SB_URL && SB_KEY) {
      try {
        await fetch(`${SB_URL}/rest/v1/contact_messages`, {
          method: 'POST',
          headers: {
            apikey: SB_KEY,
            Authorization: `Bearer ${SB_KEY}`,
            'Content-Type': 'application/json',
            Prefer: 'return=minimal',
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            subject: typeof subject === 'string' && subject.trim() ? subject.trim() : null,
            message: message.trim(),
            apartment_slug: typeof apartment === 'string' && apartment.trim() ? apartment.trim() : null,
          }),
        })
      } catch {
        // Table may not exist yet — non-fatal
      }
    }

    // ── 5. Twilio WhatsApp notification to owner ──────────────
    const SID   = process.env.TWILIO_ACCOUNT_SID
    const TOKEN = process.env.TWILIO_AUTH_TOKEN
    const FROM  = process.env.TWILIO_WHATSAPP_FROM
    const OWNER = process.env.TWILIO_OWNER_PHONE
    if (SID && TOKEN && FROM && OWNER && SID.startsWith('AC')) {
      try {
        const auth = Buffer.from(`${SID}:${TOKEN}`).toString('base64')
        const aptLine = typeof apartment === 'string' && apartment.trim()
          ? `🏡 ${apartment}\n`
          : ''
        const subLine = typeof subject === 'string' && subject.trim()
          ? `📌 ${subject}\n`
          : ''
        const msgBody = `📩 ΝΕΟ ΜΗΝΥΜΑ\n👤 ${name}\n📧 ${email}\n${aptLine}${subLine}\n${String(message).slice(0, 400)}`
        await fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${SID}/Messages.json`,
          {
            method: 'POST',
            headers: {
              Authorization: `Basic ${auth}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({ From: FROM, To: `whatsapp:${OWNER}`, Body: msgBody }),
          }
        )
      } catch {
        // Non-fatal — message still saved
      }
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
