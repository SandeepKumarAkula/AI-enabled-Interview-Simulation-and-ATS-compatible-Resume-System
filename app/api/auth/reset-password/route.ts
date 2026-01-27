import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

function getReason(record: { used: boolean; expiresAt: Date } | null, now: Date) {
  if (!record) return 'invalid'
  if (record.used) return 'used'
  if (record.expiresAt < now) return 'expired'
  return null
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const token = url.searchParams.get('token') || ''
    if (!token) {
      return NextResponse.json({ ok: false, reason: 'missing' }, { status: 200 })
    }

    const record = await prisma.passwordResetToken.findUnique({
      where: { token },
      select: { used: true, expiresAt: true },
    })
    const now = new Date()
    const reason = getReason(record, now)

    if (reason) {
      return NextResponse.json({ ok: false, reason }, { status: 200 })
    }

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (error: any) {
    console.error('Reset password validate error:', error)
    return NextResponse.json({ ok: false, reason: 'error' }, { status: 200 })
  }
}

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json()
    if (!token || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    if (typeof password !== 'string' || password.trim().length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const now = new Date()
    const hashed = await bcrypt.hash(password, 10)

    const result = await prisma.$transaction(async (tx) => {
      const usedUpdate = await tx.passwordResetToken.updateMany({
        where: {
          token,
          used: false,
          expiresAt: { gt: now },
        },
        data: { used: true },
      })

      if (usedUpdate.count !== 1) {
        const record = await tx.passwordResetToken.findUnique({
          where: { token },
          select: { used: true, expiresAt: true },
        })
        const reason = getReason(record, now) || 'invalid'
        return { ok: false as const, reason }
      }

      const record = await tx.passwordResetToken.findUnique({
        where: { token },
        select: { userId: true },
      })
      if (!record) {
        return { ok: false as const, reason: 'invalid' }
      }

      await tx.user.update({ where: { id: record.userId }, data: { hashedPassword: hashed } })

      // Invalidate any other outstanding reset tokens for this user.
      await tx.passwordResetToken.updateMany({
        where: { userId: record.userId, used: false },
        data: { used: true },
      })

      return { ok: true as const }
    })

    if (!result.ok) {
      const msg =
        result.reason === 'used'
          ? 'This reset link has already been used.'
          : result.reason === 'expired'
            ? 'This reset link has expired. Please request a new one.'
            : 'Invalid reset link.'
      return NextResponse.json({ error: msg, reason: result.reason }, { status: 400 })
    }

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (error: any) {
    console.error('Reset password error:', error)
    return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 })
  }
}
