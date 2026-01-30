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
    // Handle auth status transitions and avoid redirecting prematurely.
    async function maybeRedirect() {
      // Wait until session status is known. Avoid redirecting while loading.
      if (status === 'loading') return

      if (status === 'unauthenticated') {
        // If user just logged out, redirect immediately to login
        let authLoggedOut = null
        try { if (typeof window !== 'undefined' && window.localStorage) authLoggedOut = window.localStorage.getItem('authLoggedOut') } catch (e) {}
        if (authLoggedOut) {
          router.push(`/auth/login?next=${encodeURIComponent(pathname)}`)
          return
        }

        // Otherwise, give the client a chance to have cookies settle (if a login just occurred).
        let tries = 6
        try { if (typeof window !== 'undefined' && window.localStorage && window.localStorage.getItem('authPending')) tries = 30 } catch (e) {}

        for (let i = 0; i < tries; i++) {
          try {
            const ok = await fetchWithAuth('/api/resumes').then(r => r.ok).catch(() => false)
            if (ok) {
              // Server considers the user authenticated; continue without redirect
              setIsChecking(false)
              return
            }
          } catch (e) {
            // ignore and retry
          }
          await new Promise(res => setTimeout(res, 500))
        }

        // Still not authenticated -> redirect to login
        router.push(`/auth/login?next=${encodeURIComponent(pathname)}`)
        return
      }

      // Authenticated: verify server access if needed
      try {
        const r = await fetchWithAuth('/api/resumes')
        if (!r.ok) router.push('/auth/login')
        else setIsChecking(false)
      } catch (e) {
        router.push('/auth/login')
      }
    }

    maybeRedirect()
  }, [status, router, pathname])
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