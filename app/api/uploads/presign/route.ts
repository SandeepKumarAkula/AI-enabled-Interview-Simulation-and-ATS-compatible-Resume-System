import { NextResponse } from 'next/server'
import { getPresignedUploadUrl, getObjectUrl } from '@/lib/s3'
import { getUserFromToken } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const user = await getUserFromToken(req)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { filename, contentType, type } = await req.json()
    if (!filename) return NextResponse.json({ error: 'Missing filename' }, { status: 400 })

    const ext = filename.split('.').pop() || ''
    const key = `${user.id}/${type || 'file'}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const url = await getPresignedUploadUrl(key, contentType || undefined)
    const publicUrl = getObjectUrl(key)

    return NextResponse.json({ uploadUrl: url, key, url: publicUrl })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Error' }, { status: 500 })
  }
}
