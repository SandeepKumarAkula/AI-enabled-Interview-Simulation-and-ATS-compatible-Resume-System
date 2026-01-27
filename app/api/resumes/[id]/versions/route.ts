import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserFromToken } from "@/lib/auth"

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const user = await getUserFromToken(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await ctx.params
  if (!id) return NextResponse.json({ error: "Missing resume id" }, { status: 400 })

  const { fileUrl, data } = await req.json()
  if (!fileUrl && !data) return NextResponse.json({ error: "Missing fileUrl or data" }, { status: 400 })

  const resume = await prisma.resume.findUnique({ where: { id } })
  if (!resume) return NextResponse.json({ error: "Resume not found" }, { status: 404 })
  if (resume.userId !== user.id && user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const created = await prisma.resumeVersion.create({
    data: {
      resumeId: id,
      fileUrl: fileUrl || null,
      data: data || null,
    },
  })

  return NextResponse.json({ ok: true, versionId: created.id })
}
