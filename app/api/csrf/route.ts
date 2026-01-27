import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function GET() {
  const token = crypto.randomBytes(32).toString('hex')
  const res = NextResponse.json({ ok: true })

  res.cookies.set('csrfToken', token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24, // 24h
  })

  return res
}
