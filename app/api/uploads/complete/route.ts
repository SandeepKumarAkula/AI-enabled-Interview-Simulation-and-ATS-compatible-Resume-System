import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'
import { getObjectUrl } from '@/lib/s3'

export async function POST(req: Request) {
  try {
    const user = await getUserFromToken(req)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { key, resumeId, title, data } = await req.json()
    if (!key) return NextResponse.json({ error: 'Missing key' }, { status: 400 })

    const fileUrl = getObjectUrl(key)

    let resume = null
    if (resumeId) {
      resume = await prisma.resume.findUnique({ where: { id: resumeId } })
      if (resume && resume.userId !== user.id && user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    if (!resume) {
      resume = await prisma.resume.create({ data: { userId: user.id, title: title || key } })
    }

    const version = await prisma.resumeVersion.create({ data: { resumeId: resume.id, fileUrl, data } })

    return NextResponse.json({ ok: true, resumeId: resume.id, versionId: version.id, fileUrl })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Error' }, { status: 500 })
  }
}
