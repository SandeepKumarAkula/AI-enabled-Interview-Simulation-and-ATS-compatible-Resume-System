"use client"

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, CheckCircle, Key } from 'lucide-react'
import { PasswordStrength } from '@/components/password-strength'
import { PasswordInput } from '@/components/password-input'
import { fetchWithAuth } from '@/lib/clientAuth'

type TokenState =
  | { status: 'checking' }
  | { status: 'valid' }
  | { status: 'invalid'; message: string }

export default function ResetClient() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [tokenState, setTokenState] = useState<TokenState>({ status: 'checking' })
  const search = useSearchParams()
  const router = useRouter()
  const token = search.get('token') || ''

  useEffect(() => {
    fetchWithAuth('/api/resumes').then(r => {
      if (r.ok) router.replace('/')
    }).catch(() => null)
  }, [router])

  useEffect(() => {
    let cancelled = false

    async function validateToken() {
      if (!token) {
        if (!cancelled) setTokenState({ status: 'invalid', message: 'Missing reset token. Please request a new link.' })
        return
      }
      if (!cancelled) setTokenState({ status: 'checking' })

      try {
        const res = await fetch(`/api/auth/reset-password?token=${encodeURIComponent(token)}`, {
          method: 'GET',
          cache: 'no-store',
        })
        const data = await res.json().catch(() => ({}))

        if (data?.ok) {
          if (!cancelled) setTokenState({ status: 'valid' })
          return
        }

        const reason = data?.reason
        const message =
          reason === 'used'
            ? 'This reset link was already used. Please request a new one.'
            : reason === 'expired'
              ? 'This reset link has expired (valid only for 60 minutes). Please request a new one.'
              : 'Invalid reset link. Please request a new one.'

        if (!cancelled) setTokenState({ status: 'invalid', message })
      } catch {
        if (!cancelled) setTokenState({ status: 'invalid', message: 'Could not validate reset link. Please try again.' })
      }
    }

    validateToken()

    const onPageShow = (e: PageTransitionEvent) => {
      // If restored from back/forward cache, revalidate so used tokens never show a valid form.
      if (e.persisted) validateToken()
    }
    window.addEventListener('pageshow', onPageShow)

    return () => {
      cancelled = true
      window.removeEventListener('pageshow', onPageShow)
    }
  }, [token])

  async function submit(e: any) {
    e.preventDefault()
    if (tokenState.status !== 'valid') {
      setMsg('Invalid or expired reset link')
      return
    }
    if (password !== confirmPassword) {
      setMsg('Passwords do not match')
      return
    }
    setLoading(true)
    setMsg('')

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, password }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })

      if (res.ok) {
        setSuccess(true)
        setMsg('Password reset successfully. This link can no longer be used.')
        // Replace history so back/forward won’t bring the token URL back.
        setTimeout(() => router.replace('/auth/login?reset=1'), 1500)
        return
      }

      const data = await res.json().catch(() => null)
      setMsg(data?.error || 'Invalid or expired reset link')
      setLoading(false)
    } catch (error: any) {
      console.error('Reset password network error:', error)
      setMsg('Network error. Please refresh and try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent">
            Set New Password
          </CardTitle>
          <CardDescription className="text-center">
            Choose a strong password for your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tokenState.status === 'checking' ? (
            <div className="flex items-center justify-center py-8 text-sm text-gray-600">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking reset link...
            </div>
          ) : tokenState.status === 'invalid' ? (
            <div className="space-y-4">
              <div className="text-sm text-red-600 bg-red-50 p-4 rounded-md">
                {tokenState.message}
              </div>
              <div className="flex gap-3">
                <Button asChild className="w-full bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-700 hover:to-sky-700">
                  <Link href="/auth/forgot">Request new link</Link>
                </Button>
              </div>
            </div>
          ) : !success ? (
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  New Password
                </label>
                <PasswordInput
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <PasswordStrength password={password} />
              </div>
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm Password
                </label>
                <PasswordInput
                  id="confirmPassword"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>
              {msg && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                  {msg}
                </div>
              )}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-700 hover:to-sky-700"
              >
                {loading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Resetting...</>
                ) : (
                  <><Key className="mr-2 h-4 w-4" /> Reset Password</>
                )}
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <div className="text-sm text-emerald-600 bg-emerald-50 p-4 rounded-md">
                {msg}
              </div>
              <p className="text-sm text-gray-600">
                Redirecting to login...
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/auth/login" className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline">
            Back to login
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
