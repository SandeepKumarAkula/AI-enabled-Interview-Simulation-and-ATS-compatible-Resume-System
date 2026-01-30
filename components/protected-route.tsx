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
    // On successful login (auth-changed), perform up to two reloads to ensure session hydration is available.
  useEffect(() => {
    function handleAuthChanged() {
      if (typeof window === 'undefined' || !window.localStorage) return
      const reloadCount = parseInt(window.localStorage.getItem('reloadCount') || '0', 10)
      console.debug('protected-route: auth-changed received, reloadCount=', reloadCount)
      if (reloadCount < 2) {
        window.localStorage.setItem('reloadCount', String(reloadCount + 1))
        console.debug('protected-route: reloading page to ensure session hydration')
        window.location.reload()
      } else {
        window.localStorage.removeItem('reloadCount')
      }
    }

    window.addEventListener('auth-changed', handleAuthChanged)
    return () => window.removeEventListener('auth-changed', handleAuthChanged)
  }, [])

  if (status === 'loading' || isChecking) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  return <>{children}</>
}