import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function GET() {
  const token = crypto.randomBytes(32).toString('hex')
  const res = NextResponse.json({ ok: true, csrfToken: token })

  res.cookies.set('csrfToken', token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    // Use 'lax' so modern browsers will include the cookie for same-site
    // navigations and top-level fetches while still providing CSRF protection.
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // 24h
  })

  return res
}
