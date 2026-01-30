import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  if ((process.env.DEBUG_AUTH || '').toLowerCase() !== 'true') {
    return NextResponse.json({ error: 'Debug endpoint disabled' }, { status: 404 })
  }

  const cookieHeader = req.headers.get('cookie') || null
  const authHeader = req.headers.get('authorization') || null

  return NextResponse.json({ cookieHeader, authHeader })
}
