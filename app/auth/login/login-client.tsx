"use client"

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { PasswordInput } from '@/components/password-input'
import { fetchWithAuth } from '@/lib/clientAuth'

export default function LoginClient() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [showResend, setShowResend] = useState(false)
  const [resending, setResending] = useState(false)
  const router = useRouter()
  const search = useSearchParams()
  const pathname = usePathname()

  // If already logged in, redirect away.
  useEffect(() => {
    fetchWithAuth('/api/resumes')
      .then(r => {
        if (r.ok) router.replace('/')
      })
      .catch(() => null)
  }, [router])

  async function submit(e: any) {
    e.preventDefault()
    setLoading(true)
    setMsg('')
    setShowResend(false)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })
      const data = await res.json()

      if (res.ok) {
          // Store session expiry time for timeout monitoring
          if (data.sessionExpiry && typeof window !== 'undefined' && window.localStorage) {
            try {
              window.localStorage.setItem('sessionExpiry', String(data.sessionExpiry))
            } catch (e) {
              console.error('Failed to store session expiry:', e)
            }
          }

          const next = search.get('next') || search.get('redirect')
        const safeNext = next && next.startsWith('/') && !next.startsWith('//') ? next : null
        const currentPath = pathname || '/'
        // If login initiated from ATS or AI interview pages, do not redirect away; otherwise default to home
        const shouldStay = currentPath.startsWith('/ats') || currentPath.startsWith('/ai-interview')
        const defaultTarget = shouldStay ? currentPath : '/'

        // Temporary debug fallback for environments that don't set HttpOnly cookie
        try {
          const debugEnabled = process.env.NEXT_PUBLIC_DEBUG_SET_TOKEN_COOKIE === 'true'
          if (typeof window !== 'undefined' && debugEnabled) {
            const hasTokenCookie = document.cookie.split('; ').some(c => c.startsWith('token='))
            if (!hasTokenCookie && data?.token) {
              const maxAge = 60 * 60 * 24 * 30
              document.cookie = `token=${encodeURIComponent(data.token)}; path=/; max-age=${maxAge}`
              // eslint-disable-next-line no-console
              console.warn('DEBUG: set non-HttpOnly token cookie for troubleshooting')
            }
          }
        } catch (err) {
          // ignore
        }

        // Wait for the server session/cookie to become effective before navigating.
        // Poll `/api/resumes` (which requires auth) up to ~5 times with a short delay.
        const waitForAuthReady = async (tries = 5, delayMs = 500) => {
          for (let i = 0; i < tries; i++) {
            try {
              const ok = await fetchWithAuth('/api/resumes').then(r => r.ok).catch(() => false)
              if (ok) return true
            } catch (e) {
              // ignore
            }
            await new Promise(res => setTimeout(res, delayMs))
          }
          return false
        }

        try {
          const ready = await waitForAuthReady(6, 500)
          // Auth is confirmed; use hard redirect for reliability in production
          console.debug('login-client: auth confirmed, performing hard redirect to', safeNext || '/')
          
          const redirectUrl = safeNext || '/'
          if (typeof window !== 'undefined') {
            try {
              if (window.localStorage) {
                window.localStorage.setItem('justLoggedIn', String(Date.now()))
                window.localStorage.removeItem('authPending')
              }
            } catch (e) {
              // ignore
            }
            // Hard reload to ensure new cookie is picked up by layout
            window.location.href = redirectUrl
          } else {
            // Fallback for SSR
            router.replace(redirectUrl)
          }
          
          setLoading(false)
        } catch (e) {
          console.error('Auth readiness check failed', e)
          setMsg('Sign in succeeded but a follow-up check failed. Please refresh.')
        } finally {
          setLoading(false)
        }
      } else {
        // Check if error is email not verified
        if (res.status === 403 && data.error?.includes('not verified')) {
          setMsg(data.error)
          setShowResend(true)
        } else {
          setMsg(data.error || 'Login failed')
          setShowResend(false)
        }
        setLoading(false)
      }
    } catch (error: any) {
      console.error('Login error:', error)
      setMsg('Network error. Please try again.')
      setLoading(false)
    }
  }

  async function resendVerification() {
    if (!email) return
    setResending(true)
    try {
      const res = await fetch('/api/auth/resend-verification', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ email }) 
      })
      const data = await res.json()
      if (res.ok) {
        setMsg('✓ Verification email sent! Please check your inbox.')
        setShowResend(false)
      } else {
        setMsg(data.error || 'Failed to resend')
      }
    } catch (e) {
      setMsg('Network error')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center">Sign in to your AI²SARS account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <PasswordInput
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {msg && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{msg}</div>}
            {showResend && (
              <Button
                type="button"
                onClick={resendVerification}
                disabled={resending}
                variant="outline"
                className="w-full"
              >
                {resending ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Resending...</>
                ) : (
                  'Resend Verification Email'
                )}
              </Button>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-700 hover:to-sky-700"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Link href="/auth/forgot" className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline">
            Forgot password?
          </Link>
          <div className="text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
