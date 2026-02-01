import { NextRequest, NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET

export async function POST(request: NextRequest) {
  try {
    if (!JWT_SECRET) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    }

    const token = request.cookies.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Verify current token
    const decoded = verify(token, JWT_SECRET) as { sub: string; role: string }

    // Create new token with extended expiry (1 hour from now)
    const issuedAt = Math.floor(Date.now() / 1000)
    const newToken = jwt.sign(
      { sub: decoded.sub, role: decoded.role, iat: issuedAt },
      JWT_SECRET,
      { expiresIn: '1h' }
    )

    const res = NextResponse.json({ 
      success: true,
      sessionExpiry: issuedAt + 3600 // 1 hour from now in seconds
    })

    // Set new cookie with extended expiry
    res.cookies.set('token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60, // 1 hour in seconds
      sameSite: 'lax'
    })

    return res
  } catch (error) {
    console.error('Session extension error:', error)
    return NextResponse.json({ error: 'Session extension failed' }, { status: 401 })
  }
}
