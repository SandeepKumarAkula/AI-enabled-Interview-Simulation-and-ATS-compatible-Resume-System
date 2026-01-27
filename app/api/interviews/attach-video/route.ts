import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'
import { videoQueue } from '@/lib/worker'
import { getObjectUrl } from '@/lib/s3'

export async function POST(req: Request) {
  try {
    const user = await getUserFromToken(req)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { interviewId, key } = await req.json()
    if (!interviewId || !key) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const interview = await prisma.interview.findUnique({ where: { id: interviewId } })
    if (!interview) return NextResponse.json({ error: 'Interview not found' }, { status: 404 })
    if (interview.userId !== user.id && user.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const url = getObjectUrl(key)

    const video = await prisma.video.upsert({
      where: { interviewId },
      update: { s3Key: key, url },
      create: { interviewId, s3Key: key, url },
    })

    // enqueue processing job (best-effort)
    try {
      await videoQueue.add('process', { interviewId, s3Key: key, videoId: video.id })
    } catch {
      // ignore queue failures
    }

    return NextResponse.json({ ok: true, video })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Error' }, { status: 500 })
  }
}
