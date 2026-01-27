import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { sendMail } from '@/lib/mailer'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return NextResponse.json({ ok: true }) // don't reveal existence

    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60) // 1 hour

    await prisma.passwordResetToken.create({ data: { userId: user.id, token, expiresAt } })

    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset?token=${token}`

    try {
      await sendMail({
        to: user.email,
        subject: 'Password reset',
        html: `
          <p>You requested a password reset.</p>
          <p>
            Click this link to set a new password:
            <a href="${resetUrl}">${resetUrl}</a>
          </p>
          <p><strong>This link expires in 60 minutes</strong> and can be used only once.</p>
          <p>If you didn't request this, you can safely ignore this email.</p>
        `,
      })
    } catch (mailErr: any) {
      // In production, never reveal email delivery issues.
      // In development, surface enough to debug and provide the reset URL as a fallback.
      console.error('Forgot password email send failed:', mailErr)
      if (process.env.NODE_ENV !== 'production') {
        console.log('DEV reset URL (email failed):', resetUrl)
        return NextResponse.json(
          {
            ok: false,
            error: mailErr?.message || 'Email send failed',
            resetUrl,
          },
          { status: 500 },
        )
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    console.error('Forgot password error:', error)
    if (process.env.NODE_ENV !== 'production') {
      return NextResponse.json({ ok: false, error: error?.message || 'Failed' }, { status: 500 })
    }
    return NextResponse.json({ ok: true }) // Don't reveal errors for security
  }
}
