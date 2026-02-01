import type { ReactNode } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getUserFromToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export default async function AiInterviewLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    redirect('/auth/login?next=%2Fai-interview')
  }

  try {
    const user = await getUserFromToken(token)
    if (!user) {
      redirect('/auth/login?next=%2Fai-interview')
    }
  } catch (error) {
    console.error('AI Interview Layout: Token validation error:', error)
    redirect('/auth/login?next=%2Fai-interview')
  }

  return <>{children}</>
}
