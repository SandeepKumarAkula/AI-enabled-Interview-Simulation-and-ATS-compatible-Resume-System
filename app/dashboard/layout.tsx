import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getUserFromToken } from '@/lib/auth'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const token = (await cookies()).get('token')?.value
  const user = await getUserFromToken(token)
  if (!user) redirect('/auth/login')

  return <>{children}</>
}
