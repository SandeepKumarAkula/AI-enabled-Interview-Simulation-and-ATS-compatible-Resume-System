import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'
import { getObjectUrl, uploadObject } from '@/lib/s3'
import { getPresignedDownloadUrl } from '@/lib/s3'

export async function GET(req: Request) {
  const user = await getUserFromToken(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Only return completed interviews (report successfully saved).
  const interviews = await prisma.interview.findMany({
    where: {
      userId: user.id,
      report: {
        is: {
          OR: [{ fileUrl: { not: null } }, { content: { not: null } }],
        },
      },
    },
    include: { video: true, report: true },
    orderBy: { createdAt: 'desc' },
  })
  const interviewsWithSignedVideo = await Promise.all(
    interviews.map(async (i) => {
      if (i.video?.s3Key) {
        try {
          const signed = await getPresignedDownloadUrl(i.video.s3Key, 60 * 10)
          return { ...i, video: { ...i.video, url: signed } }
        } catch {
          return i
        }
      }
      return i
    }),
  )

  return NextResponse.json({ interviews: interviewsWithSignedVideo })
}

export async function POST(req: Request) {
  const user = await getUserFromToken(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { title, meta, reportContent, key } = await req.json()

  // Idempotency: if client retries with same meta, reuse existing interview.
  const existing = meta
    ? await prisma.interview.findFirst({ where: { userId: user.id, meta }, include: { report: true, video: true } })
    : null

  const interview = existing || (await prisma.interview.create({ data: { userId: user.id, title, meta } }))

  // If no report, just return the interview (not considered "completed" in GET).
  if (!reportContent && !key) {
    return NextResponse.json({ interview })
  }

  let fileUrl: string | null = null
  let content: string | null = null

  if (key) {
    fileUrl = getObjectUrl(key)
  }

  if (reportContent) {
    // Always persist in DB so we don't depend on S3.
    content = typeof reportContent === 'string' ? reportContent : JSON.stringify(reportContent)

    // Best-effort: also upload to S3 if configured.
    try {
      const fileKey = `reports/interview-${interview.id}-${Date.now()}.json`
      fileUrl = await uploadObject(fileKey, content, 'application/json')
    } catch {
      // Ignore S3 failures; DB content is the source of truth.
    }
  }

  const createdReport = await prisma.report.upsert({
    where: { interviewId: interview.id },
    update: {
      fileUrl,
      content,
      score: (reportContent as any)?.score || undefined,
      userId: user.id,
    },
    create: {
      interviewId: interview.id,
      fileUrl,
      content,
      score: (reportContent as any)?.score || undefined,
      userId: user.id,
    },
  })

  // Ensure relation is connected (safe even if already connected)
  await prisma.interview.update({
    where: { id: interview.id },
    data: { report: { connect: { id: createdReport.id } } },
  })

  return NextResponse.json({ interview: { ...interview, report: createdReport } })
}
