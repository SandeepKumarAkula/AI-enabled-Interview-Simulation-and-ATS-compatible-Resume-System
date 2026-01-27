import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import validator from 'validator'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password } = body

    if (!email || !password) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })

    if (!validator.isEmail(String(email))) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const passwordStr = String(password)
    if (passwordStr.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 })

    const hashed = await bcrypt.hash(passwordStr, 10)

    const user = await prisma.user.create({ data: { email: String(email).toLowerCase(), name: name || null, hashedPassword: hashed } })

    return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } })
  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
