import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { token, email } = body
    if (!token || !email) return NextResponse.json({ error: 'Missing token or email' }, { status: 400 })

    const record = await prisma.verificationToken.findUnique({ where: { token } })
    if (!record || record.identifier !== String(email).toLowerCase()) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 })
    }

    if (record.expires < new Date()) {
      return NextResponse.json({ error: 'Token expired' }, { status: 400 })
    }

    // mark user verified
    const user = await prisma.user.findUnique({ where: { email: String(email).toLowerCase() } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    await prisma.user.update({ where: { id: user.id }, data: { emailVerified: new Date() } })
    // delete token
    await prisma.verificationToken.deleteMany({ where: { identifier: String(email).toLowerCase() } })

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('Verification error:', e)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
