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
    async function handleAuthChanged() {
      // Re-check server auth; if ready, hide modal and reload the page
      const ready = await checkServerAuth()
      if (ready) {
        // Hard reload to ensure server session cookies are read
        window.location.replace(window.location.href)
      }
    }
    window.addEventListener('auth-changed', handleAuthChanged)
    return () => window.removeEventListener('auth-changed', handleAuthChanged)
  }, [checkServerAuth])

  // On mount, check server auth once so we don't rely only on next-auth status
  useEffect(() => {
    checkServerAuth()
  }, [checkServerAuth])

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

  // Show overlay on every page for unauthenticated users, but allow /auth/* pages
  const showModal = !(status === 'authenticated' || serverAuth === true) && !pathname.startsWith('/auth')

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
