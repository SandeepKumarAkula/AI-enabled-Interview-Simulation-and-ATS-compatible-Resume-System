"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { fetchWithAuth } from '@/lib/clientAuth'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isChecking, setIsChecking] = useState(true)
  const router = useRouter()
  const { status } = useSession()

  useEffect(() => {
    // Wait until session status is known. Avoid redirecting while loading.
    if (status === 'loading') return

    if (status === 'unauthenticated') {
      router.push('/auth/login')
      return
    }

    // Authenticated: verify server access if needed
    fetchWithAuth('/api/resumes')
      .then(r => {
        if (!r.ok) router.push('/auth/login')
        else setIsChecking(false)
      })
      .catch(() => router.push('/auth/login'))
  }, [status, router])

  if (status === 'loading' || isChecking) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  return <>{children}</>
}