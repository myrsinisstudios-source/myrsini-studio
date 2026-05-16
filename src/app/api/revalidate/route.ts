import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST() {
  revalidatePath('/', 'layout')
  revalidatePath('/apartments/[slug]', 'page')
  return NextResponse.json({ revalidated: true, ts: Date.now() })
}
