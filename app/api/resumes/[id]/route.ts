import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserFromToken } from "@/lib/auth"

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const user = await getUserFromToken(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await ctx.params
  if (!id) return NextResponse.json({ error: "Missing resume id" }, { status: 400 })

  const resume = await prisma.resume.findUnique({
    where: { id },
    include: { versions: { orderBy: { createdAt: "desc" } } },
  })
  if (!resume) return NextResponse.json({ error: "Resume not found" }, { status: 404 })

  if (resume.userId !== user.id && user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return NextResponse.json({ resume })
}

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const user = await getUserFromToken(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await ctx.params
  if (!id) return NextResponse.json({ error: "Missing resume id" }, { status: 400 })

  const resume = await prisma.resume.findUnique({ where: { id } })
  if (!resume) return NextResponse.json({ error: "Resume not found" }, { status: 404 })

  if (resume.userId !== user.id && user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { title, description } = await req.json().catch(() => ({}))
  if (!title && !description) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  const updated = await prisma.resume.update({
    where: { id },
    data: {
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
    },
  })

  return NextResponse.json({ ok: true, resume: updated })
}

export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const user = await getUserFromToken(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await ctx.params
  if (!id) return NextResponse.json({ error: "Missing resume id" }, { status: 400 })

  const resume = await prisma.resume.findUnique({ where: { id } })
  if (!resume) return NextResponse.json({ error: "Resume not found" }, { status: 404 })

  if (resume.userId !== user.id && user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await prisma.resume.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
