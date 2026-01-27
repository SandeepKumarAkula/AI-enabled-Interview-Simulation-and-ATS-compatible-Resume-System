import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserFromToken } from "@/lib/auth"

export async function DELETE(
  req: Request,
  ctx: { params: Promise<{ id: string; versionId: string }> }
) {
  const user = await getUserFromToken(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id, versionId } = await ctx.params
  if (!id || !versionId) return NextResponse.json({ error: "Missing fields" }, { status: 400 })

  const version = await prisma.resumeVersion.findUnique({ where: { id: versionId }, include: { resume: true } })
  if (!version || version.resumeId !== id) {
    return NextResponse.json({ error: "Resume version not found" }, { status: 404 })
  }

  if (version.resume.userId !== user.id && user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await prisma.resumeVersion.delete({ where: { id: versionId } })

  // Optional: if last version removed, delete the resume too to avoid empty shells
  const remaining = await prisma.resumeVersion.count({ where: { resumeId: id } })
  if (remaining === 0) {
    await prisma.resume.delete({ where: { id } }).catch(() => null)
  }

  return NextResponse.json({ ok: true })
}
