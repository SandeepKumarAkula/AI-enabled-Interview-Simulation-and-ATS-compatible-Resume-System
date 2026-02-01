import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import validator from 'validator'
import crypto from 'crypto'
import { sendMail } from '@/lib/mailer'

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

    const normalizedEmail = String(email).toLowerCase()
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } })
    if (existing) return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 })

    const hashed = await bcrypt.hash(passwordStr, 10)

    const adminEmail = (process.env.ADMIN_EMAIL || '').toLowerCase()
    const isAdminEmail = adminEmail.length > 0 && normalizedEmail === adminEmail

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name: name || null,
        hashedPassword: hashed,
        emailVerified: isAdminEmail ? new Date() : null,
      },
    })

    if (!isAdminEmail) {
      // create a verification token (expires in 60 minutes)
      const token = crypto.randomBytes(32).toString('hex')
      const expires = new Date(Date.now() + 1000 * 60 * 60)
      await prisma.verificationToken.create({ data: { identifier: normalizedEmail, token, expires } })

      // send verification email (best-effort)
      try {
        const base = process.env.NEXTAUTH_URL || `http://localhost:3000`
        const link = `${base}/auth/verify?token=${encodeURIComponent(token)}&email=${encodeURIComponent(normalizedEmail)}`
        const html = `<p>Hello ${name || ''},</p><p>Thanks for creating an account. Please verify your email by clicking the link below:</p><p><a href="${link}">Verify email</a></p><p>This link expires in 60 minutes.</p>`
        await sendMail({ to: normalizedEmail, subject: 'Verify your email', html })
      } catch (e) {
        console.error('Failed to send verification email:', e)
      }
    }

    return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } })
  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
