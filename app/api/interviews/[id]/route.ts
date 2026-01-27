import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserFromToken } from "@/lib/auth"
import { getPresignedDownloadUrl } from "@/lib/s3"

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const user = await getUserFromToken(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await ctx.params
  if (!id) return NextResponse.json({ error: "Missing interview id" }, { status: 400 })

  const interview = await prisma.interview.findUnique({
    where: { id },
    include: { video: true, report: true },
  })
  if (!interview) return NextResponse.json({ error: "Interview not found" }, { status: 404 })

  if (interview.userId !== user.id && user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Only treat as completed if a real report exists.
  const hasReport = !!(interview.report?.fileUrl || interview.report?.content)
  if (!hasReport) return NextResponse.json({ error: "Report not available" }, { status: 404 })

  if (interview.video?.s3Key) {
    try {
      const signed = await getPresignedDownloadUrl(interview.video.s3Key, 60 * 10)
      return NextResponse.json({ interview: { ...interview, video: { ...interview.video, url: signed } } })
    } catch {
      // fall back to stored url
    }
  }

  return NextResponse.json({ interview })
}

export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const user = await getUserFromToken(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await ctx.params
  if (!id) return NextResponse.json({ error: "Missing interview id" }, { status: 400 })

  const interview = await prisma.interview.findUnique({ where: { id } })
  if (!interview) return NextResponse.json({ error: "Interview not found" }, { status: 404 })

  if (interview.userId !== user.id && user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await prisma.interview.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
