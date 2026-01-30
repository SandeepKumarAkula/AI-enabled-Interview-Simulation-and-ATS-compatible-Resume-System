import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET

export async function POST(req: Request) {
  try {
    if (!JWT_SECRET) {
      return NextResponse.json({ error: 'Server misconfigured (missing NEXTAUTH_SECRET)' }, { status: 500 })
    }

    const { email, password } = await req.json()
    if (!email || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.hashedPassword) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const match = await bcrypt.compare(password, user.hashedPassword)
    if (!match) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: '30d' })

    const res = NextResponse.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } })
    // Set secure HttpOnly cookie
    res.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      sameSite: 'lax'
    })

    // Log success (no sensitive data)
    try {
      // eslint-disable-next-line no-console
      console.debug(`Login success for user=${user.email} id=${user.id}`)
    } catch (e) {
      // swallow
    }

    return res
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
