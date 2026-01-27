"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { fetchWithAuth } from '@/lib/clientAuth'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isChecking, setIsChecking] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchWithAuth('/api/resumes').then(r => {
      if (!r.ok) router.push('/auth/login')
      else setIsChecking(false)
    }).catch(() => router.push('/auth/login'))
  }, [router])

  if (isChecking) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  return <>{children}</>
}
