"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { fetchWithAuth } from '@/lib/clientAuth'

// Force reload twice after login to work around session hydration issues
function useDoubleReload() {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const reloadCount = parseInt(window.localStorage.getItem('reloadCount') || '0', 10)
      if (reloadCount < 2) {
        window.localStorage.setItem('reloadCount', String(reloadCount + 1))
        window.location.reload()
      } else {
        window.localStorage.removeItem('reloadCount')
      }
    }
  }, [])
}

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
    // Reload-once workaround for session hydration issues
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const hasReloaded = window.localStorage.getItem('hasReloaded')
      if (!hasReloaded) {
        window.localStorage.setItem('hasReloaded', 'true')
        window.location.reload()
      }
    }
  }, [])
  useDoubleReload()

  if (status === 'loading' || isChecking) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  return <>{children}</>
}