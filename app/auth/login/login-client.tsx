"use client"

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { fetchWithAuth } from '@/lib/clientAuth'

export default function LoginClient() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const search = useSearchParams()

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

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })
      const data = await res.json()

      if (res.ok) {
        // Tell header/nav to refresh its auth state.
        window.dispatchEvent(new Event('auth-changed'))

        const next = search.get('next')
        const safeNext = next && next.startsWith('/') && !next.startsWith('//') ? next : null
        // Temporary debug fallback: when running with NEXT_PUBLIC_DEBUG_SET_TOKEN_COOKIE=true
        // some hosting environments may prevent the HttpOnly cookie from being set correctly.
        // If enabled, and no `token` cookie exists, set a non-HttpOnly `token` cookie from
        // the returned token so client requests can proceed while we diagnose server cookie behavior.
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

        try {
          router.replace(safeNext || '/')
        } finally {
          // Ensure we don't leave the button stuck in loading state if navigation fails.
          setLoading(false)
        }
      } else {
        setMsg(data.error || 'Login failed')
        setLoading(false)
      }
    } catch (error: any) {
      console.error('Login error:', error)
      setMsg('Network error. Please try again.')
      setLoading(false)
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
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
              />
            </div>
            {msg && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{msg}</div>}
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
