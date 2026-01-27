import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken, requireAdmin } from '@/lib/auth'

function escapeCsv(value: any) {
  if (value == null) return ''
  const s = typeof value === 'string' ? value : JSON.stringify(value)
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return '"' + s.replace(/"/g, '""') + '"'
  }
  return s
}

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
      atsAnalyses: true,
    }
  })

  const headers = ['id', 'email', 'name', 'role', 'createdAt', 'resumeCount', 'interviewCount', 'atsAnalysisCount']
  const lines = [headers.join(',')]

  for (const u of users) {
    const row = [
      u.id,
      u.email,
      u.name,
      u.role,
      u.createdAt.toISOString(),
      u.resumes?.length || 0,
      u.interviews?.length || 0,
      (u as any).atsAnalyses?.length || 0,
    ]
    lines.push(row.map(escapeCsv).join(','))
  }

  return new NextResponse(lines.join('\n'), { headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="users.csv"' } })
}
