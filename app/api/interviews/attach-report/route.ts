import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'
import { getObjectUrl, uploadObject } from '@/lib/s3'

export async function POST(req: Request) {
  try {
    const user = await getUserFromToken(req)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { interviewId, reportContent, key } = await req.json()
    if (!interviewId || (!reportContent && !key)) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const interview = await prisma.interview.findUnique({ where: { id: interviewId } })
    if (!interview) return NextResponse.json({ error: 'Interview not found' }, { status: 404 })
    if (interview.userId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let fileUrl = null
    let content: string | null = null
    if (key) {
      fileUrl = getObjectUrl(key)
    } else if (reportContent) {
      content = typeof reportContent === 'string' ? reportContent : JSON.stringify(reportContent)
      // Best-effort upload; DB content is the fallback.
      try {
        const fileKey = `reports/manual-${interviewId}-${Date.now()}.json`
        fileUrl = await uploadObject(fileKey, content, 'application/json')
      } catch {
        // ignore
      }
    }

    const reportUserId = user.role === 'ADMIN' ? interview.userId : user.id
    const created = await prisma.report.upsert({
      where: { interviewId },
      update: { fileUrl, content, score: reportContent?.score || undefined, userId: reportUserId },
      create: { interviewId, fileUrl, content, score: reportContent?.score || undefined, userId: reportUserId },
    })

    await prisma.interview.update({ where: { id: interviewId }, data: { report: { connect: { id: created.id } } } }).catch(() => null)

    return NextResponse.json({ ok: true, report: created })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Error' }, { status: 500 })
  }
}
