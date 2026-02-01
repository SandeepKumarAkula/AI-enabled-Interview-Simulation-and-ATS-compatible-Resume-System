import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'
import { sendMail } from '@/lib/mailer'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email } = body
    if (!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { email: String(email).toLowerCase() } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    if (user.emailVerified) {
      return NextResponse.json({ error: 'Email already verified' }, { status: 400 })
    }

    // delete old tokens
    await prisma.verificationToken.deleteMany({ where: { identifier: String(email).toLowerCase() } })

    // create new token (expires in 60 minutes)
    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 1000 * 60 * 60)
    await prisma.verificationToken.create({ data: { identifier: String(email).toLowerCase(), token, expires } })

    // send email
    const base = process.env.NEXTAUTH_URL || `http://localhost:3000`
    const link = `${base}/auth/verify?token=${encodeURIComponent(token)}&email=${encodeURIComponent(String(email).toLowerCase())}`
    const html = `<p>Hello ${user.name || ''},</p><p>You requested a new verification link. Please verify your email by clicking the link below:</p><p><a href="${link}">Verify email</a></p><p>This link expires in 60 minutes.</p>`
    
    await sendMail({ to: String(email), subject: 'Verify your email', html })

    return NextResponse.json({ ok: true, message: 'Verification email sent' })
  } catch (e: any) {
    console.error('Resend verification error:', e)
    return NextResponse.json({ error: 'Failed to send verification email' }, { status: 500 })
  }
}
