"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

/**
 * Client-side auth protection hook
 * Monitors authentication state and redirects if session becomes invalid
 * Use this on protected pages to prevent back-button access after logout
 */
export function useAuthProtection() {
  const { status, data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    // Redirect to login if not authenticated
    if (status === 'unauthenticated') {
      console.debug('useAuthProtection: Session lost, redirecting to login')
      window.location.href = '/auth/login'
    }
  }, [status, router])

  useEffect(() => {
    // Check authentication on page visibility change (tab switch/window focus)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Verify session is still valid
        fetch('/api/auth/session')
          .then(res => res.json())
          .then(data => {
            if (!data || !data.user) {
              console.debug('useAuthProtection: Session invalid on visibility change')
              window.location.href = '/auth/login'
            }
          })
          .catch(() => {
            console.debug('useAuthProtection: Session check failed')
            window.location.href = '/auth/login'
          })
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  useEffect(() => {
    // Check authentication on browser back/forward navigation
    const handlePopState = () => {
      console.debug('useAuthProtection: Navigation detected, verifying session')
      fetch('/api/auth/session')
        .then(res => res.json())
        .then(data => {
          if (!data || !data.user) {
            console.debug('useAuthProtection: Session invalid on navigation')
            window.location.href = '/auth/login'
          }
        })
        .catch(() => {
          console.debug('useAuthProtection: Session check failed on navigation')
          window.location.href = '/auth/login'
        })
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    // Listen for auth-changed events (from logout)
    const handleAuthChanged = () => {
      console.debug('useAuthProtection: Auth changed event received')
      // Check if logout flag is set
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          const loggedOut = window.localStorage.getItem('authLoggedOut')
          if (loggedOut) {
            console.debug('useAuthProtection: Logout detected, redirecting')
            window.location.href = '/auth/login'
          }
        }
      } catch (e) {
        console.error('useAuthProtection: Error checking logout flag', e)
      }
    }

    window.addEventListener('auth-changed', handleAuthChanged)
    return () => window.removeEventListener('auth-changed', handleAuthChanged)
  }, [])

  return { status, session }
}
