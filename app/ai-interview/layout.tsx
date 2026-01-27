import type { ReactNode } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getUserFromToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export default async function AiInterviewLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  const nextPath = '/ai-interview'

  if (!token) {
    redirect(`/auth/login?next=${encodeURIComponent(nextPath)}`)
  }

  const user = await getUserFromToken(token)
  if (!user) {
    redirect(`/auth/login?next=${encodeURIComponent(nextPath)}`)
  }

  return <>{children}</>
}
