import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'

export async function GET(req: Request) {
  const user = await getUserFromToken(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const resumes = await prisma.resume.findMany({
    where: { userId: user.id },
    include: { versions: { orderBy: { createdAt: 'desc' } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ resumes })
}

export async function POST(req: Request) {
  const user = await getUserFromToken(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { title, description, fileUrl, data } = await req.json()
  if (!fileUrl && !data) return NextResponse.json({ error: 'Missing fileUrl or data' }, { status: 400 })

  const resume = await prisma.resume.create({ data: { userId: user.id, title, description } })
  await prisma.resumeVersion.create({ data: { resumeId: resume.id, fileUrl: fileUrl || null, data: data || null } })

  return NextResponse.json({ resumeId: resume.id })
}
