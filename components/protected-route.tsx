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

      // Authenticated: trust client session and allow rendering without immediate server redirect
      // We still attempt a background check to keep state accurate but do not force a redirect on transient failures.
      try {
        setIsChecking(false)
        // Background refresh for diagnostics — do not redirect from here to avoid UX jank
        fetchWithAuth('/api/resumes').then(r => {
          if (!r.ok) console.debug('protected-route: background auth check failed, will react on explicit auth-changed')
        }).catch(() => console.debug('protected-route: background auth check error'))
      } catch (e) {
        console.debug('protected-route: background auth check threw', e)
      }
    }

    maybeRedirect()
  }, [status, router, pathname])
    // On successful login (auth-changed), perform up to two reloads to ensure session hydration is available.
  useEffect(() => {
    function handleAuthChanged() {
      // On auth change, re-check server access and update local state without a full reload.
      fetchWithAuth('/api/resumes')
        .then(r => {
          if (r.ok) setIsChecking(false)
          else router.push(`/auth/login?next=${encodeURIComponent(pathname)}`)
        })
        .catch(() => router.push(`/auth/login?next=${encodeURIComponent(pathname)}`))
    }

    window.addEventListener('auth-changed', handleAuthChanged)
    return () => window.removeEventListener('auth-changed', handleAuthChanged)
  }, [router, pathname])

  if (status === 'loading' || isChecking) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  return <>{children}</>
}