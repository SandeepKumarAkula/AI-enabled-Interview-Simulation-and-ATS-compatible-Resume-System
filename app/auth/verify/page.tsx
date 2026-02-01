"use client"
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export default function VerifyPage() {
  const params = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle')
  const [message, setMessage] = useState('')
  const [resending, setResending] = useState(false)
  const [resendMessage, setResendMessage] = useState('')

  useEffect(() => {
    const token = params.get('token')
    const email = params.get('email')
    if (!token || !email) {
      setStatus('error')
      setMessage('Missing verification token or email.')
      return
    }

    async function verify() {
      setStatus('loading')
      try {
        const res = await fetch('/api/auth/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, email }) })
        const data = await res.json()
        if (res.ok) {
          setStatus('success')
          setMessage('Email verified! Redirecting to login...')
          setTimeout(() => router.push('/auth/login'), 2000)
        } else {
          setStatus('error')
          setMessage(data.error || 'Verification failed')
        }
      } catch (e) {
        setStatus('error')
        setMessage('Network error')
      }
    }

    verify()
  }, [params, router])

  async function resendVerification() {
    const email = params.get('email')
    if (!email) return
    
    setResending(true)
    setResendMessage('')
    try {
      const res = await fetch('/api/auth/resend-verification', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ email }) 
      })
      const data = await res.json()
      if (res.ok) {
        setResendMessage('✓ Verification email sent! Please check your inbox.')
      } else {
        setResendMessage(data.error || 'Failed to resend')
      }
    } catch (e) {
      setResendMessage('Network error')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Email Verification</h2>
        
        {status === 'loading' && (
          <div className="flex items-center gap-2 mb-4">
            <Loader2 className="h-4 w-4 animate-spin" />
            <p>Verifying your email...</p>
          </div>
        )}
        
        {status === 'success' && (
          <div className="text-emerald-600 mb-4">
            <p className="font-semibold">✓ {message}</p>
          </div>
        )}
        
        {status === 'error' && (
          <div>
            <p className="text-red-600 mb-4">{message}</p>
            <div className="space-y-3">
              <Button 
                onClick={resendVerification} 
                disabled={resending}
                className="w-full"
              >
                {resending ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Resending...</>
                ) : (
                  'Resend Verification Email'
                )}
              </Button>
              {resendMessage && (
                <p className={`text-sm ${resendMessage.includes('✓') ? 'text-emerald-600' : 'text-red-600'}`}>
                  {resendMessage}
                </p>
              )}
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => router.push('/auth/register')}>
                  Back to register
                </Button>
                <Link href="/auth/login" className="flex items-center justify-center flex-1 text-emerald-600 hover:underline">
                  Go to login
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
