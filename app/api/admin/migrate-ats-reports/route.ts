import { NextResponse } from 'next/server'

// Migration endpoint disabled because ATS history feature has been removed.
export async function POST() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 })
}
