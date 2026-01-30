"use client"

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import { fetchWithAuth } from '@/lib/clientAuth'

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { status } = useSession()
  const pathname = usePathname() || ''
  const router = useRouter()
  const modalRef = useRef<HTMLDivElement | null>(null)
  const [serverAuth, setServerAuth] = useState<boolean | null>(null)
  const isReloadingRef = React.useRef(false)

  const checkServerAuth = useCallback(async () => {
    try {
      const ok = await fetchWithAuth('/api/resumes').then(r => r.ok).catch(() => false)
      setServerAuth(ok)
      return ok
    } catch (e) {
      setServerAuth(false)
      return false
    }
  }, [])

  // Reload when login completes (client code dispatches this event after login)
  useEffect(() => {
    async function checkWithRetries(tries = 6, delayMs = 500) {
      for (let i = 0; i < tries; i++) {
        console.debug('auth-gate: auth-changed check attempt', i + 1, 'of', tries)
        const ok = await checkServerAuth()
        if (ok) return true
        await new Promise(res => setTimeout(res, delayMs))
      }
      return false
    }

    async function handleAuthChanged() {
      // Re-check server auth with retries; if ready, hide modal and reload the page
      const ready = await checkWithRetries(8, 500)
      if (ready) {
        if (isReloadingRef.current) return
        isReloadingRef.current = true
        console.debug('auth-gate: server confirmed auth after auth-changed, refreshing router and updating state')
        try {
          setServerAuth(true)
          // Trigger server-side revalidation/data fetch without a full page reload
          router.refresh()
        } finally {
          // leave isReloadingRef set to avoid further reloads
        }
      } else {
        console.debug('auth-gate: server auth not yet available after auth-changed; starting background poll')
        // Start background poll that checks every 1s up to 15s
        let elapsed = 0
        const interval = setInterval(async () => {
          if (isReloadingRef.current) {
            clearInterval(interval)
            return
          }
          elapsed += 1000
          const ok = await checkServerAuth()
          if (ok) {
            clearInterval(interval)
            if (isReloadingRef.current) return
            isReloadingRef.current = true
            console.debug('auth-gate: server confirmed auth during background poll, refreshing router and updating state')
            try {
              setServerAuth(true)
              router.refresh()
            } finally {
              // leave isReloadingRef set to avoid further reloads
            }
          }
          if (elapsed >= 15000) {
            clearInterval(interval)
            console.debug('auth-gate: background poll ended without auth')
            setServerAuth(false)
          }
        }, 1000)
      }
    }
    window.addEventListener('auth-changed', handleAuthChanged)
    return () => window.removeEventListener('auth-changed', handleAuthChanged)
  }, [checkServerAuth])

  // On mount, check server auth once so we don't rely only on next-auth status
  useEffect(() => {
    checkServerAuth()
  }, [checkServerAuth])

  // While modal is visible, poll server periodically in case cookies are just being set
  useEffect(() => {
    let stop = false
    async function poll() {
      const shouldPoll = !(status === 'authenticated' || serverAuth === true) && !pathname.startsWith('/auth')
      if (!shouldPoll) return
      // If login recently happened client-side, be more aggressive
      const authPending = typeof window !== 'undefined' && window.localStorage && window.localStorage.getItem('authPending')
      let elapsed = 0
      const timeout = authPending ? 30000 : 15000
      while (!stop && elapsed < timeout) {
        await new Promise(res => setTimeout(res, 1000))
        const ok = await checkServerAuth()
        if (ok) {
          // Clear pending marker if present
          try { if (typeof window !== 'undefined' && window.localStorage) window.localStorage.removeItem('authPending') } catch (e) {}
          if (isReloadingRef.current) return
          isReloadingRef.current = true
          console.debug('auth-gate: server auth detected during modal poll, refreshing router and updating state')
          try {
            setServerAuth(true)
            router.refresh()
          } finally {
            // leave isReloadingRef set to avoid further reloads
          }
          return
        }
        elapsed += 1000
      }
      if (!stop) {
        console.debug('auth-gate: modal poll finished without detecting auth')
        setServerAuth(false)
      }
    }

    poll()
    return () => { stop = true }
  }, [status, serverAuth, pathname, checkServerAuth])

  // Focus the modal so keyboard users can't interact with background
  useEffect(() => {
    if (modalRef.current) modalRef.current.focus()
  }, [status, serverAuth])

  // Prevent body scroll while modal is open
  useEffect(() => {
    const showModal = !(status === 'authenticated' || serverAuth === true) && !pathname.startsWith('/auth')
    if (showModal) {
      const previous = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = previous
      }
    }
    return
  }, [status, pathname, serverAuth])

  // Only decide to show modal once we have at least one server check or next-auth status is resolved.
  const resolvedAuthState = status !== 'loading' || serverAuth !== null

  // Show overlay on every page for unauthenticated users, but allow /auth/* pages
  // Don't show immediately after an explicit logout to prevent a brief flash while the app navigates.
  let showModal = resolvedAuthState && !(status === 'authenticated' || serverAuth === true) && !pathname.startsWith('/auth')
  try {
    if (showModal && typeof window !== 'undefined' && window.localStorage) {
      const loggedOutAt = parseInt(window.localStorage.getItem('authLoggedOut') || '0', 10)
      // If the user logged out less than 2s ago, delay showing the modal to avoid a brief flash.
      if (loggedOutAt && Date.now() - loggedOutAt < 2000) showModal = false
    }
  } catch (e) {}

  return (
    <>
      {children}

      {showModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/70 p-4" aria-hidden={false}>
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-modal-title"
            tabIndex={-1}
            className="mx-4 w-full max-w-xl rounded-2xl bg-white p-8 shadow-2xl text-left ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800 outline-none"
            onKeyDown={(e) => {
              // Prevent Escape from doing anything (no close)
              if (e.key === 'Escape') {
                e.preventDefault()
                e.stopPropagation()
              }
            }}
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-600 to-sky-600 text-white text-lg font-bold">A</div>
              <div className="flex-1">
                <h2 id="auth-modal-title" className="mb-1 text-2xl font-semibold">Sign in to continue to <span className="text-emerald-600">AI²SARS</span></h2>
                <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">To keep your data private and provide a personalized experience, you must sign in or create an account. After signing in the page will reload automatically.</p>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:flex-row-reverse">
              <button
                onClick={() => router.push('/auth/login')}
                className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-emerald-600 to-sky-600 px-4 py-2 text-sm font-medium text-white shadow hover:from-emerald-700 hover:to-sky-700"
              >
                Sign in
              </button>

              <button
                onClick={() => router.push('/auth/register')}
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200"
              >
                Create account
              </button>
            </div>

            {serverAuth === false && (
              <div className="mt-4 text-sm text-slate-600">If you recently signed in and this message remains, try refreshing the page or signing in again.</div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
