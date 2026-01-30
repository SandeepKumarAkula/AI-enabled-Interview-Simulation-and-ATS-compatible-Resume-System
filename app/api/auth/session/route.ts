import { NextResponse } from 'next/server'
import { getUserFromToken } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const user = await getUserFromToken(request)
    if (!user) return NextResponse.json({})

    // Return a simple NextAuth-compatible session object
    const session = {
      user: {
        name: user.name || null,
        email: user.email || null,
        image: user.image || null,
      },
      expires: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
    }

    return NextResponse.json(session)
  } catch (e) {
    return NextResponse.json({}, { status: 200 })
  }
}
