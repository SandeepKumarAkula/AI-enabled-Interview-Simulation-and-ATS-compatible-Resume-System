"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, CheckCircle } from 'lucide-react'
import { PasswordStrength } from '@/components/password-strength'
import { fetchWithAuth } from '@/lib/clientAuth'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
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
    setSuccess(false)
    
    try {
      const res = await fetch('/api/auth/register', { 
        method: 'POST', 
        body: JSON.stringify({ email, password, name }), 
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      })
      const data = await res.json()
      
      if (res.ok) {
        setSuccess(true)
        setMsg('Account created! Please check your email to verify your account.')
        setTimeout(() => router.push('/auth/login'), 3000)
      } else {
        setMsg(data.error || 'Registration failed')
        setLoading(false)
      }
    } catch (error: any) {
      console.error('Registration error:', error)
      setMsg('Network error. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent">
            Create Account
          </CardTitle>
          <CardDescription className="text-center">
            Join AI²SARS to start your interview preparation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Full Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full"
              />
            </div>
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
                minLength={6}
                className="w-full"
              />
              <PasswordStrength password={password} />
            </div>
            {msg && (
              <div className={`text-sm p-3 rounded-md ${
                success ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'
              }`}>
                {success && <CheckCircle className="inline w-4 h-4 mr-2" />}
                {msg}
              </div>
            )}
            <Button type="submit" disabled={loading || success} className="w-full bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-700 hover:to-sky-700">
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...</>
              ) : success ? (
                'Redirecting to login...'
              ) : (
                'Create Account'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <div className="text-sm text-gray-600 text-center w-full">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
