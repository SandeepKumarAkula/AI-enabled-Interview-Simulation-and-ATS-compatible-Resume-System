import jwt from 'jsonwebtoken'
import { prisma } from './prisma'

function getJwtSecret(): string | null {
  const secret = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET
  if (secret) return secret

  if (process.env.NODE_ENV === 'production') {
    console.error('Auth misconfigured: NEXTAUTH_SECRET is not set')
    return null
  }

  // Dev fallback only.
  console.warn('NEXTAUTH_SECRET is not set; using an insecure dev fallback secret')
  return 'dev-insecure-secret'
}

function parseTokenFromRequestOrString(input?: Request | string) {
  if (!input) return null
  if (typeof input === 'string') {
    const t = input.replace(/^Bearer\s+/, '')
    return t || null
  }

  // it's a Request
  const authHeader = input.headers.get('authorization')
  if (authHeader) return authHeader.replace(/^Bearer\s+/, '')

  const cookie = input.headers.get('cookie') || ''
  const match = cookie.match(/(?:^|; )token=([^;]+)/)
  if (match) return decodeURIComponent(match[1])

  return null
}

export async function getUserFromToken(input?: Request | string) {
  const token = parseTokenFromRequestOrString(input)
  if (!token) return null
  try {
    const secret = getJwtSecret()
    if (!secret) return null
    const payload = jwt.verify(token, secret) as any
    const user = await prisma.user.findUnique({ where: { id: payload.sub } })
    return user
  } catch (e) {
    return null
  }
}

export function requireAdmin(user: any) {
  if (!user || user.role !== 'ADMIN') throw new Error('Unauthorized')
}
