import { NextResponse } from 'next/server'

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export async function GET() {
  if (!SB_URL || !SB_KEY) return NextResponse.json(null)
  try {
    const res = await fetch(`${SB_URL}/rest/v1/settings?id=eq.1&limit=1`, {
      headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` },
      cache: 'no-store',
    })
    if (!res.ok) return NextResponse.json(null)
    const data = await res.json()
    return NextResponse.json(data[0] ?? null)
  } catch {
    return NextResponse.json(null)
  }
}
