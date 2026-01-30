import { NextResponse } from "next/server"

// ATS history endpoints have been disabled. Return 404 to indicate removal.

export async function GET() {
  return NextResponse.json({ error: "Not found" }, { status: 404 })
}

export async function POST() {
  return NextResponse.json({ error: "Not found" }, { status: 404 })
}
