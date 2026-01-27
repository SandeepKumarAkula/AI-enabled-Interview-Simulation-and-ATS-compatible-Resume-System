import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserFromToken } from "@/lib/auth"

export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const user = await getUserFromToken(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await ctx.params
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  const item = await prisma.atsAnalysis.findUnique({ where: { id } })
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 })

  if (item.userId !== user.id && user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await prisma.atsAnalysis.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
