import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserFromToken } from "@/lib/auth"

export async function GET(req: Request) {
  const user = await getUserFromToken(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const items = await prisma.atsAnalysis.findMany({
    where: { userId: user.id },
    include: {
      resume: { select: { id: true, title: true } },
      resumeVersion: { select: { id: true, createdAt: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  })

  return NextResponse.json({ items })
}

export async function POST(req: Request) {
  const user = await getUserFromToken(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })

  const {
    score,
    analysis,
    jobDescription,
    resumeText,
    resumeId,
    resumeVersionId,
  } = body as {
    score: unknown
    analysis: unknown
    jobDescription?: unknown
    resumeText?: unknown
    resumeId?: unknown
    resumeVersionId?: unknown
  }

  if (typeof score !== "number" || Number.isNaN(score)) {
    return NextResponse.json({ error: "Missing or invalid score" }, { status: 400 })
  }

  if (analysis === undefined || analysis === null) {
    return NextResponse.json({ error: "Missing analysis" }, { status: 400 })
  }

  const analysisString = typeof analysis === "string" ? analysis : JSON.stringify(analysis)

  const created = await prisma.atsAnalysis.create({
    data: {
      userId: user.id,
      score: Math.round(score),
      analysis: analysisString,
      jobDescription: typeof jobDescription === "string" ? jobDescription : null,
      resumeText: typeof resumeText === "string" ? resumeText : null,
      resumeId: typeof resumeId === "string" ? resumeId : null,
      resumeVersionId: typeof resumeVersionId === "string" ? resumeVersionId : null,
    },
  })

  return NextResponse.json({ ok: true, id: created.id })
}
