import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken, requireAdmin } from '@/lib/auth'

export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const authUser = await getUserFromToken(req)
  try {
    requireAdmin(authUser)
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await ctx.params
  if (!id) return NextResponse.json({ error: 'Missing user id' }, { status: 400 })

  if (authUser?.id === id) {
    return NextResponse.json({ error: 'You cannot delete your own admin account.' }, { status: 400 })
  }

  const target = await prisma.user.findUnique({ where: { id }, select: { id: true, role: true, email: true } })
  if (!target) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  await prisma.user.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
