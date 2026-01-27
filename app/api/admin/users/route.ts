import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken, requireAdmin } from '@/lib/auth'

export async function GET(req: Request) {
  const authUser = await getUserFromToken(req)
  try {
    requireAdmin(authUser)
  } catch (e) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const users = await prisma.user.findMany({
    include: {
      resumes: { include: { versions: true } },
      interviews: { include: { video: true, report: true } },
      atsAnalyses: { orderBy: { createdAt: 'desc' } },
    },
    orderBy: { createdAt: 'desc' }
  })

  return NextResponse.json({ users, me: { id: authUser!.id } })
}
