"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Mail, ArrowLeft } from 'lucide-react'
import { fetchWithAuth } from '@/lib/clientAuth'
import { useRouter } from 'next/navigation'

export default function ForgotPage() {
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchWithAuth('/api/resumes').then(r => {
      if (r.ok) router.replace('/')
    }).catch(() => null)
  }, [router])

  async function submit(e: any) {
    e.preventDefault()
    setLoading(true)
    setMsg('')
    setSent(false)
    
    try {
      const res = await fetch('/api/auth/forgot-password', { 
        method: 'POST', 
        body: JSON.stringify({ email }), 
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      })
      
      if (res.ok) {
        setSent(true)
        setMsg('If your email exists, a reset link has been sent. Check your inbox and spam folder.')
      } else {
        const data = await res.json()
        setMsg(data.error || 'Unable to process request')
      }
    } catch (error: any) {
      console.error('Forgot password error:', error)
      setMsg('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent">
            Reset Password
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email to receive a password reset link
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!sent ? (
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email Address
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
              {msg && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                  {msg}
                </div>
              )}
              <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-700 hover:to-sky-700">
                {loading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>
                ) : (
                  <><Mail className="mr-2 h-4 w-4" /> Send Reset Link</>
                )}
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <Mail className="w-8 h-8 text-emerald-600" />
              </div>
              <div className="text-sm text-emerald-600 bg-emerald-50 p-4 rounded-md">
                {msg}
              </div>
              <p className="text-sm text-gray-600">
                Check your email inbox and spam folder for the reset link.
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/auth/login" className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline flex items-center">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to login
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
