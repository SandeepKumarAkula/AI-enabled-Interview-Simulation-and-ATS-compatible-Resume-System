import { NextResponse } from 'next/server'

export async function POST() {
  const res = NextResponse.json({ ok: true })
  
  // Clear authentication cookie
  res.cookies.set('token', '', { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production', 
    path: '/', 
    maxAge: 0, 
    sameSite: 'strict' 
  })
  
  // Add cache control headers to prevent browser caching
  res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  res.headers.set('Pragma', 'no-cache')
  res.headers.set('Expires', '0')
  res.headers.set('Surrogate-Control', 'no-store')
  
  return res
}
