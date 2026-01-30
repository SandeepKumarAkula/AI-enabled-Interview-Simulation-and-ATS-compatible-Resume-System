"use client"

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { fetchWithAuth } from '@/lib/clientAuth'


export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isChecking, setIsChecking] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const { status } = useSession()

  useEffect(() => {
    // Wait until session status is known. Avoid redirecting while loading.
    if (status === 'loading') return

    if (status === 'unauthenticated') {
      const pathname = usePathname()
      // Redirect to login and include next so we can return here after login
      router.push(`/auth/login?next=${encodeURIComponent(pathname)}`)
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
      const reloaded = window.localStorage.getItem('authReloaded')
      console.debug('protected-route: auth-changed received, authReloaded=', reloaded)
      if (reloaded === '1') {
        // Another component already triggered the refresh; clear the marker and skip
        try { window.localStorage.removeItem('authReloaded') } catch (e) {}
        return
      }
      // First refresh: mark and perform a soft refresh to hydrate session-dependent data
      try { window.localStorage.setItem('authReloaded', '1') } catch (e) {}
      console.debug('protected-route: refreshing router to ensure session hydration')
      router.refresh()
    }

    window.addEventListener('auth-changed', handleAuthChanged)
    return () => window.removeEventListener('auth-changed', handleAuthChanged)
  }, [router])

  if (status === 'loading' || isChecking) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  return <>{children}</>
}