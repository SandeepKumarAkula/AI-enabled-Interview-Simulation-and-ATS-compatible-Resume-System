import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getUserFromToken, requireAdmin } from '@/lib/auth'
import AdminClientPage from './admin-client'

export default async function AdminPage() {
  const token = (await cookies()).get('token')?.value
  const user = await getUserFromToken(token)

  if (!user) redirect('/auth/login')

  try {
    requireAdmin(user)
  } catch {
    redirect('/dashboard/resumes')
  }

  return <AdminClientPage />
}
