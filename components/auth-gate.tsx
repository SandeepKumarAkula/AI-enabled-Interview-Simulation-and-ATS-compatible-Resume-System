"use client"

import React, { useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { status } = useSession()
  const pathname = usePathname() || ''
  const router = useRouter()
  const modalRef = useRef<HTMLDivElement | null>(null)

  // Reload when login completes (client code dispatches this event after login)
  useEffect(() => {
    function handleAuthChanged() {
      // Hard reload to ensure server session cookies are read
      window.location.replace(window.location.href)
    }
    window.addEventListener('auth-changed', handleAuthChanged)
    return () => window.removeEventListener('auth-changed', handleAuthChanged)
  }, [])

  // Focus the modal so keyboard users can't interact with background
  useEffect(() => {
    if (modalRef.current) modalRef.current.focus()
  }, [status])

  // Show overlay on every page for unauthenticated users, but allow /auth/* pages
  const showModal = status !== 'authenticated' && !pathname.startsWith('/auth')

  return (
    <>
      {children}

      {showModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60" aria-hidden={false}>
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-modal-title"
            tabIndex={-1}
            className="mx-4 w-full max-w-lg rounded bg-white p-8 shadow-lg text-left outline-none"
            onKeyDown={(e) => {
              // Prevent Escape from doing anything (no close)
              if (e.key === 'Escape') {
                e.preventDefault()
                e.stopPropagation()
              }
            }}
          >
            <h2 id="auth-modal-title" className="mb-2 text-2xl font-semibold">Sign in to continue</h2>
            <p className="mb-6 text-sm text-slate-600">This site requires you to sign in or create an account to continue. Please sign in to access the page.</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => router.push('/auth/login')}
                className="inline-flex items-center justify-center rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Sign in
              </button>
              <button
                onClick={() => router.push('/auth/signup')}
                className="inline-flex items-center justify-center rounded border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Create account
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
